
import React from 'react';
import { Store, User, Car, Users } from 'lucide-react';
import type { NavItem } from '../types';

interface BottomNavProps {
  activeView: NavItem;
  setActiveView: (view: NavItem) => void;
}

const NavButton: React.FC<{
  label: string;
  icon: React.ReactNode;
  isActive: boolean;
  onClick: () => void;
}> = ({ label, icon, isActive, onClick }) => (
  <button
    onClick={onClick}
    className={`flex flex-col items-center justify-center w-full transition-colors duration-200 ${
      isActive ? 'text-brand-blue' : 'text-gray-400 hover:text-white'
    }`}
  >
    {icon}
    <span className="text-xs mt-1">{label}</span>
  </button>
);

const BottomNav: React.FC<BottomNavProps> = ({ activeView, setActiveView }) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 h-16 bg-gray-800 border-t border-gray-700 flex justify-around items-center shadow-lg z-50">
      <NavButton
        label="Loja"
        icon={<Store size={24} />}
        isActive={activeView === 'loja'}
        onClick={() => setActiveView('loja')}
      />
      <NavButton
        label="Comunidade"
        icon={<Users size={24} />}
        isActive={activeView === 'comunidade'}
        onClick={() => setActiveView('comunidade')}
      />
      <NavButton
        label="Garagem"
        icon={<Car size={24} />}
        isActive={activeView === 'garagem'}
        onClick={() => setActiveView('garagem')}
      />
      <NavButton
        label="Conta"
        icon={<User size={24} />}
        isActive={activeView === 'conta'}
        onClick={() => setActiveView('conta')}
      />
    </div>
  );
};

export default BottomNav;
