import React, { useState, useEffect } from 'react';
import { FaTimes, FaSave } from 'react-icons/fa';

const EditCategory = ({ category, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    name: '',
    icon: '📦',
    link: '/products',
    color: 'bg-cyan-100',
    isActive: true,
    order: 0
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [availableCategories, setAvailableCategories] = useState([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);

  const colorOptions = [
    { value: 'bg-cyan-100', label: 'Cyan' },
    { value: 'bg-red-100', label: 'Red' },
    { value: 'bg-yellow-100', label: 'Yellow' },
    { value: 'bg-purple-100', label: 'Purple' },
    { value: 'bg-pink-100', label: 'Pink' },
    { value: 'bg-green-100', label: 'Green' },
    { value: 'bg-blue-100', label: 'Blue' }
  ];



  const popularIcons = [
    '💊', '⚡', '💪', '🐟', '🦠', '🛡️', '🌿', '🍎', '🥛', '🥜', '🌾', '🍯', '🥑', '🥦', '🍊', '🍓'
  ];

  // Fetch available categories from backend
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setCategoriesLoading(true);
        const response = await fetch('http://localhost:5000/api/products/categories');
        const data = await response.json();
        
        if (data.success) {
          setAvailableCategories(data.data);
        } else {
          console.error('Failed to fetch categories:', data.message);
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
      } finally {
        setCategoriesLoading(false);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    if (category) {
      setFormData({
        name: category.name || '',
        icon: category.icon || '📦',
        link: category.link || '/products',
        color: category.color || 'bg-cyan-100',
        isActive: category.isActive !== undefined ? category.isActive : true,
        order: category.order || 0
      });
    }
  }, [category]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleCategorySelect = (e) => {
    const selectedCategoryName = e.target.value;
    if (selectedCategoryName) {
      // Capitalize the first letter of each word
      const capitalizedName = selectedCategoryName
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' ');
      
      setFormData(prev => ({
        ...prev,
        name: capitalizedName,
        link: `/products?category=${selectedCategoryName.toLowerCase().replace(/\s+/g, '')}`
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`http://localhost:5000/api/categories/admin/${category._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (data.success) {
        onSuccess();
      } else {
        setError(data.message);
      }
    } catch (error) {
      setError('Failed to update category');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-900">Edit Category</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <FaTimes />
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6">
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          {/* Category Selection */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Category *
            </label>
            {categoriesLoading ? (
              <div className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50">
                Loading categories...
              </div>
            ) : (
              <select
                name="categorySelect"
                onChange={handleCategorySelect}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
              >
                <option value="">Choose a category...</option>
                {availableCategories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* Category Name (Read-only after selection) */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category Name *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500 bg-gray-50"
              placeholder="Select a category above"
              readOnly
            />
          </div>

          {/* Icon */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Icon *
            </label>
            <div className="flex items-center space-x-2 mb-2">
              <input
                type="text"
                name="icon"
                value={formData.icon}
                onChange={handleChange}
                required
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
                placeholder="e.g., 💊"
              />
              <div className="text-2xl">{formData.icon}</div>
            </div>
            <div className="text-sm text-gray-600 mb-2">Popular icons:</div>
            <div className="flex flex-wrap gap-2">
              {popularIcons.map((icon, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, icon }))}
                  className="text-2xl hover:scale-110 transition-transform p-1"
                >
                  {icon}
                </button>
              ))}
            </div>
          </div>

          {/* Link */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Link *
            </label>
            <input
              type="text"
              name="link"
              value={formData.link}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
              placeholder="e.g., /products?category=vitamins"
            />
          </div>

          {/* Color */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Background Color *
            </label>
            <select
              name="color"
              value={formData.color}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
            >
              {colorOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <div className="mt-2 flex items-center">
              <div className={`w-6 h-6 rounded mr-2 ${formData.color}`}></div>
              <span className="text-sm text-gray-600">Preview</span>
            </div>
          </div>

          {/* Order */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Display Order
            </label>
            <input
              type="number"
              name="order"
              value={formData.order}
              onChange={handleChange}
              min="0"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
              placeholder="0"
            />
          </div>

          {/* Active Status */}
          <div className="mb-6">
            <label className="flex items-center">
              <input
                type="checkbox"
                name="isActive"
                checked={formData.isActive}
                onChange={handleChange}
                className="rounded border-gray-300 text-cyan-600 focus:ring-cyan-500"
              />
              <span className="ml-2 text-sm text-gray-700">Active (visible to customers)</span>
            </label>
          </div>

          {/* Buttons */}
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-cyan-600 text-white rounded-md hover:bg-cyan-700 transition-colors flex items-center disabled:opacity-50"
            >
              {loading ? (
                'Updating...'
              ) : (
                <>
                  <FaSave className="mr-2" />
                  Update Category
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditCategory; 