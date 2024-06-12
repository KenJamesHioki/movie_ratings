export type TMDBResult = {
  adult: boolean;
  backdrop_path: string;
  genre_ids: Array<number>;
  id: string;
  original_language: string;
  original_title: string;
  overview: string;
  popularity: number;
  poster_path: string;
  release_date: string;
  title: string;
  video: boolean;
  vote_average: number;
  vote_count: number;
};

export type RatingPost = {
  postId: string;
  comment: string;
  movieId: string;
  score: number;
  timestamp: any;
  userId: string;
};

export type MovieInfo = {
  movieId: string;
  title: string;
  releaseYear: string;
  overview: string;
  posterPath: string;
};