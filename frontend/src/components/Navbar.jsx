import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import NotificationBell from "./NotificationBell";
import ThemeSelector from "./ThemeSelector";
import { cn } from "../lib/utils";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import userService from "../services/userService";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { ChevronDown } from "lucide-react";

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteConfirmationText, setDeleteConfirmationText] = useState("");

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const handleDeleteAccount = async () => {
    if (deleteConfirmationText !== "DELETE") {
      toast.error('Type DELETE to confirm account deletion');
      return;
    }

    try {
      await userService.deleteAccount();
      toast.success("Account deleted successfully");
      setDeleteDialogOpen(false);
      setDeleteConfirmationText("");
      logout();
      navigate("/");
    } catch (error) {
      toast.error(error.response?.data?.message || "Could not delete account");
    }
  };

  const isActive = (path) => location.pathname === path;

  const handleGuestNavigation = (href) => {
    if (href === "/") {
      if (location.pathname !== "/") {
        navigate("/");
        return;
      }
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    if (location.pathname !== "/") {
      navigate(`/${href}`);
      return;
    }

    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const guestLinks = [
    { label: "Home", href: "/" },
    { label: "How it Works", href: "#how" },
    { label: "Features", href: "#features" },
    { label: "Impact", href: "#impact" },
    { label: "Contact", href: "#contact" },
    // { label: "For NGOs", href: "#for-ngos" },
  ];

  const authLinks = [
    { label: "Dashboard", to: "/dashboard", active: isActive("/dashboard") },
    {
      label: "Opportunities",
      to: user?.role === "ngo" ? "/opportunities" : "/browse-opportunities",
      active: isActive("/opportunities") || isActive("/browse-opportunities"),
    },
    ...(user?.role === "volunteer"
      ? [
          { label: "Matches", to: "/matches", active: isActive("/matches") },
          { label: "Browse NGOs", to: "/browse-ngos", active: isActive("/browse-ngos") },
        ]
      : [
          { label: "Browse Volunteers", to: "/browse-volunteers", active: isActive("/browse-volunteers") },
        ]
    ),
    { label: "Applications", to: "/applications", active: isActive("/applications") },
    { label: "Message", to: "/chat", active: isActive("/chat") || isActive("/messages") },
  ];

  return (
    <nav className="sticky top-0 z-40 overflow-hidden border-b border-slate-200/80 bg-gradient-to-r from-white/95 via-orange-50/70 to-sky-50/70 backdrop-blur">
      <div className="pointer-events-none absolute -left-10 top-0 h-16 w-24 rounded-full bg-orange-200/35 blur-2xl" />
      <div className="pointer-events-none absolute right-8 top-0 h-16 w-24 rounded-full bg-cyan-200/35 blur-2xl" />

      <div className="relative z-10 mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 md:px-6">
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
                <button
                  key={link.label}
                  type="button"
                  onClick={() => handleGuestNavigation(link.href)}
                  className="rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"
                >
                  {link.label}
                </button>
              ))}
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <ThemeSelector />
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
                  <DropdownMenuItem onClick={() => setDeleteDialogOpen(true)} className="text-rose-600 focus:bg-rose-50 focus:text-rose-700">
                    Delete Account
                  </DropdownMenuItem>
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

      <Dialog
        open={deleteDialogOpen}
        onOpenChange={(open) => {
          setDeleteDialogOpen(open);
          if (!open) setDeleteConfirmationText("");
        }}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Delete Account</DialogTitle>
            <DialogDescription>
              This action is permanent. All of your profile data, conversations, and activity will be removed.
            </DialogDescription>
          </DialogHeader>

          <div className="mt-4 space-y-2">
            <p className="text-sm font-medium text-slate-700">
              Type <span className="font-semibold text-slate-900">DELETE</span> to confirm.
            </p>
            <Input
              value={deleteConfirmationText}
              onChange={(e) => setDeleteConfirmationText(e.target.value)}
              placeholder="DELETE"
              autoComplete="off"
            />
          </div>

          <DialogFooter className="mt-6">
            <Button variant="secondary" type="button" onClick={() => setDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleDeleteAccount}
              className="bg-rose-600 text-white hover:bg-rose-700"
            >
              Delete Account
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </nav>
  );
}
