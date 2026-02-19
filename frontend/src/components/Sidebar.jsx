import "../styles/dashboard.css";

export default function Sidebar() {

  return (

    <div className="sidebar">

      <div className="logo">

        <div className="logo-box">SB</div>

        SkillBridge

      </div>


      <div className="profile">

        <img
          // src="https://i.pravatar.cc/40"
          alt=""
        />

        <div>

          <p>Aman</p>

          <small>Volunteer</small>

        </div>

      </div>


      <ul>

        <li className="active">Dashboard</li>

        <li>Opportunities</li>

        <li>Applications</li>

        <li>Messages</li>

      </ul>


      <p className="logout">
       <a href="login">Sign out</a> 
      </p>

    </div>

  );

}
