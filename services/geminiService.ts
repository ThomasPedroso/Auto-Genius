
import { GoogleGenAI, Modality, Type } from '@google/genai';
import type { MarketplaceCar } from '../types';

// Helper function to safely initialize the AI client only when needed.
// This prevents the app from crashing immediately on load if process.env is not yet available.
const getAiClient = () => {
  const apiKey = (typeof process !== 'undefined' && process.env) ? process.env.API_KEY : '';
  return new GoogleGenAI({ apiKey: apiKey as string });
};

export const generateFinancialExplanation = async (prompt: string): Promise<string> => {
  try {
    const ai = getAiClient();
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: prompt,
    });
    return response.text || 'Não foi possível gerar a explicação.';
  } catch (error) {
    console.error('Error generating content from Gemini:', error);
    throw new Error('Failed to get explanation from AI.');
  }
};

export const getVehicleHealthAnalysis = async (issueDescription: string): Promise<string> => {
  const prompt = `
    You are an expert car mechanic AI. A user is describing a problem with their vehicle. 
    Based on the description, provide a preliminary analysis. 
    Include:
    1. A list of potential causes, from most likely to least likely.
    2. Suggested next steps for the user (e.g., "check fluid levels", "listen for specific sounds", "recommend professional inspection").
    3. A clear disclaimer that this is not a professional diagnosis and a mechanic should be consulted.

    User's description: "${issueDescription}"
  `;

  try {
    const ai = getAiClient();
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: prompt,
    });
    return response.text || 'Não foi possível analisar o problema.';
  } catch (error) {
    console.error('Error generating vehicle analysis from Gemini:', error);
    throw new Error('Failed to get vehicle analysis from AI.');
  }
};

export const generateCarImage = async (make: string, model: string, year: number, color: string, description: string): Promise<string> => {
  const prompt = `Generate a photorealistic, high-quality image of a car.
  Vehicle: ${year} ${make} ${model}
  Color: ${color}
  Context/Description: ${description}
  The image should be cinematic, well-lit, and suitable for a car marketplace listing.`;

  try {
    const ai = getAiClient();
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-image-preview',
      contents: {
        parts: [{ text: prompt }],
      },
      config: {
        imageConfig: {
            aspectRatio: '16:9',
            imageSize: '1K',
        },
      },
    });

    const part = response.candidates?.[0]?.content?.parts?.[0];
    if (part && part.inlineData && part.inlineData.data) {
      const base64ImageBytes = part.inlineData.data;
      return `data:image/png;base64,${base64ImageBytes}`;
    }
    
    throw new Error('No image data returned');
  } catch (error) {
    console.error('Error generating car image:', error);
    throw new Error('Failed to generate car image.');
  }
};

export const searchCarsWithGemini = async (query: string, cars: MarketplaceCar[]): Promise<string[]> => {
  // Simplify car data to reduce token usage
  const carsData = cars.map(c => ({
    id: c.id,
    make: c.make,
    model: c.model,
    year: c.year,
    price: c.price,
    color: c.color,
    description: c.description,
    fuelType: c.fuelType
  }));

  const prompt = `
    You are an intelligent car sales assistant.
    The user is searching for a vehicle with the following criteria: "${query}".
    
    Here is the inventory of available cars:
    ${JSON.stringify(carsData)}

    Analyze the user's intent (e.g., "cheap cars", "suv for family", "red sports car", "cars under 200k", "diesel truck") and match it against the inventory.
    
    Return a JSON object with a property "matchedIds" which is an array of strings containing ONLY the 'id' of the cars that match the user's request.
    If no cars match, return an empty array.
  `;

  try {
    const ai = getAiClient();
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            matchedIds: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            }
          }
        }
      }
    });

    const result = JSON.parse(response.text || '{}');
    return result.matchedIds || [];
  } catch (error) {
    console.error('Error searching cars with Gemini:', error);
    return [];
  }
};
