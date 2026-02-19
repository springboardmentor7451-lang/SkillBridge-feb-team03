
import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import api from "../services/api";


export default function NGOSignup() {
  const [form, setForm] = useState({
    organization_name: "",
    email: "",
    password: "",
    description: "",
    website: "",
    location: "",
  });
  const { login } = useContext(AuthContext);
const navigate = useNavigate();


  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const response = await api.post("/auth/register-ngo", form);

    console.log("NGO response:", response.data);

    // auto login after signup
    login("fake-jwt-token-123");

    navigate("/profile");

  } catch (error) {
    console.error(error);
    alert("NGO registration failed");
  }
};



  return (
    <div style={{ padding: 40 }}>
      <h1>NGO Signup</h1>

      <form onSubmit={handleSubmit}>
        <input name="organization_name" placeholder="Organization Name" onChange={handleChange} /><br /><br />
        <input name="email" placeholder="Email" onChange={handleChange} /><br /><br />
        <input name="password" type="password" placeholder="Password" onChange={handleChange} /><br /><br />
        <input name="description" placeholder="Description" onChange={handleChange} /><br /><br />
        <input name="website" placeholder="Website URL" onChange={handleChange} /><br /><br />
        <input name="location" placeholder="Location" onChange={handleChange} /><br /><br />

        <button type="submit">Create NGO Account</button>
      </form>
    </div>
  );
}
