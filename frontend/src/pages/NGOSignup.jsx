import { useState } from "react";
import { Link } from "react-router-dom";
import AuthLayout from "../Components/Authlayout";

export default function NGOSignup() {

  const [orgName,setOrgName] = useState("");
  const [email,setEmail] = useState("");
  const [password,setPassword] = useState("");
  const [type,setType] = useState("");
  const [location,setLocation] = useState("");
  const [website,setWebsite] = useState("");
  const [mission,setMission] = useState("");
  const [focus,setFocus] = useState("");

  const handleSubmit = (e)=>{
    e.preventDefault();

    const ngo = {
      orgName,
      email,
      password,
      type,
      location,
      website,
      mission,
      focus,
      role:"ngo"
    };

    localStorage.setItem("ngo",JSON.stringify(ngo));

    alert("NGO Account Created");
  };

  return (
    <AuthLayout>

      <form className="auth-form" onSubmit={handleSubmit}>

        <h2>NGO / Organization Sign Up</h2>

        <label>Organization Name</label>
        <input
          type="text"
          placeholder="Enter organization name"
          value={orgName}
          onChange={(e)=>setOrgName(e.target.value)}
        />

        <label>Email Address</label>
        <input
          type="email"
          placeholder="Enter organization email"
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

        <label>Organization Type</label>
        <input
          type="text"
          placeholder="Nonprofit, Charity, Foundation..."
          value={type}
          onChange={(e)=>setType(e.target.value)}
        />

        <label>Location</label>
        <input
          type="text"
          placeholder="City, Country"
          value={location}
          onChange={(e)=>setLocation(e.target.value)}
        />

        <label>Website URL</label>
        <input
          type="url"
          placeholder="https://example.org"
          value={website}
          onChange={(e)=>setWebsite(e.target.value)}
        />

        <label>Mission / Description</label>
        <textarea
          placeholder="Describe your organization's mission"
          value={mission}
          onChange={(e)=>setMission(e.target.value)}
        />

        <label>Focus Areas</label>
        <input
          type="text"
          placeholder="Education, Health, Environment..."
          value={focus}
          onChange={(e)=>setFocus(e.target.value)}
        />

        <button className="auth-btn">
          Create NGO Account
        </button>

        <p className="auth-switch">
          Already have an account? <Link to="/ngo-login">Login</Link>
        </p>

      </form>

    </AuthLayout>
  );
}