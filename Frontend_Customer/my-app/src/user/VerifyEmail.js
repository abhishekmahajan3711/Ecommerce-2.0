import React, { useEffect, useState } from 'react';
import axios from 'axios';

const VerifyEmail = () => {
  const [status, setStatus] = useState('verifying'); // verifying, success, error
  const [message, setMessage] = useState('');

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');
    console.log(token);
    if (!token) {
      setStatus('error');
      setMessage('No verification token provided.');
      return;
    }
    axios.get(`http://localhost:5000/api/auth/verify-email?token=${token}`)
      .then(res => {
        setStatus('success');
        setMessage('Your email has been verified!');
      })
      .catch(err => {
        setStatus('error');
        setMessage(err.response?.data?.message || 'Verification failed.');
      });
  }, []);

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white p-8 rounded shadow text-center">
        {status === 'verifying' && <div>Verifying your email...</div>}
        {status === 'success' && (
          <div className="text-cyan-700 font-semibold">
            {message}<br />
            <a href="/profile" className="inline-block mt-4 px-4 py-2 bg-cyan-600 text-white rounded hover:bg-cyan-700">Go to Profile</a>
          </div>
        )}
        {status === 'error' && (
          <div className="text-red-700 font-semibold">{message}</div>
        )}
      </div>
    </div>
  );
};

export default VerifyEmail; 