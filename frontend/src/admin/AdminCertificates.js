import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import API from '../utils/api';

const empty = { title: '', issuer: '', date: '', image: '', credentialUrl: '' };

export default function AdminCertificates() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState(empty);
  const [editing, setEditing] = useState(null);

  const load = () => API.get('/certificates').then(r => setItems(r.data));
  useEffect(() => { load(); }, []);

  const save = async (e) => {
    e.preventDefault();
    if (editing) { await API.put(`/certificates/${editing}`, form); toast.success('Updated!'); }
    else { await API.post('/certificates', form); toast.success('Added!'); }
    setForm(empty); setEditing(null); load();
  };

  const edit = (item) => { setEditing(item._id); setForm(item); };
  const del = async (id) => { await API.delete(`/certificates/${id}`); toast.success('Deleted!'); load(); };

  return (
    <div>
      <div className="admin-header"><h1>Certificates</h1></div>
      <div className="form-card">
        <h3 style={{ marginBottom: '1rem' }}>{editing ? 'Edit Certificate' : 'Add Certificate'}</h3>
        <form onSubmit={save}>
          <div className="form-grid">
            {Object.keys(empty).map(f => (
              <div className="form-group" key={f}>
                <label>{f.charAt(0).toUpperCase() + f.slice(1)}</label>
                <input value={form[f] || ''} onChange={e => setForm({ ...form, [f]: e.target.value })} required={f === 'title'} />
              </div>
            ))}
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
            <div className="item-row-info"><h4>{item.title}</h4><p>{item.issuer} • {item.date}</p></div>
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
