import { useTranslation } from 'react-i18next';
import { useState, useEffect } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Globe } from 'lucide-react';

const languages = [
  { code: 'en', name: 'English' },
  { code: 'hi', name: 'हिंदी' },
  { code: 'kn', name: 'ಕನ್ನಡ' },
];

export function LanguageSelector() {
  const { i18n } = useTranslation();
  const [language, setLanguage] = useState(i18n.language);

  useEffect(() => {
    // Listen for language changes and force update
    const handleLanguageChange = (lng: string) => {
      console.log('🌍 languageChanged event fired:', lng);
      setLanguage(lng);
    };

    i18n.on('languageChanged', handleLanguageChange);

    return () => {
      i18n.off('languageChanged', handleLanguageChange);
    };
  }, [i18n]);

  const handleLanguageChange = (lang: string) => {
    console.log('🌐 **Changing language to:', lang);
    console.log('  Before i18n.changeLanguage() - i18n.language:', i18n.language);
    
    i18n.changeLanguage(lang).then(() => {
      console.log('  ✅ i18n.changeLanguage() succeeded');
      console.log('  After i18n.changeLanguage() - i18n.language:', i18n.language);
      setLanguage(lang);
    }).catch((err) => {
      console.error('  ❌ i18n.changeLanguage() failed:', err);
    });
    
    localStorage.setItem('language', lang);
    console.log('  ✅ Saved to localStorage');
  };

  return (
    <div className="flex items-center gap-2">
      <Globe className="h-4 w-4 text-muted-foreground" />
      <Select value={language} onValueChange={handleLanguageChange}>
        <SelectTrigger className="w-[140px]">
          <SelectValue placeholder="Language" />
        </SelectTrigger>
        <SelectContent>
          {languages.map((lang) => (
            <SelectItem key={lang.code} value={lang.code}>
              {lang.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
