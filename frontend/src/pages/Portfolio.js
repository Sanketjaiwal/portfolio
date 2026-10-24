import { useEffect, useState, useRef, useCallback } from 'react';
import Navbar from '../components/Navbar';
import API from '../utils/api';
import { FiGithub, FiExternalLink, FiMail, FiPhone, FiMapPin, FiEye, FiX, FiFileText, FiChevronDown, FiChevronUp, FiPlay } from 'react-icons/fi';
import { FaLinkedin, FaGithub, FaTwitter, FaInstagram, FaYoutube, FaGlobe } from 'react-icons/fa';

const BASE = 'https://portfolio-backend-bbfj.onrender.com/api';
const socialIcons = { linkedin: FaLinkedin, github: FaGithub, twitter: FaTwitter, instagram: FaInstagram, youtube: FaYoutube, website: FaGlobe };
const toUrl = (p) => p ? (p.startsWith('http') ? p : `${BASE}${p}`) : null;

const DOT_LABELS = ['Home','Projects','Certificates','Achievements','Education','Skills','Resume','Contact'];

const CODE_SYMBOLS = ['</>','{}','[]','()','&&','||','=>','===','!==','++','--','**','//','if','for','fn','var','let','const','async','await','null','true','false','return','import','export','class','new'];

const SECTION_BG = [
  'radial-gradient(ellipse at 20% 50%,rgba(108,99,255,0.13) 0%,transparent 65%), radial-gradient(ellipse at 80% 20%,rgba(0,212,255,0.08) 0%,transparent 55%)',
  'radial-gradient(ellipse at 80% 60%,rgba(108,99,255,0.09) 0%,transparent 60%)',
  'radial-gradient(ellipse at 20% 40%,rgba(0,212,255,0.07) 0%,transparent 60%)',
  'radial-gradient(ellipse at 70% 30%,rgba(0,255,136,0.06) 0%,transparent 60%)',
  'radial-gradient(ellipse at 30% 70%,rgba(108,99,255,0.09) 0%,transparent 60%)',
  'radial-gradient(ellipse at 60% 40%,rgba(0,212,255,0.07) 0%,transparent 60%)',
  'radial-gradient(ellipse at 40% 60%,rgba(108,99,255,0.08) 0%,transparent 60%)',
  'radial-gradient(ellipse at 50% 50%,rgba(0,255,136,0.06) 0%,transparent 60%)',
];

/* Syntax loader lines shown per section */
const LOADER_LINES = [
  ['import React from "react"', 'const hero = () => <Home />', 'export default hero'],
  ['fetch("/api/projects")', 'const data = await res.json()', 'render(<Projects />)'],
  ['GET /api/certificates', 'status: 200 OK', 'parsing credentials...'],
  ['🏆 loading achievements', 'const wins = data.filter()', 'mounted successfully'],
  ['SELECT * FROM education', 'ORDER BY year DESC', 'rendering timeline...'],
  ['skills.map(s => <Bar />)', 'animate(proficiency)', 'skills loaded ✓'],
  ['readFile("resume.pdf")', 'Content-Type: application/pdf', 'iframe ready'],
  ['connecting socials...', 'links.forEach(render)', 'contact mounted ✓'],
];

/* ── Animated background ── */
function AnimatedBg({ index }) {
  const symbols = useRef([]);
  if (symbols.current.length === 0) {
    for (let i = 0; i < 18; i++) {
      symbols.current.push({
        text: CODE_SYMBOLS[Math.floor(Math.random() * CODE_SYMBOLS.length)],
        left: `${Math.random() * 95}%`,
        delay: `${Math.random() * 12}s`,
        duration: `${8 + Math.random() * 14}s`,
        opacity: 0.07 + Math.random() * 0.13,
        size: `${0.65 + Math.random() * 0.5}rem`,
      });
    }
  }
  return (
    <div className="bg-canvas">
      <div className="orb orb-1" />
      <div className="orb orb-2" />
      <div className="orb orb-3" />
      {symbols.current.map((s, i) => (
        <span key={i} className="code-symbol" style={{
          left: s.left, top: '-60px',
          animationDelay: s.delay, animationDuration: s.duration,
          opacity: s.opacity, fontSize: s.size,
          color: i % 3 === 0 ? 'var(--primary)' : i % 3 === 1 ? 'var(--accent)' : 'var(--accent2)',
        }}>{s.text}</span>
      ))}
      {['React','Node.js','MongoDB','TypeScript','Python','Git','Docker','AWS'].map((t, i) => (
        <span key={t} className="float-icon" style={{
          top: `${10 + (i * 11) % 80}%`,
          left: i % 2 === 0 ? `${2 + (i * 7) % 8}%` : `${88 + (i * 3) % 8}%`,
          animationDuration: `${4 + i * 0.7}s`,
          animationDelay: `${i * 0.5}s`,
          opacity: 0.15 + (i % 3) * 0.06,
        }}>{t}</span>
      ))}
    </div>
  );
}

/* ── Syntax loader overlay ── */
function SyntaxLoader({ section, onDone }) {
  const [lineIdx, setLineIdx] = useState(0);
  const lines = LOADER_LINES[section] || LOADER_LINES[0];

  useEffect(() => {
    setLineIdx(0);
    const iv = setInterval(() => {
      setLineIdx(p => {
        if (p >= lines.length - 1) { clearInterval(iv); setTimeout(onDone, 280); return p; }
        return p + 1;
      });
    }, 320);
    return () => clearInterval(iv);
  }, [section]); // eslint-disable-line

  return (
    <div className="syntax-loader">
      <div className="syntax-box">
        <div className="syntax-bar">
          <span /><span /><span />
          <span style={{ marginLeft:'auto', fontSize:'0.7rem', opacity:0.5 }}>loading.js</span>
        </div>
        <div className="syntax-lines">
          {lines.map((l, i) => (
            <div key={i} className={`syntax-line${i <= lineIdx ? ' visible' : ''}`}>
              <span className="syn-num">{i + 1}</span>
              <span className="syn-code">{l}</span>
              {i === lineIdx && <span className="syn-cursor" />}
            </div>
          ))}
        </div>
        <div className="syntax-progress">
          <div className="syntax-progress-fill" style={{ width: `${((lineIdx + 1) / lines.length) * 100}%` }} />
        </div>
      </div>
    </div>
  );
}

/* ── Hero intro: photo scan animation ── */
function HeroIntro({ avatarUrl, name, onDone }) {
  const [phase, setPhase] = useState(0); // 0=scan, 1=reveal, 2=done

  useEffect(() => {
    const t1 = setTimeout(() => setPhase(1), 1400);
    const t2 = setTimeout(() => { setPhase(2); onDone(); }, 2400);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []); // eslint-disable-line

  if (phase === 2) return null;

  return (
    <div className={`hero-intro${phase === 1 ? ' fade-out' : ''}`}>
      <div className="intro-scan-wrap">
        <div className="intro-photo-frame">
          {avatarUrl
            ? <img src={avatarUrl} alt={name} className="intro-photo" />
            : <div className="intro-photo-placeholder">{name?.[0] || 'P'}</div>
          }
          <div className="scan-line" />
          <div className="scan-corners">
            <span /><span /><span /><span />
          </div>
        </div>
        <div className="intro-text">
          <span className="intro-tag">{'> IDENTIFYING...'}</span>
          <span className="intro-name">{name || 'Developer'}</span>
          <span className="intro-tag intro-ok">{'✓ PROFILE LOADED'}</span>
        </div>
      </div>
    </div>
  );
}

/* ── Video Modal ── */
function VideoModal({ url, title, onClose }) {
  const isLocal = url.includes('/uploads/');
  const yt = !isLocal && url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([-\w]+)/);
  const embed = yt ? `https://www.youtube.com/embed/${yt[1]}?autoplay=1` : url;

  return (
    <div onClick={onClose} style={{ position:'fixed',inset:0,background:'rgba(0,0,0,0.92)',zIndex:9999,display:'flex',alignItems:'center',justifyContent:'center',padding:'1rem' }}>
      <div onClick={e => e.stopPropagation()} style={{ width:'100%',maxWidth:860,background:'var(--card)',borderRadius:16,border:'1px solid var(--border)',overflow:'hidden' }}>
        <div style={{ display:'flex',alignItems:'center',justifyContent:'space-between',padding:'0.9rem 1.4rem',borderBottom:'1px solid var(--border)' }}>
          <span style={{ fontWeight:600,display:'flex',alignItems:'center',gap:'0.5rem' }}><FiPlay color="var(--primary)" />{title}</span>
          <button onClick={onClose} style={{ background:'none',border:'none',color:'var(--text)',cursor:'pointer' }}><FiX size={20}/></button>
        </div>
        {isLocal
          ? <video src={url} controls autoPlay style={{ width:'100%',maxHeight:480,background:'#000',display:'block' }} />
          : <iframe src={embed} title={title} width="100%" height="460" allow="autoplay; encrypted-media" allowFullScreen style={{ display:'block',border:'none' }} />
        }
      </div>
    </div>
  );
}

/* ── PDF Modal ── */
function PdfModal({ url, title, onClose }) {
  return (
    <div style={{ position:'fixed',inset:0,background:'rgba(0,0,0,0.88)',zIndex:9999,display:'flex',alignItems:'center',justifyContent:'center',padding:'1rem' }}>
      <div style={{ width:'100%',maxWidth:900,background:'var(--card)',borderRadius:16,border:'1px solid var(--border)',overflow:'hidden' }}>
        <div style={{ display:'flex',alignItems:'center',justifyContent:'space-between',padding:'1rem 1.5rem',borderBottom:'1px solid var(--border)' }}>
          <span style={{ fontWeight:600 }}>{title}</span>
          <button onClick={onClose} style={{ background:'none',border:'none',color:'var(--text)',cursor:'pointer' }}><FiX size={20}/></button>
        </div>
        <iframe src={url} title={title} width="100%" height="600px" style={{ display:'block',border:'none' }}/>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════ */
export default function Portfolio() {
  const [about, setAbout] = useState(null);
  const [projects, setProjects] = useState([]);
  const [certs, setCerts] = useState([]);
  const [achievements, setAchievements] = useState([]);
  const [education, setEducation] = useState([]);
  const [social, setSocial] = useState([]);
  const [skills, setSkills] = useState([]);
  const [pdfModal, setPdfModal] = useState(null);
  const [videoModal, setVideoModal] = useState(null);

  const [activeSection, setActiveSection] = useState(0);
  const [loading, setLoading] = useState(false);       // syntax loader visible
  const [frameReady, setFrameReady] = useState(true);  // content visible
  const [showIntro, setShowIntro] = useState(true);    // hero intro overlay
  const isNavigating = useRef(false);

  // Lock body scroll for frame-based portfolio
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  useEffect(() => {
    API.get('/about').then(r => { if (r.data) setAbout(r.data); }).catch(() => {});
    API.get('/projects').then(r => setProjects(r.data || [])).catch(() => {});
    API.get('/certificates').then(r => setCerts(r.data || [])).catch(() => {});
    API.get('/achievements').then(r => setAchievements(r.data || [])).catch(() => {});
    API.get('/education').then(r => setEducation(r.data || [])).catch(() => {});
    API.get('/social').then(r => setSocial(r.data || [])).catch(() => {});
    API.get('/skills').then(r => setSkills(r.data || [])).catch(() => {});
  }, []);

  const goTo = useCallback((i) => {
    if (i === activeSection || isNavigating.current) return;
    isNavigating.current = true;
    setFrameReady(false);
    setLoading(true);
  }, [activeSection]);

  /* called when syntax loader finishes */
  const onLoaderDone = useCallback(() => {
    setLoading(false);
    setActiveSection(prev => {
      // we stored target in ref
      return pendingSection.current ?? prev;
    });
    setFrameReady(true);
    isNavigating.current = false;
  }, []);

  const pendingSection = useRef(null);

  const navigateTo = useCallback((i) => {
    if (i === activeSection || isNavigating.current) return;
    pendingSection.current = i;
    goTo(i);
  }, [activeSection, goTo]);

  const grouped = skills.reduce((acc, s) => {
    const cat = s.category || 'General';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(s);
    return acc;
  }, {});

  const avatarUrl = toUrl(about?.avatar);
  const photoUrl = toUrl(about?.photo) || avatarUrl;  // portrait for hero, fallback to avatar
  const resumeUrl = toUrl(about?.resume);

  /* ── Keyboard & wheel navigation ── */
  useEffect(() => {
    let wheelCooldown = false;
    const onWheel = (e) => {
      if (wheelCooldown || isNavigating.current) return;
      wheelCooldown = true;
      setTimeout(() => { wheelCooldown = false; }, 900);
      if (e.deltaY > 30 && activeSection < 7) navigateTo(activeSection + 1);
      else if (e.deltaY < -30 && activeSection > 0) navigateTo(activeSection - 1);
    };
    const onKey = (e) => {
      if (e.key === 'ArrowDown' && activeSection < 7) navigateTo(activeSection + 1);
      if (e.key === 'ArrowUp' && activeSection > 0) navigateTo(activeSection - 1);
    };
    window.addEventListener('wheel', onWheel, { passive: true });
    window.addEventListener('keydown', onKey);
    return () => { window.removeEventListener('wheel', onWheel); window.removeEventListener('keydown', onKey); };
  }, [activeSection, navigateTo]);

  /* ── Touch swipe ── */
  useEffect(() => {
    let startY = 0;
    const onTouchStart = (e) => { startY = e.touches[0].clientY; };
    const onTouchEnd = (e) => {
      const diff = startY - e.changedTouches[0].clientY;
      if (diff > 50 && activeSection < 7) navigateTo(activeSection + 1);
      if (diff < -50 && activeSection > 0) navigateTo(activeSection - 1);
    };
    window.addEventListener('touchstart', onTouchStart);
    window.addEventListener('touchend', onTouchEnd);
    return () => { window.removeEventListener('touchstart', onTouchStart); window.removeEventListener('touchend', onTouchEnd); };
  }, [activeSection, navigateTo]);

  const frameClass = `frame${frameReady ? ' frame-in' : ' frame-out'}`;

  return (
    <>
      {showIntro && about && (
        <HeroIntro avatarUrl={avatarUrl} name={about?.name} onDone={() => setShowIntro(false)} />
      )}

      <Navbar activeSection={activeSection} onNav={navigateTo} about={about} />

      {/* Side dot nav */}
      <div className="dot-nav">
        {DOT_LABELS.map((label, i) => (
          <button key={i} className={activeSection === i ? 'active' : ''} onClick={() => navigateTo(i)}>
            <span className="dot-label">{label}</span>
          </button>
        ))}
      </div>

      {/* Arrow nav */}
      <div className="frame-arrows">
        {activeSection > 0 && (
          <button className="frame-arrow up" onClick={() => navigateTo(activeSection - 1)}><FiChevronUp /></button>
        )}
        {activeSection < 7 && (
          <button className="frame-arrow down" onClick={() => navigateTo(activeSection + 1)}><FiChevronDown /></button>
        )}
      </div>

      {pdfModal && <PdfModal url={pdfModal.url} title={pdfModal.title} onClose={() => setPdfModal(null)} />}
      {videoModal && <VideoModal url={videoModal.url} title={videoModal.title} onClose={() => setVideoModal(null)} />}

      {/* Syntax loader */}
      {loading && (
        <SyntaxLoader section={pendingSection.current ?? activeSection} onDone={onLoaderDone} />
      )}

      {/* Full-page frame */}
      <div className="frame-container" style={{ background: SECTION_BG[activeSection] }}>
        <AnimatedBg index={activeSection} />

        {/* ── 0: Hero ── */}
        {activeSection === 0 && (
          <div className={`frame hero-frame ${frameClass}`}>
            <div className="hero-layout">
              {/* Left: big photo */}
              <div className="hero-photo-side">
                <div className="hero-photo-wrap">
                  {photoUrl
                    ? <img src={photoUrl} alt="avatar" className="hero-photo-big" />
                    : <div className="hero-photo-placeholder">{about?.name?.[0] || 'P'}</div>
                  }
                  <div className="hero-photo-ring" />
                  <div className="hero-photo-ring ring2" />
                  <div className="hero-photo-glow" />
                  {/* floating code tags around photo */}
                  <span className="photo-tag tag-tl">{'<Developer />'}</span>
                  <span className="photo-tag tag-br">{'{ skills: ∞ }'}</span>
                  <span className="photo-tag tag-tr">{'// building'}</span>
                </div>
              </div>
              {/* Right: text */}
              <div className="hero-text-side">
                <p className="hero-greeting">👋 Hello, I'm</p>
                <h1 className="hero-name">{about?.name || 'Your Name'}</h1>
                <p className="hero-title-typed">{about?.title || 'Full Stack Developer'}</p>
                <p className="hero-bio">{about?.bio || 'Welcome to my portfolio!'}</p>
                <div className="hero-btns">
                  {resumeUrl && (
                    <button onClick={() => navigateTo(6)} className="btn-primary" style={{ border:'none',cursor:'pointer',display:'inline-flex',alignItems:'center',gap:'0.5rem' }}>
                      <FiEye /> View Resume
                    </button>
                  )}
                  <button onClick={() => navigateTo(7)} className="btn-outline" style={{ cursor:'pointer' }}>
                    Contact Me
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── 1: Projects ── */}
        {activeSection === 1 && (
          <div className={`frame ${frameClass}`}>
            <div className="frame-inner">
              <div className="section-header">
                <div className="section-tag">Portfolio</div>
                <h2 className="section-title">My Projects</h2>
              </div>
              {projects.length === 0
                ? <p style={{ textAlign:'center',color:'var(--text2)' }}>No projects added yet.</p>
                : <div className="grid-3">
                    {projects.map(p => (
                      <div className="card" key={p._id}>
                        {p.image && <img src={toUrl(p.image)} alt={p.title} className="card-img" />}
                        <h3>{p.title}</h3>
                        <p>{p.description}</p>
                        {p.techStack?.length > 0 && <div className="tags">{p.techStack.map(t => <span className="tag" key={t}>{t}</span>)}</div>}
                        <div className="card-links">
                          {p.githubUrl && <a href={p.githubUrl} target="_blank" rel="noreferrer" className="card-link"><FiGithub /> Code</a>}
                          {p.liveUrl && <a href={p.liveUrl} target="_blank" rel="noreferrer" className="card-link"><FiExternalLink /> Live</a>}
                          {p.demoVideoUrl && (
                            <button onClick={() => setVideoModal({ url: toUrl(p.demoVideoUrl), title: p.title })} className="card-link" style={{ background:'none',border:'none',cursor:'pointer',padding:0,color:'var(--primary)',display:'inline-flex',alignItems:'center',gap:'0.3rem' }}>
                              <FiPlay size={13}/> Demo Video
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
              }
            </div>
          </div>
        )}

        {/* ── 2: Certificates ── */}
        {activeSection === 2 && (
          <div className={`frame ${frameClass}`}>
            <div className="frame-inner">
              <div className="section-header">
                <div className="section-tag">Credentials</div>
                <h2 className="section-title">Certificates</h2>
              </div>
              {certs.length === 0
                ? <p style={{ textAlign:'center',color:'var(--text2)' }}>No certificates added yet.</p>
                : <div className="grid-3">
                    {certs.map(c => (
                      <div className="card" key={c._id}>
                        {c.image
                          ? <img src={toUrl(c.image)} alt={c.title} className="card-img" />
                          : c.file && (
                            <div style={{ height:160,background:'rgba(108,99,255,0.07)',borderRadius:10,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',gap:'0.5rem',marginBottom:'1rem',border:'1px dashed var(--border)' }}>
                              <FiFileText size={36} color="var(--primary)" />
                              <span style={{ color:'var(--text2)',fontSize:'0.82rem' }}>PDF Certificate</span>
                            </div>
                          )
                        }
                        <h3>{c.title}</h3>
                        <p style={{ color:'var(--primary)',fontWeight:500 }}>{c.issuer}</p>
                        <p style={{ color:'var(--text2)',fontSize:'0.83rem' }}>{c.date}</p>
                        <div className="card-links" style={{ marginTop:'1rem',flexWrap:'wrap' }}>
                          {c.file && (
                            <button onClick={() => setPdfModal({ url:toUrl(c.file),title:c.title })}
                              className="card-link" style={{ background:'none',border:'none',cursor:'pointer',padding:0,color:'var(--text2)' }}>
                              <FiEye /> View PDF
                            </button>
                          )}
                          {c.credentialUrl && <a href={c.credentialUrl} target="_blank" rel="noreferrer" className="card-link"><FiExternalLink /> Credential</a>}
                        </div>
                      </div>
                    ))}
                  </div>
              }
            </div>
          </div>
        )}

        {/* ── 3: Achievements ── */}
        {activeSection === 3 && (
          <div className={`frame ${frameClass}`}>
            <div className="frame-inner">
              <div className="section-header">
                <div className="section-tag">Milestones</div>
                <h2 className="section-title">Achievements</h2>
              </div>
              {achievements.length === 0
                ? <p style={{ textAlign:'center',color:'var(--text2)' }}>No achievements added yet.</p>
                : <div className="grid-2">
                    {achievements.map(a => (
                      <div className="achievement-card" key={a._id}>
                        <div className="achievement-icon">{a.icon || '🏆'}</div>
                        <div>
                          <h3>{a.title}</h3>
                          <p style={{ color:'var(--text2)',marginTop:'0.3rem',fontSize:'0.88rem' }}>{a.description}</p>
                          {a.date && <p style={{ color:'var(--primary)',fontSize:'0.78rem',marginTop:'0.3rem' }}>{a.date}</p>}
                        </div>
                      </div>
                    ))}
                  </div>
              }
            </div>
          </div>
        )}

        {/* ── 4: Education ── */}
        {activeSection === 4 && (
          <div className={`frame ${frameClass}`}>
            <div className="frame-inner">
              <div className="section-header">
                <div className="section-tag">Background</div>
                <h2 className="section-title">Education</h2>
              </div>
              {education.length === 0
                ? <p style={{ textAlign:'center',color:'var(--text2)' }}>No education added yet.</p>
                : <div className="timeline">
                    {education.map(e => (
                      <div className="timeline-item" key={e._id}>
                        <h3>{e.degree}</h3>
                        <p className="inst">{e.institution}</p>
                        <p className="year">{e.year}{e.grade && ` • ${e.grade}`}</p>
                        {e.description && <p style={{ color:'var(--text2)',marginTop:'0.5rem',fontSize:'0.88rem' }}>{e.description}</p>}
                      </div>
                    ))}
                  </div>
              }
            </div>
          </div>
        )}

        {/* ── 5: Skills ── */}
        {activeSection === 5 && (
          <div className={`frame ${frameClass}`}>
            <div className="frame-inner">
              <div className="section-header">
                <div className="section-tag">Expertise</div>
                <h2 className="section-title">Skills</h2>
              </div>
              {skills.length === 0
                ? <p style={{ textAlign:'center',color:'var(--text2)' }}>No skills added yet.</p>
                : Object.entries(grouped).map(([cat, items]) => (
                    <div key={cat} style={{ marginBottom:'2rem' }}>
                      <h3 style={{ color:'var(--primary)',marginBottom:'1rem',fontSize:'0.9rem',letterSpacing:'1px',textTransform:'uppercase' }}>{cat}</h3>
                      <div className="skills-grid">
                        {items.map(s => (
                          <div className="skill-item" key={s._id}>
                            <div className="skill-header">
                              <span className="skill-name">{s.name}</span>
                              <span className="skill-pct">{s.level}%</span>
                            </div>
                            <div className="skill-bar">
                              <div className="skill-fill" style={{ width:`${s.level}%` }} />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))
              }
            </div>
          </div>
        )}

        {/* ── 6: Resume ── */}
        {activeSection === 6 && (
          <div className={`frame ${frameClass}`}>
            <div className="frame-inner">
              <div className="section-header">
                <div className="section-tag">Resume</div>
                <h2 className="section-title">My Resume</h2>
              </div>
              {resumeUrl
                ? <>
                    <div style={{ borderRadius:16,overflow:'hidden',border:'1px solid var(--border)',boxShadow:'0 0 40px rgba(108,99,255,0.15)' }}>
                      <iframe src={resumeUrl} title="Resume" width="100%" height="480px" style={{ display:'block',border:'none',background:'#fff' }} />
                    </div>
                    <div style={{ display:'flex',justifyContent:'center',marginTop:'1.5rem' }}>
                      <a href={resumeUrl} target="_blank" rel="noreferrer" className="btn-primary" style={{ display:'inline-flex',alignItems:'center',gap:'0.5rem' }}>
                        <FiEye /> Open in New Tab
                      </a>
                    </div>
                  </>
                : <p style={{ textAlign:'center',color:'var(--text2)' }}>No resume uploaded yet.</p>
              }
            </div>
          </div>
        )}

        {/* ── 7: Contact ── */}
        {activeSection === 7 && (
          <div className={`frame ${frameClass}`}>
            <div className="frame-inner">
              <div className="section-header">
                <div className="section-tag">Connect</div>
                <h2 className="section-title">Find Me Online</h2>
              </div>
              {social.length > 0 && (
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
              )}
              {about && (
                <div style={{ display:'flex',gap:'2rem',justifyContent:'center',marginTop:'3rem',flexWrap:'wrap' }}>
                  {about.email && <div className="social-card"><FiMail /><span>{about.email}</span></div>}
                  {about.phone && <div className="social-card"><FiPhone /><span>{about.phone}</span></div>}
                  {about.location && <div className="social-card"><FiMapPin /><span>{about.location}</span></div>}
                </div>
              )}
              <footer className="footer" style={{ marginTop:'3rem' }}>
                <p>© {new Date().getFullYear()} {about?.name || 'Portfolio'}. Built with ❤️ using MERN Stack</p>
              </footer>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
