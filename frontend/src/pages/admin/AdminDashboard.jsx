// this is for simple and checking functionality comment-----------
// import { useAuth } from "@/context/AuthContext";
// import { Link } from "react-router-dom";

// export default function AdminDashboard() {
//     const { profile, logout } = useAuth();

//     return (
//         <div>
//             <h1>Admin Dashboard</h1>
//             <p>Welcome, <strong>{profile.name}</strong></p>
//             <p>Role: {profile.role}</p>
//             <hr />
//             <nav>
//                 <li><Link to="/admin/employees">Manage Employees</Link></li>
//                 <li><Link to="/admin/reports/daily">Daily Report</Link></li>
//                 <li><Link to="/admin/reports/weekly">Weekly Report</Link></li>
//             </nav>
//             <br />
//             <button onClick={logout}>Logout</button>
//         </div>
//     )
// }


import { useAuth } from "@/context/AuthContext";
import { Link } from "react-router-dom";

const navItems = [
  {
    to: "/admin/employees",
    label: "Manage Employees",
    description: "View, edit and manage all employee records and schedules.",
    tag: "HR",
    icon: (
      <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
        <circle cx="9" cy="7" r="4"/>
        <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>
      </svg>
    ),
  },
  {
    to: "/admin/reports/daily",
    label: "Daily Report",
    description: "Attendance metrics, punch records, and daily summaries.",
    tag: "Daily",
    icon: (
      <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <rect x="3" y="4" width="18" height="18" rx="2"/>
        <line x1="16" y1="2" x2="16" y2="6"/>
        <line x1="8" y1="2" x2="8" y2="6"/>
        <line x1="3" y1="10" x2="21" y2="10"/>
      </svg>
    ),
  },
  {
    to: "/admin/reports/weekly",
    label: "Weekly Report",
    description: "Aggregated hours, overtime, night diff, late, and undertime.",
    tag: "Weekly",
    icon: (
      <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <line x1="18" y1="20" x2="18" y2="10"/>
        <line x1="12" y1="20" x2="12" y2="4"/>
        <line x1="6" y1="20" x2="6" y2="14"/>
      </svg>
    ),
  },
];

const features = [
  { title: "Time Tracking",          desc: "Employees punch in and out directly from their dashboard." },
  { title: "Auto Computation",       desc: "Regular hours, OT, night diff, late, and undertime computed on punch out." },
  { title: "Night Differential",     desc: "Hours between 10 PM – 6 AM are automatically flagged." },
  { title: "Daily & Weekly Reports", desc: "Per-employee breakdowns by day or aggregated across a full week." },
  { title: "Admin Edits",            desc: "Correct punch times and metrics recompute instantly." },
  { title: "Role Management",        desc: "Assign roles and configure individual shift schedules." },
];

export default function AdminDashboard() {
  const { profile } = useAuth();

  return (
    <div className="min-h-screen bg-stone-50">
      <div className="px-8 py-10 space-y-10">

        {/* ── Demo Banner ── */}
        <div className="flex items-center gap-2.5 bg-blue-50 border border-blue-100 rounded-xl px-4 py-2.5">
          <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse shrink-0" />
          <p className="text-xs font-semibold text-blue-700 tracking-wide">
            MiniHCM — Test Demo Environment
          </p>
          <span className="ml-auto text-[10px] font-bold text-blue-400 border border-blue-200 rounded-full px-2 py-0.5">
            v1.0
          </span>
        </div>

        {/* ── Header ── */}
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-stone-400 mb-2">
            {new Date().toLocaleDateString("en-PH", { weekday: "long", month: "long", day: "numeric", year: "numeric" })}
          </p>
          <h1 className="text-3xl font-bold text-stone-900 tracking-tight mb-1">
            Welcome back, {profile?.name} 👋
          </h1>
          <p className="text-sm text-stone-400">
            You're logged in as{" "}
            <span className="text-stone-700 font-semibold">Administrator</span>.
            Use the sidebar or quick access cards below.
          </p>
        </div>

        <hr className="border-stone-200" />

        {/* ── About ── */}
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-stone-400 mb-4">
            About this System
          </p>
          <div className="bg-white rounded-2xl border border-stone-100 p-6">
            <p className="text-sm text-stone-500 leading-relaxed mb-5">
              <span className="font-bold text-stone-800">MiniHCM</span> is a lightweight Human Capital Management
              system built for small teams. It handles employee time tracking, automated payroll metrics,
              and attendance reporting — all in one place.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {features.map((f, i) => (
                <div key={f.title} className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-lg bg-blue-50 text-blue-500 flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                    {i + 1}
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-stone-700">{f.title}</p>
                    <p className="text-xs text-stone-400 leading-relaxed mt-0.5">{f.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Quick Access ── */}
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-stone-400 mb-4">
            Quick Access
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {navItems.map(({ to, label, description, tag, icon }) => (
              <Link to={to} key={to} className="group">
                <div className="h-full bg-white rounded-2xl border border-stone-100 p-5 hover:border-blue-200 hover:shadow-sm transition-all duration-200">
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-9 h-9 rounded-xl bg-stone-50 group-hover:bg-blue-50 text-stone-400 group-hover:text-blue-500 flex items-center justify-center transition-all duration-200">
                      {icon}
                    </div>
                    <span className="text-[9px] font-semibold uppercase tracking-widest text-stone-300 border border-stone-100 rounded-full px-2 py-0.5">
                      {tag}
                    </span>
                  </div>
                  <p className="text-sm font-semibold text-stone-800 mb-1">{label}</p>
                  <p className="text-xs text-stone-400 leading-relaxed mb-4">{description}</p>
                  <div className="flex items-center gap-1 text-xs text-stone-300 group-hover:text-blue-500 transition-colors font-medium">
                    <span>Open</span>
                    <svg width="11" height="11" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"
                      className="transition-transform group-hover:translate-x-0.5">
                      <path d="M5 12h14M12 5l7 7-7 7"/>
                    </svg>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}