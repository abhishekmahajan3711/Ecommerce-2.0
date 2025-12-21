import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const AddProduct = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    shortDescription: '',
    price: '',
    originalPrice: '',
    discount: 0,
    category: '',
    subcategory: '',
    brand: '',
    mainImage: '',
    images: [''],
    stock: '',
    sku: '',
    weight: {
      value: '',
      unit: 'g'
    },
    servingSize: '',
    servingsPerContainer: '',
    ingredients: [''],
    nutritionalInfo: {
      calories: '',
      protein: '',
      carbohydrates: '',
      fat: '',
      fiber: '',
      sugar: '',
      sodium: ''
    },
    benefits: [''],
    usageInstructions: '',
    warnings: [''],
    allergens: [''],
    isVegetarian: false,
    isVegan: false,
    isGlutenFree: false,
    isOrganic: false,
    isNonGMO: false,
    isActive: true,
    isFeatured: false,
    tags: ['']
  });

  const [categories, setCategories] = useState([]);

  const weightUnits = ['g', 'mg', 'kg', 'oz', 'lb'];

  const [mainImagePreview, setMainImagePreview] = useState('');
  const [additionalImagePreviews, setAdditionalImagePreviews] = useState(['']);
  const [mainImageFile, setMainImageFile] = useState(null);
  const [additionalImageFiles, setAdditionalImageFiles] = useState([]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleNestedChange = (parent, field, value) => {
    setFormData(prev => ({
      ...prev,
      [parent]: {
        ...prev[parent],
        [field]: value
      }
    }));
  };

  const handleArrayChange = (field, index, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].map((item, i) => i === index ? value : item)
    }));
  };

  const addArrayItem = (field) => {
    setFormData(prev => ({
      ...prev,
      [field]: [...prev[field], '']
    }));
    if (field === 'images') {
      setAdditionalImageFiles(prev => [...prev, null]);
      setAdditionalImagePreviews(prev => [...prev, '']);
    }
  };

  const removeArrayItem = (field, index) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }));
    if (field === 'images') {
      setAdditionalImageFiles(prev => prev.filter((_, i) => i !== index));
      setAdditionalImagePreviews(prev => prev.filter((_, i) => i !== index));
    }
  };

  const handleMainImageFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setMainImagePreview(URL.createObjectURL(file));
    setMainImageFile(file);
  };

  const handleAdditionalImageFileChange = (e, index) => {
    const file = e.target.files[0];
    if (!file) return;
    setAdditionalImagePreviews(prev => prev.map((img, i) => i === index ? URL.createObjectURL(file) : img));
    setAdditionalImageFiles(prev => {
      const arr = [...prev];
      arr[index] = file;
      return arr;
    });
  };

  const uploadImageFile = async (file, token) => {
    const formData = new FormData();
    formData.append('image', file);
    const response = await axios.post('http://localhost:5000/api/admin/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${token}`
      }
    });
    return response.data.url;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });
    try {
      // Clean up empty array items for all except images
      let cleanedData = {
        ...formData,
        // Do not filter images here; handle after upload
        ingredients: formData.ingredients.filter(ing => ing.trim() !== ''),
        benefits: formData.benefits.filter(ben => ben.trim() !== ''),
        warnings: formData.warnings.filter(warn => warn.trim() !== ''),
        allergens: formData.allergens.filter(all => all.trim() !== ''),
        tags: formData.tags.filter(tag => tag.trim() !== '')
      };
      const token = localStorage.getItem('adminToken');
      // Upload main image if a file is selected
      if (mainImageFile) {
        const url = await uploadImageFile(mainImageFile, token);
        cleanedData.mainImage = url;
      }
      // Upload additional images if new files are selected (do not filter images before this)
      const newImages = await Promise.all(formData.images.map(async (img, idx) => {
        if (additionalImageFiles[idx]) {
          return await uploadImageFile(additionalImageFiles[idx], token);
        }
        return img;
      }));
      // Now filter out empty strings from the final images array
      cleanedData.images = newImages.filter(img => img && img.trim() !== '');
      await axios.post('http://localhost:5000/api/admin/products', cleanedData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessage({ type: 'success', text: 'Product created successfully!' });
      setTimeout(() => {
        navigate('/admin/products');
      }, 1500);
    } catch (error) {
      setMessage({ 
        type: 'error', 
        text: error.response?.data?.message || 'Failed to create product' 
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    navigate('/admin/signin');
  };

  useEffect(() => {
    fetchCategories();
    setMainImagePreview(formData.mainImage || '');
    setAdditionalImagePreviews(formData.images || ['']);
    setMainImageFile(null);
    setAdditionalImageFiles([]);
  }, [formData.mainImage, formData.images]);

  const fetchCategories = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/products/categories');
      setCategories(response.data.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-white shadow-lg border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <button
                onClick={() => navigate('/admin/products')}
                className="mr-4 text-gray-600 hover:text-gray-900 transition-colors duration-200"
              >
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <h1 className="text-2xl font-bold text-gray-900">Add New Product</h1>
            </div>
            <button
              onClick={handleLogout}
              className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white px-4 py-2 rounded-lg text-sm font-semibold shadow-md hover:shadow-lg transition-all duration-200"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {message.text && (
          <div className={`mb-8 p-6 rounded-2xl shadow-lg ${
            message.type === 'success' 
              ? 'bg-gradient-to-r from-green-50 to-green-100 text-green-800 border border-green-300' 
              : 'bg-gradient-to-r from-red-50 to-red-100 text-red-800 border border-red-300'
          }`}>
            <div className="flex items-center">
              {message.type === 'success' ? (
                <svg className="h-6 w-6 text-green-600 mr-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg className="h-6 w-6 text-red-600 mr-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              )}
              <div className="text-lg font-semibold">{message.text}</div>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
            {/* Basic Information */}
            <div className="bg-white shadow-xl rounded-2xl border border-gray-100">
              <div className="px-8 py-8">
                <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                  <svg className="h-6 w-6 text-blue-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Basic Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Product Name *</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                      placeholder="Enter product name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Brand *</label>
                    <input
                      type="text"
                      name="brand"
                      value={formData.brand}
                      onChange={handleChange}
                      required
                      className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                      placeholder="Enter brand name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Category *</label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      required
                      className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                    >
                      <option value="">Select Category</option>
                      {categories.map(category => (
                        <option key={category} value={category}>
                          {category.charAt(0).toUpperCase() + category.slice(1)}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Subcategory</label>
                    <input
                      type="text"
                      name="subcategory"
                      value={formData.subcategory}
                      onChange={handleChange}
                      className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                      placeholder="Enter subcategory"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">SKU</label>
                    <input
                      type="text"
                      name="sku"
                      value={formData.sku}
                      onChange={handleChange}
                      className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                      placeholder="Enter SKU"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Stock Quantity *</label>
                    <input
                      type="number"
                      name="stock"
                      value={formData.stock}
                      onChange={handleChange}
                      required
                      min="0"
                      className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                      placeholder="Enter stock quantity"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Pricing */}
            <div className="bg-white shadow-xl rounded-2xl border border-gray-100">
              <div className="px-8 py-8">
                <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                  <svg className="h-6 w-6 text-green-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                  </svg>
                  Pricing
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Price (₹) *</label>
                    <input
                      type="number"
                      name="price"
                      value={formData.price}
                      onChange={handleChange}
                      required
                      step="0.01"
                      min="0"
                      className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                      placeholder="0.00"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Original Price (₹)</label>
                    <input
                      type="number"
                      name="originalPrice"
                      value={formData.originalPrice}
                      onChange={handleChange}
                      step="0.01"
                      min="0"
                      className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                      placeholder="0.00"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Discount (%)</label>
                    <input
                      type="number"
                      name="discount"
                      value={formData.discount}
                      onChange={handleChange}
                      min="0"
                      max="100"
                      className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                      placeholder="0"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Descriptions */}
            <div className="bg-white shadow-xl rounded-2xl border border-gray-100">
              <div className="px-8 py-8">
                <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                  <svg className="h-6 w-6 text-purple-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  Descriptions
                </h3>
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Short Description</label>
                    <input
                      type="text"
                      name="shortDescription"
                      value={formData.shortDescription}
                      onChange={handleChange}
                      maxLength="200"
                      className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                      placeholder="Enter short description"
                    />
                    <p className="mt-2 text-sm text-gray-500">{formData.shortDescription.length}/200 characters</p>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Full Description *</label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      required
                      rows={4}
                      className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                      placeholder="Enter full product description"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Images */}
            <div className="bg-white shadow-xl rounded-2xl border border-gray-100">
              <div className="px-8 py-8">
                <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                  <svg className="h-6 w-6 text-indigo-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  Images
                </h3>
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Main Image *</label>
                    {mainImagePreview && (
                      <img src={mainImagePreview.startsWith('/uploads/') ? `http://localhost:5000${mainImagePreview}` : mainImagePreview} alt="Main" className="mb-2 rounded-xl w-32 h-32 object-cover border" />
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleMainImageFileChange}
                      className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Additional Images</label>
                    {formData.images.map((image, index) => (
                      <div key={index} className="flex items-center space-x-3 mb-3">
                        {additionalImagePreviews[index] && (
                          <img src={additionalImagePreviews[index].startsWith('/uploads/') ? `http://localhost:5000${additionalImagePreviews[index]}` : additionalImagePreviews[index]} alt={`Additional ${index + 1}`} className="rounded-xl w-20 h-20 object-cover border" />
                        )}
                        <input
                          type="file"
                          accept="image/*"
                          onChange={e => handleAdditionalImageFileChange(e, index)}
                          className="border-2 border-gray-200 rounded-xl px-2 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                        />
                        <button
                          type="button"
                          onClick={() => removeArrayItem('images', index)}
                          className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white px-4 py-2 rounded-lg text-sm font-semibold shadow-md hover:shadow-lg transition-all duration-200"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() => addArrayItem('images')}
                      className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white px-6 py-2 rounded-lg text-sm font-semibold shadow-md hover:shadow-lg transition-all duration-200"
                    >
                      + Add Image
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Product Details */}
            <div className="bg-white shadow-xl rounded-2xl border border-gray-100">
              <div className="px-8 py-8">
                <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                  <svg className="h-6 w-6 text-orange-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                  Product Details
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Weight Value *</label>
                    <input
                      type="number"
                      value={formData.weight.value}
                      onChange={(e) => handleNestedChange('weight', 'value', e.target.value)}
                      required
                      step="0.01"
                      min="0"
                      className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                      placeholder="Enter weight value"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Weight Unit</label>
                    <select
                      value={formData.weight.unit}
                      onChange={(e) => handleNestedChange('weight', 'unit', e.target.value)}
                      className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                    >
                      {weightUnits.map(unit => (
                        <option key={unit} value={unit}>{unit}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Serving Size</label>
                    <input
                      type="text"
                      name="servingSize"
                      value={formData.servingSize}
                      onChange={handleChange}
                      className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                      placeholder="Enter serving size"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Servings Per Container</label>
                    <input
                      type="number"
                      name="servingsPerContainer"
                      value={formData.servingsPerContainer}
                      onChange={handleChange}
                      min="1"
                      className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                      placeholder="Enter servings per container"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Nutritional Information */}
            <div className="bg-white shadow-xl rounded-2xl border border-gray-100">
              <div className="px-8 py-8">
                <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                  <svg className="h-6 w-6 text-teal-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                  Nutritional Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {Object.keys(formData.nutritionalInfo).map(nutrient => (
                    <div key={nutrient}>
                      <label className="block text-sm font-semibold text-gray-700 mb-2 capitalize">{nutrient}</label>
                      <input
                        type="number"
                        value={formData.nutritionalInfo[nutrient]}
                        onChange={(e) => handleNestedChange('nutritionalInfo', nutrient, e.target.value)}
                        step="0.1"
                        min="0"
                        className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                        placeholder={`Enter ${nutrient}`}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Ingredients */}
            <div className="bg-white shadow-xl rounded-2xl border border-gray-100">
              <div className="px-8 py-8">
                <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                  <svg className="h-6 w-6 text-yellow-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                  </svg>
                  Ingredients
                </h3>
                {formData.ingredients.map((ingredient, index) => (
                  <div key={index} className="flex items-center space-x-3 mb-3">
                    <input
                      type="text"
                      value={ingredient}
                      onChange={(e) => handleArrayChange('ingredients', index, e.target.value)}
                      placeholder="Ingredient"
                      className="flex-1 border-2 border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                    />
                    <button
                      type="button"
                      onClick={() => removeArrayItem('ingredients', index)}
                      className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white px-4 py-2 rounded-lg text-sm font-semibold shadow-md hover:shadow-lg transition-all duration-200"
                    >
                      Remove
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => addArrayItem('ingredients')}
                  className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white px-6 py-2 rounded-lg text-sm font-semibold shadow-md hover:shadow-lg transition-all duration-200"
                >
                  + Add Ingredient
                </button>
              </div>
            </div>

            {/* Benefits */}
            <div className="bg-white shadow-xl rounded-2xl border border-gray-100">
              <div className="px-8 py-8">
                <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                  <svg className="h-6 w-6 text-emerald-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Benefits
                </h3>
                {formData.benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center space-x-3 mb-3">
                    <input
                      type="text"
                      value={benefit}
                      onChange={(e) => handleArrayChange('benefits', index, e.target.value)}
                      placeholder="Benefit"
                      className="flex-1 border-2 border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                    />
                    <button
                      type="button"
                      onClick={() => removeArrayItem('benefits', index)}
                      className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white px-4 py-2 rounded-lg text-sm font-semibold shadow-md hover:shadow-lg transition-all duration-200"
                    >
                      Remove
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => addArrayItem('benefits')}
                  className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white px-6 py-2 rounded-lg text-sm font-semibold shadow-md hover:shadow-lg transition-all duration-200"
                >
                  + Add Benefit
                </button>
              </div>
            </div>

            {/* Usage Instructions */}
            <div className="bg-white shadow-xl rounded-2xl border border-gray-100">
              <div className="px-8 py-8">
                <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                  <svg className="h-6 w-6 text-blue-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                  Usage Instructions
                </h3>
                <textarea
                  name="usageInstructions"
                  value={formData.usageInstructions}
                  onChange={handleChange}
                  rows={3}
                  className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                  placeholder="Enter usage instructions"
                />
              </div>
            </div>

            {/* Warnings */}
            <div className="bg-white shadow-xl rounded-2xl border border-gray-100">
              <div className="px-8 py-8">
                <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                  <svg className="h-6 w-6 text-red-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                  Warnings
                </h3>
                {formData.warnings.map((warning, index) => (
                  <div key={index} className="flex items-center space-x-3 mb-3">
                    <input
                      type="text"
                      value={warning}
                      onChange={(e) => handleArrayChange('warnings', index, e.target.value)}
                      placeholder="Warning"
                      className="flex-1 border-2 border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                    />
                    <button
                      type="button"
                      onClick={() => removeArrayItem('warnings', index)}
                      className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white px-4 py-2 rounded-lg text-sm font-semibold shadow-md hover:shadow-lg transition-all duration-200"
                    >
                      Remove
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => addArrayItem('warnings')}
                  className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white px-6 py-2 rounded-lg text-sm font-semibold shadow-md hover:shadow-lg transition-all duration-200"
                >
                  + Add Warning
                </button>
              </div>
            </div>

            {/* Allergens */}
            <div className="bg-white shadow-xl rounded-2xl border border-gray-100">
              <div className="px-8 py-8">
                <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                  <svg className="h-6 w-6 text-orange-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636m12.728 12.728L18.364 5.636M5.636 18.364l12.728-12.728" />
                  </svg>
                  Allergens
                </h3>
                {formData.allergens.map((allergen, index) => (
                  <div key={index} className="flex items-center space-x-3 mb-3">
                    <input
                      type="text"
                      value={allergen}
                      onChange={(e) => handleArrayChange('allergens', index, e.target.value)}
                      placeholder="Allergen"
                      className="flex-1 border-2 border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                    />
                    <button
                      type="button"
                      onClick={() => removeArrayItem('allergens', index)}
                      className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white px-4 py-2 rounded-lg text-sm font-semibold shadow-md hover:shadow-lg transition-all duration-200"
                    >
                      Remove
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => addArrayItem('allergens')}
                  className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white px-6 py-2 rounded-lg text-sm font-semibold shadow-md hover:shadow-lg transition-all duration-200"
                >
                  + Add Allergen
                </button>
              </div>
            </div>

            {/* Tags */}
            <div className="bg-white shadow-xl rounded-2xl border border-gray-100">
              <div className="px-8 py-8">
                <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                  <svg className="h-6 w-6 text-pink-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                  </svg>
                  Tags
                </h3>
                {formData.tags.map((tag, index) => (
                  <div key={index} className="flex items-center space-x-3 mb-3">
                    <input
                      type="text"
                      value={tag}
                      onChange={(e) => handleArrayChange('tags', index, e.target.value)}
                      placeholder="Tag"
                      className="flex-1 border-2 border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                    />
                    <button
                      type="button"
                      onClick={() => removeArrayItem('tags', index)}
                      className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white px-4 py-2 rounded-lg text-sm font-semibold shadow-md hover:shadow-lg transition-all duration-200"
                    >
                      Remove
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => addArrayItem('tags')}
                  className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white px-6 py-2 rounded-lg text-sm font-semibold shadow-md hover:shadow-lg transition-all duration-200"
                >
                  + Add Tag
                </button>
              </div>
            </div>

            {/* Product Attributes */}
            <div className="bg-white shadow-xl rounded-2xl border border-gray-100">
              <div className="px-8 py-8">
                <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                  <svg className="h-6 w-6 text-gray-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                  Product Attributes
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <label className="flex items-center p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors duration-200">
                    <input
                      type="checkbox"
                      name="isActive"
                      checked={formData.isActive}
                      onChange={handleChange}
                      className="w-5 h-5 text-green-600 border-2 border-gray-300 rounded focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all duration-200"
                    />
                    <span className="ml-3 text-sm font-semibold text-gray-700">Active</span>
                  </label>
                  <label className="flex items-center p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors duration-200">
                    <input
                      type="checkbox"
                      name="isFeatured"
                      checked={formData.isFeatured}
                      onChange={handleChange}
                      className="w-5 h-5 text-green-600 border-2 border-gray-300 rounded focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all duration-200"
                    />
                    <span className="ml-3 text-sm font-semibold text-gray-700">Featured</span>
                  </label>
                  <label className="flex items-center p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors duration-200">
                    <input
                      type="checkbox"
                      name="isVegetarian"
                      checked={formData.isVegetarian}
                      onChange={handleChange}
                      className="w-5 h-5 text-green-600 border-2 border-gray-300 rounded focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all duration-200"
                    />
                    <span className="ml-3 text-sm font-semibold text-gray-700">Vegetarian</span>
                  </label>
                  <label className="flex items-center p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors duration-200">
                    <input
                      type="checkbox"
                      name="isVegan"
                      checked={formData.isVegan}
                      onChange={handleChange}
                      className="w-5 h-5 text-green-600 border-2 border-gray-300 rounded focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all duration-200"
                    />
                    <span className="ml-3 text-sm font-semibold text-gray-700">Vegan</span>
                  </label>
                  <label className="flex items-center p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors duration-200">
                    <input
                      type="checkbox"
                      name="isGlutenFree"
                      checked={formData.isGlutenFree}
                      onChange={handleChange}
                      className="w-5 h-5 text-green-600 border-2 border-gray-300 rounded focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all duration-200"
                    />
                    <span className="ml-3 text-sm font-semibold text-gray-700">Gluten Free</span>
                  </label>
                  <label className="flex items-center p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors duration-200">
                    <input
                      type="checkbox"
                      name="isOrganic"
                      checked={formData.isOrganic}
                      onChange={handleChange}
                      className="w-5 h-5 text-green-600 border-2 border-gray-300 rounded focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all duration-200"
                    />
                    <span className="ml-3 text-sm font-semibold text-gray-700">Organic</span>
                  </label>
                  <label className="flex items-center p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors duration-200">
                    <input
                      type="checkbox"
                      name="isNonGMO"
                      checked={formData.isNonGMO}
                      onChange={handleChange}
                      className="w-5 h-5 text-green-600 border-2 border-gray-300 rounded focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all duration-200"
                    />
                    <span className="ml-3 text-sm font-semibold text-gray-700">Non-GMO</span>
                  </label>
                </div>
              </div>
            </div>

            {/* Submit Buttons */}
            <div className="flex justify-end space-x-6 pt-8">
              <button
                type="button"
                onClick={() => navigate('/admin/products')}
                className="bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white px-8 py-3 rounded-xl text-sm font-semibold shadow-md hover:shadow-lg transition-all duration-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white px-8 py-3 rounded-xl text-sm font-semibold shadow-md hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Creating...' : 'Create Product'}
              </button>
            </div>
          </form>
        </main>
      </div>
    );
  };

  export default AddProduct; 