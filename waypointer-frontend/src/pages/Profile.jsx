import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';

export default function Profile() {
  const { user, setUser } = useAuth();
  const [form, setForm] = useState({
    name:                  user.name,
    email:                 user.email,
    bio:                   user.bio || '',
    password:              '',
    password_confirmation: '',
  });
  const [success, setSuccess] = useState('');
  const [error, setError]     = useState('');
  const [saving, setSaving]   = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setSaving(true);

    try {
      const payload = {
        name:  form.name,
        email: form.email,
        bio:   form.bio,
      };

      if (form.password) {
        payload.password              = form.password;
        payload.password_confirmation = form.password_confirmation;
      }

      const { data } = await api.post('/me', payload);

      // Обновляем пользователя в контексте и localStorage
      setUser(data);
      localStorage.setItem('user', JSON.stringify(data));

      // Сбрасываем поля пароля
      setForm(f => ({ ...f, password: '', password_confirmation: '' }));
      setSuccess('Profile updated successfully!');
    } catch (err) {
      const serverErrors = err.response?.data?.errors;
      if (serverErrors) {
        setError(Object.values(serverErrors).flat().join(', '));
      } else {
        setError(err.response?.data?.message || 'Update failed');
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-display font-bold mb-8">Edit Profile</h1>
      <div className="card p-8">
        {success && (
          <div className="bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-lg p-3 text-sm mb-4">
            {success}
          </div>
        )}
        {error && (
          <div className="bg-red-50 dark:bg-red-900/30 text-red-600 text-sm rounded-lg p-3 mb-4">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="text-sm font-medium mb-1 block">Name</label>
            <input
              className="input"
              value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value })}
            />
          </div>
          <div>
            <label className="text-sm font-medium mb-1 block">Email</label>
            <input
              type="email"
              className="input"
              value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })}
            />
          </div>
          <div>
            <label className="text-sm font-medium mb-1 block">Bio</label>
            <textarea
              className="input resize-none"
              rows={3}
              maxLength={500}
              value={form.bio}
              onChange={e => setForm({ ...form, bio: e.target.value })}
              placeholder="Tell something about yourself..."
            />
            <p className="text-xs text-gray-400 mt-1">{form.bio.length}/500</p>
          </div>
          <div>
            <label className="text-sm font-medium mb-1 block">
              New Password <span className="text-gray-400 font-normal">(leave blank to keep current)</span>
            </label>
            <input
              type="password"
              className="input"
              value={form.password}
              onChange={e => setForm({ ...form, password: e.target.value })}
              autoComplete="new-password"
            />
          </div>
          <div>
            <label className="text-sm font-medium mb-1 block">Confirm Password</label>
            <input
              type="password"
              className="input"
              value={form.password_confirmation}
              onChange={e => setForm({ ...form, password_confirmation: e.target.value })}
              autoComplete="new-password"
            />
          </div>
          <button type="submit" disabled={saving} className="btn-primary mt-2">
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </form>
      </div>
    </div>
  );
}
