import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import matchingService from "../services/matchingService";

export default function MatchSuggestions() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [suggestions, setSuggestions] = useState([]);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);

  useEffect(() => {
    if (!loading && user?.role === "volunteer") {
      fetchMatchSuggestions();
    }
  }, [user, loading]);

  const fetchMatchSuggestions = async () => {
    try {
      setLoadingSuggestions(true);
      const res = await matchingService.getMatchSuggestions();
      setSuggestions(res.data.suggestions.slice(0, 5)); // Show top 5
    } catch (error) {
      console.error("Failed to fetch match suggestions:", error);
    } finally {
      setLoadingSuggestions(false);
    }
  };

  const handleViewOpportunity = (oppId) => {
    navigate(`/browse-opportunities?highlight=${oppId}`);
  };

  if (loading || user?.role !== "volunteer") return null;

  return (
    <div className="match-suggestions">
      <div className="section-header">
        <h3>🎯 Match Suggestions</h3>
        <p>Opportunities that match your skills</p>
      </div>

      {loadingSuggestions ? (
        <p>Loading suggestions...</p>
      ) : suggestions.length === 0 ? (
        <div className="empty-suggestions">
          <p>Complete your profile with skills and location to get personalized suggestions!</p>
        </div>
      ) : (
        <div className="suggestions-list">
          {suggestions.map((suggestion) => (
            <div key={suggestion._id} className="suggestion-item">
              <div className="suggestion-header">
                <h4>{suggestion.title}</h4>
                <div className="match-score">
                  <span className="score-badge">{suggestion.matchScore}% match</span>
                </div>
              </div>

              <div className="suggestion-meta">
                <span className="location">📍 {suggestion.location}</span>
                <span className="duration">⏱️ {suggestion.duration}</span>
              </div>

              <div className="match-reasons">
                {suggestion.matchReasons.map((reason, i) => (
                  <span key={i} className="reason-tag">{reason}</span>
                ))}
              </div>

              <div className="suggestion-skills">
                {suggestion.required_skills?.slice(0, 3).map((skill, i) => (
                  <span key={i} className="skill-tag-small">{skill}</span>
                ))}
              </div>

              <button
                onClick={() => handleViewOpportunity(suggestion._id)}
                className="btn-view-opportunity"
              >
                View Opportunity
              </button>
            </div>
          ))}
        </div>
      )}

      {suggestions.length > 0 && (
        <div className="view-all-suggestions">
          <button
            onClick={() => navigate('/browse-opportunities?tab=matches')}
            className="btn-secondary"
          >
            View All Matches
          </button>
        </div>
      )}
    </div>
  );
}