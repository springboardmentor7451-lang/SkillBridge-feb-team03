import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./NGODashboard.css";

const NgoDashboard = () => {
  const [ngoData, setNgoData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedData = JSON.parse(localStorage.getItem("user"));
    if (!storedData || storedData.role !== "ngo") {
      navigate("/");
    } else {
      setNgoData(storedData);
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/");
  };

  if (!ngoData) return null;

  return (
    <div className="dashboard-layout">
      {/* Sidebar */}
      <div className="sidebar">
        <div>
          <h2>NGO Panel</h2>

          <ul>
            <li className="active"> Dashboard</li>
            <li onClick={() => navigate("/ngo-profile")}>
               Profile
            </li>
            <li onClick={() => navigate("/create-opportunity")}>
               Create Opportunity
            </li>
          </ul>
        </div>

        <button className="logout-btn" onClick={handleLogout}>
           Logout
        </button>
      </div>

     
      <div className="dashboard-content">
        <h1>
          Welcome, <span>{ngoData.ngoName}</span>
        </h1>

      
        <div className="profile-section">
          <div className="profile-row">
            <label>Email</label>
            <p>{ngoData.officialEmail}</p>
          </div>

          <div className="profile-row">
            <label>Registration</label>
            <p>{ngoData.registration}</p>
          </div>

          <div className="profile-row">
            <label>Phone</label>
            <p>{ngoData.phone}</p>
          </div>

          <div className="profile-row">
            <label>Location</label>
            <p>{ngoData.city}, {ngoData.state}</p>
          </div>

          <div className="profile-row">
            <label>Established</label>
            <p>{ngoData.established}</p>
          </div>

          <div className="profile-row">
            <label>Website</label>
            <p>{ngoData.website}</p>
          </div>
        </div>

        <h2 className="section-title">Your Opportunities</h2>

        <div className="opportunity-grid">
          {ngoData.opportunities && ngoData.opportunities.length > 0 ? (
            ngoData.opportunities.map((op) => (
              <div key={op.id} className="opportunity-card">
                <h3>{op.title}</h3>
                <p><strong>Description:</strong> {op.description}</p>
                <p><strong>Skills:</strong> {op.skills}</p>
                <p><strong>Duration:</strong> {op.duration}</p>
                <p><strong>Location:</strong> {op.location}</p>
              </div>
            ))
          ) : (
            <p>No opportunities created yet.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default NgoDashboard;
