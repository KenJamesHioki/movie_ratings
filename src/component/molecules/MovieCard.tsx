import React, { memo, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { PlaylistAdd, PlaylistAddCheckCircle, Star } from "@mui/icons-material";
import { useTheme } from "../../lib/ThemeProvider";
import { clacAverageScore } from "../../utils/calcAverageScore";
import { useToggleWantToWatch } from "../../hooks/useToggleWantToWatch";
import { fetchPosts } from "../../utils/fetchPosts";
import { Loader } from "../atoms/Loader";
import { showAlert } from "../../lib/showAlert";
import "../../styles/molecules/movieCard.css";

type Props = {
  movieId: string;
  title: string;
  posterPath: string;
  isWantToWatch: boolean;
};

export const MovieCard: React.FC<Props> = memo(
  ({ movieId, title, posterPath, isWantToWatch }) => {
    const BASE_POSTER_URL = "https://image.tmdb.org/t/p/w300";
    const { theme } = useTheme();
    const { toggleWantToWatch } = useToggleWantToWatch();
    const navigate = useNavigate();
    const [scores, setScores] = useState<Array<{ score: number }>>([]);
    const [isLoading, setIsLoading] = useState(false);
    const averageScore = clacAverageScore(scores);

    //NOTE:Firebaseは、フィールドのaverageを取得するクエリが有料のため、全てのpostsを取得しクライアントサイドで計算するものとする
    useEffect(() => {
      setIsLoading(true);
      fetchPosts(movieId)
        .then((response) => {
          const postScores = response.map((post) => ({ score: post.score }));
          setScores(postScores);
        })
        .catch((error: any) => {
          showAlert({
            type: "error",
            message: error.message,
            theme,
          });
          return [];
        })
        .finally(() => setIsLoading(false));
    }, [movieId]);

    return (
      <div className="movieCard">
        <Link className="movieCard__link" to={`/movie/${movieId}`}>
          <div className="movieCard__cover">
            <div className="movieCard__thumbnail-container">
              <img className="movieCard__thumbnail" src={`${BASE_POSTER_URL}${posterPath}`} alt="moviename" />
              <div className="movieCard__overlay"></div>
            </div>
            <p className="movieCard__title">{title}</p>
          </div>
        </Link>
        <div className="movieCard__button-container">
          <div
            className="movieCard__button movieCard__button_rating"
            onClick={() => navigate(`/movie/${movieId}`)}
          >
            <Star className="movieCard__rating-icon" />
            <p className="movieCard_average-score">{averageScore}</p>
          </div>
          <div
            className="movieCard__button movieCard__button_want-to-watch"
            onClick={() => toggleWantToWatch(movieId)}
          >
            {isWantToWatch ? (
              <PlaylistAddCheckCircle className="movieCard__want-to-watch-icon_registered" />
            ) : (
              <PlaylistAdd className="movieCard__want-to-watch-icon_unregistered" />
            )}
          </div>
        </div>
        {isLoading && <Loader size={40} />}
      </div>
    );
  }
);
