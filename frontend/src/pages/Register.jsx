import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/register.css";
import axios from "axios";

export default function Register() {

  const navigate = useNavigate();

  const [role, setRole] = useState("volunteer");

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    skills: "",
    bio: "",
    organization_name: "",
    organization_description: "",
    website_url: ""
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {

    e.preventDefault();

    if (form.password !== form.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    setLoading(true);

    try {

      await axios.post(
        "http://localhost:5000/api/auth/register",
        {
          name: form.name,
          email: form.email,
          password: form.password,
          role: role,
          skills: form.skills.split(","),
          bio: form.bio,
          organization_name: form.organization_name,
          organization_description: form.organization_description,
          website_url: form.website_url
        }
      );

      alert("Account created successfully");

      navigate("/login");

    } catch (err) {

      alert("Registration failed");

    } finally {

      setLoading(false);

    }

  };

  return (

    <div className="register-container">

      <div className="register-box">

        <Link to="/" className="back-link">
          ← Back to home
        </Link>

        <div className="register-card">

          <div className="logo">
            <div className="logo-box">SB</div>
            SkillBridge
          </div>

          <h2>Create your account</h2>

          <p className="subtitle">
            Join the community and start making an impact.
          </p>


          <form onSubmit={handleSubmit}>

            <div className="grid">

              <div>
                <label>Full Name</label>

                <input
                  name="name"
                  placeholder="Jane Doe"
                  onChange={handleChange}
                  required
                />
              </div>

              <div>
                <label>Email Address</label>

                <input
                  name="email"
                  type="email"
                  placeholder="jane@example.com"
                  onChange={handleChange}
                  required
                />
              </div>

            </div>


            <div className="grid">

              <div>
                <label>Password</label>

                <input
                  name="password"
                  type="password"
                  placeholder="Min. 8 characters"
                  onChange={handleChange}
                  required
                />
              </div>

              <div>
                <label>Confirm Password</label>

                <input
                  name="confirmPassword"
                  type="password"
                  placeholder="Re-enter password"
                  onChange={handleChange}
                  required
                />
              </div>

            </div>


            <label>I am a...</label>

            <div className="role-box">

              <div
                className={
                  role === "volunteer"
                    ? "role-card active"
                    : "role-card"
                }
                onClick={() => setRole("volunteer")}
              >
                👤 Volunteer
              </div>

              <div
                className={
                  role === "ngo"
                    ? "role-card active"
                    : "role-card"
                }
                onClick={() => setRole("ngo")}
              >
                🌍 NGO
              </div>

            </div>


            {role === "ngo" && (

              <div>

                <label>Organization Name</label>

                <input
                  name="organization_name"
                  onChange={handleChange}
                />

                <label>Description</label>

                <textarea
                  name="organization_description"
                  onChange={handleChange}
                />

                <label>Website</label>

                <input
                  name="website_url"
                  onChange={handleChange}
                />

              </div>

            )}


            <label>Skills</label>

            <input
              name="skills"
              placeholder="Design, React, Writing"
              onChange={handleChange}
            />


            <label>Bio</label>

            <textarea
              name="bio"
              onChange={handleChange}
            />


            <button
              type="submit"
              className="register-btn"
            >
              {loading ? "Creating..." : "Create Account"}
            </button>

          </form>


          <p className="login-link">

            Already have account?

            <Link to="/login"> Sign in</Link>

          </p>

        </div>

      </div>

    </div>

  );

}
