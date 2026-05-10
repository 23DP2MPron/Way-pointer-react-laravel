import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './locales/en.json';
import lv from './locales/lv.json';

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      lv: { translation: lv }
    },
    lng: localStorage.getItem('language') || 'en',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
