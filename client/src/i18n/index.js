import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Import translations
import esCommon from './locales/es/common.json';
import esHome from './locales/es/home.json';
import esApply from './locales/es/apply.json';

import enCommon from './locales/en/common.json';
import enHome from './locales/en/home.json';
import enApply from './locales/en/apply.json';

const resources = {
  es: {
    common: esCommon,
    home: esHome,
    apply: esApply,
  },
  en: {
    common: enCommon,
    home: enHome,
    apply: enApply,
  },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'es',
    defaultNS: 'common',
    ns: ['common', 'home', 'apply'],
    interpolation: {
      escapeValue: false, // React already escapes values
    },
    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage'],
    },
  });

export default i18n;

