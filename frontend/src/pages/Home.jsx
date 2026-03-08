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
      <section className="hero container" id="home">

        <span className="tag">
          Connecting skills with purpose
        </span>

        <h1 className="hero-title">
          Your skills can
          <span className="highlight"> change the world</span>
        </h1>

        <p className="hero-text">
          SevaSetu matches passionate volunteers with NGOs that need their expertise.
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
            <div className="feature-icon">🎯</div>
            <h3>Role-Based Profiles</h3>
            <p>Separate dashboards for volunteers and NGOs with customized tools and workflows.</p>
          </div>

          <div className="feature-card reveal">
            <div className="feature-icon">📋</div>
            <h3>Opportunity Management</h3>
            <p>Post, edit, and manage volunteer opportunities with detailed requirements.</p>
          </div>

          <div className="feature-card reveal">
            <div className="feature-icon">🔎</div>
            <h3>Smart Filtering</h3>
            <p>Find perfect matches using advanced skill, location, and availability filters.</p>
          </div>

          <div className="feature-card reveal">
            <div className="feature-icon">💬</div>
            <h3>Built-in Messaging</h3>
            <p>Communicate directly with matched volunteers and NGOs through our platform.</p>
          </div>

          <div className="feature-card reveal">
            <div className="feature-icon">📊</div>
            <h3>Application Tracking</h3>
            <p>Track all your applications and opportunities in one organized dashboard.</p>
          </div>

          <div className="feature-card reveal">
            <div className="feature-icon">🔔</div>
            <h3>Real-time Notifications</h3>
            <p>Stay updated with instant notifications for new opportunities and messages.</p>
          </div>

          <div className="feature-card reveal">
            <div className="feature-icon">⭐</div>
            <h3>Profile Enhancement</h3>
            <p>Showcase your skills, experience, and availability to stand out.</p>
          </div>

          <div className="feature-card reveal">
            <div className="feature-icon">🤝</div>
            <h3>Direct Collaboration</h3>
            <p>Connect and work together seamlessly with NGOs and volunteers.</p>
          </div>

        </div>

      </section>


      {/* Impact */}
      <section id="impact" className="impact container">
        <h2>Our Impact</h2>
        
        <div className="impact-stats">
          <div className="impact-card reveal">
            <div className="impact-number">500+</div>
            <div className="impact-label">Active Volunteers</div>
            <p>Passionate individuals making a difference</p>
          </div>
          
          <div className="impact-card reveal">
            <div className="impact-number">120+</div>
            <div className="impact-label">NGO Partners</div>
            <p>Trusted organizations across sectors</p>
          </div>
          
          <div className="impact-card reveal">
            <div className="impact-number">1000+</div>
            <div className="impact-label">Opportunities Posted</div>
            <p>Meaningful projects completed</p>
          </div>
          
          <div className="impact-card reveal">
            <div className="impact-number">50+</div>
            <div className="impact-label">Skills Categories</div>
            <p>Diverse expertise available</p>
          </div>
        </div>

        <div className="impact-content">
          <h3>Making a Real Difference</h3>
          <p>
            SevaSetu bridges the gap between skilled volunteers and NGOs that need their expertise. 
            Our platform enables meaningful collaborations that create lasting social impact. 
            Whether you're a professional looking to volunteer your skills or an NGO seeking 
            dedicated volunteers, we're here to connect you.
          </p>
          <p>
            From education and healthcare to environmental conservation and community development, 
            our volunteers are making waves across multiple sectors. Join our community today 
            and be part of something bigger.
          </p>
        </div>
      </section>

      {/* For NGOs */}
      <section id="for-ngos" className="for-ngos container">
        <h2>For NGOs</h2>
        
        <div className="ngo-benefits">
          <div className="ngo-benefit reveal">
            <div className="benefit-icon">📢</div>
            <h3>Reach Qualified Volunteers</h3>
            <p>Access a database of skilled professionals ready to contribute to your cause.</p>
          </div>
          
          <div className="ngo-benefit reveal">
            <div className="benefit-icon">⚡</div>
            <h3>Easy Opportunity Posting</h3>
            <p>Create and manage volunteer positions with detailed requirements in minutes.</p>
          </div>
          
          <div className="ngo-benefit reveal">
            <div className="benefit-icon">📱</div>
            <h3>Streamlined Applications</h3>
            <p>Review, track, and manage all applications from a single dashboard.</p>
          </div>
          
          <div className="ngo-benefit reveal">
            <div className="benefit-icon">📈</div>
            <h3>Build Your Team</h3>
            <p>Find volunteers who match your specific needs and organizational culture.</p>
          </div>
        </div>

        <div className="ngo-cta">
          <h3>Ready to Grow Your Impact?</h3>
          <p>
            Join hundreds of NGOs already using SevaSetu to find dedicated volunteers. 
            Create your organization profile today and start receiving applications from 
            passionate individuals who want to make a difference.
          </p>
          <Link to="/register" className="ngo-register-btn">
            Register as NGO →
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">

        <div className="footer-left">
          <div className="logo-box">SS</div>
          <span className="footer-brand">SevaSetu</span>
        </div>

        <p>© 2026 SevaSetu. All rights reserved.</p>

      </footer>

    </div>
  );
}

