import { useEffect, useState, useCallback } from 'react';
import { toast } from 'react-toastify';
import API from '../utils/api';

const empty = { platform: '', url: '' };
const platforms = ['GitHub', 'LinkedIn', 'Twitter', 'Instagram', 'YouTube', 'Website', 'LeetCode', 'HackerRank', 'Kaggle', 'Other'];

export default function AdminSocial() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState(empty);
  const [editing, setEditing] = useState(null);

  const load = useCallback(() => {
    API.get('/social').then(r => setItems(r.data)).catch(() => {});
  }, []);

  useEffect(() => { load(); }, [load]);

  const save = async (e) => {
    e.preventDefault();
    try {
      if (editing) { await API.put(`/social/${editing}`, form); toast.success('Updated!'); }
      else { await API.post('/social', form); toast.success('Added!'); }
      setForm(empty); setEditing(null); load();
    } catch { toast.error('Failed to save'); }
  };

  const edit = (item) => { setEditing(item._id); setForm({ platform: item.platform || '', url: item.url || '' }); };
  const del = async (id) => {
    try { await API.delete(`/social/${id}`); toast.success('Deleted!'); load(); }
    catch { toast.error('Failed to delete'); }
  };

  return (
    <div>
      <div className="admin-header"><h1>Social Links</h1></div>
      <div className="form-card">
        <h3 style={{ marginBottom: '1rem' }}>{editing ? 'Edit Link' : 'Add Social Link'}</h3>
        <form onSubmit={save}>
          <div className="form-grid">
            <div className="form-group">
              <label>Platform *</label>
              <select value={form.platform} onChange={e => setForm({ ...form, platform: e.target.value })} required>
                <option value="">Select platform</option>
                {platforms.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
            <div className="form-group"><label>URL *</label><input value={form.url} onChange={e => setForm({ ...form, url: e.target.value })} required placeholder="https://" /></div>
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
            <div className="item-row-info"><h4>{item.platform}</h4><p>{item.url}</p></div>
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
