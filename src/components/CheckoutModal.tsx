import React, { useState } from 'react';
import { X, Smartphone, CheckCircle, ChevronDown, ShoppingBag, CreditCard, KeyRound } from 'lucide-react';
import { Country, CartItem, Order } from '../types';
import { regionsData } from '../data';

interface CheckoutModalProps {
  cart: CartItem[];
  country: Country;
  currencySymbol: string;
  couponUsed: string;
  couponDiscountPercent: number;
  onClose: () => void;
  onClearCart: () => void;
  onOrderCompleted: (order: Order) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  cart,
  country,
  currencySymbol,
  couponUsed,
  couponDiscountPercent,
  onClose,
  onClearCart,
  onOrderCompleted
}) => {
  const [step, setStep] = useState<1 | 2 | 3>(1); // 1: Address, 2: Payment Simulation, 3: Success
  const [name, setName] = useState('');
  const [phone, setPhone] = useState(country === 'Kenya' ? '+254 7' : '+256 7');
  const [email, setEmail] = useState('');
  const [town, setTown] = useState('');
  const [addressDetails, setAddressDetails] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('Payment on Delivery');

  // Payment Pin Simulation
  const [momoPin, setMomoPin] = useState('');
  const [isVerifyingPin, setIsVerifyingPin] = useState(false);
  const [pinError, setPinError] = useState('');
  const [createdOrder, setCreatedOrder] = useState<Order | null>(null);

  const regionInfo = regionsData[country];

  // Calculations
  const subtotal = cart.reduce((acc, item) => {
    const price = country === 'Kenya' ? item.product.priceKES : item.product.priceUGX;
    return acc + (price * item.quantity);
  }, 0);

  const discountAmount = Math.round(subtotal * (couponDiscountPercent / 100));
  const shippingFee = town ? regionInfo.shippingCosts[town] : 0;
  const totalAmount = subtotal - discountAmount + shippingFee;

  const handleNextStep = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim() || !town || !addressDetails.trim()) {
      alert('Please fill out all mandatory shipping details.');
      return;
    }
    setStep(2);
  };

  const handleSimulatePayment = () => {
    if (paymentMethod.includes('Money') || paymentMethod.includes('M-Pesa')) {
      if (momoPin.length !== 4) {
        setPinError('Please enter a 4-digit security PIN.');
        return;
      }
      setIsVerifyingPin(true);
      setPinError('');

      // Simulating Mpesa / MoMo API delay
      setTimeout(() => {
        setIsVerifyingPin(false);
        finalizeOrderPlaced();
      }, 2500);
    } else {
      finalizeOrderPlaced();
    }
  };

  const finalizeOrderPlaced = () => {
    const orderId = `ZURI-${Math.floor(100000 + Math.random() * 900000)}-${country === 'Kenya' ? 'KE' : 'UG'}`;
    const newOrder: Order = {
      id: orderId,
      items: [...cart],
      subtotal,
      shippingFee,
      discountAmount,
      total: totalAmount,
      date: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
      status: 'Processing',
      country,
      shippingAddress: {
        name,
        phone,
        email,
        town,
        addressDetails
      },
      paymentMethod,
      paymentDetails: paymentMethod.includes('Money') || paymentMethod.includes('M-Pesa') ? `Account: ${phone} (Verified via Sim PIN)` : 'Cash to Courier',
      trackingSteps: [
        { title: 'Order Placed', description: 'Your order was successfully validated and logged.', time: 'Just now', completed: true },
        { title: 'Item Sorting', description: 'Preparing items in Nairobi/Kampala Zuri warehouse.', time: 'Pending fulfillment', completed: false },
        { title: 'Shipped via Zuri Express', description: 'Package handed over to express logisticians.', time: 'Expected tomorrow', completed: false },
        { title: 'Delivered', description: 'Safe arrival at your door/pick-up station.', time: 'Expected 1-2 days', completed: false }
      ]
    };

    // Store in localStorage
    const savedOrdersString = localStorage.getItem('zuri_orders') || '[]';
    const savedOrdersArr = JSON.parse(savedOrdersString);
    savedOrdersArr.unshift(newOrder);
    localStorage.setItem('zuri_orders', JSON.stringify(savedOrdersArr));

    setCreatedOrder(newOrder);
    setStep(3);
    onClearCart();
    onOrderCompleted(newOrder);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="bg-white w-full max-w-xl rounded-2xl shadow-2xl overflow-hidden flex flex-col relative max-h-[92vh]"
        id="checkout-modal-container"
      >
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2">
            <ShoppingBag size={18} className="text-gold" />
            <span className="font-bold text-slate-800 text-sm uppercase tracking-wide">
              Secure Checkout • Steps {step} of 3
            </span>
          </div>
          <button 
            onClick={onClose}
            className="text-slate-400 hover:text-slate-800 p-1 rounded-full hover:bg-slate-100 cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Scroller Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          
          {/* STEP 1: Address & Shipping details Form */}
          {step === 1 && (
            <form onSubmit={handleNextStep} className="space-y-4">
              <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2 flex items-center gap-2 uppercase tracking-wide">
                1. Delivery & Address in {country}
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] text-slate-400 font-bold uppercase mb-1">
                    Full Name *
                  </label>
                  <input 
                    type="text" 
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Judith Oyoo"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-slate-800 focus:border-gold outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[10px] text-slate-400 font-bold uppercase mb-1">
                    Active Phone Number *
                  </label>
                  <input 
                    type="text" 
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="e.g. +254 712 345678"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-slate-800 focus:border-gold outline-none font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] text-slate-400 font-bold uppercase mb-1">
                  Email Address (Optional)
                </label>
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. shopper@gmail.com"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-slate-800 focus:border-gold outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] text-slate-400 font-bold uppercase mb-1">
                    Select Town / Area *
                  </label>
                  <div className="relative">
                    <select
                      required
                      value={town}
                      onChange={(e) => setTown(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-slate-800 cursor-pointer appearance-none outline-none focus:border-gold"
                    >
                      <option value="">-- Choose Town --</option>
                      {regionInfo.towns.map((t) => (
                        <option key={t} value={t}>{t}</option>
                      ))}
                    </select>
                    <ChevronDown size={14} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] text-slate-400 font-bold uppercase mb-1">
                    Detailed Door / pickup landmarks *
                  </label>
                  <input 
                    type="text" 
                    required
                    value={addressDetails}
                    onChange={(e) => setAddressDetails(e.target.value)}
                    placeholder="Apt, Plot number, Gate Color, Street name"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-slate-800 focus:border-gold outline-none"
                  />
                </div>
              </div>

              {/* Order total breakdown panel */}
              <div className="bg-slate-50 rounded-xl p-4 border border-slate-250 mt-4">
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">Order Price Summary</h4>
                <div className="space-y-1.5 text-xs text-slate-600">
                  <div className="flex justify-between">
                    <span>Items Subtotal:</span>
                    <span className="font-mono text-slate-800 font-semibold">{currencySymbol} {subtotal.toLocaleString()}</span>
                  </div>
                  {couponDiscountPercent > 0 && (
                    <div className="flex justify-between text-green-600 font-semibold">
                      <span>Promo Coupon Discount ({couponUsed}):</span>
                      <span className="font-mono">-{currencySymbol} {discountAmount.toLocaleString()}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span>Zuri Express Shipping:</span>
                    <span className="font-mono text-slate-800 font-semibold">
                      {town ? `${currencySymbol} ${shippingFee.toLocaleString()}` : 'Select town first'}
                    </span>
                  </div>
                  <hr className="border-slate-200 my-1.5" />
                  <div className="flex justify-between text-sm font-extrabold text-slate-950">
                    <span>Grand Total:</span>
                    <span className="font-mono text-gold">{currencySymbol} {totalAmount.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-3.5 rounded-xl text-xs uppercase shadow transition-all cursor-pointer"
              >
                Continue to Payment Method
              </button>
            </form>
          )}

          {/* STEP 2: payment Method Simulation */}
          {step === 2 && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2 flex items-center gap-2 uppercase tracking-wide">
                2. Select Payment Method
              </h3>

              <div className="space-y-2.5">
                {regionInfo.paymentMethods.map((pm) => (
                  <label 
                    key={pm}
                    onClick={() => setPaymentMethod(pm)}
                    className={`flex items-center gap-3 p-3.5 rounded-xl border text-xs cursor-pointer transition-all ${
                      paymentMethod === pm 
                        ? 'bg-gold/10 border-gold' 
                        : 'bg-white border-slate-150 hover:bg-slate-50'
                    }`}
                  >
                    <input 
                      type="radio" 
                      name="payment-method-radio"
                      checked={paymentMethod === pm}
                      onChange={() => {}} // Controlled by label click
                      className="text-gold focus:ring-gold"
                    />
                    <div className="flex items-center gap-2">
                      {pm.includes('Money') || pm.includes('M-Pesa') ? (
                        <Smartphone size={16} className="text-gold" />
                      ) : pm.includes('Card') ? (
                        <CreditCard size={16} className="text-gold" />
                      ) : (
                        <ShoppingBag size={16} className="text-slate-500" />
                      )}
                      <div>
                        <span className="font-bold text-slate-800 block leading-tight">{pm}</span>
                        <span className="text-[10px] text-slate-400 block mt-0.5">
                          {pm.includes('Money') || pm.includes('M-Pesa') 
                            ? `Simulate real-time East African API prompt directly on ${phone}` 
                            : pm.includes('Card') ? 'Simulate standard Visa/Mastercard processing' : 'Pay when our dispatch parcel guy reaches door'}
                        </span>
                      </div>
                    </div>
                  </label>
                ))}
              </div>

              {/* Interactive MoMo push notification prompt container */}
              {(paymentMethod.includes('Money') || paymentMethod.includes('M-Pesa')) && (
                <div className="bg-slate-900 text-slate-100 p-4 rounded-xl border border-gold/30 space-y-3 animate-in slide-in-from-top-4 duration-200">
                  <div className="flex items-center justify-between text-xs border-b border-slate-800 pb-2 text-gold-light font-bold uppercase tracking-wider">
                    <span className="flex items-center gap-1.5">
                      <Smartphone className="animate-bounce" size={14} />
                      Simulated MoMo Gateway
                    </span>
                    <span className="font-mono text-[10px] text-slate-400">STATUS: READY</span>
                  </div>

                  <p className="text-[11px] text-slate-300 leading-normal">
                    We will send an interactive mobile money push of <strong className="text-gold-light font-semibold">{currencySymbol} {totalAmount.toLocaleString()}</strong> to <strong className="text-gold-light">{phone}</strong>. Please type your 4-digit simulated payment PIN inside the mobile keypad below:
                  </p>

                  <div className="flex flex-col items-center bg-slate-950 p-4 border border-slate-800 rounded-xl max-w-xs mx-auto space-y-3">
                    <div className="w-full">
                      <label className="block text-[9px] text-slate-500 font-bold uppercase mb-1 text-center">
                        ENTER SIMULATED PIN (try "1234")
                      </label>
                      <input 
                        type="password" 
                        maxLength={4}
                        placeholder="••••"
                        value={momoPin}
                        onChange={(e) => setMomoPin(e.target.value.replace(/\D/g, ''))}
                        className="w-full text-center tracking-widest font-mono text-lg py-1.5 bg-slate-900 border border-slate-800 text-white outline-none rounded-lg focus:border-gold"
                      />
                    </div>

                    {pinError && <p className="text-[9px] text-red-400 font-bold text-center leading-tight">{pinError}</p>}

                    {isVerifyingPin ? (
                       <div className="space-y-1.5 text-center">
                        <span className="flex gap-1 justify-center">
                          <span className="h-1.5 w-1.5 bg-gold rounded-full animate-bounce"></span>
                          <span className="h-1.5 w-1.5 bg-gold rounded-full animate-bounce delay-100"></span>
                          <span className="h-1.5 w-1.5 bg-gold rounded-full animate-bounce delay-200"></span>
                        </span>
                        <p className="text-[9px] text-gold-light animate-pulse">Contacting Safaricom/MTN APIs...</p>
                      </div>
                    ) : (
                      <div className="flex gap-1.5">
                        <button 
                          type="button"
                          onClick={() => setMomoPin('1234')}
                          className="bg-slate-800 hover:bg-slate-700 text-[9px] text-slate-300 px-2 py-1 rounded font-mono cursor-pointer"
                        >
                          Auto-fill demo Pin
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}

              <div className="flex gap-3 mt-4">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="flex-1 border border-slate-200 hover:bg-slate-50 text-slate-600 font-bold py-3 rounded-xl text-xs uppercase cursor-pointer"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={handleSimulatePayment}
                  disabled={isVerifyingPin}
                  className="flex-1 bg-gold hover:bg-gold-hover text-slate-950 font-extrabold py-3 rounded-xl text-xs uppercase shadow-lg transition-transform active:scale-95 disabled:opacity-50 cursor-pointer"
                  style={{ 
                    boxShadow: '0 4px 14px rgba(197, 160, 89, 0.4), 0 0 20px rgba(30, 58, 138, 0.2)' 
                  }}
                >
                  Place Order ({currencySymbol} {totalAmount.toLocaleString()})
                </button>
              </div>

              <p className="text-[9px] text-slate-400 text-center leading-normal">
                🚚 You will pay cash to our delivery person at the time of receiving the items.
              </p>
            </div>
          )}

          {/* STEP 3: Order Completed Succes page */}
          {step === 3 && createdOrder && (
            <div className="text-center py-6 space-y-4 animate-in zoom-in-95 duration-300">
              <div className="mx-auto bg-green-50 text-green-600 p-4 rounded-full w-20 h-20 flex items-center justify-center border border-green-200">
                <CheckCircle size={44} />
              </div>

              <div className="space-y-1.5">
                <h3 className="text-2xl font-black text-slate-950 font-sans tracking-tight">Order Placed Successfully!</h3>
                <p className="text-xs text-slate-500">
                  Thank you for shopping at Zuri Shoppers Kenya & Uganda.
                </p>
              </div>

              <div className="bg-slate-50 border border-slate-150 rounded-xl p-4 max-w-sm mx-auto text-left space-y-1.5 card shadow-sm">
                <div className="flex justify-between items-baseline text-xs text-slate-500 pb-1.5 border-b border-slate-200">
                  <span>Order ID:</span>
                  <strong className="text-slate-900 font-mono text-sm">{createdOrder.id}</strong>
                </div>
                <div className="flex justify-between text-xs text-slate-600 pt-1">
                  <span>Recipient:</span>
                  <span className="font-semibold text-slate-800">{createdOrder.shippingAddress.name}</span>
                </div>
                <div className="flex justify-between text-xs text-slate-600">
                  <span>Destination:</span>
                  <span className="font-semibold text-slate-800">{createdOrder.shippingAddress.town}</span>
                </div>
                <div className="flex justify-between text-xs text-slate-600">
                  <span>Paid via:</span>
                  <span className="font-semibold text-gold">{createdOrder.paymentMethod}</span>
                </div>
                <div className="flex justify-between text-sm text-slate-900 font-extrabold border-t border-slate-200 pt-2 mt-2">
                  <span>Total Settled:</span>
                  <span className="font-mono">{currencySymbol} {createdOrder.total.toLocaleString()}</span>
                </div>
              </div>

              <p className="text-[11px] text-gold font-bold uppercase tracking-widest bg-gold/10 py-1.5 px-3 rounded-lg max-w-xs mx-auto animate-pulse">
                🚀 Shipped via Zuri Express
              </p>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="bg-slate-950 hover:bg-slate-900 text-white font-bold py-3.5 px-8 rounded-xl text-xs uppercase shadow cursor-pointer"
                >
                  Continue Shopping
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
