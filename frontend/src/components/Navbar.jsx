import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import NotificationBell from "./NotificationBell";
import "../styles/navbar.css";

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="navbar">
      {/* Left: Logo */}
      <div className="nav-left">
        <div className="logo-box">SB</div>
        <Link to="/" className="navbar-logo-text">
          SkillBridge
        </Link>
      </div>

      {/* Middle: Navigation Links (only when authenticated) */}
      {/* center links vary based on auth state */}
      {isAuthenticated ? (
        <div className="nav-center">
          <Link to="/dashboard" className={`nav-link ${isActive("/dashboard") ? "active" : ""}`}>
            Dashboard
          </Link>
          <Link to={user?.role === "ngo" ? "/opportunities" : "/browse-opportunities"} className={`nav-link ${isActive("/opportunities") || isActive("/browse-opportunities") ? "active" : ""}`}>
            Opportunity
          </Link>
          <Link to="/applications" className={`nav-link ${isActive("/applications") ? "active" : ""}`}>
            Applications
          </Link>
          <Link to="/messages" className={`nav-link ${isActive("/messages") ? "active" : ""}`}>
            Message
          </Link>
          <Link to="/profile" className={`nav-link ${isActive("/profile") ? "active" : ""}`}>
            Profile
          </Link>
        </div>
      ) : (
        <div className="nav-center">
          <a href="#how" className="nav-link">
            How it Works
          </a>
          <a href="#features" className="nav-link">
            Features
          </a>
          <a href="#impact" className="nav-link">
            Impact
          </a>
          <a href="#for-ngos" className="nav-link">
            For NGOs
          </a>
        </div>
      )}

      {/* Right: User Info & Action */}
      <div className="nav-right">
        {!isAuthenticated ? (
          <>
            <Link to="/login" className="login-btn">
              Log In
            </Link>
            <Link to="/register" className="primary-btn">
              Get Started
            </Link>
          </>
        ) : (
          <>
            <NotificationBell />
            <div className="user-menu">
              <div className="user-info">
                <span className="user-name">{user?.name}</span>
                <span className="user-role">{user?.role === "ngo" ? "NGO" : "Volunteer"}</span>
              </div>
              <button onClick={handleLogout} className="sign-out-btn">
                Sign Out
              </button>
            </div>
          </>
        )}
      </div>
    </nav>
  );
}
