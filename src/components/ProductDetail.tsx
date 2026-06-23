import React, { useState } from 'react';
import { X, Star, Truck, Calendar, ShieldCheck, ShoppingCart, Check, ChevronDown } from 'lucide-react';
import { Product, Country } from '../types';
import { regionsData, sampleReviews } from '../data';

interface ProductDetailProps {
  product: Product;
  country: Country;
  currencySymbol: string;
  onClose: () => void;
  onAddToCart: (product: Product, quantity: number) => void;
}

export const ProductDetail: React.FC<ProductDetailProps> = ({
  product,
  country,
  currencySymbol,
  onClose,
  onAddToCart
}) => {
  const [quantity, setQuantity] = useState(1);
  const [selectedTown, setSelectedTown] = useState('');
  const [isAdded, setIsAdded] = useState(false);

  const regionInfo = regionsData[country];
  
  // Slashed pricing calculations
  const currentPrice = country === 'Kenya' ? product.priceKES : product.priceUGX;
  const originalPrice = Math.round(currentPrice / (1 - product.discount / 100));

  const reviews = sampleReviews[product.id] || [
    { id: 'r_gen_1', username: 'Gladys J.', rating: 5, comment: 'Absolute quality! Exceeded expectations, and delivery was exceptionally prompt.', date: '2026-06-19' },
    { id: 'r_gen_2', username: 'Kisekka P.', rating: 4, comment: 'Highly recommended. Securely packaged, very premium design.', date: '2026-06-20' }
  ];

  const handleAddToCart = () => {
    onAddToCart(product, quantity);
    setIsAdded(true);
    setTimeout(() => {
      setIsAdded(false);
    }, 2000);
  };

  const getShippingCost = () => {
    if (!selectedTown) return null;
    return regionInfo.shippingCosts[selectedTown];
  };

  const handleQuantityChange = (val: number) => {
    if (val < 1 || val > product.stock) return;
    setQuantity(val);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="relative bg-white w-full max-w-4xl rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row max-h-[90vh]"
        id={`product-detail-modal-${product.id}`}
      >
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 z-10 bg-slate-100 hover:bg-slate-200 text-slate-800 p-2 rounded-full transition-colors cursor-pointer"
        >
          <X size={20} />
        </button>

        {/* Outer Grid Form */}
        <div className="w-full flex flex-col md:flex-row overflow-y-auto max-h-[90vh]">
          {/* Column 1: Image & Highlight Badges */}
          <div className="w-full md:w-1/2 bg-slate-50 p-6 flex flex-col justify-center relative border-b md:border-b-0 md:border-r border-slate-100">
            <div className="absolute top-4 left-4 flex flex-col gap-2">
              {product.isExpress && (
                <span className="bg-orange-500 text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md shadow-sm">
                  Zuri Express
                </span>
              )}
              {product.isBestSeller && (
                <span className="bg-slate-900 text-amber-400 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md shadow-sm border border-amber-400/20">
                  Best Seller
                </span>
              )}
              {product.discount > 0 && (
                <span className="bg-red-650 text-white text-[11px] font-bold px-2 py-0.5 rounded-md">
                  -{product.discount}% Off
                </span>
              )}
            </div>

            <img 
              src={product.image} 
              alt={product.title} 
              referrerPolicy="no-referrer"
              className="w-full h-80 object-cover rounded-xl shadow-md mx-auto my-auto transition-transform hover:scale-105 duration-300"
            />
          </div>

          {/* Column 2: Product purchasing details and shipping */}
          <div className="w-full md:w-1/2 p-6 flex flex-col justify-between">
            <div>
              {/* Brand and category */}
              <div className="flex items-center justify-between text-xs text-orange-500 font-bold tracking-widest uppercase mb-1">
                <span>Brand: {product.brand}</span>
                <span className="text-slate-400 font-normal">| {product.category.replace('-', ' ')}</span>
              </div>

              {/* Title */}
              <h2 className="text-xl font-bold font-sans text-slate-950 leading-snug mb-3">
                {product.title}
              </h2>

              {/* Rating Section */}
              <div className="flex items-center gap-2 mb-4">
                <div className="flex items-center text-amber-400">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star 
                      key={i} 
                      size={15} 
                      fill={i < Math.floor(product.rating) ? "currentColor" : "none"} 
                      className={i < Math.floor(product.rating) ? "" : "text-slate-350"}
                    />
                  ))}
                </div>
                <span className="text-xs font-semibold text-slate-500">
                  {product.rating} ({product.reviewsCount} verified reviews)
                </span>
              </div>

              <hr className="border-slate-100 my-4" />

              {/* Pricing breakdown */}
              <div className="mb-4">
                <div className="flex items-baseline gap-3">
                  <span className="text-3xl font-black text-slate-950 font-mono">
                    {currencySymbol} {currentPrice.toLocaleString()}
                  </span>
                  {product.discount > 0 && (
                    <span className="text-sm text-slate-400 line-through">
                      {currencySymbol} {originalPrice.toLocaleString()}
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-green-600 font-semibold mt-1">
                  Active stock: {product.stock > 0 ? `${product.stock} items remaining` : 'Out of stock'}
                </p>
              </div>

              {/* Description */}
              <p className="text-xs text-slate-600 leading-relaxed mb-5">
                {product.description}
              </p>

              {/* Delivery Estimator / Selector on City */}
              <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 mb-5">
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                  <Truck size={14} className="text-orange-500" />
                  Delivery & Shipping Fee Estimator
                </h4>
                <div className="space-y-3">
                  <div>
                    <label className="block text-[10px] text-slate-400 font-semibold uppercase mb-1">
                      Choose destination town / zone:
                    </label>
                    <div className="relative">
                      <select
                        value={selectedTown}
                        onChange={(e) => setSelectedTown(e.target.value)}
                        className="w-full bg-white border border-slate-200 rounded-lg text-xs px-3 py-2 text-slate-800 cursor-pointer appearance-none outline-none focus:border-orange-500"
                      >
                        <option value="">-- Select Town/Zone --</option>
                        {regionInfo.towns.map((town) => (
                          <option key={town} value={town}>{town}</option>
                        ))}
                      </select>
                      <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                    </div>
                  </div>

                  {selectedTown && (
                    <div className="flex justify-between items-center text-xs bg-white border border-slate-150 rounded-lg p-2.5 animate-in fade-in duration-200">
                      <span className="text-slate-500">Shipping via Zuri Express:</span>
                      <span className="font-bold text-slate-900 font-mono">
                        {currencySymbol} {getShippingCost()?.toLocaleString()}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Buying Action Drawer */}
            <div className="mt-4">
              <div className="flex items-center gap-4 mb-4">
                <span className="text-xs font-bold text-slate-500 uppercase">Quantity:</span>
                <div className="flex items-center border border-slate-200 rounded-lg bg-white">
                  <button 
                    onClick={() => handleQuantityChange(quantity - 1)}
                    disabled={quantity <= 1}
                    className="px-3 py-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-50 disabled:opacity-30 text-sm font-bold"
                  >
                    -
                  </button>
                  <span className="px-3 py-1.5 text-slate-800 text-sm font-semibold font-mono">
                    {quantity}
                  </span>
                  <button 
                    onClick={() => handleQuantityChange(quantity + 1)}
                    disabled={quantity >= product.stock}
                    className="px-3 py-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-50 disabled:opacity-30 text-sm font-bold"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleAddToCart}
                  disabled={product.stock <= 0}
                  className={`flex-1 flex items-center justify-center gap-2 font-bold py-3 px-6 rounded-xl shadow-lg transition-transform active:scale-95 text-sm cursor-pointer ${
                    isAdded 
                      ? 'bg-green-600 text-white hover:bg-green-700' 
                      : 'bg-orange-500 text-white hover:bg-orange-600'
                  }`}
                  style={{ boxShadow: isAdded ? 'none' : '0 4px 14px rgba(249, 115, 22, 0.4)' }}
                  id={`add-to-cart-btn-${product.id}`}
                >
                  {isAdded ? (
                    <>
                      <Check size={18} />
                      <span>Added to Cart!</span>
                    </>
                  ) : (
                    <>
                      <ShoppingCart size={18} />
                      <span>Add to Cart ({currencySymbol} {(currentPrice * quantity).toLocaleString()})</span>
                    </>
                  )}
                </button>
              </div>

              {/* Utility Assure badges */}
              <div className="grid grid-cols-3 gap-2 mt-4 text-center">
                <div className="flex flex-col items-center p-2 bg-slate-50 rounded-lg border border-slate-100">
                  <Calendar size={14} className="text-orange-500 mb-1" />
                  <span className="text-[10px] text-slate-600 font-bold block">Easy Returns</span>
                  <span className="text-[9px] text-slate-400 block">7 days return policy</span>
                </div>
                <div className="flex flex-col items-center p-2 bg-slate-50 rounded-lg border border-slate-100">
                  <ShieldCheck size={14} className="text-orange-500 mb-1" />
                  <span className="text-[10px] text-slate-600 font-bold block">100% Secure</span>
                  <span className="text-[9px] text-slate-400 block">Encrypted local pay</span>
                </div>
                <div className="flex flex-col items-center p-2 bg-slate-50 rounded-lg border border-slate-100">
                  <Truck size={14} className="text-orange-500 mb-1" />
                  <span className="text-[10px] text-slate-600 font-bold block">Zuri Protect</span>
                  <span className="text-[9px] text-slate-400 block">Local warranty card</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
