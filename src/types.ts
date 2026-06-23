export interface Product {
  id: string;
  title: string;
  description: string;
  priceKES: number;
  priceUGX: number;
  rating: number;
  reviewsCount: number;
  discount: number; // percentage, e.g. 15 for 15% off
  image: string;
  category: string;
  brand: string;
  stock: number;
  isExpress: boolean;
  isBestSeller: boolean;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Order {
  id: string;
  items: CartItem[];
  subtotal: number;
  shippingFee: number;
  discountAmount: number;
  total: number;
  date: string;
  status: 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
  country: 'Kenya' | 'Uganda';
  shippingAddress: {
    name: string;
    phone: string;
    email: string;
    town: string;
    addressDetails: string;
  };
  paymentMethod: string;
  paymentDetails?: string;
  trackingSteps: {
    title: string;
    description: string;
    time: string;
    completed: boolean;
  }[];
}

export type Country = 'Kenya' | 'Uganda';

export interface Category {
  id: string;
  name: string;
  iconName: string;
  description: string;
}

export interface Review {
  id: string;
  username: string;
  rating: number;
  comment: string;
  date: string;
}
