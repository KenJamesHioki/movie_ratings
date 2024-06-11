import React, { memo, useEffect, useState } from "react";
import "../../styles/molecules/movieCard.css";
import { Link } from "react-router-dom";
import axios from "axios";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  query,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "../../lib/firebase";
import { RatingPost } from "../../types/types";
import { PlaylistAdd, PlaylistAddCheckCircle, Star } from "@mui/icons-material";
import { showAlert } from "../../lib/showAlert";
import { useTheme } from "../../lib/ThemeProvider";
import { useUser } from "../../lib/UserProvider";
import { clacAverageScore } from "../../utils/calcAverageScore";

type Props = {
  movieId: string;
  title?: string;
  posterPath?: string;
};

type MovieInfo = {
  title: string;
  posterPath: string;
};

export const MovieCard: React.FC<Props> = memo(
  ({ movieId, title, posterPath }) => {
    const BASE_POSTER_URL = "https://image.tmdb.org/t/p/w300";
    const { theme } = useTheme();
    const { currentUser } = useUser();
    const [wantToWatchUsers, setWantToWatchUsers] = useState<Array<string>>([]);
    const [movieInfo, setMovieInfo] = useState<MovieInfo>({
      title: "",
      posterPath: "",
    });
    const [posts, setPosts] = useState<Array<RatingPost>>([]);
    const averageScore = clacAverageScore(posts);

    const toggleWantToWatch = async () => {
      let nextWantToWatchUsers: Array<string> = [];

      if (wantToWatchUsers.includes(currentUser.userId)) {
        nextWantToWatchUsers = wantToWatchUsers.filter(
          (user) => user !== currentUser.userId
        );
      } else {
        nextWantToWatchUsers = [...wantToWatchUsers, currentUser.userId];
      }

      postWantToWatchUsers(nextWantToWatchUsers);
    };

    const postWantToWatchUsers = async (wantToWatchUsers: Array<string>) => {
      try {
        const docSnap = await getDoc(doc(db, "movies", movieId));
        if (docSnap.exists()) {
          await updateDoc(doc(db, "movies", movieId), {
            wantToWatchUsers,
          });
        } else {
          await setDoc(doc(db, "movies", movieId), {
            wantToWatchUsers,
          });
        }
      } catch (error: any) {
        console.error(error.message);
        showAlert({ type: "error", message: "通信に失敗しました", theme });
      }
    };

    useEffect(() => {
      const unSub = onSnapshot(doc(db, "movies", movieId), (doc) => {
        if (doc.exists()) {
          setWantToWatchUsers(doc.data().wantToWatchUsers);
        }
      });

      return () => unSub();
    }, [movieId]);

    // useEffect(()=> {
    //   const fetchWantToWatchUsers = async () => {
    //     try {
    //       const docSnap = await getDoc(doc(db, "movies", movieId));
    //       if (docSnap.exists()) {
    //         setWantToWatchUsers(docSnap.data().wantToWatchUsers);
    //       }
    //     } catch (error: any) {
    //       console.error(error.message);
    //       showAlert({type: 'error', message: 'データの読み込みに失敗しました', theme});
    //     }
    //   };
    //   fetchWantToWatchUsers();
    // },[movieId])

    useEffect(() => {
      const fetchPosts = async () => {
        const q = query(
          collection(db, "posts"),
          where("movieId", "==", movieId)
        );
        try {
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
          <div className="movieCard_button rating">
            <Star />
            <p className="movieCard_average-score">{averageScore}</p>
          </div>
          <div
            className="movieCard_button wish-list"
            onClick={toggleWantToWatch}
          >
            {wantToWatchUsers.includes(currentUser.userId) ? (
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
