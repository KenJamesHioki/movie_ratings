import React, { memo, useContext, useEffect, useState } from "react";
import "../../styles/molecules/movieCard.css";
import { Link } from "react-router-dom";
import axios from "axios";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../lib/firebase";
import { Post, RatingPost } from "../../types/types";

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
    const basePosterUrl = "https://image.tmdb.org/t/p/w300";
    const [movieInfo, setMovieInfo] = useState<MovieInfo>();
    const [posts, setPosts] = useState<Array<RatingPost> | null>([]);
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
      const q = query(collection(db, "posts"), where("movieId", "==", movieId));
      const querySnapshot = await getDocs(q);

      const nextPosts: Array<RatingPost> = [];
      querySnapshot.forEach((doc) => {
        nextPosts.push({ postId: doc.id, ...doc.data() });
      });
      setPosts(nextPosts);
    };

    useEffect(() => {
      updatePosts();
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
          .catch((error: any) => console.error(error.message));
      }
    }, [movieId]);

    return (
      <div className="movie">
        <Link to={`/movie/${movieId}`}>
          <div className="movie_cover">
            <div className="movie_thumbnail">
              <img
                src={`${basePosterUrl}${posterPath || movieInfo?.posterPath}`}
                alt="moviename"
              />
              <div className="movie_overlay"></div>
            </div>
            <p className="movie_title">{title || movieInfo?.title}</p>
          </div>
        </Link>
        <p className="movie_rating">★ {averageScore}</p>
      </div>
    );
  }
);
