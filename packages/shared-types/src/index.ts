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
  role: 'CUSTOMER' | 'ADMIN' | 'CASHIER_INTERNAL' | 'CASHIER_DISTRIBUTOR';
  phone?: string;
  district?: string;
  vendor_id?: string;
  auth_method?: 'google' | 'phone_pin';
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
  // GPM Extension fields
  regular_price?: number;
  is_gpm_product?: boolean;
  gpm_price?: number;
  vendor_id?: string;
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
  status: 'PENDING' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED' | 'placed' | 'partial_paid' | 'completed' | 'cancelled';
  shippingAddress: Address;
  paymentMethod: 'CREDIT_CARD' | 'PAYPAL' | 'CASH_ON_DELIVERY' | 'CASH';
  stripePaymentIntentId?: string;
  createdAt: Date;
  updatedAt: Date;
  trackingNumber?: string;
  // GPM Extension fields
  order_code?: string;
  event_id?: string;
  customer_id?: string | null;
  customer_name?: string;
  is_manual?: boolean;
  total_amount?: number;
}

export interface GpmEvent {
  id?: string;
  name: string;
  location: string;
  event_date: Date | string;
  status: 'draft' | 'active' | 'closed';
  opened_at: Date | string | null;
  closed_at: Date | string | null;
  created_by: string;
}

export interface GpmVendor {
  id?: string;
  event_id: string;
  vendor_name: string;
  type: 'bulog' | 'distributor_pangan' | 'fmcg';
  cashier_ids: string[];
}

export interface GpmEventStock {
  id?: string;
  event_id: string;
  vendor_id: string;
  product_id: string;
  product_name: string;
  product_unit: string;
  gpm_price: number;
  initial_stock: number;
  sold_qty: number;
  remaining_stock: number;
}

export interface SubOrder {
  id?: string;
  order_id: string;
  event_id: string;
  vendor_id: string;
  items: {
    product_id: string;
    product_name: string;
    qty: number;
    unit_price: number;
    subtotal: number;
  }[];
  subtotal: number;
  status: 'pending' | 'paid' | 'cancelled';
  cashier_id: string | null;
  paid_at: Date | string | null;
}
