
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { UNITS } from '../constants';
import { BADGES } from '../services/gamification';
import { playSound } from '../services/audio';

const PublicProfile: React.FC = () => {
  const { username } = useParams<{ username: string }>();
  const navigate = useNavigate();

  // Mock data pour les adversaires (simulant une base de données)
  const OPPONENTS_DATA: Record<string, any> = {
    'Amina': { xp: 2450, level: 8, streak: 12, completed: 18, badges: ['b1', 'b3', 'b4', 'b6'], avatar: '🧕' },
    'Youssef': { xp: 2100, level: 7, streak: 5, completed: 12, badges: ['b1', 'b2', 'b5'], avatar: '🧔' },
    'Sarah': { xp: 1950, level: 6, streak: 3, completed: 10, badges: ['b1', 'b3'], avatar: '👩' },
    'Karim': { xp: 1800, level: 5, streak: 2, completed: 8, badges: ['b1'], avatar: '👨' },
    'Leila': { xp: 1500, level: 4, streak: 1, completed: 5, badges: ['b2'], avatar: '👩‍🦳' },
  };

  const data = OPPONENTS_DATA[username || ''] || OPPONENTS_DATA['Amina'];
  const totalLessons = UNITS.reduce((acc, unit) => acc + unit.lessons.length, 0);
  const progress = Math.min(100, Math.round((data.completed / totalLessons) * 100));

  return (
    <div className="p-6 max-w-2xl mx-auto animate-in zoom-in duration-300 pb-20">
      <div className="flex items-center gap-4 mb-8">
        <button 
          onClick={() => { playSound('click'); navigate(-1); }}
          className="text-gray-400 hover:text-gray-800 text-3xl font-light"
        >
          ←
        </button>
        <h1 className="text-xl font-black uppercase text-gray-400 tracking-widest">Profil de l'Adversaire</h1>
      </div>

      <div className="bg-gradient-to-br from-[#1cb0f6] to-[#1899d6] rounded-[3rem] p-8 text-white mb-8 shadow-2xl relative overflow-hidden">
        <div className="flex items-center gap-6 relative z-10">
          <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center text-5xl shadow-xl border-4 border-white/30">
            {data.avatar}
          </div>
          <div>
            <h2 className="text-4xl font-black italic tracking-tighter mb-1">{username}</h2>
            <div className="flex gap-2">
              <span className="bg-white/20 px-3 py-1 rounded-full text-[10px] font-black uppercase">Niveau {data.level}</span>
              <span className="bg-white/20 px-3 py-1 rounded-full text-[10px] font-black uppercase">Érudit</span>
            </div>
          </div>
        </div>
        <div className="absolute right-0 top-0 text-[10rem] opacity-10 pointer-events-none arabic-text select-none leading-none -translate-y-1/4 translate-x-1/4">
          ق
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="p-5 rounded-[2rem] border-2 border-gray-100 bg-white flex flex-col items-center text-center shadow-sm">
          <span className="text-3xl mb-1">🔥</span>
          <p className="text-2xl font-black text-orange-500 leading-none">{data.streak} j</p>
          <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest mt-1">Série</p>
        </div>
        <div className="p-5 rounded-[2rem] border-2 border-gray-100 bg-white flex flex-col items-center text-center shadow-sm">
          <span className="text-3xl mb-1">💎</span>
          <p className="text-2xl font-black text-blue-500 leading-none">{data.xp}</p>
          <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest mt-1">Sagesse (XP)</p>
        </div>
      </div>

      <h3 className="text-lg font-black mb-4 uppercase text-gray-400 tracking-widest px-2">Parcours accompli</h3>
      <div className="p-6 border-2 border-gray-100 rounded-[2rem] bg-white mb-8 shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <span className="font-black text-gray-700">Maîtrise d'Arabingo</span>
          <span className="text-sm font-black text-[#58cc02]">{progress}%</span>
        </div>
        <div className="h-4 bg-gray-50 rounded-full overflow-hidden border border-gray-100">
           <div 
             className="h-full bg-[#58cc02] transition-all duration-1000 ease-out shadow-[0_0_15px_rgba(88,204,2,0.3)]" 
             style={{ width: `${progress}%` }}
           ></div>
        </div>
        <p className="text-[10px] text-gray-400 font-bold mt-4 uppercase text-center">{data.completed} leçons terminées sur {totalLessons}</p>
      </div>

      <h3 className="text-lg font-black mb-4 uppercase text-gray-400 tracking-widest px-2">Salle des Trophées</h3>
      <div className="grid grid-cols-3 gap-4">
        {BADGES.map(badge => {
          const isUnlocked = data.badges.includes(badge.id);
          return (
            <div 
              key={badge.id} 
              className={`flex flex-col items-center p-4 rounded-[2rem] border-2 transition-all ${isUnlocked ? 'border-yellow-200 bg-yellow-50/50' : 'border-gray-50 opacity-20 grayscale'}`}
            >
              <span className="text-4xl mb-2">{badge.icon}</span>
              <p className="text-[9px] font-black uppercase text-center leading-tight text-gray-700">{badge.name}</p>
            </div>
          );
        })}
      </div>

      <div className="mt-12 text-center">
        <button 
          onClick={() => { playSound('click'); navigate('/map'); }}
          className="bg-[#58cc02] text-white px-10 py-4 rounded-2xl font-black uppercase shadow-[0_6px_0_0_#46a302] hover:brightness-105 active:shadow-none active:translate-y-1 transition-all"
        >
          Défier cet élève
        </button>
      </div>
    </div>
  );
};

export default PublicProfile;
