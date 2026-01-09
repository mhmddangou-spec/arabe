
import { GoogleGenAI, Type } from "@google/genai";
import { PronunciationFeedback } from "../types";

/**
 * Analyse la prononciation arabe avec une expertise spécifique en Tajwid.
 * Utilise Gemini 2.5 Flash Native Audio pour une analyse directe du flux audio.
 */
export const analyzePronunciation = async (
  audioBase64: string,
  targetText: string
): Promise<PronunciationFeedback> => {
  // Toujours créer une nouvelle instance pour utiliser la clé API la plus récente
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-native-audio-preview-12-2025",
      contents: [
        {
          parts: [
            {
              inlineData: {
                mimeType: "audio/webm",
                data: audioBase64,
              },
            },
            {
              text: `Tu es un expert en phonétique arabe et en Tajwid. 
              L'élève essaie de prononcer : "${targetText}".
              
              Analyse son enregistrement audio avec précision :
              1. Makhārij (Points d'articulation) : Les lettres sont-elles sorties du bon endroit ?
              2. Sifāt (Attributs) : Emphase (Tafkhīm), douceur (Tarqīq), etc.
              3. Harakāt (Voyelles) : Les voyelles courtes et longues sont-elles respectées ?
              4. Tajwid spécifique : Si applicable, vérifie l'application de règles comme Ikhfā, Idghām, Ghunnah, Qalqalah ou Madd.

              Sois encourageant mais rigoureux.
              
              Retourne un JSON strict avec:
              - "score" : un entier de 0 à 100 représentant la fidélité.
              - "accuracy" : une chaîne parmi "excellent" (>=90), "good" (70-89), "average" (40-69), "poor" (<40).
              - "phoneticErrors" : un tableau de chaînes courtes décrivant les erreurs spécifiques (ex: ["Manque d'emphase sur le Sād", "Voyelle longue trop courte"]).
              - "tips" : un conseil pédagogique bienveillant en français (max 100 caractères).
              - "tajwidRule" : (optionnel) le nom de la règle de Tajwid mal appliquée ou concernée par cet exercice (ex: "Idghām bi-ghunnah", "Qalqalah", "Ikhfā"). Laisse vide si non applicable.`,
            },
          ],
        },
      ],
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            score: { type: Type.NUMBER },
            accuracy: { type: Type.STRING },
            phoneticErrors: { type: Type.ARRAY, items: { type: Type.STRING } },
            tips: { type: Type.STRING },
            tajwidRule: { type: Type.STRING },
          },
          required: ["score", "accuracy", "phoneticErrors", "tips"],
        },
      },
    });

    const text = response.text;
    if (!text) throw new Error("Réponse vide de l'IA");
    
    return JSON.parse(text) as PronunciationFeedback;
  } catch (error) {
    console.error("Erreur d'analyse IA Tajwid:", error);
    return {
      score: 0,
      accuracy: "poor",
      phoneticErrors: ["Erreur de traitement audio"],
      tips: "Désolé, la plume a eu un problème technique. Réessayez dans un instant.",
    };
  }
};
