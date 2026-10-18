import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import API from '../utils/api';

const fields = ['name', 'title', 'bio', 'avatar', 'resume', 'email', 'phone', 'location'];

export default function AdminAbout() {
  const [form, setForm] = useState({});

  useEffect(() => { API.get('/about').then(r => setForm(r.data || {})); }, []);

  const save = async (e) => {
    e.preventDefault();
    await API.put('/about', form);
    toast.success('About updated!');
  };

  return (
    <div>
      <div className="admin-header"><h1>About Me</h1></div>
      <div className="form-card">
        <form onSubmit={save}>
          <div className="form-grid">
            {fields.map(f => (
              <div className="form-group" key={f}>
                <label>{f.charAt(0).toUpperCase() + f.slice(1)}</label>
                {f === 'bio'
                  ? <textarea value={form[f] || ''} onChange={e => setForm({ ...form, [f]: e.target.value })} placeholder={`Enter ${f}`} />
                  : <input value={form[f] || ''} onChange={e => setForm({ ...form, [f]: e.target.value })} placeholder={`Enter ${f}`} />
                }
              </div>
            ))}
          </div>
          <button type="submit" className="btn-sm btn-save" style={{ marginTop: '1.5rem' }}>Save Changes</button>
        </form>
      </div>
    </div>
  );
}
