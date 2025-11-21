import React, { useState } from 'react';
import { ImageOff, Car, User } from 'lucide-react';

interface ImageWithFallbackProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  fallbackType?: 'car' | 'user' | 'general';
}

const ImageWithFallback: React.FC<ImageWithFallbackProps> = ({ 
  src, 
  alt, 
  className, 
  fallbackType = 'general',
  ...props 
}) => {
  const [status, setStatus] = useState<'loading' | 'error' | 'success'>('loading');

  const handleLoad = () => {
    setStatus('success');
  };

  const handleError = () => {
    setStatus('error');
  };

  // Determine icon based on type
  const FallbackIcon = fallbackType === 'user' ? User : fallbackType === 'car' ? Car : ImageOff;

  return (
    <div className={`relative overflow-hidden bg-gray-800 ${className}`}>
      {/* Loading Skeleton */}
      {status === 'loading' && (
        <div className="absolute inset-0 bg-gray-700 animate-pulse flex items-center justify-center z-10">
           <div className="w-8 h-8 border-2 border-gray-600 border-t-gray-400 rounded-full animate-spin"></div>
        </div>
      )}

      {/* Actual Image */}
      <img
        src={src}
        alt={alt}
        className={`w-full h-full object-cover transition-opacity duration-500 ${
          status === 'success' ? 'opacity-100' : 'opacity-0 absolute inset-0'
        }`}
        onLoad={handleLoad}
        onError={handleError}
        {...props}
      />

      {/* Error/Fallback State */}
      {status === 'error' && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-800 text-gray-600 border border-gray-700 p-4 text-center">
          <FallbackIcon size={32} className="mb-2 opacity-50" />
          <span className="text-xs font-medium">Imagem indisponível</span>
        </div>
      )}
    </div>
  );
};

export default ImageWithFallback;