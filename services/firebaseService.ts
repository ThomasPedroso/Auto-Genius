// Firebase services disabled.
import type { User, MarketplaceCar, Post } from "../types";

export const getUserProfile = async (userId: string): Promise<User | null> => {
  return null;
};

export const updateUserProfile = async (userId: string, data: Partial<User>) => {
  console.log("Firebase disabled. Update would be:", data);
};

export const syncGamification = async (userId: string, gamificationData: User['gamification']) => {
   console.log("Firebase disabled. Gamification sync:", gamificationData);
};

export const getMarketplaceCars = async (): Promise<MarketplaceCar[]> => {
  return [];
};

export const addCarToMarketplace = async (car: Omit<MarketplaceCar, 'id'>) => {
  console.log("Firebase disabled. Add car:", car);
};

export const getPosts = async (): Promise<Post[]> => {
  return [];
};

export const uploadImage = async (file: File, path: string): Promise<string> => {
  return URL.createObjectURL(file); // Fallback to local blob for demo
};
