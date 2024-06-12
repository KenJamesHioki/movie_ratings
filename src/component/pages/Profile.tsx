import React, { useEffect, useState } from "react";
import { PageWithHeader } from "../layout/PageWithHeader";
import { useUser } from "../../lib/UserProvider";
import { MovieCard } from "../molecules/MovieCard";
import "../../styles/pages/profile.css";
import { useLocation, useParams } from "react-router-dom";
import { MovieContainer } from "../layout/MovieContainer";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../lib/firebase";
import { Loader } from "../atoms/Loader";
import { NoResultMessage } from "../atoms/NoResultMessage";
import { ProfileContainer } from "../molecules/ProfileContainer";
import { showAlert } from "../../lib/showAlert";
import { PlaylistAddCheckCircle, Visibility } from "@mui/icons-material";
import { useWantToWatchMovies } from "../../hooks/useWantToWatchMovies";

type ButtonKey = "watched" | "wantToWatch";

export const Profile: React.FC = () => {
  const { currentUser } = useUser();
  const { paramUserId } = useParams();
  const { wantToWatchMovies } = useWantToWatchMovies(paramUserId || currentUser.userId);
  const [watchedMovies, setWatchedMovies] = useState<Array<string>>([]);
  const [selectedButton, setSelectedButton] = useState<ButtonKey>("watched");
  const [isLoading, setIsLoading] = useState(false);
  const location = useLocation();

  const handleClick = (key: ButtonKey) => {
    setSelectedButton(key);
  };

  useEffect(() => {
    if (location.state) {
      showAlert(location.state);
    }
  }, [location]);

  useEffect(() => {
    setIsLoading(true);
    const q = query(
      collection(db, "posts"),
      where("userId", "==", paramUserId ? paramUserId : currentUser.userId)
    );
    const fetchWatchedMovies = async () => {
      try {
        const querySnapshot = await getDocs(q);
        const nextWatchedMovies: Array<string> = [];
        querySnapshot.forEach((doc) => {
          nextWatchedMovies.push(doc.data().movieId);
        });
        setWatchedMovies(nextWatchedMovies);
      } catch (error: any) {
        console.error(error.meesage);
      } finally {
        setIsLoading(false);
      }
    };

    fetchWatchedMovies();
  }, [paramUserId, currentUser]);

  return (
    <>
      <PageWithHeader>
        <div className="profile_wrapper">
          <ProfileContainer
            numWatched={watchedMovies?.length}
            otherUserId={paramUserId}
          />
        </div>
        <div className="profile_button-container">
          <div
            onClick={() => handleClick("watched")}
            className={`profile_watched-movies button ${
              selectedButton === "watched" && "selected"
            }`}
          >
            <Visibility />
            <p>{watchedMovies.length}</p>
          </div>
          <div
            onClick={() => handleClick("wantToWatch")}
            className={`profile_watched-movies button ${
              selectedButton === "wantToWatch" && "selected"
            }`}
          >
            <PlaylistAddCheckCircle />
            <p>{wantToWatchMovies.length}</p>
          </div>
        </div>
        <div className="profile_wrapper">
          {selectedButton === "watched" && watchedMovies.length === 0 ? (
            <NoResultMessage>視聴した映画がありません</NoResultMessage>
          ) : (
            <></>
          )}
          {selectedButton === "wantToWatch" &&
          wantToWatchMovies.length === 0 ? (
            <NoResultMessage>登録した映画がありません</NoResultMessage>
          ) : (
            <></>
          )}
          <MovieContainer>
            {(selectedButton === "watched"
              ? watchedMovies
              : wantToWatchMovies
            ).map((movie) => (
              <MovieCard key={movie} isWantToWatch={wantToWatchMovies.includes(movie)} movieId={movie} />
            ))}
          </MovieContainer>
        </div>
      </PageWithHeader>
      {isLoading && <Loader />}
    </>
  );
};
