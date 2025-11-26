
import React, { useState, useMemo } from 'react';
import { X, Star, Clock, Send, Loader2, Search, Plus, Minus, ShoppingBag, Activity, MessageSquare, CheckCircle } from 'lucide-react';
import { Restaurant } from '../types';
import { api } from '../services/mockBackend';

interface Props {
  restaurant: Restaurant;
  onClose: () => void;
  onUpdate: (updatedRestaurant: Restaurant) => void;
  cartItems: Record<string, number>;
  onUpdateCart: (itemId: string, delta: number) => void;
  onCheckout: () => void;
}

export const RestaurantModal: React.FC<Props> = ({ restaurant, onClose, onUpdate, cartItems, onUpdateCart, onCheckout }) => {
  const [activeTab, setActiveTab] = useState<'menu' | 'reviews'>('menu');
  const [searchMenu, setSearchMenu] = useState('');
  
  // Review State
  const [userRating, setUserRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [userName, setUserName] = useState('');

  // Derived State
  const categories = useMemo(() => {
    const cats = Array.from(new Set(restaurant.menu.map(item => item.category)));
    
    // Explicitly handle priority categories
    const priorityCats = ['Recommended', 'Combos'];
    
    // Filter out priority cats from the general list to avoid duplicates
    const otherCats = cats.filter(c => !priorityCats.includes(c));
    
    // Reconstruct list: Recommended -> Combos -> Others
    const finalCats = ['Recommended'];
    if (cats.includes('Combos')) {
      finalCats.push('Combos');
    }
    
    return [...finalCats, ...otherCats];
  }, [restaurant.menu]);

  const filteredMenu = useMemo(() => {
    let items = restaurant.menu;
    if (searchMenu) {
      items = items.filter(i => i.name.toLowerCase().includes(searchMenu.toLowerCase()));
    }
    return items;
  }, [restaurant.menu, searchMenu]);

  const cartTotal = Object.entries(cartItems).reduce((total, [id, qty]) => {
    const item = restaurant.menu.find(i => i.id === id);
    return total + (item ? item.price * qty : 0);
  }, 0);

  const cartCount = Object.values(cartItems).reduce((a, b) => a + b, 0);

  // Review Logic
  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userName.trim()) {
      alert("Please enter your name");
      return;
    }
    setIsSubmitting(true);
    try {
      const updatedRestaurant = await api.addReview(restaurant.id, {
        userName: userName,
        rating: userRating,
        text: reviewText,
      });
      onUpdate(updatedRestaurant);
      setReviewText('');
      setUserRating(0);
      setUserName('');
    } catch (error) {
      console.error(error);
      alert("Failed to submit review.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center sm:p-6">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" onClick={onClose}></div>

      <div className="relative w-full max-w-5xl bg-white sm:rounded-2xl shadow-2xl overflow-hidden h-[95vh] sm:h-[90vh] flex flex-col animate-in slide-in-from-bottom-4 duration-300">
        
        {/* Header Image & Info */}
        <div className="relative h-64 shrink-0">
          <img src={restaurant.imageUrl} alt={restaurant.name} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent"></div>
          
          <button onClick={onClose} className="absolute top-4 right-4 p-2 bg-black/30 hover:bg-black/50 text-white rounded-full backdrop-blur-md transition-colors z-10">
            <X size={24} />
          </button>

          <div className="absolute bottom-0 left-0 w-full p-8 text-white">
            <div className="flex flex-col md:flex-row justify-between items-end gap-4">
              <div>
                <h1 className="text-4xl font-extrabold tracking-tight mb-2 drop-shadow-lg">{restaurant.name}</h1>
                <p className="text-gray-200 text-lg flex items-center gap-2 font-medium drop-shadow-md">
                  {restaurant.cuisine.join(', ')} • {restaurant.location}
                </p>
                <div className="flex items-center gap-4 mt-3">
                   <div className="flex items-center gap-1 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-sm font-bold">
                     <Clock size={16} /> {restaurant.deliveryTime}
                   </div>
                   <div className="flex items-center gap-1 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-sm font-bold">
                     <Activity size={16} className="text-green-400" /> Health Score: {restaurant.healthScore}
                   </div>
                </div>
              </div>
              
              <div className="flex flex-col items-end gap-2">
                <div className="bg-green-600 px-4 py-2 rounded-xl font-bold text-2xl inline-flex items-center gap-1 shadow-lg border-2 border-green-500">
                  {restaurant.rating} <Star size={20} fill="currentColor" />
                </div>
                <p className="text-sm font-bold text-gray-300">{restaurant.reviews.length} reviews</p>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="border-b border-gray-200 sticky top-0 bg-white z-20 px-6 flex items-center justify-between shadow-sm">
          <div className="flex gap-8">
            <button 
              onClick={() => setActiveTab('menu')}
              className={`py-4 text-sm font-bold tracking-wide border-b-2 transition-colors ${activeTab === 'menu' ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:text-gray-800'}`}
            >
              ORDER ONLINE
            </button>
            <button 
              onClick={() => setActiveTab('reviews')}
              className={`py-4 text-sm font-bold tracking-wide border-b-2 transition-colors ${activeTab === 'reviews' ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:text-gray-800'}`}
            >
              REVIEWS
            </button>
          </div>
          
          {activeTab === 'menu' && (
             <div className="relative hidden md:block w-72">
               <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
               <input 
                type="text" 
                placeholder="Search for dishes..." 
                value={searchMenu}
                onChange={(e) => setSearchMenu(e.target.value)}
                className="w-full bg-gray-100 rounded-full py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
               />
             </div>
          )}
        </div>

        {/* Main Content Area */}
        <div className="flex-1 overflow-hidden flex bg-gray-50">
          
          {/* MENU VIEW */}
          {activeTab === 'menu' && (
            <>
              {/* Sidebar Categories (Desktop) */}
              <div className="hidden md:block w-72 bg-white border-r border-gray-200 overflow-y-auto custom-scrollbar py-6">
                {categories.map(cat => (
                  <a 
                    key={cat}
                    href={`#cat-${cat}`} 
                    className="block px-8 py-3 text-sm font-semibold text-gray-600 hover:bg-gray-50 hover:text-primary border-l-4 border-transparent hover:border-primary transition-colors"
                  >
                    {cat}
                  </a>
                ))}
              </div>

              {/* Menu Items List */}
              <div className="flex-1 overflow-y-auto custom-scrollbar p-4 md:p-8 scroll-smooth">
                {categories.map(category => {
                  const items = filteredMenu.filter(i => (category === 'Recommended' ? i.isBestseller : i.category === category));
                  if (items.length === 0) return null;

                  return (
                    <div key={category} id={`cat-${category}`} className="mb-10">
                      <h3 className="text-xl font-extrabold text-gray-900 mb-6 flex items-center gap-3">
                        {category}
                        <span className="h-px flex-1 bg-gray-200"></span>
                      </h3>
                      
                      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                        {items.map(item => (
                          <div key={item.id} className="bg-white p-4 rounded-2xl border border-transparent hover:border-gray-200 shadow-sm hover:shadow-lg transition-all flex justify-between gap-4 group">
                            
                            {/* Item Text */}
                            <div className="flex-1 flex flex-col">
                              <div className="flex items-start gap-2 mb-1.5">
                                <img 
                                  src={item.isVeg ? "https://img.icons8.com/color/48/vegetarian-food-symbol.png" : "https://img.icons8.com/color/48/non-vegetarian-food-symbol.png"} 
                                  alt={item.isVeg ? "Veg" : "Non-Veg"}
                                  className="w-4 h-4 mt-1"
                                />
                                {item.isBestseller && (
                                  <span className="text-[10px] font-bold text-yellow-700 bg-yellow-100 px-2 py-0.5 rounded-full flex items-center gap-1">
                                    <Star size={8} fill="currentColor" /> Bestseller
                                  </span>
                                )}
                              </div>
                              <h4 className="font-bold text-lg text-gray-900 mb-1 group-hover:text-primary transition-colors leading-tight">{item.name}</h4>
                              <p className="font-bold text-gray-800 text-sm mb-2">${item.price}</p>
                              <p className="text-sm text-gray-500 line-clamp-2 mb-auto leading-relaxed">{item.description}</p>
                            </div>

                            {/* Item Image & Add Button */}
                            <div className="relative w-36 h-36 shrink-0">
                              <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover rounded-2xl shadow-sm" />
                              
                              <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-white rounded-xl shadow-lg border border-gray-100 p-1.5 w-28 flex items-center justify-between">
                                {cartItems[item.id] ? (
                                  <>
                                    <button onClick={() => onUpdateCart(item.id, -1)} className="w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"><Minus size={16} /></button>
                                    <span className="font-bold text-gray-900">{cartItems[item.id]}</span>
                                    <button onClick={() => onUpdateCart(item.id, 1)} className="w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"><Plus size={16} /></button>
                                  </>
                                ) : (
                                  <button onClick={() => onUpdateCart(item.id, 1)} className="w-full h-8 text-sm font-extrabold text-primary uppercase hover:bg-gray-50 rounded-lg transition-colors">ADD</button>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}

          {/* REVIEWS VIEW */}
          {activeTab === 'reviews' && (
            <div className="flex-1 overflow-y-auto custom-scrollbar p-6 bg-gray-50">
              <div className="max-w-2xl mx-auto space-y-8">
                {/* Review Form */}
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                  <div className="flex items-center gap-2 mb-4">
                    <h3 className="text-lg font-bold text-gray-900">Write a Review</h3>
                    <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded-full">Public</span>
                  </div>
                  
                  <form onSubmit={handleSubmitReview}>
                    {/* Star Rating */}
                    <div className="flex flex-col items-center mb-6 p-4 bg-gray-50 rounded-xl border border-dashed border-gray-300">
                      <p className="text-sm font-semibold text-gray-500 mb-2">How was your food?</p>
                      <div className="flex gap-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onMouseEnter={() => setHoverRating(star)}
                            onMouseLeave={() => setHoverRating(0)}
                            onClick={() => setUserRating(star)}
                            className="p-1 transition-transform hover:scale-110 focus:outline-none"
                          >
                            <Star 
                              size={32} 
                              className={`${star <= (hoverRating || userRating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'} transition-colors`}
                            />
                          </button>
                        ))}
                      </div>
                      <span className="text-xs font-bold text-indigo-600 mt-2 h-4">
                        {userRating > 0 ? ['Terrible', 'Bad', 'Okay', 'Good', 'Excellent'][userRating - 1] : ''}
                      </span>
                    </div>

                    <div className="space-y-4">
                      <div>
                         <label className="block text-xs font-bold text-gray-700 uppercase mb-1 ml-1">Your Name</label>
                         <input
                          type="text"
                          value={userName}
                          onChange={(e) => setUserName(e.target.value)}
                          placeholder="e.g. John Doe"
                          className="w-full p-3 bg-white rounded-lg border border-gray-200 focus:ring-2 focus:ring-black/5 outline-none text-sm transition-all"
                          required
                        />
                      </div>
                      
                      <div>
                        <label className="block text-xs font-bold text-gray-700 uppercase mb-1 ml-1">Review</label>
                        <textarea
                          value={reviewText}
                          onChange={(e) => setReviewText(e.target.value)}
                          placeholder="Tell us about the taste, portion size, and delivery..."
                          className="w-full p-3 bg-white rounded-lg border border-gray-200 focus:ring-2 focus:ring-black/5 outline-none resize-none h-32 text-sm transition-all"
                          required
                        />
                      </div>
                    </div>

                    <button 
                      type="submit" 
                      disabled={isSubmitting || userRating === 0 || !userName.trim() || !reviewText.trim()}
                      className="w-full mt-6 bg-black text-white py-3.5 rounded-xl font-bold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-800 transition-all active:scale-[0.99] flex items-center justify-center gap-2 shadow-lg"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 size={18} className="animate-spin" />
                          Posting...
                        </>
                      ) : (
                        <>
                          Submit Review <Send size={16} />
                        </>
                      )}
                    </button>
                  </form>
                </div>

                {/* Review List Header */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">Customer Reviews</h3>
                    <p className="text-sm text-gray-500 mt-0.5">Verified feedback from our diners</p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-gray-900 leading-none">{restaurant.rating}</div>
                    <div className="flex text-yellow-400 text-xs my-1">
                      {[1,2,3,4,5].map(i => <Star key={i} size={12} fill={i <= Math.round(restaurant.rating) ? "currentColor" : "none"} className={i <= Math.round(restaurant.rating) ? "" : "text-gray-300"} />)}
                    </div>
                    <span className="text-xs font-medium text-gray-400">{restaurant.reviews.length} ratings</span>
                  </div>
                </div>

                {/* Review List */}
                <div className="space-y-4">
                  {restaurant.reviews.length === 0 ? (
                    <div className="text-center py-10 bg-white rounded-xl border border-dashed border-gray-300">
                      <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-3">
                        <MessageSquare size={24} className="text-gray-400" />
                      </div>
                      <p className="text-gray-500 font-medium">No reviews yet. Be the first!</p>
                    </div>
                  ) : (
                    restaurant.reviews.map(review => (
                      <div key={review.id} className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm transition-transform hover:scale-[1.01]">
                        <div className="flex justify-between items-start mb-3">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-indigo-100 to-purple-100 text-indigo-700 rounded-full flex items-center justify-center font-bold text-lg shadow-inner">
                              {review.userName.charAt(0).toUpperCase()}
                            </div>
                            <div>
                               <div className="flex items-center gap-2">
                                  <p className="font-bold text-gray-900 leading-tight">{review.userName}</p>
                                  <span className="bg-green-50 text-green-700 text-[10px] px-1.5 py-0.5 rounded border border-green-100 font-bold flex items-center gap-0.5">
                                    <CheckCircle size={8} /> Verified
                                  </span>
                               </div>
                               <p className="text-xs text-gray-400 font-medium">{review.date}</p>
                            </div>
                          </div>
                          <div className={`px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1 shadow-sm ${review.rating >= 4 ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
                            {review.rating} <Star size={10} fill="currentColor" />
                          </div>
                        </div>
                        <p className="text-gray-600 text-sm leading-relaxed">{review.text}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Cart Sticky (Only if items in cart) */}
        {cartCount > 0 && (
          <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 shadow-[0_-4px_30px_rgba(0,0,0,0.15)] z-30 animate-in slide-in-from-bottom-10">
             <div className="max-w-5xl mx-auto flex justify-between items-center">
               <div className="flex items-center gap-4">
                 <div className="bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-bold border border-green-200">
                   {cartCount} Items
                 </div>
                 <div>
                   <p className="font-extrabold text-xl text-gray-900">${cartTotal}</p>
                   <p className="text-xs text-gray-500 font-medium">Extra charges may apply</p>
                 </div>
               </div>
               <button 
                onClick={onCheckout}
                className="bg-black hover:bg-gray-800 text-white px-10 py-4 rounded-2xl font-bold shadow-xl flex items-center gap-3 transition-all hover:scale-105 active:scale-95"
               >
                 Checkout <ShoppingBag size={20} />
               </button>
             </div>
          </div>
        )}

      </div>
    </div>
  );
};
