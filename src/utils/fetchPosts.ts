import { collection, getDocs, orderBy, query, where } from "firebase/firestore";
import { RatingPost } from "../types/types";
import { db } from "../lib/firebase";

export const fetchPosts = async (movieId: string) => {
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
    console.error(error.message);
    throw new Error("投稿の読み込みに失敗しました")
  }
};