import React, { useEffect, useState } from "react";
import { PageWithHeader } from "../layout/PageWithHeader";
import { useUser } from "../../lib/UserProvider";
import { MovieCard } from "../molecules/MovieCard";
import "../../styles/pages/profile.css";
import { useLocation, useParams } from "react-router-dom";
import { MovieContainer } from "../layout/MovieContainer";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../lib/firebase";
import { Loader } from "../atoms/Loader";
import { NoResultMessage } from "../atoms/NoResultMessage";
import { ProfileContainer } from "../molecules/ProfileContainer";
import { showAlert } from "../../lib/showAlert";
import { PlaylistAddCheckCircle, Visibility } from "@mui/icons-material";
import { useWantToWatchMovies } from "../../hooks/useWantToWatchMovies";
import { useWatchedMovies } from "../../hooks/useWatchedMovies";

type ButtonKey = "watched" | "wantToWatch";
type ProfileInfo = {
  userId: string;
  displayName: string;
  introduction: string;
  iconUrl: string;
};

export const Profile: React.FC = () => {
  const { currentUser } = useUser();
  const { paramUserId } = useParams();
  const { wantToWatchMovies, isLoading: wantToWatchIsLoading } = useWantToWatchMovies(
    paramUserId || currentUser.userId
  );
  const { watchedMovies, isLoading: watchedIsLoading } = useWatchedMovies(paramUserId || currentUser.userId);
  //OPTIMIZE: 他のユーザーのProfileでcurrentUserのwantToWatchを表示するためにcurrentUserのwantToWatchも取得しなければいけない。
  const { wantToWatchMovies: myWantToWatchMovies, isLoading: myWantToWatchIsLoading } = useWantToWatchMovies(currentUser.userId);
  const location = useLocation();
  const [selectedButton, setSelectedButton] = useState<ButtonKey>("watched");
  const [isLoading, setIsLoading] = useState(false);
  const [profileInfo, setProfileInfo] = useState<ProfileInfo | null>({
    userId: "",
    displayName: "",
    introduction: "",
    iconUrl: "",
  });

  const handleClick = (key: ButtonKey) => {
    setSelectedButton(key);
  };

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
  }, [paramUserId]);

  useEffect(() => {
    if (location.state) {
      showAlert(location.state);
    }
  }, [location]);

  return (
    <>
      <PageWithHeader>
        {profileInfo ? (
          <>
            <div className="profile_wrapper">
              <ProfileContainer
                numWatched={watchedMovies?.length}
                profileInfo={profileInfo}
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
                  <MovieCard
                    key={movie}
                    isWantToWatch={myWantToWatchMovies.includes(movie)}
                    movieId={movie}
                  />
                ))}
              </MovieContainer>
            </div>
          </>
        ) : (
          <NoResultMessage>
            該当するユーザーが見つかりませんでした
          </NoResultMessage>
        )}
      </PageWithHeader>
      {isLoading || wantToWatchIsLoading || watchedIsLoading || myWantToWatchIsLoading && <Loader />}
    </>
  );
};
