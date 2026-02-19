import { useState } from "react";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import api from "../services/api";


export default function NGOLogin() {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const { login } = useContext(AuthContext);
const navigate = useNavigate();


  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  if (!form.email || !form.password) {
    alert("Please fill all fields");
    return;
  }

  try {
    const response = await api.post("/auth/login", form);

    login(response.data.token);
    navigate("/profile");

  } catch (error) {
    console.error(error);
    alert("Login failed");
  }
};

  return (
    <div style={{ padding: 40 }}>
      <h1>NGO Login</h1>

      <form onSubmit={handleSubmit}>
        <input name="email" placeholder="Email" onChange={handleChange} /><br /><br />
        <input name="password" type="password" placeholder="Password" onChange={handleChange} /><br /><br />

        <button type="submit">Login</button>
      </form>
    </div>
  );
}

