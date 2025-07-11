import React, { useState, useEffect, useMemo } from 'react';
import { Bell, Map as MapIcon, Grid, Filter, Search, Sparkles } from 'lucide-react';
import { Deal, FilterOptions, Notification } from './types';
import { mockDeals } from './data/mockDeals';
import { useGeolocation } from './hooks/useGeolocation';
import { useAuth } from './contexts/AuthContext';
import { useTheme } from './contexts/ThemeContext';
import Header from './components/Header';
import Map from './components/Map';
import DealCard from './components/DealCard';
import FilterPanel from './components/FilterPanel';
import NotificationPanel from './components/NotificationPanel';
import StatsCard from './components/StatsCard';
import AuthModal from './components/AuthModal';

function App() {
  const { isDarkMode, isCompactView } = useTheme();
  const { user, loading: authLoading, isAuthenticated } = useAuth();
  const [deals, setDeals] = useState<Deal[]>(mockDeals);
  const [selectedDeal, setSelectedDeal] = useState<Deal | null>(null);
  const [filters, setFilters] = useState<FilterOptions>({});
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'map'>('grid');
  const [isFullscreenMap, setIsFullscreenMap] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchSuggestions, setShowSearchSuggestions] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [userStats, setUserStats] = useState({
    dealsSaved: 47,
    dealsUsed: 12,
    totalSavings: 2500000,
    memberSince: new Date('2024-01-01')
  });

  // Show auth modal if user is not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      setShowAuthModal(true);
    }
  }, [authLoading, isAuthenticated]);

  const handleAuthSuccess = () => {
    setShowAuthModal(false);
  };

  const { location, loading, error, requestLocation } = useGeolocation();

  // Filter deals based on current filters
  const filteredDeals = useMemo(() => {
    let filtered = [...deals];

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(deal => 
        deal.title.toLowerCase().includes(query) ||
        deal.description.toLowerCase().includes(query) ||
        deal.tags.some(tag => tag.toLowerCase().includes(query)) ||
        deal.location.district.toLowerCase().includes(query)
      );
    }

    if (filters.category) {
      filtered = filtered.filter(deal => deal.category === filters.category);
    }

    if (filters.maxPrice) {
      filtered = filtered.filter(deal => deal.discountedPrice <= filters.maxPrice!);
    }

    if (filters.minDiscount) {
      filtered = filtered.filter(deal => deal.discountPercentage >= filters.minDiscount!);
    }

    if (filters.district) {
      filtered = filtered.filter(deal => deal.location.district === filters.district);
    }

    // Sort deals
    const sortBy = filters.sortBy || 'newest';
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.source.timestamp).getTime() - new Date(a.source.timestamp).getTime();
        case 'discount':
          return b.discountPercentage - a.discountPercentage;
        case 'price':
          return a.discountedPrice - b.discountedPrice;
        case 'distance':
          // Simple distance calculation (would need proper implementation)
          return 0;
        default:
          return 0;
      }
    });

    return filtered;
  }, [deals, filters]);

  // Calculate stats
  const stats = useMemo(() => {
    const avgDiscount = Math.round(
      filteredDeals.reduce((sum, deal) => sum + deal.discountPercentage, 0) / filteredDeals.length
    );
    const recentDeals = filteredDeals.filter(
      deal => new Date().getTime() - new Date(deal.source.timestamp).getTime() < 86400000
    ).length;

    return {
      dealsCount: filteredDeals.length,
      avgDiscount: avgDiscount || 0,
      recentDeals
    };
  }, [filteredDeals]);

  const handleDealSelect = (deal: Deal) => {
    setSelectedDeal(deal);
    if (viewMode === 'grid') {
      setViewMode('map');
    }
  };

  const handleFullscreenMap = () => {
    setIsFullscreenMap(!isFullscreenMap);
    if (!isFullscreenMap) {
      setViewMode('map');
    }
  };

  const handleMarkAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id 
          ? { ...notification, isRead: true }
          : notification
      )
    );
  };

  const handleClearAllNotifications = () => {
    setNotifications([]);
  };

  const handleLocationSelect = (newLocation: UserLocation) => {
    // This would typically update the user's location in state
    // For now, we'll just trigger the location request to update the current location
    requestLocation();
  };

  const searchSuggestions = useMemo(() => {
    if (!searchQuery.trim()) return [];
    
    const suggestions = new Set<string>();
    const query = searchQuery.toLowerCase();
    
    deals.forEach(deal => {
      if (deal.title.toLowerCase().includes(query)) suggestions.add(deal.title);
      if (deal.location.district.toLowerCase().includes(query)) suggestions.add(deal.location.district);
      deal.tags.forEach(tag => {
        if (tag.toLowerCase().includes(query)) suggestions.add(tag);
      });
    });
    
    return Array.from(suggestions).slice(0, 5);
  }, [searchQuery, deals]);

  // Close panels when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      
      // Close filter panel if clicking outside
      if (isFilterOpen && !target.closest('[data-panel="filter"]') && !target.closest('[data-filter-button]')) {
        setIsFilterOpen(false);
      }
      
      // Close notification panel if clicking outside
      if (isNotificationOpen && !target.closest('[data-panel="notification"]') && !target.closest('[data-notification-button]')) {
        setIsNotificationOpen(false);
      }
      
      // Close search suggestions
      if (!target.closest('[data-search-container]')) {
        setShowSearchSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isFilterOpen, isNotificationOpen]);

  // Simulate real-time deal updates
  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate new deals being added
      const randomDeal = mockDeals[Math.floor(Math.random() * mockDeals.length)];
      const newNotification: Notification = {
        id: Date.now().toString(),
        type: 'new-deal',
        deal: randomDeal,
        timestamp: new Date(),
        isRead: false
      };
      
      setNotifications(prev => [newNotification, ...prev.slice(0, 9)]);
    }, 30000); // Every 30 seconds

    return () => clearInterval(interval);
  }, []);

  if (loading || authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-600 mx-auto mb-6"></div>
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            <h1 className="text-3xl font-bold mb-2">TopRaklif</h1>
            <p className="text-lg">AI-Powered Deals Platform</p>
          </div>
          <p className="text-gray-600 dark:text-gray-400 mt-4">
            {authLoading ? 'Authenticating...' : 'Loading TopRaklif...'}
          </p>
        </div>
      </div>
    );
  }

  // Show auth modal if user is not authenticated
  if (!isAuthenticated && !authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800">
        <AuthModal isOpen={showAuthModal} onClose={handleAuthSuccess} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-16 transition-colors duration-300">
      {/* Fullscreen Map Overlay */}
      {isFullscreenMap && (
        <div className="fixed inset-0 z-50 bg-gray-900 pt-16">
          <Map
            deals={filteredDeals}
            userLocation={location}
            onDealSelect={handleDealSelect}
            selectedDeal={selectedDeal}
            className="w-full h-full"
          />
        </div>
      )}

      <Header 
        onNotificationToggle={() => setIsNotificationOpen(!isNotificationOpen)}
        onFilterToggle={() => setIsFilterOpen(!isFilterOpen)}
        onHostModeToggle={() => {}} // Host modal is handled within Header component
        notificationCount={notifications.filter(n => !n.isRead).length}
        userStats={userStats}
      />
      
      {/* Main Content */}
      <main className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 ${isCompactView ? 'py-4' : 'py-6'}`}>
        {/* Stats */}
        <StatsCard 
          dealsCount={stats.dealsCount}
          avgDiscount={stats.avgDiscount}
          recentDeals={stats.recentDeals}
        />

        {/* View Toggle */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
          {/* Search Bar */}
          <div className="relative flex-1 max-w-md" data-search-container>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search deals, locations, categories..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setShowSearchSuggestions(true);
                }}
                onFocus={() => setShowSearchSuggestions(true)}
                className="w-full pl-10 pr-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 shadow-sm hover:shadow-md transition-all duration-300"
              />
              {searchQuery && (
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setShowSearchSuggestions(false);
                  }}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  ×
                </button>
              )}
            </div>
            
            {/* Search Suggestions */}
            {showSearchSuggestions && searchSuggestions.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-10">
                {searchSuggestions.map((suggestion, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setSearchQuery(suggestion);
                      setShowSearchSuggestions(false);
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-900 dark:text-white first:rounded-t-lg last:rounded-b-lg transition-colors duration-200"
                  >
                    <Search className="inline w-4 h-4 mr-2 text-gray-400" />
                    {suggestion}
                  </button>
                ))}
              </div>
            )}
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => setViewMode('grid')}
              className={`flex items-center gap-2 px-4 py-3 rounded-xl transition-all duration-300 transform hover:scale-105 ${
                viewMode === 'grid'
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 shadow-sm hover:shadow-md'
              }`}
            >
              <Grid className="w-4 h-4" />
              Grid View
            </button>
            <button
              onClick={() => {
                if (viewMode === 'map' && !isFullscreenMap) {
                  setIsFullscreenMap(true);
                } else if (viewMode === 'map' && isFullscreenMap) {
                  setIsFullscreenMap(false);
                } else {
                  setViewMode('map');
                }
              }}
              className={`flex items-center gap-2 px-4 py-3 rounded-xl transition-all duration-300 transform hover:scale-105 ${
                viewMode === 'map' || isFullscreenMap
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 shadow-sm hover:shadow-md'
              }`}
            >
              <MapIcon className="w-4 h-4" />
              {isFullscreenMap ? 'Exit Fullscreen' : viewMode === 'map' ? 'Fullscreen Map' : 'Map View'}
            </button>

            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 bg-white dark:bg-gray-800 px-3 py-2 rounded-lg shadow-sm">
              <Sparkles className="w-4 h-4 text-yellow-500" />
              {filteredDeals.length} deals found
            </div>
          </div>
        </div>

        {/* Content */}
        {viewMode === 'grid' ? (
          <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 ${isCompactView ? 'gap-4' : 'gap-6'}`}>
            {filteredDeals.map((deal) => (
              <DealCard
                key={deal.id}
                deal={deal}
                onSelect={handleDealSelect}
                isSelected={selectedDeal?.id === deal.id}
              />
            ))}
          </div>
        ) : (
          <div className="space-y-6">
            <Map
              deals={filteredDeals}
              userLocation={location}
              onDealSelect={handleDealSelect}
              selectedDeal={selectedDeal}
            />
            
            {/* Selected Deal Details */}
            {selectedDeal && (
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
                <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Selected Deal</h3>
                <DealCard
                  deal={selectedDeal}
                  onSelect={handleDealSelect}
                  isSelected={true}
                />
              </div>
            )}
          </div>
        )}

        {/* Empty State */}
        {filteredDeals.length === 0 && (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Filter className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No deals found</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">Try adjusting your filters to see more deals</p>
            <button
              onClick={() => setFilters({})}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              Clear Filters
            </button>
          </div>
        )}
      </main>

      {/* Filter Panel */}
      <div data-panel="filter">
        <FilterPanel
          filters={filters}
          onFiltersChange={setFilters}
          isOpen={isFilterOpen}
          onToggle={() => setIsFilterOpen(!isFilterOpen)}
        />
      </div>

      {/* Notification Panel */}
      <div data-panel="notification">
        <NotificationPanel
          notifications={notifications}
          isOpen={isNotificationOpen}
          onToggle={() => setIsNotificationOpen(!isNotificationOpen)}
          onMarkAsRead={handleMarkAsRead}
          onClearAll={handleClearAllNotifications}
        />
      </div>
    </div>
  );
}

export default App;