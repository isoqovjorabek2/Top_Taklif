import { Deal } from '../types';

export const mockDeals: Deal[] = [
  {
    id: '1',
    title: 'Samsung Galaxy S24 Ultra',
    description: 'Brand new Samsung Galaxy S24 Ultra with 256GB storage. Original box, warranty included.',
    category: 'products',
    originalPrice: 15000000,
    discountedPrice: 11500000,
    discountPercentage: 23,
    location: {
      lat: 41.2995,
      lng: 69.2401,
      address: 'Amir Temur Square, Tashkent',
      district: 'Yunusobod'
    },
    source: {
      platform: 'telegram',
      username: '@tech_deals_uz',
      postUrl: 'https://t.me/tech_deals_uz/1234',
      timestamp: new Date('2024-01-15T10:30:00Z')
    },
    image: 'https://images.pexels.com/photos/404280/pexels-photo-404280.jpeg?auto=compress&cs=tinysrgb&w=400',
    expiresAt: new Date('2024-01-20T23:59:59Z'),
    isVerified: true,
    tags: ['smartphone', 'samsung', 'electronics', 'new']
  },
  {
    id: '2',
    title: '2-Room Apartment in Chilanzar',
    description: 'Cozy 2-room apartment, 5th floor, fully furnished. Perfect for small family.',
    category: 'real-estate',
    originalPrice: 50000,
    discountedPrice: 42000,
    discountPercentage: 16,
    location: {
      lat: 41.2755,
      lng: 69.2037,
      address: 'Chilanzar District, Tashkent',
      district: 'Chilanzar'
    },
    source: {
      platform: 'instagram',
      username: '@tashkent_realty',
      postUrl: 'https://instagram.com/p/abc123',
      timestamp: new Date('2024-01-15T14:20:00Z')
    },
    image: 'https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?auto=compress&cs=tinysrgb&w=400',
    expiresAt: new Date('2024-01-25T23:59:59Z'),
    isVerified: true,
    tags: ['apartment', 'furnished', 'chilanzar', 'rent']
  },
  {
    id: '3',
    title: 'Full-Stack Web Development Course',
    description: 'Complete web development course with React, Node.js, and MongoDB. 6 months program.',
    category: 'courses',
    originalPrice: 3000000,
    discountedPrice: 2100000,
    discountPercentage: 30,
    location: {
      lat: 41.3111,
      lng: 69.2797,
      address: 'Mirzo Ulugbek District, Tashkent',
      district: 'Mirzo Ulugbek'
    },
    source: {
      platform: 'facebook',
      username: 'CodeAcademyUz',
      postUrl: 'https://facebook.com/CodeAcademyUz/posts/123',
      timestamp: new Date('2024-01-15T09:15:00Z')
    },
    image: 'https://images.pexels.com/photos/574071/pexels-photo-574071.jpeg?auto=compress&cs=tinysrgb&w=400',
    expiresAt: new Date('2024-01-18T23:59:59Z'),
    isVerified: true,
    tags: ['programming', 'course', 'web-development', 'react']
  },
  {
    id: '4',
    title: 'MacBook Pro M3 14"',
    description: 'MacBook Pro 14" with M3 chip, 16GB RAM, 512GB SSD. Barely used, excellent condition.',
    category: 'products',
    originalPrice: 25000000,
    discountedPrice: 19500000,
    discountPercentage: 22,
    location: {
      lat: 41.2646,
      lng: 69.2163,
      address: 'Shaykhantahur District, Tashkent',
      district: 'Shaykhantahur'
    },
    source: {
      platform: 'telegram',
      username: '@apple_store_uz',
      postUrl: 'https://t.me/apple_store_uz/5678',
      timestamp: new Date('2024-01-15T16:45:00Z')
    },
    image: 'https://images.pexels.com/photos/18105/pexels-photo.jpg?auto=compress&cs=tinysrgb&w=400',
    expiresAt: new Date('2024-01-19T23:59:59Z'),
    isVerified: true,
    tags: ['laptop', 'apple', 'macbook', 'used']
  },
  {
    id: '5',
    title: 'English Language Course',
    description: 'IELTS preparation course with native speakers. Small groups, intensive program.',
    category: 'courses',
    originalPrice: 2500000,
    discountedPrice: 1750000,
    discountPercentage: 30,
    location: {
      lat: 41.3195,
      lng: 69.2519,
      address: 'Yashnobod District, Tashkent',
      district: 'Yashnobod'
    },
    source: {
      platform: 'instagram',
      username: '@english_center_uz',
      postUrl: 'https://instagram.com/p/def456',
      timestamp: new Date('2024-01-15T11:30:00Z')
    },
    image: 'https://images.pexels.com/photos/159581/dictionary-reference-book-learning-meaning-159581.jpeg?auto=compress&cs=tinysrgb&w=400',
    expiresAt: new Date('2024-01-22T23:59:59Z'),
    isVerified: false,
    tags: ['english', 'ielts', 'language', 'course']
  },
  {
    id: '6',
    title: 'Studio Apartment in Sergeli',
    description: 'Modern studio apartment, 25m², new building with parking. Great investment opportunity.',
    category: 'real-estate',
    originalPrice: 35000,
    discountedPrice: 28000,
    discountPercentage: 20,
    location: {
      lat: 41.2031,
      lng: 69.2228,
      address: 'Sergeli District, Tashkent',
      district: 'Sergeli'
    },
    source: {
      platform: 'facebook',
      username: 'SergeligRealEstate',
      postUrl: 'https://facebook.com/SergeligRealEstate/posts/789',
      timestamp: new Date('2024-01-15T13:00:00Z')
    },
    image: 'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=400',
    expiresAt: new Date('2024-01-30T23:59:59Z'),
    isVerified: true,
    tags: ['studio', 'apartment', 'new-building', 'sergeli']
  }
];

export const tashkentDistricts = [
  'Bektemir',
  'Chilanzar',
  'Mirzo Ulugbek',
  'Mirobod',
  'Olmazor',
  'Sergeli',
  'Shaykhantahur',
  'Uchtepa',
  'Yashnobod',
  'Yunusobod',
  'Yakkasaray'
];