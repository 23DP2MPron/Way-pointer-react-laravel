import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const { login } = useAuth();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const user = await login(form.email, form.password);
      navigate(user.role === 'admin' ? '/admin' : '/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="card w-full max-w-md p-8">
        <h1 className="text-2xl font-display font-bold mb-1">{t('auth.loginTitle')}</h1>
        <p className="text-sm text-gray-500 mb-6">{t('auth.loginSubtitle')}</p>

        {error && <div className="bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-lg p-3 text-sm mb-4">{error}</div>}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="text-sm font-medium mb-1 block">{t('auth.email')}</label>
            <input type="email" required value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} className="input" placeholder="you@example.com" />
          </div>
          <div>
            <label className="text-sm font-medium mb-1 block">{t('auth.password')}</label>
            <input type="password" required value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} className="input" placeholder="••••••••" />
          </div>
          <button type="submit" disabled={loading} className="btn-primary w-full mt-2">
            {loading ? t('auth.signingIn') : t('auth.loginButton')}
          </button>
        </form>

        <p className="text-sm text-center mt-4 text-gray-500">
          {t('auth.noAccount')}{' '}
          <Link to="/register" className="text-green-600 dark:text-teal-400 font-medium hover:underline">{t('auth.signUp')}</Link>
        </p>
      </div>
    </div>
  );
}