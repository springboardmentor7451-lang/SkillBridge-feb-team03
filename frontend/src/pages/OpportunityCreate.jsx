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
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    required_skills: [],
    duration: "",
    location: "",
  });

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
      required_skills: skills,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      if (!formData.title || !formData.description || !formData.duration || !formData.location) {
        setError("Please fill all required fields");
        setLoading(false);
        return;
      }

      if (id) {
        await opportunityService.updateOpportunity(id, formData);
        toast.success("Opportunity updated");
      } else {
        await opportunityService.createOpportunity(formData);
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
          });
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
            <label className="mb-1 block text-sm font-medium text-slate-700">Required Skills (comma-separated)</label>
            <Input
              type="text"
              name="required_skills"
              value={formData.required_skills.join(", ")}
              onChange={handleSkillsChange}
              placeholder="e.g., Teaching, Technology, Communication"
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Duration *</label>
              <Input
                type="text"
                name="duration"
                value={formData.duration}
                onChange={handleChange}
                placeholder="e.g., 3 months, 6 weeks"
                required
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Location *</label>
              <Input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="e.g., New York, Remote"
                required
              />
            </div>
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
