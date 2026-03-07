import { useState } from "react";
import applicationService from "../services/applicationService";

export default function ApplicationForm({ opportunity, onClose, onSuccess }) {
  const [coverLetter, setCoverLetter] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await applicationService.applyToOpportunity(opportunity._id, coverLetter);
      onSuccess();
      onClose();
    } catch (error) {
      setError(error.response?.data?.message || "Failed to submit application");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Apply for Opportunity</h3>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>

        <div className="modal-body">
          <div className="opportunity-summary">
            <h4>{opportunity.title}</h4>
            <p className="opportunity-meta">
              📍 {opportunity.location} • ⏱️ {opportunity.duration}
            </p>
            <p className="opportunity-description">{opportunity.description}</p>
            {opportunity.required_skills?.length > 0 && (
              <div className="skills-section">
                <strong>Required Skills:</strong>
                <div className="skills-list">
                  {opportunity.required_skills.map((skill, i) => (
                    <span key={i} className="skill-tag">{skill}</span>
                  ))}
                </div>
              </div>
            )}
          </div>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="coverLetter">
                Cover Letter <span className="optional">(Optional)</span>
              </label>
              <textarea
                id="coverLetter"
                value={coverLetter}
                onChange={(e) => setCoverLetter(e.target.value)}
                placeholder="Tell us why you're interested in this opportunity and how your skills match..."
                rows={6}
                className="form-textarea"
              />
              <small className="form-help">
                Share your motivation, relevant experience, and why you'd be a great fit for this role.
              </small>
            </div>

            {error && <div className="error-message">{error}</div>}

            <div className="form-actions">
              <button type="button" onClick={onClose} className="btn-secondary">
                Cancel
              </button>
              <button type="submit" disabled={loading} className="btn-primary">
                {loading ? "Submitting..." : "Submit Application"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}