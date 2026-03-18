import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import opportunityService from "../services/opportunityService";
import applicationService from "../services/applicationService";
import Navbar from "../components/Navbar";
import "../styles/opportunityDetail.css";

export default function OpportunityDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();

  const [opportunity, setOpportunity] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [applying, setApplying] = useState(false);
  const [applyError, setApplyError] = useState("");
  const [applied, setApplied] = useState(false);
  const [applySuccess, setApplySuccess] = useState(false);

  useEffect(() => {
    const fetchOpportunity = async () => {
      try {
        const res = await opportunityService.getOpportunityById(id);
        setOpportunity(res.data);
      } catch (err) {
        setError("Failed to load opportunity details");
      } finally {
        setLoading(false);
      }
    };
    fetchOpportunity();
  }, [id]);

  useEffect(() => {
    if (!authLoading && user?.role === "volunteer") {
      const checkApplied = async () => {
        try {
          const res = await applicationService.getMyApplications();
          const apps = res.data.applications || [];
          const alreadyApplied = apps.some(
            (app) => app.opportunity_id?._id === id || app.opportunity_id === id
          );
          setApplied(alreadyApplied);
        } catch {}
      };
      checkApplied();
    }
  }, [id, user, authLoading]);

  const handleApply = async () => {
    setApplying(true);
    setApplyError("");

    try {
      await applicationService.applyToOpportunity(id, "");
      setApplied(true);
      setApplySuccess(true);
    } catch (err) {
      setApplyError("Failed to submit application.");
    } finally {
      setApplying(false);
    }
  };

  if (authLoading || loading) {
    return (
      <>
        <Navbar />
        <div className="opp-detail-wrapper">
          <p>Loading opportunity...</p>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Navbar />
        <div className="opp-detail-wrapper">
          <p>{error}</p>
          <button onClick={() => navigate("/browse-opportunities")}>
            Back
          </button>
        </div>
      </>
    );
  }

  if (!opportunity) return null;

  const isVolunteer = user?.role === "volunteer";

  return (
    <>
      <Navbar />
      <div className="opp-detail-wrapper">

        <h1>{opportunity.title}</h1>

        {opportunity.ngo_id?.name && (
          <p><b>Organisation:</b> {opportunity.ngo_id.name}</p>
        )}

        <p>{opportunity.description}</p>

        {opportunity.required_skills?.length > 0 && (
          <>
            <h3>Required Skills</h3>
            <ul>
              {opportunity.required_skills.map((skill, i) => (
                <li key={i}>{skill}</li>
              ))}
            </ul>
          </>
        )}

        <p><b>Location:</b> {opportunity.location}</p>
        <p><b>Duration:</b> {opportunity.duration}</p>

        {isVolunteer && (
          <div>
            {applySuccess && <p>Application submitted successfully!</p>}
            {applyError && <p>{applyError}</p>}

            <button
              onClick={handleApply}
              disabled={applied || applying}
            >
              {applying
                ? "Submitting..."
                               : applied
                ? "Already Applied"
                : "Apply Now"}
            </button>
          </div>
        )}
      </div>
    </>
  );
}