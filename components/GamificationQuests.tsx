
import React from 'react';
import type { Quest } from '../types';
import { CheckCircle, Circle } from 'lucide-react';

interface GamificationQuestsProps {
  quests: Quest[];
  completedQuests: string[];
  onCompleteQuest: (questId: string, points: number) => void;
}

const GamificationQuests: React.FC<GamificationQuestsProps> = ({ quests, completedQuests, onCompleteQuest }) => {
  return (
    <div className="bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-700">
      <h2 className="text-lg font-semibold text-white mb-4">Quests for You</h2>
      <div className="space-y-4">
        {quests.map((quest) => {
          const isCompleted = completedQuests.includes(quest.id);
          const Icon = quest.icon;

          return (
            <div
              key={quest.id}
              className={`flex items-center justify-between p-4 rounded-lg ${
                isCompleted ? 'bg-green-500/10' : 'bg-gray-700'
              }`}
            >
              <div className="flex items-center space-x-4">
                <Icon
                  size={24}
                  className={isCompleted ? 'text-green-400' : 'text-blue-400'}
                />
                <div>
                  <h3 className={`font-semibold ${isCompleted ? 'text-gray-300' : 'text-white'}`}>
                    {quest.title}
                  </h3>
                  <p className="text-sm text-gray-400">{quest.description}</p>
                </div>
              </div>
              <div className="text-right">
                <button
                  onClick={() => !isCompleted && onCompleteQuest(quest.id, quest.points)}
                  disabled={isCompleted}
                  className={`flex items-center space-x-2 px-3 py-1.5 rounded-full text-sm font-bold transition-colors duration-200 ${
                    isCompleted
                      ? 'bg-green-500/20 text-green-300 cursor-default'
                      : 'bg-blue-600 hover:bg-blue-500 text-white'
                  }`}
                >
                  {isCompleted ? <CheckCircle size={16} /> : <Circle size={16} />}
                  <span>{isCompleted ? 'Done' : `+${quest.points} pts`}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default GamificationQuests;
