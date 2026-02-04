
import React from 'react';

export type NavItem = 'loja' | 'conta' | 'garagem' | 'comunidade';

export enum GamificationLevel {
  Bronze = 'Bronze',
  Silver = 'Prata',
  Gold = 'Ouro',
  Platinum = 'Platina',
}

export interface Quest {
  id: string;
  title: string;
  description: string;
  points: number;
  icon: React.ElementType;
}

export interface AutomotiveEvent {
    id: string;
    title: string;
    date: string;
    location: string;
    imageUrl: string;
    attendees: number;
    price: string;
}

export interface User {
  name: string;
  avatarUrl: string;
  // Social Profile Data
  bio?: string;
  location?: string;
  instagram?: string;
  coverUrl?: string;
  isPublicProfile: boolean; 
  // Credit Analysis / Registration Data
  email?: string;
  phone?: string;
  cpf?: string;
  birthDate?: string;
  monthlyIncome?: number;
  occupation?: string;
  
  gamification: {
    level: GamificationLevel;
    points: number;
    pointsToNextLevel: number;
    streak: number; // Dias consecutivos
  };
  completedQuests: string[];
}

export interface Car {
  id?: string; // Added for list management
  make: string;
  model: string;
  year: number;
  imageUrl: string;
  licensePlate: string;
  vin: string;
}

export interface Comment {
    id: string;
    authorName: string;
    authorAvatar: string;
    content: string;
    timestamp: string;
}

export interface MarketplaceCar {
  id: string;
  make: string;
  model: string;
  year: number;
  price: number;
  imageUrl: string;
  description: string;
  mileage: number;
  color: string;
  fuelType: string;
  comments?: Comment[];
  likes: number;
  isLiked: boolean;
}

export interface Post {
    id: string;
    userId?: string;
    authorName: string;
    authorHandle: string;
    authorAvatar: string;
    content: string;
    imageUrl?: string;
    likes: number;
    comments: Comment[];
    timestamp: string;
    isLiked?: boolean;
}

export type FinancialService = 'financing' | 'consortium' | 'equity' | 'insurance';
