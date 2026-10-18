import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import API from '../utils/api';
import { FiGithub, FiExternalLink, FiMail, FiPhone, FiMapPin } from 'react-icons/fi';
import { FaLinkedin, FaGithub, FaTwitter, FaInstagram, FaYoutube, FaGlobe } from 'react-icons/fa';

const socialIcons = { linkedin: FaLinkedin, github: FaGithub, twitter: FaTwitter, instagram: FaInstagram, youtube: FaYoutube, website: FaGlobe };

export default function Portfolio() {
  const [about, setAbout] = useState(null);
  const [projects, setProjects] = useState([]);
  const [certs, setCerts] = useState([]);
  const [achievements, setAchievements] = useState([]);
  const [education, setEducation] = useState([]);
  const [social, setSocial] = useState([]);
  const [skills, setSkills] = useState([]);

  useEffect(() => {
    API.get('/about').then(r => setAbout(r.data));
    API.get('/projects').then(r => setProjects(r.data));
    API.get('/certificates').then(r => setCerts(r.data));
    API.get('/achievements').then(r => setAchievements(r.data));
    API.get('/education').then(r => setEducation(r.data));
    API.get('/social').then(r => setSocial(r.data));
    API.get('/skills').then(r => setSkills(r.data));
  }, []);

  const grouped = skills.reduce((acc, s) => {
    const cat = s.category || 'General';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(s);
    return acc;
  }, {});

  return (
    <>
      <Navbar />

      {/* Hero */}
      <section className="hero" id="about">
        <div className="hero-content">
          {about?.avatar
            ? <img src={about.avatar} alt="avatar" className="hero-avatar" />
            : <div className="hero-avatar-placeholder">{about?.name?.[0] || 'P'}</div>
          }
          <p className="hero-greeting">👋 Hello, I'm</p>
          <h1>{about?.name || 'Your Name'}</h1>
          <p className="hero-title">{about?.title || 'Full Stack Developer'}</p>
          <p className="hero-bio">{about?.bio || 'Welcome to my portfolio!'}</p>
          <div className="hero-btns">
            {about?.resume && <a href={about.resume} target="_blank" rel="noreferrer" className="btn-primary">Download Resume</a>}
            <a href="#contact" className="btn-outline">Contact Me</a>
          </div>
        </div>
      </section>

      {/* Projects */}
      {projects.length > 0 && (
        <section className="section" id="projects">
          <div className="section-header">
            <div className="section-tag">Portfolio</div>
            <h2 className="section-title">My Projects</h2>
          </div>
          <div className="grid-3">
            {projects.map(p => (
              <div className="card" key={p._id}>
                {p.image && <img src={p.image} alt={p.title} className="card-img" />}
                <h3>{p.title}</h3>
                <p>{p.description}</p>
                {p.techStack?.length > 0 && (
                  <div className="tags">{p.techStack.map(t => <span className="tag" key={t}>{t}</span>)}</div>
                )}
                <div className="card-links">
                  {p.githubUrl && <a href={p.githubUrl} target="_blank" rel="noreferrer" className="card-link"><FiGithub /> Code</a>}
                  {p.liveUrl && <a href={p.liveUrl} target="_blank" rel="noreferrer" className="card-link"><FiExternalLink /> Live</a>}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Certificates */}
      {certs.length > 0 && (
        <section className="section" id="certificates" style={{ background: 'rgba(108,99,255,0.03)' }}>
          <div className="section-header">
            <div className="section-tag">Credentials</div>
            <h2 className="section-title">Certificates</h2>
          </div>
          <div className="grid-3">
            {certs.map(c => (
              <div className="card" key={c._id}>
                {c.image && <img src={c.image} alt={c.title} className="card-img" />}
                <h3>{c.title}</h3>
                <p style={{ color: 'var(--primary)', fontWeight: 500 }}>{c.issuer}</p>
                <p>{c.date}</p>
                {c.credentialUrl && (
                  <a href={c.credentialUrl} target="_blank" rel="noreferrer" className="card-link" style={{ marginTop: '1rem', display: 'inline-flex' }}>
                    <FiExternalLink /> View Credential
                  </a>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Achievements */}
      {achievements.length > 0 && (
        <section className="section" id="achievements">
          <div className="section-header">
            <div className="section-tag">Milestones</div>
            <h2 className="section-title">Achievements</h2>
          </div>
          <div className="grid-2">
            {achievements.map(a => (
              <div className="achievement-card" key={a._id}>
                <div className="achievement-icon">{a.icon || '🏆'}</div>
                <div>
                  <h3>{a.title}</h3>
                  <p style={{ color: 'var(--text2)', marginTop: '0.3rem', fontSize: '0.9rem' }}>{a.description}</p>
                  {a.date && <p style={{ color: 'var(--primary)', fontSize: '0.8rem', marginTop: '0.3rem' }}>{a.date}</p>}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Education */}
      {education.length > 0 && (
        <section className="section" id="education">
          <div className="section-header">
            <div className="section-tag">Background</div>
            <h2 className="section-title">Education</h2>
          </div>
          <div className="timeline">
            {education.map(e => (
              <div className="timeline-item" key={e._id}>
                <h3>{e.degree}</h3>
                <p className="inst">{e.institution}</p>
                <p className="year">{e.year} {e.grade && `• ${e.grade}`}</p>
                {e.description && <p style={{ color: 'var(--text2)', marginTop: '0.5rem', fontSize: '0.9rem' }}>{e.description}</p>}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Skills */}
      {skills.length > 0 && (
        <section className="section" id="skills">
          <div className="section-header">
            <div className="section-tag">Expertise</div>
            <h2 className="section-title">Skills</h2>
          </div>
          {Object.entries(grouped).map(([cat, items]) => (
            <div key={cat} style={{ marginBottom: '2rem' }}>
              <h3 style={{ color: 'var(--primary)', marginBottom: '1rem', fontSize: '1rem' }}>{cat}</h3>
              <div className="skills-grid">
                {items.map(s => (
                  <div className="skill-item" key={s._id}>
                    <div className="skill-header">
                      <span className="skill-name">{s.name}</span>
                      <span className="skill-pct">{s.level}%</span>
                    </div>
                    <div className="skill-bar">
                      <div className="skill-fill" style={{ width: `${s.level}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </section>
      )}

      {/* Social */}
      {social.length > 0 && (
        <section className="section" id="contact">
          <div className="section-header">
            <div className="section-tag">Connect</div>
            <h2 className="section-title">Find Me Online</h2>
          </div>
          <div className="social-grid">
            {social.map(s => {
              const Icon = socialIcons[s.platform?.toLowerCase()] || FaGlobe;
              return (
                <a href={s.url} target="_blank" rel="noreferrer" key={s._id} className="social-card">
                  <span className="social-icon"><Icon /></span>
                  <span className="social-name">{s.platform}</span>
                </a>
              );
            })}
          </div>

          {/* Contact Info */}
          {about && (
            <div style={{ display: 'flex', gap: '2rem', justifyContent: 'center', marginTop: '3rem', flexWrap: 'wrap' }}>
              {about.email && <div className="social-card"><FiMail /><span>{about.email}</span></div>}
              {about.phone && <div className="social-card"><FiPhone /><span>{about.phone}</span></div>}
              {about.location && <div className="social-card"><FiMapPin /><span>{about.location}</span></div>}
            </div>
          )}
        </section>
      )}

      <footer className="footer">
        <p>© {new Date().getFullYear()} {about?.name || 'Portfolio'}. Built with ❤️ using MERN Stack</p>
      </footer>
    </>
  );
}
