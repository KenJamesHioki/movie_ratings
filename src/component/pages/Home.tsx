import React, { ChangeEvent, memo, useEffect, useState } from "react";
import "../../styles/pages/home.css";
import { MovieCard } from "../molecules/MovieCard";
import axios from "axios";
import { PageWithHeader } from "../layout/PageWithHeader";
import { Input } from "../atoms/Input";
import { MovieContainer } from "../layout/MovieContainer";
import { TMDBResult } from "../../types/types";
import { Loader } from "../atoms/Loader";
import { NoResultMessage } from "../atoms/NoResultMessage";

type Movie = {
  movieId: string;
  title: string;
  posterPath: string;
};

export const Home: React.FC = memo(() => {
  const [movies, setMovies] = useState<Array<Movie>>([]);
  const [searchTitle, setSearchTitle] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    const popularMoviesUrl = `https://api.themoviedb.org/3/movie/popular?api_key=${
      import.meta.env.VITE_TMDB_API_KEY
    }&language=jp-JP&page=1&region=JP`;
    setNextMovies(popularMoviesUrl);
  }, []);

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    setIsLoading(true);
    e.preventDefault();
    const searchMovieUrl = `https://api.themoviedb.org/3/search/movie?api_key=${
      import.meta.env.VITE_TMDB_API_KEY
    }&query=${encodeURIComponent(searchTitle)}&language=ja-JP`;
    setNextMovies(searchMovieUrl);
  };

  const setNextMovies = (url: string) => {
    axios
      .get(url)
      .then((response) => {
        const nextMovies = response.data.results.map((result: TMDBResult) => ({
          movieId: String(result.id),
          title: result.title,
          posterPath: result.poster_path,
        }));

        setMovies(nextMovies);
      })
      .catch((error: any) => console.error(error.message))
      .finally(() => setIsLoading(false));
  };

  return (
    <>
      <PageWithHeader>
        <div className="home_wrapper">
          <form className="home_search" onSubmit={handleSearch}>
            <Input
              type="text"
              placeholder="映画名で検索…"
              value={searchTitle}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setSearchTitle(e.target.value)
              }
            />
            <button className="home_search-button">検索</button>
          </form>
          {movies?.length === 0 ? (
            <NoResultMessage>該当する映画がありません</NoResultMessage>
          ) : (
            <MovieContainer>
              {movies[0]?.movieId && (
                <>
                  {movies.map((movie) => (
                    <MovieCard
                      key={movie.movieId}
                      movieId={movie.movieId}
                      title={movie.title}
                      posterPath={movie.posterPath}
                    />
                  ))}
                </>
              )}
            </MovieContainer>
          )}
        </div>
      </PageWithHeader>
      {isLoading && <Loader />}
    </>
  );
});
