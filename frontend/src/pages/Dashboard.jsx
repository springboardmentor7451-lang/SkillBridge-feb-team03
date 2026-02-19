import "../styles/dashboard.css";
import Sidebar from "../components/Sidebar";

export default function Dashboard() {

  const user = {
    name: "Aman",
    role: "Volunteer",
    skills: ["React", "Design"]
  };

  const stats = [
    { label: "Applications", value: 0, color: "blue" },
    { label: "Accepted", value: 0, color: "green" },
    { label: "Pending", value: 0, color: "orange" },
    { label: "Skills", value: user.skills.length, color: "purple" }
  ];

  return (

    <div className="dashboard-container">

      <Sidebar />

      <div className="dashboard-content">

        {/* Header */}
        <h1>Overview</h1>

        <p className="welcome">
          Welcome back, {user.name}!
        </p>


        {/* Stats */}
        <div className="stats-grid">

          {stats.map((stat, index) => (

            <div key={index} className="stat-card">

              <p className="stat-label">
                {stat.label}
              </p>

              <h2 className={"stat-value " + stat.color}>
                {stat.value}
              </h2>

            </div>

          ))}

        </div>


        <div className="dashboard-grid">


          {/* Recent Applications */}
          <div className="recent">

            <div className="recent-header">

              <h3>Recent Applications</h3>

              <a href="#">View All</a>

            </div>

            <div className="recent-box">

              No recent applications to show.

            </div>

          </div>


          {/* Opportunities */}
          <div className="opportunities">

            <h3>Find Opportunities</h3>

            <p>
              Discover volunteering opportunities that match your skills.
            </p>

            <button className="browse-btn">
              Browse All Opportunities
            </button>


            <div className="skills">

              <h4>Your Skills</h4>

              {user.skills.map((skill, index) => (

                <span key={index} className="skill">

                  {skill}

                </span>

              ))}

            </div>

          </div>

        </div>

      </div>

    </div>

  );

}
