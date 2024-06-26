import { CSSProperties } from "react";

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

export type ButtonProps = {
  type: "button" | "reset" | "submit" | undefined;
  children: string;
  disabled?: boolean;
  onClick?: () => void;
  style?: CSSProperties;
  className?: string;
};