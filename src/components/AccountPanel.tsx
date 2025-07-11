import React from 'react';
import { X, User, Mail, Phone, MapPin, Star, Settings, LogOut, Crown } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface AccountPanelProps {
  onClose: () => void;
  userStats?: {
    dealsSaved: number;
    dealsUsed: number;
    totalSavings: number;
    memberSince: Date;
  };
}

const AccountPanel: React.FC<AccountPanelProps> = ({ onClose, userStats }) => {
  const { user, signOut } = useAuth();

  const handleSignOut = async () => {
    try {
      await signOut();
      onClose();
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  if (!user) {
    return null;
  }

  return (
    <div className="absolute top-full right-0 mt-1 w-80 bg-white/95 dark:bg-gray-800/95 backdrop-blur-md rounded-lg shadow-xl border border-white/30 dark:border-gray-700/30 z-50">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            <User className="w-5 h-5" />
            Account
          </h3>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-4 h-4 text-gray-500" />
          </button>
        </div>
      </div>

      <div className="p-4">
        {/* User Profile */}
        <div className="flex items-center gap-3 mb-6">
          {user.photoURL ? (
            <img 
              src={user.photoURL} 
              alt={user.displayName || 'User'} 
              className="w-12 h-12 rounded-full object-cover"
            />
          ) : (
            <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
              <User className="w-6 h-6 text-white" />
            </div>
          )}
          <div>
            <h4 className="font-semibold text-gray-900 dark:text-white">
              {user.displayName || 'User'}
            </h4>
            <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-1">
              <Crown className="w-3 h-3 text-yellow-500" />
              {user.provider === 'google.com' ? 'Google User' : 
               user.provider === 'facebook.com' ? 'Facebook User' :
               user.provider === 'telegram' ? 'Telegram User' : 'Email User'}
            </p>
          </div>
        </div>

        {/* Account Info */}
        <div className="space-y-3 mb-6">
          {user.email && (
            <div className="flex items-center gap-3 text-sm">
              <Mail className="w-4 h-4 text-gray-400" />
              <span className="text-gray-700 dark:text-gray-300">{user.email}</span>
            </div>
          )}
          <div className="flex items-center gap-3 text-sm">
            <MapPin className="w-4 h-4 text-gray-400" />
            <span className="text-gray-700 dark:text-gray-300">Tashkent, Uzbekistan</span>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="bg-blue-50 rounded-lg p-3 text-center">
            <div className="text-lg font-bold text-blue-600">{userStats?.dealsSaved || 0}</div>
            <div className="text-xs text-blue-600">Deals Saved</div>
          </div>
          <div className="bg-green-50 rounded-lg p-3 text-center">
            <div className="text-lg font-bold text-green-600">{userStats?.dealsUsed || 0}</div>
            <div className="text-xs text-green-600">Deals Used</div>
          </div>
          <div className="bg-purple-50 rounded-lg p-3 text-center col-span-2">
            <div className="text-lg font-bold text-purple-600">
              {userStats?.totalSavings ? `${(userStats.totalSavings / 1000000).toFixed(1)}M` : '0'} UZS
            </div>
            <div className="text-xs text-purple-600">Total Savings</div>
          </div>
        </div>

        {/* Member Since */}
        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3 mb-6 text-center">
          <div className="text-sm text-gray-600 dark:text-gray-400">Member Since</div>
          <div className="font-semibold text-gray-900 dark:text-white">
            {userStats?.memberSince ? userStats.memberSince.toLocaleDateString('en-US', { 
              month: 'long', 
              year: 'numeric' 
            }) : 'January 2024'}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="space-y-2">
          <button className="w-full flex items-center gap-3 px-3 py-2 text-left hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors">
            <Star className="w-4 h-4 text-gray-400" />
            <span className="text-sm text-gray-700 dark:text-gray-300">Saved Deals</span>
          </button>
          <button className="w-full flex items-center gap-3 px-3 py-2 text-left hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors">
            <Settings className="w-4 h-4 text-gray-400" />
            <span className="text-sm text-gray-700 dark:text-gray-300">Account Settings</span>
          </button>
          <button className="w-full flex items-center gap-3 px-3 py-2 text-left hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors">
            <Crown className="w-4 h-4 text-yellow-500" />
            <span className="text-sm text-gray-700 dark:text-gray-300">Upgrade to Premium</span>
          </button>
        </div>
      </div>

      <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-b-lg">
        <button 
          onClick={handleSignOut}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 text-red-600 hover:text-red-800 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span className="text-sm font-medium">Sign Out</span>
        </button>
      </div>
    </div>
  );
};

export default AccountPanel;