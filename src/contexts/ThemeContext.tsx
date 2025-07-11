import React, { createContext, useContext, useState, useEffect } from 'react';

interface ThemeContextType {
  isDarkMode: boolean;
  isCompactView: boolean;
  language: string;
  notifications: {
    newDeals: boolean;
    priceDrops: boolean;
    expiringSoon: boolean;
  };
  privacy: {
    shareLocation: boolean;
    analytics: boolean;
  };
  toggleDarkMode: () => void;
  toggleCompactView: () => void;
  setLanguage: (lang: string) => void;
  updateNotificationSettings: (key: keyof ThemeContextType['notifications'], value: boolean) => void;
  updatePrivacySettings: (key: keyof ThemeContextType['privacy'], value: boolean) => void;
  clearCache: () => void;
  resetSettings: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

const defaultSettings = {
  isDarkMode: false,
  isCompactView: false,
  language: 'en',
  notifications: {
    newDeals: true,
    priceDrops: true,
    expiringSoon: true,
  },
  privacy: {
    shareLocation: true,
    analytics: false,
  },
};

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState(() => {
    const saved = localStorage.getItem('topraklif-settings');
    return saved ? { ...defaultSettings, ...JSON.parse(saved) } : defaultSettings;
  });

  // Save settings to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('topraklif-settings', JSON.stringify(settings));
  }, [settings]);

  // Apply dark mode class to document
  useEffect(() => {
    if (settings.isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [settings.isDarkMode]);

  const toggleDarkMode = () => {
    setSettings(prev => ({ ...prev, isDarkMode: !prev.isDarkMode }));
  };

  const toggleCompactView = () => {
    setSettings(prev => ({ ...prev, isCompactView: !prev.isCompactView }));
  };

  const setLanguage = (language: string) => {
    setSettings(prev => ({ ...prev, language }));
  };

  const updateNotificationSettings = (key: keyof typeof settings.notifications, value: boolean) => {
    setSettings(prev => ({
      ...prev,
      notifications: { ...prev.notifications, [key]: value }
    }));
  };

  const updatePrivacySettings = (key: keyof typeof settings.privacy, value: boolean) => {
    setSettings(prev => ({
      ...prev,
      privacy: { ...prev.privacy, [key]: value }
    }));
  };

  const clearCache = () => {
    // Clear various caches
    localStorage.removeItem('topraklif-cache');
    sessionStorage.clear();
    // You could also clear other cached data here
    alert('Cache cleared successfully!');
  };

  const resetSettings = () => {
    if (confirm('Are you sure you want to reset all settings? This action cannot be undone.')) {
      setSettings(defaultSettings);
      localStorage.removeItem('topraklif-settings');
      localStorage.removeItem('topraklif-cache');
    }
  };

  return (
    <ThemeContext.Provider
      value={{
        ...settings,
        toggleDarkMode,
        toggleCompactView,
        setLanguage,
        updateNotificationSettings,
        updatePrivacySettings,
        clearCache,
        resetSettings,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};