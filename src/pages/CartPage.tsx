import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus, ShoppingBag } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';
import { orderAPI } from '../services/api';

const CartPage: React.FC = () => {
  const { items, updateQuantity, removeFromCart, getTotalPrice, isLoading, clearCart } = useCart();
  const { isAuthenticated, tokens } = useAuth();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    try {
      const orderData = {
        total_amount: getTotalPrice() + getTotalPrice() * 0.08,
        items: items.map(item => ({
          product_id: item.product.id,
          quantity: item.quantity,
          unit_price: item.product.price
        }))
      };
      await orderAPI.createOrder(tokens!.access, orderData);
      clearCart();
      navigate('/order-success');
    } catch (error) {
      console.error('Payment error:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleQuantityChange = async (itemId: number, newQuantity: number, product_id: number) => {
    try {
      await updateQuantity(itemId, newQuantity, product_id);
    } catch (error) {
      console.error('Error updating quantity:', error);
    }
  };

  const handleRemoveItem = async (itemId: number) => {
    try {
      await removeFromCart(itemId);
    } catch (error) {
      console.error('Error removing item:', error);
    }
  };


  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <ShoppingBag className="h-24 w-24 text-gray-300 mx-auto mb-6" />
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Your cart is empty</h2>
          <p className="text-gray-600 mb-8">Looks like you haven't added any items to your cart yet.</p>
          <Link
            to="/"
            className="bg-indigo-600 text-white px-8 py-3 rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  const totalPrice = getTotalPrice();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Shopping Cart</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">
                  Cart Items ({items.length})
                </h2>
                <div className="space-y-6">
                  {items.map((item) => (
                    <div key={item.id} className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg">
                      <img
                        src={item.product.image_url}
                        alt={item.product.name}
                        className="w-20 h-20 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <Link
                          to={`/product/${item.product.id}`}
                          className="text-lg font-semibold text-gray-900 hover:text-indigo-600 transition-colors"
                        >
                          {item.product.name}
                        </Link>
                        <p className="text-gray-600 text-sm mt-1">
                          ${item.product.price} each
                        </p>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="flex items-center border border-gray-300 rounded-lg">
                          <button
                            onClick={() => handleQuantityChange(item.id, item.quantity - 1, item.product.id)}
                            disabled={item.quantity <= 1}
                            className="p-2 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <Minus className="h-4 w-4" />
                          </button>
                          <span className="px-4 py-2 font-semibold">{item.quantity}</span>
                          <button
                            onClick={() => handleQuantityChange(item.id, item.quantity + 1, item.product.id)}
                            disabled={item.quantity >= item.product.inventory_count}
                            className="p-2 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <Plus className="h-4 w-4" />
                          </button>
                        </div>
                        <div className="text-lg font-semibold text-gray-900 min-w-[80px] text-right">
                          ${(item.product.price * item.quantity).toFixed(2)}
                        </div>
                        <button
                          onClick={() => handleRemoveItem(item.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <form onSubmit={handleSubmit}>
              <div className="bg-white rounded-xl shadow-lg p-6 sticky top-24">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Order Summary</h2>
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span>${totalPrice.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Shipping</span>
                    <span>Free</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Tax</span>
                    <span>${(totalPrice * 0.08).toFixed(2)}</span>
                  </div>
                  <hr className="border-gray-200" />
                  <div className="flex justify-between text-xl font-bold text-gray-900">
                    <span>Total</span>
                    <span>${(totalPrice * 1.08).toFixed(2)}</span>
                  </div>
                </div>
                {/* <button
                  type="submit"
                  disabled={isProcessing}
                  className="w-full bg-indigo-600 text-white py-3 px-6 rounded-lg hover:bg-indigo-700 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isProcessing ? 'Placing Order...' : 'Place Order'}
                </button> */}
                <button
                  type="button"
                  onClick={() => navigate('/checkout')}
                  className="w-full bg-indigo-600 text-white py-3 px-6 rounded-lg hover:bg-indigo-700 transition-colors font-semibold"
                >
                  Proceed to Checkout
                </button>
                <Link
                  to="/"
                  className="block text-center text-indigo-600 hover:text-indigo-700 transition-colors mt-4"
                >
                  Continue Shopping
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;