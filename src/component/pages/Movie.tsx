import React, {
  ChangeEvent,
  memo,
  useEffect,
  useState,
} from "react";
import { PageWithHeader } from "../layout/PageWithHeader";
import { Post } from "../molecules/Post";
import "../../styles/pages/movie.css";
import { PrimaryButton } from "../atoms/PrimaryButton";
import { Textarea } from "../atoms/Textarea";
import { useNavigate, useParams } from "react-router-dom";
import { useUser } from "../../lib/UserProvider";
import {
  addDoc,
  collection,
  doc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "../../lib/firebase";
import { Loader } from "../atoms/Loader";
import { RatingPost } from "../../types/types";
import { NoResultMessage } from "../atoms/NoResultMessage";
import { InvertedButton } from "../atoms/InvertedButton";
import { PostContainer } from "../layout/PostContainer";
import { MovieInfoContainer } from "../molecules/MovieInfoContainer";
import { Rating } from "@mui/material";
import StarIcon from '@mui/icons-material/Star';

export const Movie: React.FC = memo(() => {
  const { currentUser } = useUser();
  const { movieId } = useParams();
  const [score, setScore] = useState<number>(0);
  const [hoverScore, setHoverScore] = useState<number | null>(null);
  const [comment, setComment] = useState("");
  const [posts, setPosts] = useState<Array<RatingPost>>([]);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const currentUserPost = posts?.find(
    (post) => post.userId === currentUser.userId
  );
  const navigate = useNavigate();

  const updatePosts = async () => {
    const q = query(
      collection(db, "posts"),
      where("movieId", "==", movieId),
      orderBy("timestamp")
    );
    const querySnapshot = await getDocs(q);
    const nextPosts: Array<RatingPost> = [];
    querySnapshot.forEach((doc) => {
      nextPosts.push({
        postId: doc.id,
        comment: doc.data().comment,
        movieId: doc.data().movieId,
        score: doc.data().score,
        timestamp: doc.data().timestamp,
        userId: doc.data().userId,
      });
    });
    setPosts(nextPosts);
    setComment(
      nextPosts.find((post) => post.userId === currentUser.userId)?.comment ||
        ""
    );
    setScore(
      nextPosts.find((post) => post.userId === currentUser.userId)?.score || 0
    );
  };

  useEffect(() => {
    if (!currentUser.userId) {
      navigate("/");
    }
  }, [currentUser, navigate]);

  useEffect(() => {
    updatePosts();
  }, [movieId]);

  const handlePost = async () => {
    setIsLoading(true);
    try {
      await addDoc(collection(db, "posts"), {
        userId: currentUser.userId,
        score,
        comment,
        timestamp: serverTimestamp(),
        movieId,
      });
      updatePosts();
    } catch (error: any) {
      console.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      await updateDoc(doc(db, "posts", currentUserPost!.postId), {
        score,
        comment,
        timestamp: serverTimestamp(),
      });
      setIsEditMode(false);
      updatePosts();
    } catch (error: any) {
      console.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = async () => {
    setScore(currentUserPost!.score);
    setComment(currentUserPost!.comment);
    setIsEditMode(false);
  };

  const handleSubmit =(e: React.FormEvent<HTMLFormElement>)=>{
    e.preventDefault();
    if (isEditMode) {
      handleSave();
    } else if (!currentUserPost) {
      handlePost();
    }
  }


  return (
    <>
      <PageWithHeader>
        <div className="rating_wrapper">
          <MovieInfoContainer movieId={String(movieId)} posts={posts} />
          <form className="rating_post-form" onSubmit={handleSubmit}>
            <label htmlFor="score" className="rating_set-score">
              {hoverScore === null || hoverScore === -1 ? score : hoverScore}
              <Rating
                name="score"
                value={score}
                precision={1}
                onChange={(_e, newValue) =>
                  setScore(Number(newValue))
                }
                onChangeActive={(_e, newHover) =>
                  setHoverScore(Number(newHover))}
                readOnly={currentUserPost && !isEditMode}
                emptyIcon={<StarIcon style={{ opacity: 0.5, color:"gray" }} fontSize="inherit" />}
              />
            </label>
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
                <PrimaryButton
                  type="submit"
                  key="post"
                  disabled={!comment}
                  // onClick={handlePost}
                >
                  投稿
                </PrimaryButton>
              )}
              {currentUserPost && !isEditMode && (
                <PrimaryButton
                  type="button"
                  key="edit"
                  onClick={() => {
                    setIsEditMode(true);
                  }}
                >
                  編集
                </PrimaryButton>
              )}
              {isEditMode && (
                <>
                  <PrimaryButton 
                  type="submit" 
                  key="save" 
                  //onClick={handleSave}
                  >
                    保存
                  </PrimaryButton>
                  <InvertedButton type="button" key="cancel" onClick={handleCancel}>
                    キャンセル
                  </InvertedButton>
                </>
              )}
            </div>
          </form>
          <PostContainer>
            {posts?.length === 0 ? (
              <NoResultMessage>まだ投稿がありません</NoResultMessage>
            ) : (
              <>
                {posts?.map((post) => {
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
      {isLoading && <Loader />}
    </>
  );
});
