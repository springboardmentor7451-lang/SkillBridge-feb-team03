import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./VolunteerDashboard.css";

const VolunteerDashboard = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const [activeSection, setActiveSection] = useState("dashboard");

  if (!user || user.role !== "volunteer") {
    return (
      <div className="vd-wrapper">
        <div className="vd-card">
          <h2>Access Denied</h2>
          <button onClick={() => navigate("/")}>Go Home</button>
        </div>
      </div>
    );
  }

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <div className="vd-wrapper">

      {/* SIDEBAR */}
      <div className="vd-sidebar">
        <h2>SkillBuild</h2>

        <ul>
          <li
            className={activeSection === "dashboard" ? "active" : ""}
            onClick={() => setActiveSection("dashboard")}
          >
            🏠 Dashboard
          </li>

          <li
            className={activeSection === "profile" ? "active" : ""}
            onClick={() => setActiveSection("profile")}
          >
            👤 My Profile
          </li>


          <li onClick={handleLogout}>🚪 Logout</li>
        </ul>
      </div>

      {/* MAIN CONTENT */}
      <div className="vd-main">

        {/* DASHBOARD SECTION */}
        {activeSection === "dashboard" && (
          <>
            <h1>Welcome, {user.fullName} 👋</h1>

            <div className="vd-card">
              <p><strong>Email:</strong> {user.emailAddress}</p>
              <p><strong>City:</strong> {user.city}</p>
              <p><strong>Experience:</strong> {user.experienceLevel}</p>
              <p><strong>Availability:</strong> {user.availability}</p>

              <div className="vd-skills">
                <strong>Skills:</strong>
                <div className="vd-skill-grid">
                  {user.skills?.map((skill, index) => (
                    <span key={index} className="vd-skill-chip">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* APPLIED PROJECTS */}
            <h2>📝 Applied Projects</h2>
            <div className="vd-card">
              <h3>Website Development for NGO</h3>
              <p className="status-pending">Status: Pending</p>
            </div>

            {/* ACTIVE PROJECTS */}
            <h2>🚀 Active Projects</h2>
            <div className="vd-card">
              <h3>Teaching Coding to Students</h3>
              <p className="status-accepted">In Progress</p>
            </div>

            {/* COMPLETED PROJECTS */}
            <h2>✅ Completed Projects</h2>
            <div className="vd-card">
              <h3>Community Clean-up Drive</h3>
              <p className="status-completed">Completed Successfully</p>
            </div>
          </>
        )}

        {/* PROFILE SECTION */}
        {activeSection === "profile" && (
          <>
            <h1>My Profile</h1>

            <div className="vd-card">
              <p><strong>Full Name:</strong> {user.fullName}</p>
              <p><strong>Contact:</strong> {user.contact}</p>
              <p><strong>Hours / Week:</strong> {user.hours}</p>
              <p><strong>LinkedIn:</strong> {user.linkedin || "Not Provided"}</p>
              <p><strong>Portfolio:</strong> {user.portfolio || "Not Provided"}</p>
            </div>
          </>
        )}

        

      </div>
    </div>
  );
};

export default VolunteerDashboard;