import { GoogleGenAI } from "@google/genai";
import { SYSTEM_INSTRUCTION } from "./prompts";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const generateMarketingContent = async (
  segment: string,
  toolType: string,
  objective: string,
  tone: string
): Promise<string> => {
  if (!process.env.API_KEY) {
    return "Erro: API Key não configurada. Configure a variável de ambiente API_KEY.";
  }

  const prompt = `
    ${SYSTEM_INSTRUCTION}

    ---

    AGORA, GERE O CONTEÚDO COM BASE NOS PARÂMETROS ABAIXO:

    Segmento: ${segment}
    Ferramenta: ${toolType}
    Objetivo: ${objective}
    Tom: ${tone}
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: prompt,
      config: {
        temperature: 0.7,
        topP: 0.9,
      }
    });

    return response.text || "Não foi possível gerar o conteúdo no momento.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Ocorreu um erro ao conectar com a IA. Tente novamente mais tarde.";
  }
};
