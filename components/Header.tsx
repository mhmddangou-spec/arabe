
import React from 'react';
import { UserStats } from '../types';
import { getNextLevelXp } from '../services/gamification';

interface HeaderProps {
  stats: UserStats;
}

const Header: React.FC<HeaderProps> = ({ stats }) => {
  const currentLevelXpBase = Math.round(50 * Math.pow(stats.level - 1, 1.5));
  const nextLevelXpTotal = getNextLevelXp(stats.level);
  const xpInCurrentLevel = stats.xp - currentLevelXpBase;
  const xpRequiredForNext = nextLevelXpTotal - currentLevelXpBase;
  const levelProgress = Math.min(100, Math.max(0, (xpInCurrentLevel / xpRequiredForNext) * 100));

  return (
    <div className="flex flex-col w-full max-w-3xl mx-auto px-4 py-2">
      <div className="flex justify-around items-center h-10 w-full mb-1">
        <div className="flex items-center gap-1.5 font-extrabold text-[#ff9600]">
          <span className="text-xl">🔥</span>
          <span className="text-sm">{stats.streak}</span>
        </div>
        <div className="flex items-center gap-1.5 font-extrabold text-[#1cb0f6]">
          <span className="text-xl">💎</span>
          <span className="text-sm">{stats.xp}</span>
        </div>
        <div className="flex items-center gap-1.5 font-extrabold text-[#ff4b4b]">
          <span className="text-xl">❤️</span>
          <span className="text-sm">{stats.isPremium ? '∞' : stats.hearts}</span>
        </div>
        <div className="flex items-center gap-1.5 font-extrabold text-[#58cc02]">
          <span className="text-sm uppercase italic">Nv.{stats.level}</span>
        </div>
      </div>
      
      {/* Level Progress Bar */}
      <div className="h-2 bg-gray-100 rounded-full w-full overflow-hidden">
        <div 
          className="h-full bg-[#58cc02] transition-all duration-1000 ease-out shadow-[0_0_10px_rgba(88,204,2,0.5)]" 
          style={{ width: `${levelProgress}%` }}
        ></div>
      </div>
    </div>
  );
};

export default Header;
