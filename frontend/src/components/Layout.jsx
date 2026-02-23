import { useAuth } from "@/context/AuthContext";
import { Link, useLocation, Outlet } from "react-router-dom";

const navItems = [
  {
    to: "/dashboard",
    label: "Dashboard",
    icon: (
      <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
        <polyline points="9 22 9 12 15 12 15 22"/>
      </svg>
    ),
  },
];

export default function Layout() {
  const { profile, logout } = useAuth();
  const location = useLocation();
  const sched = profile?.schedule || { start: "09:00", end: "18:00" };

  return (
    <div className="flex min-h-screen bg-stone-50">

      {/* SIDEBAR */}
      <aside className="w-64 bg-white flex flex-col fixed h-full border-r border-stone-100">

        {/* Brand */}
        <div className="px-6 pt-7 pb-6">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-stone-900 flex items-center justify-center shrink-0">
              <svg width="14" height="14" fill="none" stroke="white" strokeWidth="2.2" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10"/>
                <polyline points="12 6 12 12 16 14"/>
              </svg>
            </div>
            <span className="font-bold text-stone-900 text-sm tracking-tight">MiniHCM</span>
          </div>
        </div>

        {/* User Card */}
        <div className="px-4 mb-5">
          <div className="bg-stone-50 rounded-2xl p-4">
            {/* Avatar + name */}
            <div className="flex items-center gap-3 mb-3">
              <div className="w-9 h-9 rounded-full bg-stone-200 flex items-center justify-center text-sm font-bold text-stone-600 shrink-0">
                {profile?.name?.charAt(0).toUpperCase()}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-stone-800 truncate">{profile?.name}</p>
                <p className="text-xs text-stone-400 truncate">{profile?.email}</p>
              </div>
            </div>

            {/* Role + Schedule */}
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <span className="text-xs text-stone-400">Role</span>
                <span className="text-xs font-semibold text-stone-700 capitalize bg-stone-200 px-2 py-0.5 rounded-full">
                  {profile?.role || "employee"}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-stone-400">Shift</span>
                <span className="text-xs font-semibold text-stone-700 font-mono">
                  {sched.start} – {sched.end}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-4 flex flex-col gap-1">
          {navItems.map(({ to, label, icon }) => {
            const active = location.pathname === to;
            return (
              <Link
                key={to}
                to={to}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all
                  ${active
                    ? "bg-stone-900 text-white"
                    : "text-stone-500 hover:bg-stone-50 hover:text-stone-800"
                  }`}
              >
                <span className={active ? "text-stone-300" : "text-stone-400"}>{icon}</span>
                {label}
              </Link>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="px-4 py-5">
          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm text-stone-400 hover:bg-red-50 hover:text-red-500 transition-all font-medium"
          >
            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
              <polyline points="16 17 21 12 16 7"/>
              <line x1="21" y1="12" x2="9" y2="12"/>
            </svg>
            Sign out
          </button>
        </div>

      </aside>

      {/* MAIN */}
      <main className="flex-1 ml-64 overflow-y-auto">
        <Outlet />
      </main>

    </div>
  );
}