import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaEye, FaEyeSlash, FaEnvelope, FaLock, FaCheckCircle, FaMoon, FaSun } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { signin, clearError } from '../store/slices/authSlice';
import { toggleTheme } from '../store/slices/themeSlice';

const Signin = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isAnimated, setIsAnimated] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, error, isAuthenticated } = useSelector((state) => state.auth);
  const { mode: themeMode } = useSelector((state) => state.theme);

  const handleThemeToggle = () => {
    dispatch(toggleTheme());
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  // Scroll to top and animate when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
    setTimeout(() => setIsAnimated(true), 100);
  }, []);

  useEffect(() => {
    if (error) {
      setErrors({ general: error });
      dispatch(clearError());
    }
  }, [error, dispatch]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    dispatch(signin(formData));
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-cyan-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-slate-900 dark:to-gray-800 flex flex-col justify-center py-12 sm:px-6 lg:px-8 transition-colors duration-500">
      {/* Theme Toggle Button */}
      <button
        onClick={handleThemeToggle}
        className="fixed top-6 right-6 z-50 p-4 bg-white dark:bg-gray-800 rounded-full shadow-xl hover:shadow-2xl transform hover:scale-110 transition-all duration-300 border-2 border-cyan-200 dark:border-gray-700 group"
        aria-label="Toggle theme"
      >
        {themeMode === 'dark' ? (
          <FaSun className="text-2xl text-yellow-400 group-hover:rotate-180 transition-transform duration-500" />
        ) : (
          <FaMoon className="text-2xl text-indigo-600 group-hover:-rotate-12 transition-transform duration-500" />
        )}
      </button>

      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-gradient-to-br from-pink-400 to-rose-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <div className={`sm:mx-auto sm:w-full sm:max-w-md transform transition-all duration-700 ${isAnimated ? 'translate-y-0 opacity-100' : '-translate-y-10 opacity-0'}`}>
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 dark:from-cyan-400 dark:to-blue-500 shadow-lg mb-6 transform hover:scale-110 transition-transform duration-300">
            <FaCheckCircle className="text-white text-4xl animate-pulse" />
          </div>
          <h2 className="text-4xl font-extrabold bg-gradient-to-r from-cyan-600 to-blue-600 dark:from-cyan-400 dark:to-blue-400 bg-clip-text text-transparent">
            Welcome Back! 👋
          </h2>
          <p className="mt-3 text-base text-gray-600 dark:text-gray-300">
            Sign in to continue your journey
          </p>
        </div>
      </div>

      <div className={`mt-8 sm:mx-auto sm:w-full sm:max-w-md transform transition-all duration-700 delay-200 ${isAnimated ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl py-10 px-6 shadow-2xl rounded-2xl sm:px-12 border border-white/20 dark:border-gray-700/30 relative overflow-hidden transition-colors duration-500">
          {/* Decorative gradient border effect */}
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <div className="absolute inset-[2px] rounded-2xl bg-white dark:bg-gray-800 transition-colors duration-500"></div>
          
          <form className="space-y-6 relative z-10" onSubmit={handleSubmit}>
            {errors.general && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg animate-shake backdrop-blur-sm">
                <div className="flex items-center">
                  <span className="text-xl mr-2">⚠️</span>
                  {errors.general}
                </div>
              </div>
            )}

            <div className="transform transition-all duration-300 hover:translate-x-1">
              <label htmlFor="email" className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">
                <FaEnvelope className="inline mr-2 text-cyan-600 dark:text-cyan-400" />
                Email address
              </label>
              <div className="relative group">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className={`appearance-none block w-full px-4 py-3 border-2 rounded-xl shadow-sm placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-300 text-gray-900 dark:text-white ${
                    errors.email ? 'border-red-300 bg-red-50 dark:border-red-600 dark:bg-red-900/20' : 'border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 hover:border-cyan-300 dark:hover:border-cyan-500'
                  }`}
                  placeholder="you@example.com"
                />
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 opacity-0 group-focus-within:opacity-20 transition-opacity duration-300 pointer-events-none"></div>
              </div>
              {errors.email && (
                <p className="mt-2 text-sm text-red-600 animate-fadeIn flex items-center">
                  <span className="mr-1">⚠️</span> {errors.email}
                </p>
              )}
            </div>

            <div className="transform transition-all duration-300 hover:translate-x-1">
              <label htmlFor="password" className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">
                <FaLock className="inline mr-2 text-cyan-600 dark:text-cyan-400" />
                Password
              </label>
              <div className="relative group">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className={`appearance-none block w-full px-4 py-3 pr-12 border-2 rounded-xl shadow-sm placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-300 text-gray-900 dark:text-white ${
                    errors.password ? 'border-red-300 bg-red-50 dark:border-red-600 dark:bg-red-900/20' : 'border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 hover:border-cyan-300 dark:hover:border-cyan-500'
                  }`}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-4 flex items-center hover:scale-110 transition-transform duration-200"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <FaEyeSlash className="h-5 w-5 text-gray-400 hover:text-cyan-600 transition-colors" />
                  ) : (
                    <FaEye className="h-5 w-5 text-gray-400 hover:text-cyan-600 transition-colors" />
                  )}
                </button>
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 opacity-0 group-focus-within:opacity-20 transition-opacity duration-300 pointer-events-none"></div>
              </div>
              {errors.password && (
                <p className="mt-2 text-sm text-red-600 animate-fadeIn flex items-center">
                  <span className="mr-1">⚠️</span> {errors.password}
                </p>
              )}
            </div>

            <div className="flex items-center justify-end">
              <div className="text-sm">
                <Link to="/forgot-password" className="font-medium text-cyan-600 dark:text-cyan-400 hover:text-cyan-700 dark:hover:text-cyan-300 transition-colors duration-200 hover:underline">
                  Forgot your password? 🔑
                </Link>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="group relative w-full flex justify-center py-3 px-4 border border-transparent rounded-xl text-base font-semibold text-white bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 disabled:opacity-50 disabled:cursor-not-allowed transform transition-all duration-300 hover:scale-[1.02] hover:shadow-xl overflow-hidden"
              >
                <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-cyan-400 to-blue-400 opacity-0 group-hover:opacity-30 transition-opacity duration-300"></span>
                <span className="absolute right-0 w-8 h-32 -mt-12 transition-all duration-1000 transform translate-x-12 bg-white opacity-10 rotate-12 group-hover:-translate-x-40 ease"></span>
                <span className="relative flex items-center">
                  {loading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Signing in...
                    </>
                  ) : (
                    <>
                      Sign in
                      <svg className="ml-2 -mr-1 w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </>
                  )}
                </span>
              </button>
            </div>
          </form>

          <div className="mt-8 text-center relative z-10">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400">New here?</span>
              </div>
            </div>
            <p className="mt-4 text-sm text-gray-600 dark:text-gray-300">
              <Link to="/signup" className="font-semibold text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 to-blue-600 dark:from-cyan-400 dark:to-blue-400 hover:from-cyan-700 hover:to-blue-700 dark:hover:from-cyan-300 dark:hover:to-blue-300 transition-all duration-300 hover:underline">
                Create an account ✨
              </Link>
            </p>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
          20%, 40%, 60%, 80% { transform: translateX(5px); }
        }
        .animate-shake {
          animation: shake 0.5s;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default Signin;
