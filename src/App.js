import { useState } from "react";

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

export default function App() {
  return (
    <div>
      <NavBar />
      <Main />
    </div>
  );
}

function NavBar() {
  return (
    <nav className="nav-bar">
      <Logo />
      <Search />
      <MoviesResult />
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

function Search() {
  const [qeury, setQeury] = useState("");
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

function MoviesResult() {
  return (
    <p className="num-result">
      Foun <strong>X</strong> Result
    </p>
  );
}

function Main() {
  return (
    <div className="main">
      <MovieBox />
      <WatchedBox />
    </div>
  );
}

function MovieBox() {
  const [movies, setMovie] = useState(tempMovieData);
  const [isopen1, setIsOpen1] = useState(true);
  return (
    <div className="box">
      <button
        className="btn-toggle"
        onClick={() => setIsOpen1((open) => !open)}
      >
        {isopen1 ? "- " : "+"}
      </button>

      {isopen1 && <MoviesList movies={movies} />}
    </div>
  );
}

function MoviesList({ movies }) {
  return (
    <ul className="list">
      {movies?.map((movie) => (
        <Movie movie={movie} key={movie.imdbID} />
      ))}
    </ul>
  );
}

function Movie({ movie }) {
  return (
    <li>
      <img src={movie.Poster} alt={`${movie.Title} poster`} />
      <h3>{movie.Title}</h3>
      <div>
        <span>📆</span>
        <span>{movie.Year}</span>
      </div>
    </li>
  );
}

function WatchedBox() {
  const [watched, setWatched] = useState(tempWatchedData);
  return (
    <div className="box">
      <button className="btn-toggle">-</button>
      <WatchedSummary watched={watched} />
      <WatchedList watched={watched} />
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
          <span>{avgImdbRating}</span>
        </p>
        <p>
          <span>⭐️</span>
          <span>{avgUserRating}</span>
        </p>
        <p>
          <span>⏳</span>
          <span>{avgRunTime} min</span>
        </p>
      </div>
    </div>
  );
}

function WatchedMovie({ movie }) {
  return (
    <li>
      <img src={movie.Poster} alt={`${movie.Title} poster`} />
      <h3>{movie.Title}</h3>
      <div>
        <p>
          <span>⭐️</span>
          <span>4.4</span>
        </p>
        <p>
          <span>⭐️</span>
          <span>8</span>
        </p>
        <p>
          <span>⏳</span>
          <span>124 min</span>
        </p>
      </div>
    </li>
  );
}
