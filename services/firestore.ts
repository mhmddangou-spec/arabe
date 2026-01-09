
import { UNITS } from '../constants';
import { UserStats, Unit, Lesson } from '../types';

/**
 * Ce service simule les appels à Firestore. 
 * Dans une version réelle, vous utiliseriez 'firebase/firestore'.
 */
class FirestoreService {
  // Simule la récupération de la structure pédagogique
  async getUnits(): Promise<Unit[]> {
    return new Promise((resolve) => {
      setTimeout(() => resolve(UNITS), 800);
    });
  }

  // Simule la récupération du profil utilisateur
  async getUserStats(uid: string): Promise<UserStats | null> {
    const saved = localStorage.getItem(`arabingo_user_${uid}`);
    return saved ? JSON.parse(saved) : null;
  }

  // Simule la sauvegarde de la progression
  async saveProgress(uid: string, stats: UserStats): Promise<void> {
    localStorage.setItem(`arabingo_user_${uid}`, JSON.stringify(stats));
  }

  // Simule la récupération d'une leçon spécifique avec ses exercices
  async getLesson(lessonId: string): Promise<Lesson | undefined> {
    return UNITS.flatMap(u => u.lessons).find(l => l.id === lessonId);
  }
}

export const firestoreService = new FirestoreService();
