import { useState } from "react";
import { Link } from "react-router-dom";
import AuthLayout from "../Components/Authlayout";

export default function NGOLogin() {

  const [email,setEmail] = useState("");
  const [password,setPassword] = useState("");

  const handleSubmit = (e)=>{
    e.preventDefault();

    const user = {
      email,
      role:"ngo"
    };

    localStorage.setItem("user",JSON.stringify(user));

    alert("NGO Login Successful");
  };

  return (
    <AuthLayout>

      <form className="auth-form" onSubmit={handleSubmit}>

        <h2>NGO Login</h2>

        <input
          type="email"
          placeholder="Official Email"
          value={email}
          onChange={(e)=>setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e)=>setPassword(e.target.value)}
        />

        <button className="auth-btn">
          Login
        </button>

        {/* NEW PART */}
        <p className="auth-switch">
          Don't have an NGO account? <Link to="/ngo-signup">Register here</Link>
        </p>

      </form>

    </AuthLayout>
  );
}