import { useEffect, useState, useCallback } from 'react';
import { toast } from 'react-toastify';
import API from '../utils/api';

const empty = { title: '', issuer: '', date: '', credentialUrl: '' };

export default function AdminCertificates() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState(empty);
  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState(null);
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

  const save = async (e) => {
    e.preventDefault();
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      if (imageFile) fd.append('image', imageFile);

      if (editing) {
        await API.put(`/certificates/${editing}`, fd, { headers: { 'Content-Type': 'multipart/form-data' } });
        toast.success('Updated!');
      } else {
        await API.post('/certificates', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
        toast.success('Added!');
      }
      setForm(empty); setImageFile(null); setPreview(null); setEditing(null); load();
    } catch { toast.error('Failed to save'); }
  };

  const edit = (item) => {
    setEditing(item._id);
    setForm({ title: item.title || '', issuer: item.issuer || '', date: item.date || '', credentialUrl: item.credentialUrl || '' });
    setImageFile(null);
    setPreview(item.image ? `http://localhost:5000${item.image}` : null);
  };

  const del = async (id) => {
    try { await API.delete(`/certificates/${id}`); toast.success('Deleted!'); load(); }
    catch { toast.error('Failed to delete'); }
  };

  const cancel = () => { setEditing(null); setForm(empty); setImageFile(null); setPreview(null); };

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

          {/* Image Upload */}
          <div className="form-group" style={{ marginTop: '1rem' }}>
            <label>Certificate Image</label>
            <input type="file" accept="image/*" onChange={handleImage}
              style={{ background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 8, padding: '0.5rem', color: 'var(--text)', cursor: 'pointer' }}
            />
          </div>

          {/* Preview */}
          {preview && (
            <div style={{ marginTop: '1rem', position: 'relative', display: 'inline-block' }}>
              <img src={preview} alt="preview"
                style={{ width: 220, height: 140, objectFit: 'cover', borderRadius: 10, border: '2px solid var(--border)' }}
              />
              <button type="button" onClick={() => { setImageFile(null); setPreview(null); }}
                style={{ position: 'absolute', top: -8, right: -8, background: 'var(--secondary)', border: 'none', borderRadius: '50%', width: 22, height: 22, color: 'white', cursor: 'pointer', fontSize: 12, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                ✕
              </button>
            </div>
          )}

          <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
            <button type="submit" className="btn-sm btn-add">{editing ? 'Update' : 'Add'}</button>
            {editing && <button type="button" className="btn-sm btn-del" onClick={cancel}>Cancel</button>}
          </div>
        </form>
      </div>

      <div className="items-list">
        {items.map(item => (
          <div className="item-row" key={item._id}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              {item.image
                ? <img src={`http://localhost:5000${item.image}`} alt={item.title}
                    style={{ width: 60, height: 40, objectFit: 'cover', borderRadius: 6, border: '1px solid var(--border)' }} />
                : <div style={{ width: 60, height: 40, borderRadius: 6, background: 'var(--bg3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem' }}>🏅</div>
              }
              <div className="item-row-info">
                <h4>{item.title}</h4>
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
