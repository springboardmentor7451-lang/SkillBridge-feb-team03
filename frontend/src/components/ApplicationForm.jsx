import { useState } from "react";
import applicationService from "../services/applicationService";
import { Button } from "./ui/button";

export default function ApplicationForm({ opportunity, onClose, onSuccess }) {
  const [coverLetter, setCoverLetter] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await applicationService.applyToOpportunity(opportunity._id, coverLetter);
      onSuccess();
      onClose();
    } catch (error) {
      setError(error.response?.data?.message || "Failed to submit application");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4" onClick={onClose}>
      <div className="w-full max-w-2xl rounded-2xl border border-slate-200 bg-white shadow-xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
          <h3 className="text-lg font-semibold text-slate-900">Apply for Opportunity</h3>
          <button className="text-2xl leading-none text-slate-400 transition hover:text-slate-600" onClick={onClose}>
            ×
          </button>
        </div>

        <div className="space-y-5 px-5 py-5">
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
            <h4 className="text-base font-semibold text-slate-900">{opportunity.title}</h4>
            <p className="mt-1 text-xs text-slate-500">{opportunity.location} • {opportunity.duration}</p>
            <p className="mt-3 text-sm leading-relaxed text-slate-700">{opportunity.description}</p>
            {opportunity.required_skills?.length > 0 && (
              <div className="mt-3">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Required Skills</p>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {opportunity.required_skills.map((skill, i) => (
                    <span key={i} className="rounded-full bg-white px-2.5 py-1 text-xs font-medium text-slate-700 ring-1 ring-slate-200">{skill}</span>
                  ))}
                </div>
              </div>
            )}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="coverLetter" className="mb-1 block text-sm font-medium text-slate-700">Cover Letter (Optional)</label>
              <textarea
                id="coverLetter"
                value={coverLetter}
                onChange={(e) => setCoverLetter(e.target.value)}
                placeholder="Tell us why you're interested in this opportunity and how your skills match..."
                rows={6}
                className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400"
              />
              <p className="mt-1 text-xs text-slate-500">Share your motivation, relevant experience, and why you would be a great fit.</p>
            </div>

            {error && <div className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">{error}</div>}

            <div className="flex justify-end gap-2">
              <Button type="button" variant="secondary" onClick={onClose}>Cancel</Button>
              <Button type="submit" disabled={loading}>{loading ? "Submitting..." : "Submit Application"}</Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}