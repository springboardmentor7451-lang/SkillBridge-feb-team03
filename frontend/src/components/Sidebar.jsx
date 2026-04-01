import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Button } from "./ui/button";

export default function Sidebar() {
  const { user, logout } = useAuth();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;
  const oppPath = user?.role === "ngo" ? "/opportunities" : "/browse-opportunities";
  const navItemClass = (active) =>
    `block rounded-lg px-3 py-2 text-sm font-medium transition ${
      active ? "bg-slate-900 text-white" : "text-slate-700 hover:bg-slate-100"
    }`;

  return (
    <aside className="w-full max-w-72 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="mb-6 flex items-center gap-3">
        <div className="grid h-10 w-10 place-items-center rounded-xl bg-slate-900 text-sm font-bold text-white">SB</div>
        <div>
          <p className="text-sm font-semibold text-slate-900">SkillBridge</p>
          <p className="text-xs text-slate-500">Workspace</p>
        </div>
      </div>

      {user && (
        <div className="mb-6 flex items-center gap-3 rounded-xl bg-slate-50 p-3">
          <img
            src={user.avatar || "https://i.pravatar.cc/40"}
            alt="profile"
            className="h-10 w-10 rounded-full object-cover ring-2 ring-white"
          />
          <div>
            <p className="text-sm font-semibold text-slate-900">{user.name}</p>
            <p className="text-xs text-slate-500">{user.role === "ngo" ? "NGO" : "Volunteer"}</p>
          </div>
        </div>
      )}

      <nav className="space-y-1">
        <Link to="/dashboard" className={navItemClass(isActive("/dashboard"))}>Dashboard</Link>
        <Link to={oppPath} className={navItemClass(isActive(oppPath))}>Opportunities</Link>
        <Link to="/applications" className={navItemClass(isActive("/applications"))}>Applications</Link>
        <Link to="/chat" className={navItemClass(isActive("/chat") || isActive("/messages"))}>Messages</Link>
      </nav>

      <div className="mt-6 border-t border-slate-200 pt-4">
        <Button variant="secondary" className="w-full" onClick={logout}>Sign out</Button>
      </div>
    </aside>
  );
}
