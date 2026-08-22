import { NavLink, useNavigate } from "react-router-dom";
import { LayoutDashboard, BookOpen, Users, LogOut, GraduationCap, Menu, X } from "lucide-react";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";

const navItems = [
  { to: "/", icon: LayoutDashboard, label: "Dashboard", roles: ["STUDENT", "MENTOR"] },
  { to: "/courses", icon: BookOpen, label: "Courses", roles: ["STUDENT"] },
  { to: "/mentor", icon: Users, label: "Students", roles: ["MENTOR"] },
];

export default function MobileNav() {
  const [open, setOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const filteredNav = navItems.filter((item) => item.roles.includes(user?.role ?? ""));

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="border-b border-surface-border bg-white md:hidden">
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-2">
          <GraduationCap className="h-6 w-6 text-brand-600" />
          <span className="font-bold text-slate-900">LearnTrack</span>
        </div>
        <button
          onClick={() => setOpen(!open)}
          className="rounded-lg p-2 text-slate-600 hover:bg-slate-100"
          aria-label="Toggle menu"
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>
      {open && (
        <nav className="border-t border-surface-border px-2 py-2">
          {filteredNav.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              end={to === "/"}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium ${
                  isActive ? "bg-brand-50 text-brand-700" : "text-slate-600"
                }`
              }
            >
              <Icon className="h-5 w-5" />
              {label}
            </NavLink>
          ))}
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-600"
          >
            <LogOut className="h-5 w-5" />
            Sign out
          </button>
        </nav>
      )}
    </div>
  );
}
