import { collection, getDocs, query, where } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../lib/firebase";
import { showAlert } from "../lib/showAlert";
import { useTheme } from "../lib/ThemeProvider";

export const useWatchedMovieIds = (userId: string) => {
  const [watchedMovieIds, setWatchedMovieIds] = useState<Array<string>>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { theme } = useTheme();

  useEffect(() => {
    const fetchWatchedMovies = async () => {
      setIsLoading(true);
      try {
        const q = query(collection(db, "posts"), where("userId", "==", userId));
        const querySnapshot = await getDocs(q);
        const nextWatchedMovies: Array<string> = [];
        querySnapshot.forEach((doc) => {
          nextWatchedMovies.push(doc.data().movieId);
        });
        setWatchedMovieIds(nextWatchedMovies);
        setIsLoading(false);
      } catch (error: any) {
        showAlert({ type: "error", message: "読み込みに失敗しました", theme });
        console.error(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchWatchedMovies();
  }, [userId]);

  return { watchedMovieIds, isLoading };
};
