import { useEffect, useState } from 'react';
import api from '../../api/axios';

const empty = { 
  name: '', 
  description: '', 
  category: 'landmark', // Установим значение по умолчанию, которое точно валидно
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
      // Формируем payload так, чтобы Laravel был доволен
      const payload = {
        name: form.name,
        description: form.description,
        type: form.category, // Отправляем как 'type'
        address: form.address || 'Address not specified', // Бэкенд требует адрес
        city: form.city,
        country: form.country,
        latitude: form.latitude === '' ? null : parseFloat(form.latitude),
        longitude: form.longitude === '' ? null : parseFloat(form.longitude)
      };

      if (editing) {
        await api.post(`/institutions/${editing}`, { ...payload, _method: 'PUT' });
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
        // Показываем конкретную причину (например: "The selected type is invalid")
        setMsg('Error: ' + Object.values(serverError).flat().join(', '));
      } else {
        setMsg(err.response?.data?.message || 'Error saving data');
      }
    } finally {
      setSaving(false);
    }
  };

  const del = async (id) => {
    if (!confirm('Delete?')) return;
    await api.delete(`/institutions/${id}`);
    load();
  };

  const startEdit = (i) => {
    setEditing(i.id);
    setForm({ 
      name: i.name, 
      description: i.description || '', 
      category: i.type || i.category || 'landmark', // Поддержка обоих имен полей
      address: i.address || '', 
      city: i.city, 
      country: i.country, 
      latitude: i.latitude || '', 
      longitude: i.longitude || '' 
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-display font-bold mb-8">Manage Institutions</h1>

      <div className="card p-6 mb-8">
        <h2 className="font-display font-semibold mb-4">{editing ? 'Edit' : 'Add New'}</h2>
        {msg && <p className={`text-sm mb-3 ${msg.includes('Error') ? 'text-red-500' : 'text-green-600'}`}>{msg}</p>}
        
        <form onSubmit={save} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium mb-1 block">Name *</label>
            <input required className="input" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
          </div>
          <div>
            <label className="text-sm font-medium mb-1 block">Category (Type) *</label>
            <select required className="input" value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}>
              {/* Используем те же типы, что в рабочем коде мест */}
              <option value="landmark">Landmark</option>
              <option value="historic">Historic</option>
              <option value="park">Park</option>
              <option value="museum">Museum</option>
              <option value="hotel">Hotel</option>
              <option value="restaurant">Restaurant</option>
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
            <input required className="input" value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} placeholder="Required by server" />
          </div>
          <div className="sm:col-span-2">
            <label className="text-sm font-medium mb-1 block">Description</label>
            <textarea className="input resize-none" rows={2} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
          </div>
          
          <div className="sm:col-span-2 flex gap-2">
            <button type="submit" disabled={saving} className="btn-primary">
              {saving ? 'Saving...' : editing ? 'Update' : 'Add Institution'}
            </button>
            {editing && (
              <button type="button" onClick={() => { setEditing(null); setForm(empty); }} className="btn-secondary">Cancel</button>
            )}
          </div>
        </form>
      </div>

      <div className="flex flex-col gap-3">
        {institutions.map(i => (
          <div key={i.id} className="card p-4 flex items-center justify-between gap-4">
            <div>
              <p className="font-semibold">{i.name}</p>
              <p className="text-sm text-gray-500">{i.city}, {i.country} · {i.type || i.category}</p>
            </div>
            <div className="flex gap-2">
              <button onClick={() => startEdit(i)} className="btn-secondary text-xs px-3">Edit</button>
              <button onClick={() => del(i.id)} className="btn-secondary text-xs px-3 text-red-500">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}