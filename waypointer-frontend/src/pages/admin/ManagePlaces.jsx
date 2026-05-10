import { useEffect, useState } from 'react';
import api from '../../api/axios';

const empty = { name: '', description: '', type: 'landmark', city: '', country: '', location: '' };

export default function ManagePlaces() {
  const [places, setPlaces] = useState([]);
  const [form, setForm] = useState(empty);
  const [editing, setEditing] = useState(null);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');

  const load = () => api.get('/places?per_page=50').then(r => setPlaces(r.data.data || []));
  useEffect(() => { load(); }, []);

  const save = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMsg('');
    try {
      if (editing) {
        await api.put(`/places/${editing}`, form);
        setMsg('Place updated!');
      } else {
        await api.post('/places', form);
        setMsg('Place added!');
      }
      setForm(empty);
      setEditing(null);
      load();
    } catch (err) {
      setMsg(err.response?.data?.message || 'Error saving place');
    } finally {
      setSaving(false);
    }
  };

  const del = async (id) => {
    if (!confirm('Delete this place?')) return;
    await api.delete(`/places/${id}`);
    load();
  };

  const startEdit = (p) => {
    setEditing(p.id);
    setForm({ name: p.name, description: p.description || '', type: p.type, city: p.city, country: p.country, location: p.location || '' });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-display font-bold mb-8">Manage Places</h1>

      <div className="card p-6 mb-8">
        <h2 className="font-display font-semibold mb-4">{editing ? 'Edit Place' : 'Add New Place'}</h2>
        {msg && <p className={`text-sm mb-3 ${msg.includes('Error') ? 'text-red-500' : 'text-green-600'}`}>{msg}</p>}
        <form onSubmit={save} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium mb-1 block">Name *</label>
            <input required className="input" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
          </div>
          <div>
            <label className="text-sm font-medium mb-1 block">Type *</label>
            <input required className="input" value={form.type} onChange={e => setForm({ ...form, type: e.target.value })} placeholder="landmark, historic, park..." />
          </div>
          <div>
            <label className="text-sm font-medium mb-1 block">City *</label>
            <input required className="input" value={form.city} onChange={e => setForm({ ...form, city: e.target.value })} />
          </div>
          <div>
            <label className="text-sm font-medium mb-1 block">Country *</label>
            <input required className="input" value={form.country} onChange={e => setForm({ ...form, country: e.target.value })} />
          </div>
          <div>
            <label className="text-sm font-medium mb-1 block">Location</label>
            <input className="input" value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} placeholder="e.g. 48.8584° N, 2.2945° E" />
          </div>
          <div className="sm:col-span-2">
            <label className="text-sm font-medium mb-1 block">Description</label>
            <textarea className="input resize-none" rows={3} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
          </div>
          <div className="sm:col-span-2 flex gap-2">
            <button type="submit" disabled={saving} className="btn-primary">
              {saving ? 'Saving...' : editing ? 'Update Place' : 'Add Place'}
            </button>
            {editing && (
              <button type="button" onClick={() => { setEditing(null); setForm(empty); }} className="btn-secondary">
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      <div className="flex flex-col gap-3">
        {places.length === 0 && <p className="text-gray-500 text-center py-8">No places yet.</p>}
        {places.map(p => (
          <div key={p.id} className="card p-4 flex items-center justify-between gap-4">
            <div>
              <p className="font-semibold">{p.name}</p>
              <p className="text-sm text-gray-500">{p.city}, {p.country} · {p.type} · ⭐ {p.rating?.toFixed(1)}</p>
            </div>
            <div className="flex gap-2 shrink-0">
              <button onClick={() => startEdit(p)} className="btn-secondary text-xs px-3 py-1.5">Edit</button>
              <button onClick={() => del(p.id)} className="text-xs px-3 py-1.5 rounded-lg bg-red-50 dark:bg-red-900/30 text-red-600 hover:bg-red-100 transition-colors">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}