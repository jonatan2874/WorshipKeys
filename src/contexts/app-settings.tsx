import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { useColorScheme as useDeviceColorScheme } from 'react-native';

import i18n from '@/lib/i18n';

export type ThemePreference = 'system' | 'light' | 'dark';
export type Language = 'es' | 'en';

interface AppSettingsValue {
  themePreference: ThemePreference;
  setThemePreference: (pref: ThemePreference) => void;
  resolvedScheme: 'light' | 'dark';
  language: Language;
  setLanguage: (lang: Language) => void;
}

const STORAGE_KEY_THEME = 'worshipkeys.themePreference';
const STORAGE_KEY_LANG = 'worshipkeys.language';

const AppSettingsContext = createContext<AppSettingsValue | null>(null);

export function AppSettingsProvider({ children }: { children: ReactNode }) {
  const deviceScheme = useDeviceColorScheme();
  const [themePreference, setThemePreferenceState] = useState<ThemePreference>('system');
  const [language, setLanguageState] = useState<Language>(i18n.language === 'en' ? 'en' : 'es');

  useEffect(() => {
    (async () => {
      const [storedTheme, storedLang] = await Promise.all([
        AsyncStorage.getItem(STORAGE_KEY_THEME),
        AsyncStorage.getItem(STORAGE_KEY_LANG),
      ]);
      if (storedTheme === 'light' || storedTheme === 'dark' || storedTheme === 'system') {
        setThemePreferenceState(storedTheme);
      }
      if (storedLang === 'es' || storedLang === 'en') {
        setLanguageState(storedLang);
        i18n.changeLanguage(storedLang);
      }
    })();
  }, []);

  function setThemePreference(pref: ThemePreference) {
    setThemePreferenceState(pref);
    AsyncStorage.setItem(STORAGE_KEY_THEME, pref);
  }

  function setLanguage(lang: Language) {
    setLanguageState(lang);
    i18n.changeLanguage(lang);
    AsyncStorage.setItem(STORAGE_KEY_LANG, lang);
  }

  const resolvedScheme: 'light' | 'dark' =
    themePreference === 'system' ? (deviceScheme === 'dark' ? 'dark' : 'light') : themePreference;

  return (
    <AppSettingsContext.Provider
      value={{ themePreference, setThemePreference, resolvedScheme, language, setLanguage }}>
      {children}
    </AppSettingsContext.Provider>
  );
}

export function useAppSettings() {
  const ctx = useContext(AppSettingsContext);
  if (!ctx) throw new Error('useAppSettings must be used within AppSettingsProvider');
  return ctx;
}
