
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import "./Navbar.css";

export default function Navbar() {
  const [activeSection, setActiveSection] = useState("home");
  const { user, isAuthenticated, logout } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      const sections = ["home", "how", "features", "impact", "for-ngos"];
      const scrollPosition = window.scrollY + 100;

      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const offsetTop = element.offsetTop;
          const offsetBottom = offsetTop + element.offsetHeight;
          
          if (scrollPosition >= offsetTop && scrollPosition < offsetBottom) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (e, sectionId) => {
    e.preventDefault();
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setActiveSection(sectionId);
    }
  };

  const scrollToTop = (e) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setActiveSection("home");
  };

  const handleLogout = () => {
    logout();
    window.location.href = "/";
  };

  return (
    <header className="navbar">
      <div className="brand">
        <Link to="/" className="brand-link" onClick={scrollToTop}>
          <h2 className="brand-name">SevaSetu</h2>
        </Link>
      </div>

      <nav className="nav-links">
        <a 
          href="#" 
          className={activeSection === "home" ? "active" : ""} 
          onClick={scrollToTop}
        >
          Home
        </a>
        <a 
          href="#features" 
          className={activeSection === "features" ? "active" : ""} 
          onClick={(e) => scrollToSection(e, 'features')}
        >
          Features
        </a>
        <a 
          href="#impact" 
          className={activeSection === "impact" ? "active" : ""} 
          onClick={(e) => scrollToSection(e, 'impact')}
        >
          Impact
        </a>
        <a 
          href="#for-ngos" 
          className={activeSection === "for-ngos" ? "active" : ""} 
          onClick={(e) => scrollToSection(e, 'for-ngos')}
        >
          For NGOs
        </a>
      </nav>

      <div className="nav-buttons">
        {isAuthenticated ? (
          <div className="user-menu">
            <Link to="/dashboard" className="user-name">
              {user?.name || "My Account"}
            </Link>
            <button onClick={handleLogout} className="btn-outline logout-btn">
              Logout
            </button>
          </div>
        ) : (
          <>
            <Link to="/login" className="btn-outline">
              Log In
            </Link>
            <Link to="/register" className="btn-primary">
              Get Started
            </Link>
          </>
        )}
      </div>
    </header>
  );
}

