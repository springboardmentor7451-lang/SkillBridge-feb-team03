import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import "./VolunteerProfile.css";

const VolunteerProfile = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { name, email } = location.state || {};

  const [selectedSkills, setSelectedSkills] = useState([]);
  const [errors, setErrors] = useState({});
  const [fileName, setFileName] = useState("");

  const [formData, setFormData] = useState({
    fullName: name || "",
    emailAddress: email || "",
    contact: "",
    city: "",
    experienceLevel: "",
    years: "",
    availability: "",
    hours: "",
    about: "",
    linkedin: "",
    portfolio: "",
  });

  const skills = [
    "Teaching",
    "Web Development",
    "Graphic Design",
    "Healthcare",
    "Fundraising",
    "Mentoring",
  ];

  const toggleSkill = (skill) => {
    setSelectedSkills((prev) =>
      prev.includes(skill)
        ? prev.filter((s) => s !== skill)
        : [...prev, skill]
    );
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!["image/png", "image/jpeg"].includes(file.type)) {
      setErrors((prev) => ({
        ...prev,
        photo: "Only PNG or JPG allowed",
      }));
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setErrors((prev) => ({
        ...prev,
        photo: "File must be under 5MB",
      }));
      return;
    }

    setErrors((prev) => ({ ...prev, photo: "" }));
    setFileName(file.name);
  };

  const validate = () => {
    let newErrors = {};

    if (!formData.contact) {
      newErrors.contact = "Contact number required";
    } else if (!/^[0-9]{10}$/.test(formData.contact)) {
      newErrors.contact = "Must be 10 digits";
    }

    if (!formData.city) newErrors.city = "City is required";

    if (selectedSkills.length === 0)
      newErrors.skills = "Select at least one skill";

    if (!formData.experienceLevel)
      newErrors.experienceLevel = "Select experience level";

    if (!formData.years) {
      newErrors.years = "Enter years of experience";
    } else if (isNaN(formData.years) || formData.years < 0) {
      newErrors.years = "Enter valid number";
    }

    if (!formData.availability)
      newErrors.availability = "Select availability";

    if (!formData.hours) {
      newErrors.hours = "Enter hours per week";
    } else if (isNaN(formData.hours) || formData.hours <= 0) {
      newErrors.hours = "Enter valid hours";
    }

    if (!formData.about) {
      newErrors.about = "Tell us about yourself";
    } else if (formData.about.length < 50) {
      newErrors.about = "Minimum 50 characters required";
    }

    if (formData.linkedin && !formData.linkedin.includes("linkedin.com")) {
      newErrors.linkedin = "Enter valid LinkedIn URL";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (validate()) {
      const volunteerData = {
        ...formData,
        skills: selectedSkills,
        role: "volunteer",
      };

      localStorage.setItem("user", JSON.stringify(volunteerData));

      navigate("/volunteer-dashboard");
    }
  };

  return (
    <div className="volunteer-container">
      <div className="volunteer-card">
        <h1>
          Complete Your <span>Volunteer Profile</span>
        </h1>

        <form onSubmit={handleSubmit}>

          
          <div className="section-card">
            <h3>Personal Information</h3>

            <div className="row">
              <input type="text" value={formData.fullName} readOnly />
              <input type="email" value={formData.emailAddress} readOnly />
            </div>

            <div className="row">
              <div className="input-group">
                <input
                  name="contact"
                  placeholder="Contact Number"
                  onChange={handleChange}
                />
                {errors.contact && <p className="error">{errors.contact}</p>}
              </div>

              <div className="input-group">
                <input
                  name="city"
                  placeholder="City, State"
                  onChange={handleChange}
                />
                {errors.city && <p className="error">{errors.city}</p>}
              </div>
            </div>
          </div>

         
          <div className="section-card">
            <h3>Skills & Expertise</h3>
            <div className="skills-grid">
              {skills.map((skill) => (
                <div
                  key={skill}
                  className={`skill-chip ${
                    selectedSkills.includes(skill) ? "active" : ""
                  }`}
                  onClick={() => toggleSkill(skill)}
                >
                  {skill}
                </div>
              ))}
            </div>
            {errors.skills && <p className="error">{errors.skills}</p>}
          </div>

          
          <div className="section-card">
            <h3>Experience</h3>
            <div className="row">
              <div className="input-group">
                <select name="experienceLevel" onChange={handleChange}>
                  <option value="">Experience Level</option>
                  <option>Beginner</option>
                  <option>Intermediate</option>
                  <option>Expert</option>
                </select>
                {errors.experienceLevel && (
                  <p className="error">{errors.experienceLevel}</p>
                )}
              </div>

              <div className="input-group">
                <input
                  name="years"
                  placeholder="Years of Experience"
                  onChange={handleChange}
                />
                {errors.years && <p className="error">{errors.years}</p>}
              </div>
            </div>
          </div>

         
          <div className="section-card">
            <h3>Availability</h3>
            <div className="row">
              <div className="input-group">
                <select name="availability" onChange={handleChange}>
                  <option value="">Availability Type</option>
                  <option>Full Time</option>
                  <option>Part Time</option>
                  <option>Weekends</option>
                </select>
                {errors.availability && (
                  <p className="error">{errors.availability}</p>
                )}
              </div>

              <div className="input-group">
                <input
                  name="hours"
                  placeholder="Hours per Week"
                  onChange={handleChange}
                />
                {errors.hours && <p className="error">{errors.hours}</p>}
              </div>
            </div>
          </div>

         
          <div className="section-card about-section">
            <h3>About You</h3>
            <textarea
              name="about"
              placeholder="Minimum 50 characters..."
              onChange={handleChange}
            />
            {errors.about && <p className="error">{errors.about}</p>}
          </div>

          
          <div className="section-card">
            <h3>Portfolio / Social Links</h3>
            <div className="row">
              <div className="input-group">
                <input
                  name="linkedin"
                  placeholder="LinkedIn Profile"
                  onChange={handleChange}
                />
                {errors.linkedin && (
                  <p className="error">{errors.linkedin}</p>
                )}
              </div>

              <div className="input-group">
                <input
                  name="portfolio"
                  placeholder="Portfolio Website"
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          
          <div className="section-card">
            <h3>Profile Photo</h3>
            <label className="upload-box">
              <input type="file" hidden onChange={handleFileChange} />
              <div>
                📸
                <span>
                  {fileName ? fileName : "Upload Profile Photo"}
                </span>
                <p>PNG, JPG up to 5MB</p>
              </div>
            </label>
            {errors.photo && <p className="error">{errors.photo}</p>}
          </div>

          <button type="submit" className="submit-btn">
            Submit Volunteer Profile
          </button>

        </form>
      </div>
    </div>
  );
};

export default VolunteerProfile;