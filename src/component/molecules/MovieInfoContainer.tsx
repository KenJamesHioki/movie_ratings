import React from "react";
import { MovieInfo } from "../../types/types";
import "../../styles/molecules/movieInfoContainer.css";
import { Rating } from "@mui/material";
import StarIcon from "@mui/icons-material/Star";
import { PlaylistAdd, PlaylistAddCheckCircle } from "@mui/icons-material";
import { useWantToWatchMovieIds } from "../../hooks/useWantToWatchMovieIds";
import { useUser } from "../../lib/UserProvider";
import { useToggleWantToWatch } from "../../hooks/useToggleWantToWatch";

type Props = {
  movieInfo: MovieInfo;
  averageScore: string;
};

export const MovieInfoContainer: React.FC<Props> = ({
  movieInfo,
  averageScore,
}) => {
  const BASE_POSTER_URL = "https://image.tmdb.org/t/p/w300";
  const { currentUser } = useUser();
  const { toggleWantToWatch } = useToggleWantToWatch();
  const { wantToWatchMovieIds } = useWantToWatchMovieIds(currentUser.userId);

  return (
    <div className="movieInfoCotainer">
      <div className="movieInfoCotainer_poster-and-button">
        <img
          src={`${BASE_POSTER_URL}${movieInfo.posterPath}`}
          alt={movieInfo.title}
        />
        <div
          className="movieInfoCotainer_wish-list-button"
          onClick={() => {
            toggleWantToWatch(movieInfo.movieId);
          }}
        >
          {wantToWatchMovieIds.includes(movieInfo.movieId) ? (
            <PlaylistAddCheckCircle className="movieInfoCotainer_wish-icon" />
          ) : (
            <PlaylistAdd className="movieInfoCotainer_not-wish-icon" />
          )}
        </div>
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
