import React from 'react';
import { Sparkles } from 'lucide-react';

interface Props {
  onClick: () => void;
}

export const AIFloatingButton: React.FC<Props> = ({ onClick }) => {
  return (
    <button 
      onClick={onClick}
      className="fixed bottom-8 right-8 bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-4 rounded-full shadow-2xl hover:scale-110 transition-transform z-50 group flex items-center gap-2 pr-6 animate-bounce"
      aria-label="Ask AI Concierge"
    >
      <Sparkles size={24} className="animate-pulse" />
      <span className="font-bold">Ask AI</span>
    </button>
  );
};
