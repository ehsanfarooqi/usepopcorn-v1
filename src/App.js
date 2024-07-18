import { useEffect, useRef, useState } from "react";
import StarRating from "./StarRating";
import { useMovies } from "./useMovies";
import { useLocalStorageState } from "./useLocalStorageState";
import { useKey } from "./useKey";

// Calculate the average
const average = (arr) =>
  arr.reduce((acc, curr, i, arr) => acc + curr / arr.length, 0);

const KEY = "20f4eb3d";

// App Component
export default function App() {
  const [qeury, setQeury] = useState("");
  const [selectedId, setSelectedId] = useState(null);
  const { movies, isLoading, error } = useMovies(qeury);

  const [watched, setWatched] = useLocalStorageState([], "watched");

  // Select movies by ID
  function handleSelectedMovie(id) {
    setSelectedId((selectedId) => (id === selectedId ? null : id));
  }

  // OnClick movie to close
  function handleCloseMovie() {
    setSelectedId(null);
  }

  // Add movies to wached list
  function handleAddWatched(movie) {
    setWatched((watched) => [...watched, movie]);

    // localStorage.setItem("watched", JSON.stringify([...watched, movie]));
  }

  // Delete movie by ID from the wached list
  function handleDeleteWatched(id) {
    setWatched((watched) => watched.filter((movie) => movie.imdbID !== id));
  }

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
                <WatchedList
                  watched={watched}
                  onDeleteWatched={handleDeleteWatched}
                />
              </>
            )}
          </Box>
        </Main>
      </>
    </div>
  );
}

// Loader component
function Loader() {
  return <p className="loader">Loadin...</p>;
}

// Error component
function ErrorMessage({ message }) {
  return (
    <p className="error">
      <span>🔴 {message}</span>
    </p>
  );
}

// NavBar Component
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
  const inputEL = useRef(null);

  useKey("Enter", function () {
    if (document.activeElement === inputEL.current) return;
    inputEL.current.focus();
    setQeury("");
  });

  // useEffect(
  //   function () {
  //     function callback(e) {
  //       if (document.activeElement === inputEL.current) return;

  //       if (e.code === "Enter") {
  //         inputEL.current.focus();
  //         setQeury("");
  //       }
  //     }

  //     document.addEventListener("keydown", callback);

  //     // Clean Up
  //     return () => document.addEventListener("keydown", callback);
  //   },
  //   [setQeury]
  // );

  return (
    <input
      className="search"
      type="text"
      placeholder="Search movies..."
      value={qeury}
      onChange={(e) => setQeury(e.target.value)}
      ref={inputEL}
    />
  );
}

function MoviesResult({ movies }) {
  return (
    <p className="num-result">
      Found <strong>{movies.length}</strong> Result
    </p>
  );
}

// Main component
function Main({ children }) {
  return <div className="main">{children}</div>;
}

// Box component
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

// Movie list component
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

// List component
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

// Movie details componenet
function MovieDetails({ selectedId, onClose, onAddWatched, watched }) {
  const [movie, setMovie] = useState({});
  const [userRating, setUserRating] = useState("");
  const [isLoadin, setIsLoading] = useState(false);

  const countRef = useRef(0);

  useEffect(
    function () {
      if (userRating) countRef.current = countRef.current + 1;
    },
    [userRating]
  );

  const isWatched = watched.map((movie) => movie.imdbID).includes(selectedId);
  const watchedUserRating = watched.find(
    (movie) => movie.imdbID === selectedId
  )?.userRating;

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

  // if (imdbRating > 8) [isTop, setIsTop] = useState(true);

  // const [isTop, setIsTop] = useState(imdbRating > 8);
  // console.log(isTop);
  // useEffect(
  //   function () {
  //     setIsTop(imdbRating > 8);
  //   },
  //   [imdbRating]
  // );

  const isTop = imdbRating > 8;
  console.log(isTop);

  // Create new object for wached movie data
  function handleAdd() {
    const newWatched = {
      imdbID: selectedId,
      title,
      year,
      poster,
      imdbRating: Number(imdbRating),
      runtime: Number(runtime.split(" ").at(0)),
      userRating,
      coutnRatingDesation: countRef.current,
    };
    onAddWatched(newWatched);
    onClose();
  }

  // Fetch movie data from API by ID
  useEffect(
    function () {
      async function getMoviesDetails() {
        setIsLoading(true);
        const res = await fetch(
          `http://www.omdbapi.com/?apikey=${KEY}&i=${selectedId}`
        );
        const data = await res.json();
        setMovie(data);
        setIsLoading(false);
      }
      getMoviesDetails();
    },
    [selectedId]
  );

  // Key Event
  useKey("Escape", onClose);

  // Change app title when on of movie selected
  useEffect(
    function () {
      document.title = `movie | ${title}`;

      // Clean up
      return function () {
        document.title = "UsePopcorn";
      };
    },
    [title]
  );

  return (
    <div className="details">
      {isLoadin ? (
        <Loader />
      ) : (
        <>
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
                <p>
                  You rated with movie {watchedUserRating} <span>⭐️</span>
                </p>
              )}
            </div>
            <p>
              <em>{plot}</em>
            </p>
            <p>Starring {actors}</p>
            <p>Directed by {director}</p>
          </section>
        </>
      )}
    </div>
  );
}

// Watche movie summary component
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

// Watched movie list component
function WatchedList({ watched, onDeleteWatched }) {
  return (
    <ul className="list">
      {watched.map((movie) => (
        <WatchedMovie
          movie={movie}
          key={movie.imdbID}
          onDeleteWatched={onDeleteWatched}
        />
      ))}
    </ul>
  );
}

// watched list componenet
function WatchedMovie({ movie, onDeleteWatched }) {
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
      <button
        className="btn-delete"
        onClick={() => onDeleteWatched(movie.imdbID)}
      >
        x
      </button>
    </li>
  );
}
