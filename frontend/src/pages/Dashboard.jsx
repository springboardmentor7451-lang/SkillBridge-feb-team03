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

  if (loading) return (
    <>
      <Navbar />
      <div className="dashboard-wrapper">
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <p>Loading...</p>
        </div>
      </div>
    </>
  );
  
  if (!user) return (
    <>
      <Navbar />
      <div className="dashboard-wrapper">
        <div className="auth-required">
          <div className="auth-icon">🔐</div>
          <h2>Authentication Required</h2>
          <p>Please login first</p>
          <button onClick={() => navigate("/login")} className="btn-primary-dashboard">
            Sign In
          </button>
        </div>
      </div>
    </>
  );

  // NGO Dashboard
  if (user.role === "ngo") {
    const activeOpps = opportunities.filter((o) => o.status === "open").length;
    const totalApplications = applications.length;
    const pendingApplications = applications.filter((a) => a.status === "pending").length;
    const activeVolunteers = applications.filter((a) => a.status === "accepted").length;

    return (
      <>
        <Navbar />
        <div className="dashboard-wrapper">
          <div className="dashboard-header-enhanced">
            <div>
              <h1>Welcome back, {user.name}!</h1>
              <p className="breadcrumb">Dashboard / Overview</p>
            </div>
            <button onClick={() => navigate("/opportunities/create")} className="btn-create-enhanced">
              <span>+</span> Create Opportunity
            </button>
          </div>

          <div className="stats-grid-enhanced">
            <div className="stat-card-new stat-card-blue">
              <div className="stat-icon">📋</div>
              <div className="stat-content">
                <span className="stat-value-big">{activeOpps}</span>
                <span className="stat-label-small">Active Opportunities</span>
              </div>
            </div>
            <div className="stat-card-new stat-card-green">
              <div className="stat-icon">📨</div>
              <div className="stat-content">
                <span className="stat-value-big">{totalApplications}</span>
                <span className="stat-label-small">Total Applications</span>
              </div>
            </div>
            <div className="stat-card-new stat-card-orange">
              <div className="stat-icon">⏳</div>
              <div className="stat-content">
                <span className="stat-value-big">{pendingApplications}</span>
                <span className="stat-label-small">Pending</span>
              </div>
            </div>
            <div className="stat-card-new stat-card-purple">
              <div className="stat-icon">🤝</div>
              <div className="stat-content">
                <span className="stat-value-big">{activeVolunteers}</span>
                <span className="stat-label-small">Active Volunteers</span>
              </div>
            </div>
          </div>

          <div className="dashboard-grid">
            <div className="recent">
              <div className="recent-header">
                <h3>Recent Applications</h3>
                <a href="#" onClick={() => navigate("/applications")}>View All</a>
              </div>
              <div className="recent-box">
                {applications.length > 0 ? (
                  applications.slice(0, 3).map(app => (
                    <div key={app._id} className="app-item-simple">
                      <span>{app.volunteer?.name || "Unknown"}</span>
                      <span className={`status-badge ${app.status}`}>{app.status}</span>
                    </div>
                  ))
                ) : (
                  <p className="no-data">No recent applications to show.</p>
                )}
              </div>
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
        <div className="dashboard-wrapper">
          <div className="dashboard-header-enhanced">
            <div>
              <h1>Welcome back, {user.name}!</h1>
              <p className="breadcrumb">Dashboard / Overview</p>
            </div>
          </div>

          <div className="stats-grid-enhanced">
            <div className="stat-card-new stat-card-blue">
              <div className="stat-icon">📨</div>
              <div className="stat-content">
                <span className="stat-value-big">{totalApplications}</span>
                <span className="stat-label-small">Applications</span>
              </div>
            </div>
            <div className="stat-card-new stat-card-green">
              <div className="stat-icon">✓</div>
              <div className="stat-content">
                <span className="stat-value-big">{acceptedApplications}</span>
                <span className="stat-label-small">Accepted</span>
              </div>
            </div>
            <div className="stat-card-new stat-card-orange">
              <div className="stat-icon">⏳</div>
              <div className="stat-content">
                <span className="stat-value-big">{pendingApplications}</span>
                <span className="stat-label-small">Pending</span>
              </div>
            </div>
            <div className="stat-card-new stat-card-purple">
              <div className="stat-icon">💡</div>
              <div className="stat-content">
                <span className="stat-value-big">{userSkills}</span>
                <span className="stat-label-small">Skills</span>
              </div>
            </div>
          </div>

          <MatchSuggestions />

          <div className="dashboard-grid">
            <div className="recent">
              <div className="recent-header">
                <h3>Recent Applications</h3>
                <a href="#" onClick={() => navigate("/applications")}>View All</a>
              </div>
              <div className="recent-box">
                {applications.length > 0 ? (
                  applications.slice(0, 3).map(app => (
                    <div key={app._id} className="app-item-simple">
                      <span>{app.opportunity?.title || "Opportunity"}</span>
                      <span className={`status-badge ${app.status}`}>{app.status}</span>
                    </div>
                  ))
                ) : (
                  <p className="no-data">No recent applications to show.</p>
                )}
              </div>
            </div>
            <div className="quick-actions">
              <h3>Find Opportunities</h3>
              <button className="action-btn" onClick={() => navigate("/browse-opportunities")}>
                <span className="plus-icon">🔍</span>
                <div><strong>Browse All Opportunities</strong><p>Discover volunteering opportunities that match your skills.</p></div>
              </button>
            </div>
          </div>
        </div>
      </>
    );
  }

  return null;
}
