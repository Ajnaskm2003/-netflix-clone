
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { useAuth } from "../context/AuthContext";
import { addToWatchlist } from "../services/watchlist";

function MovieDetails() {
  const { id } = useParams();

  const { user } = useAuth();

  const [movie, setMovie] = useState(null);
  const [trailer, setTrailer] = useState(null);
  const [showTrailer, setShowTrailer] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  // FETCH MOVIE DETAILS AND TRAILER
  useEffect(() => {
    async function fetchDetails() {
      setLoading(true);

      try {
        const token = import.meta.env.VITE_TMDB_ACCESS_TOKEN;

        const options = {
          headers: {
            accept: "application/json",
            Authorization: `Bearer ${token}`
          }
        };

        const [movieResponse, videoResponse] = await Promise.all([
          fetch(`https://api.themoviedb.org/3/movie/${id}`, options),
          fetch(`https://api.themoviedb.org/3/movie/${id}/videos`, options)
        ]);

        if (!movieResponse.ok || !videoResponse.ok) {
          throw new Error("Failed to fetch movie details");
        }

        const movieData = await movieResponse.json();
        const videoData = await videoResponse.json();

        setMovie(movieData);

        const officialTrailer = videoData.results.find(
          (video) =>
            video.site === "YouTube" &&
            video.type === "Trailer" &&
            video.official
        );

        const anyTrailer = videoData.results.find(
          (video) =>
            video.site === "YouTube" &&
            video.type === "Trailer"
        );

        setTrailer(officialTrailer || anyTrailer || null);

      } catch (error) {
        console.error("Movie details error:", error);
        setMovie(null);

      } finally {
        setLoading(false);
      }
    }

    fetchDetails();
  }, [id]);

  // ADD MOVIE TO MY LIST
  async function handleAddToList() {
    if (!user) {
      setMessage("Please login to add movies to My List.");
      return;
    }

    if (!movie) return;

    setSaving(true);
    setMessage("");

    try {
      await addToWatchlist(user.uid, movie);
      setMessage("Movie added to My List successfully!");
    } catch (error) {
      console.error("Watchlist error:", error);
      setMessage("Unable to add movie. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  // LOADING
  if (loading) {
    return <h2>Loading movie...</h2>;
  }

  // ERROR
  if (!movie) {
    return <h2>Movie not found.</h2>;
  }

  return (
    <div
      className="movie-details"
      style={{
        backgroundImage: `
          linear-gradient(to right, #111, transparent),
          linear-gradient(to top, #111, transparent),
          url(https://image.tmdb.org/t/p/original${movie.backdrop_path})
        `
      }}
    >
      <div className="details-content">

        <h1>{movie.title}</h1>

        <p>Release Date: {movie.release_date}</p>

        <p>
          Rating: ⭐ {movie.vote_average?.toFixed(1)}/10
        </p>

        <p>{movie.overview}</p>

        <div className="details-buttons">

          {/* PLAY TRAILER */}
          <button
            onClick={() => setShowTrailer(true)}
            disabled={!trailer}
          >
            ▶ Play Trailer
          </button>

          {/* ADD TO MY LIST */}
          <button
            onClick={handleAddToList}
            disabled={saving}
          >
            {saving ? "Adding..." : "+ My List"}
          </button>

        </div>

        {message && <p>{message}</p>}

        {!trailer && <p>Trailer not available.</p>}

      </div>

      {/* TRAILER MODAL */}
      {showTrailer && trailer && (
        <div className="trailer-overlay">

          <button
            className="close-trailer"
            onClick={() => setShowTrailer(false)}
          >
            ✕
          </button>

          <iframe
            src={`https://www.youtube.com/embed/${trailer.key}?autoplay=1`}
            title="Movie Trailer"
            allow="autoplay; encrypted-media; fullscreen"
            allowFullScreen
          />

        </div>
      )}

    </div>
  );
}

export default MovieDetails;
