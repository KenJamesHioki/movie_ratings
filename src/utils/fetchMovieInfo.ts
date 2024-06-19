import axios from "axios";

export const fetchMovieInfo = async (movieId: string) => {
  const url = `https://api.themoviedb.org/3/movie/${movieId}?api_key=${
    import.meta.env.VITE_TMDB_API_KEY
  }&language=ja-JP
  `;

  try {
    const response = await axios.get(url);
    const movieDetails = response.data;
    return {
      movieId,
      title: movieDetails.title,
      releaseYear: movieDetails.release_date.split("-")[0], // YYYY-MM-DD形式からYYYY形式に変換
      overview: movieDetails.overview,
      posterPath: movieDetails.poster_path,
    };
  } catch (error: any) {
    console.error(error.message);
    throw new Error("読み込みに失敗しました")
  }
};