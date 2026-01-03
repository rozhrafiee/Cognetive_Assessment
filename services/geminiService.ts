
import { GoogleGenAI, Type } from "@google/genai";

const apiKey = process.env.API_KEY;
const ai = new GoogleGenAI({ apiKey: apiKey! });

export const getCognitiveInsight = async (userName: string, scores: any[]) => {
  try {
    const prompt = `Based on the following cognitive test scores for user ${userName}: ${JSON.stringify(scores)}, 
    provide a short, motivating cognitive profile summary in Persian. Focus on strengths and areas for growth.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        systemInstruction: "You are a professional cognitive psychologist assistant. Speak in friendly Persian.",
      }
    });

    return response.text;
  } catch (error) {
    console.error("Gemini Error:", error);
    return "در حال حاضر امکان دریافت تحلیل هوشمند وجود ندارد.";
  }
};

export const suggestDescriptiveGrade = async (question: string, answer: string) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Question: ${question}\nUser Answer: ${answer}\nRate this answer from 0 to 100 and give a short reason in Persian.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            score: { type: Type.NUMBER },
            reason: { type: Type.STRING }
          },
          required: ["score", "reason"]
        }
      }
    });
    return JSON.parse(response.text);
  } catch (error) {
    return { score: 0, reason: "خطا در ارزیابی خودکار" };
  }
};
