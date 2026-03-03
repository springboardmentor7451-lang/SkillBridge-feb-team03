import { Routes, Route } from "react-router-dom";
import Landing from "../pages/Landing";
import Register from "../pages/Register";
import VolunteerProfile from "../pages/VolunteerProfile";
import NgoProfile from "../pages/NgoProfile";
import Login from "../pages/Login";
import VolunteerDashboard from "../pages/VolunteerDashboard";
import NGODashboard from "../pages/NGODashboard";
import CreateOpportunity from "../pages/CreateOpportunity";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/register" element={<Register />} />
      <Route path="/volunteer-profile" element={<VolunteerProfile />} />
      <Route path="/ngo-profile" element={<NgoProfile />} />
      <Route path="/login" element={<Login />} />
      <Route path="/volunteer-dashboard" element={<VolunteerDashboard />} />
      <Route path="/ngo-dashboard" element={<NGODashboard />} />
      <Route path="/create-opportunity" element={<CreateOpportunity />} />

    </Routes>
  );
};

export default AppRoutes;