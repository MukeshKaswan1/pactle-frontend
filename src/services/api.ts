import { Product, CartItem, Order, User, AuthTokens, LoginCredentials, RegisterData } from '../types';

const API_URL = "http://localhost:8000/api";

// Product API
export const productAPI = {
  async getProducts(): Promise<Product[]> {
    const res = await fetch(`${API_URL}/products/`);
    if (!res.ok) throw new Error('Failed to fetch products');
    return await res.json();
  },

  async getProductById(id: number): Promise<Product> {
    const res = await fetch(`${API_URL}/products/${id}/`);
    if (!res.ok) throw new Error('Product not found');
    return await res.json();
  },

  async searchProducts(query: string): Promise<Product[]> {
    const res = await fetch(`${API_URL}/products/?search=${query}`);
    if (!res.ok) throw new Error('Failed to search products');
    return await res.json();
  }
};

// Cart API
export const cartAPI = {
  async getCart(token: string): Promise<CartItem[]> {
    const res = await fetch(`${API_URL}/cart/`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    if (!res.ok) throw new Error('Failed to fetch cart');
    return await res.json();
  },

  async addToCart(token: string, productId: number, quantity: number): Promise<CartItem> {
    const res = await fetch(`${API_URL}/cart/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ product_id: productId, quantity }),
    });
    if (!res.ok) throw new Error('Failed to add to cart');
    return await res.json();
  },

  async updateCartItem(token: string, itemId: number, quantity: number, product_id: any): Promise<CartItem> {
    const res = await fetch(`${API_URL}/cart/${itemId}/`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ quantity }),
    });
    if (!res.ok) throw new Error('Failed to update cart item');
    return await res.json();
  },

  async removeFromCart(token: string, itemId: number): Promise<void> {
    const res = await fetch(`${API_URL}/cart/${itemId}/`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` }
    });
    if (!res.ok) throw new Error('Failed to remove from cart');
  }
};

// Auth API
export const authAPI = {
  async login(credentials: LoginCredentials) {
    const res = await fetch(`${API_URL}/login/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(credentials),
    });
    if (!res.ok) throw new Error('Invalid credentials');
    return await res.json(); // { access, refresh }
  },

  async register(data: RegisterData) {
    const res = await fetch(`${API_URL}/register/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Registration failed');
    return await res.json();
  },

  async getProfile(token: string): Promise<User> {
    const res = await fetch(`${API_URL}/profile/`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    if (!res.ok) throw new Error('Failed to fetch profile');
    return await res.json();
  },

  async refreshToken(refreshToken: string): Promise<AuthTokens> {
    const res = await fetch(`${API_URL}/token/refresh/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refresh: refreshToken }),
    });
    if (!res.ok) throw new Error('Failed to refresh token');
    return await res.json();
  }
};

// Order API
export const orderAPI = {
  async createOrder(token: string, orderData: any): Promise<Order> {
    const res = await fetch(`${API_URL}/orders/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(orderData),
    });
    if (!res.ok) throw new Error('Failed to place order');
    return await res.json();
  },

  async getOrders(token: string): Promise<Order[]> {
    const res = await fetch(`${API_URL}/orders/`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    if (!res.ok) throw new Error('Failed to fetch orders');
    return await res.json();
  },

  async getOrderById(token: string, orderId: number): Promise<Order> {
    const res = await fetch(`${API_URL}/orders/${orderId}/`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    if (!res.ok) throw new Error('Order not found');
    return await res.json();
  }
};