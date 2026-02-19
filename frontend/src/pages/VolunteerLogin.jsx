import { useState } from "react";
import api from "../services/api";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";


export default function VolunteerLogin() {
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

    console.log(response.data);
    alert("Login success! Global auth updated.");
    navigate("/profile");

  } catch (error) {
    console.error(error);
    alert("Login failed");
  }
};



  return (
    <div style={{ padding: 40 }}>
      <h1>Volunteer Login</h1>

      <form onSubmit={handleSubmit}>
        <input name="email" placeholder="Email" onChange={handleChange} /><br /><br />
        <input name="password" type="password" placeholder="Password" onChange={handleChange} /><br /><br />

        <button type="submit">Login</button>
      </form>
    </div>
  );
}

