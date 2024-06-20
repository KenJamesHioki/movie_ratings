import React, { memo, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { PlaylistAdd, PlaylistAddCheckCircle, Star } from "@mui/icons-material";
import { useTheme } from "../../lib/ThemeProvider";
import { clacAverageScore } from "../../utils/calcAverageScore";
import { useToggleWantToWatch } from "../../hooks/useToggleWantToWatch";
import "../../styles/organisms/movieCard.css";
import { fetchPosts } from "../../utils/fetchPosts";
import { Loader } from "./Loader";
import { showAlert } from "../../lib/showAlert";

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
        <Link to={`/movie/${movieId}`}>
          <div className="movieCard_cover">
            <div className="movieCard_thumbnail">
              <img src={`${BASE_POSTER_URL}${posterPath}`} alt="moviename" />
              <div className="movieCard_overlay"></div>
            </div>
            <p className="movieCard_title">{title}</p>
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
            className="movieCard_button want-to-watch-list"
            onClick={() => toggleWantToWatch(movieId)}
          >
            {isWantToWatch ? (
              <PlaylistAddCheckCircle className="movieCard_want-to-watch-icon" />
            ) : (
              <PlaylistAdd className="movieCard_not-want-to-watch-icon" />
            )}
          </div>
        </div>
        {isLoading && <Loader size={40} />}
      </div>
    );
  }
);
