import React from 'react';
import { Clock, MapPin, ShieldCheck, ExternalLink, Tag, Heart, Share2, Bookmark } from 'lucide-react';
import { Deal } from '../types';
import { useTheme } from '../contexts/ThemeContext';

interface DealCardProps {
  deal: Deal;
  onSelect: (deal: Deal) => void;
  isSelected?: boolean;
}

const DealCard: React.FC<DealCardProps> = ({ deal, onSelect, isSelected }) => {
  const { isCompactView } = useTheme();
  const [isLiked, setIsLiked] = React.useState(false);
  const [isSaved, setIsSaved] = React.useState(false);
  const [isHovered, setIsHovered] = React.useState(false);

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

  const formatExpiryTime = (date: Date) => {
    const now = new Date();
    const diffMs = date.getTime() - now.getTime();
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffHours / 24);

    if (diffHours < 24) return `${diffHours}h left`;
    return `${diffDays}d left`;
  };

  const getCategoryColor = (category: Deal['category']) => {
    switch (category) {
      case 'products':
        return 'bg-blue-100 text-blue-800';
      case 'real-estate':
        return 'bg-green-100 text-green-800';
      case 'courses':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'telegram':
        return '📱';
      case 'instagram':
        return '📸';
      case 'facebook':
        return '📘';
      case 'twitter':
        return '🐦';
      default:
        return '🌐';
    }
  };

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsLiked(!isLiked);
  };

  const handleSave = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsSaved(!isSaved);
  };

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (navigator.share) {
      navigator.share({
        title: deal.title,
        text: deal.description,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  return (
    <div
      className={`bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer border-2 ${
        isSelected ? 'border-blue-500 ring-2 ring-blue-200' : 'border-transparent hover:border-gray-200'
      } transform hover:scale-105`}
      onClick={() => onSelect(deal)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative">
        {deal.image && (
          <img
            src={deal.image}
            alt={deal.title}
            className={`w-full ${isCompactView ? 'h-32' : 'h-48'} object-cover rounded-t-xl`}
          />
        )}
        
        {/* Discount Badge */}
        <div className="absolute top-3 right-3 bg-red-500 text-white px-2 py-1 rounded-full text-sm font-semibold">
          -{deal.discountPercentage}%
        </div>
        
        {/* Verified Badge */}
        {deal.isVerified && (
          <div className="absolute top-3 left-3 bg-green-500 text-white p-1 rounded-full">
            <ShieldCheck className="w-4 h-4" />
          </div>
        )}
        
        {/* Interactive Action Buttons */}
        <div className={`absolute top-3 left-1/2 transform -translate-x-1/2 flex gap-2 transition-all duration-300 ${
          isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'
        }`}>
          <button
            onClick={handleLike}
            className={`p-2 rounded-full backdrop-blur-sm transition-all duration-200 ${
              isLiked 
                ? 'bg-red-500 text-white shadow-lg' 
                : 'bg-white/80 text-gray-600 hover:bg-red-50 hover:text-red-500'
            }`}
          >
            <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
          </button>
          <button
            onClick={handleSave}
            className={`p-2 rounded-full backdrop-blur-sm transition-all duration-200 ${
              isSaved 
                ? 'bg-blue-500 text-white shadow-lg' 
                : 'bg-white/80 text-gray-600 hover:bg-blue-50 hover:text-blue-500'
            }`}
          >
            <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
          </button>
          <button
            onClick={handleShare}
            className="p-2 rounded-full bg-white/80 text-gray-600 hover:bg-green-50 hover:text-green-500 backdrop-blur-sm transition-all duration-200"
          >
            <Share2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className={isCompactView ? 'p-3' : 'p-4'}>
        {/* Category */}
        <div className="flex items-center justify-between mb-2">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(deal.category)}`}>
            {deal.category.replace('-', ' ')}
          </span>
          <span className="text-xs text-gray-500 flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {formatTimeAgo(deal.source.timestamp)}
          </span>
        </div>

        {/* Title */}
        <h3 className="font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2">{deal.title}</h3>

        {/* Description */}
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">{deal.description}</p>

        {/* Price */}
        <div className="flex items-center gap-2 mb-3">
          <span className="text-lg font-bold text-green-600">
            {deal.discountedPrice.toLocaleString()} UZS
          </span>
          <span className="text-sm text-gray-500 line-through">
            {deal.originalPrice.toLocaleString()} UZS
          </span>
        </div>

        {/* Location */}
        <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400 mb-3">
          <MapPin className="w-4 h-4" />
          <span>{deal.location.district}, {deal.location.address}</span>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1 mb-3">
          {deal.tags.slice(0, 3).map((tag, index) => (
            <span
              key={index}
              className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-xs flex items-center gap-1"
            >
              <Tag className="w-3 h-3" />
              {tag}
            </span>
          ))}
        </div>

        {/* Source and Expiry */}
        <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
          <div className="flex items-center gap-1">
            <span>{getPlatformIcon(deal.source.platform)}</span>
            <span>@{deal.source.username}</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            <span>{formatExpiryTime(deal.expiresAt)}</span>
          </div>
        </div>

        {/* Action Button */}
        <div className="mt-4 pt-3 border-t border-gray-100 dark:border-gray-700">
          <button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-4 py-2 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 transform hover:scale-105 shadow-md hover:shadow-lg">
            <ExternalLink className="w-4 h-4" />
            View Deal
          </button>
        </div>
      </div>
    </div>
  );
};

export default DealCard;