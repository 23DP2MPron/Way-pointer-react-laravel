import { useTranslation } from 'react-i18next';

export default function Footer() {
  const { t } = useTranslation();
  
  return (
    <footer className="border-t border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-950 py-8 mt-auto">
      <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        <span className="font-display font-bold text-lg text-green-600 dark:text-teal-400">WayPointer</span>
        <p className="text-xs text-gray-400">© {new Date().getFullYear()} WayPointer. {t('footer.rights')}</p>
      </div>
    </footer>
  );
}