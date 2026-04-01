import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";
import opportunityService from "../services/opportunityService";
import applicationService from "../services/applicationService";
import Navbar from "../components/Navbar";
import MatchSuggestions from "../components/MatchSuggestions";
import { motion } from "framer-motion";
import { Button } from "../components/ui/button";

export default function Dashboard() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [opportunities, setOpportunities] = useState([]);
  const [applications, setApplications] = useState([]);

  const statCardClass = "rounded-2xl border border-slate-200 bg-white p-5 shadow-sm";

  useEffect(() => {
    if (!loading && user) {
      if (user.role === "ngo") {
        fetchNGOData();
      } else if (user.role === "volunteer") {
        fetchVolunteerApplications();
      }
    }
  }, [user, loading, location]);

  const fetchNGOData = async () => {
    try {
      const [oppsRes, appsRes] = await Promise.all([
        opportunityService.getMyOpportunities(),
        applicationService.getNGOApplications()
      ]);
      setOpportunities(oppsRes.data.opportunities);
      setApplications(appsRes.data.applications);
    } catch (error) {
      console.error("Failed to fetch NGO data:", error);
    }
  };

  const fetchVolunteerApplications = async () => {
    try {
      const res = await applicationService.getMyApplications();
      setApplications(res.data.applications);
    } catch (error) {
      console.error("Failed to fetch applications:", error);
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="mx-auto max-w-6xl px-4 py-10 md:px-6">
          <p className="text-slate-600">Loading dashboard...</p>
        </div>
      </>
    );
  }

  if (!user) {
    return (
      <>
        <Navbar />
        <div className="mx-auto max-w-6xl px-4 py-10 md:px-6">
          <p className="text-slate-600">Please login first.</p>
        </div>
      </>
    );
  }

  // NGO Dashboard
  if (user.role === "ngo") {
    const activeOpps = opportunities.filter((o) => o.status === "open").length;
    const totalApplications = applications.length;
    const pendingApplications = applications.filter((a) => a.status === "pending").length;
    const activeVolunteers = applications.filter((a) => a.status === "accepted").length;

    return (
      <>
        <Navbar />
        <main className="mx-auto max-w-6xl space-y-6 px-4 py-8 md:px-6 md:py-10">
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
            <h1 className="text-3xl font-bold text-slate-900">Overview</h1>
            <p className="mt-1 text-slate-600">Welcome back, {user.name}.</p>
          </motion.div>

          <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className={statCardClass}><p className="text-sm text-slate-500">Active Opportunities</p><h2 className="mt-1 text-3xl font-bold text-sky-600">{activeOpps}</h2></div>
            <div className={statCardClass}><p className="text-sm text-slate-500">Applications</p><h2 className="mt-1 text-3xl font-bold text-emerald-600">{totalApplications}</h2></div>
            <div className={statCardClass}><p className="text-sm text-slate-500">Active Volunteers</p><h2 className="mt-1 text-3xl font-bold text-violet-600">{activeVolunteers}</h2></div>
            <div className={statCardClass}><p className="text-sm text-slate-500">Pending Applications</p><h2 className="mt-1 text-3xl font-bold text-orange-600">{pendingApplications}</h2></div>
          </section>

          <section className="grid gap-4 lg:grid-cols-3">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm lg:col-span-2">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-lg font-semibold text-slate-900">Recent Applications</h3>
                <button className="text-sm font-semibold text-orange-700 hover:text-orange-800" onClick={() => navigate("/applications")}>
                  View All ({applications.length} applications)
                </button>
              </div>
              {applications.length === 0 ? (
                <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 px-4 py-10 text-center text-sm text-slate-500">
                  No applications yet.
                </div>
              ) : (
                <div className="space-y-3">
                  {applications.slice(0, 2).map((app) => (
                    <div key={app._id} className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1">
                          <p className="font-medium text-slate-900">{app.opportunity_id?.title || "Opportunity"}</p>
                          <p className="text-xs text-slate-600 mt-1">From: {app.volunteer_id?.name || "Volunteer"}</p>
                          <p className="text-xs text-slate-500 mt-1">{new Date(app.createdAt).toLocaleDateString()}</p>
                        </div>
                        <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
                          app.status === "accepted" ? "bg-emerald-100 text-emerald-700" :
                          app.status === "rejected" ? "bg-rose-100 text-rose-700" :
                          "bg-orange-100 text-orange-700"
                        }`}>
                          {app.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="mb-4 text-lg font-semibold text-slate-900">Quick Actions</h3>
              <div className="space-y-3">
                <Button className="h-14 w-full justify-start text-base" onClick={() => navigate("/opportunities/create")}>
                  Create New Opportunity
                </Button>
                <Button className="h-14 w-full justify-start text-base" variant="secondary" onClick={() => navigate("/chat")}>
                  View Messages
                </Button>
              </div>
              <p className="mt-3 text-xs text-slate-500">Manage your opportunities and conversations from one place.</p>
            </div>
          </section>
        </main>
      </>
    );
  }

  // Volunteer Dashboard
  if (user.role === "volunteer") {
    const totalApplications = applications.length;
    const acceptedApplications = applications.filter((a) => a.status === "accepted").length;
    const pendingApplications = applications.filter((a) => a.status === "pending").length;
    const userSkills = user.skills?.length || 0;

    return (
      <>
        <Navbar />
        <main className="mx-auto max-w-6xl space-y-6 px-4 py-8 md:px-6 md:py-10">
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
            <h1 className="text-3xl font-bold text-slate-900">Overview</h1>
            <p className="mt-1 text-slate-600">Welcome back, {user.name}.</p>
          </motion.div>

          <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className={statCardClass}><p className="text-sm text-slate-500">Applications</p><h2 className="mt-1 text-3xl font-bold text-sky-600">{totalApplications}</h2></div>
            <div className={statCardClass}><p className="text-sm text-slate-500">Accepted</p><h2 className="mt-1 text-3xl font-bold text-emerald-600">{acceptedApplications}</h2></div>
            <div className={statCardClass}><p className="text-sm text-slate-500">Pending</p><h2 className="mt-1 text-3xl font-bold text-orange-600">{pendingApplications}</h2></div>
            <div className={statCardClass}><p className="text-sm text-slate-500">Skills</p><h2 className="mt-1 text-3xl font-bold text-violet-600">{userSkills}</h2></div>
          </section>

          <MatchSuggestions />

          <section className="grid gap-4 lg:grid-cols-3">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm lg:col-span-2">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-lg font-semibold text-slate-900">Recent Applications</h3>
                <button className="text-sm font-semibold text-orange-700 hover:text-orange-800" onClick={() => navigate("/applications")}>
                  View All ({applications.length} applications)
                </button>
              </div>
              {applications.length === 0 ? (
                <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 px-4 py-10 text-center text-sm text-slate-500">
                  No applications yet.
                </div>
              ) : (
                <div className="space-y-3">
                  {applications.slice(0, 2).map((app) => (
                    <div key={app._id} className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1">
                          <p className="font-medium text-slate-900">{app.opportunity_id?.title || "Opportunity"}</p>
                          <p className="text-xs text-slate-600 mt-1">Status: {app.status}</p>
                          <p className="text-xs text-slate-500 mt-1">{new Date(app.createdAt).toLocaleDateString()}</p>
                        </div>
                        <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
                          app.status === "accepted" ? "bg-emerald-100 text-emerald-700" :
                          app.status === "rejected" ? "bg-rose-100 text-rose-700" :
                          "bg-orange-100 text-orange-700"
                        }`}>
                          {app.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="mb-4 text-lg font-semibold text-slate-900">Quick Actions</h3>
              <div className="space-y-3">
                <Button className="h-14 w-full justify-start text-base" onClick={() => navigate("/browse-opportunities")}>
                  Browse Opportunities
                </Button>
                <Button className="h-14 w-full justify-start text-base" variant="secondary" onClick={() => navigate("/chat")}>
                  View Messages
                </Button>
              </div>
              <p className="mt-3 text-xs text-slate-500">Explore opportunities and continue your chats with NGOs.</p>
            </div>
          </section>
        </main>
      </>
    );
  }

  return null;
}
