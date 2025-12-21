import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const ORDER_STATUSES = ['pending','confirmed','processing','shipped','delivered','cancelled','returned'];
const PAYMENT_STATUSES = ['pending','processing','completed','failed','refunded'];

const OrderManagement = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ orderStatus: '', paymentStatus: '', search: '' });
  const [saving, setSaving] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      navigate('/admin/signin');
      return;
    }
    fetchOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigate]);

  const fetchOrders = async (params = {}) => {
    try {
      setLoading(true);
      const token = localStorage.getItem('adminToken');
      const res = await axios.get('http://localhost:5000/api/admin/orders', {
        headers: { Authorization: `Bearer ${token}` },
        params: { ...filters, ...params }
      });
      if (res.data && res.data.success) setOrders(res.data.data || []);
    } catch (err) {
      console.error('Fetch admin orders error', err);
      window.alert(err.response?.data?.message || 'Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    navigate('/admin/signin');
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const applyFilters = () => fetchOrders({ page: 1 });

  const handleStatusUpdate = async (orderId, field, value) => {
    try {
      setSaving(prev => ({ ...prev, [orderId]: true }));
      const token = localStorage.getItem('adminToken');
      const payload = {};
      payload[field] = value;
      const res = await axios.put(`http://localhost:5000/api/admin/orders/${orderId}`, payload, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data && res.data.success) {
        setOrders(prev => prev.map(o => o._id === orderId ? res.data.data : o));
        window.alert('Order updated');
      } else {
        window.alert(res.data?.message || 'Failed to update order');
      }
    } catch (err) {
      console.error('Update order error', err);
      window.alert(err.response?.data?.message || 'Failed to update order');
    } finally {
      setSaving(prev => ({ ...prev, [orderId]: false }));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow mb-6">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-4">
                <button 
                  onClick={() => navigate('/admin/dashboard')}
                  className="p-2 hover:bg-gray-100 rounded-lg transition"
                >
                  <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <h1 className="text-2xl font-bold text-gray-900">Order Management</h1>
              </div>
              <button onClick={handleLogout} className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700">
                Logout
              </button>
            </div>
          </div>

          {/* Stats */}
          <div className="px-6 py-4 bg-gray-50">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{orders.length || 0}</div>
                <div className="text-sm text-gray-600">Total Orders</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{orders.filter(o => o.paymentStatus === 'completed').length || 0}</div>
                <div className="text-sm text-gray-600">Completed</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-600">{orders.filter(o => o.orderStatus === 'pending').length || 0}</div>
                <div className="text-sm text-gray-600">Pending</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">{orders.filter(o => o.orderStatus === 'delivered').length || 0}</div>
                <div className="text-sm text-gray-600">Delivered</div>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow mb-6">
          <div className="p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Filters</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
                <input 
                  type="text"
                  name="search"
                  value={filters.search}
                  onChange={handleFilterChange}
                  placeholder="Order number, name, phone..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Order Status</label>
                <select 
                  name="orderStatus"
                  value={filters.orderStatus}
                  onChange={handleFilterChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
                >
                  <option value="">All Status</option>
                  {ORDER_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Payment Status</label>
                <select 
                  name="paymentStatus"
                  value={filters.paymentStatus}
                  onChange={handleFilterChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
                >
                  <option value="">All Status</option>
                  {PAYMENT_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>

              <div className="flex items-end gap-2">
                <button 
                  onClick={applyFilters}
                  className="flex-1 px-4 py-2 text-sm font-medium text-white bg-cyan-600 rounded-md hover:bg-cyan-700"
                >
                  Apply
                </button>
                <button 
                  onClick={() => { setFilters({ orderStatus: '', paymentStatus: '', search: ''}); fetchOrders({ page: 1 }); }}
                  className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                >
                  Reset
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Orders Table */}
        <div className="bg-white rounded-lg shadow">
          {loading ? (
            <div className="p-6 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-600 mx-auto"></div>
              <p className="text-gray-600 mt-4">Loading orders...</p>
            </div>
          ) : orders.length === 0 ? (
            <div className="p-6 text-center text-gray-500">
              <p>No orders found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-700 uppercase">Order</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-700 uppercase">Customer</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-700 uppercase">Amount</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-700 uppercase">Order Status</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-700 uppercase">Payment Status</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-700 uppercase">Date</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-700 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order, index) => {
                    const orderStatusClass = order.orderStatus === 'cancelled' ? 'bg-red-100 text-red-800' : order.orderStatus === 'delivered' ? 'bg-green-100 text-green-800' : order.orderStatus === 'shipped' ? 'bg-blue-100 text-blue-800' : 'bg-yellow-100 text-yellow-800';
                    const paymentStatusClass = order.paymentStatus === 'completed' ? 'bg-green-100 text-green-800' : order.paymentStatus === 'failed' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800';
                    return (
                      <tr key={order._id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{order.orderNumber}</td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          <div>{order.user?.name || order.billingAddress?.name || '-'}</div>
                          <div className="text-xs text-gray-500">{order.billingAddress?.phone}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">₹{(order.total||0).toFixed(2)}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <select 
                            value={order.orderStatus} 
                            onChange={(e) => handleStatusUpdate(order._id, 'orderStatus', e.target.value)}
                            className={`px-2 py-1 text-xs font-medium rounded ${orderStatusClass} border-0 focus:outline-none focus:ring-2 focus:ring-cyan-500`}
                          >
                            {ORDER_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                          </select>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <select 
                            value={order.paymentStatus}
                            onChange={(e) => handleStatusUpdate(order._id, 'paymentStatus', e.target.value)}
                            className={`px-2 py-1 text-xs font-medium rounded ${paymentStatusClass} border-0 focus:outline-none focus:ring-2 focus:ring-cyan-500`}
                          >
                            {PAYMENT_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                          </select>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(order.createdAt).toLocaleDateString()}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <button 
                            onClick={() => navigate(`/admin/orders/${order._id}`)}
                            className="text-cyan-600 hover:text-cyan-900 font-medium"
                          >
                            View
                          </button>
                          {saving[order._id] && <span className="ml-2 text-gray-500">Saving...</span>}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderManagement;