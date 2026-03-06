import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";
import opportunityService from "../services/opportunityService";
import Navbar from "../components/Navbar";
import "../styles/dashboard.css";

export default function MyOpportunities() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [opportunities, setOpportunities] = useState([]);
  const [loadingOpps, setLoadingOpps] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(null);

  useEffect(() => {
    if (!loading && user?.role === "ngo") {
      fetchOpportunities();
    }
  }, [user, loading, location]);

  const fetchOpportunities = async () => {
    try {
      setLoadingOpps(true);
      const res = await opportunityService.getMyOpportunities();
      setOpportunities(res.data.opportunities);
    } catch (error) {
      console.error("Failed to fetch opportunities:", error);
    } finally {
      setLoadingOpps(false);
    }
  };

  const confirmDeleteOpp = async () => {
    try {
      await opportunityService.deleteOpportunity(confirmDelete);
      setOpportunities(opportunities.filter((o) => o._id !== confirmDelete));
      setConfirmDelete(null);
    } catch (error) {
      console.error("Delete failed:", error);
    }
  };

  if (loading) return (<><Navbar /><div className="dashboard-wrapper"><p>Loading...</p></div></>);
  if (!user) return (<><Navbar /><div className="dashboard-wrapper"><p>Please login first</p></div></>);
  if (user.role !== "ngo") return (<><Navbar /><div className="dashboard-wrapper"><p>Access denied</p></div></>);

  return (
    <>
      <Navbar />
      <div className="dashboard-wrapper">
        <div className="dashboard-header">
          <div><h1>Manage Opportunities</h1><p className="breadcrumb">SkillBridge / Opportunity</p></div>
        </div>

        <div className="stats-container">
          <div className="stat-card-new">
            <div className="stat-icon">📋</div>
            <div className="stat-content"><p className="stat-value-big">{opportunities.length}</p><p className="stat-label-small">Total Opportunities</p></div>
          </div>
          <div className="stat-card-new">
            <div className="stat-icon">🟢</div>
            <div className="stat-content"><p className="stat-value-big">{opportunities.filter((o) => o.status === "open").length}</p><p className="stat-label-small">Open Opportunities</p></div>
          </div>
          <div className="stat-card-new">
            <div className="stat-icon">🔴</div>
            <div className="stat-content"><p className="stat-value-big">{opportunities.filter((o) => o.status === "closed").length}</p><p className="stat-label-small">Closed</p></div>
          </div>
          <div className="stat-card-new">
            <div className="stat-icon">👥</div>
            <div className="stat-content"><p className="stat-value-big">0</p><p className="stat-label-small">Total Applicants</p></div>
          </div>
        </div>

        <div className="opportunities-section">
          <div className="section-header">
            <div><h2>All Opportunities</h2><p>Manage your posted opportunities</p></div>
            <button className="btn-create" onClick={() => navigate("/opportunities/create")}>+ Create Opportunity</button>
          </div>

          {loadingOpps ? <p>Loading opportunities...</p> : opportunities.length === 0 ? (
            <div className="empty-state">
              <p>No opportunities posted yet</p>
              <button className="btn-primary-large" onClick={() => navigate("/opportunities/create")}>Create Your First Opportunity</button>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="opps-table">
                <thead><tr><th>OPPORTUNITY</th><th>SKILLS</th><th>STATUS</th><th>APPLICANTS</th><th>ACTIONS</th></tr></thead>
                <tbody>
                  {opportunities.map((opp) => (
                    <tr key={opp._id}>
                      <td>
                        <div className="opp-title-cell">
                          <p className="opp-title">{opp.title}</p>
                          <p className="opp-location">📍 {opp.location} • ⏱️ {opp.duration}</p>
                        </div>
                      </td>
                      <td>
                        <div className="skills-inline">
                          {opp.required_skills?.slice(0, 3).map((skill, i) => (<span key={i} className="skill-tag">{skill}</span>))}
                          {opp.required_skills?.length > 3 && <span className="skill-tag">+{opp.required_skills.length - 3}</span>}
                        </div>
                      </td>
                      <td><span className={`status-badge ${opp.status}`}>{opp.status === "open" ? "🟢 Open" : "🔴 Closed"}</span></td>
                      <td><span className="applicants">👥 0 applicants</span></td>
                      <td>
                        <div className="action-buttons">
                          <button className="btn-edit" onClick={() => navigate(`/opportunities/edit/${opp._id}`)}>✏️ Edit</button>
                          <button className="btn-delete" onClick={() => setConfirmDelete(opp._id)}>🗑️ Delete</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {confirmDelete && (
          <div className="modal-overlay">
            <div className="modal">
              <h3>Delete Opportunity?</h3>
              <p>Are you sure you want to delete this opportunity? This action cannot be undone.</p>
              <div className="modal-actions">
                <button className="btn-delete-confirm" onClick={confirmDeleteOpp}>Yes, Delete</button>
                <button className="btn-cancel" onClick={() => setConfirmDelete(null)}>Cancel</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
