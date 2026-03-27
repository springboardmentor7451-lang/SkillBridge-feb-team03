import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./CreateOpportunity.css";

const CreateOpportunity = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    skills: "",
    duration: "",
    location: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) return;

    const newOpportunity = {
      ...formData,
      id: Date.now(),
    };


    if (!user.opportunities) {
      user.opportunities = [];
    }

    user.opportunities.push(newOpportunity);

    localStorage.setItem("user", JSON.stringify(user));

    navigate("/ngo-dashboard");
  };

  return (
    <div className="create-container">
      <div className="create-card">
        <h2>Create Opportunity</h2>

        <form onSubmit={handleSubmit}>
          <input
            name="title"
            placeholder="Title"
            onChange={handleChange}
            required
          />

          <textarea
            name="description"
            placeholder="Description"
            onChange={handleChange}
            required
          />

          <input
            name="skills"
            placeholder="Required Skills"
            onChange={handleChange}
            required
          />

          <input
            name="duration"
            placeholder="Duration"
            onChange={handleChange}
            required
          />

          <input
            name="location"
            placeholder="Location"
            onChange={handleChange}
            required
          />

          <button type="submit">Create</button>
        </form>
      </div>
    </div>
  );
};

export default CreateOpportunity;
