import React, { memo, useEffect, useState } from "react";
import { PageWithHeader } from "../templates/PageWithHeader";
import { useUser } from "../../lib/UserProvider";
import { MovieCard } from "../molecules/MovieCard";
import { useLocation, useParams } from "react-router-dom";
import { MovieCardGrid } from "../organisms/MovieCardGrid";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../lib/firebase";
import { Loader } from "../atoms/Loader";
import { NoResultMessage } from "../atoms/NoResultMessage";
import { UserProfileInfo } from "../organisms/UserProfileInfo";
import { showAlert } from "../../lib/showAlert";
import { PlaylistAddCheckCircle, Visibility } from "@mui/icons-material";
import { useWantToWatchMovieIds } from "../../hooks/useWantToWatchMovieIds";
import "../../styles/pages/myPage.css";
import { fetchMovieInfo } from "../../utils/fetchMovieInfo";
import { MovieInfo } from "../../types/types";
import { useTheme } from "../../lib/ThemeProvider";
import { fetchWatchedMovieIds } from "../../utils/fetchWatchedMovieIds";

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
  const { theme } = useTheme();
  const { wantToWatchMovieIds, isLoading: wantToWatchIdsIsLoading } =
    useWantToWatchMovieIds(paramUserId || currentUser.userId);
  const [watchedMovieIds, setWatchedMovieIds] = useState<Array<string>>([]);
  const [wantToWatchMovieInfos, setWantToWatchMovieInfos] = useState<
    Array<MovieInfo>
  >([]);
  const [watchedMovieInfos, setWatchedMovieInfos] = useState<Array<MovieInfo>>(
    []
  );
  const {
    wantToWatchMovieIds: myWantToWatchMovies,
    isLoading: myWantToWatchIsLoading,
  } = useWantToWatchMovieIds(currentUser.userId);
  const location = useLocation();
  const [selectedButton, setSelectedButton] = useState<ButtonKey>("watched");
  const [isLoading, setIsLoading] = useState(false);

  //currentUserではないユーザーのMyPageを表示する場合にのみ必要なステート
  const [profileInfo, setProfileInfo] = useState<ProfileInfo>({
    userId: "",
    displayName: "",
    introduction: "",
    iconUrl: "",
  });

  const handleSwitchMovieList = (key: ButtonKey) => {
    setSelectedButton(key);
  };

  useEffect(() => {
    setIsLoading(true);
    fetchWatchedMovieIds(paramUserId || currentUser.userId)
      .then((response) => setWatchedMovieIds(response))
      .catch((error: any) => {
        showAlert({ type: "error", message: error.message, theme });
        setWatchedMovieIds([]);
      })
      .finally(() => setIsLoading(false));
  }, [paramUserId, currentUser]);

  useEffect(() => {
    setIsLoading(true);
    Promise.all(
      watchedMovieIds.map(async (movieId) => await fetchMovieInfo(movieId))
    )
      .then((response) => setWatchedMovieInfos(response))
      .catch((error: any) => {
        showAlert({ type: "error", message: error.message, theme });
        setWatchedMovieInfos([]);
      })
      .finally(() => setIsLoading(false));
  }, [watchedMovieIds]);

  useEffect(() => {
    setIsLoading(true);
    Promise.all(
      wantToWatchMovieIds.map(async (movieId) => await fetchMovieInfo(movieId))
    )
      .then((response) => setWantToWatchMovieInfos(response))
      .catch((error: any) => {
        showAlert({ type: "error", message: error.message, theme });
        setWantToWatchMovieInfos([]);
      })
      .finally(() => setIsLoading(false));
  }, [wantToWatchMovieIds]);

  useEffect(() => {
    const fetchOtherUserProfile = async () => {
      try {
        setIsLoading(true);
        const docSnap = await getDoc(doc(db, "users", paramUserId!));
        if (docSnap.exists()) {
          return {
            userId: paramUserId!,
            displayName: docSnap.data().displayName,
            introduction: docSnap.data().introduction,
            iconUrl: docSnap.data().iconUrl,
          };
        } else {
          return {
            userId: "",
            displayName: "",
            introduction: "",
            iconUrl: "",
          };
        }
      } catch (error: any) {
        console.error(error.message);
        return {
          userId: "",
          displayName: "",
          introduction: "",
          iconUrl: "",
        };
      } finally {
        setIsLoading(false);
      }
    };

    if (paramUserId) {
      fetchOtherUserProfile().then((response) => setProfileInfo(response));
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

  if (isLoading || wantToWatchIdsIsLoading || myWantToWatchIsLoading) {
    return (
      <PageWithHeader>
        <Loader size={60} />
      </PageWithHeader>
    );
  }

  if (profileInfo.userId === "") {
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
        <div className="myPage__wrapper">
          <UserProfileInfo
            numWatched={watchedMovieIds.length}
            profileInfo={profileInfo}
          />
        </div>
        <div className="myPage__button-container">
          <div
            onClick={() => handleSwitchMovieList("watched")}
            className={`myPage__button ${
              selectedButton === "watched" ? "myPage__button_selected" : ""
            }`}
          >
            <Visibility />
            <p>{watchedMovieIds.length}</p>
          </div>
          <div
            onClick={() => handleSwitchMovieList("wantToWatch")}
            className={`myPage__button ${
              selectedButton === "wantToWatch" ? "myPage__button_selected" : ""
            }`}
          >
            <PlaylistAddCheckCircle />
            <p>{wantToWatchMovieIds.length}</p>
          </div>
        </div>
        <div className="myPage__wrapper">
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
          <MovieCardGrid>
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
          </MovieCardGrid>
        </div>
      </PageWithHeader>
    </>
  );
});
