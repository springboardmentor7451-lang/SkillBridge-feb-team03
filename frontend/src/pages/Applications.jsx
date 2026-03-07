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
    if (!loading && user) {
      if (user.role === "volunteer") {
        fetchVolunteerApplications();
      } else if (user.role === "ngo") {
        fetchNGOApplications();
      }
    }
  }, [user, loading, location]);

  const fetchVolunteerApplications = async () => {
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

  const fetchNGOApplications = async () => {
    try {
      setLoadingApps(true);
      const res = await applicationService.getNGOApplications();
      setApplications(res.data.applications);
    } catch (error) {
      console.error("Failed to fetch NGO applications:", error);
    } finally {
      setLoadingApps(false);
    }
  };

  const handleStatusUpdate = async (applicationId, newStatus) => {
    try {
      const res = await applicationService.updateApplicationStatus(applicationId, newStatus);
      
      // If accepted, alert user that they can now message
      if (newStatus === "accepted") {
        alert("✅ Application accepted! You can now chat with them in the Messages section.");
      }
      
      // Refresh applications
      if (user.role === "volunteer") {
        fetchVolunteerApplications();
      } else {
        fetchNGOApplications();
      }
    } catch (error) {
      console.error("Failed to update status:", error);
      alert("Failed to update application status");
    }
  };

  if (loading) return (<><Navbar /><div className="dashboard-wrapper"><p>Loading...</p></div></>);
  if (!user) return (<><Navbar /><div className="dashboard-wrapper"><p>Please login first</p></div></>);

  const pendingApps = applications.filter((a) => a.status === "pending").length;
  const acceptedApps = applications.filter((a) => a.status === "accepted").length;
  const rejectedApps = applications.filter((a) => a.status === "rejected").length;

  return (
    <>
      <Navbar />
      <div className="dashboard-wrapper">
        <div className="dashboard-header">
          <div><h1>{user.role === "volunteer" ? "My Applications" : "Manage Applications"}</h1><p className="breadcrumb">SkillBridge / Applications</p></div>
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
            <div><h2>{user.role === "volunteer" ? "Application History" : "All Applications"}</h2><p>{user.role === "volunteer" ? "Track your submitted applications" : "Review and manage volunteer applications"}</p></div>
          </div>

          {loadingApps ? <p>Loading applications...</p> : applications.length === 0 ? (
            <div className="empty-state">
              <p>{user.role === "volunteer" ? "You haven't applied to any opportunities yet." : "No applications received yet."}</p>
              {user.role === "volunteer" && <button className="btn-primary-large" onClick={() => navigate("/browse-opportunities")}>Browse Opportunities</button>}
            </div>
          ) : (
            <div className="table-responsive">
              <table className="opps-table">
                <thead><tr>
                  {user.role === "volunteer" ? (
                    <><th>OPPORTUNITY</th><th>APPLIED DATE</th><th>STATUS</th><th>ACTIONS</th></>
                  ) : (
                    <><th>VOLUNTEER</th><th>OPPORTUNITY</th><th>APPLIED DATE</th><th>STATUS</th><th>ACTIONS</th></>
                  )}
                </tr></thead>
                <tbody>
                  {applications.map((app) => (
                    <tr key={app._id}>
                      {user.role === "volunteer" ? (
                        <>
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
                        </>
                      ) : (
                        <>
                          <td>
                            <div className="opp-title-cell">
                              <p className="opp-title">{app.volunteer_id?.name}</p>
                              <p className="opp-location">📧 {app.applicant_email}</p>
                            </div>
                          </td>
                          <td>
                            <div className="opp-title-cell">
                              <p className="opp-title">{app.opportunity_id?.title}</p>
                              <p className="opp-location">📍 {app.opportunity_id?.location}</p>
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
                              {app.status === "pending" && (
                                <>
                                  <button className="btn-edit" onClick={() => handleStatusUpdate(app._id, "accepted")}>
                                    ✅ Accept
                                  </button>
                                  <button className="btn-delete" onClick={() => handleStatusUpdate(app._id, "rejected")}>
                                    ❌ Reject
                                  </button>
                                </>
                              )}
                              {app.status === "accepted" && (
                                <>
                                  <button className="btn-message" onClick={() => navigate("/messages")}>
                                    💬 Message
                                  </button>
                                  <button className="btn-delete" onClick={() => handleStatusUpdate(app._id, "rejected")}>
                                    ❌ Reject
                                  </button>
                                </>
                              )}
                              {app.status === "rejected" && (
                                <button className="btn-edit" onClick={() => handleStatusUpdate(app._id, "accepted")}>
                                  ✅ Accept
                                </button>
                              )}
                            </div>
                          </td>
                        </>
                      )}
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
