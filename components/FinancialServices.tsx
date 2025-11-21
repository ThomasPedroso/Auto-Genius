import React, { useState } from 'react';
import { Landmark, FileText, Car, ShieldCheck } from 'lucide-react';
import type { FinancialService, User } from '../types';
import { calculateFinancialService, SimulationResult } from '../services/mockApiService';
import Modal from './common/Modal';

interface FinancialServicesProps {
    user?: User; // Optional, but used for better simulations if provided
}

const serviceDetails: Record<FinancialService, { icon: React.ElementType; title: string; color: string }> = {
  financing: { icon: Landmark, title: 'Financiamento', color: 'text-blue-400' },
  consortium: { icon: FileText, title: 'Consórcio', color: 'text-green-400' },
  equity: { icon: Car, title: 'Car Equity', color: 'text-purple-400' },
  insurance: { icon: ShieldCheck, title: 'Seguro Auto', color: 'text-yellow-400' },
};

const FinancialServices: React.FC<FinancialServicesProps> = ({ user }) => {
  const [selectedService, setSelectedService] = useState<FinancialService | null>(null);
  const [simulation, setSimulation] = useState<SimulationResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleCardClick = async (service: FinancialService) => {
    setSelectedService(service);
    setIsLoading(true);
    setSimulation(null);
    
    try {
        // Use mock user if none provided (fallback)
        const userContext = user || { gamification: { level: 'Bronze' } } as any;
        const result = await calculateFinancialService(service, userContext);
        setSimulation(result);
    } catch (error) {
      console.error('Error generating simulation:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const closeModal = () => {
    setSelectedService(null);
    setSimulation(null);
  }

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-white">Serviços Financeiros Inteligentes</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {(Object.keys(serviceDetails) as FinancialService[]).map((service) => {
          const { icon: Icon, title, color } = serviceDetails[service];
          return (
            <button
              key={service}
              onClick={() => handleCardClick(service)}
              className="bg-gray-800 p-4 rounded-xl flex flex-col items-center justify-center space-y-3 text-center border border-gray-700 hover:bg-gray-700 transition-colors duration-200 shadow-lg group"
            >
              <div className={`bg-gray-700 group-hover:bg-gray-600 p-3 rounded-full transition-colors`}>
                <Icon className={color} size={28} />
              </div>
              <span className="font-semibold text-white text-sm">{title}</span>
            </button>
          );
        })}
      </div>
      
      {selectedService && (
        <Modal
          isOpen={!!selectedService}
          onClose={closeModal}
          title={serviceDetails[selectedService].title}
        >
          {isLoading ? (
            <div className="flex flex-col justify-center items-center h-48 space-y-4">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400"></div>
              <p className="text-gray-400 animate-pulse">Calculando as melhores taxas para você...</p>
            </div>
          ) : simulation ? (
            <div className="space-y-6">
                <div className="bg-gray-700/30 p-4 rounded-lg border border-gray-600">
                    <h3 className="text-xl font-bold text-white mb-4 text-center">{simulation.title}</h3>
                    <div className="space-y-3">
                        {simulation.details.map((item, idx) => (
                            <div key={idx} className="flex justify-between items-center border-b border-gray-600/50 pb-2 last:border-0">
                                <span className="text-gray-400">{item.label}</span>
                                <span className="font-semibold text-white">{item.value}</span>
                            </div>
                        ))}
                    </div>
                </div>
                
                <div className="bg-blue-900/20 p-3 rounded-md border border-blue-800/50">
                    <p className="text-xs text-blue-300 text-center">{simulation.disclaimer}</p>
                </div>

                <button 
                    onClick={closeModal}
                    className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 px-4 rounded-lg transition-colors"
                >
                    Tenho Interesse
                </button>
            </div>
          ) : (
            <p className="text-red-400 text-center">Erro ao carregar simulação.</p>
          )}
        </Modal>
      )}
    </div>
  );
};

export default FinancialServices;