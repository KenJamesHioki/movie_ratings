import axios from "axios";
import React, { useEffect, useState } from "react";
import { RatingPost } from "../../types/types";
import "../../styles/molecules/movieInfoContainer.css";
import { Rating } from "@mui/material";
import StarIcon from "@mui/icons-material/Star";
import { showAlert } from "../../lib/showAlert";
import { useTheme } from "../../lib/ThemeProvider";
import { clacAverageScore } from "../../utils/calcAverageScore";

type Props = {
  movieId: string;
  posts: Array<RatingPost>;
};

type MovieInfo = {
  title: string;
  releaseYear: string;
  overview: string;
  posterPath: string;
};

export const MovieInfoContainer: React.FC<Props> = ({ movieId, posts }) => {
  const BASE_POSTER_URL = "https://image.tmdb.org/t/p/w300";
  const {theme} = useTheme();
  const [movieInfo, setMovieInfo] = useState<MovieInfo>({
    title: "",
    releaseYear: "",
    overview: "",
    posterPath: "",
  });
  const averageScore = clacAverageScore(posts);

  useEffect(() => {
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
      .catch((error: any) => {
        showAlert({
          type: "error",
          message: "読み込みに失敗しました",
          theme,
        });
        console.error(error.message);
      });
  }, [movieId]);

  return (
    <div className="movieInfoCotainer">
      <div className="movieInfoCotainer_poster">
        <img
          src={`${BASE_POSTER_URL}${movieInfo.posterPath}`}
          alt={movieInfo.title}
        />
      </div>
      <div className="movieInfoCotainer_infos">
        <h2 className="movieInfoCotainer_title">
          {movieInfo.title} <span>({movieInfo.releaseYear})</span>
        </h2>
        <p className="movieInfoCotainer_score">
          {averageScore}{" "}
          <Rating
            precision={0.1}
            value={Number(averageScore)}
            emptyIcon={
              <StarIcon
                style={{ opacity: 0.5, color: "gray" }}
                fontSize="inherit"
              />
            }
            readOnly
          />
        </p>
        <p className="movieInfoCotainer_overview">{movieInfo.overview}</p>
      </div>
    </div>
  );
};