import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";
import applicationService from "../services/applicationService";
import Navbar from "../components/Navbar";
import { motion } from "framer-motion";
import { Button } from "../components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../components/ui/dialog";
import { toast } from "sonner";

export default function Applications() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [applications, setApplications] = useState([]);
  const [loadingApps, setLoadingApps] = useState(false);
  const [reasonModalOpen, setReasonModalOpen] = useState(false);
  const [selectedReason, setSelectedReason] = useState("");
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [rejectApplicationId, setRejectApplicationId] = useState(null);
  const [rejectReasonInput, setRejectReasonInput] = useState("");

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

  const handleStatusUpdate = async (applicationId, newStatus, rejectionReason = "") => {
    try {
      await applicationService.updateApplicationStatus(applicationId, newStatus, rejectionReason);
      
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

  const openRejectModal = (applicationId) => {
    setRejectApplicationId(applicationId);
    setRejectReasonInput("");
    setRejectModalOpen(true);
  };

  const submitRejectReason = async () => {
    if (!rejectApplicationId) return;

    const reason = rejectReasonInput.trim();
    if (!reason) {
      toast.error("Please enter a rejection reason");
      return;
    }

    await handleStatusUpdate(rejectApplicationId, "rejected", reason);
    setRejectModalOpen(false);
    setRejectApplicationId(null);
    setRejectReasonInput("");
  };

  const handleWithdrawApplication = async (applicationId) => {
    try {
      await applicationService.withdrawApplication(applicationId);
      toast.success("Application withdrawn");
      fetchVolunteerApplications();
    } catch (error) {
      console.error("Failed to withdraw application:", error);
      toast.error(error?.response?.data?.message || "Failed to withdraw application");
    }
  };

  const openReasonModal = (reason) => {
    setSelectedReason(reason || "No reason provided by NGO");
    setReasonModalOpen(true);
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
              <table className="min-w-full table-fixed text-left">
                <thead>
                  <tr className="border-b border-slate-200 text-xs uppercase tracking-wide text-slate-500">
                    {user.role === "volunteer" ? (
                      <>
                        <th className="w-1/4 px-3 py-3">Opportunity</th>
                        <th className="w-1/4 px-3 py-3">Applied</th>
                        <th className="w-1/4 px-3 py-3">Status</th>
                        <th className="w-1/4 px-3 py-3">Actions</th>
                      </>
                    ) : (
                      <>
                        <th className="w-1/5 px-3 py-3">Volunteer</th>
                        <th className="w-1/5 px-3 py-3">Opportunity</th>
                        <th className="w-1/5 px-3 py-3">Applied</th>
                        <th className="w-1/5 px-3 py-3">Status</th>
                        <th className="w-1/5 px-3 py-3">Actions</th>
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
                            {app.status === "pending" && (
                              <Button size="sm" variant="secondary" className="h-8 px-3 text-sm" onClick={() => handleWithdrawApplication(app._id)}>
                                Withdraw Application
                              </Button>
                            )}
                            {app.status === "accepted" && (
                              <Button size="sm" className="h-8 px-3 text-sm" onClick={() => navigate("/chat")}>
                                Message NGO
                              </Button>
                            )}
                            {app.status === "rejected" && (
                              <Button size="sm" variant="secondary" className="h-8 px-3 text-sm" onClick={() => openReasonModal(app.rejection_reason)}>
                                Rejected - Reason
                              </Button>
                            )}
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
                                  <Button size="sm" className="h-8 px-3 text-sm" onClick={() => handleStatusUpdate(app._id, "accepted")}>Accept</Button>
                                  <Button size="sm" variant="secondary" className="h-8 px-3 text-sm" onClick={() => openRejectModal(app._id)}>Reject</Button>
                                </>
                              )}
                              {app.status === "accepted" && (
                                <>
                                  <Button size="sm" className="h-8 px-3 text-sm" onClick={() => navigate("/chat")}>Message</Button>
                                  <Button size="sm" variant="secondary" className="h-8 px-3 text-sm" onClick={() => openRejectModal(app._id)}>Reject</Button>
                                </>
                              )}
                              {app.status === "rejected" && (
                                <Button size="sm" className="h-8 px-3 text-sm" onClick={() => handleStatusUpdate(app._id, "accepted")}>Accept</Button>
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

      <Dialog open={reasonModalOpen} onOpenChange={setReasonModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Rejection Reason</DialogTitle>
            <DialogDescription>Feedback shared by the NGO for this application.</DialogDescription>
          </DialogHeader>
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
            {selectedReason}
          </div>
        </DialogContent>
      </Dialog>

      <Dialog
        open={rejectModalOpen}
        onOpenChange={(open) => {
          setRejectModalOpen(open);
          if (!open) {
            setRejectApplicationId(null);
            setRejectReasonInput("");
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Application</DialogTitle>
            <DialogDescription>Please provide a reason for rejection.</DialogDescription>
          </DialogHeader>

          <div className="space-y-3">
            <textarea
              value={rejectReasonInput}
              onChange={(e) => setRejectReasonInput(e.target.value)}
              rows={4}
              placeholder="Enter rejection reason"
              className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400"
            />
            <div className="flex justify-end gap-2">
              <Button variant="secondary" onClick={() => setRejectModalOpen(false)}>Cancel</Button>
              <Button onClick={submitRejectReason}>Submit Reason</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
