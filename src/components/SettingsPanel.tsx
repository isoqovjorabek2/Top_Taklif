import React from 'react';
import { X, Moon, Sun, Globe, Bell, Shield, Database, Settings } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

interface SettingsPanelProps {
  onClose: () => void;
}

const SettingsPanel: React.FC<SettingsPanelProps> = ({ onClose }) => {
  const {
    isDarkMode,
    isCompactView,
    language,
    notifications,
    privacy,
    toggleDarkMode,
    toggleCompactView,
    setLanguage,
    updateNotificationSettings,
    updatePrivacySettings,
    clearCache,
    resetSettings,
  } = useTheme();

  return (
    <div className="absolute top-full right-0 mt-1 w-80 bg-white/95 dark:bg-gray-800/95 backdrop-blur-md rounded-lg shadow-xl border border-white/30 dark:border-gray-700/30 z-50">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Settings
          </h3>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <X className="w-4 h-4 text-gray-500 dark:text-gray-400" />
          </button>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Theme Settings */}
        <div>
          <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3 flex items-center gap-2">
            {isDarkMode ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
            Appearance
          </h4>
          <div className="space-y-2">
            <label className="flex items-center justify-between cursor-pointer">
              <span className="text-sm text-gray-700 dark:text-gray-300">Dark Mode</span>
              <input
                type="checkbox"
                checked={isDarkMode}
                onChange={toggleDarkMode}
                className="w-4 h-4 text-blue-600 focus:ring-blue-500 rounded"
              />
            </label>
            <label className="flex items-center justify-between cursor-pointer">
              <span className="text-sm text-gray-700 dark:text-gray-300">Compact View</span>
              <input
                type="checkbox"
                checked={isCompactView}
                onChange={toggleCompactView}
                className="w-4 h-4 text-blue-600 focus:ring-blue-500 rounded"
              />
            </label>
          </div>
        </div>

        {/* Language Settings */}
        <div>
          <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3 flex items-center gap-2">
            <Globe className="w-4 h-4" />
            Language & Region
          </h4>
          <select 
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          >
            <option value="en">English</option>
            <option value="uz">O'zbek</option>
            <option value="ru">Русский</option>
          </select>
        </div>

        {/* Notification Settings */}
        <div>
          <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3 flex items-center gap-2">
            <Bell className="w-4 h-4" />
            Notifications
          </h4>
          <div className="space-y-2">
            <label className="flex items-center justify-between cursor-pointer">
              <span className="text-sm text-gray-700 dark:text-gray-300">New Deals</span>
              <input
                type="checkbox"
                checked={notifications.newDeals}
                onChange={(e) => updateNotificationSettings('newDeals', e.target.checked)}
                className="w-4 h-4 text-blue-600 focus:ring-blue-500 rounded"
              />
            </label>
            <label className="flex items-center justify-between cursor-pointer">
              <span className="text-sm text-gray-700 dark:text-gray-300">Price Drops</span>
              <input
                type="checkbox"
                checked={notifications.priceDrops}
                onChange={(e) => updateNotificationSettings('priceDrops', e.target.checked)}
                className="w-4 h-4 text-blue-600 focus:ring-blue-500 rounded"
              />
            </label>
            <label className="flex items-center justify-between cursor-pointer">
              <span className="text-sm text-gray-700 dark:text-gray-300">Expiring Soon</span>
              <input
                type="checkbox"
                checked={notifications.expiringSoon}
                onChange={(e) => updateNotificationSettings('expiringSoon', e.target.checked)}
                className="w-4 h-4 text-blue-600 focus:ring-blue-500 rounded"
              />
            </label>
          </div>
        </div>

        {/* Privacy Settings */}
        <div>
          <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3 flex items-center gap-2">
            <Shield className="w-4 h-4" />
            Privacy
          </h4>
          <div className="space-y-2">
            <label className="flex items-center justify-between cursor-pointer">
              <span className="text-sm text-gray-700 dark:text-gray-300">Share Location</span>
              <input
                type="checkbox"
                checked={privacy.shareLocation}
                onChange={(e) => updatePrivacySettings('shareLocation', e.target.checked)}
                className="w-4 h-4 text-blue-600 focus:ring-blue-500 rounded"
              />
            </label>
            <label className="flex items-center justify-between cursor-pointer">
              <span className="text-sm text-gray-700 dark:text-gray-300">Analytics</span>
              <input
                type="checkbox"
                checked={privacy.analytics}
                onChange={(e) => updatePrivacySettings('analytics', e.target.checked)}
                className="w-4 h-4 text-blue-600 focus:ring-blue-500 rounded"
              />
            </label>
          </div>
        </div>

        {/* Data Settings */}
        <div>
          <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3 flex items-center gap-2">
            <Database className="w-4 h-4" />
            Data
          </h4>
          <div className="space-y-2">
            <button 
              onClick={clearCache}
              className="w-full text-left text-sm text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white py-1"
            >
              Clear Cache
            </button>
            <button 
              onClick={resetSettings}
              className="w-full text-left text-sm text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 py-1"
            >
              Reset All Settings
            </button>
          </div>
        </div>
      </div>

      <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-b-lg">
        <div className="text-xs text-gray-500 dark:text-gray-400 text-center">
          TopRaklif v1.0.0
        </div>
      </div>
    </div>
  );
};

export default SettingsPanel;