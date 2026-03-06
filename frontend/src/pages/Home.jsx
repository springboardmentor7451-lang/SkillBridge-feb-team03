import { Link } from "react-router-dom";
import { useEffect } from "react";
import Navbar from "../components/Navbar";
import { useAuth } from "../context/AuthContext";
import "../styles/home.css";

export default function Home() {
  const { isAuthenticated, logout } = useAuth();

  // If a token exists when landing on home, clear it so user starts logged out
  useEffect(() => {
    if (isAuthenticated) logout();
  }, [isAuthenticated, logout]);

  // add scroll reveal
  useEffect(() => {
    const revealElements = document.querySelectorAll('.reveal');
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('active');
          }
        });
      },
      { threshold: 0.2 }
    );

    revealElements.forEach((el) => observer.observe(el));

    return () => {
      revealElements.forEach((el) => observer.unobserve(el));
    };
  }, []);

  return (
    <div className="home">

      <Navbar />

      {/* Hero Section */}
      <section className="hero container">

        <span className="tag">
          Connecting skills with purpose
        </span>

        <h1 className="hero-title">
          Your skills can
          <span className="highlight"> change the world</span>
        </h1>

        <p className="hero-text">
          SkillBridge matches passionate volunteers with NGOs that need their expertise.
          Find meaningful work that makes a real difference.
        </p>

        <Link to="/register" className="primary-btn">
          Find Opportunities →
        </Link>

      </section>


      {/* How it Works */}
      <section className="how-section" id="how">

        <h2>How It Works</h2>

        <div className="how-grid">

          <div className="how-card reveal">
            <div className="icon">👤</div>
            <h3>Create Your Profile</h3>
            <p>
              Sign up as a volunteer or NGO and showcase your skills or needs.
            </p>
          </div>

          <div className="how-card reveal">
            <div className="icon">🔍</div>
            <h3>Find Opportunities</h3>
            <p>
              Browse and filter opportunities by skills, location, and duration.
            </p>
          </div>

          <div className="how-card reveal">
            <div className="icon">💬</div>
            <h3>Connect & Collaborate</h3>
            <p>
              Apply, get matched, and communicate directly through the platform.
            </p>
          </div>

        </div>

      </section>


      {/* Features */}
      <section id="features" className="features container">

        <h2>Platform Features</h2>

        <div className="feature-grid">

          <div className="feature-card reveal">
            <h3>Role-Based Profiles</h3>
            <p>Separate dashboards for volunteers and NGOs.</p>
          </div>

          <div className="feature-card reveal">
            <h3>NGO Opportunities</h3>
            <p>Post and manage volunteer opportunities easily.</p>
          </div>

          <div className="feature-card reveal">
            <h3>Smart Filtering</h3>
            <p>Find perfect match using skill and location filters.</p>
          </div>

          <div className="feature-card reveal">
            <h3>Built-in Messaging</h3>
            <p>Communicate directly with matched users.</p>
          </div>

        </div>

      </section>


      {/* Impact (placeholder) */}
      <section id="impact" className="impact container">
        <h2>Impact</h2>
        <p>Discover the change our volunteers have made.</p>
      </section>

      {/* For NGOs (placeholder) */}
      <section id="for-ngos" className="for-ngos container">
        <h2>For NGOs</h2>
        <p>Learn how NGOs can post opportunities and collaborate.</p>
      </section>

      {/* Footer */}
      <footer className="footer">

        <div className="footer-left">
          <div className="logo-box">SkillBridge</div>
          
        </div>

        <p>© 2026 SkillBridge. All rights reserved.</p>

      </footer>

    </div>
  );
}
