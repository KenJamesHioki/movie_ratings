import React, { memo, useEffect, useState } from "react";
import "../../styles/molecules/movieCard.css";
import { Link } from "react-router-dom";
import axios from "axios";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../lib/firebase";
import { RatingPost } from "../../types/types";
import { PlaylistAdd, Star } from "@mui/icons-material";

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
      <div className="movieCard">
        <Link to={`/movie/${movieId}`}>
          <div className="movieCard_cover">
            <div className="movieCard_thumbnail">
              <img
                src={`${basePosterUrl}${posterPath || movieInfo?.posterPath}`}
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
          <div className="movieCard_button wish-list">
            <PlaylistAdd/>
          </div>
        </div>
        {/* <p className="movieCard_rating">
          {averageScore}{" "}
          <Rating
            precision={0.1}
            value={Number(averageScore)}
            readOnly
            size="small"
            emptyIcon={<StarIcon style={{ opacity: 0.5, color:"gray" }} fontSize="inherit" />}
          />
        </p> */}
      </div>
    );
  }
);
