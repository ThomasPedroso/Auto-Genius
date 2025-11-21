
import React from 'react';
import { Trophy, X, Star } from 'lucide-react';
import { GamificationLevel } from '../../types';

interface LevelUpModalProps {
  isOpen: boolean;
  onClose: () => void;
  newLevel: GamificationLevel;
}

const LevelUpModal: React.FC<LevelUpModalProps> = ({ isOpen, onClose, newLevel }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-md flex items-center justify-center z-[110] p-4 animate-[fadeIn_0.3s_ease-out]">
      <div className="bg-gray-800 rounded-2xl w-full max-w-sm text-center p-8 border-2 border-brand-blue relative shadow-[0_0_50px_rgba(23,90,200,0.4)] overflow-hidden">
        
        {/* Decorative Background Elements */}
        <div className="absolute -top-10 -left-10 w-32 h-32 bg-brand-blue/30 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-brand-teal/30 rounded-full blur-3xl"></div>

        <button 
            onClick={onClose} 
            className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors z-20"
        >
            <X size={24} />
        </button>

        <div className="relative z-10 flex flex-col items-center">
            <div className="mb-6 relative">
                 <div className="absolute inset-0 animate-ping bg-brand-blue/50 rounded-full duration-1000"></div>
                 <div className="bg-gradient-to-br from-brand-blue to-brand-teal p-5 rounded-full shadow-xl relative z-10">
                    <Trophy size={48} className="text-white" />
                 </div>
                 <div className="absolute -top-2 -right-2 text-yellow-400 animate-bounce">
                     <Star size={24} fill="currentColor" />
                 </div>
            </div>

            <h2 className="text-3xl font-black text-white mb-2 uppercase tracking-wider italic">Level Up!</h2>
            <p className="text-gray-300 mb-6">Parabéns! Você alcançou o nível</p>
            
            <div className="bg-gray-900/80 py-3 px-8 rounded-lg border border-gray-700 mb-6 w-full">
                <span className="text-2xl font-bold text-brand-blue">{newLevel}</span>
            </div>

            <button 
                onClick={onClose}
                className="w-full bg-brand-blue hover:bg-brand-blue-dark text-white font-bold py-3 px-6 rounded-full transition-all transform hover:scale-105 shadow-lg"
            >
                Continuar Jornada
            </button>
        </div>
      </div>
    </div>
  );
};

export default LevelUpModal;
