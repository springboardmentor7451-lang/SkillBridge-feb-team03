import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import opportunityService from "../services/opportunityService";
import Navbar from "../components/Navbar";
import "../styles/opportunities.css";

export default function Opportunities() {
  const { loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [opportunities, setOpportunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch opportunities when component mounts
  useEffect(() => {
    if (!authLoading) {
      fetchOpportunities();
    }
  }, [authLoading]);

  // Fetch all opportunities from the API
  const fetchOpportunities = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch all open opportunities from the backend
      const res = await opportunityService.getAllOpportunities({ status: "open" });
      setOpportunities(res.data.opportunities || []);
    } catch (err) {
      console.error("Failed to fetch opportunities:", err);
      setError("Failed to load opportunities. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  // Handle view details button click
  const handleViewDetails = (opportunity) => {
    // Navigate to opportunity details page or open a modal
    console.log("View details for:", opportunity._id);
    // For now, we can navigate to browse opportunities page or show details
    navigate(`/browse-opportunities`);
  };

  // Render loading state
  if (authLoading) {
    return (
      <>
        <Navbar />
        <div className="opportunities-page">
          <div className="opportunities-wrapper">
            <div className="loading-state">
              <p>Loading...</p>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="opportunities-page">
        <div className="opportunities-wrapper">
          {/* Header */}
          <div className="opportunities-header">
            <h1>Browse Opportunities</h1>
            <p className="opportunities-breadcrumb">SkillBridge / Opportunities</p>
          </div>

          {/* Stats Section */}
          <div className="stats-container">
            <div className="stat-card">
              <div className="stat-icon">📋</div>
              <div className="stat-content">
                <p className="stat-value">{opportunities.length}</p>
                <p className="stat-label">Total Opportunities</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">🟢</div>
              <div className="stat-content">
                <p className="stat-value">
                  {opportunities.filter((o) => o.status === "open").length}
                </p>
                <p className="stat-label">Open Positions</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">🏢</div>
              <div className="stat-content">
                <p className="stat-value">
                  {new Set(opportunities.map((o) => o.ngo_id?._id)).size}
                </p>
                <p className="stat-label">NGOs Hiring</p>
              </div>
            </div>
          </div>

          {/* Opportunities Section */}
          <div className="opportunities-section">
            <div className="section-header">
              <h2>Available Opportunities</h2>
              <p>Find volunteering opportunities that match your skills</p>
            </div>

            {/* Loading State */}
            {loading ? (
              <div className="loading-state">
                <p>Loading opportunities...</p>
              </div>
            ) : error ? (
              /* Error State */
              <div className="error-state">
                <p>{error}</p>
                <button className="btn-primary" onClick={fetchOpportunities}>
                  Try Again
                </button>
              </div>
            ) : opportunities.length === 0 ? (
              /* Empty State */
              <div className="empty-state">
                <p>No opportunities available at the moment. Check back later!</p>
              </div>
            ) : (
              /* Opportunities Grid - Card Layout */
              <div className="opportunities-grid">
                {opportunities.map((opp) => (
                  <div key={opp._id} className="opportunity-card">
                    <div className="opportunity-card-body">
                      {/* Title */}
                      <h3 className="opportunity-card-title">{opp.title}</h3>
                      {opp.description && (
  <p className="opportunity-card-description">
    {opp.description.slice(0, 120)}...
  </p>
)}
                      
                      {/* NGO Name */}
                      <div className="opportunity-card-field">
                        <span className="opportunity-card-label">NGO:</span>
                        <span className="opportunity-card-value">
                          {opp.ngo_id?.name || "Unknown NGO"}
                        </span>
                      </div>
                      
                      {/* Skills - Comma-separated list */}
                      <div className="opportunity-card-field">
                        <span className="opportunity-card-label">Skills:</span>
                        <div className="opportunity-card-value">
                          {opp.required_skills && opp.required_skills.length > 0 ? (
                            <div className="opportunity-card-skills">
                              {opp.required_skills.map((skill, index) => (
                                <span key={index} className="skill-tag">
                                  {skill}
                                </span>
                              ))}
                            </div>
                          ) : (
                            <span>Not specified</span>
                          )}
                        </div>
                      </div>
                      
                      {/* Location */}
                      <div className="opportunity-card-field">
                        <span className="opportunity-card-label">Location:</span>
                        <span className="opportunity-card-value">
                          {opp.location || "Not specified"}
                        </span>
                      </div>
                      
                      {/* Duration */}
                      <div className="opportunity-card-field">
                        <span className="opportunity-card-label">Duration:</span>
                        <span className="opportunity-card-value">
                          {opp.duration || "Not specified"}
                        </span>
                      </div>
                    </div>
                    
                    {/* Card Footer with View Details Button */}
                    <div className="opportunity-card-footer">
                      <button 
                        className="btn-view-details"
                        onClick={() => handleViewDetails(opp)}
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
