import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  BookOpen,
  Users,
  LogOut,
  GraduationCap,
  Download,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import api from "../lib/api";

const navItems = [
  { to: "/", icon: LayoutDashboard, label: "Dashboard", roles: ["STUDENT", "MENTOR"] },
  { to: "/courses", icon: BookOpen, label: "Courses", roles: ["STUDENT"] },
  { to: "/mentor", icon: Users, label: "Students", roles: ["MENTOR"] },
];

export default function Sidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleExport = async () => {
    try {
      const res = await api.get("/export/progress", { responseType: "blob" });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const a = document.createElement("a");
      a.href = url;
      a.download = "learning-progress.csv";
      a.click();
      window.URL.revokeObjectURL(url);
    } catch {
      alert("Export failed. Please try again.");
    }
  };

  const filteredNav = navItems.filter((item) => item.roles.includes(user?.role ?? ""));

  return (
    <aside className="hidden w-64 flex-shrink-0 flex-col bg-brand-950 text-white md:flex">
      <div className="flex items-center gap-3 border-b border-white/10 px-6 py-5">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-500">
          <GraduationCap className="h-6 w-6" />
        </div>
        <div>
          <h1 className="text-lg font-bold tracking-tight">LearnTrack</h1>
          <p className="text-xs text-brand-300">Progress Dashboard</p>
        </div>
      </div>

      <nav className="flex-1 space-y-1 px-3 py-4">
        {filteredNav.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === "/"}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition ${
                isActive
                  ? "bg-brand-600 text-white"
                  : "text-brand-200 hover:bg-white/10 hover:text-white"
              }`
            }
          >
            <Icon className="h-5 w-5" />
            {label}
          </NavLink>
        ))}

        {user?.role === "STUDENT" && (
          <button
            onClick={handleExport}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-brand-200 transition hover:bg-white/10 hover:text-white"
          >
            <Download className="h-5 w-5" />
            Export CSV
          </button>
        )}
      </nav>

      <div className="border-t border-white/10 p-4">
        <div className="mb-3 rounded-lg bg-white/5 px-3 py-2">
          <p className="truncate text-sm font-medium">{user?.name}</p>
          <p className="truncate text-xs text-brand-300">{user?.email}</p>
          <span className="mt-1 inline-block rounded-full bg-brand-500/30 px-2 py-0.5 text-xs capitalize text-brand-200">
            {user?.role?.toLowerCase()}
          </span>
        </div>
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-brand-300 transition hover:bg-white/10 hover:text-white"
        >
          <LogOut className="h-4 w-4" />
          Sign out
        </button>
      </div>
    </aside>
  );
}
