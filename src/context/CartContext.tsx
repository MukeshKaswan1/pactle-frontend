import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { CartItem, Product } from '../types';
import { cartAPI } from '../services/api';
import { useAuth } from './AuthContext';

interface CartContextType {
  items: CartItem[];
  isLoading: boolean;
  addToCart: (product: Product, quantity?: number) => Promise<void>;
  updateQuantity: (itemId: number, quantity: number, product_id: number) => Promise<void>;
  removeFromCart: (itemId: number) => Promise<void>;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { isAuthenticated, tokens } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      loadCart();
    } else {
      // Load cart from localStorage for non-authenticated users
      loadLocalCart();
    }
  }, [isAuthenticated]);

  const loadCart = async () => {
    if (!tokens) return;
    
    try {
      setIsLoading(true);
      const cartItems = await cartAPI.getCart(tokens.access);
      setItems(cartItems);
    } catch (error) {
      console.error('Error loading cart:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadLocalCart = () => {
    const storedCart = localStorage.getItem('cart');
    if (storedCart) {
      try {
        const parsedCart = JSON.parse(storedCart);
        setItems(parsedCart);
      } catch (error) {
        console.error('Error parsing stored cart:', error);
        localStorage.removeItem('cart');
      }
    }
  };

  const saveLocalCart = (cartItems: CartItem[]) => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
  };

  const addToCart = async (product: Product, quantity: number = 1) => {
    try {
      setIsLoading(true);
      if (isAuthenticated && tokens) {
        await cartAPI.addToCart(tokens.access, product.id, quantity);
        await loadCart(); // Reload cart from backend to sync state
      } else {
        // Handle local cart for non-authenticated users
        const existingItem = items.find(item => item.product.id === product.id);
        let updatedItems: CartItem[];
        if (existingItem) {
          updatedItems = items.map(item =>
            item.product.id === product.id
              ? { ...item, quantity: item.quantity + quantity }
              : item
          );
        } else {
          const newItem: CartItem = {
            id: Date.now(), // Temporary ID for local storage
            user: 0,
            product,
            quantity,
          };
          updatedItems = [...items, newItem];
        }
        setItems(updatedItems);
        saveLocalCart(updatedItems);
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const updateQuantity = async (itemId: number, quantity: number) => {
    if (quantity <= 0) {
      await removeFromCart(itemId);
      return;
    }

    try {
      setIsLoading(true);
      if (isAuthenticated && tokens) {
        const item = items.find(i => i.id === itemId);
        if (!item) throw new Error('Cart item not found');
        await cartAPI.updateCartItem(tokens.access, itemId, quantity, item.product.id);
        await loadCart(); // Reload cart from backend to sync state
      } else {
        const updatedItems = items.map(item =>
          item.id === itemId ? { ...item, quantity } : item
        );
        setItems(updatedItems);
        saveLocalCart(updatedItems);
      }
    } catch (error) {
      console.error('Error updating cart item:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const removeFromCart = async (itemId: number) => {
    try {
      setIsLoading(true);
      
      if (isAuthenticated && tokens) {
        await cartAPI.removeFromCart(tokens.access, itemId);
        setItems(items.filter(item => item.id !== itemId));
      } else {
        const updatedItems = items.filter(item => item.id !== itemId);
        setItems(updatedItems);
        saveLocalCart(updatedItems);
      }
    } catch (error) {
      console.error('Error removing from cart:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const clearCart = () => {
    setItems([]);
    localStorage.removeItem('cart');
  };

  const getTotalItems = () => {
    return items.reduce((total, item) => total + item.quantity, 0);
  };

  const getTotalPrice = () => {
    return items.reduce((total, item) => total + (item.product.price * item.quantity), 0);
  };

  const value: CartContextType = {
    items,
    isLoading,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    getTotalItems,
    getTotalPrice,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};