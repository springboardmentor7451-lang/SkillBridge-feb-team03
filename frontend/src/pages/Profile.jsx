import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../styles/profile.css";

export default function Profile() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [loadingProfile, setLoadingProfile] = useState(true);

  useEffect(() => {
    if (!loading) {
      setLoadingProfile(false);
    }
  }, [loading]);

  if (loadingProfile) return <p>Loading...</p>;
  if (!user) return <p>Please login first</p>;

  return (
    <div className="profile-container">
      <button 
        className="back-to-dashboard"
        onClick={() => navigate("/dashboard")}
      >
        ← Back to Dashboard
      </button>

      <div className="profile-header">
        <h2>My Profile</h2>
        <button
          className="edit-profile-btn"
          onClick={() => navigate("/profile/edit")}
        >
          Edit Profile
        </button>
      </div>

      <div className="profile-card">
        {/* Basic Info */}
        <div className="profile-section">
          <h3>Basic Information</h3>
          <div className="profile-item">
            <label>Name:</label>
            <p>{user.name}</p>
          </div>
          <div className="profile-item">
            <label>Email:</label>
            <p>{user.email}</p>
          </div>
          <div className="profile-item">
            <label>Role:</label>
            <p className={`role-badge ${user.role}`}>{user.role}</p>
          </div>
          <div className="profile-item">
            <label>Location:</label>
            <p>{user.location || "Not specified"}</p>
          </div>
          <div className="profile-item">
            <label>Bio:</label>
            <p>{user.bio || "Not specified"}</p>
          </div>
        </div>

        {/* Volunteer-specific section */}
        {user.role === "volunteer" && (
          <div className="profile-section">
            <h3>Skills</h3>
            {user.skills && user.skills.length > 0 ? (
              <div className="skills-display">
                {user.skills.map((skill, index) => (
                  <span key={index} className="skill-tag">
                    {skill}
                  </span>
                ))}
              </div>
            ) : (
              <p>No skills added yet</p>
            )}
          </div>
        )}

        {/* NGO-specific section */}
        {user.role === "ngo" && (
          <div className="profile-section">
            <h3>Organization Details</h3>
            <div className="profile-item">
              <label>Organization Name:</label>
              <p>{user.organization_name || "Not specified"}</p>
            </div>
            <div className="profile-item">
              <label>Description:</label>
              <p>{user.organization_description || "Not specified"}</p>
            </div>
            <div className="profile-item">
              <label>Website:</label>
              {user.website_url ? (
                <a
                  href={user.website_url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {user.website_url}
                </a>
              ) : (
                <p>Not specified</p>
              )}
            </div>
          </div>
        )}

        {/* Account Info */}
        <div className="profile-section">
          <h3>Account Information</h3>
          <div className="profile-item">
            <label>Member Since:</label>
            <p>{new Date(user.createdAt).toLocaleDateString()}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
