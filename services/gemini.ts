import { GoogleGenAI } from "@google/genai";

// Ensure API Key is available
const apiKey = process.env.API_KEY || '';

const ai = new GoogleGenAI({ apiKey });

export const GeminiService = {
  getExerciseTips: async (exerciseName: string, notes?: string): Promise<string> => {
    if (!apiKey) return "API Key não configurada. Configure process.env.API_KEY.";
    
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: `Aja como um treinador profissional de fisiculturismo de classe mundial. Forneça dicas concisas, focadas e motivadoras sobre a execução correta, ritmo e respiração para o exercício: "${exerciseName}". ${notes ? `Considere esta observação do usuário: ${notes}.` : ''} Mantenha a resposta com no máximo 3 pontos principais (bullet points) e um breve encorajamento final.`,
      });
      return response.text;
    } catch (error) {
      console.error("Gemini Error:", error);
      return "Não foi possível carregar as dicas no momento. Foque na contração muscular!";
    }
  },

  analyzeProgress: async (weight: number, muscle: number, fat: number): Promise<string> => {
    if (!apiKey) return "";

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: `Analise brevemente estes dados corporais atuais de um praticante de musculação: Peso: ${weight}kg, Massa Muscular: ${muscle}kg, Massa Gorda: ${fat}kg. Dê um feedback curto (2 frases) sobre o estado atual e uma recomendação dietética ou de treino genérica.`,
      });
      return response.text;
    } catch (error) {
      return "Continue consistente nos treinos!";
    }
  }
};