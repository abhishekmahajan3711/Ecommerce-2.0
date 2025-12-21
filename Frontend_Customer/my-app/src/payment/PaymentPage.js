import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const PaymentPage = () => {
  const navigate = useNavigate();
  const user = useSelector(state => state.auth.user);
  const cart = useSelector(state => state.cart);

  const [billingAddress, setBillingAddress] = useState({
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'USA'
  });

  useEffect(() => {
    // If user has saved address in profile, prefill fields
    if (user && user.address) {
      setBillingAddress(prev => ({ ...prev, ...user.address }));
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBillingAddress(prev => ({ ...prev, [name]: value }));
  };

  const handleProceed = (e) => {
    e.preventDefault();
    // Merge user name/phone automatically and navigate
    const merged = {
      ...billingAddress,
      name: user?.name || '',
      phone: user?.phone || ''
    };
    navigate('/payment/confirm', { state: { billingAddress: merged } });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden grid grid-cols-1 lg:grid-cols-2">
          <div className="p-8">
            <h1 className="text-2xl font-bold mb-2">Billing Address</h1>
            <p className="text-sm text-gray-500 mb-6">We will use your account name and phone number automatically.</p>

            <form onSubmit={handleProceed} className="space-y-4">
              <div className="text-sm">
                <label className="block text-gray-600">Full Name</label>
                <div className="mt-1 text-gray-800 font-medium">{user?.name || '—'}</div>
              </div>

              <div className="text-sm">
                <label className="block text-gray-600">Phone</label>
                <div className="mt-1 text-gray-800 font-medium">{user?.phone || '—'}</div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Street</label>
                <input name="street" value={billingAddress.street} onChange={handleChange} required className="mt-1 block w-full border border-gray-200 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-200" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">City</label>
                  <input name="city" value={billingAddress.city} onChange={handleChange} required className="mt-1 block w-full border border-gray-200 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-200" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">State</label>
                  <input name="state" value={billingAddress.state} onChange={handleChange} required className="mt-1 block w-full border border-gray-200 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-200" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">ZIP</label>
                  <input name="zipCode" value={billingAddress.zipCode} onChange={handleChange} required className="mt-1 block w-full border border-gray-200 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-200" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Country</label>
                  <input name="country" value={billingAddress.country} onChange={handleChange} required className="mt-1 block w-full border border-gray-200 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-200" />
                </div>
              </div>

              <button type="submit" className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-md shadow hover:opacity-95">Proceed</button>
            </form>
          </div>

          <div className="p-8 bg-slate-50">
            <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
            <div className="space-y-3">
              <div className="flex justify-between text-sm text-gray-600">
                <span>Items</span>
                <span>{cart.itemCount || 0}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-600">
                <span>Subtotal</span>
                <span>₹{(cart.total || 0).toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-600">
                <span>Shipping</span>
                <span>₹0.00</span>
              </div>
              <div className="border-t pt-3 flex justify-between items-center">
                <span className="font-semibold">Total</span>
                <span className="font-bold text-lg">₹{(cart.total || 0).toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;
