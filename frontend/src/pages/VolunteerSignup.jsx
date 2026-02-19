import { useState } from "react";
import api from "../services/api";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";


export default function VolunteerSignup() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    skills: "",
    location: "",
    bio: "",
  });
const { login } = useContext(AuthContext);
const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

 const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const response = await api.post("/auth/register", {
      ...form,
      role: "volunteer",
    });

    console.log("Server response:", response.data);
    login("fake-jwt-token-123");
navigate("/profile");

  } catch (error) {
    console.error(error);
    alert("Registration failed");
  }
};


  return (
    <div style={{ padding: 40 }}>
      <h1>Volunteer Signup</h1>

      <form onSubmit={handleSubmit}>
        <input name="name" placeholder="Full Name" onChange={handleChange} /><br /><br />
        <input name="email" placeholder="Email" onChange={handleChange} /><br /><br />
        <input name="password" type="password" placeholder="Password" onChange={handleChange} /><br /><br />
        <input name="skills" placeholder="Skills" onChange={handleChange} /><br /><br />
        <input name="location" placeholder="Location" onChange={handleChange} /><br /><br />
        <textarea name="bio" placeholder="Short Bio" onChange={handleChange} /><br /><br />

        <button type="submit">Create Account</button>
      </form>
    </div>
  );
}
