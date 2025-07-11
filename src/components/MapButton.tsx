import React, { useState } from 'react';
import { MapPin, Navigation, Target, X } from 'lucide-react';
import { UserLocation } from '../types';

interface MapButtonProps {
  userLocation: UserLocation | null;
  onLocationRequest: () => void;
  onLocationSelect?: (location: UserLocation) => void;
}

const MapButton: React.FC<MapButtonProps> = ({ 
  userLocation, 
  onLocationRequest, 
  onLocationSelect 
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const predefinedLocations = [
    { name: 'Amir Temur Square', lat: 41.2995, lng: 69.2401, district: 'Yunusobod' },
    { name: 'Chorsu Bazaar', lat: 41.3264, lng: 69.2348, district: 'Uchtepa' },
    { name: 'Magic City', lat: 41.2755, lng: 69.2037, district: 'Chilanzar' },
    { name: 'Mega Planet', lat: 41.3195, lng: 69.2519, district: 'Yashnobod' },
    { name: 'Tashkent City', lat: 41.3111, lng: 69.2797, district: 'Mirzo Ulugbek' },
  ];

  const handleLocationSelect = (location: { name: string; lat: number; lng: number; district: string }) => {
    const userLoc: UserLocation = {
      lat: location.lat,
      lng: location.lng,
      address: `${location.name}, ${location.district}, Tashkent`
    };
    onLocationSelect?.(userLoc);
    setIsExpanded(false);
  };

  return (
    <div className="fixed bottom-6 right-6 z-40">
      {/* Expanded Menu */}
      {isExpanded && (
        <div className="absolute bottom-16 right-0 bg-white rounded-xl shadow-xl border border-gray-200 p-4 w-80 mb-2">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900 flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              Choose Location
            </h3>
            <button
              onClick={() => setIsExpanded(false)}
              className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-4 h-4 text-gray-500" />
            </button>
          </div>

          {/* Current Location */}
          <div className="mb-4">
            <button
              onClick={() => {
                onLocationRequest();
                setIsExpanded(false);
              }}
              className="w-full flex items-center gap-3 p-3 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors text-left"
            >
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                <Navigation className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="font-medium text-blue-900">Use Current Location</p>
                <p className="text-sm text-blue-600">
                  {userLocation ? 'Update location' : 'Get my location'}
                </p>
              </div>
            </button>
          </div>

          {/* Predefined Locations */}
          <div className="space-y-2">
            <p className="text-sm font-medium text-gray-700 mb-2">Popular Locations</p>
            {predefinedLocations.map((location, index) => (
              <button
                key={index}
                onClick={() => handleLocationSelect(location)}
                className="w-full flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg transition-colors text-left"
              >
                <div className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center">
                  <Target className="w-3 h-3 text-gray-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">{location.name}</p>
                  <p className="text-xs text-gray-500">{location.district}</p>
                </div>
              </button>
            ))}
          </div>

          {/* Current Location Display */}
          {userLocation && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <p className="text-xs text-gray-500 mb-1">Current Location:</p>
              <div className="flex items-center gap-2">
                <MapPin className="w-3 h-3 text-green-600" />
                <p className="text-sm text-gray-700">
                  {userLocation.address || `${userLocation.lat.toFixed(4)}, ${userLocation.lng.toFixed(4)}`}
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Main Button */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className={`w-14 h-14 rounded-full shadow-lg transition-all duration-300 flex items-center justify-center ${
          isExpanded 
            ? 'bg-blue-600 text-white' 
            : 'bg-white text-gray-700 hover:bg-gray-50'
        }`}
      >
        {userLocation ? (
          <div className="relative">
            <MapPin className="w-6 h-6" />
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
          </div>
        ) : (
          <MapPin className="w-6 h-6" />
        )}
      </button>
    </div>
  );
};

export default MapButton;