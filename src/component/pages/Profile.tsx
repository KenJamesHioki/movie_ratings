import React, { ChangeEvent, useContext, useEffect, useState } from "react";
import { PageWithHeader } from "../layout/PageWithHeader";
import { UserContext } from "../../lib/UserProvider";
import { MovieCard } from "../molecules/MovieCard";
import "../../styles/pages/profile.css";
import { useNavigate } from "react-router-dom";
import { MovieContainer } from "../layout/MovieContainer";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "../../lib/firebase";
import { Loader } from "../atoms/Loader";
import { RatingPost } from "../../types/types";
import { NoResultMessage } from "../atoms/NoResultMessage";
import { InvertedButton } from "../atoms/InvertedButton";
import { Textarea } from "../atoms/Textarea";
import { PrimaryButton } from "../atoms/PrimaryButton";

export const Profile: React.FC = () => {
  const { currentUser, logout } = useContext(UserContext);
  const [watchedMovies, setWatchedMovies] = useState<Array<RatingPost> | null>(
    []
  );
  const [isLoading, setIsLoading] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentIntroduction, setCurrentIntroduction] = useState("");
  const [newIntroduction, setNewIntroduction] = useState("");
  const navigate = useNavigate();

  const updateIntroduction = async () => {
    try {
      const docSnap = await getDoc(doc(db, "users", currentUser.userId));
      setCurrentIntroduction(docSnap.data().introduction);
      setNewIntroduction(docSnap.data().introduction);
    } catch (error: any) {
      console.error(error.message);
    }
  };

  useEffect(() => {
    if (!currentUser.userId) {
      navigate("/");
    }
  }, [currentUser, navigate]);

  useEffect(() => {
    setIsLoading(true);
    const q = query(
      collection(db, "posts"),
      where("userId", "==", currentUser.userId)
    );
    const updateWatchedMovies = async () => {
      try {
        const querySnapshot = await getDocs(q);
        const nextPosts: Array<RatingPost> = [];
        querySnapshot.forEach((doc) => {
          nextPosts.push({ postId: doc.id, ...doc.data() });
        });
        setWatchedMovies(nextPosts);
      } catch (error: any) {
        console.error(error.meesage);
      } finally {
        setIsLoading(false);
      }
    };

    updateWatchedMovies();
  }, [currentUser]);

  useEffect(() => {
    updateIntroduction();
  }, []);

  const handleCancel = () => {
    setNewIntroduction(currentIntroduction);
    setIsEditMode(false);
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      await updateDoc(doc(db, "users", currentUser.userId), {
        introduction: newIntroduction,
      });
      updateIntroduction();
      setIsEditMode(false);
    } catch (error: any) {
      console.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <PageWithHeader>
        <div className="profile_wrapper">
          <div className="profile_info-container">
            <div className="profile_icon">
              <img src={currentUser.iconUrl} alt="" />
            </div>
            <p className="profile_display-name">{currentUser.displayName}</p>
            {isEditMode ? (
              <div className="profile_introduction-edit-container">
                <Textarea
                  onChange={(e: ChangeEvent<HTMLFormElement>) =>
                    setNewIntroduction(e.target.value)
                  }
                  value={newIntroduction}
                />
                <div className="profile_button-container">
                  <PrimaryButton onClick={handleSave}>保存</PrimaryButton>
                  <InvertedButton onClick={handleCancel}>
                    キャンセル
                  </InvertedButton>
                </div>
              </div>
            ) : (
              <p className="profile_introduction">{currentIntroduction}</p>
            )}

            <p className="profile_movies-watched">
              映画数：{watchedMovies?.length}本
            </p>
            {!isEditMode && (
              <InvertedButton onClick={() => setIsEditMode(true)}>
                自己紹介文を編集
              </InvertedButton>
            )}
            <p className="profile_logout" onClick={logout}>
              ログアウト
            </p>
          </div>
          {watchedMovies?.length === 0 ? (
            <NoResultMessage>視聴をした映画がありません</NoResultMessage>
          ) : (
            <MovieContainer>
              {watchedMovies?.map((movie) => (
                <MovieCard key={movie.movieId} movieId={movie.movieId} />
              ))}
            </MovieContainer>
          )}
        </div>
      </PageWithHeader>
      {isLoading && <Loader />}
    </>
  );
};
