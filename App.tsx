
import React, { useState, useEffect, useCallback } from 'react';
import BottomNav from './components/BottomNav';
import Dashboard from './components/Dashboard';
import Profile from './components/Profile';
import Marketplace from './components/Marketplace';
import CarDetail from './components/CarDetail';
import SocialFeed from './components/SocialFeed';
import { GamificationLevel } from './types';
import type { NavItem, User, Car, MarketplaceCar } from './types';
import { MOCK_USER, MOCK_CAR } from './constants';
import LevelUpModal from './components/common/LevelUpModal';
import { getUserProfile, getUserGarage, updateUserProfile, addCarToGarage, updateGarageCar, deleteGarageCar, subscribeToGarage } from './services/firebaseService';
import Loader from './components/common/Loader';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Login from './components/Login';

const AuthenticatedApp: React.FC = () => {
  const [activeView, setActiveView] = useState<NavItem>('loja');
  const [user, setUser] = useState<User>(MOCK_USER);
  const [garage, setGarage] = useState<Car[]>([]);
  const [selectedCar, setSelectedCar] = useState<MarketplaceCar | null>(null);
  const [loadingInit, setLoadingInit] = useState(true);
  const { currentUser } = useAuth();
  
  const [visitingUser, setVisitingUser] = useState<User | null>(null);
  const [visitingGarage, setVisitingGarage] = useState<Car[]>([]);
  
  const [showLevelUpModal, setShowLevelUpModal] = useState(false);
  const [newLevelReached, setNewLevelReached] = useState<GamificationLevel>(GamificationLevel.Bronze);

  useEffect(() => {
    if (!currentUser) return;

    // Subscribe to Garage Changes in Realtime
    const unsubscribeGarage = subscribeToGarage(undefined, (updatedGarage) => {
        setGarage(updatedGarage);
    });

    // Initial Fetch for Profile
    const initData = async () => {
        try {
            const loadedUser = await getUserProfile();
            if (loadedUser) setUser(loadedUser);
        } catch (error) {
            console.error("Failed to init data", error);
        } finally {
            setLoadingInit(false);
        }
    };
    initData();

    return () => unsubscribeGarage();
  }, [currentUser]);

  const handleSelectCar = useCallback((car: MarketplaceCar) => {
    setSelectedCar(car);
  }, []);

  const handleBackToMarketplace = useCallback(() => {
    setSelectedCar(null);
  }, []);

  const handleVisitProfile = useCallback(async (userId: string) => {
      if (!userId) return;
      if (userId === currentUser?.uid) {
          setActiveView('garagem');
          return;
      }

      setLoadingInit(true);
      try {
          const vUser = await getUserProfile(userId);
          const vGarage = await getUserGarage(userId);
          
          if (vUser) {
              setVisitingUser(vUser);
              setVisitingGarage(vGarage);
          }
      } catch (error) {
          console.error("Failed to visit profile", error);
      } finally {
          setLoadingInit(false);
      }
  }, [currentUser]);

  const handleExitVisit = useCallback(() => {
      setVisitingUser(null);
      setVisitingGarage([]);
  }, []);

  const handleCompleteQuest = useCallback(async (questId: string, points: number) => {
    let updatedUser = { ...user };
    let nextLevelValue = GamificationLevel.Bronze;

    if (user.completedQuests.includes(questId)) return;

    const newPoints = user.gamification.points + points;
    const { pointsToNextLevel, level: currentLevel } = user.gamification;
    
    if (newPoints >= pointsToNextLevel) {
      const nextLevelMap = {
          [GamificationLevel.Bronze]: GamificationLevel.Silver,
          [GamificationLevel.Silver]: GamificationLevel.Gold,
          [GamificationLevel.Gold]: GamificationLevel.Platinum,
          [GamificationLevel.Platinum]: GamificationLevel.Platinum,
      };

      const nextLevel = nextLevelMap[currentLevel];

      if (nextLevel !== currentLevel) {
          nextLevelValue = nextLevel;
          setNewLevelReached(nextLevel);
          setShowLevelUpModal(true);
      }

      updatedUser = {
        ...user,
        completedQuests: [...user.completedQuests, questId],
        gamification: {
          ...user.gamification,
          level: nextLevel,
          points: newPoints - pointsToNextLevel,
          pointsToNextLevel: pointsToNextLevel * 2,
        },
      };
    } else {
        updatedUser = {
            ...user,
            completedQuests: [...user.completedQuests, questId],
            gamification: {
                ...user.gamification,
                points: newPoints,
            },
        };
    }

    setUser(updatedUser);
    await updateUserProfile(updatedUser); 
  }, [user]);

  const handleUpdateProfile = useCallback(async (updates: Partial<User>) => {
    const updatedUser = { ...user, ...updates };
    setUser(updatedUser);
    await updateUserProfile(updates);
  }, [user]);

  const handleAddCar = useCallback(async (newCar: Car) => {
      // Optimistic update is hard with IDs, relying on subscription
      await addCarToGarage(newCar);
  }, []);

  const handleUpdateCar = useCallback(async (carId: string, updates: Partial<Car>) => {
      await updateGarageCar(carId, updates);
  }, []);

  const handleDeleteCar = useCallback(async (carId: string) => {
      await deleteGarageCar(carId);
  }, []);

  const handleViewGarageCar = useCallback((garageCar: Car) => {
    const carForDetail: MarketplaceCar = {
        id: garageCar.id || 'temp-id',
        make: garageCar.make,
        model: garageCar.model,
        year: garageCar.year,
        imageUrl: garageCar.imageUrl,
        price: 0,
        description: `Veículo da garagem de ${visitingUser ? visitingUser.name : user.name}.`,
        mileage: 0,
        color: '-',
        fuelType: '-',
        likes: 0,
        isLiked: false
    };
    setSelectedCar(carForDetail);
  }, [visitingUser, user.name]);

  const renderView = () => {
    if (visitingUser) {
        return (
            <Profile 
                user={visitingUser} 
                garage={visitingGarage} 
                onUpdateProfile={() => {}} 
                onAddCar={() => {}}
                onUpdateCar={() => {}}
                onDeleteCar={() => {}}
                onViewCarDetails={handleViewGarageCar}
                isReadOnly={true}
                onBack={handleExitVisit}
            />
        );
    }

    switch (activeView) {
      case 'loja':
        return <Marketplace onSelectCar={handleSelectCar} />;
      case 'conta':
        return <Dashboard user={user} onCompleteQuest={handleCompleteQuest} onUpdateProfile={handleUpdateProfile} />;
      case 'garagem':
        return <Profile 
                  user={user} 
                  garage={garage} 
                  onUpdateProfile={handleUpdateProfile} 
                  onAddCar={handleAddCar}
                  onUpdateCar={handleUpdateCar}
                  onDeleteCar={handleDeleteCar}
                  onViewCarDetails={handleViewGarageCar}
                />;
      case 'comunidade':
        return <SocialFeed user={user} onVisitProfile={handleVisitProfile} />;
      default:
        return <Marketplace onSelectCar={handleSelectCar} />;
    }
  };

  if (loadingInit) return <div className="bg-gray-900 text-white min-h-screen flex items-center justify-center"><Loader text="Carregando..." /></div>;

  return (
    <div className="bg-gray-900 text-white min-h-screen font-sans">
      <LevelUpModal isOpen={showLevelUpModal} onClose={() => setShowLevelUpModal(false)} newLevel={newLevelReached} />
      {selectedCar ? (
        <CarDetail car={selectedCar} onBack={handleBackToMarketplace} isOwner={activeView === 'garagem' && !visitingUser} />
      ) : (
        <>
          <div className="pb-20">{renderView()}</div>
          {!visitingUser && <BottomNav activeView={activeView} setActiveView={setActiveView} />}
        </>
      )}
    </div>
  );
}

const AppWrapper: React.FC = () => <AuthProvider><AuthCheck /></AuthProvider>;
const AuthCheck: React.FC = () => {
    const { currentUser, loading } = useAuth();
    if (loading) return <div className="bg-gray-900 text-white min-h-screen flex items-center justify-center"><Loader /></div>;
    return currentUser ? <AuthenticatedApp /> : <Login />;
}

export default AppWrapper;
