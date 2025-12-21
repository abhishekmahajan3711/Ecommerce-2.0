import React from 'react';
import { useNavigate } from 'react-router-dom';

const EditHomePage = () => {
  const navigate = useNavigate();
  return (
    <div className="max-w-xl mx-auto p-8 bg-white rounded-2xl shadow-xl mt-8">
      <h2 className="text-2xl font-bold mb-6">Edit Home Page</h2>
      <div className="space-y-4">
        <button
          onClick={() => navigate('/admin/hero')}
          className="w-full text-left px-4 py-3 rounded bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold hover:from-blue-700 hover:to-blue-800"
        >
          Edit Hero Section
        </button>
        <button
          onClick={() => navigate('/admin/categories')}
          className="w-full text-left px-4 py-3 rounded bg-gradient-to-r from-green-600 to-green-700 text-white font-semibold hover:from-green-700 hover:to-green-800"
        >
          Edit Category Section
        </button>
      </div>
    </div>
  );
};

export default EditHomePage; 