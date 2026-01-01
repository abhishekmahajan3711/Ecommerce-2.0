import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaEye, FaEyeSlash, FaUser, FaEnvelope, FaPhone, FaLock, FaRocket, FaMoon, FaSun } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { signup, clearError } from '../store/slices/authSlice';
import { toggleTheme } from '../store/slices/themeSlice';

const Signup = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: false
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
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
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
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

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    } else if (formData.firstName.trim().length < 2) {
      newErrors.firstName = 'First name must be at least 2 characters';
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    } else if (formData.lastName.trim().length < 2) {
      newErrors.lastName = 'Last name must be at least 2 characters';
    }

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.phone) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^[\+]?[1-9][\d]{0,15}$/.test(formData.phone.replace(/\s/g, ''))) {
      newErrors.phone = 'Phone number is invalid';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password = 'Password must contain at least one uppercase letter, one lowercase letter, and one number';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (!formData.agreeToTerms) {
      newErrors.agreeToTerms = 'You must agree to the terms and conditions';
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

    // Prepare user data for backend
    const userData = {
      name: `${formData.firstName} ${formData.lastName}`,
      email: formData.email,
      password: formData.password,
      phone: formData.phone
    };

    dispatch(signup(userData));
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-purple-50 via-pink-50 to-rose-100 dark:from-gray-900 dark:via-purple-900 dark:to-gray-800 flex flex-col justify-center py-12 sm:px-6 lg:px-8 transition-colors duration-500">
      {/* Theme Toggle Button */}
      <button
        onClick={handleThemeToggle}
        className="fixed top-6 right-6 z-50 p-4 bg-white dark:bg-gray-800 rounded-full shadow-xl hover:shadow-2xl transform hover:scale-110 transition-all duration-300 border-2 border-purple-200 dark:border-gray-700 group"
        aria-label="Toggle theme"
      >
        {themeMode === 'dark' ? (
          <FaSun className="text-2xl text-yellow-400 group-hover:rotate-180 transition-transform duration-500" />
        ) : (
          <FaMoon className="text-2xl text-purple-600 group-hover:-rotate-12 transition-transform duration-500" />
        )}
      </button>

      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 -left-40 w-80 h-80 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute -bottom-20 right-20 w-80 h-80 bg-gradient-to-br from-rose-400 to-orange-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/3 right-1/3 w-80 h-80 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <div className={`sm:mx-auto sm:w-full sm:max-w-md transform transition-all duration-700 ${isAnimated ? 'translate-y-0 opacity-100' : '-translate-y-10 opacity-0'}`}>
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-purple-500 to-pink-600 dark:from-purple-400 dark:to-pink-500 shadow-lg mb-6 transform hover:scale-110 transition-transform duration-300 hover:rotate-12">
            <FaRocket className="text-white text-4xl" />
          </div>
          <h2 className="text-4xl font-extrabold bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-400 dark:to-pink-400 bg-clip-text text-transparent">
            Join Us Today! 🎉
          </h2>
          <p className="mt-3 text-base text-gray-600 dark:text-gray-300">
            Create your account and start your amazing journey
          </p>
        </div>
      </div>

      <div className={`mt-8 sm:mx-auto sm:w-full sm:max-w-md transform transition-all duration-700 delay-200 ${isAnimated ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl py-10 px-6 shadow-2xl rounded-2xl sm:px-12 border border-white/20 dark:border-gray-700/30 relative overflow-hidden transition-colors duration-500">
          <form className="space-y-5 relative z-10" onSubmit={handleSubmit}>
            {errors.general && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg animate-shake backdrop-blur-sm">
                <div className="flex items-center">
                  <span className="text-xl mr-2">⚠️</span>
                  {errors.general}
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div className="transform transition-all duration-300 hover:translate-x-1">
                <label htmlFor="firstName" className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">
                  <FaUser className="inline mr-2 text-purple-600 dark:text-purple-400" />
                  First name
                </label>
                <div className="relative group">
                  <input
                    id="firstName"
                    name="firstName"
                    type="text"
                    autoComplete="given-name"
                    required
                    value={formData.firstName}
                    onChange={handleChange}
                    className={`appearance-none block w-full px-4 py-3 border-2 rounded-xl shadow-sm placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 text-gray-900 dark:text-white ${
                      errors.firstName ? 'border-red-300 bg-red-50 dark:border-red-600 dark:bg-red-900/20' : 'border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 hover:border-purple-300 dark:hover:border-purple-500'
                    }`}
                    placeholder="John"
                  />
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 opacity-0 group-focus-within:opacity-20 transition-opacity duration-300 pointer-events-none"></div>
                </div>
                {errors.firstName && (
                  <p className="mt-2 text-sm text-red-600 animate-fadeIn flex items-center">
                    <span className="mr-1">⚠️</span> {errors.firstName}
                  </p>
                )}
              </div>

              <div className="transform transition-all duration-300 hover:translate-x-1">
                <label htmlFor="lastName" className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">
                  <FaUser className="inline mr-2 text-purple-600 dark:text-purple-400" />
                  Last name
                </label>
                <div className="relative group">
                  <input
                    id="lastName"
                    name="lastName"
                    type="text"
                    autoComplete="family-name"
                    required
                    value={formData.lastName}
                    onChange={handleChange}
                    className={`appearance-none block w-full px-4 py-3 border-2 rounded-xl shadow-sm placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 text-gray-900 dark:text-white ${
                      errors.lastName ? 'border-red-300 bg-red-50 dark:border-red-600 dark:bg-red-900/20' : 'border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 hover:border-purple-300 dark:hover:border-purple-500'
                    }`}
                    placeholder="Doe"
                  />
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 opacity-0 group-focus-within:opacity-20 transition-opacity duration-300 pointer-events-none"></div>
                </div>
                {errors.lastName && (
                  <p className="mt-2 text-sm text-red-600 animate-fadeIn flex items-center">
                    <span className="mr-1">⚠️</span> {errors.lastName}
                  </p>
                )}
              </div>
            </div>

            <div className="transform transition-all duration-300 hover:translate-x-1">
              <label htmlFor="email" className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">
                <FaEnvelope className="inline mr-2 text-purple-600 dark:text-purple-400" />
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
                  className={`appearance-none block w-full px-4 py-3 border-2 rounded-xl shadow-sm placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 text-gray-900 dark:text-white ${
                    errors.email ? 'border-red-300 bg-red-50 dark:border-red-600 dark:bg-red-900/20' : 'border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 hover:border-purple-300 dark:hover:border-purple-500'
                  }`}
                  placeholder="you@example.com"
                />
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 opacity-0 group-focus-within:opacity-20 transition-opacity duration-300 pointer-events-none"></div>
              </div>
              {errors.email && (
                <p className="mt-2 text-sm text-red-600 animate-fadeIn flex items-center">
                  <span className="mr-1">⚠️</span> {errors.email}
                </p>
              )}
            </div>

            <div className="transform transition-all duration-300 hover:translate-x-1">
              <label htmlFor="phone" className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">
                <FaPhone className="inline mr-2 text-purple-600 dark:text-purple-400" />
                Phone number
              </label>
              <div className="relative group">
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  autoComplete="tel"
                  required
                  value={formData.phone}
                  onChange={handleChange}
                  className={`appearance-none block w-full px-4 py-3 border-2 rounded-xl shadow-sm placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 text-gray-900 dark:text-white ${
                    errors.phone ? 'border-red-300 bg-red-50 dark:border-red-600 dark:bg-red-900/20' : 'border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 hover:border-purple-300 dark:hover:border-purple-500'
                  }`}
                  placeholder="+1 (555) 000-0000"
                />
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 opacity-0 group-focus-within:opacity-20 transition-opacity duration-300 pointer-events-none"></div>
              </div>
              {errors.phone && (
                <p className="mt-2 text-sm text-red-600 animate-fadeIn flex items-center">
                  <span className="mr-1">⚠️</span> {errors.phone}
                </p>
              )}
            </div>

            <div className="transform transition-all duration-300 hover:translate-x-1">
              <label htmlFor="password" className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">
                <FaLock className="inline mr-2 text-purple-600 dark:text-purple-400" />
                Password
              </label>
              <div className="relative group">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className={`appearance-none block w-full px-4 py-3 pr-12 border-2 rounded-xl shadow-sm placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 text-gray-900 dark:text-white ${
                    errors.password ? 'border-red-300 bg-red-50 dark:border-red-600 dark:bg-red-900/20' : 'border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 hover:border-purple-300 dark:hover:border-purple-500'
                  }`}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-4 flex items-center hover:scale-110 transition-transform duration-200"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <FaEyeSlash className="h-5 w-5 text-gray-400 dark:text-gray-500 hover:text-purple-600 dark:hover:text-purple-400 transition-colors" />
                  ) : (
                    <FaEye className="h-5 w-5 text-gray-400 dark:text-gray-500 hover:text-purple-600 dark:hover:text-purple-400 transition-colors" />
                  )}
                </button>
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 opacity-0 group-focus-within:opacity-20 transition-opacity duration-300 pointer-events-none"></div>
              </div>
              {errors.password && (
                <p className="mt-2 text-sm text-red-600 animate-fadeIn flex items-center">
                  <span className="mr-1">⚠️</span> {errors.password}
                </p>
              )}
            </div>

            <div className="transform transition-all duration-300 hover:translate-x-1">
              <label htmlFor="confirmPassword" className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">
                <FaLock className="inline mr-2 text-purple-600 dark:text-purple-400" />
                Confirm password
              </label>
              <div className="relative group">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={`appearance-none block w-full px-4 py-3 pr-12 border-2 rounded-xl shadow-sm placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 text-gray-900 dark:text-white ${
                    errors.confirmPassword ? 'border-red-300 bg-red-50 dark:border-red-600 dark:bg-red-900/20' : 'border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 hover:border-purple-300 dark:hover:border-purple-500'
                  }`}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-4 flex items-center hover:scale-110 transition-transform duration-200"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <FaEyeSlash className="h-5 w-5 text-gray-400 dark:text-gray-500 hover:text-purple-600 dark:hover:text-purple-400 transition-colors" />
                  ) : (
                    <FaEye className="h-5 w-5 text-gray-400 dark:text-gray-500 hover:text-purple-600 dark:hover:text-purple-400 transition-colors" />
                  )}
                </button>
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 opacity-0 group-focus-within:opacity-20 transition-opacity duration-300 pointer-events-none"></div>
              </div>
              {errors.confirmPassword && (
                <p className="mt-2 text-sm text-red-600 animate-fadeIn flex items-center">
                  <span className="mr-1">⚠️</span> {errors.confirmPassword}
                </p>
              )}
            </div>

            <div className="flex items-start transform transition-all duration-300 hover:translate-x-1">
              <div className="flex items-center h-5 mt-1">
                <input
                  id="agreeToTerms"
                  name="agreeToTerms"
                  type="checkbox"
                  checked={formData.agreeToTerms}
                  onChange={handleChange}
                  className="h-5 w-5 text-purple-600 dark:text-purple-500 focus:ring-purple-500 border-gray-300 dark:border-gray-600 rounded cursor-pointer transition-all duration-200 hover:scale-110"
                />
              </div>
              <label htmlFor="agreeToTerms" className="ml-3 block text-sm text-gray-700 dark:text-gray-300">
                I agree to the{' '}
                <Link to="/terms" className="text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 font-medium underline">
                  Terms and Conditions
                </Link>{' '}
                and{' '}
                <Link to="/privacy" className="text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 font-medium underline">
                  Privacy Policy
                </Link>
              </label>
            </div>
            {errors.agreeToTerms && (
              <p className="text-sm text-red-600 animate-fadeIn flex items-center">
                <span className="mr-1">⚠️</span> {errors.agreeToTerms}
              </p>
            )}

            <div>
              <button
                type="submit"
                disabled={loading}
                className="group relative w-full flex justify-center py-3 px-4 border border-transparent rounded-xl text-base font-semibold text-white bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed transform transition-all duration-300 hover:scale-[1.02] hover:shadow-xl overflow-hidden"
              >
                <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-purple-400 to-pink-400 opacity-0 group-hover:opacity-30 transition-opacity duration-300"></span>
                <span className="absolute right-0 w-8 h-32 -mt-12 transition-all duration-1000 transform translate-x-12 bg-white opacity-10 rotate-12 group-hover:-translate-x-40 ease"></span>
                <span className="relative flex items-center">
                  {loading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Creating account...
                    </>
                  ) : (
                    <>
                      <FaRocket className="mr-2 group-hover:animate-bounce" />
                      Create account
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
                <span className="px-4 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400">Already a member?</span>
              </div>
            </div>
            <p className="mt-4 text-sm text-gray-600 dark:text-gray-300">
              <Link to="/signin" className="font-semibold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-400 dark:to-pink-400 hover:from-purple-700 hover:to-pink-700 dark:hover:from-purple-300 dark:hover:to-pink-300 transition-all duration-300 hover:underline">
                Sign in to your account 🚀
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

export default Signup;
