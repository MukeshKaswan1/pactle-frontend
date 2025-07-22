import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Package, Calendar, DollarSign } from 'lucide-react';
import { Order } from '../types';
import { orderAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';

const OrderHistoryPage: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { tokens, isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated && tokens) {
      setLoading(true);
      orderAPI.getOrders(tokens.access)
        .then(data => {
          setOrders(data);
          setError(null);
        })
        .catch(err => {
          setError(`Failed to load orders. + ${err.message}`);
          setOrders([]);
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [isAuthenticated, tokens]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'shipped':
        return 'bg-purple-100 text-purple-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Please log in</h2>
          <p className="text-gray-600 mb-6">You need to be logged in to view your order history.</p>
          <Link
            to="/login"
            className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Login
          </Link>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Error loading orders</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => {
              if (tokens) {
                orderAPI.getOrders(tokens.access).then(setOrders);
              }
            }}
            className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Package className="h-24 w-24 text-gray-300 mx-auto mb-6" />
          <h2 className="text-3xl font-bold text-gray-900 mb-4">No orders yet</h2>
          <p className="text-gray-600 mb-8">You haven't placed any orders yet. Start shopping to see your order history here.</p>
          <Link
            to="/"
            className="bg-indigo-600 text-white px-8 py-3 rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Start Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Order History</h1>

        <div className="space-y-6">
          {orders.map((order) => (
            <div key={order.id} className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-4">
                    <h3 className="text-lg font-semibold text-gray-900">
                      Order #{order.id.toString().padStart(6, '0')}
                    </h3>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </span>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center text-gray-600 mb-1">
                      <Calendar className="h-4 w-4 mr-1" />
                      <span className="text-sm">
                        {new Date(order.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex items-center text-gray-900 font-semibold">
                      <DollarSign className="h-4 w-4 mr-1" />
                      <span>${order.total_amount}</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg">
                      <img
                        src={item.product.image_url}
                        alt={item.product.name}
                        className="w-12 h-12 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900 text-sm">{item.product.name}</h4>
                        <p className="text-gray-600 text-xs">
                          Qty: {item.quantity} × ${item.unit_price}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OrderHistoryPage;