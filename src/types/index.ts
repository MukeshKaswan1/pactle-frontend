export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  inventory_count: number;
  image_url: string;
  created_at: string;
  updated_at: string;
}

export interface CartItem {
  id: number;
  user: number;
  product: Product;
  quantity: number;
}

export interface Order {
  id: number;
  user: number;
  total_amount: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  created_at: string;
  updated_at: string;
  items: OrderItem[];
}

export interface OrderItem {
  id: number;
  order: number;
  product: Product;
  quantity: number;
  unit_price: number;
}

export interface User {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
}

export interface AuthTokens {
  access: string;
  refresh: string;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface RegisterData {
  username: string;
  email: string;
  password: string;
  first_name: string;
  last_name: string;
}