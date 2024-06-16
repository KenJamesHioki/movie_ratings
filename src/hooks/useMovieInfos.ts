//結局は今は使っていない：あとで消すことを検討

import { useEffect, useState } from "react";
import axios from "axios";
import { showAlert } from "../lib/showAlert";
import { useTheme } from "../lib/ThemeProvider";
import { MovieInfo } from "../types/types";

export const useMovieInfos = (movieIds: Array<string>) => {
  const { theme } = useTheme();
  const [isLoading, setIsLoading] = useState(true);
  const [movieInfos, setMovieInfos] = useState<Array<MovieInfo>>([]);

  const fetchMovieInfo = async (movieId: string) => {
    const url = `https://api.themoviedb.org/3/movie/${movieId}?api_key=${
      import.meta.env.VITE_TMDB_API_KEY
    }&language=ja-JP
    `;
    setIsLoading(true);
    try {
      setIsLoading(true);
      const response = await axios.get(url);
      const movieDetails = response.data;
      setIsLoading(false);
      return {
        movieId,
        title: movieDetails.title,
        releaseYear: movieDetails.release_date.split("-")[0], // YYYY-MM-DD形式からYYYY形式に変換
        overview: movieDetails.overview,
        posterPath: movieDetails.poster_path,
      };
    } catch (error: any) {
      showAlert({
        type: "error",
        message: "読み込みに失敗しました",
        theme,
      });
      console.error(error.message);
      return {
        movieId: "",
        title: "",
        releaseYear: "",
        overview: "",
        posterPath: "",
      };
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const fetchAllMoviesInfos = async (movieIds: Array<string>) => {
      const allMovieInfos = await Promise.all(
        movieIds.map(async (movieId) => await fetchMovieInfo(movieId))
      );
      setMovieInfos(allMovieInfos);
    };

    fetchAllMoviesInfos(movieIds);
  }, [movieIds]);

  return { movieInfos, isLoading };
};
