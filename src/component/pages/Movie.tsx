import React, { ChangeEvent, memo, useEffect, useState } from "react";
import { PageWithHeader } from "../templates/PageWithHeader";
import { Post } from "../organisms/Post";
import { PrimaryButton } from "../atoms/button/PrimaryButton";
import { Textarea } from "../atoms/input/Textarea";
import { useParams } from "react-router-dom";
import { useUser } from "../../lib/UserProvider";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { db } from "../../lib/firebase";
import { Loader } from "../atoms/Loader";
import { MovieInfo, RatingPost } from "../../types/types";
import { NoResultMessage } from "../atoms/NoResultMessage";
import { InvertedButton } from "../atoms/button/InvertedButton";
import { PostContainer } from "../templates/PostContainer";
import { MovieInfoContainer } from "../organisms/MovieInfoContainer";
import { Rating } from "@mui/material";
import StarIcon from "@mui/icons-material/Star";
import { showAlert } from "../../lib/showAlert";
import { useTheme } from "../../lib/ThemeProvider";
import { clacAverageScore } from "../../utils/calcAverageScore";
import "../../styles/pages/movie.css";
import { fetchMovieInfo } from "../../utils/fetchMovieInfo";
import { fetchPosts } from "../../utils/fetchPosts";

export const Movie: React.FC = memo(() => {
  const { currentUser } = useUser();
  const { paramMovieId = "" } = useParams();
  const { theme } = useTheme();
  const [score, setScore] = useState<number>(0);
  const [hoverScore, setHoverScore] = useState<number | null>(null);
  const [comment, setComment] = useState("");
  const [posts, setPosts] = useState<Array<RatingPost>>([]);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [movieInfos, setMovieInfos] = useState<MovieInfo>({
    movieId: "",
    title: "",
    releaseYear: "",
    overview: "",
    posterPath: "",
  });
  const currentUserPost = posts.find(
    (post) => post.userId === currentUser.userId
  );
  const averageScore = clacAverageScore(posts);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isEditMode) {
      handleSaveChanges();
    } else if (!currentUserPost) {
      handleSubmitNewPost();
    }
  };

  const handleSubmitNewPost = async () => {
    setIsLoading(true);
    try {
      await addDoc(collection(db, "posts"), {
        userId: currentUser.userId,
        score,
        comment,
        timestamp: serverTimestamp(),
        movieId: paramMovieId,
      });
      showAlert({ type: "success", message: "投稿されました", theme });
      const nextPosts = await fetchPosts(paramMovieId, setIsLoading, theme);
      setPosts(nextPosts);
    } catch (error: any) {
      console.error(error.message);
      showAlert({ type: "error", message: "投稿に失敗しました", theme });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveChanges = async () => {
    setIsLoading(true);
    try {
      await updateDoc(doc(db, "posts", currentUserPost!.postId), {
        score,
        comment,
        timestamp: serverTimestamp(),
      });
      setIsEditMode(false);
      showAlert({
        type: "success",
        message: "投稿内容が更新されました",
        theme,
      });
      const nextPosts = await fetchPosts(paramMovieId, setIsLoading, theme);
      setPosts(nextPosts);
    } catch (error: any) {
      console.error(error.message);
      showAlert({ type: "error", message: "保存に失敗しました", theme });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelEdit = async () => {
    setScore(currentUserPost!.score);
    setComment(currentUserPost!.comment);
    setIsEditMode(false);
  };

  const handleDelete = async () => {
    setIsLoading(true);
    try {
      if (confirm("本当に削除してもよろしいですか？")) {        
        await deleteDoc(doc(db, "posts", currentUserPost!.postId));
        showAlert({
          type: "success",
          message: "投稿内容が削除されました",
          theme,
        });
        const nextPosts = await fetchPosts(paramMovieId, setIsLoading, theme);
        setPosts(nextPosts);
      } else {
        return;
      }
    } catch (error: any) {
      console.error(error.message);
      showAlert({
        type: "error",
        message: "予期せぬエラーが発生しました",
        theme,
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts(paramMovieId, setIsLoading, theme).then((response) =>
      setPosts(response)
    );
  }, [paramMovieId]);

  useEffect(() => {
    fetchMovieInfo(paramMovieId, setIsLoading, theme).then((response) =>
      setMovieInfos(response)
    );
  }, [paramMovieId]);

  useEffect(() => {
    if (currentUserPost) {
      setComment(currentUserPost.comment);
      setScore(currentUserPost.score);
    } else {
      setComment("");
      setScore(0);
    }
  }, [currentUserPost]);

  if (isLoading) {
    return (
      <PageWithHeader>
        <Loader size={60} />
      </PageWithHeader>
    );
  }

  if (movieInfos.movieId === "") {
    return (
      <PageWithHeader>
        <NoResultMessage>該当する映画が見つかりませんでした</NoResultMessage>
      </PageWithHeader>
    );
  }

  return (
    <PageWithHeader>
      <div className="rating_wrapper">
        <MovieInfoContainer
          movieInfo={movieInfos}
          averageScore={averageScore}
        />
        <form className="rating_post-form" onSubmit={handleSubmit}>
          <div className="rating_set-score">
            {hoverScore === null || hoverScore === -1 ? score : hoverScore}
            <Rating
              name="score"
              value={score}
              precision={1}
              onChange={(_e, newValue) => setScore(Number(newValue))}
              onChangeActive={(_e, newHover) => setHoverScore(Number(newHover))}
              readOnly={currentUserPost && !isEditMode}
              emptyIcon={
                <StarIcon
                  style={{ opacity: 0.5, color: "gray" }}
                  fontSize="inherit"
                />
              }
            />
          </div>
          <div className="rating_comment-and-button">
            <Textarea
              value={comment}
              disabled={currentUserPost && !isEditMode}
              onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
                setComment(e.target.value)
              }
              placeholder="コメントを入力"
            />
            {!currentUserPost && (
              <PrimaryButton type="submit" key="post" disabled={!comment}>
                投稿
              </PrimaryButton>
            )}
            {currentUserPost && !isEditMode && (
              <>
                <PrimaryButton
                  type="button"
                  key="edit"
                  onClick={() => {
                    setIsEditMode(true);
                  }}
                >
                  編集
                </PrimaryButton>
                <InvertedButton
                  type="button"
                  key="delete"
                  style={{ color: "red", borderColor: "red" }}
                  onClick={handleDelete}
                >
                  削除
                </InvertedButton>
              </>
            )}
            {isEditMode && (
              <>
                <PrimaryButton type="submit" key="save">
                  保存
                </PrimaryButton>
                <InvertedButton
                  type="button"
                  key="cancel"
                  onClick={handleCancelEdit}
                >
                  キャンセル
                </InvertedButton>
              </>
            )}
          </div>
        </form>
        <PostContainer>
          {posts.length === 0 ? (
            <NoResultMessage>まだ投稿がありません</NoResultMessage>
          ) : (
            <>
              {posts.map((post) => {
                if (currentUser.userId === post.userId) {
                  return;
                } else {
                  return (
                    <Post
                      key={post.postId}
                      userId={post.userId}
                      score={post.score}
                      comment={post.comment}
                    />
                  );
                }
              })}
            </>
          )}
        </PostContainer>
      </div>
    </PageWithHeader>
  );
});
