
import React from 'react';
import { CATEGORIES } from '../constants';

export const CategoryCarousel: React.FC = () => {
  return (
    <div className="w-full">
      <div className="flex gap-8 overflow-x-auto pb-4 hide-scrollbar scroll-smooth">
        {CATEGORIES.map((cat) => (
          <div key={cat.id} className="flex-shrink-0 flex flex-col items-center gap-3 group cursor-pointer">
            <div className="w-28 h-28 md:w-36 md:h-36 rounded-full overflow-hidden border-4 border-gray-800 group-hover:border-indigo-500 shadow-lg group-hover:shadow-[0_0_20px_rgba(99,102,241,0.5)] transition-all duration-300 relative">
              <img 
                src={cat.image} 
                alt={cat.name} 
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 opacity-80 group-hover:opacity-100"
              />
            </div>
            <span className="text-gray-400 font-bold text-sm md:text-base group-hover:text-white transition-colors tracking-tight">{cat.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
