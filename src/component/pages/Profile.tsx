import React, { useContext, useEffect, useState } from "react";
import { PageWithHeader } from "../layout/PageWithHeader";
import { UserContext } from "../../lib/UserProvider";
import { MovieCard } from "../molecules/MovieCard";
import "../../styles/pages/profile.css";
import { useNavigate, useParams } from "react-router-dom";
import { MovieContainer } from "../layout/MovieContainer";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../lib/firebase";
import { Loader } from "../atoms/Loader";
import { RatingPost } from "../../types/types";
import { NoResultMessage } from "../atoms/NoResultMessage";
import { ProfileContainer } from "../molecules/ProfileContainer";

export const Profile: React.FC = () => {
  const { currentUser } = useContext(UserContext);
  const { userId } = useParams();
  const [watchedMovies, setWatchedMovies] = useState<Array<RatingPost> | null>(
    []
  );
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();  

  useEffect(() => {
    if (!currentUser.userId) {
      navigate("/");
    }
  }, [currentUser, navigate]);

  useEffect(() => {
    setIsLoading(true);
    const q = query(
      collection(db, "posts"),
      where("userId", "==", userId ? userId : currentUser.userId)
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
  }, [userId, currentUser]);

  return (
    <>
      <PageWithHeader>
        <div className="profile_wrapper">
          <ProfileContainer numWatched={watchedMovies?.length} userId={userId} />
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
