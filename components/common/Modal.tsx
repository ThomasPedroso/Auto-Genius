
import React, { useEffect } from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  // Prevent background scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden'; // Additional lock for better mobile support
    } else {
      document.body.style.overflow = 'unset';
      document.documentElement.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
      document.documentElement.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[100] p-4 animate-[fadeIn_0.2s_ease-out]">
      <div 
        className="bg-gray-800 rounded-xl w-full max-w-lg mx-auto shadow-2xl border border-gray-700 flex flex-col max-h-[90vh] relative animate-[zoomIn_0.2s_ease-out]"
        role="dialog"
        aria-modal="true"
      >
        {/* Header - Fixed at the top of the modal */}
        <div className="flex justify-between items-center p-5 border-b border-gray-700 shrink-0 bg-gray-800 rounded-t-xl z-10">
          <h2 className="text-xl font-bold text-white">{title}</h2>
          <button 
            onClick={onClose} 
            className="text-gray-400 hover:text-white hover:bg-gray-700/50 p-2 rounded-full transition-colors"
            aria-label="Fechar"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content - Scrollable with overscroll containment */}
        <div className="p-6 overflow-y-auto overscroll-contain">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;
