
import React, { useState } from 'react';
import type { MarketplaceCar, Comment } from '../types';
import { ArrowLeft, Gauge, Palette, Fuel, Calendar, Tag, Facebook, Twitter, MessageCircle, Share2, Send, MessageSquare } from 'lucide-react';
import ImageWithFallback from './common/ImageWithFallback';
import { MOCK_USER } from '../constants';

interface CarDetailProps {
  car: MarketplaceCar;
  onBack: () => void;
  isOwner?: boolean;
}

const DetailItem: React.FC<{ icon: React.ElementType; label: string; value: string | number }> = ({ icon: Icon, label, value }) => (
    <div className="bg-gray-800 p-4 rounded-lg flex flex-col items-center justify-center text-center border border-gray-700">
        <Icon size={24} className="text-brand-blue mb-2" />
        <p className="text-sm text-gray-400">{label}</p>
        <p className="font-semibold text-white mt-1">{value}</p>
    </div>
);

const CarDetail: React.FC<CarDetailProps> = ({ car, onBack, isOwner = false }) => {
  const shareUrl = window.location.href;
  const shareText = `Confira este ${car.make} ${car.model} ${car.year} incrível!`;
  
  // Comment state
  const [comments, setComments] = useState<Comment[]>(car.comments || []);
  const [newComment, setNewComment] = useState('');

  const handleShare = (platform: string) => {
      let url = '';
      switch (platform) {
          case 'facebook':
              url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
              break;
          case 'twitter':
              url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`;
              break;
          case 'whatsapp':
              url = `https://wa.me/?text=${encodeURIComponent(`${shareText} ${shareUrl}`)}`;
              break;
      }
      if (url) window.open(url, '_blank', 'width=600,height=400');
  };

  const handleAddComment = () => {
    if (!newComment.trim()) return;

    const comment: Comment = {
        id: Date.now().toString(),
        authorName: MOCK_USER.name, // Use current user
        authorAvatar: MOCK_USER.avatarUrl,
        content: newComment,
        timestamp: 'Agora'
    };

    setComments([...comments, comment]);
    setNewComment('');
  };

  return (
    <div>
      <header className="p-4 flex items-center bg-gray-900/80 backdrop-blur-sm sticky top-0 z-10 border-b border-gray-700">
        <button onClick={onBack} className="p-2 -ml-2 rounded-full text-white hover:bg-gray-700 transition-colors">
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-xl font-bold ml-2">{car.make} {car.model}</h1>
      </header>
      
      <main className={`p-4 space-y-6 ${isOwner ? 'pb-8' : 'pb-24'}`}>
        <div className="rounded-xl overflow-hidden border border-gray-700 relative group h-64">
            <ImageWithFallback 
              src={car.imageUrl} 
              alt={`${car.make} ${car.model}`} 
              fallbackType="car"
              className="w-full h-full"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
        </div>
        
        <div className="text-center">
            <h2 className="text-3xl font-bold">{car.year} {car.make} {car.model}</h2>
            {(!isOwner && car.price > 0) && (
                <p className="text-4xl font-semibold text-brand-blue mt-2">
                    {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(car.price)}
                </p>
            )}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <DetailItem icon={Calendar} label="Ano" value={car.year} />
            <DetailItem icon={Gauge} label="Quilometragem" value={`${car.mileage.toLocaleString('pt-BR')} km`} />
            <DetailItem icon={Palette} label="Cor" value={car.color} />
            <DetailItem icon={Fuel} label="Combustível" value={car.fuelType} />
        </div>

        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <h3 className="text-lg font-semibold mb-2">Descrição</h3>
            <p className="text-gray-300 leading-relaxed">{car.description}</p>
        </div>

        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-white">
                <Share2 size={20} className="text-brand-blue" />
                Compartilhar este veículo
            </h3>
            <div className="flex gap-3">
                <button 
                    onClick={() => handleShare('facebook')} 
                    className="flex-1 bg-[#1877F2]/10 hover:bg-[#1877F2]/20 text-[#1877F2] py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors border border-[#1877F2]/20"
                    aria-label="Compartilhar no Facebook"
                >
                    <Facebook size={20} />
                    <span className="font-medium hidden sm:inline">Facebook</span>
                </button>
                <button 
                    onClick={() => handleShare('twitter')} 
                    className="flex-1 bg-[#1DA1F2]/10 hover:bg-[#1DA1F2]/20 text-[#1DA1F2] py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors border border-[#1DA1F2]/20"
                     aria-label="Compartilhar no Twitter"
                >
                    <Twitter size={20} />
                    <span className="font-medium hidden sm:inline">Twitter</span>
                </button>
                <button 
                    onClick={() => handleShare('whatsapp')} 
                    className="flex-1 bg-[#25D366]/10 hover:bg-[#25D366]/20 text-[#25D366] py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors border border-[#25D366]/20"
                     aria-label="Compartilhar no WhatsApp"
                >
                    <MessageCircle size={20} />
                    <span className="font-medium hidden sm:inline">WhatsApp</span>
                </button>
            </div>
        </div>

        {/* Comments & Discussion Section */}
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
             <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-white">
                <MessageSquare size={20} className="text-brand-blue" />
                Comentários & Discussão
            </h3>
            
            {/* Comments List */}
            <div className="space-y-4 mb-6">
                {comments.length > 0 ? (
                    comments.map(comment => (
                        <div key={comment.id} className="flex gap-3 border-b border-gray-700/50 pb-4 last:border-0 last:pb-0">
                            <img src={comment.authorAvatar} alt={comment.authorName} className="w-10 h-10 rounded-full object-cover flex-shrink-0" />
                            <div className="flex-1">
                                <div className="flex justify-between items-start">
                                    <span className="font-bold text-white text-sm">{comment.authorName}</span>
                                    <span className="text-xs text-gray-500">{comment.timestamp}</span>
                                </div>
                                <p className="text-gray-300 text-sm mt-1">{comment.content}</p>
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="text-center text-gray-500 text-sm py-4">Seja o primeiro a perguntar ou comentar sobre este veículo.</p>
                )}
            </div>

            {/* Add Comment Input */}
            <div className="relative">
                 <div className="flex gap-2">
                    <input 
                        type="text" 
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="Faça uma pergunta ou comentário..."
                        className="flex-1 bg-gray-900 border border-gray-600 rounded-full px-4 py-3 text-white placeholder-gray-500 focus:ring-1 focus:ring-brand-blue focus:border-brand-blue focus:outline-none transition-all text-sm"
                        onKeyDown={(e) => e.key === 'Enter' && handleAddComment()}
                    />
                    <button 
                        onClick={handleAddComment}
                        disabled={!newComment.trim()}
                        className="bg-brand-blue hover:bg-brand-blue/90 text-white p-3 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <Send size={18} />
                    </button>
                 </div>
            </div>
        </div>
      </main>

      {!isOwner && (
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-gray-900/80 backdrop-blur-sm border-t border-gray-700">
            <button className="w-full bg-brand-blue text-white font-bold py-3 px-4 rounded-lg hover:bg-brand-blue/90 transition-colors duration-200 flex items-center justify-center space-x-2">
                <Tag size={20} />
                <span>Tenho Interesse</span>
            </button>
        </div>
      )}
    </div>
  );
};

export default CarDetail;
