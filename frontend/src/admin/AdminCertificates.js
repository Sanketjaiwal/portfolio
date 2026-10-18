import { useEffect, useState, useCallback } from 'react';
import { toast } from 'react-toastify';
import { FiUpload, FiFileText } from 'react-icons/fi';
import API from '../utils/api';

const BASE = 'http://localhost:5000';
const empty = { title: '', issuer: '', date: '', credentialUrl: '' };

export default function AdminCertificates() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState(empty);
  const [imageFile, setImageFile] = useState(null);
  const [pdfFile, setPdfFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [existingPdf, setExistingPdf] = useState(null);
  const [editing, setEditing] = useState(null);

  const load = useCallback(() => {
    API.get('/certificates').then(r => setItems(r.data)).catch(() => {});
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImageFile(file);
    setPreview(URL.createObjectURL(file));
  };

  const handlePdf = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setPdfFile(file);
  };

  const save = async (e) => {
    e.preventDefault();
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      if (imageFile) fd.append('image', imageFile);
      if (pdfFile) fd.append('file', pdfFile);

      if (editing) {
        await API.put(`/certificates/${editing}`, fd, { headers: { 'Content-Type': 'multipart/form-data' } });
        toast.success('Updated!');
      } else {
        await API.post('/certificates', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
        toast.success('Added!');
      }
      resetForm(); load();
    } catch { toast.error('Failed to save'); }
  };

  const resetForm = () => {
    setForm(empty); setImageFile(null); setPdfFile(null);
    setPreview(null); setExistingPdf(null); setEditing(null);
  };

  const edit = (item) => {
    setEditing(item._id);
    setForm({ title: item.title || '', issuer: item.issuer || '', date: item.date || '', credentialUrl: item.credentialUrl || '' });
    setImageFile(null); setPdfFile(null);
    setPreview(item.image ? `${BASE}${item.image}` : null);
    setExistingPdf(item.file ? `${BASE}${item.file}` : null);
  };

  const del = async (id) => {
    try { await API.delete(`/certificates/${id}`); toast.success('Deleted!'); load(); }
    catch { toast.error('Failed to delete'); }
  };

  const fileInputStyle = {
    background: 'var(--bg3)', border: '1px dashed var(--border)',
    borderRadius: 8, padding: '0.6rem 1rem', color: 'var(--text)', cursor: 'pointer', width: '100%',
    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
  };

  return (
    <div>
      <div className="admin-header"><h1>Certificates</h1></div>
      <div className="form-card">
        <h3 style={{ marginBottom: '1rem' }}>{editing ? 'Edit Certificate' : 'Add Certificate'}</h3>
        <form onSubmit={save}>
          <div className="form-grid">
            <div className="form-group">
              <label>Title *</label>
              <input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} required />
            </div>
            <div className="form-group">
              <label>Issuer</label>
              <input value={form.issuer} onChange={e => setForm({ ...form, issuer: e.target.value })} />
            </div>
            <div className="form-group">
              <label>Date</label>
              <input value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} placeholder="e.g. June 2024" />
            </div>
            <div className="form-group">
              <label>Credential URL</label>
              <input value={form.credentialUrl} onChange={e => setForm({ ...form, credentialUrl: e.target.value })} placeholder="https://" />
            </div>
          </div>

          {/* Upload Row */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '1rem' }}>

            {/* Image Upload */}
            <div className="form-group">
              <label>Certificate Image (JPG/PNG)</label>
              <label style={{ cursor: 'pointer' }}>
                <div style={fileInputStyle}><FiUpload /> {imageFile ? imageFile.name : 'Upload Image'}</div>
                <input type="file" accept="image/*" onChange={handleImage} style={{ display: 'none' }} />
              </label>
              {preview && (
                <div style={{ marginTop: '0.8rem', position: 'relative', display: 'inline-block' }}>
                  <img src={preview} alt="preview" style={{ width: 180, height: 110, objectFit: 'cover', borderRadius: 8, border: '2px solid var(--border)' }} />
                  <button type="button" onClick={() => { setImageFile(null); setPreview(null); }}
                    style={{ position: 'absolute', top: -8, right: -8, background: 'var(--secondary)', border: 'none', borderRadius: '50%', width: 20, height: 20, color: 'white', cursor: 'pointer', fontSize: 11 }}>✕</button>
                </div>
              )}
            </div>

            {/* PDF Upload */}
            <div className="form-group">
              <label>Certificate PDF</label>
              <label style={{ cursor: 'pointer' }}>
                <div style={fileInputStyle}><FiFileText /> {pdfFile ? pdfFile.name : 'Upload PDF'}</div>
                <input type="file" accept="application/pdf" onChange={handlePdf} style={{ display: 'none' }} />
              </label>
              {(pdfFile || existingPdf) && (
                <div style={{ marginTop: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.8rem', background: 'rgba(108,99,255,0.1)', borderRadius: 8, padding: '0.6rem 1rem' }}>
                  <FiFileText color="var(--primary)" size={20} />
                  <span style={{ fontSize: '0.85rem', color: 'var(--text2)', flex: 1 }}>{pdfFile ? pdfFile.name : 'Existing PDF'}</span>
                  {existingPdf && !pdfFile && (
                    <a href={existingPdf} target="_blank" rel="noreferrer" style={{ color: 'var(--primary)', fontSize: '0.8rem' }}>View</a>
                  )}
                  {pdfFile && (
                    <button type="button" onClick={() => setPdfFile(null)}
                      style={{ background: 'none', border: 'none', color: 'var(--secondary)', cursor: 'pointer', fontSize: 12 }}>✕</button>
                  )}
                </div>
              )}
            </div>
          </div>

          <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
            <button type="submit" className="btn-sm btn-add">{editing ? 'Update' : 'Add'}</button>
            {editing && <button type="button" className="btn-sm btn-del" onClick={resetForm}>Cancel</button>}
          </div>
        </form>
      </div>

      <div className="items-list">
        {items.map(item => (
          <div className="item-row" key={item._id}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              {item.image
                ? <img src={`${BASE}${item.image}`} alt={item.title} style={{ width: 60, height: 40, objectFit: 'cover', borderRadius: 6, border: '1px solid var(--border)' }} />
                : <div style={{ width: 60, height: 40, borderRadius: 6, background: 'var(--bg3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem' }}>
                    {item.file ? <FiFileText color="var(--primary)" /> : '🏅'}
                  </div>
              }
              <div className="item-row-info">
                <h4>{item.title} {item.file && <span style={{ fontSize: '0.7rem', color: 'var(--primary)', marginLeft: 6, background: 'rgba(108,99,255,0.15)', padding: '2px 6px', borderRadius: 4 }}>PDF</span>}</h4>
                <p>{item.issuer} • {item.date}</p>
              </div>
            </div>
            <div className="item-actions">
              <button className="btn-sm btn-edit" onClick={() => edit(item)}>Edit</button>
              <button className="btn-sm btn-del" onClick={() => del(item._id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
