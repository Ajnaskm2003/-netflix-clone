
import { useEffect, useState } from "react";

import {
  BrowserRouter,
  Routes,
  Route
} from "react-router-dom";

// Components
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import ContentRow from "./components/ContentRow";
import ProtectedRoute from "./components/ProtectedRoute";
import Footer from "./components/Footer";

// Pages
import MovieDetails from "./pages/MovieDetails";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Search from "./pages/Search";
import MyList from "./pages/MyList";

// Context
import { AuthProvider } from "./context/AuthContext";

// TMDB API
import {
  getPopularMovies,
  getTrendingMovies
} from "./services/tmdb";

import "./App.css";

// HOME PAGE
function Home() {
  const [popularMovies, setPopularMovies] = useState([]);
  const [trendingMovies, setTrendingMovies] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchMovies() {
      try {
        const [popular, trending] = await Promise.all([
          getPopularMovies(),
          getTrendingMovies()
        ]);

        setPopularMovies(popular.results || []);
        setTrendingMovies(trending.results || []);

      } catch (error) {
        console.error("Movie fetching error:", error);
        setError("Unable to load movies. Please try again.");

      } finally {
        setLoading(false);
      }
    }

    fetchMovies();
  }, []);

  return (
    <>
      <Navbar />
      <Hero />

      {loading && <p>Loading movies...</p>}

      {error && <p>{error}</p>}

      {!loading && !error && (
        <>
          <ContentRow
            title="Trending Now"
            movies={trendingMovies}
          />

          <ContentRow
            title="Popular on Netflix"
            movies={popularMovies}
          />
        </>
      )}
      <Footer />
    </>
  );
}

// MAIN APP
function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>

          {/* HOME PAGE - PUBLIC */}
          <Route
            path="/"
            element={<Home />}
          />

          {/* MOVIE DETAILS - PROTECTED */}
          <Route
            path="/movie/:id"
            element={
              <ProtectedRoute>
                <>
                  <Navbar />
                  <MovieDetails />
                </>
              </ProtectedRoute>
            }
          />

          {/* LOGIN PAGE */}
          <Route
            path="/login"
            element={<Login />}
          />

          {/* REGISTER PAGE */}
          <Route
            path="/register"
            element={<Register />}
          />

          {/* SEARCH PAGE */}
          <Route
            path="/search"
            element={
              <>
                <Navbar />
                <Search />
              </>
            }
          />

          {/* MY LIST - PROTECTED */}
          <Route
            path="/my-list"
            element={
              <ProtectedRoute>
                <>
                  <Navbar />
                  <MyList />
                </>
              </ProtectedRoute>
            }
          />

        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
