import { useEffect, useState } from "react";
import StarRating from "./StarRating";

const tempMovieData = [
  {
    imdbID: "tt1375666",
    Title: "Inception",
    Year: "2010",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg",
  },
  {
    imdbID: "tt0133093",
    Title: "The Matrix",
    Year: "1999",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BNzQzOTk3OTAtNDQ0Zi00ZTVkLWI0MTEtMDllZjNkYzNjNTc4L2ltYWdlXkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_SX300.jpg",
  },
  {
    imdbID: "tt6751668",
    Title: "Parasite",
    Year: "2019",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BYWZjMjk3ZTItODQ2ZC00NTY5LWE0ZDYtZTI3MjcwN2Q5NTVkXkEyXkFqcGdeQXVyODk4OTc3MTY@._V1_SX300.jpg",
  },
];

const tempWatchedData = [
  {
    imdbID: "tt1375666",
    Title: "Inception",
    Year: "2010",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg",
    runtime: 148,
    imdbRating: 8.8,
    userRating: 10,
  },
  {
    imdbID: "tt0088763",
    Title: "Back to the Future",
    Year: "1985",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BZmU0M2Y1OGUtZjIxNi00ZjBkLTg1MjgtOWIyNThiZWIwYjRiXkEyXkFqcGdeQXVyMTQxNzMzNDI@._V1_SX300.jpg",
    runtime: 116,
    imdbRating: 8.5,
    userRating: 9,
  },
];

const average = (arr) =>
  arr.reduce((acc, curr, i, arr) => acc + curr / arr.length, 0);

const KEY = "20f4eb3d";

export default function App() {
  const [qeury, setQeury] = useState("");
  const [movies, setMovie] = useState([]);
  const [watched, setWatched] = useState([]);
  const [isLoading, setIsloading] = useState(false);
  const [error, setError] = useState("");
  const [selectedId, setSelectedId] = useState(null);

  function handleSelectedMovie(id) {
    setSelectedId((selectedId) => (id === selectedId ? null : id));
  }

  function handleCloseMovie() {
    setSelectedId(null);
  }

  function handleAddWatched(movie) {
    setWatched((watched) => [...watched, movie]);
  }

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
      fetchMovies();
    },
    [qeury]
  );

  return (
    <div>
      <>
        <NavBar>
          <Search qeury={qeury} setQeury={setQeury} />
          <MoviesResult movies={movies} />
        </NavBar>

        <Main>
          <Box>
            {/* {isLoading ? <Loader /> : <MoviesList movies={movies} />} */}
            {isLoading && <Loader />}
            {!isLoading && !error && (
              <MoviesList
                movies={movies}
                onSelectedMovie={handleSelectedMovie}
              />
            )}
            {error && <ErrorMessage message={error} />}
          </Box>

          <Box>
            {selectedId ? (
              <MovieDetails
                selectedId={selectedId}
                onClose={handleCloseMovie}
                onAddWatched={handleAddWatched}
                watched={watched}
              />
            ) : (
              <>
                <WatchedSummary watched={watched} />
                <WatchedList watched={watched} />
              </>
            )}
          </Box>
        </Main>
      </>
    </div>
  );
}

function Loader() {
  return <p className="loader">Loadin...</p>;
}

function ErrorMessage({ message }) {
  return (
    <p className="error">
      <span>🔴 {message}</span>
    </p>
  );
}

function NavBar({ children }) {
  return (
    <nav className="nav-bar">
      <Logo />
      {children}
    </nav>
  );
}

function Logo() {
  return (
    <div className="logo">
      <span role="img">🍿</span>
      <h1>UsePopcorn</h1>
    </div>
  );
}

function Search({ qeury, setQeury }) {
  return (
    <input
      className="search"
      type="text"
      placeholder="Search movies..."
      value={qeury}
      onChange={(e) => setQeury(e.target.value)}
    />
  );
}

function MoviesResult({ movies }) {
  return (
    <p className="num-result">
      Foun <strong>{movies.length}</strong> Result
    </p>
  );
}

function Main({ children }) {
  return <div className="main">{children}</div>;
}

function Box({ children }) {
  const [isopen, setIsOpen] = useState(true);
  return (
    <div className="box">
      <button className="btn-toggle" onClick={() => setIsOpen((open) => !open)}>
        {isopen ? "- " : "+"}
      </button>

      {isopen && children}
    </div>
  );
}

function MoviesList({ movies, onSelectedMovie }) {
  return (
    <ul className="list list-movies">
      {movies?.map((movie) => (
        <Movie
          movie={movie}
          key={movie.imdbID}
          onSelectedMovie={onSelectedMovie}
        />
      ))}
    </ul>
  );
}

function Movie({ movie, onSelectedMovie }) {
  return (
    <li onClick={() => onSelectedMovie(movie.imdbID)}>
      <img src={movie.Poster} alt={`${movie.Title} poster`} />
      <h3>{movie.Title}</h3>
      <div>
        <span>📆</span>
        <span>{movie.Year}</span>
      </div>
    </li>
  );
}

function MovieDetails({ selectedId, onClose, onAddWatched, watched }) {
  const [movie, setMovie] = useState({});
  const [userRating, setUserRating] = useState("");

  const isWatched = watched.map((movie) => movie.imdbID).includes(selectedId);

  const {
    Title: title,
    Year: year,
    Poster: poster,
    Runtime: runtime,
    Plot: plot,
    Genre: genre,
    Released: released,
    Actors: actors,
    Director: director,
    imdbRating,
  } = movie;

  function handleAdd() {
    const newWatched = {
      imdbID: selectedId,
      title,
      year,
      poster,
      imdbRating: Number(imdbRating),
      runtime: Number(runtime.split(" ").at(0)),
      userRating,
    };
    onAddWatched(newWatched);
    onClose();
  }

  useEffect(
    function () {
      async function getMoviesDetails() {
        const res = await fetch(
          `http://www.omdbapi.com/?apikey=${KEY}&i=${selectedId}`
        );
        const data = await res.json();
        setMovie(data);
        console.log(data);
      }
      getMoviesDetails();
    },
    [selectedId]
  );

  return (
    <div className="details">
      <header>
        <button className="btn-back" onClick={() => onClose()}>
          &larr;
        </button>
        <img src={poster} alt={`poster of ${movie} movies`} />
        <div className="details-overview">
          <h2>{title}</h2>
          <p>
            {released} &bull; {runtime}
          </p>
          <p>{genre}</p>
          <p>
            <span>⭐️</span>
            {imdbRating} IMDb imdbRating
          </p>
        </div>
      </header>
      <section>
        <div className="rating">
          {!isWatched ? (
            <>
              <StarRating
                size={22}
                maxRating={10}
                onSetRating={setUserRating}
              />
              <button className="btn-add" onClick={handleAdd}>
                + add to list
              </button>
            </>
          ) : (
            <p>You rated with movie</p>
          )}
        </div>
        <p>
          <em>{plot}</em>
        </p>
        <p>Starring {actors}</p>
        <p>Directed by {director}</p>
      </section>
    </div>
  );
}

function WatchedList({ watched }) {
  return (
    <ul className="list">
      {watched.map((movie) => (
        <WatchedMovie movie={movie} key={movie.imdbID} />
      ))}
    </ul>
  );
}

function WatchedSummary({ watched }) {
  const avgImdbRating = average(watched.map((movie) => movie.imdbRating));
  const avgUserRating = average(watched.map((movie) => movie.userRating));
  const avgRunTime = average(watched.map((movie) => movie.runtime));

  return (
    <div className="summary">
      <h2>Movie you Watched</h2>
      <div>
        <p>
          <span>﹟</span>
          <span>{watched.length}</span>
        </p>
        <p>
          <span>⭐️</span>
          <span>{avgImdbRating.toFixed(2)}</span>
        </p>
        <p>
          <span>⭐️</span>
          <span>{avgUserRating.toFixed(2)}</span>
        </p>
        <p>
          <span>⏳</span>
          <span>{avgRunTime.toFixed(2)} min</span>
        </p>
      </div>
    </div>
  );
}

function WatchedMovie({ movie }) {
  return (
    <li>
      <img src={movie.poster} alt={`${movie.title} poster`} />
      <h3>{movie.title}</h3>
      <div>
        <p>
          <span>⭐️</span>
          <span>{movie.imdbRating}</span>
        </p>
        <p>
          <span>⭐️</span>
          <span>{movie.userRating}</span>
        </p>
        <p>
          <span>⏳</span>
          <span>{movie.runtime} min</span>
        </p>
      </div>
    </li>
  );
}
