import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";
import opportunityService from "../services/opportunityService";
import applicationService from "../services/applicationService";
import Navbar from "../components/Navbar";
import ApplicationForm from "../components/ApplicationForm";
import "../styles/dashboard.css";

export default function BrowseOpportunities() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [opportunities, setOpportunities] = useState([]);
  const [userApplications, setUserApplications] = useState([]);
  const [loadingOpps, setLoadingOpps] = useState(false);
  const [filters, setFilters] = useState({
    skills: "",
    location: "",
    duration: "",
    status: "open"
  });
  const [showApplicationForm, setShowApplicationForm] = useState(false);
  const [selectedOpportunity, setSelectedOpportunity] = useState(null);

  useEffect(() => {
    if (!loading && user?.role === "volunteer") {
      fetchOpportunities();
      fetchUserApplications();
    }
  }, [user, loading, location]);

  const fetchOpportunities = async () => {
    try {
      setLoadingOpps(true);
      const res = await opportunityService.getAllOpportunities(filters);
      setOpportunities(res.data.opportunities);
    } catch (error) {
      console.error("Failed to fetch opportunities:", error);
    } finally {
      setLoadingOpps(false);
    }
  };

  const handleFilterChange = (field, value) => {
    setFilters((prev) => ({
      ...prev,
      [field]: value
    }));
  };

  const applyFilters = () => {
    fetchOpportunities();
  };

  const clearFilters = () => {
    setFilters({
      skills: "",
      location: "",
      duration: "",
      status: "open"
    });
    fetchOpportunities();
  };

  const fetchUserApplications = async () => {
    try {
      const res = await applicationService.getMyApplications();
      setUserApplications(res.data.applications);
    } catch (error) {
      console.error("Failed to fetch applications:", error);
    }
  };

  const handleApply = (opportunity) => {
    setSelectedOpportunity(opportunity);
    setShowApplicationForm(true);
  };

  const handleApplicationSuccess = () => {
    fetchUserApplications();
    alert("Application submitted successfully!");
  };

  const isAlreadyApplied = (oppId) => {
    return userApplications.some((app) => app.opportunity_id?._id === oppId);
  };

  const getApplicationStatus = (oppId) => {
    const app = userApplications.find((app) => app.opportunity_id?._id === oppId);
    return app?.status || null;
  };

  if (loading) {
    return (
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
  }

  if (!user) {
    return (
      <>
        <Navbar />
        <div className="dashboard-wrapper">
          <div className="auth-required">
            <div className="auth-icon">🔐</div>
            <h2>Login Required</h2>
            <p>Please login to browse opportunities</p>
            <button onClick={() => navigate("/login")} className="btn-primary-dashboard">
              Sign In
            </button>
          </div>
        </div>
      </>
    );
  }

  if (user.role !== "volunteer") {
    return (
      <>
        <Navbar />
        <div className="dashboard-wrapper">
          <div className="auth-required">
            <div className="auth-icon">🚫</div>
            <h2>Access Restricted</h2>
            <p>This page is for volunteers only</p>
            <button onClick={() => navigate("/dashboard")} className="btn-primary-dashboard">
              Go to Dashboard
            </button>
          </div>
        </div>
      </>
    );
  }

  const openOpps = opportunities.filter((o) => o.status === "open").length;
  const ngosCount = new Set(opportunities.map((o) => o.ngo_id)).size;

  return (
    <>
      <Navbar />
      <div className="dashboard-wrapper">
        <div className="page-header-enhanced">
          <div className="header-content">
            <h1>Browse Opportunities</h1>
            <p className="breadcrumb">SevaSetu / Browse Opportunities</p>
          </div>
          <div className="header-actions">
            <button onClick={fetchOpportunities} className="btn-refresh-enhanced">
              Refresh
            </button>
          </div>
        </div>

        <div className="stats-grid-enhanced">
          <div className="stat-card-enhanced stat-card-blue">
            <div className="stat-icon-wrapper">📋</div>
            <div className="stat-info">
              <span className="stat-number">{opportunities.length}</span>
              <span className="stat-label">Total</span>
            </div>
          </div>
          <div className="stat-card-enhanced stat-card-green">
            <div className="stat-icon-wrapper">✓</div>
            <div className="stat-info">
              <span className="stat-number">{openOpps}</span>
              <span className="stat-label">Open</span>
            </div>
          </div>
          <div className="stat-card-enhanced stat-card-orange">
            <div className="stat-icon-wrapper">🏢</div>
            <div className="stat-info">
              <span className="stat-number">{ngosCount}</span>
              <span className="stat-label">NGOs</span>
            </div>
          </div>
          <div className="stat-card-enhanced stat-card-purple">
            <div className="stat-icon-wrapper">📝</div>
            <div className="stat-info">
              <span className="stat-number">{userApplications.length}</span>
              <span className="stat-label">Applied</span>
            </div>
          </div>
        </div>

        <div className="filter-section-enhanced">
          <div className="filter-header">
            <h3>Filter Opportunities</h3>
            <p>Find opportunities matching your skills</p>
          </div>
          <div className="filter-body">
            <div className="filter-row-enhanced">
              <div className="filter-group-enhanced">
                <label>Skills</label>
                <input
                  type="text"
                  placeholder="e.g., Teaching, Programming"
                  value={filters.skills}
                  onChange={(e) => handleFilterChange("skills", e.target.value)}
                  className="filter-input-enhanced"
                />
              </div>
              <div className="filter-group-enhanced">
                <label>Location</label>
                <input
                  type="text"
                  placeholder="e.g., Mumbai, Remote"
                  value={filters.location}
                  onChange={(e) => handleFilterChange("location", e.target.value)}
                  className="filter-input-enhanced"
                />
              </div>
              <div className="filter-group-enhanced">
                <label>Duration</label>
                <select
                  value={filters.duration}
                  onChange={(e) => handleFilterChange("duration", e.target.value)}
                  className="filter-select-enhanced"
                >
                  <option value="">All</option>
                  <option value="Short-term">Short-term</option>
                  <option value="1-3 months">1-3 months</option>
                  <option value="3-6 months">3-6 months</option>
                  <option value="6-12 months">6-12 months</option>
                </select>
              </div>
              <div className="filter-group-enhanced">
                <label>Status</label>
                <select
                  value={filters.status}
                  onChange={(e) => handleFilterChange("status", e.target.value)}
                  className="filter-select-enhanced"
                >
                  <option value="open">Open</option>
                  <option value="all">All</option>
                  <option value="closed">Closed</option>
                </select>
              </div>
            </div>
            <div className="filter-actions-enhanced">
              <button onClick={applyFilters} className="btn-apply-filter">
                Apply Filters
              </button>
              <button onClick={clearFilters} className="btn-clear-filter">
                Clear
              </button>
            </div>
          </div>
        </div>

        <div className="opportunities-list-enhanced">
          {loadingOpps ? (
            <div className="loading-state">
              <div className="loading-spinner"></div>
              <p>Loading...</p>
            </div>
          ) : opportunities.length === 0 ? (
            <div className="empty-state-enhanced">
              <span className="empty-icon-large">🔍</span>
              <h3>No Opportunities Found</h3>
              <p>Try adjusting your filters.</p>
              <button onClick={clearFilters} className="btn-primary-dashboard">
                Clear Filters
              </button>
            </div>
          ) : (
            <div className="opportunities-grid">
              {opportunities.map((opp) => {
                const isApplied = isAlreadyApplied(opp._id);
                const appStatus = getApplicationStatus(opp._id);
                return (
                  <div key={opp._id} className="opportunity-card-enhanced">
                    <div className="opp-card-header">
                      <span className={`status-pill ${opp.status}`}>
                        {opp.status === "open" ? "Open" : "Closed"}
                      </span>
                      <span className="opp-duration">{opp.duration}</span>
                    </div>
                    <h3 className="opp-card-title">{opp.title}</h3>
                    <p className="opp-card-org">{opp.ngo_id?.name || "NGO"}</p>
                    <p className="opp-card-location">{opp.location}</p>
                    <div className="opp-card-skills">
                      {opp.required_skills?.slice(0, 4).map((skill, i) => (
                        <span key={i} className="skill-tag-enhanced">{skill}</span>
                      ))}
                      {opp.required_skills?.length > 4 && (
                        <span className="skill-tag-more">+{opp.required_skills.length - 4}</span>
                      )}
                    </div>
                    <p className="opp-card-desc">
                      {opp.description?.substring(0, 100)}
                      {opp.description?.length > 100 ? "..." : ""}
                    </p>
                    <div className="opp-card-footer">
                      {isApplied ? (
                        <span className={`application-status ${appStatus}`}>
                          {appStatus === "pending" ? "Pending" : 
                           appStatus === "accepted" ? "Accepted" : "Applied"}
                        </span>
                      ) : (
                        <button 
                          className="btn-apply-enhanced" 
                          onClick={() => handleApply(opp)}
                          disabled={opp.status !== "open"}
                        >
                          {opp.status === "open" ? "Apply" : "Closed"}
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {showApplicationForm && selectedOpportunity && (
        <ApplicationForm
          opportunity={selectedOpportunity}
          onClose={() => {
            setShowApplicationForm(false);
            setSelectedOpportunity(null);
          }}
          onSuccess={handleApplicationSuccess}
        />
      )}
    </>
  );
}

