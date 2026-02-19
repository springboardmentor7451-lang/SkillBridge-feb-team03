import { Link } from "react-router-dom";

export default function Landing() {
  return (
    <div style={{ padding: 40, textAlign: "center" }}>
      <h1>SkillBridge</h1>
      <p>Connecting volunteers and NGOs</p>

      <div style={{ marginTop: 30 }}>
        <Link to="/signup/volunteer">
          <button style={{ margin: 10 }}>Volunteer Signup</button>
        </Link>

        <Link to="/login/volunteer">
          <button style={{ margin: 10 }}>Volunteer Login</button>
        </Link>

        <br />

        <Link to="/signup/ngo">
          <button style={{ margin: 10 }}>NGO Signup</button>
        </Link>

        <Link to="/login/ngo">
          <button style={{ margin: 10 }}>NGO Login</button>
        </Link>
      </div>
    </div>
  );
}
