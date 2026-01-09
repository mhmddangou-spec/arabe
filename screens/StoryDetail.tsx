
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { STORIES_DATA } from '../constants';
import { playSound } from '../services/audio';
import { playArabicTTS } from '../services/tts';

const StoryDetail: React.FC = () => {
  const { storyId } = useParams<{ storyId: string }>();
  const navigate = useNavigate();
  const storyIndex = STORIES_DATA.findIndex(s => s.id === storyId);
  const story = STORIES_DATA[storyIndex];
  const [isNarrating, setIsNarrating] = useState(false);
  const [showNext, setShowNext] = useState(false);

  if (!story) return null;

  const handleNarrate = async () => {
    playSound('click');
    setIsNarrating(true);
    await playArabicTTS(story.arabicText);
    setIsNarrating(false);
  };

  const nextStoryId = storyIndex < STORIES_DATA.length - 1 ? STORIES_DATA[storyIndex + 1].id : null;

  const handleNext = () => {
    if (nextStoryId) {
      playSound('click');
      navigate(`/story/${nextStoryId}`);
      setShowNext(false);
    } else {
      navigate('/stories');
    }
  };

  return (
    <div className="min-h-screen bg-[#fffdfa] pb-32 animate-in fade-in duration-500">
      <div className="relative h-64 bg-[#059669] overflow-hidden">
        <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/paper-fibers.png')]"></div>
        <button 
          onClick={() => navigate('/stories')} 
          className="absolute top-6 left-6 w-12 h-12 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white text-2xl z-10"
        >
          ←
        </button>
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 mt-8">
           <h1 className="text-3xl font-black text-white italic tracking-tighter mb-2">{story.title}</h1>
           <div className="h-1 w-16 bg-[#fbbf24] rounded-full"></div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto -mt-12 bg-white rounded-t-[3.5rem] p-8 shadow-2xl relative z-20">
        <div className="flex justify-center -mt-16 mb-8">
           <button 
             onClick={handleNarrate}
             disabled={isNarrating}
             className={`w-20 h-20 rounded-full shadow-2xl flex flex-col items-center justify-center transition-all border-4 border-white ${isNarrating ? 'bg-orange-500 scale-90' : 'bg-[#fbbf24] hover:scale-110'}`}
           >
             <span className="text-2xl">{isNarrating ? '🔊' : '🎙️'}</span>
           </button>
        </div>

        <div className="mb-10 text-center">
           <p className="arabic-text text-4xl leading-relaxed text-gray-800 mb-8" dir="rtl">
             {story.arabicText}
           </p>
           <div className="p-6 bg-green-50/50 rounded-3xl border border-green-100 text-gray-700 font-bold italic text-lg leading-relaxed">
             "{story.fullText}"
           </div>
        </div>

        <div className="space-y-4 mb-12">
          <h3 className="text-xl font-black uppercase text-gray-400 tracking-widest">Mots de sagesse</h3>
          {story.vocabulary.map((v, i) => (
            <div key={i} className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl border-2 border-gray-100">
               <span className="arabic-text text-2xl font-bold text-gray-800">{v.word}</span>
               <span className="flex-1 font-bold text-gray-500 uppercase text-xs">{v.translation}</span>
               <button onClick={() => playArabicTTS(v.word)} className="p-2">🔊</button>
            </div>
          ))}
        </div>

        <div className="flex gap-4">
          <button 
            onClick={() => { navigate(`/quiz/${story.id}`); setShowNext(true); }}
            className="flex-1 bg-[#059669] text-white py-5 rounded-2xl font-black uppercase shadow-[0_8px_0_0_#047857] active:translate-y-2 transition-all"
          >
            Tester ma compréhension
          </button>
          
          {nextStoryId && (
            <button 
              onClick={handleNext}
              className="px-8 bg-white text-[#059669] border-2 border-[#059669] py-5 rounded-2xl font-black uppercase hover:bg-green-50 active:translate-y-2 transition-all"
            >
              Suivant →
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default StoryDetail;
