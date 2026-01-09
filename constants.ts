
import { LearningLevel, DifficultyLevel, ExerciseType, Lesson, Exercise } from './types';

// Générateur utilitaire pour créer les données massives demandées
const generateExercises = (type: ExerciseType, count: number): Exercise[] => {
  return Array.from({ length: count }).map((_, i) => ({
    id: `ex_${Math.random().toString(36).substr(2, 9)}`,
    type: type,
    question: type === ExerciseType.TRUE_FALSE ? "Est-ce correct ?" : "Choisissez la bonne réponse",
    options: type === ExerciseType.TRUE_FALSE ? ["Vrai", "Faux"] : ["Option A", "Option B", "Option C"],
    correctAnswer: type === ExerciseType.TRUE_FALSE ? "Vrai" : "Option A"
  }));
};

const generateMassiveUnit = (id: string, title: string, color: string): any => {
  const lessons: Lesson[] = [];
  let order = 1;

  // 1. 20 Leçons d'apprentissage
  for (let i = 1; i <= 20; i++) {
    lessons.push({
      id: `${id}_l${i}`,
      title: `Leçon ${i}: Étude fondamentale`,
      description: "Apprentissage progressif du vocabulaire.",
      xpReward: 15,
      order: order++,
      exercises: generateExercises(ExerciseType.MULTIPLE_CHOICE, 3),
      type: 'lesson'
    });
  }

  // 2. 10 Quiz de validation
  for (let i = 1; i <= 10; i++) {
    lessons.push({
      id: `${id}_q${i}`,
      title: `Quiz ${i}: Vérification rapide`,
      description: "Testez vos connaissances acquises.",
      xpReward: 25,
      order: order++,
      exercises: generateExercises(ExerciseType.MULTIPLE_CHOICE, 5),
      type: 'quiz'
    });
  }

  // 3. 5 Exercices Vrai ou Faux
  for (let i = 1; i <= 5; i++) {
    lessons.push({
      id: `${id}_tf${i}`,
      title: `Vrai ou Faux ${i}`,
      description: "Discernement et rapidité.",
      xpReward: 20,
      order: order++,
      exercises: generateExercises(ExerciseType.TRUE_FALSE, 3),
      type: 'true_false'
    });
  }

  // 4. L'ÉTAPE DE FIN (Examen Final de l'Unité)
  lessons.push({
    id: `${id}_final`,
    title: `🏆 Évaluation Finale: ${title}`,
    description: "Le test ultime pour débloquer l'étape suivante.",
    xpReward: 100,
    order: order++,
    isExam: true,
    exercises: generateExercises(ExerciseType.TRANSLATION, 10)
  });

  return { id, title, color, lessons };
};

export const LEARNING_PATH: LearningLevel[] = [
  {
    id: 'lvl_1',
    title: 'Niveau 1 : Débutant Absolu',
    objective: 'Alphabet, sons et lecture de base.',
    difficulty: DifficultyLevel.BEGINNER,
    requiredXpToUnlock: 0,
    units: [
      generateMassiveUnit('u1', 'Les Fondations', 'bg-[#58cc02]'),
      generateMassiveUnit('u2', 'L\'Art de la Liaison', 'bg-[#58cc02]')
    ]
  },
  {
    id: 'lvl_2',
    title: 'Niveau 2 : Débutant +',
    objective: 'Mots essentiels et vocabulaire quotidien.',
    difficulty: DifficultyLevel.BEGINNER,
    requiredXpToUnlock: 1500, // XP requis augmenté car le parcours est plus long
    units: [
      generateMassiveUnit('u3', 'Ma Famille & Moi', 'bg-[#1cb0f6]'),
      generateMassiveUnit('u4', 'Les Objets du Quotidien', 'bg-[#1cb0f6]')
    ]
  },
  {
    id: 'lvl_3',
    title: 'Niveau 3 : Intermédiaire',
    objective: 'Phrases simples et dialogues.',
    difficulty: DifficultyLevel.INTERMEDIATE,
    requiredXpToUnlock: 4000,
    units: [
      generateMassiveUnit('u5', 'Le Voyageur', 'bg-[#ff9600]'),
      generateMassiveUnit('u6', 'Au Restaurant', 'bg-[#ff9600]')
    ]
  },
  {
    id: 'lvl_4',
    title: 'Niveau 4 : Avancé',
    objective: 'Grammaire et structures complexes.',
    difficulty: DifficultyLevel.ADVANCED,
    requiredXpToUnlock: 8000,
    units: [
      generateMassiveUnit('u7', 'Conjugaison I', 'bg-[#ce82ff]'),
      generateMassiveUnit('u8', 'Les Temps du Passé', 'bg-[#ce82ff]')
    ]
  },
  {
    id: 'lvl_5',
    title: 'Niveau 5 : Expert',
    objective: 'Arabe Classique et Coranique.',
    difficulty: DifficultyLevel.EXPERT,
    requiredXpToUnlock: 15000,
    units: [
      generateMassiveUnit('u9', 'Sagesse Antique', 'bg-[#059669]'),
      generateMassiveUnit('u10', 'Analyse Littéraire', 'bg-[#059669]')
    ]
  }
];

export const UNITS = LEARNING_PATH.flatMap(lvl => lvl.units);
export const SPIRITUAL_UNITS = []; 
export const INITIAL_STATS = {
  xp: 0, level: 1, streak: 0, hearts: 5, gems: 500, completedLessons: [], claimedGifts: [], badges: [], isPremium: false, errorHistory: [], soundEnabled: true, musicEnabled: true
};

export const STORIES_DATA = [
  {
    id: 's_1',
    title: 'La Sagesse de Luqman',
    summary: 'Conseils d\'un père à son fils.',
    arabicText: 'يَا بُنَيَّ أَقِمِ الصَّلَاةَ',
    fullText: 'Ô mon fils, accomplis la prière avec soin.',
    vocabulary: [
      { word: 'بُنَيَّ', translation: 'Mon fils' },
      { word: 'أَقِمِ', translation: 'Accomplis' },
      { word: 'الصَّلَاةَ', translation: 'La prière' }
    ]
  }
];

export const SPIRITUAL_EXPRESSIONS = [
  { id: 'exp_1', phrase: 'Gratitude', arabic: 'الحمد لله', meaning: 'Louange à Dieu' }
];

export const SPIRITUAL_VOCABULARY = [
  { ar: 'نور', fr: 'Lumière' }
];
