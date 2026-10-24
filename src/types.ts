export type UserRole = 'buyer' | 'seller' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar: string;
  role: UserRole;
  shopName?: string;
  shopRating?: number;
  isBlocked?: boolean;
  registeredAt: string;
  walletBalance: number;
}

export interface Category {
  id: string;
  name: string;
  nameEn: string;
  iconName: string; // lucide icon identifier
  productCount: number;
  color: string;
}

export interface Product {
  id: string;
  title: string;
  price: number;
  originalPrice: number;
  discountPercent: number;
  rating: number;
  reviewCount: number;
  soldCount: number;
  stock: number;
  categoryId: string;
  categoryName: string;
  image: string;
  gallery: string[];
  description: string;
  sellerId: string;
  sellerName: string;
  sellerVerified: boolean;
  isMall: boolean;
  isFreeShipping: boolean;
  isNewArrival: boolean;
  isBestSeller: boolean;
  createdAt: string;
  status: 'approved' | 'pending' | 'rejected';
}

export interface CartItem {
  productId: string;
  product: Product;
  quantity: number;
  selected: boolean;
}

export type PaymentMethod = 'promptpay' | 'shopeepay' | 'card' | 'cod';
export type PaymentStatus = 'paid' | 'pending' | 'failed';
export type ShippingStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';

export interface OrderItem {
  productId: string;
  productTitle: string;
  productImage: string;
  price: number;
  quantity: number;
}

export interface Order {
  id: string;
  orderNumber: string;
  buyerId: string;
  buyerName: string;
  buyerPhone: string;
  buyerAddress: string;
  sellerId: string;
  sellerName: string;
  items: OrderItem[];
  subtotal: number;
  discount: number;
  shippingFee: number;
  coinsUsed: number;
  total: number;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  shippingStatus: ShippingStatus;
  trackingNumber?: string;
  createdAt: string;
  paidAt?: string;
}

export interface Voucher {
  id: string;
  code: string;
  title: string;
  discountAmount?: number;
  discountPercent?: number;
  minSpend: number;
  maxDiscount?: number;
  type: 'free_shipping' | 'discount' | 'coins';
  expiresAt: string;
}

export interface ProductReview {
  id: string;
  productId: string;
  userName: string;
  userAvatar: string;
  rating: number;
  comment: string;
  date: string;
  variant?: string;
}
