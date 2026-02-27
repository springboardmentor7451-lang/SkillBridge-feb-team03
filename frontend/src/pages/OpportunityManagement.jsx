import { useState } from "react";
import "./OpportunityManagement.css";

const OpportunityManagement = () => {
  const [opportunities, setOpportunities] = useState([
  {
    id: 1,
    title: "Teaching Volunteer",
    location: "Hyderabad",
    duration: "3 Months",
    status: "Open",
  },
  {
    id: 2,
    title: "Food Distribution",
    location: "Vijayawada",
    duration: "1 Month",
    status: "Closed",
  },
  {
    id: 3,
    title: "Healthcare Camp Assistant",
    location: "Chennai",
    duration: "2 Weeks",
    status: "Open",
  },
  {
    id: 4,
    title: "Tree Plantation Drive",
    location: "Bangalore",
    duration: "1 Week",
    status: "Closed",
  },
  {
    id: 5,
    title: "Women Skill Development Mentor",
    location: "Mumbai",
    duration: "2 Months",
    status: "Open",
  },
  {
    id: 6,
    title: "Rural Education Support",
    location: "Delhi",
    duration: "4 Months",
    status: "Open",
  },
]);

  const [deleteId, setDeleteId] = useState(null);
  const [editData, setEditData] = useState(null);

  // DELETE
  const confirmDelete = () => {
    setOpportunities(opportunities.filter((opp) => opp.id !== deleteId));
    setDeleteId(null);
  };

  // OPEN EDIT MODAL
  const handleEditClick = (opp) => {
    setEditData(opp);
  };

  // SAVE EDIT
  const saveEdit = () => {
    setOpportunities(
      opportunities.map((opp) =>
        opp.id === editData.id ? editData : opp
      )
    );
    setEditData(null);
  };

  return (
    <div className="opportunity-page">
      <div className="opportunity-container">
        <h1>Opportunity Management</h1>

        {opportunities.map((opp) => (
          <div key={opp.id} className="opportunity-card">
            <div className="opportunity-info">
              <h3>{opp.title}</h3>
              <p>📍 {opp.location}</p>
              <p>⏳ {opp.duration}</p>
              <span
                className={
                  opp.status === "Open"
                    ? "status open"
                    : "status closed"
                }
              >
                {opp.status}
              </span>
            </div>

            <div className="actions">
              <button
                className="edit-btn"
                onClick={() => handleEditClick(opp)}
              >
                Edit
              </button>

              <button
                className="delete-btn"
                onClick={() => setDeleteId(opp.id)}
              >
                Delete
              </button>
            </div>
          </div>
        ))}

        {/* DELETE MODAL */}
        {deleteId && (
          <div className="modal-overlay">
            <div className="modal">
              <h3>Delete this opportunity?</h3>
              <div className="modal-actions">
                <button
                  className="cancel-btn"
                  onClick={() => setDeleteId(null)}
                >
                  Cancel
                </button>
                <button
                  className="confirm-btn"
                  onClick={confirmDelete}
                >
                  Yes Delete
                </button>
              </div>
            </div>
          </div>
        )}

        {/* EDIT MODAL */}
        {editData && (
          <div className="modal-overlay">
            <div className="modal">
              <h3>Edit Opportunity</h3>

              <input
                type="text"
                value={editData.title}
                onChange={(e) =>
                  setEditData({ ...editData, title: e.target.value })
                }
                placeholder="Title"
              />

              <input
                type="text"
                value={editData.location}
                onChange={(e) =>
                  setEditData({ ...editData, location: e.target.value })
                }
                placeholder="Location"
              />

              <input
                type="text"
                value={editData.duration}
                onChange={(e) =>
                  setEditData({ ...editData, duration: e.target.value })
                }
                placeholder="Duration"
              />

              <select
                value={editData.status}
                onChange={(e) =>
                  setEditData({ ...editData, status: e.target.value })
                }
              >
                <option value="Open">Open</option>
                <option value="Closed">Closed</option>
              </select>

              <div className="modal-actions">
                <button
                  className="cancel-btn"
                  onClick={() => setEditData(null)}
                >
                  Cancel
                </button>
                <button
                  className="confirm-btn"
                  onClick={saveEdit}
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OpportunityManagement;