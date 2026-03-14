import { NavLink } from 'react-router-dom';
import './Sidebar.css';
import { useAuth } from '../auth/AuthContext';

export default function Sidebar() {
  const { logout } = useAuth();

  const navItems = [
    { to: '/dashboard', label: 'Dashboard', icon: '▢' },
    { to: '/programs', label: 'Program Offerings', icon: '◉' },
    { to: '/subjects', label: 'Subject Offerings', icon: '◇' },
    { to: '/students', label: 'Students Enrolled', icon: '▣' },
    { to: '/courses-offered', label: 'Courses Offered', icon: '▦' },
    { to: '/school-days', label: 'School Days', icon: '▤' },
  ];

  const handleLogout = () => {
    logout();
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="logo">
          <span className="logo-icon">◈</span>
          <span className="logo-text">Enrollment</span>
        </div>
      </div>
      <nav className="sidebar-nav">
        {navItems.map((item, i) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
            style={{ animationDelay: `${i * 0.05}s` }}
          >
            <span className="nav-icon">{item.icon}</span>
            <span className="nav-label">{item.label}</span>
          </NavLink>
        ))}
      </nav>
      <div className="sidebar-footer">
        <button type="button" className="nav-item logout-item" onClick={handleLogout}>
          <span className="nav-icon">⎋</span>
          <span className="nav-label">Logout</span>
        </button>
      </div>
    </aside>
  );
}
