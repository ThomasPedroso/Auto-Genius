
import React, { useState, useMemo, useEffect } from 'react';
import { Search, Gauge, Palette, Fuel, Wand2, Sparkles, X, RotateCcw, Heart } from 'lucide-react';
import type { MarketplaceCar } from '../types';
import { generateCarImage, searchCarsWithGemini } from '../services/geminiService';
import { getMarketplaceCars, updateMarketplaceCar, uploadImage } from '../services/firebaseService';
import Loader from './common/Loader';
import ImageWithFallback from './common/ImageWithFallback';

interface CarCardProps {
  car: MarketplaceCar;
  onSelectCar: (car: MarketplaceCar) => void;
  onUpdateImage: (id: string, newUrl: string) => void;
  onToggleLike: (id: string) => void;
}

const CarCard: React.FC<CarCardProps> = ({ car, onSelectCar, onUpdateImage, onToggleLike }) => {
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerateImage = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsGenerating(true);
    try {
      const newImage = await generateCarImage(
        car.make,
        car.model,
        car.year,
        car.color,
        car.description
      );
      onUpdateImage(car.id, newImage);
    } catch (error) {
      console.error("Failed to generate image", error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div 
      onClick={() => onSelectCar(car)}
      className="bg-gray-800 rounded-xl overflow-hidden shadow-lg border border-gray-700 transition-all duration-300 hover:shadow-2xl hover:shadow-brand-blue/30 hover:border-brand-blue group cursor-pointer relative"
    >
      <div className="overflow-hidden relative h-48 w-full">
        <ImageWithFallback 
          key={car.imageUrl}
          src={car.imageUrl} 
          alt={`${car.make} ${car.model}`} 
          fallbackType="car"
          className="w-full h-full group-hover:scale-110 transition-transform duration-300"
        />
        
        {/* Like Button */}
        <button
            onClick={(e) => {
                e.stopPropagation();
                onToggleLike(car.id);
            }}
            className={`absolute top-2 left-2 p-2 rounded-full backdrop-blur-md transition-colors z-10 flex items-center gap-1.5 border ${
                car.isLiked
                ? 'bg-brand-red/20 text-brand-red border-brand-red/50'
                : 'bg-gray-900/60 text-white border-gray-600 hover:bg-gray-900/80'
            }`}
        >
            <Heart size={16} fill={car.isLiked ? "currentColor" : "none"} />
            <span className="text-xs font-bold">{car.likes}</span>
        </button>

        {/* AI Generation Button */}
        <button
          onClick={handleGenerateImage}
          disabled={isGenerating}
          className="absolute top-2 right-2 bg-gray-900/80 backdrop-blur-sm hover:bg-brand-blue text-white p-2 rounded-full transition-colors border border-gray-600 hover:border-brand-blue z-10 group/btn"
          title="Gerar imagem com IA baseada na descrição"
        >
           <Wand2 size={18} className={`${isGenerating ? 'animate-spin' : ''} text-brand-teal group-hover/btn:text-white`} />
        </button>

        {isGenerating && (
          <div className="absolute inset-0 bg-gray-900/80 flex items-center justify-center z-20 backdrop-blur-sm">
            <Loader text="Criando imagem..." />
          </div>
        )}
      </div>
      
      <div className="p-4">
        <h3 className="text-lg font-bold text-white">{car.year} {car.make} {car.model}</h3>
        <p className="text-2xl font-semibold text-brand-blue mt-2">
          {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(car.price)}
        </p>
        <p className="text-sm text-gray-400 mt-2 h-10 overflow-hidden line-clamp-2">{car.description}</p>
        
        <div className="mt-4 pt-3 border-t border-gray-700 flex justify-around items-center text-xs text-gray-400">
          <span className="flex items-center space-x-1">
            <Gauge size={14} />
            <span>{car.mileage.toLocaleString('pt-BR')} km</span>
          </span>
          <span className="flex items-center space-x-1">
            <Palette size={14} />
            <span>{car.color}</span>
          </span>
          <span className="flex items-center space-x-1">
            <Fuel size={14} />
            <span>{car.fuelType}</span>
          </span>
        </div>

        <button 
          onClick={(e) => {
            e.stopPropagation();
            onSelectCar(car);
          }}
          className="mt-4 w-full bg-brand-blue text-white font-bold py-2 px-4 rounded-md hover:bg-brand-blue/90 transition-colors duration-200"
        >
          Ver Detalhes
        </button>
      </div>
    </div>
  );
};

interface MarketplaceProps {
    onSelectCar: (car: MarketplaceCar) => void;
}

const Marketplace: React.FC<MarketplaceProps> = ({ onSelectCar }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [cars, setCars] = useState<MarketplaceCar[]>([]);
  const [isLoadingDB, setIsLoadingDB] = useState(true);
  const [aiFilteredIds, setAiFilteredIds] = useState<string[] | null>(null);
  const [isAiSearching, setIsAiSearching] = useState(false);

  // Initial Load from Firebase
  useEffect(() => {
    const loadData = async () => {
      try {
        const loadedCars = await getMarketplaceCars();
        setCars(loadedCars);
      } catch (error) {
        console.error("Failed to load cars:", error);
      } finally {
        setIsLoadingDB(false);
      }
    };
    loadData();
  }, []);

  // Helper to convert Base64 to Blob for upload
  const base64ToBlob = async (base64: string): Promise<Blob> => {
    const res = await fetch(base64);
    return await res.blob();
  };

  const handleUpdateCarImage = async (id: string, base64Image: string) => {
    // 1. Optimistic UI update (immediate feedback)
    const updatedCars = cars.map(car => 
      car.id === id ? { ...car, imageUrl: base64Image } : car
    );
    setCars(updatedCars);

    // 2. Persist to Firebase Storage -> Firestore
    try {
        // Check if it's a base64 string (starts with data:image)
        if (base64Image.startsWith('data:image')) {
            const blob = await base64ToBlob(base64Image);
            const file = new File([blob], `car-${id}-${Date.now()}.png`, { type: 'image/png' });
            
            // Upload to Storage
            const storageUrl = await uploadImage(file, `marketplace_images/${id}/${Date.now()}.png`);
            
            // Update Firestore with the short Storage URL
            await updateMarketplaceCar(id, { imageUrl: storageUrl });
            
            // Update local state again with the permanent URL
            setCars(prev => prev.map(car => 
                car.id === id ? { ...car, imageUrl: storageUrl } : car
            ));
        } else {
            // If it's already a URL (e.g. fallback), just save it
            await updateMarketplaceCar(id, { imageUrl: base64Image });
        }
    } catch (error) {
      console.error("Failed to save image to DB:", error);
    }
  };

  const handleToggleLike = async (id: string) => {
    const car = cars.find(c => c.id === id);
    if (!car) return;

    const newIsLiked = !car.isLiked;
    const newLikes = newIsLiked ? car.likes + 1 : Math.max(0, car.likes - 1);

    const updatedCars = cars.map(c => {
      if (c.id === id) {
        return { ...c, isLiked: newIsLiked, likes: newLikes };
      }
      return c;
    });
    
    setCars(updatedCars);

    try {
        await updateMarketplaceCar(id, { isLiked: newIsLiked, likes: newLikes });
    } catch (error) {
        console.error("Failed to save like to DB:", error);
    }
  };

  const handleAiSearch = async () => {
    if (!searchTerm.trim()) return;

    setIsAiSearching(true);
    try {
      const matchedIds = await searchCarsWithGemini(searchTerm, cars);
      setAiFilteredIds(matchedIds);
    } catch (error) {
      console.error('AI Search failed', error);
    } finally {
      setIsAiSearching(false);
    }
  };

  const filteredCars = useMemo(() => {
    if (aiFilteredIds !== null) {
      return cars.filter(car => aiFilteredIds.includes(car.id));
    }
    if (!searchTerm) {
      return cars;
    }
    return cars.filter(car =>
      `${car.make} ${car.model} ${car.year}`.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, cars, aiFilteredIds]);

  if (isLoadingDB) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-100px)]">
        <Loader text="Carregando Loja..." />
      </div>
    );
  }

  return (
    <div className="p-4 space-y-6">
      <header>
        <h1 className="text-3xl font-bold text-center">Marketplace</h1>
        <p className="text-center text-gray-400">Encontre o carro dos seus sonhos</p>
      </header>
      
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
        <input
          type="text"
          placeholder="Descreva o carro que você procura..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setAiFilteredIds(null);
          }}
          onKeyDown={(e) => {
             if (e.key === 'Enter') handleAiSearch();
          }}
          className="w-full bg-gray-800 border border-gray-700 rounded-lg py-3 pl-10 pr-14 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-blue transition-all"
        />
        <button
          onClick={handleAiSearch}
          disabled={isAiSearching || !searchTerm.trim()}
          className="absolute right-2 top-1/2 -translate-y-1/2 text-brand-blue hover:bg-brand-blue/10 p-2 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          title="Busca Inteligente com Gemini AI"
        >
          {isAiSearching ? (
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-brand-blue"></div>
          ) : (
            <Sparkles size={20} />
          )}
        </button>
      </div>

      {aiFilteredIds !== null && (
        <div className="flex items-center justify-between bg-brand-blue/10 border border-brand-blue/30 p-3 rounded-lg">
          <div className="flex items-center gap-2 text-sm text-brand-blue">
            <Sparkles size={16} />
            <span>Exibindo resultados encontrados pela IA</span>
          </div>
          <button 
            onClick={() => {
                setAiFilteredIds(null);
                setSearchTerm('');
            }}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X size={16} />
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredCars.map(car => (
          <CarCard 
            key={car.id} 
            car={car} 
            onSelectCar={onSelectCar} 
            onUpdateImage={handleUpdateCarImage}
            onToggleLike={handleToggleLike}
          />
        ))}
      </div>
      
      {filteredCars.length === 0 && (
        <div className="text-center py-10">
            <p className="text-gray-500">Nenhum carro encontrado. {aiFilteredIds !== null ? 'Tente reformular sua busca.' : 'Tente uma busca diferente.'}</p>
        </div>
      )}
    </div>
  );
};

export default Marketplace;
