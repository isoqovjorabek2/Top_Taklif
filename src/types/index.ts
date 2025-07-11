export interface Deal {
  id: string;
  title: string;
  description: string;
  category: 'products' | 'real-estate' | 'courses';
  originalPrice: number;
  discountedPrice: number;
  discountPercentage: number;
  location: {
    lat: number;
    lng: number;
    address: string;
    district: string;
  };
  source: {
    platform: 'telegram' | 'instagram' | 'facebook' | 'twitter';
    username: string;
    postUrl: string;
    timestamp: Date;
  };
  image?: string;
  expiresAt: Date;
  isVerified: boolean;
  tags: string[];
}

export interface UserLocation {
  lat: number;
  lng: number;
  address?: string;
}

export interface FilterOptions {
  category?: Deal['category'];
  maxPrice?: number;
  minDiscount?: number;
  district?: string;
  radius?: number;
  sortBy?: 'newest' | 'discount' | 'distance' | 'price';
}

export interface Notification {
  id: string;
  type: 'new-deal' | 'price-drop' | 'expiring-soon';
  deal: Deal;
  timestamp: Date;
  isRead: boolean;
}

export interface DealFormData {
  title: string;
  description: string;
  category: Deal['category'];
  originalPrice: number;
  discountedPrice: number;
  location: {
    address: string;
    district: string;
  };
  image?: string;
  expiresAt: Date;
  tags: string[];
}