import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import './App.css';
import Header from './header/Header';
import Footer from './footer/Footer';
import Home from './home/Home';
import Signin from './user/Signin';
import Signup from './user/Signup';
import FilterPage from './filter/FilterPage';
import SpecificProduct from './products/SpecificProduct';
import PaymentPage from './payment/PaymentPage';
import PaymentConfirm from './payment/PaymentConfirm';
import OrdersPage from './orders/OrdersPage';
import CartPage from './cart/CartPage';
import Profile from './user/Profile';
import ForgotPassword from './user/ForgotPassword';
import VerifyEmail from './user/VerifyEmail';

// Customer Service Pages
import ContactUs from './customer_service/ContactUs';
import FAQ from './customer_service/FAQ';
import ShippingInfo from './customer_service/ShippingInfo';
import ExchangeReturn from './customer_service/ExchangeReturn';

// Policy Pages
import PrivacyPolicy from './policy/PrivacyPolicy';
import TermsConditions from './policy/TermsConditions';
import CookiesPolicy from './policy/CookiesPolicy';

function App() {
  const { mode: themeMode } = useSelector((state) => state.theme);

  useEffect(() => {
    // Apply theme class to document on mount and when theme changes
    if (themeMode === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [themeMode]);

  return (
    <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <div className="App min-h-screen flex flex-col bg-white dark:bg-gray-900 transition-colors duration-300">
        <Header />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/signin" element={<Signin />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/products" element={<FilterPage />} />
            <Route path="/product/:id" element={<SpecificProduct />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/payment" element={<PaymentPage />} />
            <Route path="/payment/confirm" element={<PaymentConfirm />} />
            <Route path="/orders" element={<OrdersPage />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/verify-email" element={<VerifyEmail />} />
            
            {/* Customer Service Routes */}
            <Route path="/contact" element={<ContactUs />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/shipping" element={<ShippingInfo />} />
            <Route path="/returns" element={<ExchangeReturn />} />
            
            {/* Policy Routes */}
            <Route path="/privacy" element={<PrivacyPolicy />} />
            <Route path="/terms" element={<TermsConditions />} />
            <Route path="/cookies" element={<CookiesPolicy />} />
            
            {/* Redirect dashboard to home */}
            <Route path="/dashboard" element={<Navigate to="/" replace />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
