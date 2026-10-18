import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import API from '../utils/api';

const empty = { name: '', level: 80, category: '' };
const categories = ['Frontend', 'Backend', 'Database', 'DevOps', 'Mobile', 'Tools', 'Other'];

export default function AdminSkills() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState(empty);
  const [editing, setEditing] = useState(null);

  const load = () => API.get('/skills').then(r => setItems(r.data));
  useEffect(() => { load(); }, []);

  const save = async (e) => {
    e.preventDefault();
    if (editing) { await API.put(`/skills/${editing}`, form); toast.success('Updated!'); }
    else { await API.post('/skills', form); toast.success('Added!'); }
    setForm(empty); setEditing(null); load();
  };

  const edit = (item) => { setEditing(item._id); setForm(item); };
  const del = async (id) => { await API.delete(`/skills/${id}`); toast.success('Deleted!'); load(); };

  return (
    <div>
      <div className="admin-header"><h1>Skills</h1></div>
      <div className="form-card">
        <h3 style={{ marginBottom: '1rem' }}>{editing ? 'Edit Skill' : 'Add Skill'}</h3>
        <form onSubmit={save}>
          <div className="form-grid">
            <div className="form-group"><label>Skill Name *</label><input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required placeholder="React.js" /></div>
            <div className="form-group">
              <label>Category</label>
              <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}>
                <option value="">Select category</option>
                {categories.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>Proficiency: {form.level}%</label>
              <input type="range" min="0" max="100" value={form.level} onChange={e => setForm({ ...form, level: Number(e.target.value) })} style={{ accentColor: 'var(--primary)' }} />
            </div>
          </div>
          <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
            <button type="submit" className="btn-sm btn-add">{editing ? 'Update' : 'Add'}</button>
            {editing && <button type="button" className="btn-sm btn-del" onClick={() => { setEditing(null); setForm(empty); }}>Cancel</button>}
          </div>
        </form>
      </div>
      <div className="items-list">
        {items.map(item => (
          <div className="item-row" key={item._id}>
            <div className="item-row-info"><h4>{item.name}</h4><p>{item.category} • {item.level}%</p></div>
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
