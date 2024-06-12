import React, { memo, useEffect, useState } from "react";
import "../../styles/molecules/movieCard.css";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  arrayRemove,
  arrayUnion,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "../../lib/firebase";
import { PlaylistAdd, PlaylistAddCheckCircle, Star } from "@mui/icons-material";
import { showAlert } from "../../lib/showAlert";
import { useTheme } from "../../lib/ThemeProvider";
import { useUser } from "../../lib/UserProvider";
import { clacAverageScore } from "../../utils/calcAverageScore";

//ProfileからはmovieIdしか渡ってこないためtitleとposterPathはオプショナルチェーンになっている
type Props = {
  movieId: string;
  title?: string;
  posterPath?: string;
  isWantToWatch: boolean;
};

type MovieInfo = {
  title: string;
  posterPath: string;
};

export const MovieCard: React.FC<Props> = memo(
  ({ movieId, title, posterPath, isWantToWatch }) => {
    const BASE_POSTER_URL = "https://image.tmdb.org/t/p/w300";
    const { theme } = useTheme();
    const { currentUser } = useUser();
    const navigate = useNavigate();
    const [movieInfo, setMovieInfo] = useState<MovieInfo>({
      title: "",
      posterPath: "",
    });
    const [posts, setPosts] = useState<Array<{score:number}>>([]);
    const averageScore = clacAverageScore(posts);

    const toggleWantToWatch = async () => {
      if (isWantToWatch) {
        removeWantToWatchMovie();
      } else {
        addWantToWatchMovie();
      }
    };

    const removeWantToWatchMovie = async () => {
      try {
        const docSnap = await getDoc(
          doc(db, "wantToWatch", currentUser.userId)
        );
        if (docSnap.exists()) {
          await updateDoc(doc(db, "wantToWatch", currentUser.userId), {
            wantToWatchMovies: arrayRemove(movieId),
          });
        }
      } catch (error: any) {
        console.error(error.message);
        showAlert({ type: "error", message: "通信に失敗しました", theme });
      }
    };

    const addWantToWatchMovie = async () => {
      try {
        const docSnap = await getDoc(
          doc(db, "wantToWatch", currentUser.userId)
        );
        if (docSnap.exists()) {
          await updateDoc(doc(db, "wantToWatch", currentUser.userId), {
            wantToWatchMovies: arrayUnion(movieId),
          });
        } else {
          await setDoc(doc(db, "wantToWatch", currentUser.userId), {
            wantToWatchMovies: [movieId],
          });
        }
      } catch (error: any) {
        console.error(error.message);
        showAlert({ type: "error", message: "通信に失敗しました", theme });
      }
    };

    //NOTE:Firebaseは、フィールドのaverageを取得するクエリが有料のため、全てのpostsを取得しクライアントサイドで計算するものとする
    useEffect(() => {
      const fetchPosts = async () => {
        const q = query(
          collection(db, "posts"),
          where("movieId", "==", movieId)
        );
        try {
          const querySnapshot = await getDocs(q);
          const nextPosts: Array<{score:number}> = [];
          querySnapshot.forEach((doc) => {
            nextPosts.push({
              score: doc.data().score,
              // postId: doc.id,
              // comment: doc.data().comment,
              // movieId: doc.data().movieId,
              // timestamp: doc.data().timestamp,
              // userId: doc.data().userId,
            });
          });
          setPosts(nextPosts);
        } catch (error: any) {
          console.error(error.message);
          showAlert({
            type: "error",
            message: "投稿の読み込みに失敗しました",
            theme,
          });
        }
      };
      fetchPosts();
    }, [movieId]);

    //OPTIMIZE:Homeからは複数の情報を渡しているがProfileからはmoviIdしか渡せないため無駄な分岐が発生している
    useEffect(() => {
      if (!title || !posterPath) {
        const url = `https://api.themoviedb.org/3/movie/${movieId}?api_key=${
          import.meta.env.VITE_TMDB_API_KEY
        }&language=jp
      `;

        axios
          .get(url)
          .then((response) => {
            const movieDetails = response.data;
            setMovieInfo({
              title: movieDetails.title,
              posterPath: movieDetails.poster_path,
            });
          })
          .catch((error: any) => {
            showAlert({
              type: "error",
              message: "読み込みに失敗しました",
              theme,
            });
            console.error(error.message);
          });
      }
    }, [movieId]);

    return (
      <div className="movieCard">
        <Link to={`/movie/${movieId}`}>
          <div className="movieCard_cover">
            <div className="movieCard_thumbnail">
              <img
                src={`${BASE_POSTER_URL}${posterPath || movieInfo?.posterPath}`}
                alt="moviename"
              />
              <div className="movieCard_overlay"></div>
            </div>
            <p className="movieCard_title">{title || movieInfo?.title}</p>
          </div>
        </Link>
        <div className="movieCard_button-container">
          <div
            className="movieCard_button rating"
            onClick={() => navigate(`/movie/${movieId}`)}
          >
            <Star />
            <p className="movieCard_average-score">{averageScore}</p>
          </div>
          <div
            className="movieCard_button wish-list"
            onClick={toggleWantToWatch}
          >
            {isWantToWatch ? (
              <PlaylistAddCheckCircle className="movieCard_wish-icon" />
            ) : (
              <PlaylistAdd className="movieCard_not-wish-icon" />
            )}
          </div>
        </div>
      </div>
    );
  }
);
