import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getTrendingMovies } from "../services/tmdb";
import Footer from "../components/Footer";

function Search() {
  const [searchTerm, setSearchTerm] = useState("");
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  // Load trending movies when the page opens
  useEffect(() => {
    async function loadTrendingMovies() {
      try {
        const data = await getTrendingMovies();
        setMovies(data.results || []);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    loadTrendingMovies();
  }, []);

  // Search movies when typing
  useEffect(() => {
    if (!searchTerm.trim()) return;

    const timer = setTimeout(async () => {
      try {
        setLoading(true);

        const token = import.meta.env.VITE_TMDB_ACCESS_TOKEN;

        const response = await fetch(
          `https://api.themoviedb.org/3/search/movie?query=${encodeURIComponent(searchTerm)}`,
          {
            headers: {
              accept: "application/json",
              Authorization: `Bearer ${token}`
            }
          }
        );

        if (!response.ok) throw new Error("Search failed");

        const data = await response.json();
        setMovies(data.results || []);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  return (
    <div className="search-page">
      <input
        type="text"
        placeholder="Search movies..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      <h2>{searchTerm ? "Search Results" : "Trending Movies"}</h2>

      {loading ? (
        <p>Loading movies...</p>
      ) : movies.length === 0 ? (
        <p>No movies found.</p>
      ) : (
        <div className="movie-list">
          {movies.map((movie) => (
            <div
              className="movie-card"
              key={movie.id}
              onClick={() => navigate(`/movie/${movie.id}`)}
            >
              <img
                src={
                  movie.poster_path
                    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                    : "https://placehold.co/180x260?text=No+Poster"
                }
                alt={movie.title}
              />
              <h3>{movie.title}</h3>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Search;