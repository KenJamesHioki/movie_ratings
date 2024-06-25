import React, { ChangeEvent, memo, useEffect, useState } from "react";
import { MovieCard } from "../molecules/MovieCard";
import axios from "axios";
import { PageWithHeader } from "../templates/PageWithHeader";
import { Input } from "../atoms/input/Input";
import { MovieCardGrid } from "../organisms/MovieCardGrid";
import { Loader } from "../atoms/Loader";
import { NoResultMessage } from "../atoms/NoResultMessage";
import { SectionTitle } from "../atoms/SectionTitle";
import { useNavigate, useParams } from "react-router-dom";
import { showAlert } from "../../lib/showAlert";
import { useTheme } from "../../lib/ThemeProvider";
import { PrimaryButton } from "../atoms/button/PrimaryButton";
import { useWantToWatchMovieIds } from "../../hooks/useWantToWatchMovieIds";
import { useUser } from "../../lib/UserProvider";
import "../../styles/pages/home.css";
import { TMDBMovie } from "../../types/api/TMDBMovie";

type Movie = {
  movieId: string;
  title: string;
  posterPath: string;
};

export const Home: React.FC = memo(() => {
  const { paramMovieTitle } = useParams();
  const { theme } = useTheme();
  const { currentUser } = useUser();
  const { wantToWatchMovieIds } = useWantToWatchMovieIds(currentUser.userId);
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
    let apiUrl = "";

    if (paramMovieTitle) {
      apiUrl = `https://api.themoviedb.org/3/search/movie?api_key=${
        import.meta.env.VITE_TMDB_API_KEY
      }&query=${paramMovieTitle}&language=ja-JP`;
    } else {
      apiUrl = `https://api.themoviedb.org/3/movie/popular?api_key=${
        import.meta.env.VITE_TMDB_API_KEY
      }&language=ja-JP&page=1&region=JP`;
      setSearchTitle("");
    }

    const fetchMovieInfos = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(apiUrl);
        const fetchedMovies: Array<Movie> = response.data.results.map(
          (result: TMDBMovie) => ({
            movieId: String(result.id),
            title: result.title,
            posterPath: result.poster_path,
          })
        );
        return fetchedMovies;
      } catch (error: any) {
        console.error(error.message);
        setMovies([]);
        showAlert({
          type: "error",
          message: "映画情報の読み込みに失敗しました",
          theme,
        });
        return [];
      } finally {
        setIsLoading(false);
      }
    };

    fetchMovieInfos().then((response) => setMovies(response));
  }, [paramMovieTitle]);

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
          {!paramMovieTitle ? (
            <SectionTitle
              style={{ alignSelf: "flex-start", marginBottom: "40px" }}
            >
              国内人気作品
            </SectionTitle>
          ) : (
            <SectionTitle
              style={{ alignSelf: "flex-start", marginBottom: "40px" }}
            >
              {paramMovieTitle
                ? `${paramMovieTitle}の検索結果：`
                : "検索結果："}
            </SectionTitle>
          )}
          {movies.length === 0 ? (
            <NoResultMessage>該当する映画がありません</NoResultMessage>
          ) : (
            <MovieCardGrid>
              {movies[0] && (
                <>
                  {movies.map((movie) => (
                    <MovieCard
                      key={movie.movieId}
                      isWantToWatch={wantToWatchMovieIds.includes(
                        movie.movieId
                      )}
                      movieId={movie.movieId}
                      title={movie.title}
                      posterPath={movie.posterPath}
                    />
                  ))}
                </>
              )}
            </MovieCardGrid>
          )}
        </div>
      </PageWithHeader>
      {isLoading && <Loader size={60} />}
    </>
  );
});
