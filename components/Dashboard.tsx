
import React, { useState } from 'react';
import type { User } from '../types';
import GamificationCard from './GamificationCard';
import FinancialServices from './FinancialServices';
import GamificationQuests from './GamificationQuests';
import { MOCK_QUESTS } from '../constants';
import { Save, Edit3 } from 'lucide-react';
import Modal from './common/Modal';

interface DashboardProps {
  user: User;
  onCompleteQuest: (questId: string, points: number) => void;
  onUpdateProfile: (updates: Partial<User>) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ user, onCompleteQuest, onUpdateProfile }) => {
  const [isRegistrationModalOpen, setIsRegistrationModalOpen] = useState(false);
  const [tempRegistration, setTempRegistration] = useState({
      email: user.email || '',
      phone: user.phone || '',
      cpf: user.cpf || '',
      birthDate: user.birthDate || '',
      monthlyIncome: user.monthlyIncome || 0,
      occupation: user.occupation || '',
  });

  const handleSaveRegistration = () => {
      onUpdateProfile(tempRegistration);
      setIsRegistrationModalOpen(false);
  };

  return (
    <div className="p-4 space-y-6">
      <header className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
            <img src={user.avatarUrl} alt={user.name} className="w-16 h-16 rounded-full border-2 border-brand-blue object-cover" />
            <div>
            <p className="text-gray-400 text-sm">Bem-vindo de volta,</p>
            <h1 className="text-2xl font-bold">{user.name}</h1>
            </div>
        </div>
        
        <button 
            onClick={() => {
                setTempRegistration({
                    email: user.email || '',
                    phone: user.phone || '',
                    cpf: user.cpf || '',
                    birthDate: user.birthDate || '',
                    monthlyIncome: user.monthlyIncome || 0,
                    occupation: user.occupation || '',
                });
                setIsRegistrationModalOpen(true);
            }}
            className="bg-gray-800 border border-gray-600 text-white px-3 py-2 rounded-full text-xs font-bold hover:bg-gray-700 transition-colors shadow-lg flex items-center gap-2"
        >
            <Edit3 size={14} />
            Editar Cadastro
        </button>
      </header>

      <GamificationCard gamification={user.gamification} />
      
      <GamificationQuests
        quests={MOCK_QUESTS}
        completedQuests={user.completedQuests}
        onCompleteQuest={onCompleteQuest}
      />

      <FinancialServices user={user} />

      {/* Registration Data Modal */}
      <Modal
        isOpen={isRegistrationModalOpen}
        onClose={() => setIsRegistrationModalOpen(false)}
        title="Atualizar Dados da Conta"
      >
         <div className="space-y-4">
            <div className="bg-brand-blue/20 border border-brand-blue/40 p-3 rounded-md mb-4">
                <p className="text-brand-blue text-sm">Mantenha seus dados atualizados para garantir a segurança e acesso aos serviços financeiros.</p>
            </div>
            
            {/* Contact Info */}
            <div className="border-b border-gray-700 pb-4 mb-4 space-y-4">
                <h3 className="text-white font-semibold text-sm uppercase tracking-wider">Contato</h3>
                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">E-mail</label>
                    <input 
                        type="email" 
                        value={tempRegistration.email} 
                        onChange={(e) => setTempRegistration({...tempRegistration, email: e.target.value})}
                        className="w-full bg-gray-700 rounded-md p-2 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-brand-blue" 
                    />
                </div>
                 <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Telefone / Celular</label>
                    <input 
                        type="tel" 
                        value={tempRegistration.phone} 
                        onChange={(e) => setTempRegistration({...tempRegistration, phone: e.target.value})}
                        className="w-full bg-gray-700 rounded-md p-2 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-brand-blue" 
                    />
                </div>
            </div>

            {/* Financial/Legal Info */}
             <div className="space-y-4">
                <h3 className="text-white font-semibold text-sm uppercase tracking-wider">Dados Financeiros</h3>
                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">CPF</label>
                    <input 
                        type="text" 
                        value={tempRegistration.cpf} 
                        onChange={(e) => setTempRegistration({...tempRegistration, cpf: e.target.value})}
                        placeholder="000.000.000-00"
                        className="w-full bg-gray-700 rounded-md p-2 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-brand-blue" 
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Data de Nascimento</label>
                    <input 
                        type="date" 
                        value={tempRegistration.birthDate} 
                        onChange={(e) => setTempRegistration({...tempRegistration, birthDate: e.target.value})}
                        className="w-full bg-gray-700 rounded-md p-2 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-brand-blue" 
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Renda Mensal (R$)</label>
                    <input 
                        type="number" 
                        value={tempRegistration.monthlyIncome} 
                        onChange={(e) => setTempRegistration({...tempRegistration, monthlyIncome: parseFloat(e.target.value) || 0})}
                        className="w-full bg-gray-700 rounded-md p-2 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-brand-blue" 
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Profissão</label>
                    <input 
                        type="text" 
                        value={tempRegistration.occupation} 
                        onChange={(e) => setTempRegistration({...tempRegistration, occupation: e.target.value})}
                        className="w-full bg-gray-700 rounded-md p-2 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-brand-blue" 
                    />
                </div>
            </div>

            <button 
                onClick={handleSaveRegistration}
                className="w-full bg-brand-teal text-white font-bold py-3 px-4 rounded-md hover:bg-brand-teal/90 flex items-center justify-center space-x-2 transition-colors duration-200 mt-4"
            >
                <Save size={20} />
                <span>Salvar Dados</span>
            </button>
         </div>
      </Modal>
    </div>
  );
};

export default Dashboard;
