import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import NotificationSystem from "../components/NotificationSystem";
import Footer from "../components/Footer";

const Home = lazy(() => import("../pages/Home"));
const Login = lazy(() => import("../pages/Login"));
const Register = lazy(() => import("../pages/Register"));
const Dashboard = lazy(() => import("../pages/Dashboard"));
const Profile = lazy(() => import("../pages/Profile"));
const ProfileEdit = lazy(() => import("../pages/ProfileEdit"));
const OpportunityCreate = lazy(() => import("../pages/OpportunityCreate"));
const MyOpportunities = lazy(() => import("../pages/MyOpportunities"));
const BrowseOpportunities = lazy(() => import("../pages/BrowseOpportunities"));
const Applications = lazy(() => import("../pages/Applications"));
const Messages = lazy(() => import("../pages/Messages"));
const Notifications = lazy(() => import("../pages/Notifications"));

function RouteFallback() {
  return (
    <div className="flex min-h-[50vh] items-center justify-center">
      <div className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-600 shadow-sm">
        Loading page...
      </div>
    </div>
  );
}

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <NotificationSystem />
      <AppContent />
    </BrowserRouter>
  );
}

function AppContent() {
  return (
    <>
      <Suspense fallback={<RouteFallback />}>
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
          <Route path="/applications" element={<Applications />} />
          <Route path="/messages" element={<Messages />} />
          <Route path="/notifications" element={<Notifications />} />
        </Routes>
      </Suspense>
      <Footer />
    </>
  );
}
