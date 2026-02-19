import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { Navigate, useNavigate } from "react-router-dom";
import api from "../services/api";

export default function Profile() {
  const { token, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  // If not logged in → redirect
  if (!token) {
    return <Navigate to="/login/volunteer" />;
  }

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await api.get("/users/me", {
          headers: {
            Authorization: token,
          },
        });

        setUser(response.data);
      } catch (error) {
        console.error("Profile fetch error:", error);
      }
    };

    fetchProfile();
  }, [token]);

  if (!user) return <p style={{ padding: 40 }}>Loading profile...</p>;

  return (
    <div style={{ padding: 40 }}>
      <h1>Profile Page</h1>

      <p><b>Name:</b> {user.name}</p>
      <p><b>Email:</b> {user.email}</p>
      <p><b>Role:</b> {user.role}</p>
      <p><b>Skills:</b> {user.skills.join(", ")}</p>
      <p><b>Location:</b> {user.location}</p>
      <p><b>Bio:</b> {user.bio}</p>

      <button
        onClick={() => {
          logout();
          navigate("/");
        }}
      >
        Logout
      </button>
    </div>
  );
}
