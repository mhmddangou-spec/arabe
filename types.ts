
export type Locale = 'fr' | 'en' | 'ar';

export enum ExerciseType {
  MULTIPLE_CHOICE = 'MULTIPLE_CHOICE',
  TRANSLATION = 'TRANSLATION',
  LISTENING = 'LISTENING',
  MATCHING = 'MATCHING',
  SPEAKING = 'SPEAKING',
  MOOAZ_SCRAMBLE = 'MOOAZ_SCRAMBLE',
  TRUE_FALSE = 'TRUE_FALSE' // Nouveau type demandé
}

export enum DifficultyLevel {
  BEGINNER = 'BEGINNER',
  INTERMEDIATE = 'INTERMEDIATE',
  ADVANCED = 'ADVANCED',
  EXPERT = 'EXPERT'
}

export interface ErrorLog {
  lessonId: string;
  exerciseId: string;
  timestamp: number;
  userAnswer: string;
  correctAnswer: string;
}

export interface PronunciationFeedback {
  score: number;
  accuracy: 'excellent' | 'good' | 'average' | 'poor';
  phoneticErrors: string[];
  tips: string;
  tajwidRule?: string;
}

export interface Badge {
  id: string;
  name: string;
  icon: string;
  description: string;
}

export interface SyncAction {
  type: 'COMPLETE_LESSON' | 'UPDATE_STATS';
  payload: any;
  timestamp: number;
}

export interface AIRecommendation {
  lessonId: string;
  reason: string;
  message: string;
}

export interface Exercise {
  id: string;
  type: ExerciseType;
  question: string;
  arabicQuestion?: string;
  options?: string[];
  correctAnswer: string;
  scrambledWords?: string[];
  audioUrl?: string;
  imageUrl?: string;
}

export interface Lesson {
  id: string;
  title: string;
  description: string;
  exercises: Exercise[];
  xpReward: number;
  order: number;
  isExam?: boolean; 
  type?: 'lesson' | 'quiz' | 'true_false';
}

export interface Unit {
  id: string;
  title: string;
  color: string;
  lessons: Lesson[];
  requiredXp?: number;
}

export interface LearningLevel {
  id: string;
  title: string;
  objective: string;
  difficulty: DifficultyLevel;
  units: Unit[];
  requiredXpToUnlock: number;
}

export interface UserStats {
  uid?: string;
  email?: string;
  displayName?: string;
  isAnonymous?: boolean;
  xp: number;
  level: number;
  streak: number;
  lastLessonDate?: string;
  hearts: number;
  gems: number;
  completedLessons: string[];
  badges: string[];
  claimedGifts?: string[];
  isPremium: boolean;
  soundEnabled: boolean;
  musicEnabled: boolean;
  errorHistory: ErrorLog[];
  lastSyncTimestamp?: number;
}
