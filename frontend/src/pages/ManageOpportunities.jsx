import { useState } from "react";
import "./ManageOpportunities.css";

export default function ManageOpportunities() {

  const [opportunities, setOpportunities] = useState(() => {
    const saved = localStorage.getItem("opportunities");
    return saved ? JSON.parse(saved) : [];
  });

  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");
  const [duration, setDuration] = useState("");
  const [skills, setSkills] = useState("");
  const [description, setDescription] = useState("");

  const handleCreate = (e) => {
    e.preventDefault();

    const newOpportunity = {
      id: Date.now(),
      title,
      location,
      duration,
      skills: skills.split(",").map((s) => s.trim()),
      description,
      applicants: 0
    };

    const updated = [newOpportunity, ...opportunities];

    setOpportunities(updated);
    localStorage.setItem("opportunities", JSON.stringify(updated));

    setTitle("");
    setLocation("");
    setDuration("");
    setSkills("");
    setDescription("");
  };

  const handleDelete = (id) => {
    const updated = opportunities.filter((o) => o.id !== id);
    setOpportunities(updated);
    localStorage.setItem("opportunities", JSON.stringify(updated));
  };

  return (
    <div className="mo-page">

      <h1 className="mo-title">Manage Opportunities</h1>

      <form className="mo-form" onSubmit={handleCreate}>

        <h2>Create Opportunity</h2>

        <input
          type="text"
          placeholder="Opportunity Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        <input
          type="text"
          placeholder="Location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          required
        />

        <input
          type="text"
          placeholder="Duration (Example: 2 Months)"
          value={duration}
          onChange={(e) => setDuration(e.target.value)}
          required
        />

        <input
          type="text"
          placeholder="Skills (React, JavaScript)"
          value={skills}
          onChange={(e) => setSkills(e.target.value)}
          required
        />

        <textarea
          placeholder="Opportunity Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />

        <button type="submit" className="create-btn">
          Create Opportunity
        </button>

      </form>

      <div className="mo-list">

        <h2>Your Opportunities</h2>

        {opportunities.length === 0 && (
          <p className="empty-text">No opportunities created yet</p>
        )}

        {opportunities.map((opp) => (

          <div className="opp-card" key={opp.id}>

            <h3>{opp.title}</h3>

            <p className="opp-location">
              {opp.location} • {opp.duration}
            </p>

            <div className="skills">
              {opp.skills.map((skill, index) => (
                <span key={index} className="skill-tag">
                  {skill}
                </span>
              ))}
            </div>

            <p className="opp-desc">{opp.description}</p>

            <p className="applicants">
              Applicants: {opp.applicants}
            </p>

            <button
              className="delete-btn"
              onClick={() => handleDelete(opp.id)}
            >
              Delete
            </button>

          </div>

        ))}

      </div>

    </div>
  );
}