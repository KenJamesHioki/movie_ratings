import React, { memo } from "react";
import { MovieInfo } from "../../types/types";
import { Rating } from "@mui/material";
import StarIcon from "@mui/icons-material/Star";
import { PlaylistAdd, PlaylistAddCheckCircle } from "@mui/icons-material";
import { useWantToWatchMovieIds } from "../../hooks/useWantToWatchMovieIds";
import { useUser } from "../../lib/UserProvider";
import { useToggleWantToWatch } from "../../hooks/useToggleWantToWatch";
import "../../styles/organisms/movieDetail.css";

type Props = {
  movieInfo: MovieInfo;
  averageScore: string;
};

export const MovieDetail: React.FC<Props> = memo(
  ({ movieInfo, averageScore }) => {
    const BASE_POSTER_URL = "https://image.tmdb.org/t/p/w300";
    const { currentUser } = useUser();
    const { toggleWantToWatch } = useToggleWantToWatch();
    const { wantToWatchMovieIds } = useWantToWatchMovieIds(currentUser.userId);

    return (
      <div className="movieDetail">
        <div className="movieDetail__poster-button-container">
          <img
            className="movieDetail__poster"
            src={`${BASE_POSTER_URL}${movieInfo.posterPath}`}
            alt={movieInfo.title}
          />
          <div
            className="movieDetail__want-to-watch-button"
            onClick={() => {
              toggleWantToWatch(movieInfo.movieId);
            }}
          >
            {wantToWatchMovieIds.includes(movieInfo.movieId) ? (
              <PlaylistAddCheckCircle className="movieDetail__want-to-watch-icon_registered" />
            ) : (
              <PlaylistAdd className="movieDetail__want-to-watch-icon_unregistered" />
            )}
          </div>
        </div>
        <div className="movieDetail__infos">
          <h2 className="movieDetail__title">
            {movieInfo.title}{" "}
            <span className="movieDetail__release-year">
              ({movieInfo.releaseYear})
            </span>
          </h2>
          <p className="movieDetail__score">
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
          <p className="movieDetail__overview">{movieInfo.overview}</p>
        </div>
      </div>
    );
  }
);
