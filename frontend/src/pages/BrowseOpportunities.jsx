import { useEffect, useState } from "react";
import opportunityService from "../services/opportunityService";
import Sidebar from "../components/Sidebar";
import "../styles/dashboard.css";

export default function BrowseOpportunities() {
  const [opps, setOpps] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const res = await opportunityService.getAllOpportunities();
        setOpps(res.data.opportunities);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <div className="dashboard-container">
      <Sidebar />
      <div className="dashboard-content">
        <h1>Browse Opportunities</h1>
        {loading ? (
          <p>Loading...</p>
        ) : opps.length === 0 ? (
          <p>No opportunities available.</p>
        ) : (
          <div className="opps-grid">
            {opps.map((opp) => (
              <div key={opp._id} className="opportunity-card">
                <div className="card-header">
                  <h4>{opp.title}</h4>
                  <span className={`status ${opp.status}`}>{opp.status}</span>
                </div>
                <p className="card-description">{opp.description.substring(0,100)}...</p>
                <p><strong>Location:</strong> {opp.location}</p>
                <p><strong>Duration:</strong> {opp.duration}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
