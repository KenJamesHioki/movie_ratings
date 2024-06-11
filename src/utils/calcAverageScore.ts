import { RatingPost } from "../types/types";

export const clacAverageScore = (posts: Array<RatingPost>) => {
  if (posts.length === 0) {
    return "--";
  } else {
    const sum = posts.reduce((acc, curr) => acc + curr.score, 0);
    return (sum / posts.length).toFixed(1);
  }
};