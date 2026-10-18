import { useEffect, useState, useCallback } from 'react';
import { toast } from 'react-toastify';
import API from '../utils/api';

const empty = { title: '', description: '', date: '', icon: '' };

export default function AdminAchievements() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState(empty);
  const [editing, setEditing] = useState(null);

  const load = useCallback(() => {
    API.get('/achievements').then(r => setItems(r.data)).catch(() => {});
  }, []);

  useEffect(() => { load(); }, [load]);

  const save = async (e) => {
    e.preventDefault();
    try {
      if (editing) { await API.put(`/achievements/${editing}`, form); toast.success('Updated!'); }
      else { await API.post('/achievements', form); toast.success('Added!'); }
      setForm(empty); setEditing(null); load();
    } catch { toast.error('Failed to save'); }
  };

  const edit = (item) => { setEditing(item._id); setForm({ ...empty, ...item }); };
  const del = async (id) => {
    try { await API.delete(`/achievements/${id}`); toast.success('Deleted!'); load(); }
    catch { toast.error('Failed to delete'); }
  };

  return (
    <div>
      <div className="admin-header"><h1>Achievements</h1></div>
      <div className="form-card">
        <h3 style={{ marginBottom: '1rem' }}>{editing ? 'Edit Achievement' : 'Add Achievement'}</h3>
        <form onSubmit={save}>
          <div className="form-grid">
            <div className="form-group"><label>Title *</label><input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} required /></div>
            <div className="form-group"><label>Date</label><input value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} /></div>
            <div className="form-group"><label>Icon (emoji)</label><input value={form.icon} onChange={e => setForm({ ...form, icon: e.target.value })} placeholder="🏆" /></div>
          </div>
          <div className="form-group" style={{ marginTop: '1rem' }}><label>Description</label><textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} /></div>
          <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
            <button type="submit" className="btn-sm btn-add">{editing ? 'Update' : 'Add'}</button>
            {editing && <button type="button" className="btn-sm btn-del" onClick={() => { setEditing(null); setForm(empty); }}>Cancel</button>}
          </div>
        </form>
      </div>
      <div className="items-list">
        {items.map(item => (
          <div className="item-row" key={item._id}>
            <div className="item-row-info"><h4>{item.icon} {item.title}</h4><p>{item.date}</p></div>
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
