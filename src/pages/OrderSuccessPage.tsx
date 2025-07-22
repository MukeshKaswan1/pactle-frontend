import React from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle, Package, ArrowRight } from 'lucide-react';

const OrderSuccessPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full text-center">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="h-10 w-10 text-green-600" />
          </div>
          
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Order Confirmed!
          </h1>
          
          <p className="text-gray-600 mb-8">
            Thank you for your purchase. Your order has been successfully placed and you will receive a confirmation email shortly.
          </p>
          
          <div className="space-y-4">
            <Link
              to="/orders"
              className="w-full bg-indigo-600 text-white py-3 px-6 rounded-lg hover:bg-indigo-700 transition-colors flex items-center justify-center space-x-2"
            >
              <Package className="h-5 w-5" />
              <span>View Order History</span>
            </Link>
            
            <Link
              to="/"
              className="w-full border border-gray-300 text-gray-700 py-3 px-6 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center space-x-2"
            >
              <span>Continue Shopping</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccessPage;