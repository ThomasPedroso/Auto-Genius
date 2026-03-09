import { create } from 'zustand';

// Types for user profile and gamification
export type UserLevel = 'Bronze' | 'Silver' | 'Gold' | 'Platinum';

export interface UserProfile {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  xp: number;
  level: UserLevel;
  savedCars: string[];
}

interface UserStoreState {
  user: UserProfile | null;
  isLoading: boolean;
  setUser: (user: UserProfile | null) => void;
  setLoading: (isLoading: boolean) => void;
  addXP: (amount: number) => void;
  saveCar: (carId: string) => void;
  removeSavedCar: (carId: string) => void;
}

export const useUserStore = create<UserStoreState>((set) => ({
  user: null,
  isLoading: true, // initial state is true while checking firebase auth
  setUser: (user) => set({ user }),
  setLoading: (isLoading) => set({ isLoading }),
  
  addXP: (amount) => set((state) => {
    if (!state.user) return state;
    
    const newXP = state.user.xp + amount;
    let newLevel: UserLevel = 'Bronze';
    
    if (newXP >= 1000) newLevel = 'Platinum';
    else if (newXP >= 500) newLevel = 'Gold';
    else if (newXP >= 200) newLevel = 'Silver';
    
    return {
      user: {
        ...state.user,
        xp: newXP,
        level: newLevel
      }
    };
  }),

  saveCar: (carId) => set((state) => {
    if (!state.user) return state;
    if (state.user.savedCars.includes(carId)) return state;
    return { user: { ...state.user, savedCars: [...state.user.savedCars, carId] } };
  }),

  removeSavedCar: (carId) => set((state) => {
    if (!state.user) return state;
    return { user: { ...state.user, savedCars: state.user.savedCars.filter(id => id !== carId) } };
  })
}));
