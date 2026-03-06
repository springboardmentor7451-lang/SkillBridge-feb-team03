import "./ForNGOs.css";

export default function ForNGOs() {
  return (
    <div className="ngo-page">

      <h1 className="ngo-title">Why NGOs Choose SkillBridge</h1>

      <p className="ngo-sub">
        Everything you need to find, manage and collaborate with skilled volunteers.
      </p>

      <div className="ngo-grid">

        <div className="ngo-card">
          <h3>Access to Skilled Volunteers</h3>
          <p>Find experienced volunteers ready to help.</p>
        </div>

        <div className="ngo-card">
          <h3>Easy Opportunity Posting</h3>
          <p>Post projects and receive applications easily.</p>
        </div>

        <div className="ngo-card">
          <h3>Track Impact</h3>
          <p>Monitor volunteer contributions and results.</p>
        </div>

        <div className="ngo-card">
          <h3>Global Reach</h3>
          <p>Connect with volunteers from around the world.</p>
        </div>

        <div className="ngo-card">
          <h3>Fast Matching</h3>
          <p>Find volunteers matching your project needs.</p>
        </div>

        <div className="ngo-card">
          <h3>Trusted & Secure</h3>
          <p>Verified profiles ensure trusted collaboration.</p>
        </div>

      </div>

    </div>
  );
}