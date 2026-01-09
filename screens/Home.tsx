
import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { playSound } from '../services/audio';
import { useTranslation } from '../context/LanguageContext';

interface HomeProps {
  onGuest: () => void;
}

const Home: React.FC<HomeProps> = ({ onGuest }) => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const welcomeMessage = useMemo(() => {
    const msgs = t.noura.welcome;
    return msgs[Math.floor(Math.random() * msgs.length)];
  }, [t.noura.welcome]);

  const handleStart = () => {
    playSound('click');
    onGuest();
    navigate('/map');
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 text-center bg-white overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-full opacity-[0.03] pointer-events-none arabic-text text-9xl leading-relaxed select-none overflow-hidden">
        أ ب ت ث ج ح خ د ذ ر ز س ش ص ض ط ظ ع غ ف ق ك ل م ن ه و ي
      </div>

      <div className="relative mb-12 group flex flex-col items-center">
        {/* Noura Greeting Bubble */}
        <div className="mb-6 animate-in slide-in-from-bottom duration-700 delay-300">
          <div className="bg-white border-2 border-gray-100 rounded-3xl p-4 shadow-xl max-w-xs relative">
            <p className="text-sm font-bold text-gray-700 italic">"{welcomeMessage}"</p>
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-white border-b-2 border-r-2 border-gray-100 rotate-45"></div>
          </div>
        </div>

        <div className="relative">
          <div className="absolute -inset-4 bg-gradient-to-tr from-[#58cc02] to-[#84d8ff] rounded-full blur-2xl opacity-20 group-hover:opacity-40 transition-opacity duration-700 animate-pulse"></div>
          <div className="relative w-40 h-40 bg-[#58cc02] rounded-full flex items-center justify-center text-7xl shadow-[0_15px_30px_-5px_rgba(88,204,2,0.4)] border-8 border-white animate-bounce-subtle z-10">
            🧕
          </div>
          <div className="absolute -bottom-4 -right-4 bg-[#ffc800] text-white px-5 py-2 rounded-2xl font-black text-2xl shadow-xl rotate-12 scale-110 border-4 border-white z-20">
            أهلاً
          </div>
        </div>
      </div>

      <div className="z-10">
        <h1 className="text-5xl font-black text-[#58cc02] mb-2 tracking-tighter uppercase italic">
          arabingo
        </h1>
        <div className="h-1 w-20 bg-[#ffc800] mx-auto rounded-full mb-6"></div>
        
        <p className="text-2xl text-gray-600 font-bold mb-12 max-w-sm mx-auto leading-tight">
          {t.home.tagline}
        </p>
      </div>

      <div className="w-full max-w-xs space-y-4 z-10">
        <button
          onClick={handleStart}
          className="w-full bg-[#58cc02] text-white py-5 rounded-2xl font-black uppercase text-xl shadow-[0_8px_0_0_#46a302] hover:brightness-105 active:shadow-none active:translate-y-2 transition-all"
        >
          {t.home.start}
        </button>
        
        <button
          onClick={() => { playSound('click'); navigate('/login'); }}
          className="w-full bg-white text-[#1cb0f6] py-5 rounded-2xl font-black uppercase text-lg border-2 border-b-8 border-gray-100 hover:bg-gray-50 active:border-b-2 active:translate-y-2 transition-all"
        >
          {t.home.login}
        </button>
      </div>

      <div className="mt-16 flex flex-col items-center gap-2 opacity-60">
        <p className="text-gray-400 font-bold text-xs uppercase tracking-[0.3em]">
          {t.home.free}
        </p>
        <div className="flex gap-4 text-2xl grayscale hover:grayscale-0 transition-all">
          🇸🇦 🇲🇦 🇪🇬 🇩🇿 🇹🇳
        </div>
      </div>
    </div>
  );
};

export default Home;
