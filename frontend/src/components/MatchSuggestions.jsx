import { useEffect, useMemo, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import matchingService from "../services/matchingService";
import { Button } from "./ui/button";

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
      setSuggestions(res.data.suggestions || []);
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

  // Sort by matchScore (highest first) and take top 2
  const topMatches = useMemo(() => {
    return [...suggestions]
      .sort((a, b) => (b.matchScore || 0) - (a.matchScore || 0))
      .slice(0, 2);
  }, [suggestions]);

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <h3 className="text-lg font-semibold text-slate-900">Match Suggestions</h3>
          <p className="text-sm text-slate-600">Opportunities that align with your skills.</p>
        </div>
        <Button variant="secondary" size="sm" onClick={() => navigate("/matches")}>
          View All Matches
        </Button>
      </div>

      {loadingSuggestions ? (
        <p className="text-sm text-slate-500">Loading suggestions...</p>
      ) : suggestions.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 px-4 py-6 text-sm text-slate-600">
          Complete your profile with skills and location to get personalized suggestions.
        </div>
      ) : (
        <div className="space-y-4">
          {topMatches.map((suggestion) => (
            <article key={suggestion._id} className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <div className="mb-2 flex items-start justify-between gap-3">
                <h4 className="text-base font-semibold text-slate-900">{suggestion.title}</h4>
                <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                  {suggestion.matchScore}% match
                </span>
              </div>

              <div className="mb-2 flex flex-wrap gap-3 text-xs text-slate-600">
                <span>Location: {suggestion.location}</span>
                <span>Duration: {suggestion.duration}</span>
              </div>

              <div className="mb-2 flex flex-wrap gap-2">
                {suggestion.matchReasons.map((reason, i) => (
                  <span key={i} className="rounded-full bg-orange-100 px-2 py-1 text-xs font-medium text-orange-700">
                    {reason}
                  </span>
                ))}
              </div>

              <div className="mb-4 flex flex-wrap gap-2">
                {suggestion.required_skills?.map((skill, i) => (
                  <span key={i} className="rounded-md bg-slate-200 px-2 py-1 text-xs text-slate-700">
                    {skill}
                  </span>
                ))}
              </div>

              {/* <Button size="sm" onClick={() => handleViewOpportunity(suggestion._id)}>
                View Opportunity
              </Button> */}
            </article>
          ))}
        </div>
      )}

    </section>
  );
}