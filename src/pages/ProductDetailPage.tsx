import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Star, ShoppingCart, ArrowLeft, Plus, Minus } from 'lucide-react';
import { Product } from '../types';
import { productAPI } from '../services/api';
import { useCart } from '../context/CartContext';
import LoadingSpinner from '../components/LoadingSpinner';

const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [addingToCart, setAddingToCart] = useState(false);
  const { addToCart } = useCart();

  useEffect(() => {
    if (id) {
      loadProduct(parseInt(id));
    }
  }, [id]);

  const loadProduct = async (productId: number) => {
    try {
      setLoading(true);
      const productData = await productAPI.getProductById(productId);
      setProduct(productData);
    } catch (err) {
      setError('Product not found');
      console.error('Error loading product:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async () => {
    if (!product) return;
    
    try {
      setAddingToCart(true);
      await addToCart(product, quantity);
      // Show success message or redirect to cart
    } catch (error) {
      console.error('Error adding to cart:', error);
    } finally {
      setAddingToCart(false);
    }
  };

  const incrementQuantity = () => {
    if (product && quantity < product.inventory_count) {
      setQuantity(prev => prev + 1);
    }
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(prev => prev - 1);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Product Not Found</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => navigate('/')}
            className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center space-x-2 text-gray-600 hover:text-indigo-600 transition-colors mb-8"
        >
          <ArrowLeft className="h-5 w-5" />
          <span>Back</span>
        </button>

        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Product Image */}
            <div className="relative">
              <img
                src={product.image_url}
                alt={product.name}
                className="w-full h-96 lg:h-full object-cover"
              />
            </div>

            {/* Product Details */}
            <div className="p-8">
              <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-900 mb-4">
                  {product.name}
                </h1>
                
                <div className="flex items-center space-x-4 mb-4">
                  <div className="flex items-center space-x-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-5 w-5 ${i < 4 ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                      />
                    ))}
                    <span className="text-gray-600 ml-2">(4.0) • 127 reviews</span>
                  </div>
                </div>

                <div className="text-4xl font-bold text-indigo-600 mb-6">
                  ${product.price}
                </div>
              </div>

              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Description</h3>
                <p className="text-gray-600 leading-relaxed">
                  {product.description}
                </p>
              </div>

              <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-lg font-semibold text-gray-900">Quantity</span>
                  <span className="text-sm text-gray-500">
                    {product.inventory_count} available
                  </span>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="flex items-center border border-gray-300 rounded-lg">
                    <button
                      onClick={decrementQuantity}
                      disabled={quantity <= 1}
                      className="p-2 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <span className="px-4 py-2 font-semibold">{quantity}</span>
                    <button
                      onClick={incrementQuantity}
                      disabled={quantity >= product.inventory_count}
                      className="p-2 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <button
                  onClick={handleAddToCart}
                  disabled={addingToCart || product.inventory_count === 0}
                  className="w-full bg-indigo-600 text-white py-3 px-6 rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                >
                  {addingToCart ? (
                    <>
                      <LoadingSpinner size="sm" />
                      <span>Adding to Cart...</span>
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="h-5 w-5" />
                      <span>Add to Cart</span>
                    </>
                  )}
                </button>

                <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                  <div>
                    <span className="font-semibold">SKU:</span> {product.id.toString().padStart(6, '0')}
                  </div>
                  <div>
                    <span className="font-semibold">Stock:</span> {product.inventory_count} units
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;