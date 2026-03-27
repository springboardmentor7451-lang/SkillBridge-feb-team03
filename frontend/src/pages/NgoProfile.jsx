import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import "./NgoProfile.css";

const NgoProfile = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const { name, email } = location.state || {};

  const [selectedAreas, setSelectedAreas] = useState([]);
  const [errors, setErrors] = useState({});
  const [fileName, setFileName] = useState("");

  const [formData, setFormData] = useState({
    ngoName: name || "",
    officialEmail: email || "",
    registration: "",
    phone: "",
    city: "",
    state: "",
    established: "",
    website: "",
    projects: "",
    teamSize: "",
    beneficiaries: "",
    skillsRequired: "",
    mission: "",
    vision: "",
    facebook: "",
    instagram: "",
    linkedin: "",
    twitter: "",
  });

  const focusOptions = [
    "Education",
    "Healthcare",
    "Environment",
    "Women Empowerment",
    "Child Welfare",
  ];

  const toggleArea = (area) => {
    setSelectedAreas((prev) =>
      prev.includes(area)
        ? prev.filter((a) => a !== area)
        : [...prev, area]
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

    const allowedTypes = [
      "application/pdf",
      "image/png",
      "image/jpeg",
    ];

    if (!allowedTypes.includes(file.type)) {
      setErrors((prev) => ({
        ...prev,
        file: "Only PDF, PNG or JPG allowed",
      }));
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setErrors((prev) => ({
        ...prev,
        file: "File must be under 10MB",
      }));
      return;
    }

    setErrors((prev) => ({ ...prev, file: "" }));
    setFileName(file.name);
  };

  const validate = () => {
    let newErrors = {};

    if (!formData.registration)
      newErrors.registration = "Registration number required";

    if (!formData.phone)
      newErrors.phone = "Phone number required";
    else if (!/^[0-9]{10}$/.test(formData.phone))
      newErrors.phone = "Must be 10 digits";

    if (!formData.city) newErrors.city = "City required";
    if (!formData.state) newErrors.state = "State required";

    if (!formData.established)
      newErrors.established = "Year required";
    else if (
      isNaN(formData.established) ||
      formData.established.length !== 4
    )
      newErrors.established = "Enter valid 4-digit year";

    if (formData.website && !formData.website.startsWith("http"))
      newErrors.website = "Enter valid website URL";

    if (selectedAreas.length === 0)
      newErrors.focus = "Select at least one focus area";

    if (!formData.mission || formData.mission.length < 50)
      newErrors.mission = "Minimum 50 characters required";

    if (!formData.vision || formData.vision.length < 50)
      newErrors.vision = "Minimum 50 characters required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (validate()) {
      const ngoData = {
        ...formData,
        focusAreas: selectedAreas,
        role: "ngo",
      };

      localStorage.setItem("user", JSON.stringify(ngoData));

      navigate("/ngo-dashboard");
    }
  };

  return (
    <div className="ngo-container">
      <div className="ngo-card">
        <h1>
          Complete Your <span>NGO Profile</span>
        </h1>

        <form onSubmit={handleSubmit}>

          {/* Basic Information */}
          <div className="section-card">
            <h3>Basic Information</h3>

            <div className="row">
              <input type="text" value={formData.ngoName} readOnly />
              <div className="input-group">
                <input
                  name="registration"
                  placeholder="Registration Number"
                  onChange={handleChange}
                />
                {errors.registration && <p className="error">{errors.registration}</p>}
              </div>
            </div>

            <div className="row">
              <input type="email" value={formData.officialEmail} readOnly />
              <div className="input-group">
                <input
                  name="phone"
                  placeholder="Contact Phone"
                  onChange={handleChange}
                />
                {errors.phone && <p className="error">{errors.phone}</p>}
              </div>
            </div>
          </div>

         
          <div className="section-card">
            <h3>Location & Establishment</h3>

            <div className="row">
              <div className="input-group">
                <input name="city" placeholder="City" onChange={handleChange} />
                {errors.city && <p className="error">{errors.city}</p>}
              </div>

              <div className="input-group">
                <input name="state" placeholder="State" onChange={handleChange} />
                {errors.state && <p className="error">{errors.state}</p>}
              </div>
            </div>

            <div className="row">
              <div className="input-group">
                <input
                  name="established"
                  placeholder="Year Established"
                  onChange={handleChange}
                />
                {errors.established && <p className="error">{errors.established}</p>}
              </div>

              <div className="input-group">
                <input
                  name="website"
                  placeholder="Website URL"
                  onChange={handleChange}
                />
                {errors.website && <p className="error">{errors.website}</p>}
              </div>
            </div>
          </div>

         
          <div className="section-card">
            <h3>Focus Areas</h3>
            <div className="focus-areas">
              {focusOptions.map((area) => (
                <div
                  key={area}
                  className={`focus-chip ${selectedAreas.includes(area) ? "active" : ""}`}
                  onClick={() => toggleArea(area)}
                >
                  {area}
                </div>
              ))}
            </div>
            {errors.focus && <p className="error">{errors.focus}</p>}
          </div>

       
          <div className="section-card">
            <h3>Mission & Vision</h3>

            <div className="mission-vision">
              <div className="mv-box">
                <h4>Our Mission</h4>
                <textarea name="mission" onChange={handleChange} />
                {errors.mission && <p className="error">{errors.mission}</p>}
              </div>

              <div className="mv-box vision">
                <h4>Our Vision</h4>
                <textarea name="vision" onChange={handleChange} />
                {errors.vision && <p className="error">{errors.vision}</p>}
              </div>
            </div>
          </div>

          
          <div className="section-card">
            <h3>Verification Documents</h3>
            <label className="upload-box">
              <input type="file" hidden onChange={handleFileChange} />
              <div>
                📄
                <span>{fileName ? fileName : "Upload Registration Certificate"}</span>
                <p>PDF, PNG, JPG (Max 10MB)</p>
              </div>
            </label>
            {errors.file && <p className="error">{errors.file}</p>}
          </div>

          <button className="submit-btn">
            Submit NGO Profile
          </button>

        </form>
      </div>
    </div>
  );
};

export default NgoProfile;
