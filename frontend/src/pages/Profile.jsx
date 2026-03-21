import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import { Button } from "../components/ui/button";

export default function Profile() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [loadingProfile, setLoadingProfile] = useState(true);

  useEffect(() => {
    if (!loading) {
      setLoadingProfile(false);
    }
  }, [loading]);

  if (loadingProfile) {
    return (
      <>
        <Navbar />
        <main className="mx-auto max-w-5xl px-4 py-10 md:px-6">
          <p className="text-slate-600">Loading profile...</p>
        </main>
      </>
    );
  }

  if (!user) {
    return (
      <>
        <Navbar />
        <main className="mx-auto max-w-5xl px-4 py-10 md:px-6">
          <p className="text-slate-600">Please login first.</p>
        </main>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-5xl space-y-6 px-4 py-8 md:px-6 md:py-10">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Button variant="secondary" onClick={() => navigate("/dashboard")}>Back to Dashboard</Button>
          <Button onClick={() => navigate("/profile/edit")}>Edit Profile</Button>
        </div>

        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-2xl font-bold text-slate-900">My Profile</h2>
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Name</p>
              <p className="mt-1 text-sm text-slate-800">{user.name}</p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Email</p>
              <p className="mt-1 text-sm text-slate-800">{user.email}</p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Role</p>
              <span className={`mt-1 inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${user.role === "ngo" ? "bg-sky-100 text-sky-700" : "bg-emerald-100 text-emerald-700"}`}>{user.role}</span>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Location</p>
              <p className="mt-1 text-sm text-slate-800">{user.location || "Not specified"}</p>
            </div>
            <div className="md:col-span-2">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Bio</p>
              <p className="mt-1 text-sm text-slate-800">{user.bio || "Not specified"}</p>
            </div>
          </div>
        </section>

        {user.role === "volunteer" && (
          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h3 className="text-lg font-semibold text-slate-900">Skills</h3>
            {user.skills && user.skills.length > 0 ? (
              <div className="mt-3 flex flex-wrap gap-2">
                {user.skills.map((skill, index) => (
                  <span key={index} className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">{skill}</span>
                ))}
              </div>
            ) : (
              <p className="mt-2 text-sm text-slate-600">No skills added yet.</p>
            )}
          </section>
        )}

        {user.role === "ngo" && (
          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h3 className="text-lg font-semibold text-slate-900">Organization Details</h3>
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Organization Name</p>
                <p className="mt-1 text-sm text-slate-800">{user.organization_name || "Not specified"}</p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Website</p>
                {user.website_url ? (
                  <a href={user.website_url} target="_blank" rel="noopener noreferrer" className="mt-1 inline-block text-sm text-sky-700 underline-offset-2 hover:underline">{user.website_url}</a>
                ) : (
                  <p className="mt-1 text-sm text-slate-800">Not specified</p>
                )}
              </div>
              <div className="md:col-span-2">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Description</p>
                <p className="mt-1 text-sm text-slate-800">{user.organization_description || "Not specified"}</p>
              </div>
            </div>
          </section>
        )}

        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-900">Account Information</h3>
          <div className="mt-3">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Member Since</p>
            <p className="mt-1 text-sm text-slate-800">{new Date(user.createdAt).toLocaleDateString()}</p>
          </div>
        </section>
      </main>
    </>
  );
}
