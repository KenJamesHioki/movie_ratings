import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../lib/firebase";
import { showAlert } from "../lib/showAlert";

export const fetchWatchedMovieIds = async (userId: string, setIsLoading: (isLoading:boolean)=>void,theme:string) => {
  setIsLoading(true);
  try {
    const q = query(collection(db, "posts"), where("userId", "==", userId));
    const querySnapshot = await getDocs(q);
    const fetchedMovies: Array<string> = [];
    querySnapshot.forEach((doc) => {
      fetchedMovies.push(doc.data().movieId);
    });
    setIsLoading(false);
    return fetchedMovies;
  } catch (error: any) {
    showAlert({ type: "error", message: "読み込みに失敗しました", theme });
    console.error(error.message);
    return [];
  } finally {
    setIsLoading(false);
  }
};