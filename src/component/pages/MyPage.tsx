import React, { memo, useEffect, useState } from "react";
import { PageWithHeader } from "../templates/PageWithHeader";
import { useUser } from "../../lib/UserProvider";
import { MovieCard } from "../organisms/MovieCard";
import { useLocation, useParams } from "react-router-dom";
import { MovieContainer } from "../templates/MovieCardContainer";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../lib/firebase";
import { Loader } from "../atoms/Loader";
import { NoResultMessage } from "../atoms/NoResultMessage";
import { ProfileContainer } from "../organisms/ProfileContainer";
import { showAlert } from "../../lib/showAlert";
import { PlaylistAddCheckCircle, Visibility } from "@mui/icons-material";
import { useWatchedMovieIds } from "../../hooks/useWatchedMovieIds";
import { useWantToWatchMovieIds } from "../../hooks/useWantToWatchMovieIds";
import { useMovieInfo } from "../../hooks/useMovieInfoTest";
import { MovieInfo } from "../../types/types";
import "../../styles/pages/myPage.css";

type ButtonKey = "watched" | "wantToWatch";
type ProfileInfo = {
  userId: string;
  displayName: string;
  introduction: string;
  iconUrl: string;
};

export const MyPage: React.FC = memo(() => {
  const { currentUser } = useUser();
  const { paramUserId } = useParams();
  const { wantToWatchMovieIds, isLoading: wantToWatchIsLoading } =
    useWantToWatchMovieIds(paramUserId || currentUser.userId);
  const { watchedMovieIds, isLoading: watchedIsLoading } = useWatchedMovieIds(
    paramUserId || currentUser.userId
  );
  //OPTIMIZE: 他のユーザーのProfileでcurrentUserのwantToWatchを表示するためにcurrentUserのwantToWatchも取得しなければいけない。
  const {
    wantToWatchMovieIds: myWantToWatchMovies,
    isLoading: myWantToWatchIsLoading,
  } = useWantToWatchMovieIds(currentUser.userId);
  const location = useLocation();
  const [selectedButton, setSelectedButton] = useState<ButtonKey>("watched");
  const [isLoading, setIsLoading] = useState(false);

  //ステートである必要はないのでは？
  const [profileInfo, setProfileInfo] = useState<ProfileInfo | null>({
    userId: "",
    displayName: "",
    introduction: "",
    iconUrl: "",
  });

  const handleClick = (key: ButtonKey) => {
    setSelectedButton(key);
  };

  const { fetchMovieInfo, isLoading: movieInfoIsLoading } = useMovieInfo();

  const [wantToWatchMovieInfos, setWantToWatchMovieInfos] = useState<
    Array<MovieInfo>
  >([]);
  useEffect(() => {
    const fetchWantToWatchMovieInfos = async () => {
      const movieInfos = await Promise.all(
        wantToWatchMovieIds.map(
          async (movieId) => await fetchMovieInfo(movieId)
        )
      );
      setWantToWatchMovieInfos(movieInfos);
    };
    fetchWantToWatchMovieInfos();
  }, [wantToWatchMovieIds, currentUser]);

  const [watchedMovieInfos, setWatchedMovieInfos] = useState<Array<MovieInfo>>(
    []
  );
  useEffect(() => {
    const fetchWatchedMovieInfos = async () => {
      const movieInfos = await Promise.all(
        watchedMovieIds.map(async (movieId) => await fetchMovieInfo(movieId))
      );
      setWatchedMovieInfos(movieInfos);
    };
    fetchWatchedMovieInfos();
  }, [watchedMovieIds, currentUser]);

  useEffect(() => {
    const fetchOtherUserProfile = async (id: string) => {
      try {
        setIsLoading(true);
        const docSnap = await getDoc(doc(db, "users", id));
        if (docSnap.exists()) {
          setProfileInfo({
            userId: id,
            displayName: docSnap.data().displayName,
            introduction: docSnap.data().introduction,
            iconUrl: docSnap.data().iconUrl,
          });
        } else {
          setProfileInfo(null);
        }
      } catch (error: any) {
        console.error(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    if (paramUserId) {
      fetchOtherUserProfile(paramUserId);
    } else {
      setProfileInfo({
        userId: currentUser.userId,
        displayName: currentUser.displayName,
        introduction: currentUser.introduction,
        iconUrl: currentUser.iconUrl,
      });
    }
  }, [paramUserId, currentUser]);

  useEffect(() => {
    if (location.state) {
      showAlert(location.state);
    }
  }, [location]);

  if (
    isLoading ||
    wantToWatchIsLoading ||
    watchedIsLoading ||
    myWantToWatchIsLoading ||
    movieInfoIsLoading
  ) {
    return (
      <PageWithHeader>
        <Loader />
      </PageWithHeader>
    );
  }

  if (!profileInfo) {
    return (
      <PageWithHeader>
        <NoResultMessage>
          該当するユーザーが見つかりませんでした
        </NoResultMessage>{" "}
      </PageWithHeader>
    );
  }

  return (
    <>
      <PageWithHeader>
        <div className="myPage_wrapper">
          <ProfileContainer
            numWatched={watchedMovieIds?.length}
            profileInfo={profileInfo}
          />
        </div>
        <div className="myPage_button-container">
          <div
            onClick={() => handleClick("watched")}
            className={`myPage_watched-movies button ${
              selectedButton === "watched" && "selected"
            }`}
          >
            <Visibility />
            <p>{watchedMovieIds.length}</p>
          </div>
          <div
            onClick={() => handleClick("wantToWatch")}
            className={`myPage_watched-movies button ${
              selectedButton === "wantToWatch" && "selected"
            }`}
          >
            <PlaylistAddCheckCircle />
            <p>{wantToWatchMovieIds.length}</p>
          </div>
        </div>
        <div className="myPage_wrapper">
          {selectedButton === "watched" && watchedMovieIds.length === 0 ? (
            <NoResultMessage>視聴した映画がありません</NoResultMessage>
          ) : (
            <></>
          )}
          {selectedButton === "wantToWatch" &&
          wantToWatchMovieIds.length === 0 ? (
            <NoResultMessage>登録した映画がありません</NoResultMessage>
          ) : (
            <></>
          )}
          <MovieContainer>
            {(selectedButton === "watched"
              ? watchedMovieInfos
              : wantToWatchMovieInfos
            ).map((movie) => (
              <MovieCard
                key={movie.movieId}
                isWantToWatch={myWantToWatchMovies.includes(movie.movieId)}
                movieId={movie.movieId}
                title={movie.title}
                posterPath={movie.posterPath}
              />
            ))}
          </MovieContainer>
        </div>
      </PageWithHeader>
    </>
  );
});
