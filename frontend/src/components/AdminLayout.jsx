import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const NAV_ITEMS = [
  { label: 'Dashboard', path: '/admin' },
  { label: 'Employees', path: '/admin/employees' },
  { label: 'Attendance', path: '/admin/attendance' },
  { label: 'Daily Report', path: '/admin/reports/daily' },
  { label: 'Weekly Report', path: '/admin/reports/weekly' },
];

export default function AdminLayout() {
  const { profile, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div style={styles.layout}>
      <aside style={styles.sidebar}>
        <div style={styles.brand}>
          <span style={styles.brandIcon}>⏱</span>
          <span style={styles.brandName}>HCM Admin</span>
        </div>

        <nav style={styles.nav}>
          {NAV_ITEMS.map(item => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/admin'}
              style={({ isActive }) => ({
                ...styles.navItem,
                ...(isActive ? styles.navItemActive : {}),
              })}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div style={styles.userSection}>
          <div style={styles.userName}>{profile?.name}</div>
          <div style={styles.userRole}>Administrator</div>
          <button onClick={handleLogout} style={styles.logoutBtn}>Sign Out</button>
        </div>
      </aside>

      <main style={styles.main}>
        <Outlet />
      </main>
    </div>
  );
}

const styles = {
  layout: { display: 'flex', minHeight: '100vh', fontFamily: 'system-ui, sans-serif' },
  sidebar: {
    width: 220,
    background: '#1e293b',
    color: '#fff',
    display: 'flex',
    flexDirection: 'column',
    padding: '1.5rem 0',
    flexShrink: 0,
  },
  brand: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '0 1.5rem 1.5rem',
    borderBottom: '1px solid #334155',
  },
  brandIcon: { fontSize: '1.5rem' },
  brandName: { fontWeight: 700, fontSize: '1.1rem' },
  nav: { flex: 1, padding: '1rem 0' },
  navItem: {
    display: 'block',
    padding: '0.65rem 1.5rem',
    color: '#94a3b8',
    textDecoration: 'none',
    fontSize: '0.9rem',
    transition: 'background 0.15s',
  },
  navItemActive: {
    color: '#fff',
    background: '#334155',
    borderLeft: '3px solid #3b82f6',
  },
  userSection: {
    padding: '1rem 1.5rem',
    borderTop: '1px solid #334155',
  },
  userName: { fontWeight: 600, fontSize: '0.9rem' },
  userRole: { color: '#64748b', fontSize: '0.75rem', marginBottom: '0.75rem' },
  logoutBtn: {
    width: '100%',
    padding: '0.5rem',
    background: '#334155',
    color: '#94a3b8',
    border: 'none',
    borderRadius: 4,
    cursor: 'pointer',
    fontSize: '0.8rem',
  },
  main: { flex: 1, background: '#f8fafc', overflow: 'auto' },
};