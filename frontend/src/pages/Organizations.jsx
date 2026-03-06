import { useState } from "react";

export default function Organizations() {

  const [organizations] = useState([
    {
      id:1,
      name:"Helping Hands",
      location:"Mumbai, India",
      focus:"Education",
      website:"https://www.unicef.org",
      description:"Providing education support to underprivileged children."
    },
    {
      id:2,
      name:"Green Earth",
      location:"Delhi, India",
      focus:"Environment",
      website:"https://www.greenpeace.org",
      description:"Working on environmental protection and tree plantation drives."
    },
    {
      id:3,
      name:"Health Bridge",
      location:"Hyderabad, India",
      focus:"Healthcare",
      website:"https://www.doctorswithoutborders.org",
      description:"Organizing medical camps and healthcare awareness programs."
    },
    {
      id:4,
      name:"Food For All",
      location:"Bangalore, India",
      focus:"Hunger Relief",
      website:"https://www.feedingamerica.org",
      description:"Providing meals to homeless and low-income families."
    },
    {
      id:5,
      name:"Digital Future",
      location:"Remote",
      focus:"Technology",
      website:"https://www.code.org",
      description:"Teaching digital skills and coding to students."
    },
    {
      id:6,
      name:"Women Rise",
      location:"Chennai, India",
      focus:"Women Empowerment",
      website:"https://www.unwomen.org",
      description:"Supporting women entrepreneurship and education."
    },
    {
      id:7,
      name:"Animal Care",
      location:"Pune, India",
      focus:"Animal Welfare",
      website:"https://www.worldanimalprotection.org",
      description:"Rescuing animals and providing shelter."
    },
    {
      id:8,
      name:"Youth Power",
      location:"Remote",
      focus:"Youth Development",
      website:"https://www.un.org/youth",
      description:"Helping youth build leadership and career skills."
    }
  ]);

 return (
  <div
    style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg,#020617,#0f172a)",
      padding: "120px 40px",
      color: "white"
    }}
  >
    <h2 style={{ textAlign: "center", marginBottom: "40px", fontSize: "32px" }}>
      Partner NGOs
    </h2>

    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))",
        gap: "30px"
      }}
    >
      {organizations.map((org) => (
        <div
          key={org.id}
          style={{
            background: "rgba(255,255,255,0.05)",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: "12px",
            padding: "20px"
          }}
        >
          <h3>{org.name}</h3>

          <p>
            <strong>Location:</strong> {org.location}
          </p>

          <p>
            <strong>Focus:</strong> {org.focus}
          </p>

          <p>{org.description}</p>

          <a
            href={org.website}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "inline-block",
              marginTop: "10px",
              padding: "8px 16px",
              background: "#3b82f6",
              borderRadius: "6px",
              color: "white",
              textDecoration: "none"
            }}
          >
            Visit Website
          </a>
        </div>
      ))}
    </div>
  </div>
  );
}