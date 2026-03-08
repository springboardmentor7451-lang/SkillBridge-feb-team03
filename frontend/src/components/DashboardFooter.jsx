import { Link } from "react-router-dom";
import "../styles/dashboard.css";

export default function DashboardFooter() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="dashboard-footer">
      <div className="footer-content">
        <div className="footer-brand">
          <span className="footer-logo">SS</span>
          <span>SevaSetu</span>
        </div>
        
        <div className="footer-links">
          <Link to="/">Home</Link>
          <Link to="/browse-opportunities">Opportunities</Link>
          <Link to="/messages">Messages</Link>
          <Link to="/notifications">Notifications</Link>
        </div>
        
        <div className="footer-social">
          <span>Connect with us</span>
          <div className="social-icons">
            <span>📧</span>
            <span>📱</span>
            <span>🌐</span>
          </div>
        </div>
        
        <div className="footer-copyright">
          <p>© {currentYear} SevaSetu. All rights reserved.</p>
          <p className="footer-tagline">Connecting skills with purpose</p>
        </div>
      </div>
    </footer>
  );
}

