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
import { SectionTitle } from "../atoms/SectionTitle";
import { useNavigate, useParams } from "react-router-dom";
import { showAlert } from "../../lib/showAlert";
import { useTheme } from "../../lib/ThemeProvider";
import { PrimaryButton } from "../atoms/PrimaryButton";
import { useWantToWatchMovies } from "../../hooks/useWantToWatchMovies";
import { useUser } from "../../lib/UserProvider";

type Movie = {
  movieId: string;
  title: string;
  posterPath: string;
};

export const Home: React.FC = memo(() => {
  const { paramMovieTitle } = useParams();
  const { theme } = useTheme();
  const { currentUser } = useUser();
  const { wantToWatchMovies } = useWantToWatchMovies(currentUser.userId);
  const [movies, setMovies] = useState<Array<Movie>>([]);
  const [searchTitle, setSearchTitle] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!searchTitle) return;
    navigate(`/${searchTitle}`);
  };

  useEffect(() => {
    setIsLoading(true);
    let url = "";

    if (paramMovieTitle) {
      url = `https://api.themoviedb.org/3/search/movie?api_key=${
        import.meta.env.VITE_TMDB_API_KEY
      }&query=${paramMovieTitle}&language=ja-JP`;
    } else {
      url = `https://api.themoviedb.org/3/movie/popular?api_key=${
        import.meta.env.VITE_TMDB_API_KEY
      }&language=jp-JP&page=1&region=JP`;
      setSearchTitle("");
    }
    setNextMovies(url);
  }, [paramMovieTitle]);

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
      .catch((error: any) => {
        console.error(error.message);
        setMovies([]);
        showAlert({
          type: "error",
          message: "映画の読み込みに失敗しました",
          theme,
        });
      })
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
            <PrimaryButton type="submit" disabled={searchTitle === ""}>
              検索
            </PrimaryButton>
          </form>
          {paramMovieTitle ? (
            <SectionTitle
              style={{ alignSelf: "flex-start", marginBottom: "40px" }}
            >
              {paramMovieTitle
                ? `${paramMovieTitle}の検索結果：`
                : "検索結果："}
            </SectionTitle>
          ) : (
            <SectionTitle
              style={{ alignSelf: "flex-start", marginBottom: "40px" }}
            >
              国内人気作品
            </SectionTitle>
          )}
          {movies?.length === 0 ? (
            <NoResultMessage>該当する映画がありません</NoResultMessage>
          ) : (
            <MovieContainer>
              {movies[0]?.movieId && (
                <>
                  {movies.map((movie) => (
                    <MovieCard
                      key={movie.movieId}
                      isWantToWatch={wantToWatchMovies.includes(movie.movieId)}
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
