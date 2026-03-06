import { useState } from "react";
import { Link } from "react-router-dom";
import AuthLayout from "../Components/Authlayout";

export default function VolunteerLogin() {

  const [email,setEmail] = useState("");
  const [password,setPassword] = useState("");
  const [role,setRole] = useState("volunteer");

  const handleSubmit = (e)=>{
    e.preventDefault();

    const user = JSON.parse(localStorage.getItem("user"));

    if(user && user.email === email){
      alert("Login Successful");
    }else{
      alert("User not found");
    }
  };

  return (
    <AuthLayout>

      <form className="auth-form" onSubmit={handleSubmit}>

        <h2>Login to SkillBridge</h2>

        {/* Role Toggle */}
        <div className="role-toggle">
          <button
            type="button"
            className={role==="volunteer" ? "active" : ""}
            onClick={()=>setRole("volunteer")}
          >
            Volunteer
          </button>

          <button
            type="button"
            className={role==="ngo" ? "active" : ""}
            onClick={()=>setRole("ngo")}
          >
            NGO
          </button>
        </div>

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
          placeholder="Enter your password"
          value={password}
          onChange={(e)=>setPassword(e.target.value)}
        />

        <button className="auth-btn">
          Login
        </button>

        <p className="auth-switch">
          Don't have an account? <Link to="/register">Create one</Link>
        </p>

      </form>

    </AuthLayout>
  );
}