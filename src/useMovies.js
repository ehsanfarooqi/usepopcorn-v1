import { useState, useEffect } from "react";

const KEY = "20f4eb3d";

export function useMovies(qeury) {
  const [movies, setMovie] = useState([]);
  const [isLoading, setIsloading] = useState(false);
  const [error, setError] = useState("");

  useEffect(
    function () {
      async function fetchMovies() {
        setIsloading(true);
        setError("");

        try {
          const res = await fetch(
            `http://www.omdbapi.com/?apikey=${KEY}&s=${qeury}`
          );
          if (!res.ok)
            throw new Error("Somthing wnr wrong with fetching movies!");

          const data = await res.json();
          if (data.Response === "False") throw new Error("Movie not found");

          setMovie(data.Search);
          setError("");
        } catch (err) {
          setError(err.message);
        } finally {
          setIsloading(false);
        }
      }
      if (qeury.length < 3) {
        setMovie([]);
        setError("");

        return;
      }
      //   handleCloseMovie();
      fetchMovies();
    },
    [qeury]
  );
  return { movies, isLoading, error };
}
