import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Dashboard from "../pages/Dashboard";
import Profile from "../pages/Profile";
import ProfileEdit from "../pages/ProfileEdit";
import OpportunityCreate from "../pages/OpportunityCreate";
import MyOpportunities from "../pages/MyOpportunities";
import BrowseOpportunities from "../pages/BrowseOpportunities";

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/profile/edit" element={<ProfileEdit />} />
        <Route path="/opportunities/create" element={<OpportunityCreate />} />
        <Route path="/opportunities" element={<MyOpportunities />} />
        <Route path="/opportunities/edit/:id" element={<OpportunityCreate />} />
        <Route path="/browse-opportunities" element={<BrowseOpportunities />} />
      </Routes>
    </BrowserRouter>
  );
}
