
import React, { useState, useRef, useEffect } from 'react';
import { Filter, ChevronDown, X, Check, ArrowUpDown, Zap } from 'lucide-react';
import { FilterState, SortOption } from '../types';

interface Props {
  filters: FilterState;
  toggleFilter: (key: keyof FilterState) => void;
  sortOption: SortOption;
  setSortOption: (opt: SortOption) => void;
  availableCuisines: string[];
  selectedCuisines: string[];
  toggleCuisine: (c: string) => void;
  resultCount: number;
}

export const Filters: React.FC<Props> = ({ 
  filters, 
  toggleFilter, 
  sortOption, 
  setSortOption, 
  availableCuisines,
  selectedCuisines,
  toggleCuisine,
  resultCount 
}) => {
  const [openDropdown, setOpenDropdown] = useState<'sort' | 'cuisine' | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpenDropdown(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const Chip = ({ 
    label, 
    active, 
    onClick,
    icon
  }: { label: string; active: boolean; onClick: () => void; icon?: React.ReactNode }) => (
    <button
      onClick={onClick}
      className={`
        px-4 py-2 rounded-full border text-sm font-medium transition-all flex items-center gap-2 whitespace-nowrap
        ${active 
          ? 'bg-white text-black border-white shadow-[0_0_10px_rgba(255,255,255,0.3)]' 
          : 'bg-black border-gray-700 text-gray-300 hover:border-gray-500 hover:text-white'
        }
      `}
    >
      {icon}
      {label}
      {active && <X size={14} />}
    </button>
  );

  return (
    <div className="sticky top-20 z-40 bg-black/80 backdrop-blur-md border-b border-gray-800 shadow-sm" ref={dropdownRef}>
      <div className="max-w-[1920px] mx-auto px-4 md:px-8 lg:px-12 py-3 flex flex-col gap-3">
        
        <div className="flex items-center justify-between">
           <div className="flex items-center gap-3 overflow-x-auto pb-2 hide-scrollbar w-full">
            
            {/* Sort Dropdown Trigger */}
            <div className="relative flex-shrink-0">
              <button 
                onClick={() => setOpenDropdown(openDropdown === 'sort' ? null : 'sort')}
                className="px-4 py-2 rounded-full border border-gray-700 text-gray-300 flex items-center gap-2 text-sm hover:border-gray-500 hover:text-white bg-black font-medium transition-colors"
              >
                Sort by <ArrowUpDown size={14} />
              </button>
              
              {openDropdown === 'sort' && (
                <div className="absolute top-12 left-0 w-56 bg-gray-900 rounded-xl shadow-2xl border border-gray-700 overflow-hidden py-2 z-50 animate-in fade-in zoom-in-95 duration-200">
                  <button onClick={() => { setSortOption('relevance'); setOpenDropdown(null); }} className={`w-full text-left px-4 py-3 text-sm font-medium hover:bg-gray-800 flex justify-between ${sortOption === 'relevance' ? 'text-indigo-400' : 'text-gray-300'}`}>
                    Relevance {sortOption === 'relevance' && <Check size={16} />}
                  </button>
                  <button onClick={() => { setSortOption('fastestDelivery'); setOpenDropdown(null); }} className={`w-full text-left px-4 py-3 text-sm font-medium hover:bg-gray-800 flex justify-between ${sortOption === 'fastestDelivery' ? 'text-indigo-400' : 'text-gray-300'}`}>
                    Fastest Delivery {sortOption === 'fastestDelivery' && <Check size={16} />}
                  </button>
                  <button onClick={() => { setSortOption('rating'); setOpenDropdown(null); }} className={`w-full text-left px-4 py-3 text-sm font-medium hover:bg-gray-800 flex justify-between ${sortOption === 'rating' ? 'text-indigo-400' : 'text-gray-300'}`}>
                    Rating 4.0+ {sortOption === 'rating' && <Check size={16} />}
                  </button>
                   <button onClick={() => { setSortOption('costLowHigh'); setOpenDropdown(null); }} className={`w-full text-left px-4 py-3 text-sm font-medium hover:bg-gray-800 flex justify-between ${sortOption === 'costLowHigh' ? 'text-indigo-400' : 'text-gray-300'}`}>
                    Cost: Low to High {sortOption === 'costLowHigh' && <Check size={16} />}
                  </button>
                </div>
              )}
            </div>

            <div className="w-px h-6 bg-gray-800 mx-1 flex-shrink-0"></div>

            <Chip 
              label="Pure Veg" 
              active={filters.pureVeg} 
              onClick={() => toggleFilter('pureVeg')} 
            />
            <Chip 
              label="Fast Delivery" 
              icon={<Zap size={14} className={filters.fastDelivery ? "fill-black" : "fill-current"} />}
              active={filters.fastDelivery} 
              onClick={() => toggleFilter('fastDelivery')} 
            />
            <Chip 
              label="Rating 4.0+" 
              active={filters.rating4Plus} 
              onClick={() => toggleFilter('rating4Plus')} 
            />
            
            {/* Cuisine Dropdown Trigger */}
            <div className="relative flex-shrink-0">
               <button 
                onClick={() => setOpenDropdown(openDropdown === 'cuisine' ? null : 'cuisine')}
                className={`px-4 py-2 rounded-full border text-sm font-medium transition-all flex items-center gap-2 ${selectedCuisines.length > 0 ? 'bg-indigo-900 border-indigo-500 text-indigo-100' : 'bg-black border-gray-700 text-gray-300'}`}
              >
                Cuisines {selectedCuisines.length > 0 && `(${selectedCuisines.length})`} <ChevronDown size={14} />
              </button>

              {openDropdown === 'cuisine' && (
                <div className="absolute top-12 left-0 w-64 max-h-80 overflow-y-auto bg-gray-900 rounded-xl shadow-2xl border border-gray-700 py-2 z-50 animate-in fade-in zoom-in-95 duration-200 custom-scrollbar">
                  {availableCuisines.map(cuisine => (
                    <button
                      key={cuisine}
                      onClick={() => toggleCuisine(cuisine)}
                      className="w-full text-left px-4 py-3 text-sm font-medium hover:bg-gray-800 flex justify-between items-center text-gray-300"
                    >
                      {cuisine}
                      <div className={`w-4 h-4 rounded border flex items-center justify-center ${selectedCuisines.includes(cuisine) ? 'bg-indigo-600 border-indigo-600 text-white' : 'border-gray-600'}`}>
                        {selectedCuisines.includes(cuisine) && <Check size={10} />}
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="hidden md:block text-xs font-bold text-gray-500 uppercase tracking-widest whitespace-nowrap ml-4">
            {resultCount} Results
          </div>
        </div>
      </div>
    </div>
  );
};
