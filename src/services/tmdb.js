
const BASE_URL = "https://api.themoviedb.org/3";

const options = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization: `Bearer ${import.meta.env.VITE_TMDB_ACCESS_TOKEN}`
  }
};

export async function getPopularMovies() {
  const response = await fetch(`${BASE_URL}/movie/popular`, options);

  if (!response.ok) {
    throw new Error("Failed to fetch popular movies");
  }

  return response.json();
}

export async function getTrendingMovies() {
  const response = await fetch(`${BASE_URL}/trending/movie/week`, options);

  if (!response.ok) {
    throw new Error("Failed to fetch trending movies");
  }

  return response.json();
}
