import React, { useState } from 'react';
import axios from 'axios';

const ForgotPassword = () => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');
    try {
      const res = await axios.post('http://localhost:5000/api/auth/forgot-password', { email });
      setMessage(res.data.message || 'OTP sent to your email.');
      setStep(2);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send OTP.');
    } finally {
      setLoading(false);
    }
  };

  const handleResetSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');
    try {
      const res = await axios.post('http://localhost:5000/api/auth/reset-password', { email, otp, newPassword });
      setMessage(res.data.message || 'Password reset successful!');
      setStep(3);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to reset password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white p-8 rounded shadow">
        <h2 className="text-2xl font-bold mb-6 text-center">Forgot Password</h2>
        {message && <div className="mb-4 text-cyan-600">{message}</div>}
        {error && <div className="mb-4 text-red-600">{error}</div>}
        {step === 1 && (
          <form onSubmit={handleEmailSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />
            </div>
            <button type="submit" disabled={loading} className="w-full bg-cyan-600 text-white py-2 rounded hover:bg-cyan-700">
              {loading ? 'Sending OTP...' : 'Send OTP'}
            </button>
          </form>
        )}
        {step === 2 && (
          <form onSubmit={handleResetSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">OTP</label>
              <input
                type="text"
                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                value={otp}
                onChange={e => setOtp(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">New Password</label>
              <input
                type="password"
                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                value={newPassword}
                onChange={e => setNewPassword(e.target.value)}
                required
                minLength={6}
              />
            </div>
            <button type="submit" disabled={loading} className="w-full bg-cyan-600 text-white py-2 rounded hover:bg-cyan-700">
              {loading ? 'Resetting...' : 'Reset Password'}
            </button>
          </form>
        )}
        {step === 3 && (
          <div className="text-center text-cyan-700 font-semibold">
            Password reset successful! You can now sign in with your new password.<br />
            <a href="/signin" className="inline-block mt-4 px-4 py-2 bg-cyan-600 text-white rounded hover:bg-cyan-700">Sign In</a>
          </div>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword; 