import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";
import applicationService from "../services/applicationService";
import Navbar from "../components/Navbar";
import "../styles/dashboard.css";

export default function Applications() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [applications, setApplications] = useState([]);
  const [loadingApps, setLoadingApps] = useState(false);

  useEffect(() => {
    if (!loading && user?.role === "volunteer") {
      fetchApplications();
    }
  }, [user, loading, location]);

  const fetchApplications = async () => {
    try {
      setLoadingApps(true);
      const res = await applicationService.getMyApplications();
      setApplications(res.data.applications);
    } catch (error) {
      console.error("Failed to fetch applications:", error);
    } finally {
      setLoadingApps(false);
    }
  };

  if (loading) return (<><Navbar /><div className="dashboard-wrapper"><p>Loading...</p></div></>);
  if (!user) return (<><Navbar /><div className="dashboard-wrapper"><p>Please login first</p></div></>);
  if (user.role !== "volunteer") return (<><Navbar /><div className="dashboard-wrapper"><p>Access denied</p></div></>);

  const pendingApps = applications.filter((a) => a.status === "pending").length;
  const acceptedApps = applications.filter((a) => a.status === "accepted").length;
  const rejectedApps = applications.filter((a) => a.status === "rejected").length;

  return (
    <>
      <Navbar />
      <div className="dashboard-wrapper">
        <div className="dashboard-header">
          <div><h1>My Applications</h1><p className="breadcrumb">SkillBridge / Applications</p></div>
        </div>

        <div className="stats-container">
          <div className="stat-card-new">
            <div className="stat-icon">📋</div>
            <div className="stat-content"><p className="stat-value-big">{applications.length}</p><p className="stat-label-small">Total Applications</p></div>
          </div>
          <div className="stat-card-new">
            <div className="stat-icon">⏳</div>
            <div className="stat-content"><p className="stat-value-big">{pendingApps}</p><p className="stat-label-small">Pending</p></div>
          </div>
          <div className="stat-card-new">
            <div className="stat-icon">✅</div>
            <div className="stat-content"><p className="stat-value-big">{acceptedApps}</p><p className="stat-label-small">Accepted</p></div>
          </div>
          <div className="stat-card-new">
            <div className="stat-icon">❌</div>
            <div className="stat-content"><p className="stat-value-big">{rejectedApps}</p><p className="stat-label-small">Rejected</p></div>
          </div>
        </div>

        <div className="opportunities-section">
          <div className="section-header">
            <div><h2>Application History</h2><p>Track your submitted applications</p></div>
          </div>

          {loadingApps ? <p>Loading applications...</p> : applications.length === 0 ? (
            <div className="empty-state">
              <p>You haven't applied to any opportunities yet.</p>
              <button className="btn-primary-large" onClick={() => navigate("/browse-opportunities")}>Browse Opportunities</button>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="opps-table">
                <thead><tr><th>OPPORTUNITY</th><th>APPLIED DATE</th><th>STATUS</th><th>ACTIONS</th></tr></thead>
                <tbody>
                  {applications.map((app) => (
                    <tr key={app._id}>
                      <td>
                        <div className="opp-title-cell">
                          <p className="opp-title">{app.opportunity_id?.title}</p>
                          <p className="opp-location">📍 {app.opportunity_id?.location} • ⏱️ {app.opportunity_id?.duration}</p>
                        </div>
                      </td>
                      <td>
                        <p>{new Date(app.applied_date).toLocaleDateString()}</p>
                      </td>
                      <td>
                        <span className={`status-badge ${app.status}`}>
                          {app.status === "pending" ? "⏳ Pending" : app.status === "accepted" ? "✅ Accepted" : "❌ Rejected"}
                        </span>
                      </td>
                      <td>
                        <div className="action-buttons">
                          <button className="btn-view" onClick={() => navigate(`/browse-opportunities`)}>View</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
