import { doc, onSnapshot } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../lib/firebase";

export const useWantToWatchMovies = (userId:string) => {
  const [wantToWatchMovies, setWantToWatchMovies] = useState<Array<string>>([]);

  useEffect(() => {
    const unSub = onSnapshot(
      doc(db, "wantToWatch", userId),
      (doc) => {
        if (doc.exists()) {
          setWantToWatchMovies(doc.data().wantToWatchMovies);
        }
      },
      (error) => {
        console.error(error.message);
      }
    );

    return () => unSub();
  }, [userId]);

  return { wantToWatchMovies };
};
