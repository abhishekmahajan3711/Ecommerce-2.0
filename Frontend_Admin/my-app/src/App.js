import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import AdminSignin from './Admin/Signin';
import AdminDashboard from './Admin/Dashboard';
import AdminProfile from './Admin/Profile';
import ProductManagement from './Products/ProductManagement';
import AddProduct from './Products/AddProduct';
import EditProduct from './Products/EditProduct';
import OrderManagement from './Orders/OrderManagement';
import OrderDetail from './Orders/OrderDetail';
import EditHomePage from './HomePage/EditHomePage';
import HeroSectionCustomize from './HomePage/HeroSectionCustomize';
import ContactManagement from './ContactManagement/ContactManagement';
import CategoryManagement from './Categories/CategoryManagement';
import CustomerManagement from './Customers/CustomerManagement';

function App() {
  useEffect(() => {
    // Initialize theme from localStorage on app mount
    const savedTheme = localStorage.getItem('adminTheme') || 'light';
    if (savedTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  return (
    <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <div className="App bg-white dark:bg-gray-900 min-h-screen transition-colors duration-300">
        <Routes>
          <Route path="/admin/signin" element={<AdminSignin />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/profile" element={<AdminProfile />} />
          <Route path="/admin/products" element={<ProductManagement />} />
          <Route path="/admin/products/add" element={<AddProduct />} />
          <Route path="/admin/products/edit/:id" element={<EditProduct />} />
          <Route path="/admin/orders" element={<OrderManagement />} />
          <Route path="/admin/orders/:id" element={<OrderDetail />} />
          <Route path="/admin/contacts" element={<ContactManagement />} />
          <Route path="/admin/categories" element={<CategoryManagement />} />
          <Route path="/admin/customers" element={<CustomerManagement />} />
          <Route path="/admin/home" element={<EditHomePage />} />
          <Route path="/admin/hero" element={<HeroSectionCustomize />} />
          <Route path="/" element={<Navigate to="/admin/signin" replace />} />
          <Route path="/dashboard" element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="*" element={<Navigate to="/admin/signin" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
