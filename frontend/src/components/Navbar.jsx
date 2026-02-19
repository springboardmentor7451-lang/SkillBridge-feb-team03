// import { Link } from "react-router-dom";

// export default function Navbar() {
//   return (
//     <nav className="navbar">
//       <div className="logo">
//         <span className="logo-box">SB</span>
//         SkillBridge
//       </div>

//       <div className="nav-links">
//         <a>How it Works</a>
//         <a>Features</a>
//         <a>Impact</a>
//         <a>For NGOs</a>
//       </div>

//       <div className="nav-buttons">
//         <Link to="/login">Log In</Link>
//         <Link to="/register" className="btn-primary">
//           Get Started
//         </Link>
//       </div>
//     </nav>
//   );
// }
import { Link } from "react-router-dom";
import "../styles/navbar.css";

export default function Navbar() {
  return (
    <nav className="navbar">

      <div className="nav-left">
        <div className="logo-box">SB</div>
        SkillBridge
      </div>

      <div className="nav-center">
        <a>How it Works</a>
        <a>Features</a>
        <a>Impact</a>
        <a>For NGOs</a>
      </div>

      <div className="nav-right">
        <Link to="/login">Log In</Link>

        <Link to="/register" className="primary-btn">
          Get Started
        </Link>
      </div>

    </nav>
  );
}
