import { Product, Category, Review } from './types';

export const categories: Category[] = [
  {
    id: 'phones-tablets',
    name: 'Phones & Tablets',
    iconName: 'Smartphone',
    description: 'Smartphones, Tablets, accessories & gadgets'
  },
  {
    id: 'electronics',
    name: 'Electronics',
    iconName: 'Tv',
    description: 'Smart TVs, Home Theatre, Audio & Smart Home'
  },
  {
    id: 'appliances',
    name: 'Appliances',
    iconName: 'Refrigerator',
    description: 'Fridges, Air Fryers, Microwaves & Kettles'
  },
  {
    id: 'supermarket',
    name: 'Supermarket',
    iconName: 'ShoppingBag',
    description: 'Maize meal, Sugar, Tea, Soap, and Cooking Oil'
  },
  {
    id: 'fashion',
    name: 'Fashion & Apparel',
    iconName: 'Shirt',
    description: 'Ankara fabrics, Shuka blankets, shoes, and shirts'
  },
  {
    id: 'health-beauty',
    name: 'Health & Beauty',
    iconName: 'Sparkles',
    description: 'Shea butter, skin lotions, makeup, and soaps'
  },
  {
    id: 'home-office',
    name: 'Home & Office',
    iconName: 'Home',
    description: 'Mattresses, pillows, office chairs, and duvets'
  }
];

export const products: Product[] = [
  // PHONES & TABLETS
  {
    id: 'phone-infinix-hot-40i',
    title: 'Infinix Hot 40i - 6.56" 256GB - Dual SIM - 8GB RAM - 5000mAh',
    description: 'The Infinix Hot 40i is built for speed and endurance. Features a 50MP dual AI rear camera, a 32MP crystal-clear selfie camera, stunning 90Hz punch-hole display, and all-day 5000mAh battery with 18W fast charging. Ideal for everyday use, social media, and gaming.',
    priceKES: 13499,
    priceUGX: 385000,
    rating: 4.6,
    reviewsCount: 148,
    discount: 15,
    image: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=500&auto=format&fit=crop&q=80',
    category: 'phones-tablets',
    brand: 'Infinix',
    stock: 25,
    isExpress: true,
    isBestSeller: true
  },
  {
    id: 'phone-tecno-spark-20',
    title: 'Tecno Spark 20 - 6.6" 256GB - 8GB RAM (Up to 16GB) - 5000mAh - Gold',
    description: 'Unleash the spark with the Tecno Spark 20. Comes equipped with a MediaTek Helio G85 processor, 256GB huge space, 90Hz hole screen, 50MP ultra-clear main camera, and stereo dual speakers for immersive sound. Built in a elegant gold design matching Zuri Shoppers.',
    priceKES: 16299,
    priceUGX: 465000,
    rating: 4.7,
    reviewsCount: 82,
    discount: 10,
    image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500&auto=format&fit=crop&q=80',
    category: 'phones-tablets',
    brand: 'Tecno',
    stock: 14,
    isExpress: true,
    isBestSeller: false
  },
  {
    id: 'phone-samsung-a35',
    title: 'Samsung Galaxy A35 5G - 6.6" 128GB - 8GB RAM - 50MP Camera - Awesome Blue',
    description: 'Experience premium styling and robust 5G performance with the Samsung Galaxy A35. Excellent Super AMOLED display, IP67 dust and water resistance, and flawless security with Samsung Knox Vault. Perfect companion for business or high-quality streaming.',
    priceKES: 38999,
    priceUGX: 1110000,
    rating: 4.8,
    reviewsCount: 56,
    discount: 8,
    image: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=500&auto=format&fit=crop&q=80',
    category: 'phones-tablets',
    brand: 'Samsung',
    stock: 8,
    isExpress: false,
    isBestSeller: true
  },
  {
    id: 'tablet-xiaomi-pad-6',
    title: 'Xiaomi Pad 6 - 11.0" - 256GB - 8GB RAM - Quad Speakers - Gravity Gray',
    description: 'Flagship-level Snapdragon 870 processor, 144Hz WQHD+ eye-care display, and exceptional premium metal unibody. Crucial productivity machine for students, digital designers, and entertainment lovers alike.',
    priceKES: 47500,
    priceUGX: 1355000,
    rating: 4.9,
    reviewsCount: 33,
    discount: 12,
    image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=500&auto=format&fit=crop&q=80',
    category: 'phones-tablets',
    brand: 'Xiaomi',
    stock: 6,
    isExpress: true,
    isBestSeller: false
  },

  // ELECTRONICS
  {
    id: 'tv-zuri-43-smart',
    title: 'Zuri Shoppers Vision 43" Ultra HD Android Smart LED TV - Frameless',
    description: 'The flagship Zuri Shoppers TV, designed specifically for elegant homes in Kenya and Uganda. Features HDR10+, built-in Chromecast, Google Voice Assistant, YouTube, Netflix preinstalled, Dolby Atmos stereophonic audio, and full local warranty support.',
    priceKES: 24999,
    priceUGX: 712000,
    rating: 4.8,
    reviewsCount: 215,
    discount: 20,
    image: 'https://images.unsplash.com/photo-1593305841991-05c297ba4575?w=500&auto=format&fit=crop&q=80',
    category: 'electronics',
    brand: 'Zuri Shoppers',
    stock: 30,
    isExpress: true,
    isBestSeller: true
  },
  {
    id: 'audio-sony-subwoofer',
    title: 'Sony MHC-V13 High-Power Audio System with Bluetooth & Jet Bass Booster',
    description: 'Bring the club sound home or spice up your local gatherings. Features two high-efficiency tweeters, a massive bass booster, mic input for karaoke, and local FM tuner. Excellent audio fidelity from Sony.',
    priceKES: 28499,
    priceUGX: 810000,
    rating: 4.7,
    reviewsCount: 61,
    discount: 5,
    image: 'https://images.unsplash.com/photo-1545454675-3531b543be5d?w=500&auto=format&fit=crop&q=80',
    category: 'electronics',
    brand: 'Sony',
    stock: 12,
    isExpress: false,
    isBestSeller: false
  },
  {
    id: 'audio-jbl-buds',
    title: 'JBL Wave Beam True Wireless Earbuds - Deep Bass - IP54 Water Resistant',
    description: 'Hands-free calling, ambient noise-aware technology, and up to 32 hours of combined battery life. Ergonimical fit guarantees comfort throughout your matatu or taxi commutes.',
    priceKES: 6499,
    priceUGX: 185000,
    rating: 4.5,
    reviewsCount: 104,
    discount: 15,
    image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=500&auto=format&fit=crop&q=80',
    category: 'electronics',
    brand: 'JBL',
    stock: 45,
    isExpress: true,
    isBestSeller: true
  },

  // APPLIANCES
  {
    id: 'appliance-zuri-airfryer',
    title: 'Zuri Shoppers Digital Low-Fat Air Fryer - 5.5L - 1700W - Gold Accents',
    description: 'Zuri Shoppers custom gold-accented digital air fryer. Cook healthy meals using 85% less oil. Perfect for frying local East African fish, roasting chicken, and baking muffins. Features 8 simple cook-presets, precise digital touch-screen, and a sturdy non-stick dish-washer safe basket.',
    priceKES: 8899,
    priceUGX: 254000,
    rating: 4.9,
    reviewsCount: 312,
    discount: 25,
    image: 'https://images.unsplash.com/photo-1621972750749-0fbb1abb7736?w=500&auto=format&fit=crop&q=80',
    category: 'appliances',
    brand: 'Zuri Shoppers',
    stock: 40,
    isExpress: true,
    isBestSeller: true
  },
  {
    id: 'appliance-ramtons-fridge',
    title: 'Ramtons Double Door Fridge - 128 Liters - Silver Finish - Low Noise',
    description: 'Ramtons is East Africa s trusted refrigeration champ. Consumes minimal power, features Direct Cool tech, spacious vegetable crisper, and key-lock safety. Highly reliable for keeping food fresh in dry or hot areas.',
    priceKES: 34500,
    priceUGX: 980000,
    rating: 4.6,
    reviewsCount: 47,
    discount: 5,
    image: 'https://images.unsplash.com/photo-1571175482183-c240f1226502?w=500&auto=format&fit=crop&q=80',
    category: 'appliances',
    brand: 'Ramtons',
    stock: 0,
    isExpress: false,
    isBestSeller: false
  },
  {
    id: 'appliance-mika-microwave',
    title: 'Mika Digital Microwave with Grill - 20L - Black with Mirror Glass Finish',
    description: 'An essential everyday luxury kitchen helper from Mika. Reheat, defrost, and grill standard local foods with high speed and automated precise cooking timers.',
    priceKES: 11499,
    priceUGX: 327000,
    rating: 4.7,
    reviewsCount: 93,
    discount: 10,
    image: 'https://images.unsplash.com/photo-1574269909862-7e1d70bb8078?w=500&auto=format&fit=crop&q=80',
    category: 'appliances',
    brand: 'Mika',
    stock: 19,
    isExpress: true,
    isBestSeller: false
  },

  // SUPERMARKET
  {
    id: 'groceries-maize-pembe',
    title: 'Pembe Premium Sifted Maize Meal - First Grade Flour - 2kg Pack',
    description: 'A household staple across Kenya and Uganda for cooking thick, satisfying Ugali/Posho. Sifted to high grade perfection for premium texture and rich traditional taste.',
    priceKES: 165,
    priceUGX: 4700,
    rating: 4.8,
    reviewsCount: 520,
    discount: 12,
    image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=500&auto=format&fit=crop&q=80',
    category: 'supermarket',
    brand: 'Pembe',
    stock: 150,
    isExpress: true,
    isBestSeller: true
  },
  {
    id: 'groceries-ug-rolex-kit',
    title: 'Uganda Authentic Street Rolex DIY Kit (Eggs, Chapatis, Tomatoes, Cabbage)',
    description: 'The local Ugandan street legend - the "Rolex" (Rolled Eggs). This complete, safe, and fresh DIY pack comes with 6 farm-fresh eggs, 4 premium local chapatis, fresh organic red tomatoes, crisp cabbages, and local spices to roll your own gourmet delicacy right at home!',
    priceKES: 350,
    priceUGX: 9900,
    rating: 4.9,
    reviewsCount: 88,
    discount: 15,
    image: 'https://images.unsplash.com/photo-1619535860434-ba1d8fa12536?w=500&auto=format&fit=crop&q=80',
    category: 'supermarket',
    brand: 'Zuri Shoppers',
    stock: 50,
    isExpress: true,
    isBestSeller: true
  },
  {
    id: 'groceries-tea-kericho',
    title: 'Kericho Gold Pure Kenya Tea - Rich & Flavorful Black Tea - 100 Tea Bags',
    description: 'Grown on the rich volcanic soils of Kenya, Kericho Gold is globally loved for its bright golden color and premium, rich aromatic fragrance. Makes the perfect cup of Chai.',
    priceKES: 395,
    priceUGX: 11200,
    rating: 4.9,
    reviewsCount: 164,
    discount: 5,
    image: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=500&auto=format&fit=crop&q=80',
    category: 'supermarket',
    brand: 'Kericho Gold',
    stock: 200,
    isExpress: true,
    isBestSeller: false
  },
  {
    id: 'groceries-whitestar-soap',
    title: 'White Star Laundry Bar Soap - Pure Vegetable Extract - 800g Long Bar',
    description: 'Highly effective long-bar laundry and kitchen washing soap. Smooth on hands, heavy on stain-removal. Trusted across East African families for generations.',
    priceKES: 175,
    priceUGX: 5000,
    rating: 4.6,
    reviewsCount: 78,
    discount: 10,
    image: 'https://images.unsplash.com/photo-1607006342411-913a521e25e1?w=500&auto=format&fit=crop&q=80',
    category: 'supermarket',
    brand: 'White Star',
    stock: 120,
    isExpress: true,
    isBestSeller: false
  },

  // FASHION
  {
    id: 'fashion-safari-boots',
    title: 'Zuri Shoppers Premium Suede Safari Boots - Handmade Unisex Sand',
    description: 'The legendary East African Safari boots, custom crafted for Zuri Shoppers with a gold embossed stamp on the inner sole. Perfect suede leather, durable rubber stitching, and incredibly light and comfortable. Suited for dusty trails, muddy walks, or a casual weekend look.',
    priceKES: 2999,
    priceUGX: 85000,
    rating: 4.8,
    reviewsCount: 132,
    discount: 18,
    image: 'https://images.unsplash.com/photo-1520639888713-7851133b1ed0?w=500&auto=format&fit=crop&q=80',
    category: 'fashion',
    brand: 'Zuri Shoppers',
    stock: 35,
    isExpress: true,
    isBestSeller: true
  },
  {
    id: 'fashion-ankara-fabric',
    title: 'High-Quality 100% Cotton Ankara African Print Fabric - 6 Yards Bundle',
    description: 'Vibrant, high-contrast wax print fabrics with excellent durability and beautiful West and East African traditional motives. Ready to be custom-tailored into stunning daily outfits, dresses, shirts, or Gomesi wrappers.',
    priceKES: 1950,
    priceUGX: 55000,
    rating: 4.8,
    reviewsCount: 45,
    discount: 15,
    image: 'https://images.unsplash.com/photo-1611085583191-a3b1a1a27db2?w=500&auto=format&fit=crop&q=80',
    category: 'fashion',
    brand: 'East African Wax',
    stock: 60,
    isExpress: false,
    isBestSeller: false
  },
  {
    id: 'fashion-maasai-shuka',
    title: 'Authentic Kenyan Maasai Shuka Wrap Blanket - High Acrylic - Red/Black',
    description: 'The genuine traditional warrior wrapper Shuka. Thick, cozy, multi-colored plaid acrylic blanket. Widely used as a fashion shawl, camping blanket, or rustic sofa throw.',
    priceKES: 1100,
    priceUGX: 31000,
    rating: 4.9,
    reviewsCount: 112,
    discount: 10,
    image: 'https://images.unsplash.com/photo-1505673542670-a5e3ff5b14a3?w=500&auto=format&fit=crop&q=80',
    category: 'fashion',
    brand: 'Maasai Heritage',
    stock: 80,
    isExpress: true,
    isBestSeller: true
  },

  // HEALTH & BEAUTY
  {
    id: 'beauty-shea-butter',
    title: 'Zuri Shoppers Organic Cold-Pressed Shea Butter - 100% Unrefined - 500g',
    description: 'Indulge your skin with pure unrefined East African shea butter. Nourishes, heals stretches, repairs cracked heels, moisturizes dry curly hair, and works perfect for baby skincare. Prepared strictly with gold-standard natural extraction methods.',
    priceKES: 850,
    priceUGX: 24000,
    rating: 4.9,
    reviewsCount: 154,
    discount: 15,
    image: 'https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?w=500&auto=format&fit=crop&q=80',
    category: 'health-beauty',
    brand: 'Zuri Shoppers',
    stock: 90,
    isExpress: true,
    isBestSeller: true
  },
  {
    id: 'beauty-nivea-lotion',
    title: 'NIVEA Perfect & Radiant Even Tone Body Lotion - Vitamin C - 400ml Double Pack',
    description: 'Enriched with Berry extracts and advanced Vitamin C, restore even skin-tones, smooth textures, and stay fresh and hydrated under the warm Kenyan & Ugandan sun.',
    priceKES: 1250,
    priceUGX: 35000,
    rating: 4.7,
    reviewsCount: 220,
    discount: 10,
    image: 'https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?w=500&auto=format&fit=crop&q=80',
    category: 'health-beauty',
    brand: 'NIVEA',
    stock: 45,
    isExpress: true,
    isBestSeller: false
  },

  // HOME & OFFICE
  {
    id: 'home-ortho-mattress',
    title: 'Super Foam Orthopedic Medium-Density Foam Mattress - 6x3 - High Comfort',
    description: 'Crafted for unparalleled back-support and comfortable deep sleep. Durable quilted fabric outer layer, highly responsive memory foam cores, and standard 5-year local warrant card.',
    priceKES: 12500,
    priceUGX: 355000,
    rating: 4.7,
    reviewsCount: 52,
    discount: 15,
    image: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=500&auto=format&fit=crop&q=80',
    category: 'home-office',
    brand: 'Super Foam',
    stock: 12,
    isExpress: false,
    isBestSeller: true
  },
  {
    id: 'home-office-chair',
    title: 'Ergonomic Mesh Swivel Office Chair - High Back with Headrest',
    description: 'Work from home or stay productive in your Kampala or Nairobi corporate office. Advanced lumber support, breathable netting fabric, height-adjustable gas lifts, and sturdy revolving wheels.',
    priceKES: 8999,
    priceUGX: 256000,
    rating: 4.5,
    reviewsCount: 39,
    discount: 22,
    image: 'https://images.unsplash.com/photo-1505797149-43b0069ec26b?w=500&auto=format&fit=crop&q=80',
    category: 'home-office',
    brand: 'Zuri Shoppers',
    stock: 18,
    isExpress: true,
    isBestSeller: false
  }
];

export const sampleReviews: Record<string, Review[]> = {
  'phone-infinix-hot-40i': [
    { id: 'r1', username: 'Kiprop M.', rating: 5, comment: 'Safi sana! Battery holds for 2 full days and screen is super smooth. Express delivery to Eldoret took only 24 hours!', date: '2026-06-15' },
    { id: 'r2', username: 'Sarah A. (Kampala)', rating: 4, comment: 'Great phone for the price. I paid using MTN MoMo seamlessly. Recommended!', date: '2026-06-18' }
  ],
  'tv-zuri-43-smart': [
    { id: 'r3', username: 'Alex O.', rating: 5, comment: 'Brilliant picture quality! YouTube works smoothly. The black gold frame looks premium. Absolute value for money!', date: '2026-06-11' },
    { id: 'r4', username: 'Peter B.', rating: 5, comment: 'Best purchase of this year! Delivery in Entebbe pick-up station was cheap and hassle-free.', date: '2026-06-20' }
  ],
  'groceries-ug-rolex-kit': [
    { id: 'r5', username: 'Nsubuga S.', rating: 5, comment: 'Aha! Pure Uganda vibe! The chapatis were soft and the eggs fresh. Made 4 brilliant street rolexes. ZURI is King.', date: '2026-06-22' }
  ]
};

export const regionsData = {
  Kenya: {
    currency: 'KES',
    symbol: 'KSh',
    towns: ['Nairobi (Zone A)', 'Mombasa (Zone B)', 'Kisumu (Zone B)', 'Nakuru (Zone C)', 'Eldoret (Zone C)', 'Nyeri (Zone C)', 'Thika (Zone A)'],
    shippingCosts: {
      'Nairobi (Zone A)': 250,
      'Thika (Zone A)': 300,
      'Mombasa (Zone B)': 450,
      'Kisumu (Zone B)': 400,
      'Nakuru (Zone C)': 350,
      'Eldoret (Zone C)': 380,
      'Nyeri (Zone C)': 350,
    } as Record<string, number>,
    paymentMethods: ['M-Pesa (Mobile Money)', 'Credit/Debit Card', 'Cash on Delivery']
  },
  Uganda: {
    currency: 'UGX',
    symbol: 'USh',
    towns: ['Kampala (Central Zone)', 'Entebbe (Central Zone)', 'Jinja (Eastern Zone)', 'Mbarara (Western Zone)', 'Gulu (Northern Zone)', 'Mukono (Central Zone)', 'Masaka (Southern Zone)'],
    shippingCosts: {
      'Kampala (Central Zone)': 6000,
      'Entebbe (Central Zone)': 7500,
      'Mukono (Central Zone)': 8000,
      'Jinja (Eastern Zone)': 11000,
      'Mbarara (Western Zone)': 13000,
      'Gulu (Northern Zone)': 14000,
      'Masaka (Southern Zone)': 11500,
    } as Record<string, number>,
    paymentMethods: ['MTN Mobile Money', 'Airtel Money', 'Credit/Debit Card', 'Cash on Delivery']
  }
};
