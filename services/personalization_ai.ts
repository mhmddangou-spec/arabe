
import { GoogleGenAI, Type } from "@google/genai";
import { UserStats, AIRecommendation, ErrorLog } from "../types";
import { UNITS } from "../constants";

export class PersonalizationService {
  async getRecommendation(stats: UserStats): Promise<AIRecommendation | null> {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    const recentErrors = stats.errorHistory.slice(-20);
    
    const prompt = `
      Tu es l'âme de Noura, ta guide érudite sur Arabingo. Ton ton est chaleureux, érudit et encourageant.
      
      Données de l'élève :
      - Niveau : ${stats.level}
      - XP : ${stats.xp}
      - Erreurs : ${JSON.stringify(recentErrors)}
      
      Contenu : ${JSON.stringify(UNITS.map(u => ({ id: u.id, title: u.title, lessons: u.lessons.map(l => ({ id: l.id, title: l.title })) })))}

      Tâche :
      1. Choisis la leçon suivante.
      2. Rédige un message court (max 150 caractères) signé par Noura.
      
      Ton signature : "La plume de Noura t'attend."
    `;

    try {
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              lessonId: { type: Type.STRING },
              reason: { type: Type.STRING },
              message: { type: Type.STRING }
            },
            required: ["lessonId", "reason", "message"]
          }
        }
      });

      return JSON.parse(response.text) as AIRecommendation;
    } catch (e) {
      console.error("Erreur IA Recommandation:", e);
      return null;
    }
  }
}

export const personalizationService = new PersonalizationService();
