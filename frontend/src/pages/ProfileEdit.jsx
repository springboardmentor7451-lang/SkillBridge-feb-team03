import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import userService from "../services/userService";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
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
    profile_picture_url: "",
    skills: [],
    organization_name: "",
    organization_description: "",
    website_url: "",
  });
  const [newEmail, setNewEmail] = useState("");
  const [emailPassword, setEmailPassword] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [emailSubmitting, setEmailSubmitting] = useState(false);
  const [passwordSubmitting, setPasswordSubmitting] = useState(false);
  const [skillsInput, setSkillsInput] = useState("");
  const [locationInput, setLocationInput] = useState("");

  // Pre-fill form with current user data
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.role === "ngo" ? (user.organization_name || user.name || "") : (user.name || ""),
        location: user.location || "",
        bio: user.bio || "",
        profile_picture_url: user.profile_picture_url || "",
        skills: user.skills || [],
        organization_name: user.organization_name || user.name || "",
        organization_description: user.organization_description || "",
        website_url: user.website_url || "",
      });
      setSkillsInput((user.skills || []).join(", "));
      setLocationInput(user.location || "");
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
    setSkillsInput(e.target.value);
  };

  const processSkills = () => {
    const skills = skillsInput
      .split(",")
      .map((skill) => skill.trim())
      .filter((skill) => skill.length > 0);
    setFormData((prev) => ({
      ...prev,
      skills,
    }));
  };

  const handleLocationChange = (e) => {
    setLocationInput(e.target.value);
  };

  const processLocation = () => {
    const normalizedLocation = locationInput
      .split(",")
      .map((item) => item.trim())
      .filter((item) => item.length > 0)
      .join(", ");

    setLocationInput(normalizedLocation);
    setFormData((prev) => ({
      ...prev,
      location: normalizedLocation,
    }));
  };

  const getInitials = (value = "") =>
    String(value)
      .trim()
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase())
      .join("") || "SB";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const normalizedSkills = skillsInput
        .split(",")
        .map((skill) => skill.trim())
        .filter((skill) => skill.length > 0);
      const normalizedLocation = locationInput
        .split(",")
        .map((item) => item.trim())
        .filter((item) => item.length > 0)
        .join(", ");

      const dataToSend = {
        name: formData.name,
        location: normalizedLocation,
        profile_picture_url: formData.profile_picture_url,
      };

      if (user?.role === "volunteer") {
        dataToSend.skills = normalizedSkills;
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

  const handleRequestEmailChange = async (event) => {
    event.preventDefault();

    if (!newEmail.trim() || !emailPassword) {
      toast.error("Please enter new email and current password");
      return;
    }

    try {
      setEmailSubmitting(true);
      const response = await userService.requestEmailChange({
        newEmail,
        currentPassword: emailPassword,
      });
      toast.success(response.data?.message || "Verification link sent to new email");
      setNewEmail("");
      setEmailPassword("");
    } catch (error) {
      toast.error(error.response?.data?.message || "Could not request email change");
    } finally {
      setEmailSubmitting(false);
    }
  };

  const handleChangePassword = async (event) => {
    event.preventDefault();

    if (!currentPassword || !newPassword || !confirmNewPassword) {
      toast.error("Please fill all password fields");
      return;
    }

    if (newPassword.length < 6) {
      toast.error("New password must have at least 6 characters");
      return;
    }

    if (newPassword !== confirmNewPassword) {
      toast.error("New passwords do not match");
      return;
    }

    try {
      setPasswordSubmitting(true);
      const response = await userService.changePassword({
        currentPassword,
        newPassword,
      });
      toast.success(response.data?.message || "Password updated successfully");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmNewPassword("");
    } catch (error) {
      toast.error(error.response?.data?.message || "Could not update password");
    } finally {
      setPasswordSubmitting(false);
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
          <div className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-4 md:flex-row md:items-center">
            <div className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-orange-500 to-amber-400 text-xl font-bold text-white shadow-sm">
              {formData.profile_picture_url ? (
                <img
                  src={formData.profile_picture_url}
                  alt="Profile preview"
                  className="h-full w-full object-cover"
                />
              ) : (
                getInitials(formData.name || user.name)
              )}
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-slate-900">Profile Picture</p>
              <p className="text-xs text-slate-600">Add a public image URL for your profile picture.</p>
            </div>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              {user.role === "ngo" ? "Organization Name *" : "Full Name *"}
            </label>
            <Input type="text" name="name" value={formData.name} onChange={handleChange} required />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Profile Picture URL</label>
            <Input
              type="url"
              name="profile_picture_url"
              value={formData.profile_picture_url}
              onChange={handleChange}
              placeholder="https://example.com/profile.jpg"
            />
            <p className="mt-1 text-xs text-slate-500">This picture will appear on your profile and browse cards.</p>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Location *</label>
            <Input
              type="text"
              name="location"
              value={locationInput}
              onChange={handleLocationChange}
              onBlur={processLocation}
              placeholder="e.g., Mumbai, Maharashtra or Remote"
              required
            />
            <p className="mt-1 text-xs text-slate-500">Use commas to add location parts, like city and state.</p>
          </div>

          {user.role === "volunteer" && (
            <>
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">Skills (separate with commas)</label>
                <Input
                  type="text"
                  name="skills"
                  value={skillsInput}
                  onChange={handleSkillsChange}
                  onBlur={processSkills}
                  placeholder="e.g., React, Digital Marketing, UI Design"
                />
                <p className="mt-1 text-xs text-slate-500">You can add skills with multiple words like 'Digital Marketing' or 'Content Writing'. Separate multiple skills with commas.</p>
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

        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-900">Account Security</h3>
          <p className="mt-1 text-sm text-slate-600">Update your email with verification and change your password.</p>

          <div className="mt-6 grid gap-6 md:grid-cols-2">
            <form onSubmit={handleRequestEmailChange} className="space-y-3 rounded-xl border border-slate-200 p-4">
              <h4 className="text-sm font-semibold text-slate-900">Update Email</h4>
              <div className="space-y-1.5">
                <Label htmlFor="newEmail">New Email</Label>
                <Input
                  id="newEmail"
                  type="email"
                  placeholder="new-email@example.com"
                  value={newEmail}
                  onChange={(event) => setNewEmail(event.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="emailPassword">Current Password</Label>
                <Input
                  id="emailPassword"
                  type="password"
                  placeholder="Enter current password"
                  value={emailPassword}
                  onChange={(event) => setEmailPassword(event.target.value)}
                />
              </div>
              <Button type="submit" className="w-full" disabled={emailSubmitting}>
                {emailSubmitting ? "Sending verification..." : "Send Verification To New Email"}
              </Button>
            </form>

            <form onSubmit={handleChangePassword} className="space-y-3 rounded-xl border border-slate-200 p-4">
              <h4 className="text-sm font-semibold text-slate-900">Change Password</h4>
              <div className="space-y-1.5">
                <Label htmlFor="currentPassword">Current Password</Label>
                <Input
                  id="currentPassword"
                  type="password"
                  placeholder="Enter current password"
                  value={currentPassword}
                  onChange={(event) => setCurrentPassword(event.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="newPassword">New Password</Label>
                <Input
                  id="newPassword"
                  type="password"
                  placeholder="Enter new password"
                  value={newPassword}
                  onChange={(event) => setNewPassword(event.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="confirmNewPassword">Confirm New Password</Label>
                <Input
                  id="confirmNewPassword"
                  type="password"
                  placeholder="Confirm new password"
                  value={confirmNewPassword}
                  onChange={(event) => setConfirmNewPassword(event.target.value)}
                />
              </div>
              <Button type="submit" className="w-full" disabled={passwordSubmitting}>
                {passwordSubmitting ? "Updating password..." : "Update Password"}
              </Button>
            </form>
          </div>
        </section>
      </main>
    </>
  );
}
