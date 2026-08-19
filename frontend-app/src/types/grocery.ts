import type { PaymentMethod } from './booking';
import type { AvailableDriver } from './booking';
import type { LatLng } from './map';

export interface GroceryProduct {
  id: string;
  name: string;
  description?: string;
  price: number;
  unit: string;
  emoji: string;
  category: string;
}

export interface GroceryStore {
  id: string;
  name: string;
  category: string;
  emoji: string;
  rating: number;
  deliveryFee: number;
  etaMin: number;
  address: string;
  location: LatLng;
  products: GroceryProduct[];
}

export interface CartLine {
  product: GroceryProduct;
  quantity: number;
}

export type GroceryOrderStatus =
  | 'Preparing'
  | 'Rider Assigned'
  | 'On the Way'
  | 'Delivered'
  | 'Cancelled';

export interface GroceryOrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
}

export interface GroceryOrder {
  id: string;
  passengerId: string;
  storeId: string;
  storeName: string;
  items: GroceryOrderItem[];
  subtotal: number;
  deliveryFee: number;
  total: number;
  deliveryAddress: string;
  deliveryCoordinates: LatLng;
  instructions?: string;
  paymentMethod: PaymentMethod;
  status: GroceryOrderStatus;
  rider?: AvailableDriver;
  placedAt: string;
  timeline: { id: string; label: string; description?: string; timestamp: string; status: 'done' | 'current' | 'pending' }[];
}

export interface GroceryOrderDraft {
  passengerId: string;
  storeId: string;
  storeName: string;
  items: GroceryOrderItem[];
  subtotal: number;
  deliveryFee: number;
  total: number;
  deliveryAddress: string;
  deliveryCoordinates: LatLng;
  instructions?: string;
  paymentMethod: PaymentMethod;
}