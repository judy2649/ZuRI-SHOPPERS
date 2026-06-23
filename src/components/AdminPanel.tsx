import { useState, useMemo, FormEvent } from 'react';
import { 
  Plus, Edit, Trash2, Check, ArrowLeft, Search, 
  Package, Tag, Image as ImageIcon, Sparkles, RefreshCw, X
} from 'lucide-react';
import { Product, Category } from '../types';

interface AdminPanelProps {
  products: Product[];
  onAddProduct: (p: Product) => void;
  onUpdateProduct: (p: Product) => void;
  onDeleteProduct: (id: string) => void;
  onBack: () => void;
  categories: Category[];
}

const PRESET_IMAGES = [
  { name: "Smartphone Black", url: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&auto=format&fit=crop&q=80" },
  { name: "Electronics SmartTV", url: "https://images.unsplash.com/photo-1593305841991-05c297ba4575?w=400&auto=format&fit=crop&q=80" },
  { name: "Kitchen Air Fryer", url: "https://images.unsplash.com/photo-1621972750749-0fbb1abb7736?w=400&auto=format&fit=crop&q=80" },
  { name: "Premium Basmati Rice", url: "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&auto=format&fit=crop&q=80" },
  { name: "Organic Skin Lotion", url: "https://images.unsplash.com/photo-1608248597481-496100c80836?w=400&auto=format&fit=crop&q=80" },
  { name: "Gold Leather Shoes", url: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&auto=format&fit=crop&q=80" }
];

export function AdminPanel({
  products,
  onAddProduct,
  onUpdateProduct,
  onDeleteProduct,
  onBack,
  categories
}: AdminPanelProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  
  // Form State
  const [editingId, setEditingId] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [brand, setBrand] = useState('');
  const [description, setDescription] = useState('');
  const [priceKES, setPriceKES] = useState<number>(15000);
  const [priceUGX, setPriceUGX] = useState<number>(450000);
  const [stock, setStock] = useState<number>(10);
  const [category, setCategory] = useState<string>(categories[0]?.id || 'phones-tablets');
  const [discount, setDiscount] = useState<number>(0);
  const [image, setImage] = useState('');
  const [isExpress, setIsExpress] = useState(false);
  const [isBestSeller, setIsBestSeller] = useState(false);

  // Success message alert
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  // Switch to editing mode
  const handleStartEdit = (p: Product) => {
    setEditingId(p.id);
    setTitle(p.title);
    setBrand(p.brand);
    setDescription(p.description);
    setPriceKES(p.priceKES);
    setPriceUGX(p.priceUGX);
    setStock(p.stock);
    setCategory(p.category);
    setDiscount(p.discount);
    setImage(p.image);
    setIsExpress(p.isExpress);
    setIsBestSeller(p.isBestSeller);
    
    // Smooth scroll up to form on small screens
    window.scrollTo({ top: 120, behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    clearForm();
  };

  const clearForm = () => {
    setTitle('');
    setBrand('');
    setDescription('');
    setPriceKES(12000);
    setPriceUGX(360000);
    setStock(10);
    setDiscount(0);
    setImage('');
    setIsExpress(false);
    setIsBestSeller(false);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !brand.trim() || !description.trim()) {
      showToast("❌ Please fill in all required fields!");
      return;
    }

    const finalImage = image.trim() || "https://images.unsplash.com/photo-1542831371-29b0f74f9713?w=500&auto=format&fit=crop&q=80";

    const productData: Product = {
      id: editingId ? editingId : `prod-${Date.now()}`,
      title: title.trim(),
      brand: brand.trim(),
      description: description.trim(),
      priceKES: Number(priceKES) || 0,
      priceUGX: Number(priceUGX) || 0,
      stock: Number(stock) === 0 ? 0 : Number(stock) || 0,
      category,
      discount: Number(discount) || 0,
      image: finalImage,
      isExpress,
      isBestSeller,
      rating: editingId ? (products.find(p => p.id === editingId)?.rating || 4.5) : 4.5,
      reviewsCount: editingId ? (products.find(p => p.id === editingId)?.reviewsCount || 8) : 5
    };

    if (editingId) {
      onUpdateProduct(productData);
      showToast(`✨ Product "${productData.title}" updated successfully!`);
      setEditingId(null);
    } else {
      onAddProduct(productData);
      showToast(`🎉 Product "${productData.title}" added to inventory list!`);
    }

    clearForm();
  };

  // Filter existing inventory list
  const filteredInventory = useMemo(() => {
    return products.filter((p) => {
      const matchesSearch = searchQuery
        ? p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.id.toLowerCase().includes(searchQuery.toLowerCase())
        : true;
      const matchesCategory = selectedCategory !== 'all' ? p.category === selectedCategory : true;
      return matchesSearch && matchesCategory;
    });
  }, [products, searchQuery, selectedCategory]);

  return (
    <div className="bg-slate-900 border border-gold/40 text-white rounded-3xl p-6 shadow-xl space-y-8 max-w-7xl mx-auto" id="zuri-admin-panel">
      
      {/* 1. Header Area with back link */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-slate-800 pb-5 gap-4">
        <div>
          <button 
            onClick={onBack}
            className="flex items-center gap-1.5 text-xs text-gold hover:text-gold-light transition-colors font-bold uppercase tracking-wider cursor-pointer mb-2 inline-flex"
          >
            <ArrowLeft size={14} />
            <span>Return to Boutique</span>
          </button>
          <h2 className="text-xl sm:text-2xl font-black font-sans tracking-tight text-white border-none p-0 flex items-center gap-2.5">
            <Package className="text-gold" size={24} />
            <span>Zuri Administrator Portal</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Maintain catalog items, restock inventory databases, adjust prices, and declare flash discount specs instantly.
          </p>
        </div>

        {/* Floating Indicator */}
        <span className="bg-gold/15 border border-gold/30 text-gold text-[10px] sm:text-xs font-mono font-black py-1.5 px-3 rounded-full uppercase block select-none">
          🛡️ ROOT CONTROL ACTIVE
        </span>
      </div>

      {toastMessage && (
        <div className="bg-slate-950 border border-gold/50 text-gold px-4 py-3 rounded-xl flex items-center justify-between shadow-lg text-xs font-medium animate-bounce">
          <span>{toastMessage}</span>
          <button onClick={() => setToastMessage(null)} className="text-slate-400 hover:text-white">
            <X size={15} />
          </button>
        </div>
      )}

      {/* 2. Grid split layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Form panel column */}
        <div className="lg:col-span-5 bg-slate-950 border border-slate-800 p-5 rounded-2xl space-y-5">
          <div className="border-b border-slate-800 pb-3 flex items-center justify-between">
            <h3 className="text-sm font-black text-gold uppercase tracking-widest flex items-center gap-2">
              <Sparkles size={16} />
              <span>{editingId ? 'Edit Product Parameters' : 'Register New Item'}</span>
            </h3>
            {editingId && (
              <button 
                onClick={handleCancelEdit}
                className="text-[10px] bg-slate-800 hover:bg-slate-700 hover:text-white text-slate-300 px-2 py-1 rounded font-bold uppercase tracking-wider"
              >
                Cancel Edit
              </button>
            )}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Title / Brand */}
            <div className="grid grid-cols-2 gap-3.5">
              <div>
                <label className="text-[10px] text-slate-400 font-black uppercase block mb-1">Product Title *</label>
                <input 
                  type="text"
                  required
                  placeholder="e.g. Galaxy S24 Ultra"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:border-gold outline-none"
                />
              </div>
              <div>
                <label className="text-[10px] text-slate-400 font-black uppercase block mb-1">Brand Name *</label>
                <input 
                  type="text"
                  required
                  placeholder="e.g. Samsung"
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:border-gold outline-none"
                />
              </div>
            </div>

            {/* Description Textarea */}
            <div>
              <label className="text-[10px] text-slate-400 font-black uppercase block mb-1">Product Description *</label>
              <textarea 
                required
                rows={3}
                placeholder="Declare specifications, parameters, features, delivery package specs..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:border-gold outline-none resize-none"
              />
            </div>

            {/* Category selection */}
            <div>
              <label className="text-[10px] text-slate-400 font-black uppercase block mb-1">Catalog Category</label>
              <select 
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:border-gold outline-none"
              >
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id} className="bg-slate-900 text-white">
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Price values inputs */}
            <div className="grid grid-cols-2 gap-3.5">
              <div>
                <label className="text-[10px] text-slate-400 font-black uppercase block mb-1 flex items-center justify-between">
                  <span>Price KES *</span>
                  <span className="text-gold font-mono">Kenya Shillings</span>
                </label>
                <input 
                  type="number"
                  required
                  min={0}
                  placeholder="e.g. 15000"
                  value={priceKES}
                  onChange={(e) => setPriceKES(Math.max(0, parseInt(e.target.value) || 0))}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:border-gold outline-none font-mono"
                />
              </div>
              <div>
                <label className="text-[10px] text-slate-400 font-black uppercase block mb-1 flex items-center justify-between">
                  <span>Price UGX *</span>
                  <span className="text-gold-light font-mono">Uganda Shillings</span>
                </label>
                <input 
                  type="number"
                  required
                  min={0}
                  placeholder="e.g. 450000"
                  value={priceUGX}
                  onChange={(e) => setPriceUGX(Math.max(0, parseInt(e.target.value) || 0))}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:border-gold outline-none font-mono"
                />
              </div>
            </div>

            {/* Stock Quantity / Discount */}
            <div className="grid grid-cols-2 gap-3.5">
              <div>
                <label className="text-[10px] text-slate-400 font-black uppercase block mb-1">Stock Balance *</label>
                <input 
                  type="number"
                  required
                  min={0}
                  placeholder="e.g. 12"
                  value={stock}
                  onChange={(e) => setStock(Math.max(0, parseInt(e.target.value) || 0))}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:border-gold outline-none font-mono"
                />
              </div>
              <div>
                <label className="text-[10px] text-slate-400 font-black uppercase block mb-1">Promo Discount %</label>
                <input 
                  type="number"
                  min={0}
                  max={95}
                  placeholder="e.g. 15 for 15% off"
                  value={discount}
                  onChange={(e) => setDiscount(Math.min(95, Math.max(0, parseInt(e.target.value) || 0)))}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:border-gold outline-none font-mono"
                />
              </div>
            </div>

            {/* Image URL with preset picker */}
            <div>
              <label className="text-[10px] text-slate-400 font-black uppercase block mb-1">Cover Image</label>
              <div className="flex gap-2">
                <input 
                  type="text"
                  placeholder="https://... or upload local image"
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:border-gold outline-none"
                />
                <label className="bg-slate-800 hover:bg-slate-700 text-slate-200 px-3 py-2 rounded-xl flex items-center justify-center cursor-pointer transition-colors border border-slate-700">
                  <input 
                    type="file" 
                    accept="image/*" 
                    className="hidden" 
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onloadend = () => {
                          if (typeof reader.result === 'string') {
                            setImage(reader.result);
                          }
                        };
                        reader.readAsDataURL(file);
                      }
                    }} 
                  />
                  <ImageIcon size={14} className="mr-1.5" />
                  <span className="text-[10px] font-bold">Upload</span>
                </label>
              </div>
              
              {/* Quick Preset Selector */}
              <div className="mt-2 text-left">
                <span className="text-[9px] text-slate-500 font-black uppercase tracking-wider block mb-1.5">Or choose high-res preset stock:</span>
                <div className="grid grid-cols-3 gap-1 px-0.5">
                  {PRESET_IMAGES.map((img, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setImage(img.url)}
                      className={`text-[9px] border px-1.5 py-1 rounded truncate transition-colors text-left ${image === img.url ? 'border-gold text-gold bg-gold/5' : 'border-slate-800 text-slate-400 hover:border-slate-700'}`}
                      title={img.name}
                    >
                      {img.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Logistics Status Controls */}
            <div className="grid grid-cols-2 gap-4 bg-slate-900/60 p-3 rounded-xl border border-slate-800/80 mt-1">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input 
                  type="checkbox"
                  checked={isExpress}
                  onChange={(e) => setIsExpress(e.target.checked)}
                  className="rounded bg-slate-950 border-slate-800 text-gold focus:ring-0 cursor-pointer h-3.5 w-3.5"
                />
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-300">Zuri Express Delivery</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input 
                  type="checkbox"
                  checked={isBestSeller}
                  onChange={(e) => setIsBestSeller(e.target.checked)}
                  className="rounded bg-slate-950 border-slate-800 text-gold focus:ring-0 cursor-pointer h-3.5 w-3.5"
                />
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-300">Featured Bestseller</span>
              </label>
            </div>

            {/* Action Buttons */}
            <button
              type="submit"
              className="w-full bg-gold hover:bg-gold-hover text-slate-950 font-black py-2.5 rounded-xl text-xs uppercase tracking-wide transition-all active:scale-[0.98] shadow-md flex items-center justify-center gap-2 cursor-pointer border-none mt-2"
              style={{ boxShadow: '0 4px 12px rgba(197, 160, 89, 0.2)' }}
            >
              {editingId ? <Check size={14} /> : <Plus size={14} />}
              <span>{editingId ? 'Save & Update Item parameters' : 'Register Item into Database'}</span>
            </button>
          </form>
        </div>

        {/* Catalog Table column */}
        <div className="lg:col-span-7 space-y-4">
          
          {/* List Toolbar Controls */}
          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 flex flex-col md:flex-row items-center gap-3.5 justify-between">
            <div className="relative w-full md:max-w-xs">
              <input 
                type="text"
                placeholder="Lookup in inventory..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder:text-slate-500 focus:border-gold outline-none"
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 h-3.5 w-3.5" />
            </div>

            <div className="flex items-center gap-2 w-full md:w-auto">
              <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider hidden sm:inline whitespace-nowrap">Filter category:</span>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="flex-1 sm:flex-initial bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:border-gold outline-none"
              >
                <option value="all">Show All Categories</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Table list containers */}
          <div className="bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden shadow-sm">
            <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 bg-slate-900/40 border-b border-slate-800 px-4 py-3">
              ACTIVE PRODUCT REGISTRY ({filteredInventory.length} Items Listed)
            </h4>

            {filteredInventory.length === 0 ? (
              <div className="p-12 text-center text-slate-500 space-y-1">
                <Package className="mx-auto text-slate-650 h-8 w-8 mb-2" />
                <p className="text-xs font-bold">No registered products match query</p>
                <p className="text-[10px]">Filter another category or register new stock.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-300 divide-y divide-slate-850">
                  <thead className="bg-slate-900/30 text-slate-400 text-[10px] font-black uppercase tracking-wider">
                    <tr>
                      <th className="px-4 py-3 text-center w-12">Thumbnail</th>
                      <th className="px-4 py-3">Product Overview</th>
                      <th className="px-4 py-3 text-right">Price (Kenya KES)</th>
                      <th className="px-4 py-3 text-right">Price (Uganda UGX)</th>
                      <th className="px-3 py-3 text-center">In Stock</th>
                      <th className="px-4 py-3 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 bg-slate-950">
                    {filteredInventory.map((product) => (
                      <tr 
                        key={product.id} 
                        className={`hover:bg-slate-900/30 transition-colors ${editingId === product.id ? 'bg-gold/5' : ''}`}
                      >
                        {/* Thumbnail image area */}
                        <td className="px-4 py-3 text-center whitespace-nowrap">
                          <div className="bg-white/5 inline-flex h-11 w-11 rounded-lg overflow-hidden items-center justify-center p-1 border border-slate-800">
                            <img 
                              src={product.image} 
                              alt={product.title} 
                              className="h-full w-full object-cover rounded" 
                              referrerPolicy="no-referrer"
                            />
                          </div>
                        </td>

                        {/* Title, Brand & Tags */}
                        <td className="px-4 py-3 max-w-[200px]">
                          <div className="font-bold text-white truncate text-xs" title={product.title}>{product.title}</div>
                          <div className="text-[10px] text-slate-400 mt-0.5 font-semibold">
                            ID: <span className="font-mono text-slate-500">{product.id}</span> • {product.brand}
                          </div>
                          
                          {/* Badges container */}
                          <div className="flex gap-1 flex-wrap mt-1">
                            <span className="bg-slate-900 text-slate-400 text-[8px] font-bold px-1.5 py-0.5 rounded tracking-wide uppercase">
                              {categories.find(c => c.id === product.category)?.name || product.category}
                            </span>
                            {product.isExpress && (
                              <span className="bg-gold/15 text-gold text-[8px] font-black px-1.5 py-0.5 rounded tracking-wide uppercase">
                                Express
                              </span>
                            )}
                            {product.isBestSeller && (
                              <span className="bg-blue-950 text-blue-400 text-[8px] font-bold px-1.5 py-0.5 rounded tracking-wide uppercase">
                                Hot
                              </span>
                            )}
                            {product.discount > 0 && (
                              <span className="bg-red-950 text-red-400 text-[8px] font-black px-1.5 py-0.5 rounded tracking-wide">
                                -{product.discount}%
                              </span>
                            )}
                          </div>
                        </td>

                        {/* KES Price columns */}
                        <td className="px-4 py-3 text-right font-mono font-black text-white whitespace-nowrap">
                          {product.discount > 0 ? (
                            <div>
                              <div className="text-[11px]">
                                KES {Math.round(product.priceKES * (1 - product.discount / 100)).toLocaleString()}
                              </div>
                              <div className="text-[9px] text-slate-500 line-through">
                                KES {product.priceKES.toLocaleString()}
                              </div>
                            </div>
                          ) : (
                            <span>KES {product.priceKES.toLocaleString()}</span>
                          )}
                        </td>

                        {/* UGX Price columns */}
                        <td className="px-4 py-3 text-right font-mono font-black text-white whitespace-nowrap">
                          {product.discount > 0 ? (
                            <div>
                              <div className="text-[11px]">
                                UGX {Math.round(product.priceUGX * (1 - product.discount / 100)).toLocaleString()}
                              </div>
                              <div className="text-[9px] text-slate-500 line-through">
                                UGX {product.priceUGX.toLocaleString()}
                              </div>
                            </div>
                          ) : (
                            <span>UGX {product.priceUGX.toLocaleString()}</span>
                          )}
                        </td>

                        {/* Stock Balance display with color coding */}
                        <td className="px-3 py-3 text-center whitespace-nowrap">
                          {product.stock === 0 ? (
                            <span className="bg-red-950/80 border border-red-900/30 text-red-400 text-[9px] font-black px-2 py-0.5 rounded-full uppercase inline-block">
                              Sold Out
                            </span>
                          ) : product.stock <= 5 ? (
                            <span className="bg-amber-950 text-amber-500 text-[9px] font-black px-2 py-0.5 rounded-full inline-block font-mono">
                              LOW: {product.stock}
                            </span>
                          ) : (
                            <span className="bg-green-950 text-green-400 text-[9px] font-black px-2 py-0.5 rounded-full inline-block font-mono">
                              Qty: {product.stock}
                            </span>
                          )}
                        </td>

                        {/* Actions buttons */}
                        <td className="px-4 py-3 text-center whitespace-nowrap">
                          <div className="inline-flex items-center gap-1.5">
                            <button
                              onClick={() => handleStartEdit(product)}
                              className="bg-slate-900 hover:bg-slate-800 hover:text-gold text-slate-300 p-1.5 rounded-lg transition-colors cursor-pointer"
                              title="Edit specifications"
                            >
                              <Edit size={13} />
                            </button>
                            <button
                              onClick={() => {
                                if (confirm(`Delete product "${product.title}"? This cannot be undone.`)) {
                                  onDeleteProduct(product.id);
                                  showToast(`❌ Product "${product.title}" deleted.`);
                                  if (editingId === product.id) handleCancelEdit();
                                }
                              }}
                              className="bg-slate-900 hover:bg-red-950 hover:text-red-400 text-slate-400 p-1.5 rounded-lg transition-colors cursor-pointer"
                              title="Delete Item"
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

      </div>

    </div>
  );
}
