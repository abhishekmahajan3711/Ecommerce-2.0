import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useSelector, useDispatch } from 'react-redux';
import { fetchCart } from '../store/slices/cartSlice';

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [cancelling, setCancelling] = useState({});
  const token = localStorage.getItem('token');
  const dispatch = useDispatch();

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await axios.get('http://localhost:5000/api/orders', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data && res.data.success) setOrders(res.data.data || []);
    } catch (err) {
      console.error('Fetch orders error', err);
      window.alert(err.response?.data?.message || 'Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleCancel = async (orderId) => {
    if (!window.confirm('Are you sure you want to cancel this order?')) return;
    try {
      setCancelling(prev => ({ ...prev, [orderId]: true }));
      const res = await axios.patch(`http://localhost:5000/api/orders/${orderId}/cancel`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data && res.data.success) {
        // update order in local list
        setOrders(prev => prev.map(o => o._id === orderId ? res.data.data : o));
        // refresh cart (in case cancellation affects stock/cart business rules)
        dispatch(fetchCart());
        window.alert('Order cancelled');
      } else {
        alert(res.data?.message || 'Failed to cancel order');
      }
    } catch (err) {
      console.error('Cancel error', err);
      window.alert(err.response?.data?.message || 'Failed to cancel order');
    } finally {
      setCancelling(prev => ({ ...prev, [orderId]: false }));
    }
  };

  const statusStyles = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'confirmed': return 'bg-blue-100 text-blue-800';
      case 'processing': return 'bg-indigo-100 text-indigo-800';
      case 'shipped': return 'bg-purple-100 text-purple-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getImageUrl = (src) => {
    if (!src) return '/placeholder.png';
    if (src.startsWith('http')) return src;
    if (src.startsWith('/')) return src;
    // assume path relative to backend uploads
    return `http://localhost:5000${src.startsWith('/uploads') ? '' : '/uploads/'}${src}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white py-10">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-semibold">Your Orders</h1>
          <div className="text-sm text-gray-600">{orders.length} orders</div>
        </div>

        {loading ? (
          <div className="bg-white p-6 rounded shadow">Loading orders...</div>
        ) : orders.length === 0 ? (
          <div className="bg-white p-6 rounded shadow">You have no orders yet.</div>
        ) : (
          <div className="space-y-4">
            {orders.map(order => (
              <div key={order._id} className="bg-white p-4 rounded-lg shadow flex flex-col lg:flex-row gap-4">
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="text-sm text-gray-500">Order #{order.orderNumber}</div>
                      <div className="text-sm text-gray-400">{new Date(order.createdAt).toLocaleString()}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold">₹{(order.total || 0).toFixed(2)}</div>
                      <div className={`mt-1 inline-block px-2 py-1 text-sm rounded ${statusStyles(order.orderStatus)}`}>{order.orderStatus}</div>
                    </div>
                  </div>

                  <div className="mt-3 border-t pt-3 space-y-2">
                    {order.items && order.items.map(item => (
                      <div key={item._id || item.sku} className="flex items-center gap-4 py-2">
                        <img src={getImageUrl(item.image)} alt={item.name} className="w-16 h-16 object-cover rounded" />
                        <div className="flex-1">
                          <div className="font-medium">{item.name}</div>
                          <div className="text-sm text-gray-500">Qty: {item.quantity}</div>
                        </div>
                        <div className="font-medium">₹{(item.price * item.quantity).toFixed(2)}</div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="lg:w-48 lg:flex-shrink-0 flex flex-col justify-between">
                  <div className="text-sm text-gray-600">
                    <div><strong>Payment:</strong> {order.paymentStatus}</div>
                    <div className="mt-2"><strong>Shipping:</strong> {order.shippingAddress?.city || '-'}</div>
                  </div>

                  <div className="mt-4">
                    {['pending','confirmed','processing'].includes(order.orderStatus) ? (
                      <button disabled={cancelling[order._id]} onClick={() => handleCancel(order._id)} className="w-full px-4 py-2 bg-red-600 text-white rounded">
                        {cancelling[order._id] ? 'Cancelling...' : 'Cancel Order'}
                      </button>
                    ) : (
                      <button disabled className="w-full px-4 py-2 bg-gray-200 text-gray-600 rounded">Not cancellable</button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrdersPage;
