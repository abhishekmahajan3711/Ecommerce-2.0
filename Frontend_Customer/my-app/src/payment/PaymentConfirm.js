import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useSelector, useDispatch } from 'react-redux';
import { clearCart } from '../store/slices/cartSlice';

const PaymentConfirm = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const billingAddress = location.state?.billingAddress;
  const cart = useSelector(state => state.cart);
  const user = useSelector(state => state.auth.user);
  const [loading, setLoading] = useState(false);

  if (!billingAddress) {
    // If no billing address, go back to payment page
    navigate('/payment');
    return null;
  }

  const handlePlaceOrder = async () => {
    try {
      if (!cart || !cart.items || cart.items.length === 0) {
        alert('Your cart is empty');
        return;
      }

      setLoading(true);
      const token = localStorage.getItem('token');

      // Ensure we send name/phone from user if not present in billingAddress
      const payloadBilling = {
        ...billingAddress,
        name: billingAddress.name || user?.name || '',
        phone: billingAddress.phone || user?.phone || ''
      };

      const response = await axios.post('http://localhost:5000/api/orders', {
        billingAddress: payloadBilling
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data && response.data.success) {
        alert('Order Placed Successfully');
        // Clear cart in frontend state and on server
        dispatch(clearCart());
        navigate('/');
      } else {
        alert(response.data?.message || 'Failed to place order');
      }
    } catch (error) {
      console.error('Order error', error);
      alert(error.response?.data?.message || 'Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-slate-50 py-12 flex items-center justify-center">
      <div className="max-w-lg w-full bg-white p-6 rounded-lg shadow">
        <h2 className="text-2xl font-semibold mb-4">Complete Payment</h2>
        <p className="text-sm text-gray-600 mb-4">Scan the QR code with your payment app. Then click <span className="font-medium">Order</span> to finalize.</p>

        <div className="flex items-center justify-center mb-6">
          <div className="p-4 bg-slate-50 rounded">
            <img src={`http://localhost:5000/uploads/MyQRCode.jpeg`} alt="QR Code" className="block w-56 h-56 object-contain" />
          </div>
        </div>

        <div className="mb-4 text-sm text-gray-700">
          <div><strong>Payable:</strong> ₹{(cart.total || 0).toFixed(2)}</div>
          <div><strong>Name:</strong> {billingAddress.name || user?.name || '—'}</div>
          <div><strong>Phone:</strong> {billingAddress.phone || user?.phone || '—'}</div>
        </div>

        <button onClick={handlePlaceOrder} disabled={loading} className="w-full bg-green-600 text-white py-2 rounded hover:opacity-95">
          {loading ? 'Placing Order...' : 'Order'}
        </button>
      </div>
    </div>
  );
};

export default PaymentConfirm;
