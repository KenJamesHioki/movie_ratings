import { doc, onSnapshot } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../lib/firebase";
import { showAlert } from "../lib/showAlert";
import { useTheme } from "../lib/ThemeProvider";

export const useWantToWatchMovieIds = (userId: string) => {
  const [wantToWatchMovieIds, setWantToWatchMovieIds] = useState<Array<string>>(
    []
  );
  const [isLoading, setIsLoading] = useState(true);
  const { theme } = useTheme();

  useEffect(() => {
    const listenWantToWatchMovieIds = () => {
      setIsLoading(true);
      const unSub = onSnapshot(
        doc(db, "wantToWatch", userId),
        (doc) => {
          if (doc.exists()) {
            setWantToWatchMovieIds(doc.data().wantToWatchMovies);
          } else {
            setWantToWatchMovieIds([]);
          }
          setIsLoading(false);
        },
        (error: any) => {
          showAlert({
            type: "error",
            message: "読み込みに失敗しました",
            theme,
          });
          console.error(error.message);
          setIsLoading(false);
        }
      );

      return () => unSub();
    };

    listenWantToWatchMovieIds();
  }, [userId]);

  return { wantToWatchMovieIds, isLoading };
};
