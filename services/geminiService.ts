
import { api } from './apiClient';
import type { MarketplaceCar } from '../types';

export const generateFinancialExplanation = async (prompt: string): Promise<string> => {
  try {
    const result = await api.post<{ text: string }>('/ai/financial-explanation', { prompt });
    return result.text;
  } catch (error) {
    console.error('API Error (Financial):', error);
    return "Com base no seu perfil (Simulação Local): A taxa de juros estimada seria de 1.49% a.m., resultando em parcelas que cabem no seu orçamento mensal de R$ 8.500.";
  }
};

export const getVehicleHealthAnalysis = async (issueDescription: string): Promise<string> => {
  try {
    const result = await api.post<{ text: string }>('/ai/vehicle-health', { issueDescription });
    return result.text;
  } catch (error) {
    console.error('API Error (Health):', error);
    return "Análise Preliminar (Modo Offline): Com base na descrição, isso pode ser relacionado a: 1. Desgaste nas pastilhas de freio. 2. Baixo nível de fluido de direção hidráulica. Recomendamos levar a um mecânico para inspeção visual.";
  }
};

export const generateCarImage = async (make: string, model: string, year: number, color: string, description: string): Promise<string> => {
  try {
    const result = await api.post<{ imageUrl: string }>('/ai/car-image', { make, model, year, color, description });
    return result.imageUrl;
  } catch (error) {
    console.warn('API Error (Image). Using fallback image.');
    const fallbacks = [
        'https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1503376763036-066120622c74?auto=format&fit=crop&w=1200&q=80'
    ];
    return fallbacks[Math.floor(Math.random() * fallbacks.length)];
  }
};

export const searchCarsWithGemini = async (query: string, cars: MarketplaceCar[]): Promise<string[]> => {
  try {
    const result = await api.post<{ matchedIds: string[] }>('/ai/search-cars', { query, cars });
    return result.matchedIds;
  } catch (error) {
    console.error('API Search Error:', error);
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
