import { useNavigate } from "react-router-dom";
import "./Landing.css";

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="landing">

      {/* Navbar */}
      <nav className="navbar">
        <h2 className="logo">
          Skill<span>Build</span>
        </h2>

        <div className="nav-links">
          <a href="#">Home</a>
          <a href="#">About</a>
          <a onClick={() => navigate("/register")}>Register</a>
          <a onClick={() => navigate("/login")}>Login</a>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="hero">
        <h1>Learn. Volunteer. Grow.</h1>

        <p>
          SkillBuild connects learners with volunteers to share knowledge
          and build a stronger community.
        </p>

        <div className="hero-buttons">
          <button
            className="primary-btn"
            onClick={() => navigate("/register")}
          >
            Get Started
          </button>

          <button
            className="outline-btn"
            onClick={() => navigate("/register")}
          >
            Become a Volunteer
          </button>
        </div>
      </div>

    </div>
  );
};

export default Landing;