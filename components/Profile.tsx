
import React, { useState } from 'react';
import type { User, Car } from '../types';
import { Wrench, FileText, Calendar, Shield, Plus, MapPin, Edit3, Car as CarIcon, Upload, Lock, Globe, Instagram } from 'lucide-react';
import { getVehicleHealthAnalysis } from '../services/geminiService';
import { checkVehicleStatus, SimulationResult } from '../services/mockApiService';
import Modal from './common/Modal';
import ImageWithFallback from './common/ImageWithFallback';

interface ProfileProps {
  user: User;
  car: Car;
  onUpdateProfile: (updates: Partial<User>) => void;
  onUpdateCar: (car: Car) => void;
  onViewCarDetails: (car: Car) => void;
}

const PaymentButton: React.FC<{ icon: React.ReactNode; label: string; onClick: () => void }> = ({ icon, label, onClick }) => (
  <button 
    onClick={onClick}
    className="flex flex-col items-center justify-center space-y-2 bg-gray-700 p-4 rounded-lg w-full text-center hover:bg-gray-600 transition-colors duration-200 hover:shadow-lg"
  >
    {icon}
    <span className="text-sm font-medium text-gray-300">{label}</span>
  </button>
);

const Profile: React.FC<ProfileProps> = ({ user, car, onUpdateProfile, onUpdateCar, onViewCarDetails }) => {
  // Profile Edit State
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [tempProfile, setTempProfile] = useState({
      name: user.name,
      avatarUrl: user.avatarUrl,
      bio: user.bio || '',
      location: user.location || '',
      instagram: user.instagram || '',
      coverUrl: user.coverUrl || '',
      isPublicProfile: user.isPublicProfile ?? true
  });

  // Car State
  const [isCarModalOpen, setIsCarModalOpen] = useState(false);
  const [tempCar, setTempCar] = useState<Car>(car);

  // Diagnosis State
  const [issueDescription, setIssueDescription] = useState('');
  const [analysis, setAnalysis] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Service Status Modal
  const [serviceModalOpen, setServiceModalOpen] = useState(false);
  const [serviceResult, setServiceResult] = useState<SimulationResult | null>(null);
  const [isServiceLoading, setIsServiceLoading] = useState(false);

  const handleSaveProfile = () => {
    onUpdateProfile(tempProfile);
    setIsProfileModalOpen(false);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, field: 'avatarUrl' | 'coverUrl') => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setTempProfile(prev => ({ ...prev, [field]: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCarImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setTempCar(prev => ({ ...prev, imageUrl: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleServiceClick = async (type: 'fines' | 'ipva' | 'insurance_status') => {
    setServiceModalOpen(true);
    setIsServiceLoading(true);
    setServiceResult(null);
    try {
        const result = await checkVehicleStatus(type, car);
        setServiceResult(result);
    } catch (error) {
        console.error(error);
    } finally {
        setIsServiceLoading(false);
    }
  };

  const handleHealthCheck = async () => {
    if (!issueDescription.trim()) return;
    setIsLoading(true);
    setAnalysis('');
    try {
      const result = await getVehicleHealthAnalysis(issueDescription);
      setAnalysis(result);
    } catch (error) {
      console.error('Error getting vehicle analysis:', error);
      setAnalysis('Não foi possível analisar o problema. Por favor, tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveCar = () => {
    onUpdateCar(tempCar);
    setIsCarModalOpen(false);
  };

  const handleCarInputChange = (field: keyof Car, value: string | number) => {
    setTempCar(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div>
       {/* Social Header Section */}
       <div className="relative mb-16">
            {/* Cover Image */}
            <div className="h-40 w-full bg-gray-800 overflow-hidden relative group">
                <ImageWithFallback 
                  src={user.coverUrl || ''} 
                  alt="Cover" 
                  className="w-full h-full opacity-70"
                  fallbackType="general"
                />
                {!user.coverUrl && (
                    <div className="absolute inset-0 flex items-center justify-center text-gray-500 bg-gray-800">
                        Sem imagem de capa
                    </div>
                )}
            </div>
            
            {/* Profile Info Overlay */}
            <div className="absolute top-24 left-4 right-4 flex justify-between items-end">
                <div className="relative w-28 h-28 rounded-full border-4 border-gray-900 bg-gray-800 overflow-hidden">
                    <ImageWithFallback 
                        src={user.avatarUrl} 
                        alt={user.name} 
                        fallbackType="user"
                        className="w-full h-full" 
                    />
                </div>
                <button 
                    onClick={() => {
                        setTempProfile({
                            name: user.name,
                            avatarUrl: user.avatarUrl,
                            bio: user.bio || '',
                            location: user.location || '',
                            instagram: user.instagram || '',
                            coverUrl: user.coverUrl || '',
                            isPublicProfile: user.isPublicProfile ?? true
                        });
                        setIsProfileModalOpen(true);
                    }}
                    className="mb-2 bg-gray-800/80 backdrop-blur-md border border-gray-600 text-white px-4 py-2 rounded-full text-sm font-bold hover:bg-gray-700 transition-colors shadow-lg"
                >
                    Editar Perfil
                </button>
            </div>
       </div>

       {/* Text Info */}
       <div className="px-4 mb-6">
            <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold text-white leading-tight">{user.name}</h1>
                {user.isPublicProfile ? (
                    <span title="Perfil Público">
                      <Globe size={16} className="text-gray-400" />
                    </span>
                ) : (
                    <span title="Perfil Privado">
                      <Lock size={16} className="text-gray-400" />
                    </span>
                )}
            </div>
            <p className="text-gray-500 text-sm mb-2">@{user.name.replace(/\s+/g, '').toLowerCase()}</p>
            
            {user.instagram && (
                <div className="flex items-center text-brand-blue text-sm mb-2">
                    <Instagram size={14} className="mr-1" />
                    <a href={`https://instagram.com/${user.instagram.replace('@', '')}`} target="_blank" rel="noopener noreferrer" className="hover:underline">
                        {user.instagram}
                    </a>
                </div>
            )}

            <p className="text-gray-300 text-sm mb-2">{user.bio || 'Sem biografia.'}</p>
            
            {user.location && (
                <div className="flex items-center text-gray-500 text-sm">
                    <MapPin size={14} className="mr-1" />
                    <span>{user.location}</span>
                </div>
            )}
       </div>

       <div className="p-4 space-y-6 border-t border-gray-800 pt-6">
            <h2 className="text-xl font-bold text-white">Minha Garagem</h2>

            {/* Car Card */}
            <div 
                onClick={() => onViewCarDetails(car)}
                className="bg-gray-800 rounded-xl overflow-hidden shadow-lg border border-gray-700 relative group cursor-pointer transform transition-all duration-300 hover:shadow-brand-blue/20 hover:border-brand-blue"
            >
                <div className="w-full h-48 overflow-hidden relative">
                    <ImageWithFallback 
                      src={car.imageUrl} 
                      alt={`${car.make} ${car.model}`} 
                      fallbackType="car"
                      className="w-full h-full group-hover:scale-105 transition-transform duration-300" 
                    />
                </div>
                <div className="p-4 space-y-3">
                <div className="flex justify-between items-start">
                    <h2 className="text-xl font-bold group-hover:text-brand-blue transition-colors">{car.year} {car.make} {car.model}</h2>
                    <button 
                        onClick={(e) => {
                            e.stopPropagation(); 
                            setTempCar(car);
                            setIsCarModalOpen(true);
                        }}
                        className="bg-brand-blue hover:bg-brand-blue/90 p-2 rounded-full transition-colors text-white shadow-lg z-10 relative"
                        title="Adicionar/Trocar Veículo"
                    >
                        <Plus size={20} />
                    </button>
                </div>
                <div className="text-sm text-gray-400 space-y-1">
                    <p><span className="font-semibold text-gray-300">Placa:</span> {car.licensePlate}</p>
                    <p><span className="font-semibold text-gray-300">Chassi:</span> {car.vin}</p>
                </div>
                <div className="pt-2">
                    <span className="text-brand-blue text-sm font-medium group-hover:underline">Ver detalhes do veículo &rarr;</span>
                </div>
                </div>
            </div>

            {/* Services */}
            <div className="bg-gray-800 rounded-xl p-4 shadow-lg border border-gray-700">
                <h3 className="text-lg font-semibold mb-4">Pagamentos e Serviços</h3>
                <div className="grid grid-cols-3 gap-4">
                    <PaymentButton 
                        icon={<FileText size={24} className="text-brand-blue"/>} 
                        label="Multas" 
                        onClick={() => handleServiceClick('fines')}
                    />
                    <PaymentButton 
                        icon={<Calendar size={24} className="text-brand-blue"/>} 
                        label="IPVA" 
                        onClick={() => handleServiceClick('ipva')}
                    />
                    <PaymentButton 
                        icon={<Shield size={24} className="text-brand-blue"/>} 
                        label="Seguro" 
                        onClick={() => handleServiceClick('insurance_status')}
                    />
                </div>
            </div>

            {/* Diagnostics */}
            <div className="bg-gray-800 rounded-xl p-4 shadow-lg border border-gray-700">
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                <Wrench className="mr-2 text-brand-blue" size={20}/>
                Diagnóstico com IA
                </h3>
                <p className="text-sm text-gray-400 mb-4">
                Descreva um problema ou um barulho estranho no seu carro e nossa IA fornecerá uma análise preliminar.
                </p>
                <textarea
                value={issueDescription}
                onChange={(e) => setIssueDescription(e.target.value)}
                placeholder="Ex: 'Meu carro está fazendo um barulho de clique ao virar o volante...'"
                className="w-full bg-gray-700 rounded-md p-3 text-white placeholder-gray-500 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-brand-blue"
                rows={4}
                />
                <button
                onClick={handleHealthCheck}
                disabled={isLoading || !issueDescription.trim()}
                className="mt-4 w-full bg-brand-blue text-white font-bold py-2 px-4 rounded-md hover:bg-brand-blue/90 disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors duration-200"
                >
                {isLoading ? 'Analisando...' : 'Analisar Problema'}
                </button>
                {isLoading && (
                    <div className="flex justify-center items-center mt-4">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-blue"></div>
                    </div>
                )}
                {analysis && (
                <div className="mt-4 bg-gray-700/50 p-4 rounded-md">
                    <h4 className="font-semibold text-white mb-2">Resultado da Análise:</h4>
                    <p className="text-gray-300 whitespace-pre-wrap text-sm">{analysis}</p>
                </div>
                )}
            </div>
      </div>

      {/* Profile Edit Modal */}
      <Modal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        title="Editar Perfil"
      >
         <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
            <div className="bg-gray-700/30 p-3 rounded-lg mb-2 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    {tempProfile.isPublicProfile ? <Globe size={18} className="text-brand-blue" /> : <Lock size={18} className="text-gray-400" />}
                    <span className="text-sm text-gray-300">Perfil Público</span>
                </div>
                <button 
                    onClick={() => setTempProfile(prev => ({ ...prev, isPublicProfile: !prev.isPublicProfile }))}
                    className={`w-12 h-6 rounded-full transition-colors duration-200 relative ${tempProfile.isPublicProfile ? 'bg-brand-blue' : 'bg-gray-600'}`}
                >
                    <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-transform duration-200 ${tempProfile.isPublicProfile ? 'left-7' : 'left-1'}`}></div>
                </button>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Nome</label>
                <input 
                    type="text" 
                    value={tempProfile.name} 
                    onChange={(e) => setTempProfile({...tempProfile, name: e.target.value})}
                    className="w-full bg-gray-700 rounded-md p-2 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-brand-blue" 
                />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Instagram</label>
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Instagram size={16} className="text-gray-500" />
                    </div>
                    <input 
                        type="text" 
                        value={tempProfile.instagram} 
                        onChange={(e) => setTempProfile({...tempProfile, instagram: e.target.value})}
                        placeholder="@usuario"
                        className="w-full bg-gray-700 rounded-md p-2 pl-10 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-brand-blue" 
                    />
                </div>
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Bio</label>
                <textarea 
                    value={tempProfile.bio} 
                    onChange={(e) => setTempProfile({...tempProfile, bio: e.target.value})}
                    className="w-full bg-gray-700 rounded-md p-2 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-brand-blue"
                    rows={3}
                />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Localização</label>
                <input 
                    type="text" 
                    value={tempProfile.location} 
                    onChange={(e) => setTempProfile({...tempProfile, location: e.target.value})}
                    className="w-full bg-gray-700 rounded-md p-2 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-brand-blue" 
                />
            </div>
            
            {/* Image Uploads */}
            <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Foto de Perfil</label>
                <div className="flex items-center gap-3">
                    <img src={tempProfile.avatarUrl} className="w-10 h-10 rounded-full object-cover bg-gray-600" alt="Preview" />
                    <label className="cursor-pointer bg-gray-700 hover:bg-gray-600 px-3 py-2 rounded-md text-sm flex items-center gap-2 transition-colors">
                        <Upload size={16} />
                        <span>Escolher arquivo</span>
                        <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImageUpload(e, 'avatarUrl')} />
                    </label>
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Imagem de Capa</label>
                <div className="space-y-2">
                    {tempProfile.coverUrl && (
                        <img src={tempProfile.coverUrl} className="w-full h-20 object-cover rounded-md bg-gray-600" alt="Preview" />
                    )}
                    <label className="cursor-pointer bg-gray-700 hover:bg-gray-600 px-3 py-2 rounded-md text-sm flex items-center justify-center gap-2 transition-colors w-full">
                        <Upload size={16} />
                        <span>Escolher capa</span>
                        <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImageUpload(e, 'coverUrl')} />
                    </label>
                </div>
            </div>

            <button 
                onClick={handleSaveProfile}
                className="w-full bg-brand-blue text-white font-bold py-3 px-4 rounded-md hover:bg-brand-blue/90 flex items-center justify-center space-x-2 transition-colors duration-200 mt-4"
            >
                <Edit3 size={20} />
                <span>Salvar Alterações</span>
            </button>
         </div>
      </Modal>

      {/* Car Edit Modal */}
      <Modal
        isOpen={isCarModalOpen}
        onClose={() => setIsCarModalOpen(false)}
        title="Adicionar / Editar Veículo"
      >
         <div className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Marca</label>
                <input 
                    type="text" 
                    value={tempCar.make} 
                    onChange={(e) => handleCarInputChange('make', e.target.value)}
                    className="w-full bg-gray-700 rounded-md p-2 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-brand-blue" 
                />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Modelo</label>
                <input 
                    type="text" 
                    value={tempCar.model} 
                    onChange={(e) => handleCarInputChange('model', e.target.value)}
                    className="w-full bg-gray-700 rounded-md p-2 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-brand-blue" 
                />
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Ano</label>
                    <input 
                        type="number" 
                        value={tempCar.year} 
                        onChange={(e) => handleCarInputChange('year', parseInt(e.target.value) || new Date().getFullYear())}
                        className="w-full bg-gray-700 rounded-md p-2 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-brand-blue" 
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Placa</label>
                    <input 
                        type="text" 
                        value={tempCar.licensePlate} 
                        onChange={(e) => handleCarInputChange('licensePlate', e.target.value)}
                        className="w-full bg-gray-700 rounded-md p-2 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-brand-blue" 
                    />
                </div>
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Chassi (VIN)</label>
                <input 
                    type="text" 
                    value={tempCar.vin} 
                    onChange={(e) => handleCarInputChange('vin', e.target.value)}
                    className="w-full bg-gray-700 rounded-md p-2 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-brand-blue" 
                />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Foto do Veículo</label>
                <div className="space-y-2">
                    {tempCar.imageUrl && (
                        <img src={tempCar.imageUrl} className="w-full h-40 object-cover rounded-md bg-gray-600" alt="Preview" />
                    )}
                    <label className="cursor-pointer bg-gray-700 hover:bg-gray-600 px-3 py-2 rounded-md text-sm flex items-center justify-center gap-2 transition-colors w-full border border-gray-600">
                        <Upload size={16} />
                        <span>Escolher foto</span>
                        <input type="file" accept="image/*" className="hidden" onChange={handleCarImageUpload} />
                    </label>
                </div>
            </div>

            <button 
                onClick={handleSaveCar}
                className="w-full bg-brand-blue text-white font-bold py-3 px-4 rounded-md hover:bg-brand-blue/90 flex items-center justify-center space-x-2 transition-colors duration-200 mt-4"
            >
                <CarIcon size={20} />
                <span>Salvar Veículo</span>
            </button>
         </div>
      </Modal>

      {/* Service Result Modal */}
      {serviceModalOpen && (
        <Modal
            isOpen={serviceModalOpen}
            onClose={() => setServiceModalOpen(false)}
            title={serviceResult?.title || 'Consultando...'}
        >
            {isServiceLoading ? (
                 <div className="flex flex-col justify-center items-center h-32 space-y-4">
                    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-brand-blue"></div>
                    <p className="text-gray-400">Buscando informações...</p>
                </div>
            ) : serviceResult ? (
                <div className="space-y-4">
                    <div className="space-y-3">
                        {serviceResult.details.map((item, idx) => (
                            <div key={idx} className="flex justify-between items-center border-b border-gray-600/50 pb-2 last:border-0">
                                <span className="text-gray-400">{item.label}</span>
                                <span className="font-semibold text-white">{item.value}</span>
                            </div>
                        ))}
                    </div>
                     <div className="bg-brand-blue/20 p-3 rounded-md border border-brand-blue/50 mt-4">
                        <p className="text-xs text-brand-blue text-center">{serviceResult.disclaimer}</p>
                    </div>
                    <button 
                        onClick={() => setServiceModalOpen(false)}
                        className="w-full bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-lg transition-colors mt-2"
                    >
                        Fechar
                    </button>
                </div>
            ) : (
                <p className="text-brand-red text-center">Erro ao consultar serviço.</p>
            )}
        </Modal>
      )}
    </div>
  );
};

export default Profile;
