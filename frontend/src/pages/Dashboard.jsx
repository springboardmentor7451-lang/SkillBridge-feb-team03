import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";
import opportunityService from "../services/opportunityService";
import applicationService from "../services/applicationService";
import Navbar from "../components/Navbar";
import MatchSuggestions from "../components/MatchSuggestions";
import "../styles/dashboard.css";

export default function Dashboard() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [opportunities, setOpportunities] = useState([]);
  const [applications, setApplications] = useState([]);

  useEffect(() => {
    if (!loading && user) {
      if (user.role === "ngo") {
        fetchNGOData();
      } else if (user.role === "volunteer") {
        fetchVolunteerApplications();
      }
    }
  }, [user, loading, location]);

  const fetchNGOData = async () => {
    try {
      const [oppsRes, appsRes] = await Promise.all([
        opportunityService.getMyOpportunities(),
        applicationService.getNGOApplications()
      ]);
      setOpportunities(oppsRes.data.opportunities);
      setApplications(appsRes.data.applications);
    } catch (error) {
      console.error("Failed to fetch NGO data:", error);
    }
  };

  const fetchVolunteerApplications = async () => {
    try {
      const res = await applicationService.getMyApplications();
      setApplications(res.data.applications);
    } catch (error) {
      console.error("Failed to fetch applications:", error);
    }
  };

  if (loading) return (<><Navbar /><div className="dashboard-container"><p>Loading...</p></div></>);
  if (!user) return (<><Navbar /><div className="dashboard-container"><p>Please login first</p></div></>);

  // NGO Dashboard
  if (user.role === "ngo") {
    const activeOpps = opportunities.filter((o) => o.status === "open").length;
    const totalApplications = applications.length;
    const pendingApplications = applications.filter((a) => a.status === "pending").length;
    const activeVolunteers = applications.filter((a) => a.status === "accepted").length;

    return (
      <>
        <Navbar />
        <div className="dashboard-container">
          <h1>Overview</h1>
          <p className="welcome">Welcome back, {user.name}!</p>

          <div className="stats-grid">
            <div className="stat-card"><p className="stat-label">Active Opportunities</p><h2 className="stat-value blue">{activeOpps}</h2></div>
            <div className="stat-card"><p className="stat-label">Applications</p><h2 className="stat-value green">{totalApplications}</h2></div>
            <div className="stat-card"><p className="stat-label">Active Volunteers</p><h2 className="stat-value purple">{activeVolunteers}</h2></div>
            <div className="stat-card"><p className="stat-label">Pending Applications</p><h2 className="stat-value orange">{pendingApplications}</h2></div>
          </div>

          <div className="dashboard-grid">
            <div className="recent">
              <div className="recent-header"><h3>Recent Applications</h3><a href="#" onClick={() => navigate("/applications")}>View All</a></div>
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

  // Volunteer Dashboard
  if (user.role === "volunteer") {
    const totalApplications = applications.length;
    const acceptedApplications = applications.filter((a) => a.status === "accepted").length;
    const pendingApplications = applications.filter((a) => a.status === "pending").length;
    const userSkills = user.skills?.length || 0;

    return (
      <>
        <Navbar />
        <div className="dashboard-container">
          <h1>Overview</h1>
          <p className="welcome">Welcome back, {user.name}!</p>

          <div className="stats-grid">
            <div className="stat-card"><p className="stat-label">Applications</p><h2 className="stat-value blue">{totalApplications}</h2></div>
            <div className="stat-card"><p className="stat-label">Accepted</p><h2 className="stat-value green">{acceptedApplications}</h2></div>
            <div className="stat-card"><p className="stat-label">Pending</p><h2 className="stat-value orange">{pendingApplications}</h2></div>
            <div className="stat-card"><p className="stat-label">Skills</p><h2 className="stat-value purple">{userSkills}</h2></div>
          </div>

          <MatchSuggestions />

          <div className="dashboard-grid">
            <div className="recent">
              <div className="recent-header"><h3>Recent Applications</h3><a href="#" onClick={() => navigate("/applications")}>View All</a></div>
              <div className="recent-box">No recent applications to show.</div>
            </div>
            <div className="quick-actions">
              <h3>Find Opportunities</h3>
              <button className="action-btn" onClick={() => navigate("/browse-opportunities")}>
                <span className="plus-icon">🔍</span>
                <div><strong>Browse All Opportunities</strong><p>Discover volunteering opportunities that match your skills and interests.</p></div>
              </button>
            </div>
          </div>
        </div>
      </>
    );
  }
}
