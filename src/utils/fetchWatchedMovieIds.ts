import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../lib/firebase";

export const fetchWatchedMovieIds = async (userId: string) => {
  try {
    const q = query(collection(db, "posts"), where("userId", "==", userId));
    const querySnapshot = await getDocs(q);
    const fetchedMovies: Array<string> = [];
    querySnapshot.forEach((doc) => {
      fetchedMovies.push(doc.data().movieId);
    });
    return fetchedMovies;
  } catch (error: any) {
    console.error(error.message);
    throw new Error("読み込みに失敗しました")
  }
};