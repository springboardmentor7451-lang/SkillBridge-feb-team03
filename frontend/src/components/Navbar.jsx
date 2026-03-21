import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import NotificationBell from "./NotificationBell";
import { cn } from "../lib/utils";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { ChevronDown } from "lucide-react";

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const isActive = (path) => location.pathname === path;

  const guestLinks = [
    { label: "How it Works", href: "#how" },
    { label: "Features", href: "#features" },
    { label: "Impact", href: "#impact" },
    { label: "For NGOs", href: "#for-ngos" },
  ];

  const authLinks = [
    { label: "Dashboard", to: "/dashboard", active: isActive("/dashboard") },
    {
      label: "Opportunities",
      to: user?.role === "ngo" ? "/opportunities" : "/browse-opportunities",
      active: isActive("/opportunities") || isActive("/browse-opportunities"),
    },
    { label: "Applications", to: "/applications", active: isActive("/applications") },
    { label: "Messages", to: "/messages", active: isActive("/messages") },
  ];

  return (
    <nav className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 md:px-6">
        <Link to="/" className="flex items-center gap-3">
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-slate-900 text-xs font-bold text-white">
            SB
          </span>
          <span className="text-base font-bold text-slate-900">SkillBridge</span>
        </Link>

        <div className="hidden items-center gap-2 md:flex">
          {isAuthenticated
            ? authLinks.map((link) => (
                <Link
                  key={link.label}
                  to={link.to}
                  className={cn(
                    "rounded-lg px-3 py-2 text-sm font-medium transition",
                    link.active ? "bg-orange-100 text-orange-700" : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                  )}
                >
                  {link.label}
                </Link>
              ))
            : guestLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"
                >
                  {link.label}
                </a>
              ))}
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          {!isAuthenticated ? (
            <>
              <Button asChild variant="secondary" size="sm">
                <Link to="/login">Log In</Link>
              </Button>
              <Button asChild size="sm" className="hidden sm:inline-flex">
                <Link to="/register">Get Started</Link>
              </Button>
            </>
          ) : (
            <>
            <NotificationBell />
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50">
                    <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-orange-100 text-xs font-bold text-orange-700">
                      {(user?.name || "U").slice(0, 1).toUpperCase()}
                    </span>
                    <span className="hidden sm:inline">{user?.name || "User"}</span>
                    <ChevronDown className="h-4 w-4 text-slate-500" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>
                    <div className="flex flex-col">
                      <span className="font-semibold text-slate-900">{user?.name}</span>
                      <span className="text-xs font-normal text-slate-500">{user?.role === "ngo" ? "NGO" : "Volunteer"}</span>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => navigate("/profile")}>Profile</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate("/notifications")}>Notifications</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="text-rose-600 focus:bg-rose-50 focus:text-rose-700">
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
