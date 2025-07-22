// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { CreditCard, Lock } from 'lucide-react';
// import { useCart } from '../context/CartContext';
// import { useAuth } from '../context/AuthContext';
// import LoadingSpinner from '../components/LoadingSpinner';
// import { orderAPI } from '../services/api';
// import { CardElement, useStripe, useElements, Elements } from '@stripe/react-stripe-js';
// import { loadStripe } from '@stripe/stripe-js';

// const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY!);

// const CheckoutPage: React.FC = () => {
//   const { items, getTotalPrice, clearCart } = useCart();
//   const { user, isAuthenticated } = useAuth();
//   const navigate = useNavigate();
//   const [isProcessing, setIsProcessing] = useState(false);
//   const [formData, setFormData] = useState({
//     email: user?.email || '',
//     firstName: user?.first_name || '',
//     lastName: user?.last_name || '',
//     address: '',
//     city: '',
//     state: '',
//     zipCode: '',
//     cardNumber: '',
//     expiryDate: '',
//     cvv: '',
//     nameOnCard: ''
//   });

//   React.useEffect(() => {
//     if (!isAuthenticated) {
//       navigate('/login?redirect=/checkout');
//     }
//   }, [isAuthenticated, navigate]);
//   const { tokens } = useAuth();
//   // const { items, getTotalPrice, clearCart } = useCart();

//   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({ ...prev, [name]: value }));
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setIsProcessing(true);

//     const stripe = useStripe();
//     const elements = useElements();

//     if (!stripe || !elements) {
//       setIsProcessing(false);
//       return;
//     }

//     // Create payment method
//     const cardElement = elements.getElement(CardElement);
//     const { error, paymentMethod } = await stripe.createPaymentMethod({
//       type: 'card',
//       card: cardElement!,
//       billing_details: {
//         name: `${formData.firstName} ${formData.lastName}`,
//         email: formData.email,
//       },
//     });

//     if (error) {
//       // Show error to user
//       setIsProcessing(false);
//       return;
//     }

//     // Send paymentMethod.id to your backend to create a PaymentIntent and confirm payment
//     // (see backend step below)

//     try {
//       // Prepare order data
//       const orderData = {
//         total_amount: getTotalPrice() + getTotalPrice() * 0.08,
//         items: items.map(item => ({
//           product_id: item.product.id,
//           quantity: item.quantity,
//           unit_price: item.product.price
//         }))
//       };
//       // Place order via API
//       const res = await fetch('/api/create-payment-intent/', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           Authorization: `Bearer ${tokens!.access}`,
//         },
//         body: JSON.stringify({ amount: finalTotal }), // finalTotal in dollars
//       });
//       const { clientSecret } = await res.json();

//       const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
//         payment_method: paymentMethod.id,
//       });

//       if (stripeError) {
//         // Show error to user
//         setIsProcessing(false);
//         alert(stripeError.message); // Show the error
//         return;
//       }

//       if (paymentIntent && paymentIntent.status === 'succeeded') {
//         // Place order via API
//         await orderAPI.createOrder(tokens!.access, orderData);
//         clearCart();
//         navigate('/order-success');
//       } else {
//         setIsProcessing(false);
//         alert('Payment was not successful.');
//       }
//     } catch (error) {
//       console.error('Payment error:', error);
//     } finally {
//       setIsProcessing(false);
//     }
//   };

//   if (!isAuthenticated) {
//     return null;
//   }

//   if (items.length === 0) {
//     navigate('/cart');
//     return null;
//   }

//   const totalPrice = getTotalPrice();
//   const tax = totalPrice * 0.08;
//   const finalTotal = totalPrice + tax;

//   return (
//     <div className="min-h-screen bg-gray-50">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//         <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>

//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
//           {/* Checkout Form */}
//           <div className="bg-white rounded-xl shadow-lg p-6">
//             <form onSubmit={handleSubmit} className="space-y-6">
//               {/* Contact Information */}
//               <div>
//                 <h2 className="text-xl font-semibold text-gray-900 mb-4">Contact Information</h2>
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">
//                       First Name
//                     </label>
//                     <input
//                       type="text"
//                       name="firstName"
//                       value={formData.firstName}
//                       onChange={handleInputChange}
//                       required
//                       className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
//                     />
//                   </div>
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">
//                       Last Name
//                     </label>
//                     <input
//                       type="text"
//                       name="lastName"
//                       value={formData.lastName}
//                       onChange={handleInputChange}
//                       required
//                       className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
//                     />
//                   </div>
//                 </div>
//                 <div className="mt-4">
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Email
//                   </label>
//                   <input
//                     type="email"
//                     name="email"
//                     value={formData.email}
//                     onChange={handleInputChange}
//                     required
//                     className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
//                   />
//                 </div>
//               </div>

//               {/* Shipping Address */}
//               <div>
//                 <h2 className="text-xl font-semibold text-gray-900 mb-4">Shipping Address</h2>
//                 <div className="space-y-4">
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">
//                       Address
//                     </label>
//                     <input
//                       type="text"
//                       name="address"
//                       value={formData.address}
//                       onChange={handleInputChange}
//                       required
//                       className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
//                     />
//                   </div>
//                   <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//                     <div>
//                       <label className="block text-sm font-medium text-gray-700 mb-2">
//                         City
//                       </label>
//                       <input
//                         type="text"
//                         name="city"
//                         value={formData.city}
//                         onChange={handleInputChange}
//                         required
//                         className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
//                       />
//                     </div>
//                     <div>
//                       <label className="block text-sm font-medium text-gray-700 mb-2">
//                         State
//                       </label>
//                       <input
//                         type="text"
//                         name="state"
//                         value={formData.state}
//                         onChange={handleInputChange}
//                         required
//                         className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
//                       />
//                     </div>
//                     <div>
//                       <label className="block text-sm font-medium text-gray-700 mb-2">
//                         ZIP Code
//                       </label>
//                       <input
//                         type="text"
//                         name="zipCode"
//                         value={formData.zipCode}
//                         onChange={handleInputChange}
//                         required
//                         className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
//                       />
//                     </div>
//                   </div>
//                 </div>
//               </div>

//               {/* Payment Information */}
//               <div>
//                 <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
//                   <CreditCard className="h-5 w-5 mr-2" />
//                   Payment Information
//                 </h2>
//                 <div className="space-y-4">
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">
//                       Name on Card
//                     </label>
//                     <input
//                       type="text"
//                       name="nameOnCard"
//                       value={formData.nameOnCard}
//                       onChange={handleInputChange}
//                       required
//                       className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
//                     />
//                   </div>
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">
//                       Card Details
//                     </label>
//                     {/* <div className="border border-gray-300 rounded-lg p-5">
//                       <CardElement options={{ hidePostalCode: true }} />
//                     </div> */}
//                   </div>
//                   <div className="grid grid-cols-2 gap-4">
//                     <div>
//                       <label className="block text-sm font-medium text-gray-700 mb-2">
//                         Expiry Date
//                       </label>
//                       <input
//                         type="text"
//                         name="expiryDate"
//                         value={formData.expiryDate}
//                         onChange={handleInputChange}
//                         placeholder="MM/YY"
//                         required
//                         className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
//                       />
//                     </div>
//                     <div>
//                       <label className="block text-sm font-medium text-gray-700 mb-2">
//                         CVV
//                       </label>
//                       <input
//                         type="text"
//                         name="cvv"
//                         value={formData.cvv}
//                         onChange={handleInputChange}
//                         placeholder="123"
//                         required
//                         className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
//                       />
//                     </div>
//                   </div>
//                 </div>
//               </div>

//               <button
//                 type="submit"
//                 disabled={isProcessing}
//                 className="w-full bg-indigo-600 text-white py-3 px-6 rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
//               >
//                 {isProcessing ? (
//                   <>
//                     <LoadingSpinner size="sm" />
//                     <span>Processing Payment...</span>
//                   </>
//                 ) : (
//                   <>
//                     <Lock className="h-5 w-5" />
//                     <span>Complete Order</span>
//                   </>
//                 )}
//               </button>
//             </form>
//           </div>

//           {/* Order Summary */}
//           <div className="bg-white rounded-xl shadow-lg p-6 h-fit sticky top-24">
//             <h2 className="text-xl font-semibold text-gray-900 mb-6">Order Summary</h2>
            
//             <div className="space-y-4 mb-6">
//               {items.map((item) => (
//                 <div key={item.id} className="flex items-center space-x-3">
//                   <img
//                     src={item.product.image_url}
//                     alt={item.product.name}
//                     className="w-12 h-12 object-cover rounded-lg"
//                   />
//                   <div className="flex-1">
//                     <h3 className="font-medium text-gray-900">{item.product.name}</h3>
//                     <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
//                   </div>
//                   <span className="font-semibold text-gray-900">
//                     ${(item.product.price * item.quantity).toFixed(2)}
//                   </span>
//                 </div>
//               ))}
//             </div>
            
//             <div className="space-y-2 mb-6">
//               <div className="flex justify-between text-gray-600">
//                 <span>Subtotal</span>
//                 <span>${totalPrice.toFixed(2)}</span>
//               </div>
//               <div className="flex justify-between text-gray-600">
//                 <span>Shipping</span>
//                 <span>Free</span>
//               </div>
//               <div className="flex justify-between text-gray-600">
//                 <span>Tax</span>
//                 <span>${tax.toFixed(2)}</span>
//               </div>
//               <hr className="border-gray-200" />
//               <div className="flex justify-between text-xl font-bold text-gray-900">
//                 <span>Total</span>
//                 <span>${finalTotal.toFixed(2)}</span>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default function CheckoutPageWithStripe() {
//   return (
//     <Elements stripe={stripePromise}>
//       <CheckoutPage />
//     </Elements>
//   );
// }

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CreditCard, Lock } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';

const CheckoutPage: React.FC = () => {
  const { items, getTotalPrice, clearCart } = useCart();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  const [formData, setFormData] = useState({
    email: user?.email || '',
    firstName: user?.first_name || '',
    lastName: user?.last_name || '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    nameOnCard: ''
  });

  React.useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login?redirect=/checkout');
    }
  }, [isAuthenticated, navigate]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Clear cart and redirect to success page
      clearCart();
      navigate('/order-success');
    } catch (error) {
      console.error('Payment error:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  if (!isAuthenticated) {
    return null;
  }

  if (items.length === 0) {
    navigate('/cart');
    return null;
  }

  const totalPrice = getTotalPrice();
  const tax = totalPrice * 0.08;
  const finalTotal = totalPrice + tax;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Checkout Form */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Contact Information */}
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Contact Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      First Name
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Last Name
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                  </div>
                </div>
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Shipping Address */}
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Shipping Address</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Address
                    </label>
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        City
                      </label>
                      <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        State
                      </label>
                      <input
                        type="text"
                        name="state"
                        value={formData.state}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        ZIP Code
                      </label>
                      <input
                        type="text"
                        name="zipCode"
                        value={formData.zipCode}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment Information */}
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                  <CreditCard className="h-5 w-5 mr-2" />
                  Payment Information
                </h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Name on Card
                    </label>
                    <input
                      type="text"
                      name="nameOnCard"
                      value={formData.nameOnCard}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Card Number
                    </label>
                    <input
                      type="text"
                      name="cardNumber"
                      value={formData.cardNumber}
                      onChange={handleInputChange}
                      placeholder="1234 5678 9012 3456"
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Expiry Date
                      </label>
                      <input
                        type="text"
                        name="expiryDate"
                        value={formData.expiryDate}
                        onChange={handleInputChange}
                        placeholder="MM/YY"
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        CVV
                      </label>
                      <input
                        type="text"
                        name="cvv"
                        value={formData.cvv}
                        onChange={handleInputChange}
                        placeholder="123"
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={isProcessing}
                className="w-full bg-indigo-600 text-white py-3 px-6 rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                {isProcessing ? (
                  <>
                    <LoadingSpinner size="sm" />
                    <span>Processing Payment...</span>
                  </>
                ) : (
                  <>
                    <Lock className="h-5 w-5" />
                    <span>Complete Order</span>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Order Summary */}
          <div className="bg-white rounded-xl shadow-lg p-6 h-fit sticky top-24">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Order Summary</h2>
            
            <div className="space-y-4 mb-6">
              {items.map((item) => (
                <div key={item.id} className="flex items-center space-x-3">
                  <img
                    src={item.product.image_url}
                    alt={item.product.name}
                    className="w-12 h-12 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900">{item.product.name}</h3>
                    <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                  </div>
                  <span className="font-semibold text-gray-900">
                    ${(item.product.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
            
            <div className="space-y-2 mb-6">
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
                <span>${tax.toFixed(2)}</span>
              </div>
              <hr className="border-gray-200" />
              <div className="flex justify-between text-xl font-bold text-gray-900">
                <span>Total</span>
                <span>${finalTotal.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;