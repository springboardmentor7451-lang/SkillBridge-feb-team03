import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";
import opportunityService from "../services/opportunityService";
import applicationService from "../services/applicationService";
import Navbar from "../components/Navbar";
import "../styles/dashboard.css";

export default function BrowseOpportunities() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [opportunities, setOpportunities] = useState([]);
  const [userApplications, setUserApplications] = useState([]);
  const [loadingOpps, setLoadingOpps] = useState(false);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    if (!loading && user?.role === "volunteer") {
      fetchOpportunities();
      fetchUserApplications();
    }
  }, [user, loading, location]);

  const fetchOpportunities = async () => {
    try {
      setLoadingOpps(true);
      const res = await opportunityService.getAllOpportunities();
      setOpportunities(res.data.opportunities);
    } catch (error) {
      console.error("Failed to fetch opportunities:", error);
    } finally {
      setLoadingOpps(false);
    }
  };

  const fetchUserApplications = async () => {
    try {
      const res = await applicationService.getMyApplications();
      setUserApplications(res.data.applications);
    } catch (error) {
      console.error("Failed to fetch applications:", error);
    }
  };

  const handleApply = async (oppId) => {
    console.log("Applying to opportunity:", oppId);
    try {
      console.log("Calling applicationService.applyToOpportunity");
      const response = await applicationService.applyToOpportunity(oppId);
      console.log("Application response:", response);
      // Refresh applications list
      fetchUserApplications();
      alert("Application submitted! We'll notify you soon.");
    } catch (error) {
      console.error("Failed to apply:", error);
      console.error("Error response:", error.response);
      console.error("Error data:", error.response?.data);
      alert(error.response?.data?.message || "Failed to apply to opportunity");
    }
  };

  const isAlreadyApplied = (oppId) => {
    return userApplications.some((app) => app.opportunity_id._id === oppId);
  };

  const getApplicationStatus = (oppId) => {
    const app = userApplications.find((app) => app.opportunity_id._id === oppId);
    return app?.status || null;
  };

  const filteredOpportunities = filter === "all" 
    ? opportunities 
    : opportunities.filter((o) => o.status === filter);

  if (loading) return (<><Navbar /><div className="dashboard-wrapper"><p>Loading...</p></div></>);
  if (!user) return (<><Navbar /><div className="dashboard-wrapper"><p>Please login first</p></div></>);
  if (user.role !== "volunteer") return (<><Navbar /><div className="dashboard-wrapper"><p>Access denied</p></div></>);

  return (
    <>
      <Navbar />
      <div className="dashboard-wrapper">
        <div className="dashboard-header">
          <div><h1>Browse Opportunities</h1><p className="breadcrumb">SkillBridge / Opportunities</p></div>
        </div>

        <div className="stats-container">
          <div className="stat-card-new">
            <div className="stat-icon">📋</div>
            <div className="stat-content"><p className="stat-value-big">{opportunities.length}</p><p className="stat-label-small">Total Opportunities</p></div>
          </div>
          <div className="stat-card-new">
            <div className="stat-icon">🟢</div>
            <div className="stat-content"><p className="stat-value-big">{opportunities.filter((o) => o.status === "open").length}</p><p className="stat-label-small">Open Positions</p></div>
          </div>
          <div className="stat-card-new">
            <div className="stat-icon">🏢</div>
            <div className="stat-content"><p className="stat-value-big">{new Set(opportunities.map((o) => o.ngo_id)).size}</p><p className="stat-label-small">NGOs Hiring</p></div>
          </div>
          <div className="stat-card-new">
            <div className="stat-icon">👥</div>
            <div className="stat-content"><p className="stat-value-big">{userApplications.length}</p><p className="stat-label-small">My Applications</p></div>
          </div>
        </div>

        <div className="opportunities-section">
          <div className="section-header">
            <div><h2>Available Opportunities</h2><p>Find and apply to volunteering opportunities</p></div>
            <div className="filter-group">
              <select value={filter} onChange={(e) => setFilter(e.target.value)} className="filter-select">
                <option value="all">All Statuses</option>
                <option value="open">Open</option>
                <option value="closed">Closed</option>
              </select>
            </div>
          </div>

          {loadingOpps ? <p>Loading opportunities...</p> : filteredOpportunities.length === 0 ? (
            <div className="empty-state">
              <p>No opportunities available at the moment. Check back soon!</p>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="opps-table">
                <thead><tr><th>OPPORTUNITY</th><th>SKILLS</th><th>STATUS</th><th>ACTIONS</th></tr></thead>
                <tbody>
                  {filteredOpportunities.map((opp) => {
                    const isApplied = isAlreadyApplied(opp._id);
                    const appStatus = getApplicationStatus(opp._id);
                    return (
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
                      <td>
                        <div className="action-buttons">
                          {isApplied ? (
                            <button className="btn-applied" disabled>
                              ✓ {appStatus === "pending" ? "Pending" : appStatus === "accepted" ? "Accepted" : "Applied"}
                            </button>
                          ) : (
                            <button className="btn-apply" onClick={() => handleApply(opp._id)} disabled={opp.status !== "open"}>
                              {opp.status === "open" ? "✉️ Apply" : "Closed"}
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
