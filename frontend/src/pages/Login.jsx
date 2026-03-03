import React, { useState } from "react";
import "./Login.css";

function Login() {
  const [role, setRole] = useState("volunteer");
  const [showPassword, setShowPassword] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [errors, setErrors] = useState({});

  const validate = () => {
    let newErrors = {};

    if (!email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Enter a valid email address";
    }

    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (validate()) {
      alert("Login Successful 🎉");
      console.log({ role, email, password });
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">

        <h2>Welcome Back</h2>
        <p className="subtitle">
          Sign in as {role === "volunteer" ? "Volunteer" : "NGO"}
        </p>

        <div className="role-toggle">
          <button
            type="button"
            className={role === "volunteer" ? "active" : ""}
            onClick={() => setRole("volunteer")}
          >
            Volunteer
          </button>

          <button
            type="button"
            className={role === "ngo" ? "active" : ""}
            onClick={() => setRole("ngo")}
          >
            NGO
          </button>
        </div>

        <form onSubmit={handleSubmit}>

          <div className="input-group">
            <input
              type="text"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={errors.email ? "input-error" : ""}
            />
            {errors.email && <div className="error">{errors.email}</div>}
          </div>

          <div className="input-group">
            <div className="password-field">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={errors.password ? "input-error" : ""}
              />
              <span
                className="toggle"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? "Hide" : "Show"}
              </span>
            </div>
            {errors.password && <div className="error">{errors.password}</div>}
          </div>

          <button type="submit" className="login-btn">
            Sign In
          </button>

        </form>

        <div className="extra-links">
          <a href="#">Forgot Password?</a>
          <p>
            Don’t have an account? <a href="/Register">Sign Up</a>
          </p>
        </div>

      </div>
    </div>
  );
}

export default Login;