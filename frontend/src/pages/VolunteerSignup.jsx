import { useState } from "react";
import { Link } from "react-router-dom";
import AuthLayout from "../Components/Authlayout";

export default function VolunteerSignup() {

  const [name,setName] = useState("");
  const [email,setEmail] = useState("");
  const [password,setPassword] = useState("");
  const [location,setLocation] = useState("");
  const [bio,setBio] = useState("");
  const [skills,setSkills] = useState("");

  const handleSubmit = (e)=>{
    e.preventDefault();

    const user = {
      name,
      email,
      password,
      location,
      bio,
      skills,
      role:"volunteer"
    };

    localStorage.setItem("user",JSON.stringify(user));

    alert("Volunteer Account Created");
  };

  return (
    <AuthLayout>

      <form className="auth-form" onSubmit={handleSubmit}>

        <h2>Volunteer Sign Up</h2>

        <label>Full Name</label>
        <input
          type="text"
          placeholder="Enter your full name"
          value={name}
          onChange={(e)=>setName(e.target.value)}
        />

        <label>Email Address</label>
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e)=>setEmail(e.target.value)}
        />

        <label>Password</label>
        <input
          type="password"
          placeholder="Create password"
          value={password}
          onChange={(e)=>setPassword(e.target.value)}
        />

        <label>Location</label>
        <input
          type="text"
          placeholder="City, Country"
          value={location}
          onChange={(e)=>setLocation(e.target.value)}
        />

        <label>Bio</label>
        <textarea
          placeholder="Tell us about yourself"
          value={bio}
          onChange={(e)=>setBio(e.target.value)}
        />

        <label>Skills</label>
        <input
          type="text"
          placeholder="Teaching, Coding, First Aid..."
          value={skills}
          onChange={(e)=>setSkills(e.target.value)}
        />

        <button className="auth-btn">
          Create Account
        </button>

        <p className="auth-switch">
          Already have an account? <Link to="/volunteer-login">Login</Link>
        </p>

      </form>

    </AuthLayout>
  );
}