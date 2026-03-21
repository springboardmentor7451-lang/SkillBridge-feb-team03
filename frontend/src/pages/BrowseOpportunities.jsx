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
    status: 'open'
  });
  const [showApplicationForm, setShowApplicationForm] = useState(false);
  const [selectedOpportunity, setSelectedOpportunity] = useState(null);

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
    fetchOpportunities();
  };

  const clearFilters = () => {
    const nextFilters = {
      skills: '',
      location: '',
      duration: '',
      status: 'open'
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

  const isAlreadyApplied = (oppId) => {
    return userApplications.some((app) => app.opportunity_id._id === oppId);
  };

  const getApplicationStatus = (oppId) => {
    const app = userApplications.find((app) => app.opportunity_id._id === oppId);
    return app?.status || null;
  };

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
                placeholder="Teaching, Programming"
                value={filters.skills}
                onChange={(e) => handleFilterChange("skills", e.target.value)}
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Location</label>
              <Input
                type="text"
                placeholder="Mumbai, Remote"
                value={filters.location}
                onChange={(e) => handleFilterChange("location", e.target.value)}
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Duration</label>
              <select
                value={filters.duration}
                onChange={(e) => handleFilterChange("duration", e.target.value)}
                className="h-11 w-full rounded-xl border border-slate-300 bg-white px-3 text-sm text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400"
              >
                <option value="">All Durations</option>
                <option value="1-3 months">1-3 months</option>
                <option value="3-6 months">3-6 months</option>
                <option value="6-12 months">6-12 months</option>
                <option value="1+ year">1+ year</option>
                <option value="Short-term">Short-term</option>
                <option value="Long-term">Long-term</option>
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
                <option value="all">All Statuses</option>
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
              <table className="min-w-full text-left">
                <thead>
                  <tr className="border-b border-slate-200 text-xs uppercase tracking-wide text-slate-500">
                    <th className="px-3 py-3">Opportunity</th>
                    <th className="px-3 py-3">Skills</th>
                    <th className="px-3 py-3">Status</th>
                    <th className="px-3 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {opportunities.map((opp) => {
                    const isApplied = isAlreadyApplied(opp._id);
                    const appStatus = getApplicationStatus(opp._id);
                    return (
                      <tr key={opp._id} className="border-b border-slate-100 align-top text-sm">
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
                            <Button size="sm" variant="secondary" disabled>
                              {appStatus === "pending" ? "Pending" : appStatus === "accepted" ? "Accepted" : "Applied"}
                            </Button>
                          ) : (
                            <Button size="sm" onClick={() => handleApply(opp)} disabled={opp.status !== "open"}>
                              {opp.status === "open" ? "Apply" : "Closed"}
                            </Button>
                          )}
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
    </>
  );
}
