import React, { useState } from 'react';
import { X, Trash2, ShoppingCart, ArrowRight, Sparkles } from 'lucide-react';
import { CartItem, Country } from '../types';

interface CartDrawerProps {
  isOpen: boolean;
  cart: CartItem[];
  currencySymbol: string;
  country: Country;
  onClose: () => void;
  onUpdateQuantity: (id: string, quantity: number) => void;
  onRemoveItem: (id: string) => void;
  onOpenCheckout: (couponUsed: string, couponDiscountPercent: number) => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  cart,
  currencySymbol,
  country,
  onClose,
  onUpdateQuantity,
  onRemoveItem,
  onOpenCheckout
}) => {
  const [couponCode, setCouponCode] = useState('');
  const [activeCouponPercent, setActiveCouponPercent] = useState(0);
  const [couponError, setCouponError] = useState('');
  const [couponSuccess, setCouponSuccess] = useState('');

  if (!isOpen) return null;

  // Calculatings
  const subtotal = cart.reduce((acc, item) => {
    const price = country === 'Kenya' ? item.product.priceKES : item.product.priceUGX;
    return acc + (price * item.quantity);
  }, 0);

  const discountAmount = Math.round(subtotal * (activeCouponPercent / 100));
  const finalTotal = subtotal - discountAmount;

  const handleApplyCoupon = () => {
    setCouponError('');
    setCouponSuccess('');
    const code = couponCode.trim().toUpperCase();

    if (code === 'WELCOME25') {
      setActiveCouponPercent(25);
      setCouponSuccess('Success! 25% First Shopper discount applied.');
    } else if (code === 'ZURI10') {
      setActiveCouponPercent(10);
      setCouponSuccess('Success! 10% Gold loyalty discount applied.');
    } else if (code === '') {
      setCouponError('Please enter a coupon code.');
    } else {
      setCouponError('Invalid coupon code. Try ZURI10 or WELCOME25.');
    }
  };

  const handleCheckOut = () => {
    onOpenCheckout(activeCouponPercent > 0 ? couponCode.trim().toUpperCase() : '', activeCouponPercent);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex justify-end animate-in fade-in duration-200">
      {/* Tap out zone */}
      <div className="absolute inset-0 -z-10" onClick={onClose} />

      <div 
        className="bg-white w-full max-w-md h-full shadow-2xl flex flex-col justify-between animate-in slide-in-from-right duration-300"
        id="shopping-cart-drawer"
      >
        {/* Header */}
        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2 text-slate-800">
            <ShoppingCart size={20} className="text-gold" />
            <h3 className="font-bold text-lg font-sans">Your Shopping Cart</h3>
            <span className="bg-gold text-slate-950 text-xs px-2 py-0.5 rounded-full font-bold">
              {cart.reduce((sum, i) => sum + i.quantity, 0)}
            </span>
          </div>
          <button 
            onClick={onClose} 
            className="text-slate-500 hover:text-slate-800 p-1.5 rounded-full hover:bg-slate-100 cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-72 text-center text-slate-400">
              <ShoppingCart size={54} className="stroke-[1] mb-3 text-slate-300" />
              <p className="text-sm font-semibold">Your cart is empty</p>
              <p className="text-xs max-w-xs mt-1">Start browsing our premium products in Kenya and Uganda and add items to your cart!</p>
              <button 
                onClick={onClose}
                className="mt-4 bg-gold hover:bg-gold-hover text-slate-950 text-xs font-black px-4 py-2 rounded-lg"
              >
                Go Shopping
              </button>
            </div>
          ) : (
            cart.map((item) => {
              const currentPrice = country === 'Kenya' ? item.product.priceKES : item.product.priceUGX;
              return (
                <div 
                  key={item.product.id}
                  className="flex gap-3 border-b border-slate-100 pb-3"
                  id={`cart-item-${item.product.id}`}
                >
                  <img 
                    src={item.product.image} 
                    alt={item.product.title} 
                    referrerPolicy="no-referrer"
                    className="w-16 h-16 object-cover rounded-lg border border-slate-150"
                  />
                  <div className="flex-1">
                    <h4 className="text-xs font-bold text-slate-900 line-clamp-2 leading-tight">
                      {item.product.title}
                    </h4>
                    <p className="text-[10px] text-gold font-semibold mt-0.5 uppercase">
                      Brand: {item.product.brand}
                    </p>
                    
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-sm font-bold text-slate-950 font-mono">
                        {currencySymbol} {currentPrice.toLocaleString()}
                      </span>

                      {/* Quantity Toggles */}
                      <div className="flex items-center border border-slate-200 rounded-lg bg-slate-50 scale-90Origin transform origin-right">
                        <button 
                          onClick={() => onUpdateQuantity(item.product.id, item.quantity - 1)}
                          className="px-2 py-0.5 text-slate-500 font-bold hover:bg-slate-200"
                        >
                          -
                        </button>
                        <span className="px-2 text-xs font-semibold font-mono text-slate-800">
                          {item.quantity}
                        </span>
                        <button 
                          onClick={() => onUpdateQuantity(item.product.id, item.quantity + 1)}
                          disabled={item.quantity >= item.product.stock}
                          className="px-2 py-0.5 text-slate-500 font-bold hover:bg-slate-200 disabled:opacity-30"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                  <button 
                    onClick={() => onRemoveItem(item.product.id)}
                    className="text-slate-400 hover:text-red-500 p-1 self-start cursor-pointer"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              );
            })
          )}
        </div>

        {/* Coupon and Summary triggers */}
        {cart.length > 0 && (
          <div className="border-t border-slate-150 p-4 bg-slate-50 space-y-3.5">
            {/* Promo Code section */}
            <div className="bg-white rounded-lg p-2.5 border border-slate-200">
              <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1 leading-none tracking-wide">
                Apply Promo Coupon
              </label>
              <div className="flex gap-2">
                <input 
                  type="text" 
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  placeholder="e.g. ZURI10 or WELCOME25"
                  className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1 text-xs uppercase focus:border-gold outline-none"
                />
                <button 
                  onClick={handleApplyCoupon}
                  className="text-xs bg-slate-900 border border-slate-900 hover:bg-slate-800 text-white font-bold px-3 py-1.5 rounded-xl cursor-pointer"
                >
                  Apply
                </button>
              </div>

              {couponError && <p className="text-[10px] text-red-500 mt-1 font-semibold">{couponError}</p>}
              {couponSuccess && <p className="text-[10px] text-green-600 mt-1 font-semibold">{couponSuccess}</p>}
            </div>

            {/* Calculations breakdown */}
            <div className="space-y-1.5 text-xs text-slate-600">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span className="font-mono text-slate-900 font-semibold">{currencySymbol} {subtotal.toLocaleString()}</span>
              </div>
              {activeCouponPercent > 0 && (
                <div className="flex justify-between text-green-600 font-semibold">
                  <span>Coupon Discount ({activeCouponPercent}%):</span>
                  <span className="font-mono">-{currencySymbol} {discountAmount.toLocaleString()}</span>
                </div>
              )}
              <hr className="border-slate-200 my-1" />
              <div className="flex justify-between text-sm font-extrabold text-slate-950">
                <span>Total Amount:</span>
                <span className="font-mono text-gold">{currencySymbol} {finalTotal.toLocaleString()}</span>
              </div>
            </div>

            {/* Action Checkout button */}
            <button
              onClick={handleCheckOut}
              className="w-full flex items-center justify-center gap-2 bg-gold hover:bg-gold-hover text-slate-950 font-black py-3.5 rounded-xl text-xs uppercase shadow-md transition-all active:scale-95 cursor-pointer animate-pulse hover:animate-none"
              style={{ 
                boxShadow: '0 4px 14px rgba(197, 160, 89, 0.4), 0 0 20px rgba(30, 58, 138, 0.2)' 
              }}
              id="cart-drawer-checkout-btn"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight size={14} />
            </button>
            <p className="text-[10px] text-center text-slate-400">
              🌟 Complete checkout to simulate live Mobile Money confirmations!
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
