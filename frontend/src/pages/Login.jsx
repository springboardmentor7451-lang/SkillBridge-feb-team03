import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import "../styles/login.css";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(
        "http://localhost:5000/api/auth/login",
        form
      );

      const { token, user } = res.data;
      login(token, user);
      navigate("/dashboard");
    } catch (err) {
      console.error("Login error", err.response || err);
      const msg = err.response?.data?.message || "Login failed";
      alert(msg);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <Link to="/" className="back-link">
          ← Back to home
        </Link>

        <div className="auth-card">
          <div className="logo">
            <span className="logo-box">SB</span>
            SkillBridge
          </div>

          <h2>Welcome back</h2>

          <p className="subtitle">Sign in to connect with NGOs</p>

          <form onSubmit={handleSubmit}>
            <input
              name="email"
              placeholder="Email"
              onChange={handleChange}
              required
            />

            <input
              name="password"
              type="password"
              placeholder="Password"
              onChange={handleChange}
              required
            />

            <button type="submit" className="btn-primary">
              Sign In
            </button>
          </form>

          <p className="login-link">
            Don't have an account?
            <Link to="/register"> Sign up</Link>
          </p>
        </div>
      </div>
    </div>
  );
}