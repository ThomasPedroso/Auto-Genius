export enum GamificationLevel {
  Bronze = 'Bronze',
  Silver = 'Prata',
  Gold = 'Ouro',
  Platinum = 'Platina',
}

export interface User {
  name: string;
  avatarUrl: string;
  bio?: string;
  location?: string;
  instagram?: string;
  coverUrl?: string;
  isPublicProfile: boolean;
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
    streak: number;
  };
  completedQuests: string[];
}

export interface Car {
  id?: string;
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

export interface AutomotiveEvent {
  id: string;
  title: string;
  date: string;
  location: string;
  imageUrl: string;
  attendees: number;
  price: string;
}

export interface SimulationResult {
  title: string;
  details: Array<{ label: string; value: string }>;
  disclaimer: string;
}
