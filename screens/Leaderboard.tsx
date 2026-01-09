
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { UserStats } from '../types';
import { playSound } from '../services/audio';

interface LeaderboardProps {
  stats: UserStats;
}

const Leaderboard: React.FC<LeaderboardProps> = ({ stats }) => {
  const navigate = useNavigate();
  const users = [
    { name: 'Amina', xp: 2450, avatar: '🧕', level: 8, streak: 12 },
    { name: 'Youssef', xp: 2100, avatar: '🧔', level: 7, streak: 5 },
    { name: 'Sarah', xp: 1950, avatar: '👩', level: 6, streak: 3 },
    { name: 'Vous', xp: stats.xp, avatar: '👤', isUser: true, level: Math.floor(Math.sqrt(stats.xp / 50)) + 1, streak: stats.streak },
    { name: 'Karim', xp: 1800, avatar: '👨', level: 5, streak: 2 },
    { name: 'Leila', xp: 1500, avatar: '👩‍🦳', level: 4, streak: 1 },
  ];

  const sortedUsers = [...users].sort((a, b) => b.xp - a.xp);

  const handleUserClick = (user: any) => {
    playSound('click');
    if (user.isUser) {
      navigate('/profile');
    } else {
      navigate(`/profile/${user.name}`);
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto animate-in fade-in duration-500 pb-20">
      <div className="text-center mb-8">
        <div className="text-6xl mb-4">🏆</div>
        <h1 className="text-3xl font-black text-gray-800 uppercase italic tracking-tighter">Ligue de Bronze</h1>
        <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">Touchez un adversaire pour voir son parcours</p>
      </div>

      <div className="bg-white rounded-[2rem] border-2 border-gray-200 overflow-hidden shadow-sm">
        {sortedUsers.map((user, idx) => (
          <div 
            key={idx} 
            onClick={() => handleUserClick(user)}
            className={`flex items-center gap-4 p-5 border-b border-gray-100 last:border-0 cursor-pointer transition-all hover:bg-gray-50 active:scale-[0.98] ${user.isUser ? 'bg-[#ddf4ff] hover:bg-[#ccefff]' : ''}`}
          >
            <span className={`w-6 font-black text-lg ${idx < 3 ? 'text-[#ff9600]' : 'text-gray-400'}`}>
              {idx + 1}
            </span>
            <div className={`w-14 h-14 rounded-full flex items-center justify-center text-3xl shadow-inner border-2 ${user.isUser ? 'bg-white border-[#1cb0f6]' : 'bg-gray-100 border-gray-200'}`}>
              {user.avatar}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <p className="font-black text-gray-800">{user.name}</p>
                <span className="bg-gray-100 text-gray-400 text-[9px] font-black px-1.5 py-0.5 rounded uppercase">Nv.{user.level}</span>
              </div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-tighter">Série de {user.streak} j</p>
            </div>
            <div className="text-right">
              <p className="font-black text-[#1cb0f6]">{user.xp} XP</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 p-6 bg-[#ffc800] rounded-[2rem] text-white shadow-lg flex items-center gap-6 group hover:scale-[1.02] transition-transform cursor-pointer">
        <div className="text-4xl group-hover:rotate-12 transition-transform">⚡</div>
        <div>
          <h3 className="font-black text-xl uppercase italic tracking-tighter">Bonus Quotidien !</h3>
          <p className="font-bold opacity-90 text-sm">Terminez une leçon aujourd'hui pour dépasser vos rivaux.</p>
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;
