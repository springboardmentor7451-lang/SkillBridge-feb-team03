import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import opportunityService from "../services/opportunityService";
import Navbar from "../components/Navbar";
import "../styles/dashboard.css";

export default function Dashboard() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [opportunities, setOpportunities] = useState([]);

  useEffect(() => {
    if (!loading && user?.role === "ngo") {
      fetchOpportunities();
    }
  }, [user, loading]);

  const fetchOpportunities = async () => {
    try {
      const res = await opportunityService.getMyOpportunities();
      setOpportunities(res.data.opportunities);
    } catch (error) {
      console.error("Failed to fetch opportunities:", error);
    }
  };

  if (loading) return (<><Navbar /><div className="dashboard-container"><p>Loading...</p></div></>);
  if (!user) return (<><Navbar /><div className="dashboard-container"><p>Please login first</p></div></>);
  if (user.role !== "ngo") return (<><Navbar /><div className="dashboard-container"><h2>Volunteer Dashboard</h2><p>Coming soon</p></div></>);

  const activeOpps = opportunities.filter((o) => o.status === "open").length;

  return (
    <>
      <Navbar />
      <div className="dashboard-container">
        <h1>Overview</h1>
        <p className="welcome">Welcome back, {user.name}!</p>

        <div className="stats-grid">
          <div className="stat-card"><p className="stat-label">Active Opportunities</p><h2 className="stat-value blue">{activeOpps}</h2></div>
          <div className="stat-card"><p className="stat-label">Applications</p><h2 className="stat-value green">1</h2></div>
          <div className="stat-card"><p className="stat-label">Active Volunteers</p><h2 className="stat-value purple">0</h2></div>
          <div className="stat-card"><p className="stat-label">Pending Applications</p><h2 className="stat-value orange">1</h2></div>
        </div>

        <div className="dashboard-grid">
          <div className="recent">
            <div className="recent-header"><h3>Recent Applications</h3><a href="#">View All</a></div>
            <div className="recent-box">No recent applications to show.</div>
          </div>
          <div className="quick-actions">
            <h3>Quick Actions</h3>
            <button className="action-btn" onClick={() => navigate("/opportunities/create")}>
              <span className="plus-icon">+</span>
              <div><strong>Create New Opportunity</strong><p>Post a new role for volunteers</p></div>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
