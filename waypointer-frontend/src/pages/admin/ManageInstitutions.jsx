import { useEffect, useState } from 'react';
import api from '../../api/axios';

const empty = { 
  name: '', 
  description: '', 
  category: 'hotel', // Теперь по умолчанию валидное значение
  address: '', 
  city: '', 
  country: '', 
  latitude: '', 
  longitude: '' 
};

export default function ManageInstitutions() {
  const [institutions, setInstitutions] = useState([]);
  const [form, setForm] = useState(empty);
  const [editing, setEditing] = useState(null);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');

  const load = () => api.get('/institutions?per_page=50')
    .then(r => setInstitutions(r.data.data || []))
    .catch(() => setInstitutions([]));

  useEffect(() => { load(); }, []);

  const save = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMsg('');
    try {
      const payload = {
        name: form.name,
        description: form.description,
        type: form.category, // Передаем как 'type'
        address: form.address,
        city: form.city,
        country: form.country,
        // Координаты должны быть числами или null
        latitude: form.latitude === '' ? null : parseFloat(form.latitude),
        longitude: form.longitude === '' ? null : parseFloat(form.longitude)
      };

      if (editing) {
        await api.put(`/institutions/${editing}`, payload);
        setMsg('Updated successfully!');
      } else {
        await api.post('/institutions', payload);
        setMsg('Added successfully!');
      }
      
      setForm(empty);
      setEditing(null);
      load();
    } catch (err) {
      const serverError = err.response?.data?.errors;
      if (serverError) {
        setMsg('Error: ' + Object.values(serverError).flat().join(', '));
      } else {
        setMsg(err.response?.data?.message || 'Error saving institution');
      }
    } finally {
      setSaving(false);
    }
  };

  const startEdit = (i) => {
    setEditing(i.id);
    setForm({ 
      name: i.name, 
      description: i.description || '', 
      category: i.type, // Здесь важно брать именно .type из базы
      address: i.address || '', 
      city: i.city, 
      country: i.country, 
      latitude: i.latitude || '', 
      longitude: i.longitude || '' 
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const del = async (id) => {
    if (!confirm('Delete this institution?')) return;
    await api.delete(`/institutions/${id}`);
    load();
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-display font-bold mb-8">Manage Institutions</h1>

      <div className="card p-6 mb-8">
        <h2 className="font-display font-semibold mb-4">{editing ? 'Edit Institution' : 'Add New Institution'}</h2>
        {msg && <p className={`text-sm mb-3 ${msg.includes('Error') ? 'text-red-500' : 'text-green-600'}`}>{msg}</p>}
        
        <form onSubmit={save} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="sm:col-span-1">
            <label className="text-sm font-medium mb-1 block">Name *</label>
            <input required className="input" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
          </div>
          
          <div className="sm:col-span-1">
            <label className="text-sm font-medium mb-1 block">Category *</label>
            <select required className="input" value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}>
              {/* ТОЛЬКО ТЕ ЗНАЧЕНИЯ, КОТОРЫЕ ЕСТЬ В ВАШЕМ PHP КОНТРОЛЛЕРЕ */}
              <option value="hotel">Hotel</option>
              <option value="restaurant">Restaurant</option>
              <option value="cafe">Cafe</option>
              <option value="bar">Bar</option>
              <option value="shop">Shop</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div>
            <label className="text-sm font-medium mb-1 block">City *</label>
            <input required className="input" value={form.city} onChange={e => setForm({ ...form, city: e.target.value })} />
          </div>
          <div>
            <label className="text-sm font-medium mb-1 block">Country *</label>
            <input required className="input" value={form.country} onChange={e => setForm({ ...form, country: e.target.value })} />
          </div>

          <div className="sm:col-span-2">
            <label className="text-sm font-medium mb-1 block">Address *</label>
            <input required className="input" value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} />
          </div>

          <div>
            <label className="text-sm font-medium mb-1 block">Latitude</label>
            <input type="number" step="any" className="input" value={form.latitude} onChange={e => setForm({ ...form, latitude: e.target.value })} />
          </div>
          <div>
            <label className="text-sm font-medium mb-1 block">Longitude</label>
            <input type="number" step="any" className="input" value={form.longitude} onChange={e => setForm({ ...form, longitude: e.target.value })} />
          </div>

          <div className="sm:col-span-2">
            <label className="text-sm font-medium mb-1 block">Description</label>
            <textarea className="input resize-none" rows={3} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
          </div>
          
          <div className="sm:col-span-2 flex gap-2">
            <button type="submit" disabled={saving} className="btn-primary">
              {saving ? 'Saving...' : editing ? 'Update Institution' : 'Add Institution'}
            </button>
            {editing && (
              <button type="button" onClick={() => { setEditing(null); setForm(empty); }} className="btn-secondary">Cancel</button>
            )}
          </div>
        </form>
      </div>

      {/* Список institutions (как в ManagePlaces) */}
      <div className="flex flex-col gap-3">
        {institutions.map(i => (
          <div key={i.id} className="card p-4 flex items-center justify-between gap-4">
            <div>
              <p className="font-semibold">{i.name}</p>
              <p className="text-sm text-gray-500">{i.city}, {i.country} · {i.type}</p>
            </div>
            <div className="flex gap-2">
              <button onClick={() => startEdit(i)} className="btn-secondary text-xs px-3 py-1.5">Edit</button>
              <button onClick={() => del(i.id)} className="text-xs px-3 py-1.5 rounded-lg bg-red-50 text-red-600">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}