
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import {
  getWatchlist,
  removeFromWatchlist
} from "../services/watchlist";

function MyList() {
  const { user } = useAuth();

  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadMovies() {
      try {
        const data = await getWatchlist(user.uid);
        setMovies(data);
      } catch (error) {
        console.error(error);
        setError("Unable to load your list.");
      } finally {
        setLoading(false);
      }
    }

    if (user) {
      loadMovies();
    }
  }, [user]);

  async function handleRemove(documentId) {
    try {
      await removeFromWatchlist(documentId);

      setMovies((previous) =>
        previous.filter((movie) => movie.id !== documentId)
      );
    } catch (error) {
      console.error(error);
      setError("Unable to remove movie.");
    }
  }

  if (loading) return <h2>Loading your list...</h2>;

  return (
    <div className="content-row my-list">
      <h2>My List</h2>

      {error && <p>{error}</p>}

      {movies.length === 0 ? (
        <p>Your list is empty. Add your favourite movies!</p>
      ) : (
        <div className="movie-list">
          {movies.map((movie) => (
            <div className="movie-card" key={movie.id}>
              <img
                src={
                  movie.poster_path
                    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                    : "https://placehold.co/180x260?text=No+Poster"
                }
                alt={movie.title}
              />

              <h3>{movie.title}</h3>

              <button onClick={() => handleRemove(movie.id)}>
                Remove
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MyList;
