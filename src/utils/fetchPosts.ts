import { collection, getDocs, orderBy, query, where } from "firebase/firestore";
import { RatingPost } from "../types/types";
import { showAlert } from "../lib/showAlert";
import { db } from "../lib/firebase";

export const fetchPosts = async (movieId: string, setIsLoading: (isLoading:boolean)=>void,theme:string) => {
  setIsLoading(true);
  try {
    const q = query(
      collection(db, "posts"),
      where("movieId", "==", movieId),
      orderBy("timestamp", "desc")
    );
    const querySnapshot = await getDocs(q);
    const fetchedPosts: Array<RatingPost> = [];
    querySnapshot.forEach((doc) => {
      fetchedPosts.push({
        postId: doc.id,
        comment: doc.data().comment,
        movieId: doc.data().movieId,
        score: doc.data().score,
        timestamp: doc.data().timestamp,
        userId: doc.data().userId,
      });
    });
    return fetchedPosts;
  } catch (error: any) {
    showAlert({
      type: "error",
      message: "投稿の読み込みに失敗しました",
      theme,
    });
    console.error(error.message);
    return [];
  } finally {
    setIsLoading(false);
  }
};