import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import userService from "../services/userService";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { toast } from "sonner";

export default function ProfileEdit() {
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    location: "",
    bio: "",
    skills: [],
    organization_name: "",
    organization_description: "",
    website_url: "",
  });

  // Pre-fill form with current user data
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.role === "ngo" ? (user.organization_name || user.name || "") : (user.name || ""),
        location: user.location || "",
        bio: user.bio || "",
        skills: user.skills || [],
        organization_name: user.organization_name || user.name || "",
        organization_description: user.organization_description || "",
        website_url: user.website_url || "",
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSkillsChange = (e) => {
    const skills = e.target.value.split(",").map((skill) => skill.trim());
    setFormData((prev) => ({
      ...prev,
      skills,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const dataToSend = {
        name: formData.name,
        location: formData.location,
      };

      if (user?.role === "volunteer") {
        dataToSend.skills = formData.skills;
        dataToSend.bio = formData.bio;
      }

      if (user?.role === "ngo") {
        dataToSend.organization_name = formData.name;
        dataToSend.organization_description = formData.organization_description;
        dataToSend.website_url = formData.website_url;
      }

      const response = await userService.updateProfile(dataToSend);
      updateUser(response.data.user);
      setSuccess("Profile updated successfully!");
      toast.success("Profile updated successfully");

      setTimeout(() => {
        navigate("/profile");
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update profile");
      toast.error(err.response?.data?.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <>
        <Navbar />
        <main className="mx-auto max-w-3xl px-4 py-10 md:px-6">
          <p className="text-slate-600">Loading...</p>
        </main>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-3xl space-y-4 px-4 py-8 md:px-6 md:py-10">
        <h2 className="text-2xl font-bold text-slate-900">Edit Profile</h2>

        {error && <div className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">{error}</div>}
        {success && <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">{success}</div>}

        <form onSubmit={handleSubmit} className="space-y-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              {user.role === "ngo" ? "Organization Name *" : "Full Name *"}
            </label>
            <Input type="text" name="name" value={formData.name} onChange={handleChange} required />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Location *</label>
            <Input type="text" name="location" value={formData.location} onChange={handleChange} required />
          </div>

          {user.role === "volunteer" && (
            <>
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">Skills (comma-separated)</label>
                <Input
                  type="text"
                  name="skills"
                  value={formData.skills.join(", ")}
                  onChange={handleSkillsChange}
                  placeholder="e.g., React, Design, Teaching"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">Bio</label>
                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  rows="4"
                  className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400"
                ></textarea>
              </div>
            </>
          )}

          {user.role === "ngo" && (
            <>
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">Organization Description</label>
                <textarea
                  name="organization_description"
                  value={formData.organization_description}
                  onChange={handleChange}
                  rows="4"
                  className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400"
                ></textarea>
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">Website URL</label>
                <Input
                  type="url"
                  name="website_url"
                  value={formData.website_url}
                  onChange={handleChange}
                  placeholder="https://example.com"
                />
              </div>
            </>
          )}

          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="secondary" onClick={() => navigate("/profile")}>Cancel</Button>
            <Button type="submit" disabled={loading}>{loading ? "Updating..." : "Update Profile"}</Button>
          </div>
        </form>
      </main>
    </>
  );
}
