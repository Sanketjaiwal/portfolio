import { Link } from 'react-router-dom';

export default function Navbar() {
  const sections = ['about', 'projects', 'certificates', 'achievements', 'education', 'skills', 'resume', 'contact'];
  return (
    <header className="navbar">
      <div className="logo">&lt;Portfolio /&gt;</div>
      <nav>
        {sections.map(s => (
          <a key={s} href={`#${s}`}>{s.charAt(0).toUpperCase() + s.slice(1)}</a>
        ))}
        <Link to="/login" style={{ color: 'var(--primary)' }}>Admin</Link>
      </nav>
    </header>
  );
}
