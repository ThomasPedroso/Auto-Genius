
import React, { useState } from 'react';
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

const App: React.FC = () => {
  const [activeView, setActiveView] = useState<NavItem>('loja');
  const [user, setUser] = useState<User>(MOCK_USER);
  const [car, setCar] = useState<Car>(MOCK_CAR);
  const [selectedCar, setSelectedCar] = useState<MarketplaceCar | null>(null);
  
  // Level Up Modal State
  const [showLevelUpModal, setShowLevelUpModal] = useState(false);
  const [newLevelReached, setNewLevelReached] = useState<GamificationLevel>(GamificationLevel.Bronze);

  const handleSelectCar = (car: MarketplaceCar) => {
    setSelectedCar(car);
  };

  const handleBackToMarketplace = () => {
    setSelectedCar(null);
  };

  const handleCompleteQuest = (questId: string, points: number) => {
    setUser(currentUser => {
      if (currentUser.completedQuests.includes(questId)) {
        return currentUser;
      }

      const newPoints = currentUser.gamification.points + points;
      const { pointsToNextLevel, level: currentLevel } = currentUser.gamification;
      
      if (newPoints >= pointsToNextLevel) {
        const nextLevelMap = {
            [GamificationLevel.Bronze]: GamificationLevel.Silver,
            [GamificationLevel.Silver]: GamificationLevel.Gold,
            [GamificationLevel.Gold]: GamificationLevel.Platinum,
            [GamificationLevel.Platinum]: GamificationLevel.Platinum,
        };

        const nextLevel = nextLevelMap[currentLevel];

        // Trigger Modal if level actually changed
        if (nextLevel !== currentLevel) {
            setNewLevelReached(nextLevel);
            setShowLevelUpModal(true);
        }

        return {
          ...currentUser,
          completedQuests: [...currentUser.completedQuests, questId],
          gamification: {
            ...currentUser.gamification,
            level: nextLevel,
            points: newPoints - pointsToNextLevel,
            pointsToNextLevel: pointsToNextLevel * 2,
          },
        };
      }
      
      return {
        ...currentUser,
        completedQuests: [...currentUser.completedQuests, questId],
        gamification: {
          ...currentUser.gamification,
          points: newPoints,
        },
      };
    });
  };

  const handleUpdateProfile = (updates: Partial<User>) => {
    setUser(currentUser => ({
      ...currentUser,
      ...updates,
    }));
  };

  const handleUpdateCar = (updatedCar: Car) => {
    setCar(updatedCar);
  };

  // Converts the user's simple Car object to a MarketplaceCar object for the detail view
  const handleViewGarageCar = (garageCar: Car) => {
    const carForDetail: MarketplaceCar = {
        id: 'my-garage-car',
        make: garageCar.make,
        model: garageCar.model,
        year: garageCar.year,
        imageUrl: garageCar.imageUrl,
        // Map specific fields or use defaults/placeholders for fields not in the basic Car type
        price: 0, // Indicates not for sale or value unknown
        description: `Veículo cadastrado na minha garagem. \nPlaca: ${garageCar.licensePlate}\nChassi (VIN): ${garageCar.vin}`,
        mileage: 0,
        color: 'Não informado',
        fuelType: 'Não informado',
        likes: 0,
        isLiked: false
    };
    setSelectedCar(carForDetail);
  };

  const renderView = () => {
    switch (activeView) {
      case 'loja':
        return <Marketplace onSelectCar={handleSelectCar} />;
      case 'conta':
        return <Dashboard user={user} onCompleteQuest={handleCompleteQuest} onUpdateProfile={handleUpdateProfile} />;
      case 'garagem':
        return <Profile 
                  user={user} 
                  car={car} 
                  onUpdateProfile={handleUpdateProfile} 
                  onUpdateCar={handleUpdateCar} 
                  onViewCarDetails={handleViewGarageCar}
                />;
      case 'comunidade':
        return <SocialFeed user={user} />;
      default:
        return <Marketplace onSelectCar={handleSelectCar} />;
    }
  };

  return (
    <div className="bg-gray-900 text-white min-h-screen font-sans">
      <LevelUpModal 
        isOpen={showLevelUpModal} 
        onClose={() => setShowLevelUpModal(false)} 
        newLevel={newLevelReached} 
      />

      {selectedCar ? (
        <CarDetail 
          car={selectedCar} 
          onBack={handleBackToMarketplace} 
          isOwner={activeView === 'garagem'}
        />
      ) : (
        <>
          <div className="pb-20">
            {renderView()}
          </div>
          <BottomNav activeView={activeView} setActiveView={setActiveView} />
        </>
      )}
    </div>
  );
};

export default App;
