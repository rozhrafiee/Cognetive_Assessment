
import { GoogleGenAI, Type } from "@google/genai";

// Accessing the API key from process.env which is defined in vite.config.ts
const apiKey = process.env.API_KEY;

export const getCognitiveInsight = async (userName: string, scores: any[]) => {
  if (!apiKey) {
    console.warn("API Key is missing. AI features will be disabled.");
    return "کلید API یافت نشد. لطفاً تنظیمات سیستم را بررسی کنید.";
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
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
  if (!apiKey) return { score: 0, reason: "کلید API تنظیم نشده است." };

  try {
    const ai = new GoogleGenAI({ apiKey });
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
