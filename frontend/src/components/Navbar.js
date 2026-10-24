const NAV_SECTIONS = [
  { id: 'about',        label: 'Home' },
  { id: 'projects',     label: 'Projects' },
  { id: 'certificates', label: 'Certificates' },
  { id: 'achievements', label: 'Achievements' },
  { id: 'education',    label: 'Education' },
  { id: 'skills',       label: 'Skills' },
  { id: 'resume',       label: 'Resume' },
  { id: 'contact',      label: 'Contact' },
];

const BASE = 'https://portfolio-backend-bbfj.onrender.com/api';
const toUrl = (p) => p ? (p.startsWith('http') ? p : `${BASE}${p}`) : null;

export default function Navbar({ activeSection = 0, onNav, about }) {
  const avatarUrl = toUrl(about?.avatar);
  return (
    <header className="navbar">
      <div className="navbar-brand">
        {avatarUrl
          ? <img src={avatarUrl} alt="avatar" className="nav-avatar" />
          : <div className="nav-avatar-placeholder">{about?.name?.[0] || 'P'}</div>
        }
        <span className="logo">{about?.name || <>&lt;Portfolio /&gt;</>}</span>
      </div>
      <nav>
        {NAV_SECTIONS.map((s, i) => (
          <button
            key={s.id}
            className={`nav-btn${activeSection === i ? ' nav-active' : ''}`}
            onClick={() => onNav(i)}
          >
            {s.label}
            {activeSection === i && <span className="nav-active-bar" />}
          </button>
        ))}
      </nav>
    </header>
  );
}

export { NAV_SECTIONS };
