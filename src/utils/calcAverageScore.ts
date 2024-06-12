type Posts = {
  score: number;
  [key:string]: any;
}

export const clacAverageScore = (posts: Array<Posts>) => {
  if (posts.length === 0) {
    return "--";
  } else {
    const sum = posts.reduce((acc, curr) => acc + curr.score, 0);
    return (sum / posts.length).toFixed(1);
  }
};