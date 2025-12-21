import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaSearch, FaShoppingCart, FaUser, FaBars, FaTimes, FaMoon, FaSun } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { logout, getCurrentUser } from '../store/slices/authSlice';
import { fetchCart, clearCartState } from '../store/slices/cartSlice';
import { clearContactState } from '../store/slices/contactSlice';
import { toggleTheme } from '../store/slices/themeSlice';

const Header = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, isAuthenticated, token } = useSelector((state) => state.auth);
  const { itemCount: cartItemCount } = useSelector((state) => state.cart);
  const { mode: themeMode } = useSelector((state) => state.theme);

  const handleThemeToggle = () => {
    dispatch(toggleTheme());
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  useEffect(() => {
    if (token && !user) {
      dispatch(getCurrentUser());
    }
  }, [token, user, dispatch]);

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchCart());
    }
  }, [isAuthenticated, dispatch]);

  const handleLogout = () => {
    dispatch(logout());
    dispatch(clearCartState());
    dispatch(clearContactState());
    setIsUserMenuOpen(false);
    navigate('/');
  };

  return (
    <header className="bg-white dark:bg-gray-900 shadow-xl sticky top-0 z-50 border-b border-gray-200 dark:border-gray-700 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Brand */}
          <Link to="/" className="flex items-center space-x-1 group">
            <div className="relative">
              <img 
                src="/Logo2.png" 
                alt="AstraPharma Nexus" 
                className="h-12 w-auto transition-transform duration-300 group-hover:scale-105" 
              />
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-2xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                AstraPharma
              </span>
              <span className="text-sm font-medium text-gray-600 tracking-wider uppercase mt-2">
                
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            <Link 
              to="/products" 
              className="text-gray-700 hover:text-cyan-600 transition-all duration-300 font-medium relative group"
            >
              Products
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-cyan-400 to-purple-400 transition-all duration-300 group-hover:w-full"></span>
            </Link>
            <Link
              to="/orders"
              className="text-gray-700 hover:text-cyan-600 transition-all duration-300 font-medium relative group"
            >
              My Orders
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-cyan-400 to-purple-400 transition-all duration-300 group-hover:w-full"></span>
            </Link>
          </nav>

          {/* Search Bar */}
          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <form onSubmit={handleSearch} className="w-full">
              <div className="relative group">
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent text-gray-900 placeholder-gray-500 transition-all duration-300 group-hover:border-gray-400"
                />
                <button
                  type="submit"
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-cyan-400 transition-colors duration-300"
                >
                  <FaSearch className="text-lg" />
                </button>
              </div>
            </form>
          </div>

          {/* User Actions */}
          <div className="flex items-center space-x-4">
            {/* Theme Toggle */}
            <button
              onClick={handleThemeToggle}
              className="text-gray-700 hover:text-cyan-600 transition-all duration-300 group"
              aria-label="Toggle theme"
            >
              <div className="p-2 rounded-lg group-hover:bg-gray-100 transition-all duration-300">
                {themeMode === 'dark' ? (
                  <FaSun className="text-xl text-yellow-500" />
                ) : (
                  <FaMoon className="text-xl" />
                )}
              </div>
            </button>

            {/* Cart */}
            <button 
              onClick={() => {
                if (isAuthenticated) {
                  navigate('/cart');
                } else {
                  navigate('/signin');
                }
              }}
              className="relative text-gray-700 hover:text-cyan-600 transition-all duration-300 group"
            >
              <div className="p-2 rounded-lg group-hover:bg-gray-100 transition-all duration-300">
                <FaShoppingCart className="text-xl" />
              </div>
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs rounded-full h-6 w-6 flex items-center justify-center font-bold shadow-lg">
                  {cartItemCount}
                </span>
              )}
            </button>

            {/* User Menu */}
            <div className="relative">
              {isAuthenticated ? (
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center text-gray-700 hover:text-cyan-600 transition-all duration-300 group"
                >
                  <div className="p-2 rounded-lg group-hover:bg-gray-100 transition-all duration-300">
                    <FaUser className="text-xl" />
                  </div>
                  {user && (
                    <span className="ml-2 text-sm hidden sm:block font-medium">{user.name}</span>
                  )}
                </button>
              ) : (
                <Link 
                  to="/signin" 
                  className="text-gray-700 hover:text-cyan-600 transition-all duration-300 group"
                >
                  <div className="p-2 rounded-lg group-hover:bg-gray-100 transition-all duration-300">
                    <FaUser className="text-xl" />
                  </div>
                </Link>
              )}

              {/* User Dropdown Menu */}
              {isUserMenuOpen && (
                <div className="absolute right-0 mt-3 w-56 bg-white rounded-xl shadow-2xl py-2 z-50 border border-gray-200">
                  <Link
                    to="/profile"
                    className="block px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 transition-all duration-300"
                    onClick={() => setIsUserMenuOpen(false)}
                  >
                    Profile
                  </Link>
                  <Link
                    to="/orders"
                    className="block px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 transition-all duration-300"
                    onClick={() => setIsUserMenuOpen(false)}
                  >
                    My Orders
                  </Link>
                  <div className="border-t border-gray-200 my-1"></div>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-center px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-all duration-300"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden text-gray-700 hover:text-cyan-600 transition-all duration-300 p-2 rounded-lg hover:bg-gray-100"
            >
              {isMenuOpen ? <FaTimes className="text-xl" /> : <FaBars className="text-xl" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-6 border-t border-gray-200 bg-gray-50">
            {/* Mobile Search */}
            <form onSubmit={handleSearch} className="mb-6">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent text-gray-900 placeholder-gray-500"
                />
                <button
                  type="submit"
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-cyan-400"
                >
                  <FaSearch className="text-lg" />
                </button>
              </div>
            </form>

            {/* Mobile Navigation */}
            <nav className="space-y-1">
              <Link
                to="/"
                className="block py-3 px-4 text-gray-700 hover:text-cyan-600 hover:bg-gray-100 rounded-lg transition-all duration-300"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                to="/products"
                className="block py-3 px-4 text-gray-700 hover:text-cyan-600 hover:bg-gray-100 rounded-lg transition-all duration-300"
                onClick={() => setIsMenuOpen(false)}
              >
                Products
              </Link>
              <button
                onClick={() => {
                  setIsMenuOpen(false);
                  if (isAuthenticated) {
                    navigate('/cart');
                  } else {
                    navigate('/signin');
                  }
                }}
                className="block w-full text-left py-3 px-4 text-gray-700 hover:text-cyan-600 hover:bg-gray-100 rounded-lg transition-all duration-300 flex items-center justify-between"
              >
                <span>Cart</span>
                {cartItemCount > 0 && (
                  <span className="bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs rounded-full h-6 w-6 flex items-center justify-center font-bold">
                    {cartItemCount}
                  </span>
                )}
              </button>
              {!isAuthenticated && (
                <Link
                  to="/signin"
                  className="block py-3 px-4 text-gray-700 hover:text-cyan-600 hover:bg-gray-100 rounded-lg transition-all duration-300"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Sign In
                </Link>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
