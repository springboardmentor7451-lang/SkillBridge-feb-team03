import { useEffect, useMemo, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import matchingService from "../services/matchingService";
import applicationService from "../services/applicationService";
import Navbar from "../components/Navbar";
import { Button } from "../components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../components/ui/dialog";
import { toast } from "sonner";

export default function Matches() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [matches, setMatches] = useState([]);
  const [loadingMatches, setLoadingMatches] = useState(false);
  const [error, setError] = useState("");
  const [appliedIds, setAppliedIds] = useState(new Set());
  const [applyingId, setApplyingId] = useState("");
  const [showNgoDetails, setShowNgoDetails] = useState(false);
  const [selectedNgo, setSelectedNgo] = useState(null);
  const [selectedOpportunityDetails, setSelectedOpportunityDetails] = useState(null);

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

  const normalizeText = (value) => (value || "").toString().trim().toLowerCase();

  const getMatchSummary = (opportunity) => {
    const volunteerSkills = user?.skills || [];
    const requiredSkills = opportunity?.required_skills || [];

    const matchedSkills = requiredSkills.filter((requiredSkill) =>
      volunteerSkills.some((volSkill) => normalizeText(volSkill) === normalizeText(requiredSkill))
    );

    const missingSkills = requiredSkills.filter(
      (requiredSkill) => !matchedSkills.some((matchedSkill) => normalizeText(matchedSkill) === normalizeText(requiredSkill))
    );

    const matchPercentage = requiredSkills.length
      ? Math.round((matchedSkills.length / requiredSkills.length) * 100)
      : 0;

    let matchStrength = "Low Match";
    if (matchPercentage >= 80) {
      matchStrength = "Strong Match";
    } else if (matchPercentage >= 50) {
      matchStrength = "Moderate Match";
    }

    return { matchedSkills, missingSkills, matchPercentage, matchStrength };
  };

  const getApplicationStatus = (opportunityId) => {
    if (appliedIds.has(opportunityId)) return "Applied";
    return "Not Applied";
  };

  const handleViewNgoDetails = (opportunity) => {
    const ngoData = opportunity?.ngo_id;
    if (!ngoData || typeof ngoData === "string") {
      toast.error("NGO details are not available for this opportunity");
      return;
    }

    const matchSummary = getMatchSummary(opportunity);
    const applicationStatus = getApplicationStatus(opportunity._id);

    setSelectedNgo(ngoData);
    setSelectedOpportunityDetails({
      ...opportunity,
      ...matchSummary,
      applicationStatus,
    });
    setShowNgoDetails(true);
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
                    <Button variant="secondary" onClick={() => handleViewNgoDetails(opportunity)}>
                      View Details
                    </Button>
                  </div>
                </article>
              );
            })}
          </section>
        )}
      </main>

      <Dialog
        open={showNgoDetails}
        onOpenChange={(open) => {
          setShowNgoDetails(open);
          if (!open) {
            setSelectedNgo(null);
            setSelectedOpportunityDetails(null);
          }
        }}
      >
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{selectedNgo?.organization_name || selectedNgo?.name || "NGO Details"}</DialogTitle>
            <DialogDescription>Information about the NGO and this opportunity.</DialogDescription>
          </DialogHeader>

          <div className="mt-4 grid gap-5 text-sm md:grid-cols-2">
            <div className="space-y-3 rounded-xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-base font-semibold text-slate-900">NGO Info</p>
              <div>
                <p className="font-medium text-slate-900">Name</p>
                <p className="text-slate-600">{selectedNgo?.organization_name || selectedNgo?.name || "Not provided"}</p>
              </div>
              <div>
                <p className="font-medium text-slate-900">Location</p>
                <p className="text-slate-600">{selectedNgo?.location || "Not provided"}</p>
              </div>
              <div>
                <p className="font-medium text-slate-900">Email</p>
                <p className="text-slate-600">{selectedNgo?.email || "Not provided"}</p>
              </div>
              <div>
                <p className="font-medium text-slate-900">Description</p>
                <p className="text-slate-600">{selectedNgo?.organization_description || "Not provided"}</p>
              </div>
              <div>
                <p className="font-medium text-slate-900">Website</p>
                {selectedNgo?.website_url ? (
                  <a
                    href={selectedNgo.website_url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-orange-700 hover:text-orange-800 hover:underline"
                  >
                    {selectedNgo.website_url}
                  </a>
                ) : (
                  <p className="text-slate-600">Not provided</p>
                )}
              </div>
            </div>

            <div className="space-y-3 rounded-xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-base font-semibold text-slate-900">Opportunity Details</p>
              <div>
                <p className="font-medium text-slate-900">Full Description</p>
                <p className="text-slate-600">{selectedOpportunityDetails?.description || "Not provided"}</p>
              </div>
              <div>
                <p className="font-medium text-slate-900">Required Skills</p>
                <p className="text-slate-600">
                  {selectedOpportunityDetails?.required_skills?.length
                    ? selectedOpportunityDetails.required_skills.join(", ")
                    : "Not provided"}
                </p>
              </div>
              <div>
                <p className="font-medium text-slate-900">Duration</p>
                <p className="text-slate-600">{selectedOpportunityDetails?.duration || "Not provided"}</p>
              </div>
              <div>
                <p className="font-medium text-slate-900">Status</p>
                <p className="text-slate-600">{selectedOpportunityDetails?.applicationStatus || "Not Applied"}</p>
              </div>
              <div>
                <p className="font-medium text-slate-900">Match</p>
                <p className="text-slate-600">
                  {selectedOpportunityDetails?.matchPercentage ?? 0}% ({selectedOpportunityDetails?.matchStrength || "Low Match"})
                </p>
              </div>
              <div>
                <p className="font-medium text-slate-900">Skills Matched</p>
                <p className="text-slate-600">
                  {selectedOpportunityDetails?.matchedSkills?.length
                    ? selectedOpportunityDetails.matchedSkills.join(", ")
                    : "None"}
                </p>
              </div>
              <div>
                <p className="font-medium text-slate-900">Missing Skills</p>
                <p className="text-slate-600">
                  {selectedOpportunityDetails?.missingSkills?.length
                    ? selectedOpportunityDetails.missingSkills.join(", ")
                    : "None"}
                </p>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
