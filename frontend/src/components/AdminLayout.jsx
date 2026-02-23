import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';

const NAV_ITEMS = [
  { label: 'Dashboard',     path: '/admin/dashboard',       icon: <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg> },
  { label: 'Employees',     path: '/admin/employees',       icon: <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg> },
  { label: 'Daily Report',  path: '/admin/reports/daily',   icon: <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg> },
  { label: 'Weekly Report', path: '/admin/reports/weekly',  icon: <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg> },
];

export default function AdminLayout() {
  const { profile, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    toast.success('Signed out successfully.');
    await logout();
    navigate('/login');
  };

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
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-stone-200 flex items-center justify-center text-sm font-bold text-stone-600 shrink-0">
                {profile?.name?.charAt(0).toUpperCase()}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-stone-800 truncate">{profile?.name}</p>
                <p className="text-xs text-stone-400 truncate">{profile?.email}</p>
              </div>
            </div>
            <div className="mt-3 flex items-center justify-between">
              <span className="text-xs text-stone-400">Role</span>
              <span className="text-xs font-semibold text-stone-700 bg-stone-200 px-2 py-0.5 rounded-full">
                Administrator
              </span>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-4 flex flex-col gap-1">
          <p className="text-xs font-semibold uppercase tracking-widest text-stone-400 px-3 mb-2">Menu</p>
          {NAV_ITEMS.map(({ label, path, icon }) => (
            <NavLink
              key={path}
              to={path}
              end={path === '/admin/dashboard'}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all
                ${isActive
                  ? "bg-stone-900 text-white"
                  : "text-stone-500 hover:bg-stone-50 hover:text-stone-800"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <span className={isActive ? "text-stone-300" : "text-stone-400"}>{icon}</span>
                  {label}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Logout */}
        <div className="px-4 py-5">
          <button
            onClick={handleLogout}
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
      <main className="flex-1 ml-64 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}