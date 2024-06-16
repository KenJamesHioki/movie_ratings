import axios from "axios";
import { showAlert } from "../lib/showAlert";

export const fetchMovieInfo = async (movieId: string, setIsLoading: (isLoading:boolean)=>void, theme:string) => {
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