
import React from 'react';
import { Award, Flame } from 'lucide-react';
import type { User } from '../types';

interface GamificationCardProps {
  gamification: User['gamification'];
}

const GamificationCard: React.FC<GamificationCardProps> = ({ gamification }) => {
  const { level, points, pointsToNextLevel, streak } = gamification;
  const progressPercentage = (points / pointsToNextLevel) * 100;

  return (
    <div className="bg-gray-800 rounded-xl overflow-hidden shadow-lg border border-gray-700 p-6">
        <div className="space-y-6">
            {/* Header with Level and Streak */}
            <div className="flex justify-between items-start">
                <div>
                    <h2 className="text-xs uppercase tracking-widest text-gray-400 mb-1">Nível Atual</h2>
                    <div className="flex items-center space-x-2">
                        <Award className="text-brand-blue" size={28} />
                        <span className="text-2xl font-black text-white">{level}</span>
                    </div>
                </div>
                
                <div className="flex flex-col items-end">
                        <h2 className="text-xs uppercase tracking-widest text-gray-400 mb-1">Ofensiva</h2>
                        <div className="flex items-center gap-1 bg-brand-orange/10 border border-brand-orange/30 px-3 py-1 rounded-full">
                            <Flame className="text-brand-orange" size={18} fill="currentColor" />
                            <span className="font-bold text-brand-orange">{streak} dias</span>
                        </div>
                </div>
            </div>

            {/* Progress Bar */}
            <div className="space-y-2">
                <div className="flex justify-between text-sm font-medium">
                    <span className="text-white">{points} pts</span>
                    <span className="text-gray-500">{pointsToNextLevel} pts</span>
                </div>
                <div className="w-full bg-gray-900 rounded-full h-4 border border-gray-700 p-0.5">
                    <div
                        className="bg-gradient-to-r from-brand-blue to-brand-teal h-full rounded-full transition-all duration-1000 relative"
                        style={{ width: `${progressPercentage}%` }}
                    >
                        <div className="absolute right-0 top-0 bottom-0 w-2 bg-white/30 animate-pulse rounded-r-full"></div>
                    </div>
                </div>
                <p className="text-xs text-center text-gray-500 pt-1">
                    Você precisa de mais <span className="text-white font-bold">{pointsToNextLevel - points}</span> pontos para o próximo nível.
                </p>
            </div>
        </div>
    </div>
  );
};

export default GamificationCard;
