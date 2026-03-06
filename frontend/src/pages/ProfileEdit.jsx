import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import userService from "../services/userService";
import { useNavigate } from "react-router-dom";
import "../styles/profileEdit.css";

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
        name: user.name || "",
        location: user.location || "",
        bio: user.bio || "",
        skills: user.skills || [],
        organization_name: user.organization_name || "",
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
        bio: formData.bio,
      };

      if (user?.role === "volunteer") {
        dataToSend.skills = formData.skills;
      }

      if (user?.role === "ngo") {
        dataToSend.organization_name = formData.organization_name;
        dataToSend.organization_description = formData.organization_description;
        dataToSend.website_url = formData.website_url;
      }

      const response = await userService.updateProfile(dataToSend);
      updateUser(response.data.user);
      setSuccess("Profile updated successfully!");

      setTimeout(() => {
        navigate("/profile");
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  if (!user) return <p>Loading...</p>;

  return (
    <div className="profile-edit-container">
      <h2>Edit Profile</h2>

      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}

      <form onSubmit={handleSubmit} className="edit-form">
        {/* Common Fields */}
        <div className="form-group">
          <label>Name *</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Location *</label>
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Bio</label>
          <textarea
            name="bio"
            value={formData.bio}
            onChange={handleChange}
            rows="4"
          ></textarea>
        </div>

        {/* Volunteer-specific fields */}
        {user.role === "volunteer" && (
          <div className="form-group">
            <label>Skills (comma-separated)</label>
            <input
              type="text"
              name="skills"
              value={formData.skills.join(", ")}
              onChange={handleSkillsChange}
              placeholder="e.g., React, Design, Teaching"
            />
          </div>
        )}

        {/* NGO-specific fields */}
        {user.role === "ngo" && (
          <>
            <div className="form-group">
              <label>Organization Name *</label>
              <input
                type="text"
                name="organization_name"
                value={formData.organization_name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Organization Description</label>
              <textarea
                name="organization_description"
                value={formData.organization_description}
                onChange={handleChange}
                rows="4"
              ></textarea>
            </div>

            <div className="form-group">
              <label>Website URL</label>
              <input
                type="url"
                name="website_url"
                value={formData.website_url}
                onChange={handleChange}
                placeholder="https://example.com"
              />
            </div>
          </>
        )}

        <div className="form-actions">
          <button type="submit" disabled={loading} className="submit-btn">
            {loading ? "Updating..." : "Update Profile"}
          </button>
          <button
            type="button"
            onClick={() => navigate("/profile")}
            className="cancel-btn"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
