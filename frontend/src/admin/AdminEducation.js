import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import API from '../utils/api';

const empty = { degree: '', institution: '', year: '', grade: '', description: '' };

export default function AdminEducation() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState(empty);
  const [editing, setEditing] = useState(null);

  const load = () => API.get('/education').then(r => setItems(r.data));
  useEffect(() => { load(); }, []);

  const save = async (e) => {
    e.preventDefault();
    if (editing) { await API.put(`/education/${editing}`, form); toast.success('Updated!'); }
    else { await API.post('/education', form); toast.success('Added!'); }
    setForm(empty); setEditing(null); load();
  };

  const edit = (item) => { setEditing(item._id); setForm(item); };
  const del = async (id) => { await API.delete(`/education/${id}`); toast.success('Deleted!'); load(); };

  return (
    <div>
      <div className="admin-header"><h1>Education</h1></div>
      <div className="form-card">
        <h3 style={{ marginBottom: '1rem' }}>{editing ? 'Edit Education' : 'Add Education'}</h3>
        <form onSubmit={save}>
          <div className="form-grid">
            <div className="form-group"><label>Degree *</label><input value={form.degree} onChange={e => setForm({ ...form, degree: e.target.value })} required /></div>
            <div className="form-group"><label>Institution</label><input value={form.institution} onChange={e => setForm({ ...form, institution: e.target.value })} /></div>
            <div className="form-group"><label>Year</label><input value={form.year} onChange={e => setForm({ ...form, year: e.target.value })} placeholder="2020 - 2024" /></div>
            <div className="form-group"><label>Grade / CGPA</label><input value={form.grade} onChange={e => setForm({ ...form, grade: e.target.value })} /></div>
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
            <div className="item-row-info"><h4>{item.degree}</h4><p>{item.institution} • {item.year}</p></div>
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
