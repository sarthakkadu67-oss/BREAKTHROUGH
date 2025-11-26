
import React, { useEffect, useState } from 'react';
import { X, Package, User, MapPin, LogOut, ShoppingBag, Clock } from 'lucide-react';
import { UserProfile, Order } from '../types';
import { api } from '../services/mockBackend';

interface Props {
  onClose: () => void;
}

export const UserProfileModal: React.FC<Props> = ({ onClose }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [activeTab, setActiveTab] = useState<'profile' | 'orders'>('profile');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const [userData, ordersData] = await Promise.all([
        api.getUserProfile(),
        api.getOrders()
      ]);
      setUser(userData);
      setOrders(ordersData);
      setLoading(false);
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/80 backdrop-blur-sm">
        <div className="text-white flex flex-col items-center">
          <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mb-4"></div>
          Loading Profile...
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose}></div>
      
      <div className="relative bg-gray-950 border border-gray-800 rounded-3xl w-full max-w-4xl h-[85vh] overflow-hidden flex shadow-2xl animate-in fade-in zoom-in-95">
        <button onClick={onClose} className="absolute top-4 right-4 z-10 p-2 bg-gray-900/50 rounded-full text-white hover:bg-gray-800"><X size={20} /></button>

        {/* Sidebar */}
        <div className="w-20 md:w-64 bg-gray-900 border-r border-gray-800 flex flex-col p-4">
           <div className="mb-8 flex flex-col items-center md:items-start">
             <div className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold text-xl mb-3 shadow-lg">
               {user?.name.charAt(0)}
             </div>
             <div className="hidden md:block">
                <h2 className="text-white font-bold text-lg leading-tight">{user?.name}</h2>
                <p className="text-gray-500 text-xs truncate">{user?.email}</p>
             </div>
           </div>

           <nav className="space-y-2 flex-1">
             <button 
              onClick={() => setActiveTab('profile')}
              className={`w-full flex items-center gap-3 p-3 rounded-xl transition-colors ${activeTab === 'profile' ? 'bg-indigo-600 text-white shadow-lg' : 'text-gray-400 hover:bg-gray-800 hover:text-white'}`}
             >
               <User size={20} /> <span className="hidden md:block font-medium">Profile</span>
             </button>
             <button 
              onClick={() => setActiveTab('orders')}
              className={`w-full flex items-center gap-3 p-3 rounded-xl transition-colors ${activeTab === 'orders' ? 'bg-indigo-600 text-white shadow-lg' : 'text-gray-400 hover:bg-gray-800 hover:text-white'}`}
             >
               <Package size={20} /> <span className="hidden md:block font-medium">Orders</span>
             </button>
             <button className="w-full flex items-center gap-3 p-3 rounded-xl text-gray-400 hover:bg-gray-800 hover:text-white transition-colors">
               <MapPin size={20} /> <span className="hidden md:block font-medium">Addresses</span>
             </button>
           </nav>

           <button className="flex items-center gap-3 p-3 text-red-400 hover:bg-red-900/20 rounded-xl transition-colors mt-auto">
             <LogOut size={20} /> <span className="hidden md:block font-medium">Log Out</span>
           </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 bg-gray-950 overflow-y-auto custom-scrollbar p-6 md:p-10">
          
          {activeTab === 'profile' && (
            <div className="max-w-xl animate-in slide-in-from-right-4">
              <h2 className="text-3xl font-bold text-white mb-8">Account Settings</h2>
              
              <div className="space-y-6">
                <div>
                   <label className="block text-gray-400 text-xs font-bold uppercase mb-2">Full Name</label>
                   <input type="text" value={user?.name} readOnly className="w-full bg-gray-900 border border-gray-800 rounded-xl p-4 text-white focus:outline-none focus:border-indigo-500 transition-colors" />
                </div>
                <div>
                   <label className="block text-gray-400 text-xs font-bold uppercase mb-2">Email Address</label>
                   <input type="email" value={user?.email} readOnly className="w-full bg-gray-900 border border-gray-800 rounded-xl p-4 text-white focus:outline-none focus:border-indigo-500 transition-colors" />
                </div>
                <div>
                   <label className="block text-gray-400 text-xs font-bold uppercase mb-2">Phone Number</label>
                   <input type="tel" value={user?.phone} readOnly className="w-full bg-gray-900 border border-gray-800 rounded-xl p-4 text-white focus:outline-none focus:border-indigo-500 transition-colors" />
                </div>

                <div className="pt-6">
                   <button className="px-6 py-3 bg-white text-black font-bold rounded-xl hover:bg-gray-200 transition-colors">
                     Edit Details
                   </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'orders' && (
            <div className="animate-in slide-in-from-right-4">
               <h2 className="text-3xl font-bold text-white mb-8">Order History</h2>
               
               {orders.length === 0 ? (
                 <div className="text-center py-20 bg-gray-900/50 rounded-2xl border border-dashed border-gray-800">
                   <ShoppingBag size={48} className="mx-auto text-gray-600 mb-4" />
                   <p className="text-gray-400 font-medium">No orders yet</p>
                 </div>
               ) : (
                 <div className="space-y-4">
                   {orders.map(order => (
                     <div key={order.id} className="bg-gray-900 border border-gray-800 p-6 rounded-2xl flex flex-col md:flex-row justify-between gap-6 hover:border-gray-700 transition-colors">
                       <div className="flex items-start gap-4">
                         <div className="w-12 h-12 bg-gray-800 rounded-xl flex items-center justify-center shrink-0">
                           <ShoppingBag size={20} className="text-indigo-400" />
                         </div>
                         <div>
                           <h4 className="text-lg font-bold text-white mb-1">{order.restaurantName}</h4>
                           <div className="flex items-center gap-3 text-sm text-gray-400 mb-2">
                             <span className="flex items-center gap-1"><Clock size={12} /> {order.date}</span>
                             <span className="w-1 h-1 bg-gray-600 rounded-full"></span>
                             <span>{order.items.length} Items</span>
                           </div>
                           <p className="text-sm text-gray-500 line-clamp-1">
                             {order.items.map(i => `${i.quantity}x ${i.name}`).join(', ')}
                           </p>
                         </div>
                       </div>
                       
                       <div className="flex md:flex-col justify-between items-end gap-2">
                          <div className={`px-3 py-1 rounded-full text-xs font-bold border ${
                            order.status === 'Delivered' ? 'bg-green-900/30 text-green-400 border-green-900' :
                            order.status === 'Processing' ? 'bg-blue-900/30 text-blue-400 border-blue-900' :
                            'bg-gray-800 text-gray-400 border-gray-700'
                          }`}>
                            {order.status}
                          </div>
                          <div className="font-bold text-white text-lg">${order.totalAmount.toFixed(2)}</div>
                       </div>
                     </div>
                   ))}
                 </div>
               )}
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
