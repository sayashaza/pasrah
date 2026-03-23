export interface Address {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface User {
  id: string;
  email: string;
  displayName: string;
  role: 'CUSTOMER' | 'ADMIN';
  avatarUrl?: string;
  status: 'ACTIVE' | 'DISABLED';
  createdAt: Date;
  updatedAt: Date;
  addresses?: Address[];
  defaultAddressIndex?: number;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  category: string;
  images: string[];
  inventoryCount: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  thumbnailUrl?: string;
}

export interface Order {
  id: string;
  userId: string;
  items: OrderItem[];
  subtotal: number;
  tax: number;
  deliveryFee: number;
  total: number;
  status: 'PENDING' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
  shippingAddress: Address;
  paymentMethod: 'CREDIT_CARD' | 'PAYPAL' | 'CASH_ON_DELIVERY';
  stripePaymentIntentId?: string;
  createdAt: Date;
  updatedAt: Date;
  trackingNumber?: string;
}
