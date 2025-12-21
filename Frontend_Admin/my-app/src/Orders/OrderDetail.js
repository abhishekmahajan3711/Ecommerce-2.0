import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const OrderDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const token = localStorage.getItem('adminToken');
        const res = await axios.get(`http://localhost:5000/api/admin/orders/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.data && res.data.success) setOrder(res.data.data);
      } catch (err) {
        console.error(err);
        window.alert(err.response?.data?.message || 'Failed to load order');
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [id]);

  if (loading) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-600"></div>
    </div>
  );
  if (!order) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-gray-500">Order not found</div>
    </div>
  );

  const orderStatusClass = order.orderStatus === 'cancelled' ? 'bg-red-100 text-red-800' : order.orderStatus === 'delivered' ? 'bg-green-100 text-green-800' : order.orderStatus === 'shipped' ? 'bg-blue-100 text-blue-800' : 'bg-yellow-100 text-yellow-800';
  const paymentStatusClass = order.paymentStatus === 'completed' ? 'bg-green-100 text-green-800' : order.paymentStatus === 'failed' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800';

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow mb-6">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <button 
                  onClick={() => navigate('/admin/orders')}
                  className="p-2 hover:bg-gray-100 rounded-lg transition"
                >
                  <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Order #{order.orderNumber}</h1>
                  <p className="text-sm text-gray-500">{new Date(order.createdAt).toLocaleDateString()} at {new Date(order.createdAt).toLocaleTimeString()}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${orderStatusClass}`}>{order.orderStatus}</span>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${paymentStatusClass}`}>{order.paymentStatus}</span>
              </div>
            </div>
          </div>

          {/* Summary Bar */}
          <div className="px-6 py-4 bg-gray-50 grid grid-cols-3 gap-4">
            <div>
              <div className="text-sm text-gray-600">Total Amount</div>
              <div className="text-2xl font-bold text-gray-900">₹{(order.total||0).toFixed(2)}</div>
            </div>
            <div>
              <div className="text-sm text-gray-600">Items</div>
              <div className="text-2xl font-bold text-gray-900">{order.items?.length || 0}</div>
            </div>
            <div>
              <div className="text-sm text-gray-600">Order ID</div>
              <div className="text-lg font-mono text-gray-900">{order._id?.slice(-8) || '-'}</div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Items and Addresses */}
          <div className="lg:col-span-2 space-y-6">
            {/* Items Section */}
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Order Items</h2>
              </div>
              <div className="divide-y divide-gray-200">
                {order.items.map((item, index) => (
                  <div key={item._id || index} className="px-6 py-4 hover:bg-gray-50 transition">
                    <div className="flex gap-4">
                      <img 
                        src={item.image || '/placeholder.png'} 
                        alt={item.name} 
                        className="w-20 h-20 object-cover rounded-lg bg-gray-100"
                      />
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900">{item.name}</h3>
                        {item.variant && <p className="text-sm text-gray-500">{item.variant}</p>}
                        <p className="text-sm text-gray-600 mt-1">Quantity: {item.quantity}</p>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold text-gray-900">₹{(item.price * item.quantity).toFixed(2)}</div>
                        <div className="text-sm text-gray-500">₹{item.price.toFixed(2)} × {item.quantity}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Addresses Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Billing Address */}
              <div className="bg-white rounded-lg shadow">
                <div className="px-6 py-4 border-b border-gray-200 bg-blue-50">
                  <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                    <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 1C6.48 1 2 5.48 2 11c0 3.54 1.51 6.7 3.91 8.92.2 1.46.86 2.96 1.88 4.22l1.23-1.23c-.95-1.01-1.52-2.16-1.71-3.42C5.8 19.88 4 16.25 4 12c0-4.41 3.59-8 8-8s8 3.59 8 8c0 4.25-1.8 7.88-4.31 10.49-.19 1.26-.76 2.41-1.71 3.42l1.23 1.23c1.02-1.26 1.68-2.76 1.88-4.22 2.4-2.22 3.91-5.38 3.91-8.92 0-5.52-4.48-10-10-10zm3.5 9c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5-1.5-.67-1.5-1.5.67-1.5 1.5-1.5zm-7 0c.83 0 1.5.67 1.5 1.5S9.33 12 8.5 12 7 11.33 7 10.5 7.67 9 8.5 9z"/>
                    </svg>
                    Billing Address
                  </h3>
                </div>
                <div className="px-6 py-4 text-sm space-y-1 text-gray-700">
                  <p className="font-semibold text-gray-900">{order.billingAddress?.name}</p>
                  <p>{order.billingAddress?.phone}</p>
                  <p>{order.billingAddress?.street}</p>
                  <p>{order.billingAddress?.city}, {order.billingAddress?.state} {order.billingAddress?.zipCode}</p>
                  <p>{order.billingAddress?.country}</p>
                </div>
              </div>

              {/* Shipping Address */}
              <div className="bg-white rounded-lg shadow">
                <div className="px-6 py-4 border-b border-gray-200 bg-green-50">
                  <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                    <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M18 18.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM9 18.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM20 8H4V4h16v4zm0 4H4v8a2 2 0 002 2h12a2 2 0 002-2v-8z"/>
                    </svg>
                    Shipping Address
                  </h3>
                </div>
                <div className="px-6 py-4 text-sm space-y-1 text-gray-700">
                  <p className="font-semibold text-gray-900">{order.shippingAddress?.name}</p>
                  <p>{order.shippingAddress?.phone}</p>
                  <p>{order.shippingAddress?.street}</p>
                  <p>{order.shippingAddress?.city}, {order.shippingAddress?.state} {order.shippingAddress?.zipCode}</p>
                  <p>{order.shippingAddress?.country}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Summary */}
          <div className="bg-white rounded-lg shadow h-fit">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="font-semibold text-gray-900">Order Summary</h3>
            </div>

            <div className="px-6 py-4 space-y-3 border-b border-gray-200">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Subtotal</span>
                <span className="text-gray-900">₹{(order.subtotal||0).toFixed(2)}</span>
              </div>
              {(order.discount || 0) > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Discount</span>
                  <span className="text-red-600">-₹{(order.discount||0).toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Tax</span>
                <span className="text-gray-900">₹{(order.tax||0).toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Shipping</span>
                <span className="text-gray-900">₹{(order.shipping||0).toFixed(2)}</span>
              </div>
            </div>

            <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <span className="font-semibold text-gray-900">Total</span>
                <span className="text-2xl font-bold text-cyan-600">₹{(order.total||0).toFixed(2)}</span>
              </div>
            </div>

            <div className="px-6 py-4 space-y-2">
              <button 
                onClick={() => navigate('/admin/orders')}
                className="w-full px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition"
              >
                Back to Orders
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;
