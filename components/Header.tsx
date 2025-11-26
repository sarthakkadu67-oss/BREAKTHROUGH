
import React, { useState, useEffect, useRef } from 'react';
import { Search, MapPin, ChevronDown, BrainCircuit } from 'lucide-react';
import { Restaurant } from '../types';

interface Props {
  onSearchClick: () => void;
  query: string;
  onQueryChange: (q: string) => void;
  restaurants: Restaurant[];
  isSearching?: boolean;
  location: string;
  onLocationClick: () => void;
  cartCount: number;
  onCartClick: () => void;
  onProfileClick: () => void;
}

export const Header: React.FC<Props> = ({ 
  onSearchClick, query, onQueryChange, restaurants, isSearching = false, location, onLocationClick, cartCount, onCartClick, onProfileClick
}) => {
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (query.length > 1 && !isSearching) {
      const lowerQ = query.toLowerCase();
      const matches = new Set<string>();
      restaurants.forEach(r => {
        if (r.name.toLowerCase().includes(lowerQ)) matches.add(r.name);
        r.cuisine.forEach(c => { if (c.toLowerCase().includes(lowerQ)) matches.add(c); });
      });
      setSuggestions(Array.from(matches).slice(0, 5));
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [query, restaurants, isSearching]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !isSearching) { setShowSuggestions(false); onSearchClick(); }
  };

  return (
    <header className="sticky top-0 z-50 bg-black/80 backdrop-blur-md shadow-sm border-b border-gray-800 transition-all duration-300">
      <div className="w-full max-w-[1920px] mx-auto px-4 md:px-8 lg:px-12 h-20 flex items-center justify-between gap-4">
        
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-1 cursor-pointer" onClick={() => window.location.reload()}>
            <h1 className="text-3xl font-extrabold italic tracking-tighter text-white">BREAKTHROUGH</h1>
          </div>
          
          <button 
            onClick={onLocationClick}
            className="hidden md:flex items-center gap-2 text-sm text-gray-400 hover:text-white cursor-pointer transition-colors group"
          >
            <MapPin size={18} className="group-hover:animate-bounce text-indigo-500" />
            <span className="font-semibold text-gray-200 underline decoration-dotted truncate max-w-[150px]">{location}</span>
            <ChevronDown size={14} />
          </button>
        </div>

        <div className="flex-1 max-w-2xl hidden sm:block relative" ref={searchRef}>
          <div className={`relative group transition-all duration-300`}>
            {isSearching && <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-2xl blur-md opacity-50 animate-pulse"></div>}
            
            <div className={`relative flex items-center overflow-hidden rounded-full transition-all duration-300
              ${isSearching ? 'bg-gray-900 ring-1 ring-indigo-500' : 'bg-gray-900 border border-gray-800 focus-within:ring-2 focus-within:ring-indigo-500/50'}`}
            >
                <div className="pl-5 text-gray-400">
                    {isSearching ? <BrainCircuit className="text-indigo-400 animate-pulse" size={20} /> : <Search className="text-gray-500" size={20} />}
                </div>

                <input
                  type="text"
                  value={query}
                  onChange={(e) => onQueryChange(e.target.value)}
                  onKeyDown={handleKeyDown}
                  disabled={isSearching}
                  onFocus={() => query.length > 1 && setShowSuggestions(true)}
                  placeholder={isSearching ? "AI Chef is analyzing tastes..." : "Search for 'Asian food' or 'Best Pizza'..."}
                  className={`w-full h-12 px-3 border-none bg-transparent focus:ring-0 text-white placeholder-gray-500 transition-all outline-none ${isSearching ? 'cursor-wait text-indigo-300 font-medium' : ''}`}
                />
            </div>
          </div>

          {showSuggestions && suggestions.length > 0 && (
            <div className="absolute top-14 left-0 w-full bg-gray-900 rounded-2xl shadow-2xl border border-gray-800 overflow-hidden z-50">
              {suggestions.map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => { onQueryChange(suggestion); setShowSuggestions(false); }}
                  className="w-full text-left px-5 py-3 hover:bg-gray-800 flex items-center gap-3 text-gray-300 transition-colors"
                >
                  <Search size={16} className="text-gray-600" />
                  {suggestion}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="flex items-center gap-6">
           <button onClick={onCartClick} className="relative group">
              <div className="p-2.5 rounded-full bg-gray-900 text-gray-300 group-hover:bg-gray-800 transition-colors border border-gray-800">
                 <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
              </div>
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full shadow-lg animate-scale-in">
                  {cartCount}
                </span>
              )}
           </button>
           
           <button 
            onClick={onProfileClick}
            className="w-9 h-9 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm shadow-lg ring-2 ring-black hover:scale-105 transition-transform"
           >
              SA
           </button>
        </div>
      </div>
    </header>
  );
};
