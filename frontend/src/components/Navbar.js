import { Link } from 'react-router-dom';
import { assetUrl } from '../utils/api';

const NAV_SECTIONS = [
  { id: 'about', label: 'Home' },
  { id: 'projects', label: 'Projects' },
  { id: 'certificates', label: 'Certificates' },
  { id: 'achievements', label: 'Achievements' },
  { id: 'education', label: 'Education' },
  { id: 'skills', label: 'Skills' },
  { id: 'resume', label: 'Resume' },
  { id: 'contact', label: 'Contact' },
];

export default function Navbar({ activeSection = 0, onNav, about }) {
  const avatarUrl = assetUrl(about?.avatar);

  return (
    <header className="navbar">
      <div className="navbar-brand">
        {avatarUrl ? (
          <img src={avatarUrl} alt="avatar" className="nav-avatar" />
        ) : (
          <div className="nav-avatar-placeholder">{about?.name?.[0] || 'P'}</div>
        )}
        <span className="logo">{about?.name || <>&lt;Portfolio /&gt;</>}</span>
      </div>

      <nav>
        {NAV_SECTIONS.map((s, i) => (
          <button
            key={s.id}
            className={`nav-btn${activeSection === i ? ' nav-active' : ''}`}
            onClick={() => onNav && onNav(i)}
          >
            {s.label}
            {activeSection === i && <span className="nav-active-bar" />}
          </button>
        ))}
      </nav>

      <Link className="nav-admin-btn" to="/login">Login</Link>
    </header>
  );
}

export { NAV_SECTIONS };
