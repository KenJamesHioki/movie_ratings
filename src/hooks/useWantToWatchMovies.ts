import { doc, onSnapshot } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../lib/firebase";
import { showAlert } from "../lib/showAlert";
import { useTheme } from "../lib/ThemeProvider";

export const useWantToWatchMovies = (userId: string) => {
  const [wantToWatchMovies, setWantToWatchMovies] = useState<Array<string>>([]);
  const [isLoading, setIsLoading] = useState(true);
  const {theme} = useTheme();

  useEffect(() => {
    const fetchWantToWatchMovies = () => {
      setIsLoading(true);
      try {
        const unSub = onSnapshot(
          doc(db, "wantToWatch", userId),
          (doc) => {
            if (doc.exists()) {
              setWantToWatchMovies(doc.data().wantToWatchMovies);
            } else {
              setWantToWatchMovies([]);
            }
            setIsLoading(false);
          },
          (error: any) => {
            showAlert({type: "error" , message: "読み込みに失敗しました", theme})
            console.error(error.message);
            setIsLoading(false);
          }
        );

        return () => unSub();
      } catch (error: any) {
        showAlert({type: "error" , message: "読み込みに失敗しました", theme})
        console.error(error.meesage);
      } finally {
        setIsLoading(false);
      }
    };

    fetchWantToWatchMovies();
  }, [userId]);

  return { wantToWatchMovies, isLoading };
};
