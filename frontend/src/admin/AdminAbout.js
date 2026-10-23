import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { FiUpload, FiUser, FiFileText } from 'react-icons/fi';
import API from '../utils/api';

const BASE = 'https://portfolio-backend-bbfj.onrender.com';
const defaultForm = { name: '', title: '', bio: '', email: '', phone: '', location: '' };

export default function AdminAbout() {
  const [form, setForm] = useState(defaultForm);
  const [avatarFile, setAvatarFile] = useState(null);
  const [photoFile, setPhotoFile] = useState(null);
  const [resumeFile, setResumeFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [resumeName, setResumeName] = useState('');

  useEffect(() => {
    API.get('/about').then(r => {
      if (r.data) {
        const { name, title, bio, email, phone, location, avatar, resume } = r.data;
        setForm({ name: name || '', title: title || '', bio: bio || '', email: email || '', phone: phone || '', location: location || '' });
        if (avatar) setAvatarPreview(`${BASE}${avatar}`);
        if (r.data.photo) setPhotoPreview(`${BASE}${r.data.photo}`);
        if (resume) setResumeName(resume.split('/').pop());
      }
    }).catch(() => {});
  }, []);

  const handleAvatar = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
  };

  const handlePhoto = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setPhotoFile(file);
    setPhotoPreview(URL.createObjectURL(file));
  };

  const handleResume = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setResumeFile(file);
    setResumeName(file.name);
  };

  const save = async (e) => {
    e.preventDefault();
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      if (avatarFile) fd.append('avatar', avatarFile);
      if (photoFile) fd.append('photo', photoFile);
      if (resumeFile) fd.append('resume', resumeFile);
      await API.put('/about', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      toast.success('About updated!');
    } catch { toast.error('Failed to save'); }
  };

  const inputStyle = { background: 'var(--bg3)', border: '1px dashed var(--border)', borderRadius: 8, padding: '0.6rem 1rem', color: 'var(--text)', cursor: 'pointer', width: '100%' };

  return (
    <div>
      <div className="admin-header"><h1>About Me</h1></div>
      <form onSubmit={save}>

        {/* Photos + Resume Upload Row */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>

          {/* Mini Avatar */}
          <div className="form-card" style={{ margin: 0 }}>
            <h3 style={{ marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize:'0.95rem' }}><FiUser /> Mini Avatar <span style={{fontSize:'0.7rem',color:'var(--text2)',fontWeight:400}}>(navbar &amp; all pages)</span></h3>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
              {avatarPreview
                ? <img src={avatarPreview} alt="avatar" style={{ width: 100, height: 100, borderRadius: '50%', objectFit: 'cover', border: '3px solid var(--primary)', boxShadow: '0 0 20px rgba(108,99,255,0.4)' }} />
                : <div style={{ width: 100, height: 100, borderRadius: '50%', background: 'linear-gradient(135deg, var(--primary), var(--accent))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', color: 'white' }}>
                    {form.name?.[0]?.toUpperCase() || '?'}
                  </div>
              }
              <label style={{ cursor: 'pointer', width: '100%' }}>
                <div style={{ ...inputStyle, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', textAlign: 'center', fontSize:'0.82rem' }}>
                  <FiUpload /> {avatarFile ? avatarFile.name : 'Upload Mini Photo'}
                </div>
                <input type="file" accept="image/*" onChange={handleAvatar} style={{ display: 'none' }} />
              </label>
            </div>
          </div>

          {/* Portrait Photo */}
          <div className="form-card" style={{ margin: 0 }}>
            <h3 style={{ marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize:'0.95rem' }}><FiUser /> Portrait Photo <span style={{fontSize:'0.7rem',color:'var(--text2)',fontWeight:400}}>(home page only)</span></h3>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
              {photoPreview
                ? <img src={photoPreview} alt="portrait" style={{ width: 80, height: 120, borderRadius: 10, objectFit: 'cover', border: '3px solid var(--accent)', boxShadow: '0 0 20px rgba(0,212,255,0.4)' }} />
                : <div style={{ width: 80, height: 120, borderRadius: 10, background: 'linear-gradient(135deg, var(--accent), var(--primary))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', color: 'white' }}>
                    {form.name?.[0]?.toUpperCase() || '?'}
                  </div>
              }
              <label style={{ cursor: 'pointer', width: '100%' }}>
                <div style={{ ...inputStyle, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', textAlign: 'center', fontSize:'0.82rem' }}>
                  <FiUpload /> {photoFile ? photoFile.name : 'Upload Portrait'}
                </div>
                <input type="file" accept="image/*" onChange={handlePhoto} style={{ display: 'none' }} />
              </label>
            </div>
          </div>

          {/* Resume Upload */}
          <div className="form-card" style={{ margin: 0 }}>
            <h3 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><FiFileText /> Resume (PDF)</h3>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
              <div style={{ width: 120, height: 120, borderRadius: 12, background: resumeName ? 'rgba(108,99,255,0.1)' : 'var(--bg3)', border: '2px solid var(--border)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                <FiFileText size={36} color={resumeName ? 'var(--primary)' : 'var(--text2)'} />
                <span style={{ fontSize: '0.7rem', color: 'var(--text2)', textAlign: 'center', padding: '0 0.5rem', wordBreak: 'break-all' }}>
                  {resumeName || 'No PDF uploaded'}
                </span>
              </div>
              <label style={{ cursor: 'pointer', width: '100%' }}>
                <div style={{ ...inputStyle, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', textAlign: 'center' }}>
                  <FiUpload /> {resumeFile ? resumeFile.name : 'Upload Resume (PDF)'}
                </div>
                <input type="file" accept="application/pdf" onChange={handleResume} style={{ display: 'none' }} />
              </label>
              {resumeName && (
                <a href={`${BASE}/uploads/about/${resumeName}`} target="_blank" rel="noreferrer" className="btn-sm btn-edit" style={{ textAlign: 'center' }}>
                  View Current PDF
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Text Fields */}
        <div className="form-card">
          <h3 style={{ marginBottom: '1rem' }}>Personal Info</h3>
          <div className="form-grid">
            {[['name', 'Full Name'], ['title', 'Job Title'], ['email', 'Email'], ['phone', 'Phone'], ['location', 'Location']].map(([f, lbl]) => (
              <div className="form-group" key={f}>
                <label>{lbl}</label>
                <input value={form[f]} onChange={e => setForm({ ...form, [f]: e.target.value })} placeholder={`Enter ${lbl}`} />
              </div>
            ))}
          </div>
          <div className="form-group" style={{ marginTop: '1rem' }}>
            <label>Bio</label>
            <textarea value={form.bio} onChange={e => setForm({ ...form, bio: e.target.value })} placeholder="Write something about yourself..." style={{ minHeight: 120 }} />
          </div>
          <button type="submit" className="btn-sm btn-save" style={{ marginTop: '1.5rem' }}>Save All Changes</button>
        </div>

      </form>
    </div>
  );
}
