
import { UserStats, Badge } from '../types';

export const BADGES: Badge[] = [
  { id: 'b1', name: 'Premier Pas', icon: '🌱', description: 'Termine ta première leçon' },
  { id: 'b2', name: 'Lève-tôt', icon: '☀️', description: 'Fais une leçon avant 8h du matin' },
  { id: 'b3', name: 'Série de Bronze', icon: '🔥', description: 'Maintiens une série de 3 jours' },
  { id: 'b4', name: 'Maître des Lettres', icon: '✍️', description: 'Termine l\'unité de l\'alphabet' },
  { id: 'b5', name: 'Hibou de Nuit', icon: '🦉', description: 'Apprends après 22h' },
  { id: 'b6', name: 'Perfectionniste', icon: '🎯', description: 'Obtiens 100% de précision sur 5 leçons' },
];

export const calculateLessonXp = (stats: UserStats, accuracy: number, timeTakenSeconds: number = 60): number => {
  const base = 15;
  const accuracyBonus = accuracy === 100 ? 5 : (accuracy >= 80 ? 2 : 0);
  const streakBonus = Math.min(stats.streak, 10);
  
  // Bonus de rapidité (si < 45s pour une leçon standard)
  const speedBonus = timeTakenSeconds < 45 ? 3 : 0;
  
  // Bonus de première leçon du jour
  const today = new Date().toISOString().split('T')[0];
  const isFirstOfToday = stats.lastLessonDate !== today;
  const dailyBonus = isFirstOfToday ? 10 : 0;

  return base + accuracyBonus + streakBonus + speedBonus + dailyBonus;
};

export const getNextLevelXp = (level: number): number => {
  return Math.round(50 * Math.pow(level, 1.5));
};

export const checkBadges = (stats: UserStats): string[] => {
  const newBadges: string[] = [...stats.badges];
  const now = new Date();
  const hours = now.getHours();

  const addIfMissing = (id: string) => {
    if (!newBadges.includes(id)) newBadges.push(id);
  };

  if (stats.completedLessons.length >= 1) addIfMissing('b1');
  if (hours < 8 && hours >= 5) addIfMissing('b2');
  if (stats.streak >= 3) addIfMissing('b3');
  if (hours >= 22 || hours < 2) addIfMissing('b5');
  
  // Verification de l'unité alphabet (u1)
  const alphabetLessonIds = ['l1', 'l2'];
  const completedAlphabet = alphabetLessonIds.every(id => stats.completedLessons.includes(id));
  if (completedAlphabet) addIfMissing('b4');

  return newBadges;
};

export const updateStreak = (lastDateStr: string | undefined, currentStreak: number): { newStreak: number, streakUpdated: boolean, message: string } => {
  const today = new Date().toISOString().split('T')[0];
  if (!lastDateStr) return { newStreak: 1, streakUpdated: true, message: "Première leçon ! La série commence." };
  
  if (lastDateStr === today) return { newStreak: currentStreak, streakUpdated: false, message: "" };
  
  const lastDate = new Date(lastDateStr);
  const diffTime = Math.abs(new Date(today).getTime() - lastDate.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 1) {
    return { newStreak: currentStreak + 1, streakUpdated: true, message: `Série de ${currentStreak + 1} jours !` };
  } else if (diffDays > 1) {
    return { newStreak: 1, streakUpdated: true, message: "Série réinitialisée. Nouveau départ !" };
  }
  
  return { newStreak: currentStreak, streakUpdated: false, message: "" };
};
