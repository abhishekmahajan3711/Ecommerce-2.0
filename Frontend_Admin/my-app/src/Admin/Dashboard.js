import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../hooks/useTheme';

const AdminDashboard = () => {
  const [adminUser, setAdminUser] = useState(null);
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    const user = localStorage.getItem('adminUser');
    
    if (!token || !user) {
      navigate('/admin/signin');
      return;
    }

    setAdminUser(JSON.parse(user));
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    navigate('/admin/signin');
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-300">
      {/* Simple Header */}
      <header className="bg-white dark:bg-gray-800 border-b dark:border-gray-700 transition-colors duration-300">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-xl font-semibold text-gray-900 dark:text-white">AstraPharma Admin</h1>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600 dark:text-gray-300">Welcome, {adminUser?.name}</span>
              <button
                onClick={toggleTheme}
                className="p-2 rounded-lg bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors duration-300"
                aria-label="Toggle theme"
              >
                {theme === 'dark' ? '☀️' : '🌙'}
              </button>
              <button
                onClick={handleLogout}
                className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm transition-colors duration-300"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Simple Navigation */}
        <div className="bg-white dark:bg-gray-800 rounded border dark:border-gray-700 transition-colors duration-300">
          <div className="p-6">
            <h2 className="text-lg font-medium mb-4 text-gray-900 dark:text-white">Quick Actions</h2>
            <div className="space-y-3">
              <button
                onClick={() => navigate('/admin/products')}
                className="w-full text-left p-3 border dark:border-gray-700 rounded hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-300"
              >
                <div className="font-medium text-gray-900 dark:text-white">Manage Products</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Add, edit, or delete products</div>
              </button>
              
              <button
                onClick={() => navigate('/admin/orders')}
                className="w-full text-left p-3 border dark:border-gray-700 rounded hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-300"
              >
                <div className="font-medium text-gray-900 dark:text-white">View Orders</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Monitor customer orders</div>
              </button>

              <button
                onClick={() => navigate('/admin/contacts')}
                className="w-full text-left p-3 border dark:border-gray-700 rounded hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-300"
              >
                <div className="font-medium text-gray-900 dark:text-white">Contact Management</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">View and manage customer inquiries</div>
              </button>

              <button
                onClick={() => navigate('/admin/customers')}
                className="w-full text-left p-3 border dark:border-gray-700 rounded hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-300"
              >
                <div className="font-medium text-gray-900 dark:text-white">Customer Management</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">View and manage customer accounts</div>
              </button>

              <button
                onClick={() => navigate('/admin/home')}
                className="w-full text-left p-3 border dark:border-gray-700 rounded hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-300"
              >
                <div className="font-medium text-gray-900 dark:text-white">Edit Home Page</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Customize hero, categories, and more</div>
              </button>

              <button
                onClick={() => navigate('/admin/profile')}
                className="w-full text-left p-3 border dark:border-gray-700 rounded hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-300"
              >
                <div className="font-medium text-gray-900 dark:text-white">Profile Settings</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Update your account information</div>
              </button>

            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard; 