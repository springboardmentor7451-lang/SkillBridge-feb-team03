import { lazy, Suspense, useEffect, useRef, useState } from "react";
import { BrowserRouter, Navigate, Routes, Route, useLocation } from "react-router-dom";
import NotificationSystem from "../components/NotificationSystem";
import Footer from "../components/Footer";
import { useAuth } from "../context/AuthContext";

const Home = lazy(() => import("../pages/Home"));
const Login = lazy(() => import("../pages/Login"));
const Register = lazy(() => import("../pages/Register"));
const VerifyEmail = lazy(() => import("../pages/VerifyEmail"));
const ForgotPassword = lazy(() => import("../pages/ForgotPassword"));
const ResetPassword = lazy(() => import("../pages/ResetPassword"));
const VerifyEmailChange = lazy(() => import("../pages/VerifyEmailChange"));
const Dashboard = lazy(() => import("../pages/Dashboard"));
const Profile = lazy(() => import("../pages/Profile"));
const ProfileEdit = lazy(() => import("../pages/ProfileEdit"));
const OpportunityCreate = lazy(() => import("../pages/OpportunityCreate"));
const MyOpportunities = lazy(() => import("../pages/MyOpportunities"));
const BrowseOpportunities = lazy(() => import("../pages/BrowseOpportunities"));
const BrowseNGOs = lazy(() => import("../pages/BrowseNGOs"));
const BrowseVolunteers = lazy(() => import("../pages/BrowseVolunteers"));
const Applications = lazy(() => import("../pages/Applications"));
const Messages = lazy(() => import("../pages/Messages"));
const Matches = lazy(() => import("../pages/Matches"));
const Notifications = lazy(() => import("../pages/Notifications"));

function RouteFallback({ overlay = false }) {
  const containerClass = overlay
    ? "fixed inset-0 z-[120] flex items-center justify-center bg-slate-50/80 backdrop-blur-sm"
    : "flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100";

  return (
    <div className={containerClass}>
      <div className="flex flex-col items-center gap-6">
        <div className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white/85 px-6 py-4 shadow-lg">
          <div className="relative h-14 w-14">
            <div className="absolute inset-0 animate-spin rounded-full border-2 border-orange-200 border-t-orange-400" />
            <img src="/sb-favicon.svg" alt="SB" className="absolute inset-2 h-10 w-10 rounded-lg" />
          </div>
          <div className="text-center">
            <h2 className="text-2xl font-bold text-slate-900">SkillBridge</h2>
            <p className="text-sm text-slate-500">Loading...</p>
          </div>
        </div>
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
  const { user, loading } = useAuth();
  const location = useLocation();
  const [showClickLoader, setShowClickLoader] = useState(false);
  const loaderTimerRef = useRef(null);
  const isMessageRoute = location.pathname === "/chat" || location.pathname === "/messages";

  useEffect(() => {
    const handleGlobalClick = (event) => {
      if (isMessageRoute) return;

      if (!(event.target instanceof Element)) return;

      const trigger = event.target.closest("button, a, [role='button']");
      if (!trigger) return;

      if (trigger.getAttribute("aria-disabled") === "true") return;
      if ("disabled" in trigger && trigger.disabled) return;

      if (loaderTimerRef.current) {
        clearTimeout(loaderTimerRef.current);
      }

      setShowClickLoader(true);
      loaderTimerRef.current = setTimeout(() => {
        setShowClickLoader(false);
      }, 550);
    };

    document.addEventListener("click", handleGlobalClick, true);

    return () => {
      document.removeEventListener("click", handleGlobalClick, true);
      if (loaderTimerRef.current) {
        clearTimeout(loaderTimerRef.current);
      }
    };
  }, [isMessageRoute]);

  const requireAuth = (element) => {
    if (loading) return <RouteFallback />;
    return user ? element : <Navigate to="/login" replace />;
  };

  const requireRole = (roles, element) => {
    if (loading) return <RouteFallback />;
    if (!user) return <Navigate to="/login" replace />;
    return roles.includes(user.role) ? element : <Navigate to="/dashboard" replace />;
  };

  return (
    <div className="flex min-h-screen flex-col">
      {!loading && !isMessageRoute && showClickLoader && <RouteFallback overlay />}
      <main className="flex-1">
        <Suspense fallback={<RouteFallback />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/verify-email" element={<VerifyEmail />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/verify-email-change" element={<VerifyEmailChange />} />
            <Route path="/dashboard" element={requireAuth(<Dashboard />)} />
            <Route path="/profile" element={requireAuth(<Profile />)} />
            <Route path="/profile/edit" element={requireAuth(<ProfileEdit />)} />
            <Route path="/opportunities/create" element={requireRole(["ngo"], <OpportunityCreate />)} />
            <Route path="/opportunities" element={requireRole(["ngo"], <MyOpportunities />)} />
            <Route path="/opportunities/edit/:id" element={requireRole(["ngo"], <OpportunityCreate />)} />
            <Route path="/browse-opportunities" element={requireRole(["volunteer"], <BrowseOpportunities />)} />
            <Route path="/browse-ngos" element={requireRole(["volunteer"], <BrowseNGOs />)} />
            <Route path="/browse-volunteers" element={requireRole(["ngo"], <BrowseVolunteers />)} />
            <Route path="/matches" element={requireRole(["volunteer"], <Matches />)} />
            <Route path="/applications" element={requireAuth(<Applications />)} />
            <Route path="/chat" element={requireRole(["volunteer", "ngo"], <Messages />)} />
            <Route path="/messages" element={<Navigate to="/chat" replace />} />
            <Route path="/notifications" element={requireRole(["volunteer", "ngo"], <Notifications />)} />
          </Routes>
        </Suspense>
      </main>
      {!loading && <Footer />}
    </div>
  );
}
