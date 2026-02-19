import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useState } from "react";

export default function Login() {
  const navigate = useNavigate();

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

      localStorage.setItem("token", res.data.token);

      navigate("/dashboard");
    } catch {
      alert("Login failed");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">

        <div className="logo">
          <span className="logo-box">SB</span>
          SkillBridge
        </div>

        <h2>Welcome back</h2>

        <p>Sign in to connect with NGOs</p>

        <form onSubmit={handleSubmit}>
          <input
            name="email"
            placeholder="Email"
            onChange={handleChange}
          />

          <input
            name="password"
            type="password"
            placeholder="Password"
            onChange={handleChange}
          />

          <button className="btn-primary">
            Sign In
          </button>
        </form>

        <p>
          Don't have an account?
          <Link to="/register"> Sign up</Link>
        </p>

      </div>
    </div>
  );
}
