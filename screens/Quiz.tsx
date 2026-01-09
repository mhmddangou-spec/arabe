
import React, { useState, useRef, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { UNITS, SPIRITUAL_UNITS } from '../constants';
import { Exercise, ExerciseType, UserStats, PronunciationFeedback } from '../types';
import { playSound } from '../services/audio';
import { playArabicTTS } from '../services/tts';
import { calculateLessonXp } from '../services/gamification';
import { useTranslation } from '../context/LanguageContext';

interface QuizProps {
  onComplete: (lessonId: string, xpEarned: number) => void;
  updateStats: (stats: Partial<UserStats>) => void;
  stats: UserStats;
}

const Quiz: React.FC<QuizProps> = ({ onComplete, updateStats, stats }) => {
  const { lessonId } = useParams<{ lessonId: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation();
  
  const allLessons = [...UNITS.flatMap(u => u.lessons), ...SPIRITUAL_UNITS.flatMap(u => u.lessons)];
  const lesson = allLessons.find(l => l.id === lessonId);
  
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [typedAnswer, setTypedAnswer] = useState('');
  const [mooazSelection, setMooazSelection] = useState<string[]>([]);
  const [isFinished, setIsFinished] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [feedback, setFeedback] = useState<PronunciationFeedback | null>(null);
  const [hearts, setHearts] = useState(stats.hearts);
  const [errorsCount, setErrorsCount] = useState(0);

  const currentExercise = lesson?.exercises[currentIndex];

  const nouraMessage = useMemo(() => {
    if (isCorrect === true) return t.noura.correct[Math.floor(Math.random() * t.noura.correct.length)];
    if (isCorrect === false) return t.noura.incorrect[Math.floor(Math.random() * t.noura.incorrect.length)];
    return null;
  }, [isCorrect, t.noura]);

  const handleCheck = () => {
    if (!currentExercise) return;
    
    let correct = false;
    if (currentExercise.type === ExerciseType.TRUE_FALSE || currentExercise.type === ExerciseType.MULTIPLE_CHOICE) {
      correct = selectedOption === currentExercise.correctAnswer;
    } else if (currentExercise.type === ExerciseType.TRANSLATION) {
      correct = selectedOption === currentExercise.correctAnswer;
    } else if (currentExercise.type === ExerciseType.LISTENING) {
      correct = typedAnswer.trim() === currentExercise.correctAnswer.trim();
    }

    if (correct) {
      setIsCorrect(true);
      playSound('correct');
    } else {
      setIsCorrect(false);
      playSound('incorrect');
      setErrorsCount(prev => prev + 1);
      if (!stats.isPremium) {
        const h = Math.max(0, hearts - 1);
        setHearts(h);
        updateStats({ hearts: h });
      }
    }
  };

  const handleNext = () => {
    setIsCorrect(null);
    setSelectedOption(null);
    setTypedAnswer('');
    setMooazSelection([]);
    if (currentIndex + 1 < (lesson?.exercises.length || 0)) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setIsFinished(true);
      playSound('success');
      const accuracy = Math.round(((lesson!.exercises.length - errorsCount) / lesson!.exercises.length) * 100);
      onComplete(lesson!.id, calculateLessonXp(stats, accuracy));
      navigate('/map');
    }
  };

  if (!lesson || !currentExercise) return <div className="p-8 text-center">Chargement...</div>;

  return (
    <div className="flex flex-col h-full bg-white max-w-2xl mx-auto min-h-screen relative">
      <div className="flex items-center gap-4 p-4 border-b">
        <button onClick={() => navigate('/map')} className="text-3xl text-gray-300 font-light px-2">×</button>
        <div className="flex-1 h-4 bg-gray-100 rounded-full overflow-hidden">
          <div className="h-full bg-[#58cc02] transition-all duration-500" style={{ width: `${(currentIndex / lesson.exercises.length) * 100}%` }}></div>
        </div>
        <div className="flex items-center gap-1 font-black text-[#ff4b4b]">
          <span>❤️</span><span className="text-lg">{stats.isPremium ? '∞' : hearts}</span>
        </div>
      </div>

      <div className="flex-1 p-6 md:p-12 overflow-y-auto pb-48">
        <div className="mb-4">
           <span className="bg-gray-100 text-gray-400 text-[10px] font-black px-3 py-1 rounded-full uppercase">
             {lesson.isExam ? 'Examen Final' : lesson.type === 'quiz' ? 'Quiz' : lesson.type === 'true_false' ? 'Vrai ou Faux' : 'Leçon'}
           </span>
        </div>
        <h2 className="text-2xl font-black mb-12 text-gray-800">{currentExercise.question}</h2>
        
        {/* TRUE FALSE UI */}
        {currentExercise.type === ExerciseType.TRUE_FALSE && (
          <div className="grid grid-cols-2 gap-6 w-full max-w-md mx-auto">
             {currentExercise.options?.map((opt) => (
               <button 
                 key={opt}
                 onClick={() => setSelectedOption(opt)}
                 className={`py-12 rounded-[2.5rem] border-4 flex flex-col items-center justify-center gap-4 transition-all ${
                   selectedOption === opt 
                     ? (opt === 'Vrai' ? 'bg-green-50 border-green-500 text-green-700' : 'bg-red-50 border-red-500 text-red-700')
                     : 'bg-white border-gray-100 hover:border-gray-200'
                 }`}
               >
                 <span className="text-4xl">{opt === 'Vrai' ? '✅' : '❌'}</span>
                 <span className="font-black uppercase tracking-widest">{opt}</span>
               </button>
             ))}
          </div>
        )}

        {(currentExercise.type === ExerciseType.MULTIPLE_CHOICE || currentExercise.type === ExerciseType.TRANSLATION) && (
          <div className="grid gap-4 w-full max-w-md mx-auto">
            {currentExercise.options?.map((opt, i) => (
              <button key={i} onClick={() => setSelectedOption(opt)} className={`p-5 border-2 rounded-2xl font-black text-left flex items-center gap-4 transition-all ${selectedOption === opt ? 'border-[#84d8ff] bg-[#ddf4ff]' : 'border-gray-200'}`}>
                <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-xs text-gray-400">{i + 1}</div>
                {opt}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className={`fixed bottom-0 left-0 right-0 p-6 bg-white border-t transition-all z-[100] ${isCorrect === true ? 'bg-green-100' : isCorrect === false ? 'bg-red-100' : ''}`}>
        <div className="max-w-2xl mx-auto">
          {isCorrect !== null && (
            <div className="flex items-center gap-4 mb-4 animate-in slide-in-from-bottom duration-300 w-full">
              <div className="text-5xl shrink-0">🧕</div>
              <div className="bg-white p-3 rounded-2xl border-2 border-gray-100 flex-1">
                <p className={`font-black text-sm italic ${isCorrect ? 'text-green-600' : 'text-red-600'}`}>{nouraMessage}</p>
              </div>
            </div>
          )}
          <button 
            disabled={selectedOption === null && typedAnswer === '' && mooazSelection.length === 0}
            onClick={isCorrect === null ? handleCheck : handleNext} 
            className={`w-full py-5 rounded-2xl font-black uppercase text-white shadow-[0_6px_0_0_#46a302] transition-all ${selectedOption === null ? 'bg-gray-300 shadow-none grayscale cursor-not-allowed' : 'bg-[#58cc02]'}`}
          >
            {isCorrect === null ? 'Vérifier' : 'Continuer'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Quiz;
