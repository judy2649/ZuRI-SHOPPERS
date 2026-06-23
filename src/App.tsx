import { useState, useEffect } from 'react';
import { 
  Smartphone, Tv, Shirt, Sparkles, Home, ShoppingBag, 
  HelpCircle, ChevronRight, Search, ShoppingCart, User, 
  MapPin, Clock, ArrowRight, Star, AlertCircle, RefreshCw,
  MessageCircle, Phone, Mail
} from 'lucide-react';
import { Country, Product, CartItem, Order } from './types';
import { products as allProducts, categories, regionsData } from './data';
import { ZuriLogo } from './components/ZuriLogo';
import { ProductDetail } from './components/ProductDetail';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { OrderTracker } from './components/OrderTracker';
import { AIAssistant } from './components/AIAssistant';
import { AdminPanel } from './components/AdminPanel';

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
  const [activeTab, setActiveTab] = useState<'catalog' | 'orders' | 'admin'>('catalog');
  const [pastOrders, setPastOrders] = useState<Order[]>([]);

  // Products state for Catalog persistence and additions/updates
  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem('zuri_products');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.error("Error reading initial products from storage:", e);
    }
    return allProducts;
  });

  const saveProductsToStorage = (updatedProducts: Product[]) => {
    setProducts(updatedProducts);
    localStorage.setItem('zuri_products', JSON.stringify(updatedProducts));
  };

  const handleAddProduct = (newProd: Product) => {
    const updated = [newProd, ...products];
    saveProductsToStorage(updated);
  };

  const handleUpdateProduct = (updatedProd: Product) => {
    const updated = products.map((p) => p.id === updatedProd.id ? updatedProd : p);
    saveProductsToStorage(updated);
  };

  const handleDeleteProduct = (id: string) => {
    const updated = products.filter((p) => p.id !== id);
    saveProductsToStorage(updated);
  };

  // Sync currently viewed product if it is updated inside products state
  useEffect(() => {
    if (selectedProduct) {
      const match = products.find(p => p.id === selectedProduct.id);
      if (match) {
        setSelectedProduct(match);
      }
    }
  }, [products]);

  // Admin Auth State
  const [adminLoggedIn, setAdminLoggedIn] = useState(false);
  const [adminLoginEmail, setAdminLoginEmail] = useState('');
  const [adminLoginError, setAdminLoginError] = useState('');

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
    try {
      const saved = localStorage.getItem('zuri_orders');
      if (saved) {
        setPastOrders(JSON.parse(saved));
      }
    } catch (e) {
      console.error("Error reading past orders from storage:", e);
    }

    try {
      const savedCart = localStorage.getItem('zuri_cart');
      if (savedCart) {
        setCart(JSON.parse(savedCart));
      }
    } catch (e) {
      console.error("Error reading cart from storage:", e);
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
    const targetProduct = products.find(p => p.id === id);
    if (targetProduct) {
      handleAddToCart(targetProduct, 1);
      alert(`Zuri: Added ${targetProduct.brand} Smartphone to your cart! 🛍️`);
    }
  };

  // Dynamic Promo Banners displaying actual products sold on the website
  const carouselBanners = products.slice(0, 5).map((prod) => {
    const formattedPrice = country === 'Kenya'
      ? `KES ${prod.priceKES.toLocaleString()}`
      : `UGX ${prod.priceUGX.toLocaleString()}`;
    return {
      title: prod.title,
      sub: `${prod.brand} • Limited Stock Offer! Only ${formattedPrice}. Fast Payment on Delivery across East Africa.`,
      color: "bg-slate-950 border border-gold/40",
      image: prod.image,
      product: prod
    };
  });

  // Auto scroll carousel every 5 seconds
  useEffect(() => {
    if (carouselBanners.length <= 1) return;
    const interval = setInterval(() => {
      setCarouselIndex((prev) => (prev + 1) % carouselBanners.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [carouselBanners.length]);

  // Filter Catalog Products
  const filteredProducts = products.filter((p) => {
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
      <div className="bg-slate-950 text-white py-0.5 sm:py-1 px-4 text-[10.5px] font-semibold flex flex-col sm:flex-row items-center justify-between border-b border-gold/20 gap-1 select-none">
        <span className="flex items-center gap-1.5 text-slate-300 font-medium">
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-gold animate-pulse shadow-[0_0_6px_#FACD46]"></span>
          <span>East African Commerce Hub: Kenya 🇰🇪 & Uganda 🇺🇬 • Style like Jumia</span>
        </span>
        <div className="flex items-center gap-3 text-slate-300">
          <button 
            onClick={() => { setActiveTab('admin'); setSelectedCategory(null); setSelectedProduct(null); }}
            className={`hover:text-gold-light transition-colors uppercase tracking-wider text-[9px] font-black cursor-pointer ${activeTab === 'admin' ? 'text-gold-light border-b border-gold' : ''}`}
            id="top-admin-portal-link"
          >
            Admin Panel 🛠️
          </button>
          <span className="text-slate-650 text-[9px]">|</span>
          <div className="flex items-center gap-2.5">
            <a href="https://wa.me/256755220220" target="_blank" rel="noopener noreferrer" className="hover:text-gold-light transition-colors cursor-pointer flex items-center gap-1 md:px-1.5">
              <MessageCircle size={12} className="text-green-500" />
              <span className="hidden md:inline">+256 755 220220</span>
            </a>
            <a href="tel:+256755220220" className="hover:text-gold-light transition-colors cursor-pointer flex items-center gap-1 md:px-1.5">
              <Phone size={11} className="text-blue-400" />
              <span className="hidden md:inline">Call Us</span>
            </a>
            <a href="mailto:zurishoppersug@gmail.com" className="hover:text-gold-light transition-colors cursor-pointer flex items-center gap-1 md:px-1.5">
              <Mail size={11} className="text-orange-400" />
              <span className="hidden md:inline">Email Support</span>
            </a>
          </div>
          <span className="text-slate-650 text-[9px]">|</span>
          <button 
            onClick={() => { setActiveTab('orders'); setSelectedCategory(null); }}
            className={`hover:text-gold-light transition-colors uppercase tracking-wider text-[9px] font-black cursor-pointer ${activeTab === 'orders' ? 'text-gold-light border-b border-gold' : ''}`}
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
              <span className="text-xs font-mono tracking-widest text-gold uppercase block leading-none font-bold">Shoppers</span>
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
                className="w-full bg-slate-950 border border-slate-800 text-slate-100 placeholder:text-slate-500 rounded-xl pl-10 pr-24 py-2.5 text-xs outline-none focus:border-gold focus:ring-1 focus:ring-gold/40"
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
              <span className="absolute right-2.5 bg-gold text-slate-950 text-[10px] font-black tracking-wider uppercase px-2.5 py-1 rounded-lg">
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
                <ChevronRight size={14} className="absolute right-2 top-1/2 -translate-y-1/2 rotate-90 text-gold pointer-events-none" />
              </div>
            </div>

            {/* Profile Dropdown Simulation */}
            <div className="relative group cursor-pointer hidden sm:flex items-center gap-1 bg-slate-950 border border-slate-800 px-3 py-1.5 rounded-xl hover:border-slate-700">
              <User size={16} className="text-gold" />
              <div className="text-left select-none">
                <span className="text-[10px] text-slate-400 block leading-none">Jambo,</span>
                <span className="text-[11px] font-black text-slate-100 block mt-0.5 leading-none">Judith Oyoo</span>
              </div>
            </div>

            {/* Shopping Cart Button */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="bg-gold hover:bg-gold-hover text-slate-950 font-black px-4 py-2 rounded-xl flex items-center gap-2 transition-all active:scale-95 text-xs shadow-md cursor-pointer"
              style={{ boxShadow: '0 4px 10px rgba(197, 160, 89, 0.4)' }}
              id="header-shopping-cart-toggle"
            >
              <ShoppingCart size={16} className="text-slate-950 font-bold" />
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
        
        {/* VIEW: ADMIN PANEL */}
        {activeTab === 'admin' ? (
          adminLoggedIn ? (
            <AdminPanel 
              products={products}
              onAddProduct={handleAddProduct}
              onUpdateProduct={handleUpdateProduct}
              onDeleteProduct={handleDeleteProduct}
              onBack={() => setActiveTab('catalog')}
              categories={categories}
            />
          ) : (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="bg-white rounded-2xl p-8 max-w-sm w-full shadow-md border border-slate-200">
                <div className="text-center mb-6">
                  <div className="bg-gold/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <User size={32} className="text-gold-dark" />
                  </div>
                  <h2 className="text-xl font-black text-slate-800">Admin Login</h2>
                  <p className="text-xs text-slate-500 mt-1.5">Enter authorized email to unlock</p>
                </div>
                <form 
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (adminLoginEmail.trim() === 'zurishoppersug@gmail.com') {
                      setAdminLoggedIn(true);
                      setAdminLoginError('');
                      setAdminLoginEmail('');
                    } else {
                      setAdminLoginError('Unauthorized access.');
                    }
                  }}
                  className="space-y-4"
                >
                  <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1.5 block">Admin Email Address</label>
                    <div className="relative">
                      <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input 
                        type="email" 
                        value={adminLoginEmail}
                        onChange={(e) => setAdminLoginEmail(e.target.value)}
                        placeholder="admin@zurishoppers.com" 
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-sm outline-none focus:border-gold focus:ring-1 focus:ring-gold/40"
                        required
                      />
                    </div>
                    {adminLoginError && <p className="text-red-500 text-[10px] mt-1.5 font-bold animate-pulse">{adminLoginError}</p>}
                  </div>
                  <button type="submit" className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-3 rounded-xl transition-colors text-sm shadow-sm">
                    Access Dashboard
                  </button>
                  <button 
                    type="button" 
                    onClick={() => setActiveTab('catalog')}
                    className="w-full text-slate-500 hover:text-slate-800 text-xs font-bold transition-colors"
                  >
                    Return to Store
                  </button>
                </form>
              </div>
            </div>
          )
        ) : activeTab === 'orders' ? (
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
                        ? 'bg-slate-900 text-gold' 
                        : 'text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <ShoppingBag className="h-4.5 w-4.5" />
                      <span>All Products Catalog</span>
                    </div>
                    <ChevronRight size={14} className={selectedCategory === null ? 'text-gold' : 'text-slate-400'} />
                  </button>

                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedCategory(cat.id)}
                      className={`w-full text-left font-semibold text-xs px-3 py-2.5 rounded-xl transition-colors flex items-center justify-between cursor-pointer ${
                        selectedCategory === cat.id 
                          ? 'bg-slate-900 text-gold' 
                          : 'text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <CategoryIcon iconName={cat.iconName} className="h-4.5 w-4.5 text-gold" />
                        <span>{cat.name}</span>
                      </div>
                      <ChevronRight size={14} className={selectedCategory === cat.id ? 'text-gold' : 'text-slate-400'} />
                    </button>
                  ))}
                </nav>
              </div>

              {/* Center Column: Beautiful Billboard Carousel slider */}
              <div className="flex-1 overflow-hidden rounded-2xl shadow-sm border border-slate-200 relative min-h-[220px] sm:min-h-[300px] flex">
                {(() => {
                  const currentBanner = carouselBanners[carouselIndex] || (carouselBanners.length > 0 ? carouselBanners[0] : {
                    title: "Zuri Shoppers East African Hub",
                    sub: "Quality items with free payment on delivery in Kenya & Uganda",
                    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&auto=format&fit=crop&q=80",
                    product: null
                  });
                  return (
                    <>
                      {/* Active slider view background */}
                      <div className="absolute inset-0 z-0">
                        <img 
                          src={currentBanner.image} 
                          alt="Promo" 
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover brightness-40 transition-all duration-700" 
                        />
                      </div>

                      {/* Left floating promo summary info text */}
                      <div className="relative z-10 p-6 sm:p-10 flex flex-col justify-between max-w-lg text-white">
                        <div>
                          <span className="bg-gold text-slate-950 text-[10px] font-black tracking-widest uppercase px-3 py-1 rounded-full inline-block mb-3.5">
                            {currentBanner.product?.isBestSeller ? "🔥 Best Seller Deal" : "✨ Featured Item"}
                          </span>
                          <h2 className="text-xl sm:text-2xl font-black font-sans leading-tight text-white mb-2 tracking-tight line-clamp-2">
                            {currentBanner.title}
                          </h2>
                          <p className="text-xs sm:text-sm text-slate-300 leading-normal line-clamp-3">
                            {currentBanner.sub}
                          </p>
                        </div>

                        {/* Coupon codes trigger tag */}
                        <div className="mt-4 sm:mt-0 flex flex-wrap items-center gap-3">
                          <span className="text-[11px] text-slate-400">Coupon Code:</span>
                          <strong className="bg-white/10 text-gold-light border border-gold/40 rounded-xl px-3 py-1 font-mono text-xs font-bold leading-normal">
                            WELCOME25
                          </strong>
                          <button 
                            onClick={() => {
                              if (currentBanner.product) {
                                setSelectedProduct(currentBanner.product);
                              } else {
                                const firstProduct = products[0];
                                if (firstProduct) setSelectedProduct(firstProduct);
                              }
                            }}
                            className="bg-white hover:bg-slate-100 text-slate-950 font-black px-4 py-2 text-xs rounded-xl flex items-center gap-1 shadow cursor-pointer ml-auto"
                          >
                            <span>Shop Now</span>
                            <ArrowRight size={13} />
                          </button>
                        </div>
                      </div>
                    </>
                  );
                })()}

                {/* Dot slider indicators */}
                <div className="absolute bottom-4 right-4 flex gap-1.5 z-10">
                  {carouselBanners.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCarouselIndex(idx)}
                      className={`h-2 rounded-full cursor-pointer transition-all ${carouselIndex === idx ? 'w-6 bg-gold' : 'w-2 bg-white/40'}`}
                    />
                  ))}
                </div>
              </div>

              {/* Right Column: Jumia-style quick utility ads */}
              <div className="w-full lg:w-1/4 flex flex-col justify-between gap-4">
                <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 flex items-center gap-3">
                  <div className="bg-gold/10 text-gold p-3 rounded-xl">
                    <RefreshCw className="animate-spin h-5 w-5" style={{ animationDuration: '6s' }} />
                  </div>
                  <div>
                    <h4 className="text-xs font-black uppercase text-slate-900 leading-tight">Zuri returns policy</h4>
                    <span className="text-[10px] text-slate-400 block mt-0.5">Easy refunds within 7 calendar days</span>
                  </div>
                </div>

                <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 flex items-center gap-3">
                  <div className="bg-green-500/10 text-green-600 p-3 rounded-xl">
                    <MapPin className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-black uppercase text-slate-900 leading-tight">Country logistics network</h4>
                    <span className="text-[10px] text-slate-400 block mt-0.5">Coverage in Mombasa, Eldoret, Kampala, Jinja</span>
                  </div>
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
                    selectedCategory === null ? 'bg-slate-900 text-gold' : 'bg-white text-slate-600 border border-slate-150'
                  }`}
                >
                  <span>All Catalog</span>
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-full text-xs font-semibold cursor-pointer transition-colors ${
                      selectedCategory === cat.id ? 'bg-slate-900 text-gold font-bold' : 'bg-white text-slate-600 border border-slate-150'
                    }`}
                  >
                    <CategoryIcon iconName={cat.iconName} className="h-4 w-4 text-gold" />
                    <span>{cat.name}</span>
                  </button>
                ))}
              </div>
            </section>

            {/* Circular fast deals indicators bar */}
            <section className="grid grid-cols-4 md:grid-cols-8 gap-3 text-center">
              {[
                { label: "Flash Sales", style: "bg-gold/10 text-gold", linkId: "phone-infinix-hot-40i" },
                { label: "Phone Deals", style: "bg-blue-50 text-blue-600", linkId: "phone-tecno-spark-20" },
                { label: "Free Delivery", style: "bg-green-50 text-green-600", linkId: "groceries-maize-pembe" },
                { label: "Supermarket", style: "bg-red-50 text-red-600", linkId: "groceries-ug-rolex-kit" },
                { label: "Suede Boots", style: "bg-purple-50 text-purple-600", linkId: "fashion-safari-boots" },
                { label: "Shea Butter", style: "bg-pink-50 text-pink-600", linkId: "beauty-shea-butter" },
                { label: "Air Fryers", style: "bg-gold/15 text-gold-light", linkId: "appliance-zuri-airfryer" },
                { label: "TV Specials", style: "bg-teal-50 text-teal-600", linkId: "tv-zuri-43-smart" }
              ].map((link, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    const targetProduct = products.find(p => p.id === link.linkId);
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
            <section className="bg-slate-900 border border-gold/40 text-white rounded-2xl overflow-hidden shadow-md">
              {/* Event Header bar */}
              <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 px-5 py-3.5 flex flex-col sm:flex-row items-center justify-between border-b border-gold/10 gap-3">
                <div className="flex items-center gap-3">
                  <span className="text-gold font-extrabold animate-pulse">⚡</span>
                  <h3 className="font-black text-sm uppercase tracking-widest text-gold-light p-0 border-none m-0">Zuri Golden Flash Sales</h3>
                  <div className="bg-red-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 shadow-sm font-mono">
                    <Clock size={11} />
                    <span>Time Left: {formatTimer(timerSeconds)}</span>
                  </div>
                </div>
                <span className="text-xs text-slate-400">Items are limited • Only verified stocks shown</span>
              </div>

              {/* Grid of featured discounted products */}
              <div className="p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 bg-[#111827]/70">
                {products.slice(0, 4).map((product, idx) => {
                  const currentPrice = country === 'Kenya' ? product.priceKES : product.priceUGX;
                  const originalPrice = Math.round(currentPrice / (1 - product.discount / 100));

                  return (
                    <div 
                      key={product.id}
                      onClick={() => setSelectedProduct(product)}
                      className="bg-[#181f2b] border border-slate-800 rounded-xl p-3 flex flex-col justify-between hover:border-gold/40 hover:shadow-[0_12px_24px_rgba(197,160,89,0.15)] hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 ease-out cursor-pointer group relative"
                    >
                      {/* Percent off badge */}
                      <span className="absolute top-2.5 left-2.5 bg-red-600 text-white text-[10px] font-black tracking-wide px-1.5 py-0.5 rounded-md z-1">
                        -{product.discount}% OFF
                      </span>

                      <div>
                        {/* Image area */}
                        <div className="bg-white/5 rounded-lg p-2.5 mb-3 flex items-center justify-center sm:h-36 overflow-hidden relative">
                          <img 
                            src={product.image} 
                            alt={product.title} 
                            referrerPolicy="no-referrer"
                            className={`h-28 object-cover rounded group-hover:scale-105 duration-200 transition-all ${product.stock === 0 ? 'grayscale opacity-40' : ''}`} 
                          />
                          {product.stock === 0 && (
                            <div className="absolute inset-0 bg-slate-950/70 backdrop-blur-[1px] flex items-center justify-center rounded-lg">
                              <span className="bg-red-600 text-white text-[9px] font-black tracking-widest uppercase px-2.5 py-1 rounded shadow-md">
                                Sold Out
                              </span>
                            </div>
                          )}
                        </div>

                        {/* Text */}
                        <h4 className="text-xs font-bold line-clamp-1 group-hover:text-gold-light leading-normal text-slate-100">{product.title}</h4>
                        <div className="flex items-baseline gap-2 mt-1.5">
                          <span className="text-sm font-black font-mono text-gold">
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
                          <span className="text-gold">{(idx + 7) * 10}% Claimed</span>
                        </div>
                        <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                          <div 
                            className="bg-gradient-to-r from-gold to-gold-light h-full rounded-full"
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
                  <AlertCircle size={40} className="text-gold mx-auto" />
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
                        className="bg-white hover:shadow-[0_15px_30px_rgba(197,160,89,0.12),0_4px_15px_rgba(0,0,0,0.05)] hover:border-gold/30 rounded-2xl overflow-hidden border border-slate-200 flex flex-col justify-between p-3.5 transition-all duration-300 cursor-pointer group hover:-translate-y-1.5 hover:scale-[1.015] active:scale-[0.985] ease-out relative"
                        id={`product-card-${product.id}`}
                      >
                        {/* Upper image content */}
                        <div className="relative">
                          {product.discount > 0 && (
                            <span className="absolute top-1 left-1 bg-red-600 text-white text-[9px] font-extrabold px-1.5 py-0.5 rounded-md z-1">
                              -{product.discount}%
                            </span>
                          )}
                          <div className="bg-slate-50 rounded-xl overflow-hidden mb-3.5 aspect-square flex items-center justify-center p-2 relative">
                            <img 
                              src={product.image} 
                              alt={product.title} 
                              referrerPolicy="no-referrer"
                              className={`h-32 object-cover rounded group-hover:scale-105 duration-300 transition-all ${product.stock === 0 ? 'grayscale opacity-40' : ''}`} 
                            />
                            {product.stock === 0 && (
                              <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-[1.5px] flex items-center justify-center rounded-xl">
                                <span className="bg-red-600 text-white text-[10px] font-black tracking-widest uppercase px-3 py-1.5 rounded-lg shadow-md">
                                  Out of Stock
                                </span>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Title and stats */}
                        <div className="space-y-1.5 flex-1 flex flex-col justify-between">
                          <div>
                            <span className="text-[10px] text-slate-400 block uppercase tracking-wider font-extrabold">Brand: {product.brand}</span>
                            <h4 className="text-xs font-semibold text-slate-800 line-clamp-2 leading-tight group-hover:text-gold transition-colors">
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
                              <span className="inline-block bg-gold/15 text-gold text-[9px] font-black px-1.5 py-0.5 rounded uppercase mt-2.5">
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
                <span className="text-xs font-mono tracking-widest text-gold uppercase block leading-none font-bold">Shoppers</span>
                <span className="text-[10px] text-white block mt-0.5 leading-none">Kenya & Uganda</span>
              </div>
            </div>
            <p className="text-[11px] leading-relaxed text-slate-400">
              Styled like Jumia but personalized for Zuri Shoppers brand themes. Secure Mobile Money and direct card fulfillment across Nairobi, Thika, Eldoret, Kampala, Jinja, and Entebbe.
            </p>
            <p className="text-[10px] text-gold font-mono leading-none">EST. 2024</p>
          </div>

          <div>
            <h4 className="text-white text-xs font-bold uppercase tracking-wider mb-3">Country Help Center</h4>
            <ul className="space-y-2 text-[11px]">
              <li>
                <a href="https://wa.me/256755220220" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors flex items-center gap-2">
                  <MessageCircle size={12} className="text-green-500" /> Watsapp +256755220220
                </a>
              </li>
              <li>
                <a href="tel:+256755220220" className="hover:text-white transition-colors flex items-center gap-2">
                  <Phone size={12} className="text-blue-400" /> Calls +256755220220
                </a>
              </li>
              <li>
                <a href="mailto:zurishoppersug@gmail.com" className="hover:text-white transition-colors flex items-center gap-2">
                  <Mail size={12} className="text-orange-400" /> zurishoppersug@gmail.com
                </a>
              </li>
              <li><button onClick={() => alert('Simulated refund policies logged!')} className="hover:text-white transition-colors cursor-pointer flex items-center gap-2 text-left">How to return an item</button></li>
              <li><button onClick={() => alert('Deliveries managed via dispatch hubs.')} className="hover:text-white transition-colors cursor-pointer flex items-center gap-2 text-left">Delivery timelines & fees</button></li>
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
              We exclusively accept Cash on Delivery for all your orders. Pay when you receive your package.
            </p>
            {/* SVG custom simple logo stripe */}
            <div className="flex gap-2.5 flex-wrap">
              <span className="bg-slate-950 border border-slate-800 text-[9px] text-gold font-black px-2 py-1 rounded">CASH ON DELIVERY</span>
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

      {/* Floating Contact Buttons */}
      <div className="fixed bottom-6 left-6 z-40 flex flex-col gap-2.5">
        <button 
          onClick={() => { try { window.open('https://wa.me/256755220220', '_blank'); } catch(e) { console.error('Failed to open link'); } }}
          className="bg-green-500 hover:bg-green-600 text-white p-2.5 rounded-full shadow-lg transition-transform duration-300 transform hover:scale-110 flex items-center justify-center cursor-pointer border-none"
          title="WhatsApp Support"
        >
          <MessageCircle size={18} />
        </button>
        <button 
          onClick={() => { try { window.open('https://www.tiktok.com/@zurishoppers', '_blank'); } catch(e) { console.error('Failed to open link'); } }}
          className="bg-black hover:bg-slate-900 border border-slate-800 text-white p-2.5 rounded-full shadow-lg transition-transform duration-300 transform hover:scale-110 flex items-center justify-center cursor-pointer"
          title="TikTok"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
            <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
          </svg>
        </button>
        <button 
          onClick={() => { try { window.open('tel:+256755220220'); } catch(e) { console.error('Failed to open link'); } }}
          className="bg-blue-500 hover:bg-blue-600 text-white p-2.5 rounded-full shadow-lg transition-transform duration-300 transform hover:scale-110 flex items-center justify-center cursor-pointer border-none"
          title="Call Us"
        >
          <Phone size={18} />
        </button>
        <button 
          onClick={() => { try { window.open('mailto:zurishoppersug@gmail.com'); } catch(e) { console.error('Failed to open link'); } }}
          className="bg-orange-500 hover:bg-orange-600 text-white p-2.5 rounded-full shadow-lg transition-transform duration-300 transform hover:scale-110 flex items-center justify-center cursor-pointer border-none"
          title="Email Us"
        >
          <Mail size={18} />
        </button>
      </div>

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
