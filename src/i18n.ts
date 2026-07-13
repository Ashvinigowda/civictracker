import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import en from './locales/en.json';
import hi from './locales/hi.json';
import kn from './locales/kn.json';

const resources = {
  en: { translation: en },
  hi: { translation: hi },
  kn: { translation: kn },
};

// Get saved language from localStorage or use default
const savedLanguage = localStorage.getItem('language') || 'en';
console.log('📋 i18n: Initializing with language:', savedLanguage);

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: savedLanguage,
    fallbackLng: 'en',
    interpolation: { escapeValue: false },
  });

// Log language changes
i18n.on('languageChanged', (lng) => {
  console.log('🌍 i18n: Language changed to:', lng);
  localStorage.setItem('language', lng);
});

export default i18n;
