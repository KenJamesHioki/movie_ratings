//作成途中

import { doc, onSnapshot } from "firebase/firestore";
import { showAlert } from "../lib/showAlert";
import { db } from "../lib/firebase";

export const fetchMovieIds = (setIsLoading: (isLoading:boolean)=>void, theme:string) => {
  setIsLoading(true);
  try {
    const unSub = onSnapshot(
      doc(db, "wantToWatch", userId),
      (doc) => {
        if (doc.exists()) {
          return doc.data().wantToWatchMovies;
        } else {
          return [];
        }
        setIsLoading(false);
      },
      (error: any) => {
        showAlert({type: "error" , message: "サーバーとの接続が切断されました", theme})
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