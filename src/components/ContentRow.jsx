
import MovieCard from "./MovieCard";

function ContentRow({ title, movies }) {
  return (
    <section className="content-row">
      <h2>{title}</h2>

      <div className="movie-list">
        {movies.map((movie) => (
          <MovieCard
            key={movie.id}
            movie={movie}
          />
        ))}
      </div>
    </section>
  );
}

export default ContentRow;
