
import React, { useState, useEffect } from 'react';
import type { User, Car } from '../types';
import { Wrench, FileText, Calendar, Shield, Plus, MapPin, Edit3, Car as CarIcon, Upload, Lock, Globe, Instagram, ArrowLeft, Trash2, CreditCard, CheckCircle, X } from 'lucide-react';
import { getVehicleHealthAnalysis } from '../services/geminiService';
import { checkVehicleStatus, SimulationResult } from '../services/mockApiService';
import { uploadImage } from '../services/firebaseService';
import Modal from './common/Modal';
import ImageWithFallback from './common/ImageWithFallback';

interface ProfileProps {
  user: User;
  garage: Car[];
  onUpdateProfile: (updates: Partial<User>) => void;
  onAddCar: (car: Car) => void;
  onUpdateCar: (id: string, car: Partial<Car>) => void;
  onDeleteCar: (id: string) => void;
  onViewCarDetails: (car: Car) => void;
  isReadOnly?: boolean;
  onBack?: () => void;
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

const Profile: React.FC<ProfileProps> = ({ 
    user, 
    garage = [], // Default to empty array to prevent crashes
    onUpdateProfile, 
    onAddCar, 
    onUpdateCar, 
    onDeleteCar,
    onViewCarDetails, 
    isReadOnly = false, 
    onBack 
}) => {
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [tempProfile, setTempProfile] = useState(user);
  
  useEffect(() => {
      setTempProfile(user);
  }, [user]);

  // Car Modal State
  const [isCarModalOpen, setIsCarModalOpen] = useState(false);
  const [editingCarId, setEditingCarId] = useState<string | null>(null);
  const initialCarState: Car = {
      make: '',
      model: '',
      year: new Date().getFullYear(),
      licensePlate: '',
      vin: '',
      imageUrl: ''
  };
  const [tempCar, setTempCar] = useState<Car>(initialCarState);

  // Tools State
  const [issueDescription, setIssueDescription] = useState('');
  const [analysis, setAnalysis] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [serviceModalOpen, setServiceModalOpen] = useState(false);
  const [serviceResult, setServiceResult] = useState<SimulationResult | null>(null);
  const [isServiceLoading, setIsServiceLoading] = useState(false);
  
  const [locationError, setLocationError] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  const handleSaveProfile = () => {
    if (tempProfile.location && !/^[A-Za-zÀ-ÖØ-öø-ÿ\s]+,\s*[A-Z]{2}$/.test(tempProfile.location)) {
        setLocationError('Formato inválido. Use: Cidade, UF (Ex: São Paulo, SP)');
        return;
    }
    setLocationError('');
    onUpdateProfile(tempProfile);
    setIsProfileModalOpen(false);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: 'avatarUrl' | 'coverUrl') => {
    const file = e.target.files?.[0];
    if (file) {
      setIsUploading(true);
      try {
          const downloadURL = await uploadImage(file, `users/${user.name}/${field}_${Date.now()}`);
          setTempProfile(prev => ({ ...prev, [field]: downloadURL }));
      } catch (error) {
          console.error("Upload failed", error);
      } finally {
          setIsUploading(false);
      }
    }
  };

  const handleCnhUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsUploading(true);
      try {
        const downloadURL = await uploadImage(file, `users/${user.name}/cnh_${Date.now()}`);
        setTempProfile(prev => ({ ...prev, cnhImageUrl: downloadURL }));
      } catch (error) {
        console.error("CNH upload failed", error);
      } finally {
        setIsUploading(false);
      }
    }
  };

  const handleRemoveCnh = () => {
    setTempProfile(prev => ({ ...prev, cnhImageUrl: '' }));
  };

  const openAddCarModal = () => {
      setTempCar(initialCarState);
      setEditingCarId(null);
      setIsCarModalOpen(true);
  };

  const openEditCarModal = (car: Car) => {
      setTempCar(car);
      setEditingCarId(car.id || null);
      setIsCarModalOpen(true);
  };

  const handleCarImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsUploading(true);
      try {
          const downloadURL = await uploadImage(file, `garage/${user.name}/car_${Date.now()}`);
          setTempCar(prev => ({ ...prev, imageUrl: downloadURL }));
      } catch (error) {
          console.error("Upload failed", error);
      } finally {
          setIsUploading(false);
      }
    }
  };

  const handleSaveCar = () => {
    if (editingCarId) {
        onUpdateCar(editingCarId, tempCar);
    } else {
        onAddCar(tempCar);
    }
    setIsCarModalOpen(false);
  };

  const handleCarInputChange = (field: keyof Car, value: string | number) => {
    setTempCar(prev => ({ ...prev, [field]: value }));
  };

  const handleDeleteClick = (e: React.MouseEvent, id?: string) => {
      e.stopPropagation();
      if (id && confirm("Tem certeza que deseja excluir este veículo da sua garagem?")) {
          onDeleteCar(id);
      }
  }

  const handleServiceClick = async (type: 'fines' | 'ipva' | 'insurance_status') => {
    if (garage.length === 0) {
        alert("Adicione um veículo primeiro para consultar serviços.");
        return;
    }
    setServiceModalOpen(true);
    setIsServiceLoading(true);
    setServiceResult(null);
    try {
        const result = await checkVehicleStatus(type, garage[0]);
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

  return (
    <div>
       <div className="relative mb-16">
            {isReadOnly && onBack && (
                <button onClick={onBack} className="absolute top-4 left-4 z-50 bg-black/50 backdrop-blur-md text-white p-2 rounded-full hover:bg-black/70 transition-colors">
                    <ArrowLeft size={24} />
                </button>
            )}

            <div className="h-40 w-full bg-gray-800 overflow-hidden relative group">
                <ImageWithFallback src={user.coverUrl || ''} alt="Cover" className="w-full h-full opacity-70" fallbackType="general" />
                <div className={`absolute top-2 ${isReadOnly && onBack ? 'right-4' : 'left-4'} bg-black/50 backdrop-blur-sm px-3 py-1 rounded-full`}>
                    <p className="text-xs text-white font-bold uppercase tracking-wider">
                        {isReadOnly ? `Garagem de ${user.name}` : `Minha Garagem`}
                    </p>
                </div>
            </div>
            
            <div className="absolute top-24 left-4 right-4 flex justify-between items-end">
                <div className="relative w-28 h-28 rounded-full border-4 border-gray-900 bg-gray-800 overflow-hidden">
                    <ImageWithFallback src={user.avatarUrl} alt={user.name} fallbackType="user" className="w-full h-full" />
                </div>
                {!isReadOnly && (
                    <button onClick={() => setIsProfileModalOpen(true)} className="mb-2 bg-gray-800/80 backdrop-blur-md border border-gray-600 text-white px-4 py-2 rounded-full text-sm font-bold hover:bg-gray-700 transition-colors shadow-lg">
                        Editar Perfil
                    </button>
                )}
            </div>
       </div>

       <div className="px-4 mb-6">
            <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold text-white leading-tight">{user.name}</h1>
                {user.isPublicProfile ? <Globe size={16} className="text-gray-400" /> : <Lock size={16} className="text-gray-400" />}
            </div>
            <p className="text-gray-500 text-sm mb-2">@{user.name.replace(/\s+/g, '').toLowerCase()}</p>
            <p className="text-gray-300 text-sm mb-2">{user.bio || 'Sem biografia.'}</p>
            {user.location && <div className="flex items-center text-gray-500 text-sm"><MapPin size={14} className="mr-1" /><span>{user.location}</span></div>}
       </div>

       <div className="p-4 space-y-6 border-t border-gray-800 pt-6">
            <h2 className="text-xl font-bold text-white">Garagem ({garage.length})</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {garage.map((car, index) => (
                    <div key={car.id || index} onClick={() => onViewCarDetails(car)} className="bg-gray-800 rounded-xl overflow-hidden shadow-lg border border-gray-700 relative group cursor-pointer transform transition-all duration-300 hover:shadow-brand-blue/20 hover:border-brand-blue h-48 flex flex-col">
                        <div className="h-28 w-full overflow-hidden relative">
                            <ImageWithFallback src={car.imageUrl} alt={`${car.make} ${car.model}`} fallbackType="car" className="w-full h-full group-hover:scale-105 transition-transform duration-300" />
                            {!isReadOnly && (
                                <div className="absolute top-2 right-2 flex gap-2">
                                    <button onClick={(e) => { e.stopPropagation(); openEditCarModal(car); }} className="bg-black/60 p-2 rounded-full text-white hover:bg-brand-blue transition-colors border border-gray-600">
                                        <Edit3 size={14} />
                                    </button>
                                    <button onClick={(e) => handleDeleteClick(e, car.id)} className="bg-black/60 p-2 rounded-full text-white hover:bg-red-500 transition-colors border border-gray-600">
                                        <Trash2 size={14} />
                                    </button>
                                </div>
                            )}
                        </div>
                        <div className="p-3 flex-1 flex flex-col justify-center">
                            <h3 className="text-lg font-bold leading-tight truncate">{car.make} {car.model}</h3>
                            <p className="text-gray-400 text-xs mt-1">{car.year} • {isReadOnly ? '***-****' : car.licensePlate}</p>
                        </div>
                    </div>
                ))}

                {!isReadOnly && (
                    <button onClick={openAddCarModal} className="bg-gray-800/50 rounded-xl border-2 border-dashed border-gray-700 flex flex-col items-center justify-center p-6 hover:border-brand-blue hover:bg-gray-800 transition-all group h-48">
                        <div className="bg-gray-700 group-hover:bg-brand-blue p-3 rounded-full transition-colors mb-3"><Plus size={24} className="text-white" /></div>
                        <span className="text-gray-400 group-hover:text-white font-medium">Adicionar Veículo</span>
                    </button>
                )}
            </div>

            {!isReadOnly && (
                <>
                    <div className="bg-gray-800 rounded-xl p-4 shadow-lg border border-gray-700">
                        <h3 className="text-lg font-semibold mb-4">Serviços</h3>
                        <div className="grid grid-cols-3 gap-4">
                            <PaymentButton icon={<FileText size={24} className="text-brand-blue"/>} label="Multas" onClick={() => handleServiceClick('fines')}/>
                            <PaymentButton icon={<Calendar size={24} className="text-brand-blue"/>} label="IPVA" onClick={() => handleServiceClick('ipva')}/>
                            <PaymentButton icon={<Shield size={24} className="text-brand-blue"/>} label="Seguro" onClick={() => handleServiceClick('insurance_status')}/>
                        </div>
                    </div>
                    <div className="bg-gray-800 rounded-xl p-4 shadow-lg border border-gray-700">
                        <h3 className="text-lg font-semibold mb-4 flex items-center"><Wrench className="mr-2 text-brand-blue" size={20}/> Diagnóstico com IA</h3>
                        <textarea value={issueDescription} onChange={(e) => setIssueDescription(e.target.value)} placeholder="Descreva o problema..." className="w-full bg-gray-700 rounded-md p-3 text-white outline-none mb-3" rows={4}/>
                        <button onClick={handleHealthCheck} disabled={isLoading || !issueDescription.trim()} className="mt-4 w-full bg-brand-blue text-white font-bold py-2 px-4 rounded-md hover:bg-brand-blue/90 disabled:opacity-50">
                            {isLoading ? 'Analisando...' : 'Analisar Problema'}
                        </button>
                        {analysis && <div className="mt-4 bg-gray-700/50 p-4 rounded-md"><p className="text-gray-300 text-sm">{analysis}</p></div>}
                    </div>
                </>
            )}
      </div>

      {!isReadOnly && (
          <Modal isOpen={isProfileModalOpen} onClose={() => setIsProfileModalOpen(false)} title="Editar Perfil">
             <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
                <div className="bg-gray-700/30 p-3 rounded-lg flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        {tempProfile.isPublicProfile ? <Globe size={18} className="text-brand-blue" /> : <Lock size={18} className="text-gray-400" />}
                        <span className="text-sm text-gray-300">Perfil Público</span>
                    </div>
                    <button onClick={() => setTempProfile(prev => ({ ...prev, isPublicProfile: !prev.isPublicProfile }))} className={`w-12 h-6 rounded-full relative transition-colors ${tempProfile.isPublicProfile ? 'bg-brand-blue' : 'bg-gray-600'}`}>
                        <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-transform ${tempProfile.isPublicProfile ? 'left-7' : 'left-1'}`}></div>
                    </button>
                </div>
                <input value={tempProfile.name} onChange={e => setTempProfile({...tempProfile, name: e.target.value})} className="w-full bg-gray-700 p-2 rounded text-white" placeholder="Nome"/>
                <textarea value={tempProfile.bio} onChange={e => setTempProfile({...tempProfile, bio: e.target.value})} className="w-full bg-gray-700 p-2 rounded text-white" rows={3} placeholder="Bio"/>
                <input value={tempProfile.location} onChange={e => setTempProfile({...tempProfile, location: e.target.value})} className="w-full bg-gray-700 p-2 rounded text-white" placeholder="Cidade, UF"/>
                {locationError && <p className="text-red-400 text-xs">{locationError}</p>}

                {/* CNH Upload */}
                <div className="bg-gray-700/30 p-4 rounded-lg space-y-3">
                  <div className="flex items-center gap-2">
                    <CreditCard size={18} className="text-brand-orange" />
                    <span className="text-sm font-semibold text-white">CNH (Carteira de Motorista)</span>
                  </div>

                  {tempProfile.cnhImageUrl ? (
                    <div className="relative">
                      <div className="flex items-center gap-2 bg-green-900/30 border border-green-700/50 p-3 rounded-lg">
                        <CheckCircle size={18} className="text-green-400 shrink-0" />
                        <span className="text-sm text-green-300 flex-1">CNH enviada com sucesso</span>
                        <button onClick={handleRemoveCnh} className="text-gray-400 hover:text-red-400 transition-colors p-1" title="Remover CNH">
                          <X size={16} />
                        </button>
                      </div>
                      <img src={tempProfile.cnhImageUrl} alt="CNH" className="mt-2 rounded-lg max-h-40 w-full object-cover border border-gray-600" />
                    </div>
                  ) : (
                    <label className={`cursor-pointer bg-gray-700 hover:bg-gray-600 px-3 py-3 rounded-lg text-sm flex items-center justify-center gap-2 w-full border border-dashed border-gray-500 transition-colors ${isUploading ? 'opacity-50 pointer-events-none' : ''}`}>
                      <Upload size={16} className="text-brand-orange" />
                      <span className="text-gray-300">{isUploading ? 'Enviando...' : 'Enviar foto da CNH'}</span>
                      <input type="file" accept="image/*" className="hidden" onChange={handleCnhUpload} disabled={isUploading} />
                    </label>
                  )}
                  <p className="text-xs text-gray-500">Envie uma foto legível da frente da sua CNH. O documento será usado para completar seu cadastro.</p>
                </div>

                <button onClick={handleSaveProfile} disabled={isUploading} className="w-full bg-brand-blue text-white font-bold py-2 rounded disabled:opacity-50">{isUploading ? 'Salvando...' : 'Salvar'}</button>
             </div>
          </Modal>
      )}

      {!isReadOnly && (
          <Modal isOpen={isCarModalOpen} onClose={() => setIsCarModalOpen(false)} title={editingCarId ? "Editar Veículo" : "Adicionar Veículo"}>
             <div className="space-y-4">
                <input value={tempCar.make} onChange={e => handleCarInputChange('make', e.target.value)} className="w-full bg-gray-700 p-2 rounded text-white" placeholder="Marca"/>
                <input value={tempCar.model} onChange={e => handleCarInputChange('model', e.target.value)} className="w-full bg-gray-700 p-2 rounded text-white" placeholder="Modelo"/>
                <div className="grid grid-cols-2 gap-4">
                    <input type="number" value={tempCar.year} onChange={e => handleCarInputChange('year', parseInt(e.target.value))} className="w-full bg-gray-700 p-2 rounded text-white" placeholder="Ano"/>
                    <input value={tempCar.licensePlate} onChange={e => handleCarInputChange('licensePlate', e.target.value)} className="w-full bg-gray-700 p-2 rounded text-white" placeholder="Placa"/>
                </div>
                <label className={`cursor-pointer bg-gray-700 hover:bg-gray-600 px-3 py-2 rounded-md text-sm flex items-center justify-center gap-2 w-full border border-gray-600 ${isUploading ? 'opacity-50' : ''}`}>
                    <Upload size={16} /><span>{isUploading ? 'Enviando...' : 'Escolher foto'}</span>
                    <input type="file" accept="image/*" className="hidden" onChange={handleCarImageUpload} disabled={isUploading} />
                </label>
                <button onClick={handleSaveCar} disabled={isUploading} className="w-full bg-brand-blue text-white font-bold py-2 rounded disabled:opacity-50">
                    <CarIcon size={20} className="inline mr-2"/>{editingCarId ? "Atualizar" : "Salvar"}
                </button>
             </div>
          </Modal>
      )}

      {serviceModalOpen && (
        <Modal isOpen={serviceModalOpen} onClose={() => setServiceModalOpen(false)} title={serviceResult?.title || 'Consultando...'}>
            {isServiceLoading ? <div className="text-center p-4">Carregando...</div> : (
                <div className="space-y-2">
                    {serviceResult?.details.map((d, i) => <div key={i} className="flex justify-between border-b border-gray-700 pb-1"><span>{d.label}</span><span className="font-bold">{d.value}</span></div>)}
                    <p className="text-xs text-center text-gray-500 mt-4">{serviceResult?.disclaimer}</p>
                </div>
            )}
        </Modal>
      )}
    </div>
  );
};

export default Profile;
