import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import opportunityService from "../services/opportunityService";
import applicationService from "../services/applicationService";
import Navbar from "../components/Navbar";
import ApplicationForm from "../components/ApplicationForm";
import "../styles/opportunities.css";

export default function BrowseOpportunities() {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  
  // State variables as per requirements
  const [opportunities, setOpportunities] = useState([]);
  const [search, setSearch] = useState("");
  const [skill, setSkill] = useState("");
  const [location, setLocation] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Application state
  const [showApplicationForm, setShowApplicationForm] = useState(false);
  const [selectedOpportunity, setSelectedOpportunity] = useState(null);
  const [userApplications, setUserApplications] = useState([]);
  
  // Local state for filters before applying
  const [searchInput, setSearchInput] = useState("");
  const [skillInput, setSkillInput] = useState("");
  const [locationInput, setLocationInput] = useState("");

  // Fetch opportunities from API with partial matching filter
  const fetchOpportunities = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch all open opportunities
      const res = await opportunityService.getAllOpportunities({ status: "open" });
      let allOpportunities = res.data.opportunities || [];
      
      // Filter locally for partial matching - if ANY field matches
      if (search || skill || location) {
        const searchLower = search.toLowerCase().trim();
        const skillLower = skill.toLowerCase().trim();
        const locationLower = location.toLowerCase().trim();
        
        allOpportunities = allOpportunities.filter(opp => {
          // Check partial match in each field
          const titleMatch = searchLower && opp.title?.toLowerCase().includes(searchLower);
          const ngoMatch = searchLower && opp.ngo_id?.name?.toLowerCase().includes(searchLower);
          const skillMatch = skillLower && opp.required_skills?.some(s => 
            s.toLowerCase().includes(skillLower)
          );
          const locationMatch = locationLower && opp.location?.toLowerCase().includes(locationLower);
          
          // Return true if ANY of the filled fields match
          return titleMatch || ngoMatch || skillMatch || locationMatch;
        });
      }
      
      setOpportunities(allOpportunities);
    } catch (err) {
      console.error("Failed to fetch opportunities:", err);
      setError("Failed to load opportunities. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  // Fetch user's applications
  const fetchUserApplications = async () => {
    try {
      const res = await applicationService.getMyApplications();
      setUserApplications(res.data.applications || []);
    } catch (err) {
      console.error("Failed to fetch applications:", err);
    }
  };

  // Apply filters button handler
  const applyFilters = () => {
    setSearch(searchInput);
    setSkill(skillInput);
    setLocation(locationInput);
  };

  // Clear all filters
  const clearFilters = () => {
    setSearchInput("");
    setSkillInput("");
    setLocationInput("");
    setSearch("");
    setSkill("");
    setLocation("");
    fetchOpportunities();
  };

  // Fetch opportunities when search/skill/location changes
  useEffect(() => {
    if (!authLoading) {
      fetchOpportunities();
      if (user) {
        fetchUserApplications();
      }
    }
  }, [authLoading, search, skill, location, user]);

  // Handle view details / apply button click
  const handleViewDetails = (opportunity) => {
    setSelectedOpportunity(opportunity);
    setShowApplicationForm(true);
  };

  // Handle successful application submission
  const handleApplicationSuccess = () => {
    fetchUserApplications();
    setShowApplicationForm(false);
    setSelectedOpportunity(null);
    alert("Application submitted successfully! We'll notify you soon.");
  };

  // Check if already applied
  const isAlreadyApplied = (oppId) => {
    return userApplications.some(app => app.opportunity_id?._id === oppId);
  };

  // Show loading while checking auth
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

  // Check if user is logged in and is a volunteer
  if (!user) {
    return (
      <>
        <Navbar />
        <div className="opportunities-page">
          <div className="opportunities-wrapper">
            <div className="error-state">
              <p>Please login first to browse opportunities.</p>
            </div>
          </div>
        </div>
      </>
    );
  }

  if (user.role !== "volunteer") {
    return (
      <>
        <Navbar />
        <div className="opportunities-page">
          <div className="opportunities-wrapper">
            <div className="error-state">
              <p>Access denied. This page is for volunteers only.</p>
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

          {/* Filter Section */}
          <div className="filter-section">
            <div className="filter-header">
              <h2 className="filter-title">Filter Opportunities</h2>
              <p className="filter-subtitle">Find opportunities that match your skills and preferences</p>
            </div>
            
            <div className="filter-container">
              {/* Search Bar */}
              <div className="filter-item">
                <label className="filter-label">Search</label>
                <input
                  type="text"
                  className="filter-input"
                  placeholder="Search by title or NGO name..."
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && applyFilters()}
                />
              </div>

              {/* Skill Filter */}
              <div className="filter-item">
                <label className="filter-label">Skill</label>
                <input
                  type="text"
                  className="filter-input"
                  placeholder="e.g., React, Teaching, Design..."
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && applyFilters()}
                />
              </div>

              {/* Location Filter */}
              <div className="filter-item">
                <label className="filter-label">Location</label>
                <input
                  type="text"
                  className="filter-input"
                  placeholder="e.g., Mumbai, Delhi, Remote..."
                  value={locationInput}
                  onChange={(e) => setLocationInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && applyFilters()}
                />
              </div>

              {/* Apply Button */}
              <div className="filter-item filter-btn-item">
                <label className="filter-label">&nbsp;</label>
                <button className="btn-apply-filters" onClick={applyFilters}>
                  Apply
                </button>
              </div>

              {/* Clear Button */}
              <div className="filter-item filter-btn-item">
                <label className="filter-label">&nbsp;</label>
                <button className="btn-clear-filters" onClick={clearFilters}>
                  Clear
                </button>
              </div>
            </div>
          </div>

          {/* Opportunities Section */}
          <div className="opportunities-section">
            <div className="section-header">
              <h2>Available Opportunities</h2>
              <p>Find and apply to volunteering opportunities</p>
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
                <p>No opportunities match your filters. Try adjusting your search criteria.</p>
              </div>
            ) : (
              /* Card Grid Layout */
              <div className="opportunities-grid">
                {opportunities.map((opp) => {
                  const applied = isAlreadyApplied(opp._id);
                  
                  return (
                    <div key={opp._id} className="opportunity-card">
                      <div className="opportunity-card-body">
                        {/* Title */}
                        <h3 className="opportunity-card-title">{opp.title}</h3>
                        
                        {/* NGO Name */}
                        <div className="opportunity-card-field">
                          <span className="opportunity-card-label">NGO:</span>
                          <span className="opportunity-card-value">
                            {opp.ngo_id?.name || "Unknown NGO"}
                          </span>
                        </div>
                        
                        {/* Skills - Comma-separated list as tags */}
                        <div className="opportunity-card-field">
                          <span className="opportunity-card-label">Skills:</span>
                          <div className="opportunity-card-value">
                            {opp.required_skills && opp.required_skills.length > 0 ? (
                              <div className="opportunity-card-skills">
                                {opp.required_skills.slice(0, 5).map((skillItem, index) => (
                                  <span key={index} className="skill-tag">
                                    {skillItem}
                                  </span>
                                ))}
                                {opp.required_skills.length > 5 && (
                                  <span className="skill-tag">+{opp.required_skills.length - 5}</span>
                                )}
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
                      
                      {/* Card Footer with View Details/Apply Button */}
                      <div className="opportunity-card-footer">
                        {applied ? (
                          <button 
                            className="btn-view-details btn-applied"
                            disabled
                          >
                            ✓ Applied
                          </button>
                        ) : (
                         <button 
  className="btn-view-details"
  onClick={() => navigate(`/opportunities/${opp._id}`)}
>
  View Details
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
      </div>

      {/* Application Form Modal */}
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
