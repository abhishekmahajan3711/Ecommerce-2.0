import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getCurrentUser, updateUserName, updateUserAddress, changePassword } from '../store/slices/authSlice';
import axios from 'axios';
import { auth } from '../firebase';
import { RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth';
import { FaEye, FaEyeSlash, FaMapMarkerAlt, FaExclamationTriangle } from 'react-icons/fa';
import { addressValidation, validateIndianAddress, indianAddressData } from '../utils/addressValidation';

const Profile = () => {
  const dispatch = useDispatch();
  const { user, loading, error, isAuthenticated } = useSelector((state) => state.auth);
  const [editName, setEditName] = useState(false);
  const [editAddress, setEditAddress] = useState(false);
  const [nameInput, setNameInput] = useState('');
  const [addressInput, setAddressInput] = useState({ street: '', city: '', state: '', zipCode: '', country: '' });
  const [addressErrors, setAddressErrors] = useState({});
  const [addressSuggestions, setAddressSuggestions] = useState({});
  const [showAddressValidation, setShowAddressValidation] = useState(false);
  const [verifMsg, setVerifMsg] = useState('');
  const [verifError, setVerifError] = useState('');
  const [verifLoading, setVerifLoading] = useState(false);
  const [phoneInput, setPhoneInput] = useState('');
  const [firebaseOTP, setFirebaseOTP] = useState('');
  const [confirmationResult, setConfirmationResult] = useState(null);
  const [firebaseVerifMsg, setFirebaseVerifMsg] = useState('');
  const [firebaseVerifError, setFirebaseVerifError] = useState('');
  const [firebaseVerifLoading, setFirebaseVerifLoading] = useState(false);
  const [showFirebaseOTPInput, setShowFirebaseOTPInput] = useState(false);
  
  // Password change states
  const [showPasswordChange, setShowPasswordChange] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });
  const [passwordErrors, setPasswordErrors] = useState({});
  const [passwordSuccess, setPasswordSuccess] = useState(false);

  useEffect(() => {
    if (!user && isAuthenticated) {
      dispatch(getCurrentUser());
    }
    if (user) {
      setNameInput(user.name || '');
      setAddressInput({
        street: user.address?.street || '',
        city: user.address?.city || '',
        state: user.address?.state || '',
        zipCode: user.address?.zipCode || '',
        country: user.address?.country || '',
      });
    }
  }, [dispatch, user, isAuthenticated]);

  // Cleanup recaptchaVerifier on unmount
  useEffect(() => {
    return () => {
      if (window.recaptchaVerifier) {
        window.recaptchaVerifier.clear();
        window.recaptchaVerifier = null;
      }
    };
  }, []);

  const handleSaveName = () => {
    if (nameInput.trim() && nameInput !== user.name) {
      dispatch(updateUserName(nameInput));
    }
    setEditName(false);
  };
  const handleAddressChange = (field, value) => {
    const newAddress = { ...addressInput, [field]: value };
    setAddressInput(newAddress);

    // Validate the entire address after every change
    const validation = addressValidation.validateAddress(newAddress);
    const indianValidation = validateIndianAddress(newAddress);
    const combinedErrors = { ...validation.errors, ...indianValidation.errors };
    setAddressErrors(combinedErrors);

    // Generate suggestions
    const suggestions = addressValidation.suggestCorrections(newAddress);
    setAddressSuggestions(suggestions);
  };

  const validateAddressForm = () => {
    // Basic validation
    const validation = addressValidation.validateAddress(addressInput);
    setAddressErrors(validation.errors);
    
    // Indian address validation
    const indianValidation = validateIndianAddress(addressInput);
    const combinedErrors = { ...validation.errors, ...indianValidation.errors };
    setAddressErrors(combinedErrors);
    

    return validation.isValid && indianValidation.isValid;
  };

  const handleSaveAddress = () => {
    if (!validateAddressForm()) {
      setShowAddressValidation(true);
      return;
    }
    
    dispatch(updateUserAddress(addressInput));
    setEditAddress(false);
    setAddressErrors({});
    setAddressSuggestions({});
    setShowAddressValidation(false);
  };

  const applySuggestion = (field, suggestedValue) => {
    setAddressInput(prev => ({ ...prev, [field]: suggestedValue }));
    setAddressSuggestions(prev => {
      const newSuggestions = { ...prev };
      delete newSuggestions[field];
      return newSuggestions;
    });
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (passwordErrors[name]) {
      setPasswordErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validatePasswordForm = () => {
    const newErrors = {};

    if (!passwordData.currentPassword) {
      newErrors.currentPassword = 'Current password is required';
    }

    if (!passwordData.newPassword) {
      newErrors.newPassword = 'New password is required';
    } else if (passwordData.newPassword.length < 6) {
      newErrors.newPassword = 'New password must be at least 6 characters';
    }

    if (!passwordData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your new password';
    } else if (passwordData.newPassword !== passwordData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setPasswordErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmitPasswordChange = async (e) => {
    e.preventDefault();
    
    if (!validatePasswordForm()) {
      return;
    }

    dispatch(changePassword({
      currentPassword: passwordData.currentPassword,
      newPassword: passwordData.newPassword
    })).then((result) => {
      if (result.meta.requestStatus === 'fulfilled') {
        // Reset form on success
        setPasswordData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
        setShowPasswordChange(false);
        setPasswordErrors({});
        setPasswordSuccess(true);
        
        // Hide success message after 3 seconds
        setTimeout(() => {
          setPasswordSuccess(false);
        }, 3000);
      }
    });
  };

  const togglePasswordVisibility = (field) => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const handleSendVerification = async () => {
    setVerifLoading(true);
    setVerifMsg('');
    setVerifError('');
    try {
      // Assumes you have a way to get the auth token, e.g. from Redux or localStorage
      const token = localStorage.getItem('token');
      const res = await axios.post('http://localhost:5000/api/auth/send-verification-email', {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setVerifMsg('A verification email has been sent. The link will expire in 30 minutes.');
    } catch (err) {
      setVerifError(err.response?.data?.message || 'Failed to send verification email.');
    } finally {
      setVerifLoading(false);
    }
  };

  const setupRecaptcha = () => {
    // Only create if not already present
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(auth,
        'recaptcha-container',
        {
          size: 'invisible',
          callback: (response) => {},
        },
      );
    }
  };

  const getFirebasePhoneNumber = () => {
    // If phoneInput is 10 digits, prepend +91
    if (/^\d{10}$/.test(phoneInput)) {
      return `+91${phoneInput}`;
    }
    // If already in E.164 format, return as is
    return phoneInput;
  };

  const handleSendFirebaseOTP = async () => {
    setFirebaseVerifLoading(true);
    setFirebaseVerifMsg('');
    setFirebaseVerifError('');
    try {
      const formattedPhone = getFirebasePhoneNumber();
      if (!/^\+\d{10,15}$/.test(formattedPhone)) {
        setFirebaseVerifError('Please enter a valid phone number (10 digits or +countrycode...).');
        setFirebaseVerifLoading(false);
        return;
      }
      setupRecaptcha();
      const appVerifier = window.recaptchaVerifier;
      const confirmation = await signInWithPhoneNumber(auth, formattedPhone, appVerifier);
      setConfirmationResult(confirmation);
      setShowFirebaseOTPInput(true);
      setFirebaseVerifMsg('OTP sent! Please check your phone.');
    } catch (err) {
      setFirebaseVerifError(err.message || 'Failed to send OTP.');
    } finally {
      setFirebaseVerifLoading(false);
    }
  };

  const handleVerifyFirebaseOTP = async (e) => {
    e.preventDefault();
    setFirebaseVerifLoading(true);
    setFirebaseVerifMsg('');
    setFirebaseVerifError('');
    try {
      if (!confirmationResult) throw new Error('No OTP confirmation found.');
      await confirmationResult.confirm(firebaseOTP);
      setFirebaseVerifMsg('Mobile number verified successfully!');
      setShowFirebaseOTPInput(false);
      // Optionally, update backend to mark phone as verified
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:5000/api/auth/verify-firebase-mobile', { phone: phoneInput }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      window.location.reload();
    } catch (err) {
      setFirebaseVerifError(err.message || 'Failed to verify mobile number.');
    } finally {
      setFirebaseVerifLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white p-8 rounded shadow text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
          <p className="text-gray-700 mb-4">{error}</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white p-8 rounded shadow text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">No Profile Data</h2>
          <p className="text-gray-700">Please sign in to view your profile.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-xl">
        <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">My Profile</h2>
        {/* Recaptcha container should always be present in the DOM */}
        <div id="recaptcha-container"></div>
        <div className="space-y-4">
          {/* Name */}
          <div className="flex justify-between items-center border-b pb-2">
            <span className="text-gray-600 font-medium">Name:</span>
            {editName ? (
              <span className="flex gap-2">
                <input
                  type="text"
                  value={nameInput}
                  onChange={e => setNameInput(e.target.value)}
                  className="border px-2 py-1 rounded"
                />
                <button onClick={handleSaveName} className="text-green-600 font-semibold" disabled={loading}>Save</button>
                <button onClick={() => { setEditName(false); setNameInput(user.name); }} className="text-gray-500">Cancel</button>
              </span>
            ) : (
              <span className="flex gap-2 items-center">
                <span className="text-gray-900 font-semibold">{user.name}</span>
                <button onClick={() => setEditName(true)} className="text-blue-600 text-xs underline">Edit</button>
              </span>
            )}
          </div>
          {/* Email */}
          <div className="flex justify-between border-b pb-2">
            <span className="text-gray-600 font-medium">Email:</span>
            <div className="flex items-center space-x-2">
              <span>{user.email}</span>
              {user.isVerified ? (
                <span className="bg-green-100 text-green-800 text-xs font-semibold px-2.5 py-0.5 rounded">Verified</span>
              ) : (
                <span className="bg-red-100 text-red-800 text-xs font-semibold px-2.5 py-0.5 rounded">Not Verified</span>
              )}
            </div>
          </div>
          {/* Phone */}
          <div className="flex justify-between border-b pb-2">
            <span className="text-gray-600 font-medium">Phone:</span>
            <div className="flex items-center space-x-2">
              <span>{user.phone || '-'}</span>
              {user.isMobileVerified ? (
                <span className="bg-green-100 text-green-800 text-xs font-semibold px-2.5 py-0.5 rounded">Verified</span>
              ) : (
                <span className="bg-red-100 text-red-800 text-xs font-semibold px-2.5 py-0.5 rounded">Not Verified</span>
              )}
            </div>
          </div>
          
          {/* Password */}
          <div className="border-b pb-2">
            <div className="flex justify-between items-center">
              <span className="text-gray-600 font-medium">Password</span>
              <button 
                onClick={() => {
                  setShowPasswordChange(!showPasswordChange);
                  if (!showPasswordChange) {
                    setPasswordSuccess(false);
                  }
                }} 
                className="text-blue-600 text-xs underline"
              >
                {showPasswordChange ? 'Cancel' : 'Change Password'}
              </button>
            </div>
            
            {showPasswordChange && (
              <form onSubmit={handleSubmitPasswordChange} className="mt-4 space-y-3">
                {/* Current Password */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
                  <div className="relative">
                    <input
                      type={showPasswords.current ? "text" : "password"}
                      name="currentPassword"
                      value={passwordData.currentPassword}
                      onChange={handlePasswordChange}
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        passwordErrors.currentPassword ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Enter current password"
                    />
                    <button
                      type="button"
                      onClick={() => togglePasswordVisibility('current')}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    >
                      {showPasswords.current ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </div>
                  {passwordErrors.currentPassword && (
                    <p className="text-red-500 text-xs mt-1">{passwordErrors.currentPassword}</p>
                  )}
                </div>

                {/* New Password */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                  <div className="relative">
                    <input
                      type={showPasswords.new ? "text" : "password"}
                      name="newPassword"
                      value={passwordData.newPassword}
                      onChange={handlePasswordChange}
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        passwordErrors.newPassword ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Enter new password"
                    />
                    <button
                      type="button"
                      onClick={() => togglePasswordVisibility('new')}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    >
                      {showPasswords.new ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </div>
                  {passwordErrors.newPassword && (
                    <p className="text-red-500 text-xs mt-1">{passwordErrors.newPassword}</p>
                  )}
                </div>

                {/* Confirm Password */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
                  <div className="relative">
                    <input
                      type={showPasswords.confirm ? "text" : "password"}
                      name="confirmPassword"
                      value={passwordData.confirmPassword}
                      onChange={handlePasswordChange}
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        passwordErrors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Confirm new password"
                    />
                    <button
                      type="button"
                      onClick={() => togglePasswordVisibility('confirm')}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    >
                      {showPasswords.confirm ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </div>
                  {passwordErrors.confirmPassword && (
                    <p className="text-red-500 text-xs mt-1">{passwordErrors.confirmPassword}</p>
                  )}
                </div>

                {/* Submit Button */}
                <div className="flex gap-2 pt-2">
                  <button
                    type="submit"
                    disabled={loading}
                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? 'Updating...' : 'Update Password'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowPasswordChange(false);
                      setPasswordData({
                        currentPassword: '',
                        newPassword: '',
                        confirmPassword: ''
                      });
                      setPasswordErrors({});
                      setPasswordSuccess(false);
                    }}
                    className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>
          
          {/* Password Success Alert */}
          {passwordSuccess && (
            <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-md mb-4">
              <div className="flex items-center">
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="font-medium">Password updated successfully!</span>
              </div>
            </div>
          )}
          
          {/* Firebase Phone Verification */}
          {!user.isMobileVerified && (
            <div className="my-2">
              {/* If no phone, allow adding phone and verifying */}
              {!user.phone ? (
                <>
                  <input
                    type="tel"
                    value={phoneInput}
                    onChange={e => setPhoneInput(e.target.value)}
                    placeholder="Enter 10 digit phone number"
                    className="border px-2 py-1 rounded mr-2"
                    disabled={firebaseVerifLoading || showFirebaseOTPInput}
                  />
                  <button
                    onClick={handleSendFirebaseOTP}
                    disabled={firebaseVerifLoading || showFirebaseOTPInput || !phoneInput}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                  >
                    {firebaseVerifLoading ? 'Sending...' : 'Add & Verify Phone'}
                  </button>
                </>
              ) : (
                // If phone exists but not verified, only show verify button
                <button
                  onClick={() => {
                    setPhoneInput(user.phone);
                    handleSendFirebaseOTP();
                  }}
                  disabled={firebaseVerifLoading || showFirebaseOTPInput}
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                  {firebaseVerifLoading ? 'Sending...' : 'Verify Phone'}
                </button>
              )}
              {firebaseVerifMsg && <div className="mt-2 text-green-600">{firebaseVerifMsg}</div>}
              {firebaseVerifError && <div className="mt-2 text-red-600">{firebaseVerifError}</div>}
              {showFirebaseOTPInput && (
                <form onSubmit={handleVerifyFirebaseOTP} className="mt-2 flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-2">
                  <input
                    type="text"
                    value={firebaseOTP}
                    onChange={e => setFirebaseOTP(e.target.value)}
                    placeholder="Enter OTP"
                    className="border border-gray-300 rounded px-2 py-1"
                    required
                  />
                  <button
                    type="submit"
                    disabled={firebaseVerifLoading}
                    className="bg-green-600 text-white px-4 py-1 rounded hover:bg-green-700"
                  >
                    {firebaseVerifLoading ? 'Verifying...' : 'Submit OTP'}
                  </button>
                </form>
              )}
            </div>
          )}
          {/* Address */}
          <div className="border-b pb-2">
            <span className="text-gray-600 font-medium block mb-1">Address:</span>
            {editAddress ? (
              <div className="space-y-2">
                {/* Street Address */}
                <div>
                  <input
                    type="text"
                    placeholder="Street Address"
                    value={addressInput.street}
                    onChange={e => handleAddressChange('street', e.target.value)}
                    className={`border px-3 py-2 rounded w-full ${
                      addressErrors.street ? 'border-red-500' : 'border-gray-300'
                    } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  />
                  {addressErrors.street && (
                    <p className="text-red-500 text-xs mt-1">{addressErrors.street}</p>
                  )}
                  {addressSuggestions.street && (
                    <div className="text-blue-600 text-xs mt-1 flex items-center">
                      <span>Did you mean: </span>
                      <button 
                        onClick={() => applySuggestion('street', addressSuggestions.street)}
                        className="underline ml-1 hover:text-blue-800"
                      >
                        {addressSuggestions.street}
                      </button>
                    </div>
                  )}
                </div>

                {/* City */}
                <div>
                  <input
                    type="text"
                    placeholder="City"
                    value={addressInput.city}
                    onChange={e => handleAddressChange('city', e.target.value)}
                    className={`border px-3 py-2 rounded w-full ${
                      addressErrors.city ? 'border-red-500' : 'border-gray-300'
                    } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  />
                  {addressErrors.city && (
                    <p className="text-red-500 text-xs mt-1">{addressErrors.city}</p>
                  )}
                  {addressSuggestions.city && (
                    <div className="text-blue-600 text-xs mt-1 flex items-center">
                      <span>Did you mean: </span>
                      <button 
                        onClick={() => applySuggestion('city', addressSuggestions.city)}
                        className="underline ml-1 hover:text-blue-800"
                      >
                        {addressSuggestions.city}
                      </button>
                    </div>
                  )}
                </div>

                {/* State */}
                <div>
                  <select
                    value={addressInput.state}
                    onChange={e => handleAddressChange('state', e.target.value)}
                    className={`border px-3 py-2 rounded w-full ${
                      addressErrors.state ? 'border-red-500' : 'border-gray-300'
                    } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  >
                    <option value="">Select State</option>
                    {indianAddressData.states.map(state => (
                      <option key={state} value={state}>{state}</option>
                    ))}
                  </select>
                  {addressErrors.state && (
                    <p className="text-red-500 text-xs mt-1">{addressErrors.state}</p>
                  )}
                </div>

                {/* ZIP Code */}
                <div>
                  <input
                    type="text"
                    placeholder="PIN Code (6 digits)"
                    value={addressInput.zipCode}
                    onChange={e => handleAddressChange('zipCode', e.target.value)}
                    maxLength={6}
                    className={`border px-3 py-2 rounded w-full ${
                      addressErrors.zipCode ? 'border-red-500' : 'border-gray-300'
                    } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  />
                  {addressErrors.zipCode && (
                    <p className="text-red-500 text-xs mt-1">{addressErrors.zipCode}</p>
                  )}
                </div>

                {/* Country */}
                <div>
                  <input
                    type="text"
                    placeholder="Country"
                    value={addressInput.country}
                    onChange={e => handleAddressChange('country', e.target.value)}
                    className={`border px-3 py-2 rounded w-full ${
                      addressErrors.country ? 'border-red-500' : 'border-gray-300'
                    } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  />
                  {addressErrors.country && (
                    <p className="text-red-500 text-xs mt-1">{addressErrors.country}</p>
                  )}
                  {addressSuggestions.country && (
                    <div className="text-blue-600 text-xs mt-1 flex items-center">
                      <span>Did you mean: </span>
                      <button 
                        onClick={() => applySuggestion('country', addressSuggestions.country)}
                        className="underline ml-1 hover:text-blue-800"
                      >
                        {addressSuggestions.country}
                      </button>
                    </div>
                  )}
                </div>

                {/* Address Validation Info */}
                {showAddressValidation && Object.keys(addressErrors).length > 0 && (
                  <div className="bg-red-50 border border-red-200 text-red-800 px-3 py-2 rounded-md">
                    <div className="flex items-center">
                      <FaMapMarkerAlt className="w-4 h-4 mr-2" />
                      <span className="text-sm font-medium">Please fix the following errors:</span>
                    </div>
                    <ul className="text-xs mt-1 list-disc list-inside">
                      {Object.values(addressErrors).map((error, index) => (
                        <li key={index}>{error}</li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="flex gap-2 mt-2">
                  <button 
                    onClick={handleSaveAddress} 
                    className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-50" 
                    disabled={loading || Object.keys(addressErrors).length > 0 }
                  >
                    {loading ? 'Saving...' : 'Save Address'}
                  </button>
                  <button 
                    onClick={() => { 
                      setEditAddress(false); 
                      setAddressInput({
                        street: user.address?.street || '',
                        city: user.address?.city || '',
                        state: user.address?.state || '',
                        zipCode: user.address?.zipCode || '',
                        country: user.address?.country || '',
                      });
                          setAddressErrors({});
    setAddressSuggestions({});
    setShowAddressValidation(false);
                    }} 
                    className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : user.address && (user.address.street || user.address.city || user.address.state || user.address.zipCode || user.address.country) ? (
              <div className="text-gray-900 font-semibold space-y-1">
                <div>{user.address.street || '-'}</div>
                <div>{user.address.city || '-'}{user.address.state ? ', ' + user.address.state : ''}</div>
                <div>{user.address.zipCode || ''} {user.address.country || ''}</div>
                <button onClick={() => setEditAddress(true)} className="text-blue-600 text-xs underline mt-2">Edit Address</button>
              </div>
            ) : (
              <button onClick={() => setEditAddress(true)} className="text-blue-600 text-xs underline">Add Address</button>
            )}
          </div>
        </div>
        {user && !user.isVerified && (
          <div className="my-4">
            <button
              onClick={handleSendVerification}
              disabled={verifLoading}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              {verifLoading ? 'Sending...' : 'Verify Email'}
            </button>
            {verifMsg && <div className="mt-2 text-green-600">{verifMsg}</div>}
            {verifError && <div className="mt-2 text-red-600">{verifError}</div>}
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
