
import React, { useState, useMemo, useEffect } from 'react';
import { Header } from './components/Header';
import { CategoryCarousel } from './components/CategoryCarousel';
import { RestaurantCard } from './components/RestaurantCard';
import { SkeletonCard } from './components/SkeletonCard';
import { Filters } from './components/Filters';
import { AIFloatingButton } from './components/AIFloatingButton';
import { RestaurantModal } from './components/RestaurantModal';
import { LandingPage } from './components/LandingPage';
import { CheckoutModal } from './components/CheckoutModal';
import { UserProfileModal } from './components/UserProfileModal';
import { Restaurant, FilterState, SortOption, CartItem } from './types';
import { searchRestaurantsWithGemini } from './services/geminiService';
import { api } from './services/mockBackend';
import { Info, WifiOff, ArrowDownCircle, Flame, ChevronRight, Bike } from 'lucide-react';

const HeroBanner = () => {
  return (
    <div className="relative w-full h-[300px] md:h-[400px] rounded-3xl overflow-hidden shadow-2xl mb-12 group border border-gray-800">
      <img 
        src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1600&q=80" 
        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-80"
        alt="Promo"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-black via-black/60 to-transparent flex flex-col justify-center px-8 md:px-16">
        <span className="text-yellow-400 font-bold tracking-widest uppercase mb-2 animate-fade-in">Exclusive Offer</span>
        <h2 className="text-4xl md:text-6xl font-display text-white mb-4 leading-tight">
          50% OFF <br/> <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-pink-400">Gourmet Burgers</span>
        </h2>
        <p className="text-gray-300 text-lg mb-8 max-w-md">Experience the crunchiest, juiciest bites in town. Limited time offer for new users.</p>
        <button className="bg-white text-black px-8 py-4 rounded-full font-bold w-fit hover:bg-gray-200 transition-colors shadow-lg flex items-center gap-2">
          Claim Offer <ChevronRight size={18} />
        </button>
      </div>
    </div>
  );
};

const LiveOrderWidget = () => {
  return (
    <div className="fixed bottom-6 left-6 z-40 bg-gray-900 text-white p-4 rounded-2xl shadow-2xl border border-gray-800 w-80 animate-slide-up hidden md:block">
      <div className="flex justify-between items-center mb-3">
        <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Live Activity</h4>
        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
      </div>
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 bg-black rounded-xl flex items-center justify-center border border-gray-800">
          <Bike size={24} className="text-blue-400" />
        </div>
        <div className="flex-1">
          <p className="font-bold text-sm text-white">Order #2910</p>
          <p className="text-xs text-gray-400">Arriving in 12 mins</p>
        </div>
        
        <div className="relative w-10 h-10 flex items-center justify-center">
           <svg className="w-full h-full transform -rotate-90">
             <circle cx="20" cy="20" r="16" stroke="currentColor" strokeWidth="3" fill="transparent" className="text-gray-800" />
             <circle cx="20" cy="20" r="16" stroke="currentColor" strokeWidth="3" fill="transparent" className="text-blue-500" strokeDasharray="100" strokeDashoffset="30" strokeLinecap="round" />
           </svg>
           <span className="absolute text-[10px] font-bold text-white">70%</span>
        </div>
      </div>
      <div className="mt-3 w-full bg-gray-800 h-1 rounded-full overflow-hidden">
        <div className="bg-blue-500 h-full w-[70%] animate-pulse"></div>
      </div>
    </div>
  );
};

const SectionHeader = ({ title, icon: Icon }: { title: string, icon?: React.ElementType }) => (
  <div className="flex items-center justify-between mb-6 px-1">
    <div className="flex items-center gap-2">
      {Icon && <Icon className="text-indigo-400" size={24} />}
      <h2 className="text-2xl font-bold text-white tracking-tight">{title}</h2>
    </div>
    <button className="w-10 h-10 rounded-full bg-gray-900 flex items-center justify-center hover:bg-gray-800 transition-colors border border-gray-800 text-white">
      <ChevronRight size={20} />
    </button>
  </div>
);

const App: React.FC = () => {
  const [view, setView] = useState<'landing' | 'app'>('landing');
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [query, setQuery] = useState('');
  const [filters, setFilters] = useState<FilterState>({ rating4Plus: false, pureVeg: false, fastDelivery: false });
  const [sortOption, setSortOption] = useState<SortOption>('relevance');
  const [selectedCuisines, setSelectedCuisines] = useState<string[]>([]);
  
  const [location, setLocation] = useState('New York, USA');
  const [cart, setCart] = useState<{ restaurantId: string | null; items: Record<string, number> }>({ restaurantId: null, items: {} });
  
  const [aiLoading, setAiLoading] = useState(false);
  const [aiMessage, setAiMessage] = useState<string | null>(null);
  const [filteredIds, setFilteredIds] = useState<string[] | null>(null);
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null);
  
  // New States for Checkout and Profile
  const [showCheckout, setShowCheckout] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [savedAddresses, setSavedAddresses] = useState<string[]>([]);

  useEffect(() => { 
    loadRestaurants(1);
    api.getUserProfile().then(user => setSavedAddresses(user.addresses));
  }, []);

  const loadRestaurants = async (pageNum: number) => {
    try {
      if (pageNum === 1) setIsLoading(true); else setIsLoadingMore(true);
      const response = await api.getRestaurants(pageNum, 12);
      if (pageNum === 1) setRestaurants(response.data); else setRestaurants(prev => [...prev, ...response.data]);
      setHasMore(restaurants.length + response.data.length < response.total);
      setError(null);
    } catch (err) { setError("Failed to connect to the server."); } finally { setIsLoading(false); setIsLoadingMore(false); }
  };

  const handleLoadMore = () => { const nextPage = page + 1; setPage(nextPage); loadRestaurants(nextPage); };

  const updateCart = (restaurantId: string, itemId: string, delta: number) => {
    setCart(prev => {
      if (prev.restaurantId && prev.restaurantId !== restaurantId && Object.keys(prev.items).length > 0) {
        if (!window.confirm("Start a new basket? This will clear your cart from the previous restaurant.")) return prev;
        return { restaurantId, items: { [itemId]: Math.max(0, delta) } };
      }
      const currentQty = prev.items[itemId] || 0;
      const newQty = Math.max(0, currentQty + delta);
      const newItems = { ...prev.items };
      if (newQty === 0) delete newItems[itemId]; else newItems[itemId] = newQty;
      if (Object.keys(newItems).length === 0) return { restaurantId: null, items: {} };
      return { restaurantId, items: newItems };
    });
  };

  const handleLocationClick = () => {
    const newLoc = prompt("Enter your delivery location:", location);
    if (newLoc && newLoc.trim()) setLocation(newLoc.trim());
  };

  const handleCartClick = () => {
    const totalItems = Object.values(cart.items).reduce((a, b) => a + b, 0);
    if (totalItems === 0) {
      alert("Your cart is empty. Start adding some delicious food!");
    } else {
      setShowCheckout(true);
      if (selectedRestaurant) setSelectedRestaurant(null); // Close restaurant modal if open
    }
  };

  const handleSearch = async () => {
    if (!query.trim()) { setFilteredIds(null); setAiMessage(null); return; }
    setAiLoading(true); setAiMessage("Asking the chef...");
    const result = await searchRestaurantsWithGemini(query, restaurants);
    setAiLoading(false);
    if (result) { setFilteredIds(result.restaurantIds); setAiMessage(result.message); } 
    else {
      const lowerQ = query.toLowerCase();
      const matches = restaurants.filter(r => r.name.toLowerCase().includes(lowerQ) || r.cuisine.some(c => c.toLowerCase().includes(lowerQ)) || r.menu.some(m => m.name.toLowerCase().includes(lowerQ))).map(r => r.id);
      setFilteredIds(matches); setAiMessage(matches.length > 0 ? "Showing keyword matches." : "No exact matches found.");
    }
  };

  const toggleFilter = (key: keyof FilterState) => setFilters(prev => ({ ...prev, [key]: !prev[key] }));
  const toggleCuisine = (cuisine: string) => setSelectedCuisines(prev => prev.includes(cuisine) ? prev.filter(c => c !== cuisine) : [...prev, cuisine]);
  const handleRestaurantUpdate = (updatedRestaurant: Restaurant) => { setRestaurants(prev => prev.map(r => r.id === updatedRestaurant.id ? updatedRestaurant : r)); setSelectedRestaurant(updatedRestaurant); };

  const availableCuisines = useMemo(() => {
    const allCuisines = new Set<string>();
    restaurants.forEach(r => r.cuisine.forEach(c => allCuisines.add(c)));
    return Array.from(allCuisines).sort();
  }, [restaurants]);

  const displayedRestaurants = useMemo(() => {
    let list = restaurants;
    if (filteredIds !== null) list = filteredIds.map(id => restaurants.find(r => r.id === id)).filter((r): r is Restaurant => !!r);
    if (filters.rating4Plus) list = list.filter(r => r.rating >= 4.0);
    if (filters.pureVeg) list = list.filter(r => r.isVeg);
    if (filters.fastDelivery) list = list.filter(r => (parseInt(r.deliveryTime) || 100) < 35);
    if (selectedCuisines.length > 0) list = list.filter(r => r.cuisine.some(c => selectedCuisines.includes(c)));
    list = [...list].sort((a, b) => {
      switch (sortOption) {
        case 'rating': return b.rating - a.rating;
        case 'fastestDelivery': return parseInt(a.deliveryTime) - parseInt(b.deliveryTime);
        case 'costLowHigh': return a.priceForTwo - b.priceForTwo;
        default: return 0;
      }
    });
    return list;
  }, [filteredIds, filters, restaurants, sortOption, selectedCuisines]);

  const curatedList = useMemo(() => restaurants.filter(r => r.rating >= 4.5).slice(0, 5), [restaurants]);

  // Derived Cart Data for Checkout
  const cartRestaurant = restaurants.find(r => r.id === cart.restaurantId);
  const cartItemsData: CartItem[] = useMemo(() => {
    if (!cartRestaurant) return [];
    return Object.entries(cart.items).map(([itemId, qty]) => {
      const menu = cartRestaurant.menu.find(m => m.id === itemId);
      if (!menu) return null;
      return { id: itemId, name: menu.name, price: menu.price, quantity: qty, isVeg: menu.isVeg };
    }).filter((item): item is CartItem => !!item);
  }, [cart, cartRestaurant]);

  const cartTotalAmount = cartItemsData.reduce((acc, item) => acc + (item.price * item.quantity), 0);

  const onPlaceOrder = async (address: string, paymentMethod: string) => {
    if (!cart.restaurantId) return;
    await api.placeOrder(cart.restaurantId, cartItemsData, cartTotalAmount, address);
    setCart({ restaurantId: null, items: {} }); // Clear Cart
  };


  if (view === 'landing') return <LandingPage onEnterApp={() => setView('app')} />;
  if (error) return (<div className="min-h-screen flex flex-col items-center justify-center bg-black text-center p-4"><WifiOff size={64} className="text-gray-500 mb-4" /><h2 className="text-2xl font-bold text-white mb-2">Connection Failed</h2><button onClick={() => window.location.reload()} className="px-6 py-3 bg-indigo-600 text-white rounded-lg font-bold">Retry</button></div>);

  return (
    <div className="min-h-screen bg-black pb-20 font-sans text-white">
      <Header 
        query={query} 
        onQueryChange={setQuery} 
        onSearchClick={handleSearch} 
        restaurants={restaurants}
        isSearching={aiLoading}
        location={location}
        onLocationClick={handleLocationClick}
        cartCount={Object.values(cart.items).reduce((a, b) => a + b, 0)}
        onCartClick={handleCartClick}
        onProfileClick={() => setShowProfile(true)}
      />
      
      <Filters 
        filters={filters} 
        toggleFilter={toggleFilter} 
        sortOption={sortOption}
        setSortOption={setSortOption}
        availableCuisines={availableCuisines}
        selectedCuisines={selectedCuisines}
        toggleCuisine={toggleCuisine}
        resultCount={displayedRestaurants.length}
      />

      <main className="w-full max-w-[1920px] mx-auto px-4 md:px-8 lg:px-12 py-8">
        {!query && !filteredIds && <HeroBanner />}

        {!query && !filteredIds && curatedList.length > 0 && (
          <section className="mb-12">
            <SectionHeader title="Curated for You" icon={Flame} />
            <div className="flex gap-6 overflow-x-auto pb-6 hide-scrollbar snap-x snap-mandatory">
              {curatedList.map(r => (
                 <div key={r.id} className="min-w-[300px] md:min-w-[350px] snap-start">
                   <RestaurantCard data={r} onClick={(r) => setSelectedRestaurant(r)} />
                 </div>
              ))}
            </div>
          </section>
        )}

        {!query && !filteredIds && (
          <section className="mb-12">
             <SectionHeader title="What's on your mind?" />
             <CategoryCarousel />
          </section>
        )}

        {!aiLoading && aiMessage && (
          <div className="mb-8 p-6 bg-indigo-900/20 border border-indigo-800 rounded-2xl flex items-start gap-4 text-indigo-100 animate-fade-in shadow-sm max-w-3xl mx-auto">
            <div className="p-2 bg-indigo-900 rounded-full shadow-sm">
               <Info className="text-indigo-400" size={24} />
            </div>
            <div className="flex-1">
               <h4 className="font-bold text-lg mb-1">Chef's Suggestion</h4>
               <p className="font-medium leading-relaxed opacity-90">{aiMessage}</p>
            </div>
            <button onClick={() => { setAiMessage(null); setFilteredIds(null); setQuery(''); }} className="px-4 py-2 bg-indigo-900 rounded-lg text-sm font-bold text-indigo-300 hover:bg-indigo-800 border border-indigo-700 transition-colors">Clear</button>
          </div>
        )}

        <section>
          <div className="flex items-center gap-2 mb-6 px-1">
             <h2 className="text-2xl font-bold text-white tracking-tight">
              {filteredIds ? 'Search Results' : (sortOption !== 'relevance' ? `Sorted Results` : 'All Restaurants')}
             </h2>
             <div className="h-px bg-gray-800 flex-1 ml-4"></div>
          </div>

          {(isLoading || aiLoading) ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-8">
              {[...Array(10)].map((_, i) => <SkeletonCard key={i} />)}
            </div>
          ) : (
            <>
              {displayedRestaurants.length > 0 ? (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-x-8 gap-y-12">
                    {displayedRestaurants.map(restaurant => (
                      <RestaurantCard key={restaurant.id} data={restaurant} onClick={(r) => setSelectedRestaurant(r)} />
                    ))}
                  </div>
                  {!filteredIds && hasMore && (
                    <div className="mt-20 text-center">
                      <button onClick={handleLoadMore} disabled={isLoadingMore} className="bg-white text-black px-10 py-4 rounded-full font-bold shadow-xl hover:shadow-2xl transition-all active:scale-95 disabled:opacity-50 flex items-center gap-3 mx-auto hover:bg-gray-200">
                        {isLoadingMore ? <>Loading more...</> : <>Show More Restaurants <ArrowDownCircle size={20} /></>}
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-32 bg-gray-900 rounded-3xl border border-dashed border-gray-800">
                  <h3 className="text-2xl font-bold text-gray-400">No restaurants found</h3>
                </div>
              )}
            </>
          )}
        </section>
      </main>
      
      {selectedRestaurant && (
        <RestaurantModal 
          restaurant={selectedRestaurant} 
          onClose={() => setSelectedRestaurant(null)}
          onUpdate={handleRestaurantUpdate}
          cartItems={cart.items}
          onUpdateCart={(itemId, delta) => updateCart(selectedRestaurant.id, itemId, delta)}
          onCheckout={() => { setSelectedRestaurant(null); setShowCheckout(true); }}
        />
      )}
      
      {showCheckout && cartRestaurant && (
        <CheckoutModal 
          restaurantName={cartRestaurant.name}
          items={cartItemsData}
          totalAmount={cartTotalAmount}
          onClose={() => setShowCheckout(false)}
          onPlaceOrder={onPlaceOrder}
          savedAddresses={savedAddresses}
        />
      )}

      {showProfile && (
        <UserProfileModal onClose={() => setShowProfile(false)} />
      )}

      <LiveOrderWidget />
      <div className="md:hidden">
         <AIFloatingButton onClick={() => { if(query) handleSearch(); else window.scrollTo({ top: 0, behavior: 'smooth' }); }} />
      </div>
    </div>
  );
};

export default App;
