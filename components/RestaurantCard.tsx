
import React from 'react';
import { Star, Clock, Heart, Activity } from 'lucide-react';
import { Restaurant } from '../types';

interface Props {
  data: Restaurant;
  onClick: (restaurant: Restaurant) => void;
}

export const RestaurantCard: React.FC<Props> = ({ data, onClick }) => {
  const getHealthColor = (score: number) => {
    if (score >= 90) return 'text-green-400 bg-green-900/30 border border-green-800/50';
    if (score >= 75) return 'text-yellow-400 bg-yellow-900/30 border border-yellow-800/50';
    return 'text-orange-400 bg-orange-900/30 border border-orange-800/50';
  };

  return (
    <div 
      onClick={() => onClick(data)}
      className="group bg-gray-900 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer overflow-hidden border border-gray-800 hover:border-indigo-500/30 flex flex-col h-full"
    >
      {/* Image Section */}
      <div className="relative h-64 overflow-hidden">
        <img 
          src={data.imageUrl} 
          alt={data.name} 
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-90"
        />
        
        {/* Overlay Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent opacity-90"></div>
        
        {/* Tags Row */}
        <div className="absolute top-3 left-3 flex flex-col gap-2 items-start">
          {data.isPromoted && (
            <div className="bg-black/80 backdrop-blur-md text-[10px] text-white px-2.5 py-1 rounded-md uppercase tracking-wider font-bold shadow-md border border-gray-700">
              Ad
            </div>
          )}
          {data.isVeg && (
            <div className="bg-green-600/90 backdrop-blur-md text-[10px] text-white px-2.5 py-1 rounded-md uppercase tracking-wider font-bold shadow-md flex items-center gap-1">
              Pure Veg
            </div>
          )}
        </div>

        {/* Discount Badge */}
        {data.discount && (
          <div className="absolute bottom-4 left-4">
            <div className="text-white font-extrabold text-xl leading-none drop-shadow-md">
              {data.discount.split(' ')[0]}
            </div>
            <div className="text-gray-300 text-xs font-medium uppercase tracking-wide">
              {data.discount.split(' ').slice(1).join(' ')}
            </div>
          </div>
        )}

        {/* Like Button */}
        <button 
          onClick={(e) => { e.stopPropagation(); /* Add like logic */ }}
          className="absolute top-3 right-3 p-2.5 rounded-full bg-black/40 hover:bg-black/60 backdrop-blur-md text-white transition-all active:scale-95 border border-white/10"
        >
          <Heart size={18} />
        </button>

        {/* Delivery Time Pill */}
        <div className="absolute bottom-4 right-4 bg-gray-800/90 backdrop-blur-sm text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-lg text-white border border-gray-700">
          <Clock size={14} className="text-indigo-400" />
          {data.deliveryTime}
        </div>
      </div>

      {/* Info Section */}
      <div className="p-5 flex flex-col flex-1">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-xl font-bold text-white truncate pr-2 group-hover:text-indigo-400 transition-colors flex-1 font-display tracking-wide">{data.name}</h3>
          <div className={`flex items-center gap-1 text-white text-xs font-bold px-2 py-1 rounded-lg shadow-sm ${data.rating >= 4.0 ? 'bg-green-700' : 'bg-orange-600'}`}>
            <span>{data.rating}</span>
            <Star size={10} fill="currentColor" />
          </div>
        </div>

        <div className="flex justify-between items-center text-sm mb-4">
          <p className="truncate w-2/3 text-gray-400 font-medium">{data.cuisine.join(', ')}</p>
          <p className="text-gray-200 font-bold">${data.priceForTwo}</p>
        </div>

        {/* Health Score & Divider */}
        <div className="mt-auto pt-4 border-t border-gray-800 flex items-center justify-between">
          <div className={`flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-bold ${getHealthColor(data.healthScore)}`}>
            <Activity size={12} />
            <span>Health Score: {data.healthScore}</span>
          </div>
          <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">{data.location}</span>
        </div>
      </div>
    </div>
  );
};
