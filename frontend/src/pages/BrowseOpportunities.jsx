import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";
import opportunityService from "../services/opportunityService";
import applicationService from "../services/applicationService";
import Navbar from "../components/Navbar";
import ApplicationForm from "../components/ApplicationForm";
import { motion } from "framer-motion";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../components/ui/dialog";
import { toast } from "sonner";

export default function BrowseOpportunities() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [opportunities, setOpportunities] = useState([]);
  const [userApplications, setUserApplications] = useState([]);
  const [loadingOpps, setLoadingOpps] = useState(false);
  const [filters, setFilters] = useState({
    skills: '',
    location: '',
    duration: '',
    status: 'all'
  });
  const [showApplicationForm, setShowApplicationForm] = useState(false);
  const [selectedOpportunity, setSelectedOpportunity] = useState(null);
  const [selectedNgo, setSelectedNgo] = useState(null);
  const [selectedOpportunityDetails, setSelectedOpportunityDetails] = useState(null);
  const [showNgoDetails, setShowNgoDetails] = useState(false);
  const [lastAutoOpenedOpportunityId, setLastAutoOpenedOpportunityId] = useState("");

  useEffect(() => {
    if (!loading && user?.role === "volunteer") {
      fetchOpportunities();
      fetchUserApplications();
    }
  }, [user, loading, location]);

  const fetchOpportunities = async (activeFilters = filters) => {
    try {
      setLoadingOpps(true);
      const res = await opportunityService.getAllOpportunities(activeFilters);
      setOpportunities(res.data.opportunities);
    } catch (error) {
      console.error("Failed to fetch opportunities:", error);
      toast.error("Failed to fetch opportunities");
    } finally {
      setLoadingOpps(false);
    }
  };

  const handleFilterChange = (field, value) => {
    setFilters(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const applyFilters = () => {
    fetchOpportunities({ ...filters });
  };

  const clearFilters = () => {
    const nextFilters = {
      skills: '',
      location: '',
      duration: '',
      status: 'all'
    };
    setFilters(nextFilters);
    fetchOpportunities(nextFilters);
  };

  const fetchUserApplications = async () => {
    try {
      const res = await applicationService.getMyApplications();
      setUserApplications(res.data.applications);
    } catch (error) {
      console.error("Failed to fetch applications:", error);
      toast.error("Failed to fetch your applications");
    }
  };

  const handleApply = (opportunity) => {
    setSelectedOpportunity(opportunity);
    setShowApplicationForm(true);
  };

  const handleApplicationSuccess = () => {
    fetchUserApplications();
    toast.success("Application submitted successfully");
  };

  const normalizeText = (value) => (value || "").toString().trim().toLowerCase();

  const getMatchSummary = (opp) => {
    const volunteerSkills = user?.skills || [];
    const requiredSkills = opp?.required_skills || [];

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

  const toReadableStatus = (status) => {
    if (!status) return "Not Applied";
    return status.charAt(0).toUpperCase() + status.slice(1);
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
      applicationStatus: toReadableStatus(applicationStatus),
    });
    setShowNgoDetails(true);
  };

  const isAlreadyApplied = (oppId) => {
    return userApplications.some((app) => app.opportunity_id._id === oppId);
  };

  const getApplicationStatus = (oppId) => {
    const app = userApplications.find((app) => app.opportunity_id._id === oppId);
    return app?.status || null;
  };

  useEffect(() => {
    if (loading || user?.role !== "volunteer" || loadingOpps) return;

    const params = new URLSearchParams(location.search);
    const highlightId = params.get("highlight");
    const openNgo = params.get("openNgo");

    if (!highlightId || openNgo !== "1") return;
    if (lastAutoOpenedOpportunityId === highlightId) return;

    const targetOpportunity = opportunities.find((opp) => opp._id === highlightId);
    if (!targetOpportunity) return;

    handleViewNgoDetails(targetOpportunity);
    setLastAutoOpenedOpportunityId(highlightId);
  }, [loading, user, loadingOpps, location.search, opportunities, userApplications, lastAutoOpenedOpportunityId]);

  const getNgoKey = (ngo) => {
    if (!ngo) return null;
    if (typeof ngo === "string") return ngo;
    return ngo._id || ngo.id || null;
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <main className="mx-auto max-w-7xl px-4 py-10 md:px-6">
          <p className="text-slate-600">Loading opportunities...</p>
        </main>
      </>
    );
  }

  if (!user) {
    return (
      <>
        <Navbar />
        <main className="mx-auto max-w-7xl px-4 py-10 md:px-6">
          <p className="text-slate-600">Please login first.</p>
        </main>
      </>
    );
  }

  if (user.role !== "volunteer") {
    return (
      <>
        <Navbar />
        <main className="mx-auto max-w-7xl px-4 py-10 md:px-6">
          <p className="text-slate-600">Access denied.</p>
        </main>
      </>
    );
  }

  const openOpportunities = opportunities.filter((o) => o.status === "open").length;
  const ngosHiring = new Set(opportunities.map((o) => getNgoKey(o.ngo_id)).filter(Boolean)).size;

  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-7xl space-y-6 px-4 py-8 md:px-6 md:py-10">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
          <h1 className="text-3xl font-bold text-slate-900">Browse Opportunities</h1>
          <p className="mt-1 text-slate-600">Find and apply to volunteering opportunities that match your skills.</p>
        </motion.div>

        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><p className="text-sm text-slate-500">Total</p><p className="mt-1 text-3xl font-bold text-slate-900">{opportunities.length}</p></div>
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><p className="text-sm text-slate-500">Open</p><p className="mt-1 text-3xl font-bold text-emerald-600">{openOpportunities}</p></div>
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><p className="text-sm text-slate-500">NGOs Hiring</p><p className="mt-1 text-3xl font-bold text-sky-600">{ngosHiring}</p></div>
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><p className="text-sm text-slate-500">My Applications</p><p className="mt-1 text-3xl font-bold text-amber-600">{userApplications.length}</p></div>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Skills</label>
              <Input
                type="text"
                placeholder="e.g- English,blogger"
                value={filters.skills}
                onChange={(e) => handleFilterChange("skills", e.target.value)}
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Location</label>
              <Input
                type="text"
                placeholder="e.g- Mumbai, Maharashtra"
                value={filters.location}
                onChange={(e) => handleFilterChange("location", e.target.value)}
              />
              {/* <p className="mt-1 text-xs text-slate-500">Use commas to filter by city/state terms.</p> */}
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Duration</label>
              <select
                value={filters.duration}
                onChange={(e) => handleFilterChange("duration", e.target.value)}
                className="h-11 w-full rounded-xl border border-slate-300 bg-white px-3 text-sm text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400"
              >
                <option value="">All Durations</option>
                <option value="1 week">1 week</option>
                <option value="1 month">1 month</option>
                <option value="3 month">3 month</option>
                <option value="6 month">6 month</option>
                <option value="1 year">1 year</option>
              </select>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Status</label>
              <select
                value={filters.status}
                onChange={(e) => handleFilterChange("status", e.target.value)}
                className="h-11 w-full rounded-xl border border-slate-300 bg-white px-3 text-sm text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400"
              >
                <option value="open">Open Only</option>
                <option value="all">All Status</option>
                <option value="closed">Closed Only</option>
              </select>
            </div>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            <Button onClick={applyFilters}>Apply Filters</Button>
            <Button variant="secondary" onClick={clearFilters}>Clear Filters</Button>
          </div>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          {loadingOpps ? (
            <p className="text-sm text-slate-600">Loading opportunities...</p>
          ) : opportunities.length === 0 ? (
            <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 px-5 py-10 text-center text-sm text-slate-600">
              <p>No opportunities match your filters. Try adjusting your search criteria.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full table-fixed text-left">
                <thead>
                  <tr className="border-b border-slate-200 text-xs uppercase tracking-wide text-slate-500">
                    <th className="w-[24%] px-3 py-3">Opportunity</th>
                    <th className="w-[26%] px-3 py-3">Skills</th>
                    <th className="w-[12%] px-3 py-3">Status</th>
                    <th className="w-[18%] px-3 py-3">Actions</th>
                    <th className="w-[20%] px-3 py-3">View Details</th>
                  </tr>
                </thead>
                <tbody>
                  {opportunities.map((opp) => {
                    const isApplied = isAlreadyApplied(opp._id);
                    const appStatus = getApplicationStatus(opp._id);
                    return (
                      <tr key={opp._id} className="border-b border-slate-100 align-middle text-sm">
                        <td className="px-3 py-4">
                          <p className="font-semibold text-slate-900">{opp.title}</p>
                          <p className="text-xs text-slate-500">{opp.location} • {opp.duration}</p>
                        </td>
                        <td className="px-3 py-4">
                          <div className="flex flex-wrap gap-1.5">
                            {opp.required_skills?.slice(0, 3).map((skill, i) => (
                              <span key={i} className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700">{skill}</span>
                            ))}
                            {opp.required_skills?.length > 3 && (
                              <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700">+{opp.required_skills.length - 3}</span>
                            )}
                          </div>
                        </td>
                        <td className="px-3 py-4">
                          <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${opp.status === "open" ? "bg-emerald-100 text-emerald-700" : "bg-rose-100 text-rose-700"}`}>
                            {opp.status}
                          </span>
                        </td>
                        <td className="px-3 py-4">
                          {isApplied ? (
                              <Button size="sm" variant="secondary" className="h-8 min-w-[112px] text-sm" disabled>
                                {appStatus === "pending" ? "Pending" : appStatus === "accepted" ? "Accepted" : "Applied"}
                              </Button>
                            ) : (
                              <Button size="sm" className="h-8 min-w-[112px] text-sm" onClick={() => handleApply(opp)} disabled={opp.status !== "open"}>
                                {opp.status === "open" ? "Apply" : "Closed"}
                              </Button>
                            )}
                        </td>
                        <td className="px-3 py-4">
                          <Button size="sm" variant="secondary" className="h-8 min-w-[112px] text-sm" onClick={() => handleViewNgoDetails(opp)}>
                            View Details
                          </Button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </main>

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
