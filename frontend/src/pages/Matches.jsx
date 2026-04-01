import { useEffect, useMemo, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import matchingService from "../services/matchingService";
import applicationService from "../services/applicationService";
import Navbar from "../components/Navbar";
import { Button } from "../components/ui/button";
import { toast } from "sonner";

export default function Matches() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [matches, setMatches] = useState([]);
  const [loadingMatches, setLoadingMatches] = useState(false);
  const [error, setError] = useState("");
  const [appliedIds, setAppliedIds] = useState(new Set());
  const [applyingId, setApplyingId] = useState("");

  useEffect(() => {
    if (!loading && user?.role === "volunteer") {
      fetchMatches();
      fetchApplications();
    }
  }, [loading, user?._id]);

  const sortedMatches = useMemo(() => {
    return [...matches].sort((a, b) => (b.matchScore || 0) - (a.matchScore || 0));
  }, [matches]);

  const fetchMatches = async () => {
    try {
      setLoadingMatches(true);
      setError("");
      const res = await matchingService.getVolunteerOpportunityMatches();
      setMatches(res.data.suggestions || []);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to load matches");
    } finally {
      setLoadingMatches(false);
    }
  };

  const fetchApplications = async () => {
    try {
      const res = await applicationService.getMyApplications();
      const ids = new Set((res.data.applications || []).map((app) => app.opportunity_id?._id));
      setAppliedIds(ids);
    } catch {
      // non-blocking for matches page
    }
  };

  const handleApply = async (opportunityId) => {
    try {
      setApplyingId(opportunityId);
      await applicationService.applyToOpportunity(opportunityId, "Interested in this opportunity");
      toast.success("Application submitted successfully");
      setAppliedIds((prev) => new Set(prev).add(opportunityId));
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to apply");
    } finally {
      setApplyingId("");
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <main className="mx-auto max-w-6xl px-4 py-8 md:px-6">
          <p className="text-slate-600">Loading matches...</p>
        </main>
      </>
    );
  }

  if (!user) {
    return (
      <>
        <Navbar />
        <main className="mx-auto max-w-6xl px-4 py-8 md:px-6">
          <p className="text-slate-600">Please login first.</p>
        </main>
      </>
    );
  }

  if (user.role !== "volunteer") {
    return (
      <>
        <Navbar />
        <main className="mx-auto max-w-6xl px-4 py-8 md:px-6">
          <p className="text-slate-600">Only volunteers can access matches.</p>
          <Button className="mt-4" onClick={() => navigate("/dashboard")}>Back to Dashboard</Button>
        </main>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-6xl space-y-5 px-4 py-8 md:px-6 md:py-10">
        <header>
          <h1 className="text-3xl font-bold text-slate-900">Recommended Matches</h1>
          <p className="mt-1 text-slate-600">Best skill matches are shown first.</p>
        </header>

        {loadingMatches ? (
          <div className="rounded-xl border border-slate-200 bg-white p-6 text-slate-600">Loading match opportunities...</div>
        ) : error ? (
          <div className="rounded-xl border border-rose-200 bg-rose-50 p-6 text-rose-700">{error}</div>
        ) : sortedMatches.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center text-slate-600">
            No matches found yet. Add more skills to your profile and try again.
          </div>
        ) : (
          <section className="grid gap-4">
            {sortedMatches.map((opportunity) => {
              const alreadyApplied = appliedIds.has(opportunity._id);
              return (
                <article key={opportunity._id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <h2 className="text-lg font-semibold text-slate-900">{opportunity.title}</h2>
                      <p className="text-sm text-slate-600">NGO: {opportunity.ngo_id?.organization_name || "Unknown NGO"}</p>
                    </div>
                    <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-700">
                      {opportunity.matchScore || 0}% match
                    </span>
                  </div>

                  <div className="mt-3 flex flex-wrap gap-3 text-sm text-slate-600">
                    <span>Location: {opportunity.location}</span>
                    <span>Skills: {(opportunity.required_skills || []).join(", ") || "Not specified"}</span>
                  </div>

                  <div className="mt-4 flex gap-2">
                    <Button
                      disabled={alreadyApplied || applyingId === opportunity._id}
                      onClick={() => handleApply(opportunity._id)}
                    >
                      {alreadyApplied ? "Applied" : applyingId === opportunity._id ? "Applying..." : "Apply"}
                    </Button>
                    <Button variant="secondary" onClick={() => navigate(`/browse-opportunities?highlight=${opportunity._id}`)}>
                      View Details
                    </Button>
                  </div>
                </article>
              );
            })}
          </section>
        )}
      </main>
    </>
  );
}
