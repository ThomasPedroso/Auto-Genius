import { GoogleGenAI, Modality, Type } from '@google/genai';
import { config } from '../config';
import type { MarketplaceCar } from '../types';

const getAiClient = () => new GoogleGenAI({ apiKey: config.geminiApiKey });

export const generateFinancialExplanation = async (prompt: string): Promise<string> => {
  try {
    const ai = getAiClient();
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    return response.text || 'Não foi possível gerar a explicação.';
  } catch (error) {
    console.error('Gemini API Error (Financial):', error);
    return 'Com base no seu perfil (Simulação Local): A taxa de juros estimada seria de 1.49% a.m., resultando em parcelas que cabem no seu orçamento mensal de R$ 8.500.';
  }
};

export const getVehicleHealthAnalysis = async (issueDescription: string): Promise<string> => {
  try {
    const ai = getAiClient();
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `
        You are an expert car mechanic AI. A user is describing a problem with their vehicle.
        User's description: "${issueDescription}"
        Provide a preliminary analysis with 3 potential causes and a recommendation.
      `,
    });
    return response.text || 'Não foi possível analisar o problema.';
  } catch (error) {
    console.error('Gemini API Error (Health):', error);
    return 'Análise Preliminar (Modo Offline): Com base na descrição, isso pode ser relacionado a: 1. Desgaste nas pastilhas de freio. 2. Baixo nível de fluido de direção hidráulica. Recomendamos levar a um mecânico para inspeção visual.';
  }
};

export const generateCarImage = async (
  make: string,
  model: string,
  year: number,
  color: string,
  description: string
): Promise<string> => {
  const prompt = `Generate a photorealistic, high-quality image of a car. Vehicle: ${year} ${make} ${model}, Color: ${color}. Context: ${description}. Cinematic lighting, 4k.`;

  try {
    const ai = getAiClient();
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: { parts: [{ text: prompt }] },
      config: { responseModalities: [Modality.IMAGE] },
    });

    const part = response.candidates?.[0]?.content?.parts?.[0];
    if (part && part.inlineData && part.inlineData.data) {
      return `data:image/png;base64,${part.inlineData.data}`;
    }

    throw new Error('No image data returned');
  } catch (error) {
    console.warn('Gemini Image Generation failed. Using fallback image.');
    const fallbacks = [
      'https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1503376763036-066120622c74?auto=format&fit=crop&w=1200&q=80',
    ];
    return fallbacks[Math.floor(Math.random() * fallbacks.length)];
  }
};

export const searchCarsWithGemini = async (query: string, cars: MarketplaceCar[]): Promise<string[]> => {
  try {
    const ai = getAiClient();
    const carsData = cars.map((c) => ({
      id: c.id,
      desc: `${c.year} ${c.make} ${c.model} ${c.color} ${c.description}`,
    }));

    const prompt = `
      User query: "${query}".
      Inventory: ${JSON.stringify(carsData)}.
      Return JSON object { "matchedIds": ["id1", "id2"] } of cars matching the intent.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            matchedIds: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
          },
        },
      },
    });

    const result = JSON.parse(response.text || '{}');
    return result.matchedIds || [];
  } catch (error) {
    console.error('Gemini Search Error:', error);
    const lowerQuery = query.toLowerCase();
    return cars
      .filter(
        (c) =>
          c.make.toLowerCase().includes(lowerQuery) ||
          c.model.toLowerCase().includes(lowerQuery) ||
          c.description.toLowerCase().includes(lowerQuery)
      )
      .map((c) => c.id);
  }
};
