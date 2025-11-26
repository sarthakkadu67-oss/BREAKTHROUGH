
import React, { useState } from 'react';
import { X, MapPin, CreditCard, Banknote, Loader2, CheckCircle, Smartphone } from 'lucide-react';
import { CartItem } from '../types';

interface Props {
  restaurantName: string;
  items: CartItem[];
  totalAmount: number;
  onClose: () => void;
  onPlaceOrder: (address: string, paymentMethod: string) => Promise<void>;
  savedAddresses: string[];
}

export const CheckoutModal: React.FC<Props> = ({ restaurantName, items, totalAmount, onClose, onPlaceOrder, savedAddresses }) => {
  const [step, setStep] = useState<'details' | 'success'>('details');
  const [selectedAddress, setSelectedAddress] = useState(savedAddresses[0] || '');
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [isProcessing, setIsProcessing] = useState(false);
  const [newAddress, setNewAddress] = useState('');
  const [isAddingAddress, setIsAddingAddress] = useState(false);

  const taxes = totalAmount * 0.05;
  const deliveryFee = 2.50;
  const grandTotal = totalAmount + taxes + deliveryFee;

  const handlePlaceOrder = async () => {
    setIsProcessing(true);
    await onPlaceOrder(selectedAddress, paymentMethod);
    setIsProcessing(false);
    setStep('success');
  };

  if (step === 'success') {
    return (
      <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose}></div>
        <div className="relative bg-gray-900 border border-gray-800 rounded-3xl p-8 max-w-md w-full text-center animate-in zoom-in-95 duration-300">
           <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
             <CheckCircle className="text-green-500 w-10 h-10" />
           </div>
           <h2 className="text-3xl font-bold text-white mb-2">Order Placed!</h2>
           <p className="text-gray-400 mb-8">Your food from <span className="text-indigo-400 font-bold">{restaurantName}</span> is being prepared and will be with you shortly.</p>
           <button onClick={onClose} className="w-full py-4 bg-white text-black font-bold rounded-xl hover:bg-gray-200 transition-colors">
             Track Order
           </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity" onClick={onClose}></div>
      
      <div className="relative bg-gray-950 border border-gray-800 rounded-3xl w-full max-w-4xl h-[90vh] md:h-auto overflow-hidden flex flex-col md:flex-row shadow-2xl animate-in slide-in-from-bottom-4">
        
        {/* Left: Details */}
        <div className="flex-1 p-6 md:p-8 overflow-y-auto custom-scrollbar">
           <div className="flex justify-between items-center mb-6">
             <h2 className="text-2xl font-bold text-white">Checkout</h2>
             <button onClick={onClose} className="md:hidden p-2 bg-gray-900 rounded-full text-white"><X size={20} /></button>
           </div>

           {/* Address Section */}
           <div className="mb-8">
             <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-2">
               <MapPin size={16} /> Delivery Address
             </h3>
             <div className="space-y-3">
               {savedAddresses.map((addr, idx) => (
                 <label key={idx} className={`flex items-start gap-3 p-4 rounded-xl border cursor-pointer transition-all ${selectedAddress === addr ? 'border-indigo-500 bg-indigo-900/10 ring-1 ring-indigo-500' : 'border-gray-800 bg-gray-900 hover:border-gray-700'}`}>
                   <input 
                    type="radio" 
                    name="address" 
                    checked={selectedAddress === addr} 
                    onChange={() => setSelectedAddress(addr)}
                    className="mt-1" 
                   />
                   <div className="flex-1">
                     <span className="text-gray-200 text-sm font-medium">{addr}</span>
                   </div>
                 </label>
               ))}
               
               {isAddingAddress ? (
                 <div className="flex gap-2">
                   <input 
                    type="text" 
                    value={newAddress}
                    onChange={(e) => setNewAddress(e.target.value)}
                    placeholder="Enter new address..."
                    className="flex-1 bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white text-sm focus:border-indigo-500 outline-none"
                   />
                   <button 
                    onClick={() => { if(newAddress) { setSelectedAddress(newAddress); setIsAddingAddress(false); } }}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-bold"
                   >
                     Save
                   </button>
                 </div>
               ) : (
                 <button onClick={() => setIsAddingAddress(true)} className="text-indigo-400 text-sm font-bold hover:underline">+ Add New Address</button>
               )}
             </div>
           </div>

           {/* Payment Section */}
           <div className="mb-8">
             <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-2">
               <CreditCard size={16} /> Payment Method
             </h3>
             <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
               <button 
                onClick={() => setPaymentMethod('card')}
                className={`p-4 rounded-xl border flex flex-col items-center gap-2 transition-all ${paymentMethod === 'card' ? 'border-indigo-500 bg-indigo-900/10 text-white' : 'border-gray-800 bg-gray-900 text-gray-400 hover:bg-gray-800'}`}
               >
                 <CreditCard size={24} />
                 <span className="text-xs font-bold">Card</span>
               </button>
               <button 
                onClick={() => setPaymentMethod('upi')}
                className={`p-4 rounded-xl border flex flex-col items-center gap-2 transition-all ${paymentMethod === 'upi' ? 'border-indigo-500 bg-indigo-900/10 text-white' : 'border-gray-800 bg-gray-900 text-gray-400 hover:bg-gray-800'}`}
               >
                 <Smartphone size={24} />
                 <span className="text-xs font-bold">UPI</span>
               </button>
               <button 
                onClick={() => setPaymentMethod('cod')}
                className={`p-4 rounded-xl border flex flex-col items-center gap-2 transition-all ${paymentMethod === 'cod' ? 'border-indigo-500 bg-indigo-900/10 text-white' : 'border-gray-800 bg-gray-900 text-gray-400 hover:bg-gray-800'}`}
               >
                 <Banknote size={24} />
                 <span className="text-xs font-bold">Cash</span>
               </button>
             </div>
           </div>
        </div>

        {/* Right: Order Summary */}
        <div className="w-full md:w-96 bg-gray-900 p-6 md:p-8 border-t md:border-t-0 md:border-l border-gray-800 flex flex-col">
          <button onClick={onClose} className="hidden md:block absolute top-4 right-4 p-2 text-gray-500 hover:text-white"><X size={20} /></button>
          
          <h3 className="text-xl font-bold text-white mb-6">Order Summary</h3>
          
          <div className="flex-1 overflow-y-auto custom-scrollbar mb-6 pr-2">
            {items.map((item, idx) => (
              <div key={idx} className="flex justify-between items-start mb-4 text-sm">
                 <div className="flex gap-3">
                   <div className="w-6 h-6 rounded flex items-center justify-center border border-gray-700 text-xs font-bold text-gray-400 shrink-0">
                     {item.quantity}x
                   </div>
                   <div>
                     <p className="text-gray-200 font-medium">{item.name}</p>
                     <p className="text-xs text-gray-500">${item.price}</p>
                   </div>
                 </div>
                 <p className="text-gray-200 font-medium">${(item.price * item.quantity).toFixed(2)}</p>
              </div>
            ))}
          </div>

          <div className="space-y-3 pt-4 border-t border-gray-800 text-sm mb-6">
            <div className="flex justify-between text-gray-400">
              <span>Item Total</span>
              <span>${totalAmount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-gray-400">
              <span>Taxes & Fees</span>
              <span>${taxes.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-gray-400">
              <span>Delivery Fee</span>
              <span>${deliveryFee.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-white font-bold text-lg pt-2 border-t border-gray-800">
              <span>Grand Total</span>
              <span>${grandTotal.toFixed(2)}</span>
            </div>
          </div>

          <button 
            onClick={handlePlaceOrder}
            disabled={isProcessing}
            className="w-full py-4 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl font-bold text-white shadow-lg shadow-indigo-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
          >
            {isProcessing ? <Loader2 className="animate-spin" /> : 'Place Order'}
          </button>
        </div>

      </div>
    </div>
  );
};

