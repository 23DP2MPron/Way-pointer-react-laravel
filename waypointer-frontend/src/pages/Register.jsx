import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const { register } = useAuth();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', password_confirmation: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (form.password !== form.password_confirmation) return setError(t('auth.passwordsNoMatch'));
    setLoading(true);
    try {
      await register(form.name, form.email, form.password, form.password_confirmation);
      navigate('/dashboard');
    } catch (err) {
      const errors = err.response?.data?.errors;
      setError(errors ? Object.values(errors).flat().join(' ') : t('auth.registrationFailed'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="card w-full max-w-md p-8">
        <h1 className="text-2xl font-display font-bold mb-1">{t('auth.registerTitle')}</h1>
        <p className="text-sm text-gray-500 mb-6">{t('auth.registerSubtitle')}</p>

        {error && <div className="bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-lg p-3 text-sm mb-4">{error}</div>}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {[
            { label: t('auth.name'), key: 'name', type: 'text', placeholder: 'John Doe' },
            { label: t('auth.email'), key: 'email', type: 'email', placeholder: 'you@example.com' },
            { label: t('auth.password'), key: 'password', type: 'password', placeholder: '••••••••' },
            { label: t('auth.confirmPassword'), key: 'password_confirmation', type: 'password', placeholder: '••••••••' },
          ].map(f => (
            <div key={f.key}>
              <label className="text-sm font-medium mb-1 block">{f.label}</label>
              <input type={f.type} required value={form[f.key]}
                onChange={e => setForm({ ...form, [f.key]: e.target.value })}
                className="input" placeholder={f.placeholder} />
            </div>
          ))}
          <button type="submit" disabled={loading} className="btn-primary w-full mt-2">
            {loading ? t('auth.registering') : t('auth.registerButton')}
          </button>
        </form>

        <p className="text-sm text-center mt-4 text-gray-500">
          {t('auth.hasAccount')}{' '}
          <Link to="/login" className="text-green-600 dark:text-teal-400 font-medium hover:underline">{t('auth.signIn')}</Link>
        </p>
      </div>
    </div>
  );
}