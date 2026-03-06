import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import opportunityService from "../services/opportunityService";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import "../styles/opportunityCreate.css";

// This component is used for both creating and editing opportunities.
export default function OpportunityCreate() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { id } = useParams(); // if editing

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    required_skills: [],
    duration: "",
    location: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSkillsChange = (e) => {
    const skills = e.target.value.split(",").map((skill) => skill.trim());
    setFormData((prev) => ({
      ...prev,
      required_skills: skills,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      if (!formData.title || !formData.description || !formData.duration || !formData.location) {
        setError("Please fill all required fields");
        setLoading(false);
        return;
      }

      if (id) {
        // editing existing opportunity
        await opportunityService.updateOpportunity(id, formData);
      } else {
        await opportunityService.createOpportunity(formData);
      }

      setTimeout(() => {
        navigate("/opportunities");
      }, 500);
    } catch (err) {
      setError(err.response?.data?.message || (id ? "Failed to update opportunity" : "Failed to create opportunity"));
    } finally {
      setLoading(false);
    }
  };

  // Check if user is NGO
  if (user?.role !== "ngo") {
    return (
      <div className="error-container">
        <h2>Access Denied</h2>
        <p>Only NGOs can create or edit opportunities</p>
      </div>
    );
  }

  // if editing, fetch existing info
  useEffect(() => {
    if (id) {
      const loadOpp = async () => {
        try {
          const res = await opportunityService.getOpportunityById(id);
          // backend returns opportunity object directly
          const opp = res.data;
          setFormData({
            title: opp.title || "",
            description: opp.description || "",
            required_skills: opp.required_skills || [],
            duration: opp.duration || "",
            location: opp.location || "",
          });
        } catch (err) {
          console.error("Failed to load opportunity", err);
        }
      };
      loadOpp();
    }
  }, [id]);

  return (
    <>
      <Navbar />
      <div className="opportunity-create-container">
      <button 
        className="back-btn"
        onClick={() => navigate("/opportunities")}
        type="button"
      >
        ← Back to Opportunities
      </button>

      <h2>{id ? "Edit Opportunity" : "Create New Opportunity"}</h2>

      {error && <div className="error-message">{error}</div>}

      <form onSubmit={handleSubmit} className="create-form">
        <div className="form-group">
          <label>Title *</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="e.g., Digital Literacy Training"
            required
          />
        </div>

        <div className="form-group">
          <label>Description *</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Describe the opportunity in detail"
            rows="5"
            required
          ></textarea>
        </div>

        <div className="form-group">
          <label>Required Skills (comma-separated)</label>
          <input
            type="text"
            name="required_skills"
            value={formData.required_skills.join(", ")}
            onChange={handleSkillsChange}
            placeholder="e.g., Teaching, Technology, Communication"
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Duration *</label>
            <input
              type="text"
              name="duration"
              value={formData.duration}
              onChange={handleChange}
              placeholder="e.g., 3 months, 6 weeks"
              required
            />
          </div>

          <div className="form-group">
            <label>Location *</label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="e.g., New York, Remote"
              required
            />
          </div>
        </div>

        <div className="form-actions">
          <button type="submit" disabled={loading} className="submit-btn">
            {loading ? (id ? "Updating..." : "Creating...") : id ? "Update Opportunity" : "Create Opportunity"}
          </button>
          <button
            type="button"
            onClick={() => navigate("/opportunities")}
            className="cancel-btn"
          >
            Cancel
          </button>
        </div>
      </form>
      </div>
    </>
  );
}
