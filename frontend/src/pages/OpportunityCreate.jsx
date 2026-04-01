import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import opportunityService from "../services/opportunityService";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { toast } from "sonner";

// This component is used for both creating and editing opportunities.
export default function OpportunityCreate() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { id } = useParams(); // if editing

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [skillsInput, setSkillsInput] = useState("");
  const [locationInput, setLocationInput] = useState("");
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    required_skills: [],
    duration: "",
    location: "",
    status: "open",
  });

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
      required_skills: skills,
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

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

      const payload = {
        ...formData,
        required_skills: normalizedSkills,
        location: normalizedLocation,
      };

      if (!payload.title || !payload.description || !payload.duration || !payload.location) {
        setError("Please fill all required fields");
        setLoading(false);
        return;
      }

      if (id) {
        await opportunityService.updateOpportunity(id, payload);
        toast.success("Opportunity updated");
      } else {
        await opportunityService.createOpportunity(payload);
        toast.success("Opportunity created");
      }

      setTimeout(() => {
        navigate("/opportunities");
      }, 500);
    } catch (err) {
      setError(err.response?.data?.message || (id ? "Failed to update opportunity" : "Failed to create opportunity"));
      toast.error(err.response?.data?.message || (id ? "Failed to update opportunity" : "Failed to create opportunity"));
    } finally {
      setLoading(false);
    }
  };

  // Check if user is NGO
  if (user?.role !== "ngo") {
    return (
      <>
        <Navbar />
        <main className="mx-auto max-w-3xl px-4 py-10 md:px-6">
          <h2 className="text-2xl font-bold text-slate-900">Access Denied</h2>
          <p className="mt-2 text-slate-600">Only NGOs can create or edit opportunities.</p>
        </main>
      </>
    );
  }

  // if editing, fetch existing info
  useEffect(() => {
    if (id) {
      const loadOpp = async () => {
        try {
          const res = await opportunityService.getOpportunityById(id);
          // backend returns opportunity object directly
          const opp = res.data;
          setFormData({
            title: opp.title || "",
            description: opp.description || "",
            required_skills: opp.required_skills || [],
            duration: opp.duration || "",
            location: opp.location || "",
            status: opp.status || "open",
          });
          setSkillsInput((opp.required_skills || []).join(", "));
          setLocationInput(opp.location || "");
        } catch (err) {
          console.error("Failed to load opportunity", err);
        }
      };
      loadOpp();
    }
  }, [id]);

  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-3xl space-y-4 px-4 py-8 md:px-6 md:py-10">
        <Button variant="secondary" onClick={() => navigate("/opportunities")} type="button">Back to Opportunities</Button>

        <h2 className="text-2xl font-bold text-slate-900">{id ? "Edit Opportunity" : "Create New Opportunity"}</h2>

        {error && <div className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Title *</label>
            <Input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g., Digital Literacy Training"
              required
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Description *</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe the opportunity in detail"
              rows="5"
              required
              className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400"
            ></textarea>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Required Skills (separate with commas)</label>
            <Input
              type="text"
              name="required_skills"
              value={skillsInput}
              onChange={handleSkillsChange}
              onBlur={processSkills}
              placeholder="e.g., Digital Marketing, Content Writing, SEO"
            />
            <p className="mt-1 text-xs text-slate-500">You can add skills with multiple words like 'Digital Marketing', 'Social Media', or 'Content Writing'. Separate different skills with commas.</p>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Duration *</label>
              <select
                name="duration"
                value={formData.duration}
                onChange={handleChange}
                className="h-11 w-full rounded-xl border border-slate-300 bg-white px-3 text-sm text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400"
                required
              >
                <option value="">Select duration</option>
                <option value="1 week">1 week</option>
                <option value="1 month">1 month</option>
                <option value="3 month">3 month</option>
                <option value="6 month">6 month</option>
                <option value="1 year">1 year</option>
              </select>
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
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Status *</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="h-11 w-full rounded-xl border border-slate-300 bg-white px-3 text-sm text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400"
              required
            >
              <option value="open">Open</option>
              <option value="closed">Closed</option>
            </select>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="secondary" onClick={() => navigate("/opportunities")}>Cancel</Button>
            <Button type="submit" disabled={loading}>{loading ? (id ? "Updating..." : "Creating...") : id ? "Update Opportunity" : "Create Opportunity"}</Button>
          </div>
        </form>
      </main>
    </>
  );
}
