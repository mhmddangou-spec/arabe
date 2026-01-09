
import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LEARNING_PATH } from '../constants';
import { UserStats, Lesson, LearningLevel } from '../types';
import { playSound } from '../services/audio';
import { useNotifications } from '../components/NotificationSystem';

interface LessonMapProps {
  stats: UserStats;
  updateStats: (stats: Partial<UserStats>) => void;
}

const LessonMap: React.FC<LessonMapProps> = ({ stats, updateStats }) => {
  const navigate = useNavigate();
  const { notify } = useNotifications();
  const [selectedLesson, setSelectedLesson] = useState<{lesson: Lesson, level: LearningLevel} | null>(null);
  const popoverRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
        setSelectedLesson(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const isLessonUnlocked = (lesson: Lesson) => {
    if (lesson.order === 1) return true;
    const allLessons = LEARNING_PATH.flatMap(lvl => lvl.units.flatMap(u => u.lessons));
    const previousLesson = allLessons.find(l => l.order === lesson.order - 1);
    return previousLesson ? stats.completedLessons.includes(previousLesson.id) : false;
  };

  const isLevelUnlocked = (level: LearningLevel) => {
    return stats.xp >= level.requiredXpToUnlock;
  };

  const handleLessonClick = (lesson: Lesson, level: LearningLevel) => {
    if (!isLessonUnlocked(lesson)) {
      notify("Cette leçon est encore nimbée de mystère. Termine la précédente !", "info", "🔒");
      playSound('incorrect');
      return;
    }
    playSound('click');
    setSelectedLesson({ lesson, level });
  };

  return (
    <div className="min-h-screen bg-white pb-32">
      {LEARNING_PATH.map((level, lvlIdx) => {
        const locked = !isLevelUnlocked(level);

        return (
          <section key={level.id} className={`relative ${locked ? 'opacity-50 grayscale' : ''}`}>
            {/* Niveau Header */}
            <div className="sticky top-0 z-30 bg-white/90 backdrop-blur-md p-6 border-b border-gray-100 mb-8 shadow-sm">
               <div className="max-w-xl mx-auto flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-black italic tracking-tighter text-gray-800">{level.title}</h2>
                    <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest">{level.objective}</p>
                  </div>
                  {locked && (
                    <div className="bg-gray-100 px-3 py-1 rounded-full text-[10px] font-black text-gray-500 uppercase">
                      Débloque à {level.requiredXpToUnlock} XP
                    </div>
                  )}
               </div>
            </div>

            <div className="max-w-xl mx-auto flex flex-col items-center gap-12 py-10">
              {level.units.map((unit, unitIdx) => (
                <div key={unit.id} className="w-full relative flex flex-col items-center">
                  
                  {/* Unit Node */}
                  <div className={`${unit.color} w-full rounded-[2.5rem] p-6 text-white shadow-xl mb-12 relative overflow-hidden group transition-all hover:scale-[1.01]`}>
                     <div className="relative z-10">
                        <h3 className="text-[10px] font-black uppercase opacity-60 tracking-widest">Étape {unitIdx + 1}</h3>
                        <p className="text-xl font-black tracking-tight">{unit.title}</p>
                     </div>
                     <div className="absolute right-[-10%] bottom-[-20%] text-8xl opacity-10 rotate-12 arabic-text font-black">
                        {level.id.slice(-1)}
                     </div>
                  </div>

                  {/* Lessons Path */}
                  <div className="flex flex-col items-center gap-16 relative w-full">
                    {/* Path Line */}
                    <div className="absolute top-0 bottom-0 w-2 bg-gray-50 left-1/2 -translate-x-1/2 -z-10 rounded-full"></div>

                    {unit.lessons.map((lesson, lessonIdx) => {
                      const unlocked = isLessonUnlocked(lesson);
                      const completed = stats.completedLessons.includes(lesson.id);
                      const isCurrentSelected = selectedLesson?.lesson.id === lesson.id;
                      
                      // Zig-zag pattern
                      const offsets = [0, 40, 80, 40, 0, -40, -80, -40];
                      const offset = offsets[lessonIdx % offsets.length];

                      return (
                        <div key={lesson.id} className="relative" style={{ transform: `translateX(${offset}px)` }}>
                          {/* Popover */}
                          {isCurrentSelected && (
                            <div ref={popoverRef} className="absolute bottom-full left-1/2 -translate-x-1/2 mb-6 w-56 bg-white rounded-[2rem] p-5 shadow-2xl border-2 border-gray-100 z-50 animate-in zoom-in duration-200">
                               <h4 className="text-[#1cb0f6] font-black uppercase text-[10px] mb-1">C'est le moment !</h4>
                               <h3 className="text-gray-800 font-black text-lg mb-4">{lesson.title}</h3>
                               <button 
                                 onClick={() => navigate(`/quiz/${lesson.id}`)}
                                 className="w-full bg-[#58cc02] text-white py-3 rounded-xl font-black uppercase text-xs shadow-[0_4px_0_0_#46a302] active:translate-y-1 transition-all"
                               >
                                 Démarrer
                                </button>
                                <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-8 border-transparent border-t-white"></div>
                            </div>
                          )}

                          <button
                            onClick={() => handleLessonClick(lesson, level)}
                            disabled={locked}
                            className={`
                              w-24 h-20 rounded-[2.5rem] flex items-center justify-center transition-all duration-300 relative
                              ${completed ? 'bg-[#ffc800] border-b-[8px] border-[#e5a500] shadow-lg' : 
                                unlocked ? (lesson.isExam ? 'bg-[#ff4b4b] border-b-[8px] border-[#d33131] animate-pulse' : 'bg-[#58cc02] border-b-[8px] border-[#46a302]') : 
                                'bg-gray-200 border-b-[8px] border-gray-300 cursor-not-allowed'}
                              ${isCurrentSelected ? 'scale-110 ring-4 ring-offset-4 ring-[#1cb0f6]' : ''}
                              hover:scale-105 active:scale-95 active:border-b-0 active:translate-y-2
                            `}
                          >
                            <span className="text-3xl">
                              {completed ? '✨' : (lesson.isExam ? '🎓' : (unlocked ? '📖' : '🔒'))}
                            </span>
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
            
            {lvlIdx < LEARNING_PATH.length - 1 && (
              <div className="w-full h-24 flex items-center justify-center">
                 <div className="w-1 h-full bg-gradient-to-b from-gray-50 to-white"></div>
              </div>
            )}
          </section>
        );
      })}
    </div>
  );
};

export default LessonMap;
