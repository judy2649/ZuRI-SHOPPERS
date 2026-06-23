import React, { useState, useEffect } from 'react';
import { Package, Truck, CheckCircle2, ChevronRight, ShoppingBag, ArrowLeft, Clock } from 'lucide-react';
import { Order, Country } from '../types';

interface OrderTrackerProps {
  country: Country;
  currencySymbol: string;
  onBack: () => void;
  orders: Order[];
}

export const OrderTracker: React.FC<OrderTrackerProps> = ({
  country,
  currencySymbol,
  onBack,
  orders: initialOrders
}) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  useEffect(() => {
    // Load orders from local storage to catch checkout updates or use parent initialOrders
    const saved = localStorage.getItem('zuri_orders');
    if (saved) {
      setOrders(JSON.parse(saved));
    } else {
      setOrders(initialOrders);
    }
  }, [initialOrders]);

  const handleSelectOrder = (order: Order) => {
    // Simulate updating tracking status dynamically if order is older
    // That way, it feels like a real active package! This is extremely cool.
    setSelectedOrder(order);
  };

  const getStatusBadgeClass = (status: Order['status']) => {
    switch (status) {
      case 'Processing':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'Shipped':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Delivered':
        return 'bg-green-100 text-green-850 border-green-200';
      default:
        return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-slate-100 p-6 max-w-3xl mx-auto animate-in fade-in duration-200">
      
      {/* Back Button and Header */}
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
        <button
          onClick={selectedOrder ? () => setSelectedOrder(null) : onBack}
          className="flex items-center gap-1.5 text-xs font-bold text-gold hover:text-gold-hover transition-colors cursor-pointer"
        >
          <ArrowLeft size={16} />
          <span>{selectedOrder ? 'Back to Order History' : 'Back to Store'}</span>
        </button>
        <h2 className="font-extrabold font-sans text-slate-900 border-none p-0 flex items-center gap-2 text-sm sm:text-base">
          <Package className="text-gold" size={20} />
          <span>{selectedOrder ? `Tracking Order ${selectedOrder.id}` : 'Your Zuri Order History'}</span>
        </h2>
      </div>

      {/* Screen 1: Order List View */}
      {!selectedOrder ? (
        <div className="space-y-4">
          {orders.length === 0 ? (
            <div className="text-center py-12 text-slate-400 space-y-4">
              <ShoppingBag size={48} className="mx-auto text-slate-300 stroke-[1]" />
              <div>
                <p className="text-sm font-semibold text-slate-800">You haven't placed any orders yet</p>
                <p className="text-xs max-w-xs mx-auto mt-1 text-slate-400">
                  Fill up your shopping cart and complete simulated checkout to see live tracker feeds!
                </p>
              </div>
              <button
                onClick={onBack}
                className="bg-gold hover:bg-gold-hover text-slate-950 text-xs font-black px-4 py-2.5 rounded-xl shadow-md transition-all active:scale-95"
              >
                Go Shopping Now
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              <p className="text-[11px] text-slate-400 font-bold uppercase tracking-wider mb-2">
                Showing your verified orders in Kenya & Uganda ({orders.length})
              </p>

              {orders.map((order) => (
                <div
                  key={order.id}
                  onClick={() => handleSelectOrder(order)}
                  className="bg-slate-50 hover:bg-slate-100/70 border border-slate-200 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all hover:scale-[1.01] cursor-pointer"
                  style={{ borderLeft: '4px solid #C5A059' }}
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-slate-900 text-sm">{order.id}</span>
                      <span className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full border ${getStatusBadgeClass(order.status)}`}>
                        {order.status}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500">
                      Placed on: <span className="font-semibold text-slate-700">{order.date}</span>
                    </p>
                    <p className="text-xs text-slate-500 line-clamp-1">
                      Items: <strong className="font-semibold text-slate-700">{order.items.map(item => `${item.product.brand} (x${item.quantity})`).join(', ')}</strong>
                    </p>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-4 border-t sm:border-t-0 border-slate-200/50 pt-2.5 sm:pt-0">
                    <div className="text-left sm:text-right">
                      <span className="text-[10px] text-slate-400 font-bold block uppercase leading-none">Total settled</span>
                      <span className="text-sm font-black text-gold font-mono leading-none mt-1 inline-block">
                        {currencySymbol} {order.total.toLocaleString()}
                      </span>
                    </div>
                    <ChevronRight size={18} className="text-gold hidden sm:block" />
                    <span className="text-xs text-gold font-bold sm:hidden flex items-center gap-1.5 font-mono">
                      <span>View details</span>
                      <ChevronRight size={14} />
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        /* Screen 2: Detailed Tracking Roadmap pipeline */
        <div className="space-y-6 animate-in slide-in-from-left-4 duration-250">
          <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 flex flex-col sm:flex-row justify-between sm:items-center gap-4">
            <div>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wide leading-none">Simulated Tracker</p>
              <h3 className="text-base font-black text-slate-950 font-mono mt-1 leading-none">{selectedOrder.id}</h3>
              <p className="text-xs text-slate-400 mt-1">Placed on: {selectedOrder.date}</p>
            </div>
            <div className="text-left sm:text-right">
              <span className="text-[10px] text-slate-400 font-bold block uppercase leading-none">Shipping destination</span>
              <p className="text-xs font-bold text-slate-800 mt-1">{selectedOrder.shippingAddress.town}</p>
              <p className="text-[10px] text-slate-400 leading-none mt-0.5">{selectedOrder.shippingAddress.addressDetails}</p>
            </div>
          </div>

          {/* Vertical Milestone Progress flow */}
          <div className="space-y-6 relative pl-8 before:absolute before:left-3.5 before:top-2.5 before:bottom-2.5 before:w-0.5 before:bg-slate-200">
            {selectedOrder.trackingSteps.map((step, idx) => {
              // Decide active state matching standard logistics
              const completedHistory = selectedOrder.status === 'Delivered' 
                ? [true, true, true, true]
                : selectedOrder.status === 'Shipped'
                  ? [true, true, true, false]
                  : [true, true, false, false]; // Processing
              
              const isCompleted = completedHistory[idx];

              return (
                <div key={idx} className="relative flex flex-col sm:flex-row justify-between items-start gap-2 max-w-xl">
                  {/* Circle Flag anchor */}
                  <div className={`absolute -left-8 rounded-full h-8 w-8 flex items-center justify-center border-2 transition-all ${
                    isCompleted 
                      ? 'bg-gold border-gold text-slate-950 font-black' 
                      : 'bg-white border-slate-350 text-slate-500'
                  }`}>
                    {idx === 0 ? <CheckCircle2 size={14} /> : idx === 1 ? <Clock size={14} /> : idx === 2 ? <Truck size={14} /> : <Package size={14} />}
                  </div>

                  <div>
                    <h4 className={`text-xs font-black tracking-wide ${isCompleted ? 'text-slate-900 font-bold' : 'text-slate-400'}`}>
                      {step.title}
                    </h4>
                    <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">{step.description}</p>
                  </div>

                  <span className="text-[10px] font-mono text-slate-400 sm:text-right flex-shrink-0">
                    {isCompleted ? 'Validated' : step.time}
                  </span>
                </div>
              );
            })}
          </div>

          <hr className="border-slate-100" />

          {/* Parcel Item list within active tracking details */}
          <div>
            <h4 className="text-xs font-black text-slate-800 uppercase tracking-widest mb-3.5 flex items-center gap-1.5">
              <ShoppingBag size={14} className="text-gold" />
              Items in this shipment Parcel
            </h4>
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 divide-y divide-slate-150 space-y-3.5">
              {selectedOrder.items.map((item, idx) => {
                const price = selectedOrder.country === 'Kenya' ? item.product.priceKES : item.product.priceUGX;
                return (
                  <div key={idx} className="flex gap-3 justify-between items-center pt-3 mt-3 first:pt-0 first:mt-0">
                    <div className="flex gap-3 items-center">
                      <img 
                        src={item.product.image} 
                        alt={item.product.title} 
                        referrerPolicy="no-referrer"
                        className="w-12 h-12 object-cover rounded-lg border border-slate-200"
                      />
                      <div>
                        <h5 className="text-xs font-bold text-slate-900 line-clamp-1">{item.product.title}</h5>
                        <p className="text-[10px] text-slate-400 mt-0.5">Brand: {item.product.brand} • Qty: {item.quantity}</p>
                      </div>
                    </div>
                    <span className="font-mono text-xs font-extrabold text-slate-950">
                      {currencySymbol} {(price * item.quantity).toLocaleString()}
                    </span>
                  </div>
                );
              })}

              <div className="pt-3 flex flex-col items-end text-xs text-slate-600 gap-1">
                <div className="flex justify-between w-40">
                  <span>Subtotal:</span>
                  <span className="font-mono font-semibold">{currencySymbol} {selectedOrder.subtotal.toLocaleString()}</span>
                </div>
                {selectedOrder.discountAmount > 0 && (
                  <div className="flex justify-between w-40 text-green-600 font-semibold">
                    <span>Discount:</span>
                    <span className="font-mono">-{currencySymbol} {selectedOrder.discountAmount.toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between w-40">
                  <span>Shipping fee:</span>
                  <span className="font-mono font-semibold">{currencySymbol} {selectedOrder.shippingFee.toLocaleString()}</span>
                </div>
                <div className="flex justify-between w-40 text-sm font-extrabold text-slate-950 border-t border-slate-350 pt-1 mt-1">
                  <span>Settled:</span>
                  <span className="font-mono text-gold">{currencySymbol} {selectedOrder.total.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
