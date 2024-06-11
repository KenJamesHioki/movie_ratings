import React, { useEffect, useMemo, useState } from "react";
import { PageWithHeader } from "../layout/PageWithHeader";
import { useUser } from "../../lib/UserProvider";
import { MovieCard } from "../molecules/MovieCard";
import "../../styles/pages/profile.css";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { MovieContainer } from "../layout/MovieContainer";
import {
  collection,
  query,
  where,
} from "firebase/firestore";
import { db } from "../../lib/firebase";
import { Loader } from "../atoms/Loader";
import { NoResultMessage } from "../atoms/NoResultMessage";
import { ProfileContainer } from "../molecules/ProfileContainer";
import { showAlert } from "../../lib/showAlert";
import { PlaylistAddCheckCircle, Visibility } from "@mui/icons-material";
import { useMovieList } from "../../hooks/useMovieList";

// type MovieId = string;
type ButtonKey = "watched" | "wantToWatch";

export const Profile: React.FC = () => {
  const { currentUser } = useUser();
  const { paramUserId } = useParams();
  // const [watchedMovies, setWatchedMovies] = useState<Array<MovieId>>([]);
  // const [wantToWatchMovies, setWantToWatchMovies] = useState<Array<MovieId>>(
  //   []
  // );
  const [selectedButton, setSelectedButton] = useState<ButtonKey>("watched");
  // const [isLoading, setIsLoading] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const queryWantToWatch = useMemo(()=> {
    return query(
    collection(db, "movies"),
    where(
      "wantToWatchUsers",
      "array-contains",
      paramUserId ? paramUserId : currentUser.userId
    )
  )},[paramUserId,currentUser])

  const queryWatched = useMemo(()=> {
    return query(
    collection(db, "posts"),
    where("userId", "==", paramUserId ? paramUserId : currentUser.userId)
  )},[paramUserId, currentUser])

  const { isLoading: wantToWatchIsLoading, movieList: wantToWatchMovies } =
    useMovieList("wantToWatch", queryWantToWatch);

  const { isLoading: watchedIsLoading, movieList: watchedMovies } =
    useMovieList("watched", queryWatched);

  const handleClick = (key: ButtonKey) => {
    setSelectedButton(key);
  };

  useEffect(() => {
    if (!currentUser.userId) {
      navigate("/");
    }
  }, [currentUser]);

  useEffect(() => {
    if (location.state) {
      showAlert(location.state);
    }
  }, [location]);

  // console.log(watchedIsLoading);
  

  // useEffect(() => {
  //   setIsLoading(true);
  //   const q = query(
  //     collection(db, "posts"),
  //     where("userId", "==", paramUserId ? paramUserId : currentUser.userId)
  //   );
  //   const fetchWatchedMovies = async () => {
  //     try {
  //       const querySnapshot = await getDocs(q);
  //       const nextWatchedMovies: Array<MovieId> = [];
  //       querySnapshot.forEach((doc) => {
  //         nextWatchedMovies.push(doc.data().movieId);
  //       });
  //       setWatchedMovies(nextWatchedMovies);
  //     } catch (error: any) {
  //       console.error(error.meesage);
  //     } finally {
  //       setIsLoading(false);
  //     }
  //   };

  //   fetchWatchedMovies();
  // }, [paramUserId, currentUser]);

  // useEffect(() => {
  //   setIsLoading(true);
  //   const q = query(
  //     collection(db, "movies"),
  //     where(
  //       "wantToWatchUsers",
  //       "array-contains",
  //       paramUserId ? paramUserId : currentUser.userId
  //     )
  //   );

  //   const unSub = onSnapshot(q, (querySnapshot) => {
  //     const nextWantToWatchMovies: Array<MovieId> = [];
  //     querySnapshot.forEach((doc) => {
  //       nextWantToWatchMovies.push(doc.id);
  //     });
  //     setWantToWatchMovies(nextWantToWatchMovies);
  //     setIsLoading(false);
  //   });

  //   return () => unSub();
  // }, [paramUserId, currentUser]);

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
          {watchedMovies.length === 0 ? (
            <NoResultMessage>視聴をした映画がありません</NoResultMessage>
          ) : (
            <MovieContainer>
              {(selectedButton === "watched"
                ? watchedMovies
                : wantToWatchMovies
              ).map((movie) => (
                <MovieCard key={movie} movieId={movie} />
              ))}
            </MovieContainer>
          )}
        </div>
      </PageWithHeader>
      {wantToWatchIsLoading || watchedIsLoading && <Loader />}
    </>
  );
};
