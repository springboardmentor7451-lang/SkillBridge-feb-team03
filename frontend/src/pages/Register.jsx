import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Register.css";

const Register = () => {
  const [role, setRole] = useState("volunteer");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const validate = () => {
    let newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Full name is required";
    }

    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Enter a valid email";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Minimum 6 characters required";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (validate()) {
      if (role === "volunteer") {
        navigate("/volunteer-profile", { state: formData });
      } else {
        navigate("/ngo-profile", { state: formData });
      }
    }
  };

  return (
    <div className="register-container">
      <div className="card">
        <h2>Create Your Account</h2>

        <form onSubmit={handleSubmit} noValidate>

          <div className="input-group">
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              onChange={handleChange}
              className={errors.name ? "input-error" : ""}
            />
            {errors.name && <div className="error">{errors.name}</div>}
          </div>

          <div className="input-group">
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              onChange={handleChange}
              className={errors.email ? "input-error" : ""}
            />
            {errors.email && <div className="error">{errors.email}</div>}
          </div>

          <div className="input-group">
            <input
              type="password"
              name="password"
              placeholder="Password"
              onChange={handleChange}
              className={errors.password ? "input-error" : ""}
            />
            {errors.password && <div className="error">{errors.password}</div>}
          </div>

          <div className="input-group">
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              onChange={handleChange}
              className={errors.confirmPassword ? "input-error" : ""}
            />
            {errors.confirmPassword && (
              <div className="error">{errors.confirmPassword}</div>
            )}
          </div>

          <div className="role-section">
            <p>I am a...</p>

            <div className="role-options">
              <div
                className={`role-card ${role === "volunteer" ? "active" : ""}`}
                onClick={() => setRole("volunteer")}
              >
                👥 Volunteer
              </div>

              <div
                className={`role-card ${role === "ngo" ? "active" : ""}`}
                onClick={() => setRole("ngo")}
              >
                🏢 NGO
              </div>
            </div>
          </div>

          <button type="submit" className="register-btn">
            Sign Up
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;