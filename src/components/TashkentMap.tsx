import React, { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { Deal, UserLocation } from '../types';
import 'leaflet/dist/leaflet.css';

// Fix for default markers in react-leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface TashkentMapProps {
  deals: Deal[];
  userLocation: UserLocation | null;
  onDealSelect: (deal: Deal) => void;
  selectedDeal?: Deal | null;
  className?: string;
}

// Custom marker icons for different categories
const createCustomIcon = (category: Deal['category'], isSelected: boolean = false) => {
  const colors = {
    products: '#3B82F6',
    'real-estate': '#10B981',
    courses: '#8B5CF6'
  };

  const size = isSelected ? 35 : 25;
  const color = colors[category];

  return L.divIcon({
    html: `
      <div style="
        width: ${size}px;
        height: ${size}px;
        background-color: ${color};
        border: 3px solid white;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 2px 8px rgba(0,0,0,0.3);
        font-size: ${size > 30 ? '16px' : '12px'};
        ${isSelected ? 'animation: pulse 2s infinite;' : ''}
      ">
        ${category === 'products' ? '🛍️' : category === 'real-estate' ? '🏠' : '📚'}
      </div>
      <style>
        @keyframes pulse {
          0% { transform: scale(1); }
          50% { transform: scale(1.1); }
          100% { transform: scale(1); }
        }
      </style>
    `,
    className: 'custom-div-icon',
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
  });
};

// User location marker
const createUserIcon = () => {
  return L.divIcon({
    html: `
      <div style="
        width: 20px;
        height: 20px;
        background-color: #2563EB;
        border: 3px solid white;
        border-radius: 50%;
        box-shadow: 0 2px 8px rgba(0,0,0,0.3);
        animation: userPulse 2s infinite;
      "></div>
      <style>
        @keyframes userPulse {
          0% { 
            transform: scale(1);
            box-shadow: 0 2px 8px rgba(0,0,0,0.3), 0 0 0 0 rgba(37, 99, 235, 0.7);
          }
          70% {
            transform: scale(1);
            box-shadow: 0 2px 8px rgba(0,0,0,0.3), 0 0 0 10px rgba(37, 99, 235, 0);
          }
          100% {
            transform: scale(1);
            box-shadow: 0 2px 8px rgba(0,0,0,0.3), 0 0 0 0 rgba(37, 99, 235, 0);
          }
        }
      </style>
    `,
    className: 'user-location-icon',
    iconSize: [20, 20],
    iconAnchor: [10, 10],
  });
};

// Component to handle map events and updates
const MapController: React.FC<{ center: [number, number]; selectedDeal?: Deal | null }> = ({ center, selectedDeal }) => {
  const map = useMap();

  useEffect(() => {
    if (selectedDeal) {
      map.setView([selectedDeal.location.lat, selectedDeal.location.lng], 15, {
        animate: true,
        duration: 1
      });
    }
  }, [selectedDeal, map]);

  useEffect(() => {
    map.setView(center, map.getZoom());
  }, [center, map]);

  return null;
};

const TashkentMap: React.FC<TashkentMapProps> = ({
  deals,
  userLocation,
  onDealSelect,
  selectedDeal,
  className = "w-full h-96"
}) => {
  const mapRef = useRef<L.Map>(null);

  // Default center (Tashkent city center)
  const defaultCenter: [number, number] = [41.2995, 69.2401];
  const mapCenter: [number, number] = userLocation 
    ? [userLocation.lat, userLocation.lng] 
    : defaultCenter;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('uz-UZ').format(price);
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
  };

  return (
    <div className={`${className} rounded-xl overflow-hidden shadow-lg border border-gray-200`}>
      <MapContainer
        center={mapCenter}
        zoom={12}
        style={{ height: '100%', width: '100%' }}
        ref={mapRef}
        zoomControl={true}
        scrollWheelZoom={true}
      >
        <MapController center={mapCenter} selectedDeal={selectedDeal} />
        
        {/* OpenStreetMap tiles */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* User location marker */}
        {userLocation && (
          <Marker
            position={[userLocation.lat, userLocation.lng]}
            icon={createUserIcon()}
          >
            <Popup>
              <div className="text-center">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
                  <span className="font-semibold text-blue-900">Your Location</span>
                </div>
                <p className="text-sm text-gray-600">
                  {userLocation.address || 'Current Position'}
                </p>
              </div>
            </Popup>
          </Marker>
        )}

        {/* Deal markers */}
        {deals.map((deal) => (
          <Marker
            key={deal.id}
            position={[deal.location.lat, deal.location.lng]}
            icon={createCustomIcon(deal.category, selectedDeal?.id === deal.id)}
            eventHandlers={{
              click: () => onDealSelect(deal),
            }}
          >
            <Popup maxWidth={300} className="deal-popup">
              <div className="p-2">
                {/* Deal Image */}
                {deal.image && (
                  <img
                    src={deal.image}
                    alt={deal.title}
                    className="w-full h-32 object-cover rounded-lg mb-3"
                  />
                )}

                {/* Deal Header */}
                <div className="flex items-center justify-between mb-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    deal.category === 'products' ? 'bg-blue-100 text-blue-800' :
                    deal.category === 'real-estate' ? 'bg-green-100 text-green-800' :
                    'bg-purple-100 text-purple-800'
                  }`}>
                    {deal.category.replace('-', ' ')}
                  </span>
                  <div className="bg-red-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
                    -{deal.discountPercentage}%
                  </div>
                </div>

                {/* Deal Title */}
                <h3 className="font-semibold text-gray-900 mb-2 text-sm leading-tight">
                  {deal.title}
                </h3>

                {/* Price */}
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-lg font-bold text-green-600">
                    {formatPrice(deal.discountedPrice)} UZS
                  </span>
                  <span className="text-sm text-gray-500 line-through">
                    {formatPrice(deal.originalPrice)} UZS
                  </span>
                </div>

                {/* Location */}
                <div className="flex items-center gap-1 text-xs text-gray-600 mb-2">
                  <span>📍</span>
                  <span>{deal.location.district}</span>
                </div>

                {/* Source and Time */}
                <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                  <span>
                    {deal.source.platform === 'telegram' ? '📱' : 
                     deal.source.platform === 'instagram' ? '📸' : 
                     deal.source.platform === 'facebook' ? '📘' : '🐦'} 
                    @{deal.source.username}
                  </span>
                  <span>{formatTimeAgo(deal.source.timestamp)}</span>
                </div>

                {/* Action Button */}
                <button
                  onClick={() => onDealSelect(deal)}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                  View Details
                </button>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      {/* Map Legend */}
      <div className="absolute top-4 right-4 bg-white rounded-lg shadow-lg p-3 z-[1000]">
        <h4 className="text-sm font-semibold text-gray-900 mb-2">Legend</h4>
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs">
            <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center text-white">🛍️</div>
            <span>Products</span>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center text-white">🏠</div>
            <span>Real Estate</span>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <div className="w-4 h-4 bg-purple-500 rounded-full flex items-center justify-center text-white">📚</div>
            <span>Courses</span>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <div className="w-4 h-4 bg-blue-600 rounded-full border-2 border-white"></div>
            <span>Your Location</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TashkentMap;