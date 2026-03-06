import { Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";

import Landing from "./pages/Landing";

import VolunteerSignup from "./pages/VolunteerSignup";
import VolunteerLogin from "./pages/VolunteerLogin";

import NGOSignup from "./pages/NGOSignup";
import NGOLogin from "./pages/NGOLogin";

import NGOProfileForm from "./pages/NGOProfileForm";
import ManageOpportunities from "./pages/ManageOpportunities";

import Opportunities from "./pages/Opportunities";
import Organizations from "./pages/Organizations";
import Profile from "./pages/Profile";
import About from "./pages/About";

import ForNGOs from "./pages/ForNGOs";

function App() {
  return (
    <>

      <Navbar />

      <Routes>

        {/* Landing */}
        <Route path="/" element={<Landing />} />

        {/* Volunteer */}
        <Route path="/volunteer-signup" element={<VolunteerSignup />} />
        <Route path="/volunteer-login" element={<VolunteerLogin />} />
        <Route path="/login" element={<VolunteerLogin />} />

        {/* NGO */}
        <Route path="/ngo-signup" element={<NGOSignup />} />
        <Route path="/ngo-login" element={<NGOLogin />} />
        <Route path="/ngo-profile" element={<NGOProfileForm />} />

        {/* NGO Manage */}
        <Route path="/manage-opportunities" element={<ManageOpportunities />} />

        {/* Pages */}
        <Route path="/opportunities" element={<Opportunities />} />
        <Route path="/organizations" element={<Organizations />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/about" element={<About />} />

        {/* NGO Page */}
        <Route path="/for-ngos" element={<ForNGOs />} />

      </Routes>

    </>
  );
}
