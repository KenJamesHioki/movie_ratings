//結局は今は使っていない：あとで消すことを検討

import { DocumentData, Query, onSnapshot } from "firebase/firestore";
import { useEffect, useState } from "react";
type MovieId = string;

export const useMovieList = (
  key: "wantToWatch" | "watched",
  query: Query<DocumentData, DocumentData>
) => {  
  const [isLoading, setIsLoading] = useState(false);
  const [movieList, setMovieList] = useState<Array<MovieId>>([]);

  useEffect(() => {
    setIsLoading(true);
    
    const unSub = onSnapshot(
      query,
      (querySnapshot) => {
        const nextMovies: Array<MovieId> = [];
        querySnapshot.forEach((doc) => {
          if (key === "wantToWatch") {
            nextMovies.push(doc.id);
          }
          if (key === "watched") {
            nextMovies.push(doc.data().movieId);
          }
        });
        setMovieList(nextMovies);
        setIsLoading(false);
      },
      (error) => {
        console.error(error.message);
        setIsLoading(false);
      }
    );

    return () => unSub();
  }, [key, query]);

  return { isLoading, movieList };
};
