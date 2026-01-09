
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { STORIES_DATA, SPIRITUAL_EXPRESSIONS, SPIRITUAL_VOCABULARY } from '../constants';
import { UserStats } from '../types';
import { playSound } from '../services/audio';
import { playArabicTTS } from '../services/tts';

interface StoriesMapProps {
  stats: UserStats;
}

const StoriesMap: React.FC<StoriesMapProps> = ({ stats }) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'stories' | 'expressions' | 'vocab' | 'games'>('stories');

  const tabs = [
    { id: 'stories', label: 'Récits', icon: '📖' },
    { id: 'expressions', label: 'Paroles', icon: '✨' },
    { id: 'vocab', label: 'Trésor', icon: '💎' },
    { id: 'games', label: 'Défis', icon: '🎮' },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-[#fffdfa] pb-24">
      <div className="bg-[#059669] p-8 text-white rounded-b-[3.5rem] shadow-2xl">
        <h1 className="text-3xl font-black italic mb-1">Jardin de Sagesse</h1>
        <p className="font-bold opacity-80 text-sm mb-6">La plume érudite de Noura</p>
        
        <div className="flex bg-black/10 p-1.5 rounded-2xl gap-1">
          {tabs.map(tab => (
            <button 
              key={tab.id}
              onClick={() => { playSound('click'); setActiveTab(tab.id as any); }}
              className={`flex-1 py-2.5 rounded-xl font-black uppercase text-[10px] flex flex-col items-center transition-all ${activeTab === tab.id ? 'bg-white text-[#059669] shadow-lg' : 'text-white/60'}`}
            >
              <span className="text-lg">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="p-6 overflow-y-auto">
        {activeTab === 'stories' && (
          <div className="space-y-4 animate-in fade-in">
            <h2 className="text-[10px] font-black uppercase text-gray-400 tracking-[0.2em] mb-4">Bibliothèque (20 Chapitres)</h2>
            <div className="grid gap-3">
              {STORIES_DATA.map((story, i) => (
                <button
                  key={story.id}
                  onClick={() => navigate(`/story/${story.id}`)}
                  className={`w-full bg-white p-5 rounded-[2rem] border-2 flex items-center gap-5 text-left transition-all ${stats.completedLessons.includes(story.id) ? 'border-green-200' : 'border-gray-100'}`}
                >
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl shadow-lg ${stats.completedLessons.includes(story.id) ? 'bg-[#58cc02] text-white' : 'bg-gray-100'}`}>
                    {stats.completedLessons.includes(story.id) ? '✓' : i + 1}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-black text-gray-800">{story.title}</h3>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">{story.summary}</p>
                  </div>
                  <span className="text-gray-200 text-2xl">→</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'expressions' && (
          <div className="space-y-4 animate-in slide-in-from-right">
             <h2 className="text-[10px] font-black uppercase text-gray-400 tracking-[0.2em] mb-4">20 Paroles du Cœur</h2>
            {SPIRITUAL_EXPRESSIONS.map((exp) => (
              <div key={exp.id} className="bg-white p-6 rounded-[2.5rem] border-2 border-gray-100 shadow-sm">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-xl font-black text-[#059669] italic">{exp.phrase}</h3>
                  <button onClick={() => playArabicTTS(exp.arabic)} className="p-2 bg-green-50 rounded-full">🔊</button>
                </div>
                <p className="arabic-text text-2xl text-gray-800 mb-2" dir="rtl">{exp.arabic}</p>
                <p className="text-xs font-bold text-gray-500 italic">"{exp.meaning}"</p>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'vocab' && (
          <div className="grid grid-cols-2 gap-4 animate-in zoom-in">
            {SPIRITUAL_VOCABULARY.map((v, i) => (
              <div key={i} className="bg-white p-5 rounded-[2rem] border-2 border-gray-100 flex flex-col items-center text-center">
                <span className="arabic-text text-3xl font-bold mb-1 text-gray-800">{v.ar}</span>
                <span className="text-xs font-black text-[#059669] uppercase tracking-tighter">{v.fr}</span>
                <button onClick={() => playArabicTTS(v.ar)} className="mt-3 text-xs p-1 bg-gray-50 rounded-full opacity-50 hover:opacity-100">🔊</button>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'games' && (
          <div className="space-y-4 animate-in slide-in-from-bottom">
             <h2 className="text-[10px] font-black uppercase text-gray-400 tracking-[0.2em] mb-4">20 Défis de Sagesse</h2>
             {STORIES_DATA.map((story, i) => (
               <div key={i} className="bg-gradient-to-br from-[#fbbf24] to-[#f59e0b] p-6 rounded-[2.5rem] text-white flex items-center gap-5 shadow-lg opacity-90">
                  <span className="text-3xl">🧩</span>
                  <div className="flex-1">
                    <h4 className="font-black uppercase text-xs italic">Défi n°{i+1}</h4>
                    <p className="font-bold text-sm">Le Scramble de {story.title.split(':')[0]}</p>
                  </div>
                  <button 
                    onClick={() => navigate(`/quiz/${story.id}`)}
                    className="bg-white text-[#f59e0b] px-4 py-2 rounded-xl font-black uppercase text-[10px]"
                  >
                    Jouer
                  </button>
               </div>
             ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default StoriesMap;
