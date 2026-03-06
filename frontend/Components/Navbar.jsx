import { Link } from "react-router-dom";
import "./Navbar.css";

export default function Navbar() {
  return (
    <nav className="navbar">

      {/* LEFT LOGO */}
      <div className="nav-left">
        <Link to="/" className="logo">
          SkillBridge
        </Link>
      </div>

      {/* CENTER LINKS */}
      <div className="nav-center">
        <Link to="/opportunities">Opportunities</Link>
        <Link to="/for-ngos">For NGOs</Link>
        <Link to="/about">About</Link>
      </div>

      {/* RIGHT BUTTONS */}
      <div className="nav-right">
        <Link to="/login" className="login-btn">
          Login
        </Link>

        <Link to="/register" className="get-btn">
          Get Started
        </Link>
      </div>

    </nav>
  );
}