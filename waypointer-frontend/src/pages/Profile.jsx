import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';

export default function Profile() {
  const { user } = useAuth();
  const [form, setForm] = useState({ name: user.name, email: user.email, bio: user.bio || '', password: '', password_confirmation: '' });
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); setSuccess('');
    try {
      const payload = { name: form.name, email: form.email, bio: form.bio };
      if (form.password) payload.password = form.password;
      if (form.password_confirmation) payload.password_confirmation = form.password_confirmation;
      const { data } = await api.post('/me', payload);
      localStorage.setItem('user', JSON.stringify(data));
      setSuccess('Profile updated successfully!');
    } catch (err) {
      setError(err.response?.data?.message || 'Update failed');
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-display font-bold mb-8">Edit Profile</h1>
      <div className="card p-8">
        {success && <div className="bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-lg p-3 text-sm mb-4">{success}</div>}
        {error && <div className="bg-red-50 dark:bg-red-900/30 text-red-600 text-sm rounded-lg p-3 mb-4">{error}</div>}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="text-sm font-medium mb-1 block">Name</label>
            <input className="input" value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
          </div>
          <div>
            <label className="text-sm font-medium mb-1 block">Email</label>
            <input type="email" className="input" value={form.email} onChange={e => setForm({...form, email: e.target.value})} />
          </div>
          <div>
            <label className="text-sm font-medium mb-1 block">Bio</label>
            <textarea className="input resize-none" rows={3} value={form.bio} onChange={e => setForm({...form, bio: e.target.value})} />
          </div>
          <div>
            <label className="text-sm font-medium mb-1 block">New Password (leave blank to keep current)</label>
            <input type="password" className="input" value={form.password} onChange={e => setForm({...form, password: e.target.value})} />
          </div>
          <div>
            <label className="text-sm font-medium mb-1 block">Confirm Password</label>
            <input type="password" className="input" value={form.password_confirmation} onChange={e => setForm({...form, password_confirmation: e.target.value})} />
          </div>
          <button type="submit" className="btn-primary mt-2">Save Changes</button>
        </form>
      </div>
    </div>
  );
}