import { useState, useEffect } from 'react';
import { 
  Smartphone, Tv, Shirt, Sparkles, Home, ShoppingBag, 
  HelpCircle, ChevronRight, Search, ShoppingCart, User, 
  MapPin, Clock, ArrowRight, Star, AlertCircle, RefreshCw
} from 'lucide-react';
import { Country, Product, CartItem, Order } from './types';
import { products as allProducts, categories, regionsData } from './data';
import { ZuriLogo } from './components/ZuriLogo';
import { ProductDetail } from './components/ProductDetail';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { OrderTracker } from './components/OrderTracker';
import { AIAssistant } from './components/AIAssistant';

// Helper for Category Icons
const CategoryIcon = ({ iconName, className = "h-5 w-5" }: { iconName: string, className?: string }) => {
  switch (iconName) {
    case 'Smartphone': return <Smartphone className={className} />;
    case 'Tv': return <Tv className={className} />;
    case 'Shirt': return <Shirt className={className} />;
    case 'Sparkles': return <Sparkles className={className} />;
    case 'ShoppingBag': return <ShoppingBag className={className} />;
    case 'Home': return <Home className={className} />;
    default: return <ShoppingBag className={className} />;
  }
};

export default function App() {
  const [country, setCountry] = useState<Country>('Kenya');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'catalog' | 'orders'>('catalog');
  const [pastOrders, setPastOrders] = useState<Order[]>([]);

  // Checkout Coupon Codes
  const [checkoutCouponCode, setCheckoutCouponCode] = useState('');
  const [checkoutDiscountPercent, setCheckoutDiscountPercent] = useState(0);

  // Active Carousel index
  const [carouselIndex, setCarouselIndex] = useState(0);

  // Simulated Flash Sale Countdown timer (3 hours)
  const [timerSeconds, setTimerSeconds] = useState(10800);

  const regionInfo = regionsData[country];
  const currencySymbol = regionInfo.symbol;

  // Load orders from storage on load
  useEffect(() => {
    const saved = localStorage.getItem('zuri_orders');
    if (saved) {
      setPastOrders(JSON.parse(saved));
    }

    const savedCart = localStorage.getItem('zuri_cart');
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  }, []);

  // Sync cart with localStorage
  const saveCartToStorage = (updatedCart: CartItem[]) => {
    setCart(updatedCart);
    localStorage.setItem('zuri_cart', JSON.stringify(updatedCart));
  };

  // Carousel timer loop
  useEffect(() => {
    const interval = setInterval(() => {
      setCarouselIndex((prev) => (prev === 2 ? 0 : prev + 1));
    }, 4500);
    return () => clearInterval(interval);
  }, []);

  // Flash sales countdown loop
  useEffect(() => {
    const countdown = setInterval(() => {
      setTimerSeconds((prev) => (prev <= 1 ? 10800 : prev - 1));
    }, 1000);
    return () => clearInterval(countdown);
  }, []);

  const formatTimer = (totSeconds: number) => {
    const hrs = Math.floor(totSeconds / 3600);
    const mins = Math.floor((totSeconds % 3600) / 60);
    const secs = totSeconds % 60;
    return `${hrs.toString().padStart(2, '0')}h : ${mins.toString().padStart(2, '0')}m : ${secs.toString().padStart(2, '0')}s`;
  };

  // Cart operations
  const handleAddToCart = (product: Product, quantity: number) => {
    const existingIndex = cart.findIndex((item) => item.product.id === product.id);
    let updatedCart = [...cart];

    if (existingIndex > -1) {
      updatedCart[existingIndex].quantity += quantity;
    } else {
      updatedCart.push({ product, quantity });
    }
    saveCartToStorage(updatedCart);
  };

  const handleUpdateQuantity = (productId: string, newQty: number) => {
    if (newQty < 1) {
      handleRemoveItem(productId);
      return;
    }
    let updatedCart = cart.map((item) => {
      if (item.product.id === productId) {
        return { ...item, quantity: newQty };
      }
      return item;
    });
    saveCartToStorage(updatedCart);
  };

  const handleRemoveItem = (productId: string) => {
    const updatedCart = cart.filter((item) => item.product.id !== productId);
    saveCartToStorage(updatedCart);
  };

  const handleClearCart = () => {
    saveCartToStorage([]);
  };

  const handleOpenCheckout = (couponCode: string, discountPercent: number) => {
    setCheckoutCouponCode(couponCode);
    setCheckoutDiscountPercent(discountPercent);
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  const handleOrderCompleted = (newOrder: Order) => {
    setPastOrders((prev) => [newOrder, ...prev]);
  };

  const handleAddProductById = (id: string) => {
    const targetProduct = allProducts.find(p => p.id === id);
    if (targetProduct) {
      handleAddToCart(targetProduct, 1);
      alert(`Zuri: Added ${targetProduct.brand} Smartphone to your cart! 🛍️`);
    }
  };

  // Promo Banners
  const carouselBanners = [
    {
      title: "EXCLUSIVE MEGA FLASH DEALS",
      sub: country === 'Kenya' ? "Up to 30% Off Infinix, Tecno & custom Smart TVs!" : "Up to 30% Off Phones & UG Street Rolex Kit specials!",
      color: "bg-slate-950 border border-orange-500/40",
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&auto=format&fit=crop&q=80"
    },
    {
      title: "ZURI SHOPPERS EXPRESS SHIPPING",
      sub: "Doorstep transport within 24 Hours inside Nairobi, Thika, Kampala & Entebbe!",
      color: "bg-slate-900",
      image: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800&auto=format&fit=crop&q=80"
    },
    {
      title: country === 'Kenya' ? "KENYAN MAASAI CULTURAL WEEK" : "UGANDA ANNIVERSARY HARVEST SALES",
      sub: country === 'Kenya' ? "Authentic hand-made Maasai Shuka Blankets & organic skin Shea Butter!" : "Handcrafted Suede Safari Boots & fresh coffee products!",
      color: "bg-neutral-900 border border-amber-900/30",
      image: "https://images.unsplash.com/photo-1542831371-29b0f74f9713?w=800&auto=format&fit=crop&q=80"
    }
  ];

  // Filter Catalog Products
  const filteredProducts = allProducts.filter((p) => {
    const matchesCategory = selectedCategory ? p.category === selectedCategory : true;
    const matchesSearch = searchQuery
      ? p.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
        p.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description.toLowerCase().includes(searchQuery.toLowerCase())
      : true;
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="bg-[#F1F1F2] min-h-screen font-sans flex flex-col text-slate-800">
      
      {/* 1. TOP UTILITY STRIP */}
      <div className="bg-slate-950 text-white py-1.5 px-4 text-xs font-semibold flex flex-col sm:flex-row items-center justify-between border-b border-orange-500/20 gap-1 select-none">
        <span className="flex items-center gap-1.5 text-slate-300">
          <span className="inline-block h-2 w-2 rounded-full bg-orange-500 animate-pulse"></span>
          <span>East African Commerce Hub: Kenya 🇰🇪 & Uganda 🇺🇬 • Style like Jumia</span>
        </span>
        <div className="flex items-center gap-4 text-slate-300">
          <span className="hover:text-orange-300 transition-colors cursor-pointer flex items-center gap-1">
            Support: {country === 'Kenya' ? '+254 700 123456' : '+256 700 654321'}
          </span>
          <span className="text-slate-650">|</span>
          <button 
            onClick={() => { setActiveTab('orders'); setSelectedCategory(null); }}
            className={`hover:text-orange-300 transition-colors uppercase tracking-wider text-[10px] font-black ${activeTab === 'orders' ? 'text-orange-300 border-b border-orange-500' : ''}`}
          >
            Track My Package 📦
          </button>
        </div>
      </div>

      {/* 2. HEADER INTERACTIVE BAR */}
      <header className="bg-slate-900 text-white sticky top-0 z-30 shadow-md border-b border-slate-950/50 py-3.5 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-4 justify-between">
          
          {/* Logo element matches image */}
          <div 
            onClick={() => { setActiveTab('catalog'); setSelectedCategory(null); setSearchQuery(''); }}
            className="cursor-pointer hover:opacity-90 flex items-center gap-1.5 select-none"
          >
            <ZuriLogo size="sm" />
            <div className="hidden sm:block">
              <span className="text-xs font-mono tracking-widest text-orange-500 uppercase block leading-none">Shoppers</span>
              <span className="text-[10px] text-slate-400 block mt-0.5 font-bold leading-none">Kenya & Uganda</span>
            </div>
          </div>

          {/* Interactive Search Bar input */}
          <div className="w-full md:flex-1 max-w-xl relative">
            <div className="relative flex items-center">
              <input
                type="text"
                placeholder="Search products, brands, groceries..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 text-slate-100 placeholder:text-slate-500 rounded-xl pl-10 pr-24 py-2.5 text-xs outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500/40"
              />
              <Search className="absolute left-3.5 text-slate-400 h-4.5 w-4.5" />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery('')}
                  className="absolute right-20 text-[10px] text-slate-400 hover:text-white px-1.5 py-0.5 rounded cursor-pointer"
                >
                  Clear
                </button>
              )}
              <span className="absolute right-2.5 bg-orange-500 text-white text-[10px] font-black tracking-wider uppercase px-2.5 py-1 rounded-lg">
                Search
              </span>
            </div>
          </div>

          {/* Multi-Country Currency Selector */}
          <div className="flex items-center gap-4.5">
            <div className="flex items-center gap-2">
              <span className="text-[11px] text-slate-400 uppercase font-black tracking-wider hidden lg:inline">Active Market:</span>
              <div className="relative inline-block border border-slate-800 rounded-xl overflow-hidden bg-slate-950 px-2.5 py-1.5 cursor-pointer">
                <select
                  value={country}
                  onChange={(e) => setCountry(e.target.value as Country)}
                  className="bg-transparent text-xs text-white font-bold pr-6 outline-none cursor-pointer appearance-none"
                >
                  <option value="Kenya" className="bg-slate-950 text-white">🇰🇪 Kenya (KES)</option>
                  <option value="Uganda" className="bg-slate-950 text-white">🇺🇬 Uganda (UGX)</option>
                </select>
                <ChevronRight size={14} className="absolute right-2 top-1/2 -translate-y-1/2 rotate-90 text-orange-500 pointer-events-none" />
              </div>
            </div>

            {/* Profile Dropdown Simulation */}
            <div className="relative group cursor-pointer hidden sm:flex items-center gap-1 bg-slate-950 border border-slate-800 px-3 py-1.5 rounded-xl hover:border-slate-700">
              <User size={16} className="text-orange-500" />
              <div className="text-left select-none">
                <span className="text-[10px] text-slate-400 block leading-none">Jambo,</span>
                <span className="text-[11px] font-black text-slate-100 block mt-0.5 leading-none">Judith Oyoo</span>
              </div>
            </div>

            {/* Shopping Cart Button */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="bg-orange-500 hover:bg-orange-600 text-white font-black px-4 py-2 rounded-xl flex items-center gap-2 transition-all active:scale-95 text-xs shadow-md cursor-pointer"
              style={{ boxShadow: '0 4px 10px rgba(249, 115, 22, 0.3)' }}
              id="header-shopping-cart-toggle"
            >
              <ShoppingCart size={16} className="text-slate-950" />
              <span className="hidden sm:inline text-slate-950">Cart</span>
              <span className="bg-slate-950 text-white text-[10px] font-bold h-5 w-5 rounded-full flex items-center justify-center">
                {cart.reduce((count, item) => count + item.quantity, 0)}
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* 3. MAIN APP LAYOUT WINDOW */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 space-y-6">
        
        {/* VIEW: ORDER HISTORIC TRACKER */}
        {activeTab === 'orders' ? (
          <OrderTracker 
            country={country}
            currencySymbol={currencySymbol}
            onBack={() => setActiveTab('catalog')}
            orders={pastOrders}
          />
        ) : (
          /* VIEW: STOREFRONT CATALOG (DEFAULT) */
          <>
            {/* HERO SECTION CONTAINER */}
            <section className="flex flex-col lg:flex-row gap-5">
              
              {/* Left Column: Category Sidebar on Desktop */}
              <div className="hidden lg:block lg:w-1/4 bg-white rounded-2xl p-4 shadow-sm border border-slate-100 self-start">
                <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4 border-b border-slate-100 pb-2">
                  Browse Store Categories
                </h3>
                <nav className="space-y-1">
                  <button
                    onClick={() => setSelectedCategory(null)}
                    className={`w-full text-left font-bold text-xs px-3 py-2.5 rounded-xl transition-colors flex items-center justify-between cursor-pointer ${
                      selectedCategory === null 
                        ? 'bg-slate-900 text-orange-300' 
                        : 'text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <ShoppingBag className="h-4.5 w-4.5" />
                      <span>All Products Catalog</span>
                    </div>
                    <ChevronRight size={14} className={selectedCategory === null ? 'text-orange-300' : 'text-slate-400'} />
                  </button>

                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedCategory(cat.id)}
                      className={`w-full text-left font-semibold text-xs px-3 py-2.5 rounded-xl transition-colors flex items-center justify-between cursor-pointer ${
                        selectedCategory === cat.id 
                          ? 'bg-slate-900 text-orange-300' 
                          : 'text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <CategoryIcon iconName={cat.iconName} className="h-4.5 w-4.5 text-orange-500" />
                        <span>{cat.name}</span>
                      </div>
                      <ChevronRight size={14} className={selectedCategory === cat.id ? 'text-orange-300' : 'text-slate-400'} />
                    </button>
                  ))}
                </nav>
              </div>

              {/* Center Column: Beautiful Billboard Carousel slider */}
              <div className="flex-1 overflow-hidden rounded-2xl shadow-sm border border-slate-200 relative min-h-[220px] sm:min-h-[300px] flex">
                {/* Active slider view background */}
                <div className="absolute inset-0 z-0">
                  <img 
                    src={carouselBanners[carouselIndex].image} 
                    alt="Promo" 
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover brightness-40" 
                  />
                </div>

                {/* Left floating promo summary info text */}
                <div className="relative z-10 p-6 sm:p-10 flex flex-col justify-between max-w-lg text-white">
                  <div>
                    <span className="bg-orange-500 text-white text-[10px] font-black tracking-widest uppercase px-3 py-1 rounded-full inline-block mb-3.5">
                      Zuri Anniversary Specials
                    </span>
                    <h2 className="text-xl sm:text-3xl font-black font-sans leading-tight text-white mb-2 tracking-tight">
                      {carouselBanners[carouselIndex].title}
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-300 leading-normal">
                      {carouselBanners[carouselIndex].sub}
                    </p>
                  </div>

                  {/* Coupon codes trigger tag */}
                  <div className="mt-4 sm:mt-0 flex flex-wrap items-center gap-3">
                    <span className="text-[11px] text-slate-400">Coupon Code:</span>
                    <strong className="bg-white/10 text-orange-300 border border-orange-500/40 rounded-xl px-3 py-1 font-mono text-xs font-bold leading-normal">
                      WELCOME25
                    </strong>
                    <button 
                      onClick={() => {
                        const supermarketProduct = allProducts.find(p => p.category === 'supermarket');
                        if (supermarketProduct) setSelectedProduct(supermarketProduct);
                      }}
                      className="bg-white hover:bg-slate-100 text-slate-950 font-black px-4 py-2 text-xs rounded-xl flex items-center gap-1 shadow cursor-pointer ml-auto"
                    >
                      <span>Shop Now</span>
                      <ArrowRight size={13} />
                    </button>
                  </div>
                </div>

                {/* Dot slider indicators */}
                <div className="absolute bottom-4 right-4 flex gap-1.5 z-10">
                  {carouselBanners.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCarouselIndex(idx)}
                      className={`h-2 rounded-full cursor-pointer transition-all ${carouselIndex === idx ? 'w-6 bg-orange-500' : 'w-2 bg-white/40'}`}
                    />
                  ))}
                </div>
              </div>

              {/* Right Column: Jumia-style quick utility ads */}
              <div className="w-full lg:w-1/4 flex flex-col justify-between gap-4">
                <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-105 flex items-center gap-3">
                  <div className="bg-orange-500/10 text-orange-500 p-3 rounded-xl">
                    <RefreshCw className="animate-spin h-5 w-5" style={{ animationDuration: '6s' }} />
                  </div>
                  <div>
                    <h4 className="text-xs font-black uppercase text-slate-900 leading-tight">Zuri returns policy</h4>
                    <span className="text-[10px] text-slate-400 block mt-0.5">Easy refunds within 7 calendar days</span>
                  </div>
                </div>

                <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-105 flex items-center gap-3">
                  <div className="bg-green-500/10 text-green-600 p-3 rounded-xl">
                    <MapPin className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-black uppercase text-slate-900 leading-tight">Country logistics network</h4>
                    <span className="text-[10px] text-slate-400 block mt-0.5">Coverage in Mombasa, Eldoret, Kampala, Jinja</span>
                  </div>
                </div>

                {/* Custom Promo mini-card */}
                <div className="bg-slate-900 text-white rounded-2xl p-4 border border-orange-500/30 relative overflow-hidden flex-1 min-h-[90px] flex flex-col justify-center">
                  <div className="absolute top-0 right-0 h-24 w-24 bg-orange-500/10 rounded-full blur-xl border border-none"></div>
                  <span className="text-orange-300 text-[9px] font-black tracking-widest uppercase">Promo Coupon</span>
                  <p className="text-xs font-bold mt-1 leading-tight text-white">Save 10% on your entire basket today!</p>
                  <p className="font-mono text-xs font-black text-orange-500 mt-1.5">CODE: ZURI10</p>
                </div>
              </div>
            </section>

            {/* Categories horizontal swiper for Mobile */}
            <section className="lg:hidden">
              <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2.5">
                Quick Category Filter
              </h3>
              <div className="overflow-x-auto whitespace-nowrap flex gap-2 pb-2 scrollbar-none">
                <button
                  onClick={() => setSelectedCategory(null)}
                  className={`inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-full text-xs font-bold cursor-pointer transition-colors ${
                    selectedCategory === null ? 'bg-slate-900 text-orange-300' : 'bg-white text-slate-600 border border-slate-150'
                  }`}
                >
                  <span>All Catalog</span>
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-full text-xs font-semibold cursor-pointer transition-colors ${
                      selectedCategory === cat.id ? 'bg-slate-900 text-orange-300 font-bold' : 'bg-white text-slate-600 border border-slate-150'
                    }`}
                  >
                    <CategoryIcon iconName={cat.iconName} className="h-4 w-4 text-orange-500" />
                    <span>{cat.name}</span>
                  </button>
                ))}
              </div>
            </section>

            {/* Circular fast deals indicators bar */}
            <section className="grid grid-cols-4 md:grid-cols-8 gap-3 text-center">
              {[
                { label: "Flash Sales", style: "bg-orange-50 text-orange-500", linkId: "phone-infinix-hot-40i" },
                { label: "Phone Deals", style: "bg-blue-50 text-blue-600", linkId: "phone-tecno-spark-20" },
                { label: "Free Delivery", style: "bg-green-50 text-green-600", linkId: "groceries-maize-pembe" },
                { label: "Supermarket", style: "bg-red-50 text-red-600", linkId: "groceries-ug-rolex-kit" },
                { label: "Suede Boots", style: "bg-purple-50 text-purple-600", linkId: "fashion-safari-boots" },
                { label: "Shea Butter", style: "bg-pink-50 text-pink-600", linkId: "beauty-shea-butter" },
                { label: "Air Fryers", style: "bg-orange-50 text-orange-600", linkId: "appliance-zuri-airfryer" },
                { label: "TV Specials", style: "bg-teal-50 text-teal-600", linkId: "tv-zuri-43-smart" }
              ].map((link, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    const targetProduct = allProducts.find(p => p.id === link.linkId);
                    if (targetProduct) setSelectedProduct(targetProduct);
                  }}
                  className="flex flex-col items-center gap-1 bg-white hover:bg-slate-50 border border-slate-150 rounded-2xl p-3 transition-transform hover:-translate-y-1 cursor-pointer shadow-xs"
                >
                  <div className={`h-11 w-11 rounded-xl flex items-center justify-center font-black ${link.style} text-sm`}>
                    {link.label.charAt(0)}
                  </div>
                  <span className="text-[10px] font-bold text-slate-700 leading-tight block truncate w-full">
                    {link.label}
                  </span>
                </button>
              ))}
            </section>

            {/* GOLDEN FLASH SALES EVENT ROW */}
            <section className="bg-slate-900 border border-orange-500/40 text-white rounded-2xl overflow-hidden shadow-md">
              {/* Event Header bar */}
              <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 px-5 py-3.5 flex flex-col sm:flex-row items-center justify-between border-b border-orange-500/10 gap-3">
                <div className="flex items-center gap-3">
                  <span className="text-orange-500 font-extrabold animate-pulse">⚡</span>
                  <h3 className="font-black text-sm uppercase tracking-widest text-orange-300 p-0 border-none m-0">Zuri Golden Flash Sales</h3>
                  <div className="bg-red-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 shadow-sm font-mono">
                    <Clock size={11} />
                    <span>Time Left: {formatTimer(timerSeconds)}</span>
                  </div>
                </div>
                <span className="text-xs text-slate-400">Items are limited • Only verified stocks shown</span>
              </div>

              {/* Grid of featured discounted products */}
              <div className="p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 bg-[#111827]/70">
                {allProducts.slice(0, 4).map((product, idx) => {
                  const currentPrice = country === 'Kenya' ? product.priceKES : product.priceUGX;
                  const originalPrice = Math.round(currentPrice / (1 - product.discount / 100));

                  return (
                    <div 
                      key={product.id}
                      onClick={() => setSelectedProduct(product)}
                      className="bg-[#181f2b] border border-slate-800 rounded-xl p-3 flex flex-col justify-between hover:border-orange-500/30 transition-all cursor-pointer group relative"
                    >
                      {/* Percent off badge */}
                      <span className="absolute top-2.5 left-2.5 bg-red-600 text-white text-[10px] font-black tracking-wide px-1.5 py-0.5 rounded-md z-1">
                        -{product.discount}% OFF
                      </span>

                      <div>
                        {/* Image area */}
                        <div className="bg-white/5 rounded-lg p-2.5 mb-3 flex items-center justify-center sm:h-36 overflow-hidden">
                          <img 
                            src={product.image} 
                            alt={product.title} 
                            referrerPolicy="no-referrer"
                            className="h-28 object-cover rounded group-hover:scale-105 duration-200" 
                          />
                        </div>

                        {/* Text */}
                        <h4 className="text-xs font-bold line-clamp-1 group-hover:text-orange-300 leading-normal text-slate-100">{product.title}</h4>
                        <div className="flex items-baseline gap-2 mt-1.5">
                          <span className="text-sm font-black font-mono text-orange-500">
                            {currencySymbol} {currentPrice.toLocaleString()}
                          </span>
                          <span className="text-[10px] line-through text-slate-500 font-mono">
                            {currencySymbol} {originalPrice.toLocaleString()}
                          </span>
                        </div>
                      </div>

                      {/* Stock depletion indicator */}
                      <div className="mt-3.5 space-y-1">
                        <div className="flex justify-between text-[9px] text-slate-400 font-bold">
                          <span>{product.stock} items left</span>
                          <span className="text-amber-500">{(idx + 7) * 10}% Claimed</span>
                        </div>
                        <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                          <div 
                            className="bg-gradient-to-r from-orange-500 to-orange-400 h-full rounded-full"
                            style={{ width: `${(idx + 7) * 10}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* PRODUCT CATALOGUE GRID SECTION */}
            <section className="space-y-4">
              
              {/* Catalogue Title & Filter Bar summary */}
              <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                <div>
                  <h3 className="font-extrabold text-lg tracking-tight font-sans text-slate-900 border-none p-0">
                    {selectedCategory 
                      ? categories.find(c => c.id === selectedCategory)?.name 
                      : 'Recommended Catalogue For You'}
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {searchQuery 
                      ? `Found ${filteredProducts.length} items matching "${searchQuery}"` 
                      : 'Explore authentic East African home products'}
                  </p>
                </div>
                <span className="text-xs bg-white text-slate-600 border border-slate-200 font-bold px-3 py-1 rounded-xl">
                  {country} Market
                </span>
              </div>

              {filteredProducts.length === 0 ? (
                /* No Results found panel */
                <div className="bg-white rounded-2xl p-12 text-center border border-slate-150 space-y-3 max-w-md mx-auto">
                  <AlertCircle size={40} className="text-orange-500 mx-auto" />
                  <h4 className="font-bold text-slate-800 text-sm">No exact matches in stock</h4>
                  <p className="text-xs text-slate-500">
                    We could not find items matching your filters or country inventory. You can trigger search clear, or consult our AI Shopper Zuri in the bottom right corner!
                  </p>
                  <button 
                    onClick={() => { setSelectedCategory(null); setSearchQuery(''); }}
                    className="text-xs bg-slate-900 hover:bg-slate-800 text-white font-bold py-2 px-4 rounded-xl cursor-pointer"
                  >
                    Clear Filter Search
                  </button>
                </div>
              ) : (
                /* E-Commerce Product grid list */
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-5">
                  {filteredProducts.map((product) => {
                    const currentPrice = country === 'Kenya' ? product.priceKES : product.priceUGX;
                    const originalPrice = Math.round(currentPrice / (1 - product.discount / 100));

                    return (
                      <div
                        key={product.id}
                        onClick={() => setSelectedProduct(product)}
                        className="bg-white hover:shadow-lg rounded-2xl overflow-hidden border border-slate-200 flex flex-col justify-between p-3.5 transition-all duration-200 cursor-pointer group hover:-translate-y-1"
                        id={`product-card-${product.id}`}
                      >
                        {/* Upper image content */}
                        <div className="relative">
                          {product.discount > 0 && (
                            <span className="absolute top-1 left-1 bg-red-600 text-white text-[9px] font-extrabold px-1.5 py-0.5 rounded-md z-1">
                              -{product.discount}%
                            </span>
                          )}
                          <div className="bg-slate-50 rounded-xl overflow-hidden mb-3.5 aspect-square flex items-center justify-center p-2">
                            <img 
                              src={product.image} 
                              alt={product.title} 
                              referrerPolicy="no-referrer"
                              className="h-32 object-cover rounded group-hover:scale-105 duration-300" 
                            />
                          </div>
                        </div>

                        {/* Title and stats */}
                        <div className="space-y-1.5 flex-1 flex flex-col justify-between">
                          <div>
                            <span className="text-[10px] text-slate-400 block uppercase tracking-wider font-extrabold">Brand: {product.brand}</span>
                            <h4 className="text-xs font-semibold text-slate-800 line-clamp-2 leading-tight group-hover:text-orange-500 transition-colors">
                              {product.title}
                            </h4>
                          </div>

                          <div className="pt-2">
                            {/* Stars rating */}
                            <div className="flex items-center gap-1 mb-1.5">
                              <Star size={11} fill="currentColor" className="text-amber-400" />
                              <span className="text-[10px] font-bold text-slate-500">{product.rating}</span>
                              <span className="text-[9px] text-slate-400">({product.reviewsCount})</span>
                            </div>

                            {/* Prices */}
                            <div className="flex flex-col">
                              <span className="text-sm font-black text-slate-950 font-mono">
                                {currencySymbol} {currentPrice.toLocaleString()}
                              </span>
                              {product.discount > 0 && (
                                <span className="text-[10px] text-slate-400 line-through font-mono">
                                  {currencySymbol} {originalPrice.toLocaleString()}
                                </span>
                              )}
                            </div>

                            {product.isExpress && (
                              <span className="inline-block bg-orange-500/15 text-orange-500 text-[9px] font-black px-1.5 py-0.5 rounded uppercase mt-2.5">
                                ZURI EXPRESS
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </section>
          </>
        )}
      </main>

      {/* 4. FOOTER CREDITS */}
      <footer className="bg-slate-900 text-slate-400 border-t border-slate-950/60 py-10 px-6 mt-12 text-xs">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Logo element is represented first */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <ZuriLogo size="sm" />
              <div>
                <span className="text-xs font-mono tracking-widest text-orange-500 uppercase block leading-none">Shoppers</span>
                <span className="text-[10px] text-white block mt-0.5 leading-none">Kenya & Uganda</span>
              </div>
            </div>
            <p className="text-[11px] leading-relaxed text-slate-400">
              Styled like Jumia but personalized for Zuri Shoppers brand themes. Secure Mobile Money and direct card fulfillment across Nairobi, Thika, Eldoret, Kampala, Jinja, and Entebbe.
            </p>
            <p className="text-[10px] text-orange-500 font-mono leading-none">EST. 2024</p>
          </div>

          <div>
            <h4 className="text-white text-xs font-bold uppercase tracking-wider mb-3">Country Help Center</h4>
            <ul className="space-y-2 text-[11px]">
              <li><button onClick={() => alert('Support line open KES 7AM to 9PM!')} className="hover:text-white transition-colors cursor-pointer text-left">Contact Kenya Customer Support</button></li>
              <li><button onClick={() => alert('Support line open UGX 7AM to 9PM!')} className="hover:text-white transition-colors cursor-pointer text-left">Contact Uganda Customer Support</button></li>
              <li><button onClick={() => alert('Simulated refund policies logged!')} className="hover:text-white transition-colors cursor-pointer text-left">How to return an item</button></li>
              <li><button onClick={() => alert('Deliveries managed via dispatch hubs.')} className="hover:text-white transition-colors cursor-pointer text-left">Delivery timelines & fees</button></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white text-xs font-bold uppercase tracking-wider mb-3">Hot Deal Coupons</h4>
            <ul className="space-y-2 text-[11px]">
              <li><span className="font-semibold text-slate-200 block">WELCOME25</span> Use on any smartphone to receive 25% off</li>
              <li><span className="font-semibold text-slate-200 block">ZURI10</span> Save 10% on groceries, mattresses, and items</li>
            </ul>
          </div>

          <div>
            <h4 className="text-white text-xs font-bold uppercase tracking-wider mb-3">Secure Payments</h4>
            <p className="text-[11px] mb-3 leading-relaxed">
              Accepting Safaricom M-Pesa, MTN Mobile Money, Airtel Money, Visa card, and secure Cash on Delivery.
            </p>
            {/* SVG custom simple logo stripe */}
            <div className="flex gap-2.5 flex-wrap">
              <span className="bg-slate-950 border border-slate-800 text-[9px] text-orange-500 font-black px-2 py-1 rounded">M-PESA / MOMO</span>
              <span className="bg-slate-950 border border-slate-800 text-[9px] text-orange-300 font-black px-2 py-1 rounded">AIRTEL MONEY</span>
              <span className="bg-slate-950 border border-slate-805 text-[9px] text-white font-mono px-2 py-1 rounded">VISA CARD</span>
            </div>
          </div>
        </div>

        <hr className="border-slate-800/60 my-8" />

        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between text-[11px] gap-2">
          <span>&copy; {new Date().getFullYear()} Zuri Shoppers Ltd. Styled like Jumia. All mock rights reserved.</span>
          <div className="flex gap-4">
            <span className="hover:text-white cursor-pointer">Terms & Conditions</span>
            <span>•</span>
            <span className="hover:text-white cursor-pointer">Privacy Policy</span>
          </div>
        </div>
      </footer>

      {/* Floating Interactive AIAssistant */}
      <AIAssistant 
        country={country}
        cart={cart}
        currencySymbol={currencySymbol}
        onAddProductById={handleAddProductById}
      />

      {/* Products details modal */}
      {selectedProduct && (
        <ProductDetail 
          product={selectedProduct}
          country={country}
          currencySymbol={currencySymbol}
          onClose={() => setSelectedProduct(null)}
          onAddToCart={handleAddToCart}
        />
      )}

      {/* Shopping cart slide-out drawer */}
      <CartDrawer 
        isOpen={isCartOpen}
        cart={cart}
        currencySymbol={currencySymbol}
        country={country}
        onClose={() => setIsCartOpen(false)}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onOpenCheckout={handleOpenCheckout}
      />

      {/* Checkout simulator modal */}
      {isCheckoutOpen && (
        <CheckoutModal 
          cart={cart}
          country={country}
          currencySymbol={currencySymbol}
          couponUsed={checkoutCouponCode}
          couponDiscountPercent={checkoutDiscountPercent}
          onClose={() => setIsCheckoutOpen(false)}
          onClearCart={handleClearCart}
          onOrderCompleted={handleOrderCompleted}
        />
      )}
    </div>
  );
}
