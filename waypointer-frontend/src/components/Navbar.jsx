import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { theme, toggle } = useTheme();
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleLanguage = () => {
    const newLang = i18n.language === 'en' ? 'lv' : 'en';
    i18n.changeLanguage(newLang);
    localStorage.setItem('language', newLang);
  };

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <nav className="sticky top-0 z-50 backdrop-blur-md bg-white/80 dark:bg-gray-950/80 border-b border-gray-100 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
        <Link to="/" className="font-display font-800 text-xl text-green-600 dark:text-teal-400 tracking-tight">
          Way<span className="text-gray-900 dark:text-white">Pointer</span>
        </Link>

        <div className="hidden md:flex items-center gap-6 text-sm font-medium">
          <Link to="/" className="hover:text-green-600 dark:hover:text-teal-400 transition-colors">{t('nav.home')}</Link>
          <Link to="/countries" className="hover:text-green-600 dark:hover:text-teal-400 transition-colors">{t('nav.countries')}</Link>
          <Link to="/cities" className="hover:text-green-600 dark:hover:text-teal-400 transition-colors">{t('nav.cities')}</Link>
          <Link to="/explore" className="hover:text-green-600 dark:hover:text-teal-400 transition-colors">{t('nav.explore')}</Link>
          {user && <Link to="/dashboard" className="hover:text-green-600 dark:hover:text-teal-400 transition-colors">{t('nav.dashboard')}</Link>}
          {user?.role === 'admin' && <Link to="/admin" className="hover:text-green-600 dark:hover:text-teal-400 transition-colors">{t('nav.admin')}</Link>}
        </div>

        <div className="flex items-center gap-3">
          <button onClick={toggleLanguage} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-sm font-medium">
            {i18n.language === 'en' ? 'LV' : 'EN'}
          </button>
          <button onClick={toggle} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-lg">
            {theme === 'dark' ? '☀️' : '🌙'}
          </button>
          {user ? (
            <div className="relative">
              <button onClick={() => setMenuOpen(!menuOpen)} className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                <div className="w-8 h-8 rounded-full bg-green-600 dark:bg-teal-500 text-white flex items-center justify-center text-sm font-bold">
                  {user.name[0].toUpperCase()}
                </div>
                <span className="text-sm font-medium hidden sm:block">{user.name}</span>
              </button>
              {menuOpen && (
                <div className="absolute right-0 mt-2 w-48 card py-1 shadow-xl">
                  <Link to="/profile" onClick={() => setMenuOpen(false)} className="block px-4 py-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-800">{t('nav.profile')}</Link>
                  <Link to="/my-routes" onClick={() => setMenuOpen(false)} className="block px-4 py-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-800">{t('nav.myRoutes')}</Link>
                  <Link to="/favorites" onClick={() => setMenuOpen(false)} className="block px-4 py-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-800">{t('nav.favorites')}</Link>
                  <hr className="my-1 border-gray-100 dark:border-gray-700" />
                  <button onClick={handleLogout} className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-50 dark:hover:bg-gray-800">{t('nav.logout')}</button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link to="/login" className="btn-secondary text-sm px-4 py-2">{t('nav.login')}</Link>
              <Link to="/register" className="btn-primary text-sm px-4 py-2">{t('nav.signUp')}</Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}