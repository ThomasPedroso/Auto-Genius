import React from 'react';
import { Sparkles } from 'lucide-react';

interface LoaderProps {
  text?: string;
  className?: string;
}

const Loader: React.FC<LoaderProps> = ({ text, className = "" }) => {
  return (
    <div className={`flex flex-col items-center justify-center gap-5 ${className}`}>
      <div className="relative w-20 h-20 flex items-center justify-center">
        {/* Static background ring */}
        <div className="absolute inset-0 rounded-full border-4 border-gray-700/50"></div>
        
        {/* Outer Clockwise Ring */}
        <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-brand-blue animate-spin"></div>
        
        {/* Inner Counter-Clockwise Ring */}
        <div className="absolute inset-3 rounded-full border-4 border-transparent border-b-brand-teal animate-[spin_2s_linear_infinite_reverse]"></div>
        
        {/* Center Icon */}
        <div className="relative z-10 bg-gray-900 rounded-full p-2 shadow-lg shadow-brand-blue/20 animate-pulse">
          <Sparkles className="text-white" size={24} />
        </div>
      </div>
      
      {text && (
        <div className="text-center space-y-1">
            <p className="text-white font-bold text-lg tracking-wide drop-shadow-md">{text}</p>
            <div className="flex items-center justify-center gap-2">
              <span className="w-2 h-2 bg-brand-teal rounded-full animate-pulse"></span>
              <p className="text-xs text-brand-blue uppercase tracking-widest font-medium">Processando</p>
              <span className="w-2 h-2 bg-brand-teal rounded-full animate-pulse"></span>
            </div>
        </div>
      )}
    </div>
  );
};

export default Loader;