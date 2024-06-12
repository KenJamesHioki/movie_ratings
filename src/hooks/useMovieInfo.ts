import { useEffect, useState } from "react";
import axios from "axios";
import { showAlert } from "../lib/showAlert";
import { MovieInfo } from "../types/types";
import { useTheme } from "../lib/ThemeProvider";

export const useMovieInfo = (movieId: string) => {
  const { theme } = useTheme();
  const [isLoading, setIsLoading] = useState(true);
  const [movieInfo, setMovieInfo] = useState<MovieInfo | null>({
    movieId: "",
    title: "",
    releaseYear: "",
    overview: "",
    posterPath: "",
  });

  useEffect(() => {
    const url = `https://api.themoviedb.org/3/movie/${movieId}?api_key=${
      import.meta.env.VITE_TMDB_API_KEY
    }&language=ja-JP
    `;
    setIsLoading(true);
    axios
      .get(url)
      .then((response) => {
        const movieDetails = response.data;
        setMovieInfo({
          movieId,
          title: movieDetails.title,
          releaseYear: movieDetails.release_date.split("-")[0], //YYYY-MM-DD形式からYYYY形式に変換
          overview: movieDetails.overview,
          posterPath: movieDetails.poster_path,
        });
        setIsLoading(false);
      })
      .catch((error: any) => {
        setMovieInfo(null);
        showAlert({
          type: "error",
          message: "読み込みに失敗しました",
          theme,
        });
        console.error(error.message);
      })
      .finally(() => setIsLoading(false));
  }, [movieId]);

  return { movieInfo, isLoading };
};
