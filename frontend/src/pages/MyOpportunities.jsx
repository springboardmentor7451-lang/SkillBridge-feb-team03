import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";
import opportunityService from "../services/opportunityService";
import Navbar from "../components/Navbar";
import { motion } from "framer-motion";
import { Button } from "../components/ui/button";
import { toast } from "sonner";

export default function MyOpportunities() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [opportunities, setOpportunities] = useState([]);
  const [loadingOpps, setLoadingOpps] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(null);

  useEffect(() => {
    if (!loading && user?.role === "ngo") {
      fetchOpportunities();
    }
  }, [user, loading, location]);

  const fetchOpportunities = async () => {
    try {
      setLoadingOpps(true);
      const res = await opportunityService.getMyOpportunities();
      setOpportunities(res.data.opportunities);
    } catch (error) {
      console.error("Failed to fetch opportunities:", error);
    } finally {
      setLoadingOpps(false);
    }
  };

  const confirmDeleteOpp = async () => {
    try {
      await opportunityService.deleteOpportunity(confirmDelete);
      setOpportunities(opportunities.filter((o) => o._id !== confirmDelete));
      setConfirmDelete(null);
      toast.success("Opportunity deleted");
    } catch (error) {
      console.error("Delete failed:", error);
      toast.error("Failed to delete opportunity");
    }
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

  if (user.role !== "ngo") {
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
  const closedOpportunities = opportunities.filter((o) => o.status === "closed").length;
  const totalApplicants = opportunities.reduce((sum, opp) => sum + (opp.applicant_count || 0), 0);

  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-7xl space-y-6 px-4 py-8 md:px-6 md:py-10">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }} className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Manage Opportunities</h1>
            <p className="mt-1 text-slate-600">Create, update, and manage your posted opportunities.</p>
          </div>
          <Button onClick={() => navigate("/opportunities/create")}>Create Opportunity</Button>
        </motion.div>

        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><p className="text-sm text-slate-500">Total</p><p className="mt-1 text-3xl font-bold text-slate-900">{opportunities.length}</p></div>
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><p className="text-sm text-slate-500">Open</p><p className="mt-1 text-3xl font-bold text-emerald-600">{openOpportunities}</p></div>
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><p className="text-sm text-slate-500">Closed</p><p className="mt-1 text-3xl font-bold text-rose-600">{closedOpportunities}</p></div>
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><p className="text-sm text-slate-500">Applicants</p><p className="mt-1 text-3xl font-bold text-sky-600">{totalApplicants}</p></div>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          {loadingOpps ? (
            <p className="text-sm text-slate-600">Loading opportunities...</p>
          ) : opportunities.length === 0 ? (
            <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 px-5 py-10 text-center text-sm text-slate-600">
              <p>No opportunities posted yet.</p>
              <Button className="mt-4" onClick={() => navigate("/opportunities/create")}>Create Your First Opportunity</Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-left">
                <thead>
                  <tr className="border-b border-slate-200 text-xs uppercase tracking-wide text-slate-500">
                    <th className="px-3 py-3">Opportunity</th>
                    <th className="px-3 py-3">Skills</th>
                    <th className="px-3 py-3">Status</th>
                    <th className="px-3 py-3">Applicants</th>
                    <th className="px-3 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {opportunities.map((opp) => (
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
                      <td className="px-3 py-4 text-slate-700">{opp.applicant_count || 0} applicants</td>
                      <td className="px-3 py-4">
                        <div className="flex flex-wrap gap-2">
                          <Button size="sm" variant="secondary" onClick={() => navigate(`/opportunities/edit/${opp._id}`)}>Edit</Button>
                          <Button size="sm" variant="ghost" onClick={() => setConfirmDelete(opp._id)}>Delete</Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </main>

      {confirmDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">
          <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-xl">
            <h3 className="text-lg font-semibold text-slate-900">Delete Opportunity?</h3>
            <p className="mt-2 text-sm text-slate-600">This action cannot be undone.</p>
            <div className="mt-5 flex justify-end gap-2">
              <Button variant="secondary" onClick={() => setConfirmDelete(null)}>Cancel</Button>
              <Button onClick={confirmDeleteOpp}>Delete</Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
