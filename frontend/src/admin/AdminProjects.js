import { useEffect, useState, useCallback } from 'react';
import { toast } from 'react-toastify';
import API from '../utils/api';

const empty = { title: '', description: '', image: '', techStack: '', liveUrl: '', githubUrl: '', featured: false };

export default function AdminProjects() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState(empty);
  const [editing, setEditing] = useState(null);

  const load = useCallback(() => {
    API.get('/projects').then(r => setItems(r.data)).catch(() => {});
  }, []);

  useEffect(() => { load(); }, [load]);

  const save = async (e) => {
    e.preventDefault();
    try {
      const data = { ...form, techStack: form.techStack.split(',').map(t => t.trim()).filter(Boolean) };
      if (editing) { await API.put(`/projects/${editing}`, data); toast.success('Updated!'); }
      else { await API.post('/projects', data); toast.success('Added!'); }
      setForm(empty); setEditing(null); load();
    } catch { toast.error('Failed to save'); }
  };

  const edit = (item) => { setEditing(item._id); setForm({ ...item, techStack: item.techStack?.join(', ') || '' }); };
  const del = async (id) => {
    try { await API.delete(`/projects/${id}`); toast.success('Deleted!'); load(); }
    catch { toast.error('Failed to delete'); }
  };

  return (
    <div>
      <div className="admin-header"><h1>Projects</h1></div>
      <div className="form-card">
        <h3 style={{ marginBottom: '1rem' }}>{editing ? 'Edit Project' : 'Add Project'}</h3>
        <form onSubmit={save}>
          <div className="form-grid">
            <div className="form-group"><label>Title *</label><input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} required /></div>
            <div className="form-group"><label>Image URL</label><input value={form.image} onChange={e => setForm({ ...form, image: e.target.value })} /></div>
            <div className="form-group"><label>Live URL</label><input value={form.liveUrl} onChange={e => setForm({ ...form, liveUrl: e.target.value })} /></div>
            <div className="form-group"><label>GitHub URL</label><input value={form.githubUrl} onChange={e => setForm({ ...form, githubUrl: e.target.value })} /></div>
            <div className="form-group"><label>Tech Stack (comma separated)</label><input value={form.techStack} onChange={e => setForm({ ...form, techStack: e.target.value })} placeholder="React, Node.js, MongoDB" /></div>
          </div>
          <div className="form-group" style={{ marginTop: '1rem' }}><label>Description</label><textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} /></div>
          <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
            <button type="submit" className="btn-sm btn-add">{editing ? 'Update' : 'Add Project'}</button>
            {editing && <button type="button" className="btn-sm btn-del" onClick={() => { setEditing(null); setForm(empty); }}>Cancel</button>}
          </div>
        </form>
      </div>
      <div className="items-list">
        {items.map(item => (
          <div className="item-row" key={item._id}>
            <div className="item-row-info"><h4>{item.title}</h4><p>{item.techStack?.join(', ')}</p></div>
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
