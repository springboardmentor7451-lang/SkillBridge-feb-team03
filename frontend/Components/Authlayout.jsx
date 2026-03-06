import Navbar from "../components/Navbar";
import "./AuthLayout.css";

export default function AuthLayout({ children }) {
  return (
    <div className="auth-layout">

      <Navbar />

      <div className="auth-wrapper">

        <div className="auth-card">

          <h2 className="auth-title">SkillBridge</h2>

          {children}

        </div>

      </div>

    </div>
  );
}