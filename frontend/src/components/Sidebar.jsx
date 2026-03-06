import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../styles/dashboard.css";

export default function Sidebar() {
  const { user, logout } = useAuth();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;
  const oppPath = user?.role === "ngo" ? "/opportunities" : "/browse-opportunities";

  return (
    <div className="sidebar">
      <div className="logo">
        <div className="logo-box">SB</div>
        SkillBridge
      </div>

      {user && (
        <div className="profile">
          {/* placeholder avatar if none provided */}
          <img
            src={user.avatar || "https://i.pravatar.cc/40"}
            alt="profile"
          />
          <div>
            <p>{user.name}</p>
            <small>{user.role === "ngo" ? "NGO" : "Volunteer"}</small>
          </div>
        </div>
      )}

      <ul>
        <li className={isActive("/dashboard") ? "active" : ""}>
          <Link to="/dashboard">Dashboard</Link>
        </li>
        <li className={isActive(oppPath) ? "active" : ""}>
          <Link to={oppPath}>Opportunities</Link>
        </li>
        <li className={isActive("/applications") ? "active" : ""}>
          <Link to="/applications">Applications</Link>
        </li>
        <li className={isActive("/messages") ? "active" : ""}>
          <Link to="/messages">Messages</Link>
        </li>
      </ul>

      <p className="logout">
        <button onClick={logout} className="logout-btn">
          Sign out
        </button>
      </p>
    </div>
  );
}
