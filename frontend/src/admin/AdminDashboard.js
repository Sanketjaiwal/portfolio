import { Routes, Route, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FiHome, FiCode, FiAward, FiStar, FiBook, FiLink, FiUser, FiLogOut, FiZap } from 'react-icons/fi';
import AdminAbout from './AdminAbout';
import AdminProjects from './AdminProjects';
import AdminCertificates from './AdminCertificates';
import AdminAchievements from './AdminAchievements';
import AdminEducation from './AdminEducation';
import AdminSocial from './AdminSocial';
import AdminSkills from './AdminSkills';

const navItems = [
  { to: '/admin', label: 'About', icon: FiUser, end: true },
  { to: '/admin/projects', label: 'Projects', icon: FiCode },
  { to: '/admin/certificates', label: 'Certificates', icon: FiAward },
  { to: '/admin/achievements', label: 'Achievements', icon: FiStar },
  { to: '/admin/education', label: 'Education', icon: FiBook },
  { to: '/admin/social', label: 'Social Links', icon: FiLink },
  { to: '/admin/skills', label: 'Skills', icon: FiZap },
];

export default function AdminDashboard() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => { logout(); navigate('/login'); };

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <div className="logo">⚡ Admin Panel</div>
        <nav className="admin-nav">
          {navItems.map(({ to, label, icon: Icon, end }) => (
            <NavLink key={to} to={to} end={end} className={({ isActive }) => isActive ? 'active' : ''}>
              <Icon size={16} /> {label}
            </NavLink>
          ))}
          <a href="/" target="_blank" rel="noreferrer"><FiHome size={16} /> View Site</a>
          <button onClick={handleLogout} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.8rem', padding: '0.8rem 1rem', color: 'var(--secondary)', fontSize: '0.9rem', fontWeight: 500, borderRadius: 10, width: '100%', marginTop: 'auto' }}>
            <FiLogOut size={16} /> Logout
          </button>
        </nav>
      </aside>
      <main className="admin-main">
        <Routes>
          <Route path="/" element={<AdminAbout />} />
          <Route path="/projects" element={<AdminProjects />} />
          <Route path="/certificates" element={<AdminCertificates />} />
          <Route path="/achievements" element={<AdminAchievements />} />
          <Route path="/education" element={<AdminEducation />} />
          <Route path="/social" element={<AdminSocial />} />
          <Route path="/skills" element={<AdminSkills />} />
        </Routes>
      </main>
    </div>
  );
}
