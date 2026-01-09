
import React from 'react';
import { UserStats, Locale } from '../types';
import { UNITS } from '../constants';
import { BADGES } from '../services/gamification';
import { useTranslation } from '../context/LanguageContext';
import { playSound } from '../services/audio';

interface ProfileProps {
  stats: UserStats;
  updateStats: (stats: Partial<UserStats>) => void;
}

const Profile: React.FC<ProfileProps> = ({ stats, updateStats }) => {
  const { t, locale, setLocale, isRTL } = useTranslation();
  const totalLessons = UNITS.reduce((acc, unit) => acc + unit.lessons.length, 0);
  const legendProgress = Math.min(100, Math.round((stats.completedLessons.length / totalLessons) * 100));

  const languages: { id: Locale, label: string, flag: string }[] = [
    { id: 'fr', label: 'Français', flag: '🇫🇷' },
    { id: 'en', label: 'English', flag: '🇺🇸' },
    { id: 'ar', label: 'العربية', flag: '🇸🇦' },
  ];

  const toggleSound = () => {
    playSound('click');
    updateStats({ soundEnabled: !stats.soundEnabled });
  };

  const toggleMusic = () => {
    playSound('click');
    updateStats({ musicEnabled: !stats.musicEnabled });
  };

  return (
    <div className="p-6 max-w-2xl mx-auto animate-in slide-in-from-right duration-500 pb-20">
      <div className="flex items-center gap-6 mb-10 border-b-2 border-gray-200 pb-8">
        <div className={`w-24 h-24 rounded-full flex items-center justify-center text-4xl text-white shadow-inner relative ${stats.isPremium ? 'bg-gradient-to-br from-[#1cb0f6] to-[#1899d6]' : 'bg-[#ce82ff]'}`}>
           {stats.isAnonymous ? '👤' : '🌟'}
           <div className={`absolute -bottom-1 ${isRTL ? '-left-1' : '-right-1'} bg-[#58cc02] w-8 h-8 rounded-full border-4 border-white flex items-center justify-center text-[10px] font-black`}>
             {stats.level}
           </div>
        </div>
        <div className="flex-1">
           <div className="flex items-center gap-2">
             <h1 className="text-3xl font-black text-gray-800">{stats.displayName || t.common.guest}</h1>
             {stats.isPremium && <span className="bg-[#1cb0f6] text-white text-[10px] font-black px-2 py-0.5 rounded-md uppercase">Plus</span>}
           </div>
           <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">
             {stats.isAnonymous ? t.common.guest : stats.email}
           </p>
        </div>
      </div>

      <h2 className="text-2xl font-black mb-4 uppercase text-gray-400 tracking-wider">Réglages Audio</h2>
      <div className="grid grid-cols-2 gap-4 mb-10">
        <button 
          onClick={toggleSound}
          className={`p-4 rounded-2xl border-2 flex items-center justify-between font-black uppercase text-xs transition-all ${stats.soundEnabled ? 'border-[#58cc02] bg-[#eefae6] text-[#46a302]' : 'border-gray-200 bg-white text-gray-400'}`}
        >
          <span>Effets Sonores</span>
          <span className="text-xl">{stats.soundEnabled ? '🔊' : '🔇'}</span>
        </button>
        <button 
          onClick={toggleMusic}
          className={`p-4 rounded-2xl border-2 flex items-center justify-between font-black uppercase text-xs transition-all ${stats.musicEnabled ? 'border-[#1cb0f6] bg-[#ddf4ff] text-[#1899d6]' : 'border-gray-200 bg-white text-gray-400'}`}
        >
          <span>Musique d'Oasis</span>
          <span className="text-xl">{stats.musicEnabled ? '🎵' : '🚫'}</span>
        </button>
      </div>

      <h2 className="text-2xl font-black mb-4 uppercase text-gray-400 tracking-wider">{t.profile.language}</h2>
      <div className="grid grid-cols-3 gap-3 mb-10">
        {languages.map(lang => (
          <button
            key={lang.id}
            onClick={() => { playSound('click'); setLocale(lang.id); }}
            className={`p-4 rounded-2xl border-2 font-bold transition-all flex flex-col items-center gap-1 ${locale === lang.id ? 'border-[#1cb0f6] bg-[#ddf4ff] text-[#1899d6]' : 'border-gray-200 bg-white hover:bg-gray-50'}`}
          >
            <span className="text-2xl">{lang.flag}</span>
            <span className="text-xs uppercase">{lang.label}</span>
          </button>
        ))}
      </div>

      <h2 className="text-2xl font-black mb-4 uppercase text-gray-400 tracking-wider">{t.profile.stats}</h2>
      <div className="grid grid-cols-2 gap-4 mb-10">
        {[
          { icon: '🔥', label: t.profile.streak, value: `${stats.streak} j`, color: 'text-orange-500' },
          { icon: '💎', label: t.profile.xp, value: stats.xp, color: 'text-blue-500' },
          { icon: '🏆', label: t.profile.league, value: 'Bronze', color: 'text-yellow-600' },
          { icon: '🎯', label: t.profile.lessons, value: stats.completedLessons.length, color: 'text-green-500' },
        ].map((item, idx) => (
          <div key={idx} className="p-4 rounded-2xl border-2 border-gray-200 flex items-center gap-3 shadow-sm bg-white">
            <span className="text-3xl">{item.icon}</span>
            <div>
              <p className={`font-black leading-none mb-1 text-xl ${item.color}`}>{item.value}</p>
              <p className="text-gray-400 font-bold text-xs uppercase">{item.label}</p>
            </div>
          </div>
        ))}
      </div>

      <h2 className="text-2xl font-black mb-4 uppercase text-gray-400 tracking-wider">{t.profile.badges}</h2>
      <div className="grid grid-cols-3 gap-4 mb-10">
        {BADGES.map(badge => {
          const isUnlocked = stats.badges.includes(badge.id);
          return (
            <div key={badge.id} className={`flex flex-col items-center p-3 rounded-2xl border-2 transition-all ${isUnlocked ? 'border-yellow-200 bg-yellow-50' : 'border-gray-100 opacity-40 grayscale'}`}>
              <span className="text-4xl mb-2">{badge.icon}</span>
              <p className="text-[10px] font-black uppercase text-center leading-tight">{badge.name}</p>
            </div>
          );
        })}
      </div>

      <h2 className="text-2xl font-black mb-4 uppercase text-gray-400 tracking-wider">{t.profile.progress}</h2>
      <div className="p-5 border-2 border-gray-200 rounded-2xl flex items-center gap-4 bg-white">
        <div className={`text-4xl ${legendProgress === 100 ? '' : 'grayscale opacity-50'}`}>👑</div>
        <div className="flex-1">
           <div className="flex justify-between items-center mb-2">
             <h3 className="font-black">{t.profile.progress}</h3>
             <span className="text-xs font-black text-gray-400">{legendProgress}%</span>
           </div>
           <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full bg-yellow-400 transition-all duration-1000" style={{ width: `${legendProgress}%` }}></div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
