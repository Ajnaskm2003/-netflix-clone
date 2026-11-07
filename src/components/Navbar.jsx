
import { Link } from "react-router-dom";
import Logout from "./Logout";
import { useAuth } from "../context/AuthContext";

function Navbar() {
  const { user } = useAuth();

  return (
    <nav className="navbar">
      <Link to="/" className="logo">
        NETFLIX
      </Link>

      <ul className="nav-links">
        <li><Link to="/">Home</Link></li>
        <li><Link to="/search">Search</Link></li>
        {user && <li><Link to="/my-list">My List</Link></li>}
      </ul>

      <div className="nav-right">
        {user ? (
          <Logout />
        ) : (
          <Link to="/login" className="signin-btn">
            Sign In
          </Link>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
