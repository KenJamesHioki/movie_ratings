import React, {
  ChangeEvent,
  memo,
  useContext,
  useEffect,
  useState,
} from "react";
import { PageWithHeader } from "../layout/PageWithHeader";
import { Post } from "../molecules/Post";
import "../../styles/pages/rating.css";
import { PrimaryButton } from "../atoms/PrimaryButton";
import { Textarea } from "../atoms/Textarea";
import { useNavigate, useParams } from "react-router-dom";
import { UserContext } from "../../lib/UserProvider";
import axios from "axios";
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

type MovieInfo = {
  title: string;
  releaseYear: string;
  overview: string;
  posterPath: string;
};

export const Rating: React.FC = memo(() => {
  const [movieInfo, setMovieInfo] = useState<MovieInfo>({
    title: "",
    releaseYear: "",
    overview: "",
    posterPath: "",
  });
  const [score, setScore] = useState<number>(0);
  const [comment, setComment] = useState("");
  const [posts, setPosts] = useState<Array<RatingPost> | null>([]);
  const [currentUserPost, setCurrentUserPost] = useState<
    RatingPost | null | undefined
  >(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { currentUser } = useContext(UserContext);
  const { movieId } = useParams();
  const navigate = useNavigate();
  const basePosterUrl = "https://image.tmdb.org/t/p/w300";
  const clacAverageScore = (posts: Array<RatingPost> | null) => {
    if (posts?.length === 0) {
      return "--";
    } else {
      const sum = posts?.reduce((acc, curr) => acc + curr.score, 0);
      return (sum / posts.length).toFixed(1);
    }
  };
  const averageScore = clacAverageScore(posts);

  const updatePosts = async () => {
    const q = query(
      collection(db, "posts"),
      where("movieId", "==", movieId),
      orderBy("timestamp")
    );
    const querySnapshot = await getDocs(q);
    const nextPosts: Array<RatingPost> = [];
    querySnapshot.forEach((doc) => {
      nextPosts.push({ postId: doc.id, ...doc.data() });
    });
    setPosts(nextPosts);
    setCurrentUserPost(
      nextPosts.find((post) => post.userId === currentUser.userId)
    );
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

    setIsLoading(true);
    const url = `https://api.themoviedb.org/3/movie/${movieId}?api_key=${
      import.meta.env.VITE_TMDB_API_KEY
    }&language=ja-JP
    `;

    axios
      .get(url)
      .then((response) => {
        const movieDetails = response.data;
        setMovieInfo({
          title: movieDetails.title,
          releaseYear: movieDetails.release_date.split("-")[0], //YYYY-MM-DD形式からYYYY形式に変換
          overview: movieDetails.overview,
          posterPath: movieDetails.poster_path,
        });
      })
      .catch((error: any) => console.error(error.message))
      .finally(() => setIsLoading(false));
  }, [movieId]);

  useEffect(() => {
    updatePosts();
  }, [movieId]);

  const handlePost = async (e: React.FormEvent<HTMLFormElement>) => {
    setIsLoading(true);
    e.preventDefault();
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

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    setIsLoading(true);
    e.preventDefault();
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

  return (
    <>
      <PageWithHeader>
        <div className="rating_wrapper">
          <div className="rating_movie-info-cotainer">
            <div className="rating_poster">
              <img
                src={`${basePosterUrl}${movieInfo.posterPath}`}
                alt={movieInfo.title}
              />
            </div>
            <div className="rating_infos">
              <h2 className="rating_title">
                {movieInfo.title} <span>({movieInfo.releaseYear})</span>
              </h2>
              <p className="rating_score">★ {averageScore}</p>
              <p className="rating_overview">{movieInfo.overview}</p>
            </div>
          </div>
          <form className="rating_post-form">
            <label htmlFor="score" className="rating_set-score">
              ★ {score}
              <input
                type="range"
                name="score"
                id="score"
                min={0}
                max={5}
                step={1}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setScore(Number(e.target.value))
                }
                value={score}
                disabled={currentUserPost && !isEditMode}
              />
            </label>
            <div className="rating_comment-and-button">
              <Textarea
                value={comment}
                disabled={currentUserPost && !isEditMode}
                onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
                  setComment(e.target.value)
                }
              />
              {!currentUserPost && (
                <PrimaryButton
                  key="post"
                  disabled={!comment}
                  onClick={handlePost}
                >
                  投稿
                </PrimaryButton>
              )}
              {currentUserPost && !isEditMode && (
                <PrimaryButton
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
                  <PrimaryButton key="save" onClick={handleSave}>
                    保存
                  </PrimaryButton>
                  <InvertedButton key="cancel" onClick={handleCancel}>
                    キャンセル
                  </InvertedButton>
                </>
              )}
            </div>
          </form>
          <div className="rating_comments">
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
          </div>
        </div>
      </PageWithHeader>
      {isLoading && <Loader />}
    </>
  );
});
