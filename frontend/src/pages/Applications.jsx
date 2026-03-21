import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";
import applicationService from "../services/applicationService";
import Navbar from "../components/Navbar";
import { motion } from "framer-motion";
import { Button } from "../components/ui/button";
import { toast } from "sonner";

export default function Applications() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [applications, setApplications] = useState([]);
  const [loadingApps, setLoadingApps] = useState(false);

  useEffect(() => {
    if (!loading && user) {
      if (user.role === "volunteer") {
        fetchVolunteerApplications();
      } else if (user.role === "ngo") {
        fetchNGOApplications();
      }
    }
  }, [user, loading, location]);

  const fetchVolunteerApplications = async () => {
    try {
      setLoadingApps(true);
      const res = await applicationService.getMyApplications();
      setApplications(res.data.applications);
    } catch (error) {
      console.error("Failed to fetch applications:", error);
    } finally {
      setLoadingApps(false);
    }
  };

  const fetchNGOApplications = async () => {
    try {
      setLoadingApps(true);
      const res = await applicationService.getNGOApplications();
      setApplications(res.data.applications);
    } catch (error) {
      console.error("Failed to fetch NGO applications:", error);
    } finally {
      setLoadingApps(false);
    }
  };

  const handleStatusUpdate = async (applicationId, newStatus) => {
    try {
      await applicationService.updateApplicationStatus(applicationId, newStatus);
      
      if (newStatus === "accepted") {
        toast.success("Application accepted. You can now chat in Messages.");
      }
      
      // Refresh applications
      if (user.role === "volunteer") {
        fetchVolunteerApplications();
      } else {
        fetchNGOApplications();
      }
    } catch (error) {
      console.error("Failed to update status:", error);
      toast.error("Failed to update application status");
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="mx-auto max-w-6xl px-4 py-10 md:px-6">
          <p className="text-slate-600">Loading applications...</p>
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

  const pendingApps = applications.filter((a) => a.status === "pending").length;
  const acceptedApps = applications.filter((a) => a.status === "accepted").length;
  const rejectedApps = applications.filter((a) => a.status === "rejected").length;

  const statusClass = (status) => {
    if (status === "accepted") return "bg-emerald-100 text-emerald-700";
    if (status === "rejected") return "bg-rose-100 text-rose-700";
    return "bg-amber-100 text-amber-700";
  };

  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-7xl space-y-6 px-4 py-8 md:px-6 md:py-10">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
          <h1 className="text-3xl font-bold text-slate-900">{user.role === "volunteer" ? "My Applications" : "Manage Applications"}</h1>
          <p className="mt-1 text-slate-600">
            {user.role === "volunteer" ? "Track your submitted opportunities." : "Review and manage volunteer applications."}
          </p>
        </motion.div>

        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><p className="text-sm text-slate-500">Total</p><p className="mt-1 text-3xl font-bold text-slate-900">{applications.length}</p></div>
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><p className="text-sm text-slate-500">Pending</p><p className="mt-1 text-3xl font-bold text-amber-600">{pendingApps}</p></div>
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><p className="text-sm text-slate-500">Accepted</p><p className="mt-1 text-3xl font-bold text-emerald-600">{acceptedApps}</p></div>
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><p className="text-sm text-slate-500">Rejected</p><p className="mt-1 text-3xl font-bold text-rose-600">{rejectedApps}</p></div>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          {loadingApps ? (
            <p className="text-sm text-slate-600">Loading applications...</p>
          ) : applications.length === 0 ? (
            <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 px-5 py-10 text-center text-sm text-slate-600">
              <p>{user.role === "volunteer" ? "You have not applied to opportunities yet." : "No applications received yet."}</p>
              {user.role === "volunteer" && (
                <Button className="mt-4" onClick={() => navigate("/browse-opportunities")}>Browse Opportunities</Button>
              )}
            </div>
          ) : null}
          {!loadingApps && applications.length > 0 && (
            <div className="overflow-x-auto">
              <table className="min-w-full text-left">
                <thead>
                  <tr className="border-b border-slate-200 text-xs uppercase tracking-wide text-slate-500">
                    {user.role === "volunteer" ? (
                      <>
                        <th className="px-3 py-3">Opportunity</th>
                        <th className="px-3 py-3">Applied</th>
                        <th className="px-3 py-3">Status</th>
                        <th className="px-3 py-3">Actions</th>
                      </>
                    ) : (
                      <>
                        <th className="px-3 py-3">Volunteer</th>
                        <th className="px-3 py-3">Opportunity</th>
                        <th className="px-3 py-3">Applied</th>
                        <th className="px-3 py-3">Status</th>
                        <th className="px-3 py-3">Actions</th>
                      </>
                    )}
                  </tr>
                </thead>
                <tbody>
                  {applications.map((app) => (
                    <tr key={app._id} className="border-b border-slate-100 align-top text-sm">
                      {user.role === "volunteer" ? (
                        <>
                          <td className="px-3 py-4">
                            <p className="font-semibold text-slate-900">{app.opportunity_id?.title}</p>
                            <p className="text-xs text-slate-500">{app.opportunity_id?.location} • {app.opportunity_id?.duration}</p>
                          </td>
                          <td className="px-3 py-4 text-slate-700">{new Date(app.applied_date).toLocaleDateString()}</td>
                          <td className="px-3 py-4">
                            <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${statusClass(app.status)}`}>{app.status}</span>
                          </td>
                          <td className="px-3 py-4">
                            <Button size="sm" variant="secondary" onClick={() => navigate("/browse-opportunities")}>View</Button>
                          </td>
                        </>
                      ) : (
                        <>
                          <td className="px-3 py-4">
                            <p className="font-semibold text-slate-900">{app.volunteer_id?.name}</p>
                            <p className="text-xs text-slate-500">{app.applicant_email}</p>
                          </td>
                          <td className="px-3 py-4">
                            <p className="font-semibold text-slate-900">{app.opportunity_id?.title}</p>
                            <p className="text-xs text-slate-500">{app.opportunity_id?.location}</p>
                          </td>
                          <td className="px-3 py-4 text-slate-700">{new Date(app.applied_date).toLocaleDateString()}</td>
                          <td className="px-3 py-4">
                            <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${statusClass(app.status)}`}>{app.status}</span>
                          </td>
                          <td className="px-3 py-4">
                            <div className="flex flex-wrap gap-2">
                              {app.status === "pending" && (
                                <>
                                  <Button size="sm" onClick={() => handleStatusUpdate(app._id, "accepted")}>Accept</Button>
                                  <Button size="sm" variant="secondary" onClick={() => handleStatusUpdate(app._id, "rejected")}>Reject</Button>
                                </>
                              )}
                              {app.status === "accepted" && (
                                <>
                                  <Button size="sm" onClick={() => navigate("/messages")}>Message</Button>
                                  <Button size="sm" variant="secondary" onClick={() => handleStatusUpdate(app._id, "rejected")}>Reject</Button>
                                </>
                              )}
                              {app.status === "rejected" && (
                                <Button size="sm" onClick={() => handleStatusUpdate(app._id, "accepted")}>Accept</Button>
                              )}
                            </div>
                          </td>
                        </>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </main>
    </>
  );
}
