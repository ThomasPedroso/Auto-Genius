
import { api } from './apiClient';
import type { User, Car } from '../types';

export interface SimulationResult {
  title: string;
  details: Array<{ label: string; value: string }>;
  disclaimer: string;
}

export const calculateFinancialService = async (serviceType: string, user: User): Promise<SimulationResult> => {
  try {
    return await api.post<SimulationResult>('/financial/simulate', { serviceType });
  } catch (error) {
    console.error('API Error (Financial Simulation):', error);
    return {
      title: 'Simulação Indisponível',
      details: [{ label: 'Status', value: 'Serviço temporariamente indisponível' }],
      disclaimer: 'Tente novamente mais tarde.',
    };
  }
};

export const checkVehicleStatus = async (type: 'fines' | 'ipva' | 'insurance_status', car: Car): Promise<SimulationResult> => {
  try {
    return await api.post<SimulationResult>('/financial/vehicle-status', { type, car });
  } catch (error) {
    console.error('API Error (Vehicle Status):', error);
    return {
      title: 'Consulta Indisponível',
      details: [{ label: 'Status', value: 'Serviço temporariamente indisponível' }],
      disclaimer: 'Tente novamente mais tarde.',
    };
  }
};
