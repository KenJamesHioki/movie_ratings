import {
  arrayRemove,
  arrayUnion,
  doc,
  getDoc,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { useWantToWatchMovieIds } from "./useWantToWatchMovieIds";
import { useUser } from "../lib/UserProvider";
import { db } from "../lib/firebase";
import { showAlert } from "../lib/showAlert";
import { useTheme } from "../lib/ThemeProvider";

export const useToggleWantToWatch = () => {
  const { currentUser } = useUser();
  const { theme } = useTheme();
  const { wantToWatchMovieIds } = useWantToWatchMovieIds(currentUser.userId);

  const toggleWantToWatch = async (movieId: string) => {
    if (wantToWatchMovieIds.includes(movieId)) {
      removeWantToWatchMovie(movieId);
    } else {
      addWantToWatchMovie(movieId);
    }
  };

  const removeWantToWatchMovie = async (movieId: string) => {
    try {
      const docSnap = await getDoc(doc(db, "wantToWatch", currentUser.userId));
      if (docSnap.exists()) {
        await updateDoc(doc(db, "wantToWatch", currentUser.userId), {
          wantToWatchMovies: arrayRemove(movieId),
        });
      }
    } catch (error: any) {
      console.error(error.message);
      showAlert({ type: "error", message: "通信に失敗しました", theme });
    }
  };

  const addWantToWatchMovie = async (movieId: string) => {
    try {
      const docSnap = await getDoc(doc(db, "wantToWatch", currentUser.userId));
      if (docSnap.exists()) {
        await updateDoc(doc(db, "wantToWatch", currentUser.userId), {
          wantToWatchMovies: arrayUnion(movieId),
        });
      } else {
        await setDoc(doc(db, "wantToWatch", currentUser.userId), {
          wantToWatchMovies: [movieId],
        });
      }
    } catch (error: any) {
      console.error(error.message);
      showAlert({ type: "error", message: "通信に失敗しました", theme });
    }
  };

  return { toggleWantToWatch };
};
