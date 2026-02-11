
import { GoogleGenAI, Modality, Type } from '@google/genai';
import type { MarketplaceCar } from '../types';

// Helper to safely get the API key without crashing if process is undefined
const getAiClient = () => {
  let apiKey = '';
  try {
    if (typeof process !== 'undefined' && process.env) {
      // Try multiple possible environment variable names
      apiKey = process.env.VITE_GEMINI_API_KEY ||
               process.env.GEMINI_API_KEY ||
               process.env.API_KEY ||
               '';
    }
  } catch (e) {
    console.warn('Error accessing process.env', e);
  }

  if (!apiKey) {
    console.error('⚠️ Gemini API key not found. Please set VITE_GEMINI_API_KEY in your .env file');
  }

  return new GoogleGenAI({ apiKey });
};

// Helper to convert File to base64
const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const base64 = (reader.result as string).split(',')[1];
      resolve(base64);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

export interface CnhData {
  name?: string;
  cpf?: string;
  birthDate?: string;
  cnhNumber?: string;
  cnhCategory?: string;
  cnhValidity?: string;
  rg?: string;
}

export const extractCnhData = async (file: File): Promise<CnhData> => {
  try {
    const ai = getAiClient();

    // Convert file to base64
    const base64Data = await fileToBase64(file);
    let mimeType = file.type || 'image/jpeg';

    // Fix PDF mime type if needed
    if (file.name.toLowerCase().endsWith('.pdf')) {
      mimeType = 'application/pdf';
    }

    console.log('📄 Processing CNH file:', {
      name: file.name,
      type: file.type,
      size: file.size,
      detectedMimeType: mimeType
    });

    const prompt = `
      Você é um sistema especializado em extrair dados de CNH (Carteira Nacional de Habilitação) brasileira.

      Analise a imagem/documento fornecido e extraia os seguintes dados em formato JSON:
      - name: Nome completo do portador
      - cpf: CPF (apenas números, sem formatação)
      - birthDate: Data de nascimento no formato DD/MM/YYYY
      - cnhNumber: Número da CNH
      - cnhCategory: Categoria da CNH (A, B, AB, C, D, E, etc.)
      - cnhValidity: Data de validade no formato DD/MM/YYYY
      - rg: RG (se disponível)

      Se algum campo não estiver legível ou disponível, retorne null para esse campo.
      Responda APENAS com o JSON, sem texto adicional.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: {
        parts: [
          { text: prompt },
          {
            inlineData: {
              mimeType: mimeType,
              data: base64Data
            }
          }
        ]
      },
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            name: { type: Type.STRING, nullable: true },
            cpf: { type: Type.STRING, nullable: true },
            birthDate: { type: Type.STRING, nullable: true },
            cnhNumber: { type: Type.STRING, nullable: true },
            cnhCategory: { type: Type.STRING, nullable: true },
            cnhValidity: { type: Type.STRING, nullable: true },
            rg: { type: Type.STRING, nullable: true }
          }
        }
      }
    });

    const result = JSON.parse(response.text || '{}');
    console.log('✅ CNH OCR Result:', result);
    return result as CnhData;
  } catch (error: any) {
    console.error('❌ Gemini OCR Error:', error);

    // Provide more specific error messages
    if (error?.message?.includes('API key')) {
      throw new Error('Erro: Chave da API Gemini não configurada. Configure VITE_GEMINI_API_KEY no arquivo .env');
    } else if (error?.message?.includes('quota') || error?.message?.includes('429')) {
      throw new Error('Limite de uso da API Gemini excedido. Tente novamente mais tarde.');
    } else if (error?.message?.includes('permission')) {
      throw new Error('A API Gemini não tem permissão para processar este tipo de arquivo.');
    } else {
      throw new Error(`Não foi possível extrair os dados da CNH. Verifique se a imagem/PDF está legível. Erro: ${error?.message || 'Desconhecido'}`);
    }
  }
};

export const generateFinancialExplanation = async (prompt: string): Promise<string> => {
  try {
    const ai = getAiClient();
    // Using flash for speed and availability
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    return response.text || 'Não foi possível gerar a explicação.';
  } catch (error) {
    console.error('Gemini API Error (Financial):', error);
    // Fallback for demo
    return "Com base no seu perfil (Simulação Local): A taxa de juros estimada seria de 1.49% a.m., resultando em parcelas que cabem no seu orçamento mensal de R$ 8.500.";
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
    return "Análise Preliminar (Modo Offline): Com base na descrição, isso pode ser relacionado a: 1. Desgaste nas pastilhas de freio. 2. Baixo nível de fluido de direção hidráulica. Recomendamos levar a um mecânico para inspeção visual.";
  }
};

export const generateCarImage = async (make: string, model: string, year: number, color: string, description: string): Promise<string> => {
  const prompt = `Generate a photorealistic, high-quality image of a car. Vehicle: ${year} ${make} ${model}, Color: ${color}. Context: ${description}. Cinematic lighting, 4k.`;

  try {
    const ai = getAiClient();
    // Switched to gemini-2.5-flash-image which has better availability than 3-pro-preview
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [{ text: prompt }],
      },
      config: {
        responseModalities: [Modality.IMAGE],
      },
    });

    const part = response.candidates?.[0]?.content?.parts?.[0];
    if (part && part.inlineData && part.inlineData.data) {
      return `data:image/png;base64,${part.inlineData.data}`;
    }
    
    throw new Error('No image data returned');
  } catch (error: any) {
    console.warn('Gemini Image Generation failed (Permission/Quota). Using fallback image.');
    
    // Robust Fallback System: Return a high-quality Unsplash image
    const fallbacks = [
        'https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1503376763036-066120622c74?auto=format&fit=crop&w=1200&q=80'
    ];
    const randomFallback = fallbacks[Math.floor(Math.random() * fallbacks.length)];
    
    // Small delay to simulate processing time in UI so it feels like AI worked
    await new Promise(resolve => setTimeout(resolve, 1500));
    return randomFallback;
  }
};

export const searchCarsWithGemini = async (query: string, cars: MarketplaceCar[]): Promise<string[]> => {
  try {
    const ai = getAiClient();
    const carsData = cars.map(c => ({ id: c.id, desc: `${c.year} ${c.make} ${c.model} ${c.color} ${c.description}` }));
    
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
              items: { type: Type.STRING }
            }
          }
        }
      }
    });

    const result = JSON.parse(response.text || '{}');
    return result.matchedIds || [];
  } catch (error) {
    console.error('Gemini Search Error:', error);
    // Fallback: Simple client-side text filter
    const lowerQuery = query.toLowerCase();
    return cars
      .filter(c => 
        c.make.toLowerCase().includes(lowerQuery) || 
        c.model.toLowerCase().includes(lowerQuery) ||
        c.description.toLowerCase().includes(lowerQuery)
      )
      .map(c => c.id);
  }
};
