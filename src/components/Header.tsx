import React, { useState, useEffect, useRef } from 'react';
import { Zap, MapPin, Settings, User, Bell, Filter, Plus } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import SettingsPanel from './SettingsPanel';
import AccountPanel from './AccountPanel';
import AuthModal from './AuthModal';
import HostModal from './HostModal';

interface HeaderProps {
  onNotificationToggle: () => void;
  onFilterToggle: () => void;
  onHostModeToggle: () => void;
  notificationCount?: number;
  userStats?: {
    dealsSaved: number;
    dealsUsed: number;
    totalSavings: number;
    memberSince: Date;
  };
}

const Header: React.FC<HeaderProps> = ({ 
  onNotificationToggle, 
  onFilterToggle, 
  onHostModeToggle,
  notificationCount = 0,
  userStats
}) => {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isHostModalOpen, setIsHostModalOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const headerRef = useRef<HTMLElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const buttonsRef = useRef<HTMLDivElement>(null);

  const { user } = useAuth();

  useEffect(() => {
    // Scroll handler for background opacity
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const newIsScrolled = scrollY > 50;
      
      if (newIsScrolled !== isScrolled) {
        setIsScrolled(newIsScrolled);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isScrolled]);

  const handleButtonClick = (callback: () => void, buttonRef?: HTMLElement) => {
    callback();
  };

  const handleSettingsToggle = () => {
    const newState = !isSettingsOpen;
    setIsSettingsOpen(newState);
  };

  const handleAccountToggle = () => {
    if (user) {
      const newState = !isAccountOpen;
      setIsAccountOpen(newState);
    } else {
      setIsAuthModalOpen(true);
    }
  };

  return (
    <header 
      ref={headerRef}
      className="fixed top-0 left-0 right-0 z-50 backdrop-blur-sm border-b border-white/20 transition-all duration-300"
      style={{
        backgroundColor: 'transparent',
        backdropFilter: isScrolled ? 'blur(10px)' : 'blur(5px)'
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div ref={logoRef} className="flex items-center gap-2">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-2 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">TopRaklif</h1>
              <p className="text-xs text-gray-500 dark:text-gray-400">AI-Powered Deals</p>
            </div>
          </div>

          {/* User Menu */}
          <div className="flex items-center gap-4">
            <div ref={buttonsRef} className="flex items-center gap-1">
              <button 
                onClick={handleSettingsToggle}
                className={`p-2 hover:bg-white/20 dark:hover:bg-gray-700/20 rounded-lg transition-all duration-300 backdrop-blur-sm ${
                  isSettingsOpen ? 'bg-white/30 dark:bg-gray-700/30 shadow-md' : 'hover:shadow-sm'
                }`}
              >
                <Settings className="w-5 h-5 text-gray-600 dark:text-gray-300" />
              </button>
              <button 
                onClick={handleAccountToggle}
                className={`p-2 hover:bg-white/20 dark:hover:bg-gray-700/20 rounded-lg transition-all duration-300 backdrop-blur-sm ${
                  (isAccountOpen && user) ? 'bg-white/30 dark:bg-gray-700/30 shadow-md' : 'hover:shadow-sm'
                }`}
              >
                {user && user.photoURL ? (
                  <img 
                    src={user.photoURL} 
                    alt={user.displayName || 'User'} 
                    className="w-5 h-5 rounded-full object-cover"
                  />
                ) : (
                  <User className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                )}
              </button>
              
              {/* Notification Button */}
              <button
                data-notification-button
                onClick={() => handleButtonClick(onNotificationToggle)}
                className="p-2 hover:bg-white/20 dark:hover:bg-gray-700/20 rounded-lg transition-all duration-300 relative backdrop-blur-sm hover:shadow-sm"
              >
                <Bell className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                {notificationCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center animate-pulse shadow-lg">
                    {notificationCount}
                  </span>
                )}
              </button>
              
              {/* Filter Button */}
              <button
                data-filter-button
                onClick={() => handleButtonClick(onFilterToggle)}
                className="p-2 hover:bg-white/20 dark:hover:bg-gray-700/20 rounded-lg transition-all duration-300 backdrop-blur-sm hover:shadow-sm"
              >
                <Filter className="w-5 h-5 text-gray-600 dark:text-gray-300" />
              </button>
              
              {/* Host Mode Button */}
              <button
                onClick={() => setIsHostModalOpen(true)}
                className="flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-lg transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg backdrop-blur-sm"
              >
                <Plus className="w-4 h-4" />
                <span className="text-sm font-medium">Post Deal</span>
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Settings Panel */}
      {isSettingsOpen && (
        <div data-panel="settings">
          <SettingsPanel onClose={() => setIsSettingsOpen(false)} />
        </div>
      )}
      
      {/* Account Panel */}
      {isAccountOpen && user && (
        <div data-panel="account">
          <AccountPanel 
            onClose={() => setIsAccountOpen(false)} 
            userStats={userStats}
          />
        </div>
      )}
      
      {/* Auth Modal */}
      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)} 
      />
      
      {/* Host Modal */}
      <HostModal 
        isOpen={isHostModalOpen} 
        onClose={() => setIsHostModalOpen(false)} 
      />
    </header>
  );
};

export default Header;