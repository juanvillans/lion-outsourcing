import { useTranslation } from 'react-i18next';
import { Icon } from '@iconify/react';

export default function LanguageSwitcher({ className = '' }) {
  const { i18n } = useTranslation();
  
  const toggleLanguage = () => {
    const newLang = i18n.language === 'es' ? 'en' : 'es';
    i18n.changeLanguage(newLang);
  };

  return (
    <button
      onClick={toggleLanguage}
      className={`flex items-center gap-1 px-3 py-1.5 rounded-lg hover:bg-gray-100 transition-colors ${className}`}
      title={i18n.language === 'es' ? 'Switch to English' : 'Cambiar a Español'}
    >
      {/* <span className="text-lg">
        {i18n.language === 'es' ? '🇺🇸' : '🇪🇸'}
      </span> */}
      <span className="text-sm font-medium flex gap-2">
        <Icon icon="uil:globe" width={20} height={20} className='text-gray-500 ' />
        {i18n.language === 'es' ? 'ENG' : 'ESP'} 
      </span>
      
    </button>
  );
}

