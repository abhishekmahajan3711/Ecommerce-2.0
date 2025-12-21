import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const ProductManagement = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    search: '',
    category: '',
    brand: '',
    isActive: '',
    isFeatured: '',
    isVegetarian: '',
    isVegan: '',
    isGlutenFree: '',
    isOrganic: '',
    minPrice: '',
    maxPrice: '',
    minStock: '',
    maxStock: ''
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [showFilters, setShowFilters] = useState(true); // Show/hide filters

  const fetchProducts = useCallback(async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const params = new URLSearchParams({
        page: currentPage,
        limit: 12,
        sortBy,
        sortOrder
      });

      // Add filters to params
      Object.keys(filters).forEach(key => {
        if (filters[key] !== '') {
          params.append(key, filters[key]);
        }
      });

      const response = await axios.get(`http://localhost:5000/api/admin/products?${params}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setProducts(response.data.data);
      setTotalPages(response.data.pagination.pages);
      setError('');
    } catch (error) {
      console.error('Error fetching products:', error);
      setError('Failed to fetch products. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [currentPage, filters, sortBy, sortOrder]);

  const fetchCategories = useCallback(async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/products/categories');
      setCategories(response.data.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  }, []);

  // useEffect hooks after function definitions
  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, [fetchProducts, fetchCategories]);

  // Helper to get the correct image URL
  const getImageUrl = (img) => {
    if (!img) return 'https://via.placeholder.com/300x300?text=No+Image';
    if (img.startsWith('/uploads/')) return `http://localhost:5000${img}`;
    return img;
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
    setCurrentPage(1);
  };

  const handleSearchChange = (value) => {
    setFilters(prev => ({
      ...prev,
      search: value
    }));
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      category: '',
      brand: '',
      isActive: '',
      isFeatured: '',
      isVegetarian: '',
      isVegan: '',
      isGlutenFree: '',
      isOrganic: '',
      minPrice: '',
      maxPrice: '',
      minStock: '',
      maxStock: ''
    });
    setCurrentPage(1);
  };

  const handleDeleteProduct = async (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        const token = localStorage.getItem('adminToken');
        await axios.delete(`http://localhost:5000/api/admin/products/${productId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        window.alert("Product Deleted");
        fetchProducts();
      } catch (error) {
        console.error('Error deleting product:', error);
      }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    navigate('/admin/signin');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-white shadow-lg border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <button
                onClick={() => navigate('/admin/dashboard')}
                className="mr-4 text-gray-600 hover:text-gray-900 transition-colors duration-200"
              >
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <h1 className="text-2xl font-bold text-gray-900">Product Management</h1>
            </div>
            <div className="flex items-center space-x-4">
              {/* View Controls */}
              <div className="flex items-center bg-white rounded-xl shadow-md border border-gray-200 p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-lg transition-all duration-200 ${
                    viewMode === 'grid'
                      ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-md'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                  title="Grid View"
                >
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M3 3h7v7H3V3zm0 11h7v7H3v-7zm11-11h7v7h-7V3zm0 11h7v7h-7v-7z"/>
                  </svg>
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-lg transition-all duration-200 ${
                    viewMode === 'list'
                      ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-md'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                  title="List View"
                >
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M3 13h2v-2H3v2zm0 4h2v-2H3v2zm0-8h2V7H3v2zm4 4h14v-2H7v2zm0 4h14v-2H7v2zM7 7v2h14V7H7z"/>
                  </svg>
                </button>
              </div>

              {/* Filter Toggle */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center px-4 py-2 rounded-lg text-sm font-semibold shadow-md transition-all duration-200 ${
                  showFilters
                    ? 'bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white'
                    : 'bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white'
                }`}
                title={showFilters ? 'Hide Filters' : 'Show Filters'}
              >
                <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.207A1 1 0 013 6.5V4z" />
                </svg>
                {showFilters ? 'Hide Filters' : 'Show Filters'}
              </button>

              <button
                onClick={() => navigate('/admin/products/add')}
                className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white px-6 py-2 rounded-lg text-sm font-semibold shadow-md hover:shadow-lg transition-all duration-200"
              >
                + Add New Product
              </button>
              <button
                onClick={handleLogout}
                className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white px-4 py-2 rounded-lg text-sm font-semibold shadow-md hover:shadow-lg transition-all duration-200"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Error Display */}
      {error && (
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-red-50 to-red-100 border border-red-300 rounded-xl p-4 shadow-sm">
            <div className="flex items-center">
              <svg className="h-5 w-5 text-red-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <div className="text-sm font-medium text-red-800">{error}</div>
            </div>
          </div>
        </div>
      )}

      {/* Filters Section */}
      {showFilters && (
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="bg-white shadow-xl rounded-2xl mb-8 border border-gray-100">
            <div className="px-6 py-6">
              <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                <svg className="h-6 w-6 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.207A1 1 0 013 6.5V4z" />
                </svg>
                Filters & Search
              </h3>
              
              {/* Search and Basic Filters */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Search</label>
                  <input
                    type="text"
                    value={filters.search}
                    onChange={(e) => handleSearchChange(e.target.value)}
                    placeholder="Search products..."
                    className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Category</label>
                  <select
                    value={filters.category}
                    onChange={(e) => handleFilterChange('category', e.target.value)}
                    className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                  >
                    <option value="">All Categories</option>
                    {categories.map(category => (
                      <option key={category} value={category}>
                        {category.charAt(0).toUpperCase() + category.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Brand</label>
                  <input
                    type="text"
                    value={filters.brand}
                    onChange={(e) => handleFilterChange('brand', e.target.value)}
                    placeholder="Filter by brand..."
                    className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Status</label>
                  <select
                    value={filters.isActive}
                    onChange={(e) => handleFilterChange('isActive', e.target.value)}
                    className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                  >
                    <option value="">All Status</option>
                    <option value="true">Active</option>
                    <option value="false">Inactive</option>
                  </select>
                </div>
              </div>

              {/* Price and Stock Range Filters */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Min Price (₹)</label>
                  <input
                    type="number"
                    value={filters.minPrice}
                    onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                    placeholder="0"
                    className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Max Price (₹)</label>
                  <input
                    type="number"
                    value={filters.maxPrice}
                    onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                    placeholder="10000"
                    className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Min Stock</label>
                  <input
                    type="number"
                    value={filters.minStock}
                    onChange={(e) => handleFilterChange('minStock', e.target.value)}
                    placeholder="0"
                    className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Max Stock</label>
                  <input
                    type="number"
                    value={filters.maxStock}
                    onChange={(e) => handleFilterChange('maxStock', e.target.value)}
                    placeholder="1000"
                    className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                  />
                </div>
              </div>

              {/* Product Attributes Filters */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Featured</label>
                  <select
                    value={filters.isFeatured}
                    onChange={(e) => handleFilterChange('isFeatured', e.target.value)}
                    className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                  >
                    <option value="">All</option>
                    <option value="true">Featured</option>
                    <option value="false">Not Featured</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Vegetarian</label>
                  <select
                    value={filters.isVegetarian}
                    onChange={(e) => handleFilterChange('isVegetarian', e.target.value)}
                    className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                  >
                    <option value="">All</option>
                    <option value="true">Vegetarian</option>
                    <option value="false">Non-Vegetarian</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Vegan</label>
                  <select
                    value={filters.isVegan}
                    onChange={(e) => handleFilterChange('isVegan', e.target.value)}
                    className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                  >
                    <option value="">All</option>
                    <option value="true">Vegan</option>
                    <option value="false">Non-Vegan</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Gluten Free</label>
                  <select
                    value={filters.isGlutenFree}
                    onChange={(e) => handleFilterChange('isGlutenFree', e.target.value)}
                    className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                  >
                    <option value="">All</option>
                    <option value="true">Gluten Free</option>
                    <option value="false">Contains Gluten</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Organic</label>
                  <select
                    value={filters.isOrganic}
                    onChange={(e) => handleFilterChange('isOrganic', e.target.value)}
                    className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                  >
                    <option value="">All</option>
                    <option value="true">Organic</option>
                    <option value="false">Non-Organic</option>
                  </select>
                </div>
              </div>

              {/* Sort and Clear Filters */}
              <div className="flex flex-wrap items-center justify-between gap-6 pt-4 border-t border-gray-200">
                <div className="flex items-center space-x-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Sort By</label>
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="border-2 border-gray-200 rounded-xl px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                    >
                      <option value="createdAt">Date Created</option>
                      <option value="name">Name</option>
                      <option value="price">Price</option>
                      <option value="stock">Stock</option>
                      <option value="rating.average">Rating</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Order</label>
                    <select
                      value={sortOrder}
                      onChange={(e) => setSortOrder(e.target.value)}
                      className="border-2 border-gray-200 rounded-xl px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                    >
                      <option value="desc">Descending</option>
                      <option value="asc">Ascending</option>
                    </select>
                  </div>
                </div>
                <button
                  onClick={clearFilters}
                  className="bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white px-6 py-3 rounded-xl text-sm font-semibold shadow-md hover:shadow-lg transition-all duration-200"
                >
                  Clear All Filters
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Products Display */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Results Counter */}
        <div className="flex items-center justify-between mb-6">
          <div className="text-sm text-gray-600">
            Showing {products.length} product{products.length !== 1 ? 's' : ''} 
            {Object.values(filters).some(value => value !== '') && ' (filtered)'}
          </div>
          <div className="text-sm text-gray-600">
            Page {currentPage} of {totalPages}
          </div>
        </div>

        {viewMode === 'grid' ? (
          /* Grid View */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {products.map((product) => (
              <div key={product._id} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 border border-gray-100 group">
                <div className="relative">
                  <img
                    src={getImageUrl(product.mainImage || product.images?.[0])}
                    alt={product.name}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-3 right-3">
                    <span className="text-2xl font-bold text-green-600 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full shadow-lg">₹{product.price}</span>
                  </div>
                </div>
                <div className="p-6">
                  <div className="mb-3">
                    <h3 className="text-lg font-bold text-gray-900 truncate mb-1">{product.name}</h3>
                    <p className="text-sm text-gray-600 line-clamp-2">{product.shortDescription || product.description}</p>
                  </div>
                  
                  <div className="flex items-center justify-between mb-3 text-sm">
                    <span className="text-gray-500 capitalize font-medium">{product.category}</span>
                    <span className="text-gray-500 font-medium">{product.brand}</span>
                  </div>

                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm font-semibold text-gray-700 bg-gray-100 px-3 py-1 rounded-full">Stock: {product.stock}</span>
                    <div className="flex items-center bg-yellow-100 px-3 py-1 rounded-full">
                      <span className="text-yellow-600 mr-1">★</span>
                      <span className="text-sm font-semibold text-yellow-700">{product.rating?.average?.toFixed(1) || '0.0'}</span>
                    </div>
                  </div>

                  {/* Status Badges */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {product.isActive && (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-gradient-to-r from-green-100 to-green-200 text-green-800 border border-green-300">
                        Active
                      </span>
                    )}
                    {product.isFeatured && (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-gradient-to-r from-yellow-100 to-yellow-200 text-yellow-800 border border-yellow-300">
                        Featured
                      </span>
                    )}
                    {product.isVegetarian && (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 border border-blue-300">
                        Vegetarian
                      </span>
                    )}
                    {product.isVegan && (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-gradient-to-r from-purple-100 to-purple-200 text-purple-800 border border-purple-300">
                        Vegan
                      </span>
                    )}
                    {product.isGlutenFree && (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-gradient-to-r from-orange-100 to-orange-200 text-orange-800 border border-orange-300">
                        Gluten Free
                      </span>
                    )}
                    {product.isOrganic && (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-gradient-to-r from-emerald-100 to-emerald-200 text-emerald-800 border border-emerald-300">
                        Organic
                      </span>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex space-x-3">
                    <button
                      onClick={() => navigate(`/admin/products/edit/${product._id}`)}
                      className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-4 py-3 rounded-xl text-sm font-semibold shadow-md hover:shadow-lg transition-all duration-200"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteProduct(product._id)}
                      className="flex-1 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white px-4 py-3 rounded-xl text-sm font-semibold shadow-md hover:shadow-lg transition-all duration-200"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* List View */
          <div className="space-y-2">
            {products.map((product) => (
              <div key={product._id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 border border-gray-100">
                <div className="flex">
                  {/* Product Image */}
                  <div className="relative w-24 h-20 flex-shrink-0">
                    <img
                      src={getImageUrl(product.mainImage || product.images?.[0])}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-1 right-1">
                      <span className="text-xs font-bold text-green-600 bg-white/90 backdrop-blur-sm px-1 py-0.5 rounded shadow">₹{product.price}</span>
                    </div>
                  </div>
                  
                  {/* Product Details */}
                  <div className="flex-1 p-3">
                    <div className="flex items-center justify-between h-full">
                      <div className="flex-1">
                                                  {/* Product Name and Basic Info */}
                          <div className="flex items-center space-x-4 mb-2">
                            <h3 className="text-base font-bold text-gray-900">{product.name}</h3>
                            <span className="text-gray-500 capitalize text-sm">{product.category}</span>
                            <span className="text-gray-500 text-sm">{product.brand}</span>
                            <span className="text-gray-500 text-sm">Stock: {product.stock}</span>
                            {/* Rating */}
                            <div className="flex items-center bg-yellow-100 px-2 py-0.5 rounded-full">
                              <span className="text-yellow-600 mr-1 text-xs">★</span>
                              <span className="text-xs font-semibold text-yellow-700">{product.rating?.average?.toFixed(1) || '0.0'}</span>
                            </div>
                          </div>
                          
                          {/* Product Attributes */}
                          <div className="flex items-center justify-between">
                            {/* Status Badges */}
                            <div className="flex flex-wrap gap-1">
                              {product.isActive && (
                                <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-bold bg-gradient-to-r from-green-100 to-green-200 text-green-800 border border-green-300">
                                  Active
                                </span>
                              )}
                              {product.isFeatured && (
                                <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-bold bg-gradient-to-r from-yellow-100 to-yellow-200 text-yellow-800 border border-yellow-300">
                                  Featured
                                </span>
                              )}
                              {product.isVegetarian && (
                                <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-bold bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 border border-blue-300">
                                  Vegetarian
                                </span>
                              )}
                              {product.isVegan && (
                                <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-bold bg-gradient-to-r from-purple-100 to-purple-200 text-purple-800 border border-purple-300">
                                  Vegan
                                </span>
                              )}
                              {product.isGlutenFree && (
                                <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-bold bg-gradient-to-r from-orange-100 to-orange-200 text-orange-800 border border-orange-300">
                                  Gluten Free
                                </span>
                              )}
                              {product.isOrganic && (
                                <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-bold bg-gradient-to-r from-emerald-100 to-emerald-200 text-emerald-800 border border-emerald-300">
                                  Organic
                                </span>
                              )}
                            </div>
                          </div>
                      </div>
                      
                      {/* Action Buttons */}
                      <div className="flex space-x-1 ml-3">
                        <button
                          onClick={() => navigate(`/admin/products/edit/${product._id}`)}
                          className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-3 py-1.5 rounded text-xs font-semibold shadow-md hover:shadow-lg transition-all duration-200"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(product._id)}
                          className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white px-3 py-1.5 rounded text-xs font-semibold shadow-md hover:shadow-lg transition-all duration-200"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
          <div className="flex items-center justify-center">
            <nav className="flex items-center space-x-3 bg-white rounded-2xl shadow-lg p-4 border border-gray-100">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 border-2 border-gray-200 rounded-xl text-sm font-semibold text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              >
                Previous
              </button>
              
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`px-4 py-2 border-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
                    currentPage === page
                      ? 'bg-gradient-to-r from-green-600 to-green-700 text-white border-green-600 shadow-lg'
                      : 'border-gray-200 text-gray-700 bg-white hover:bg-gray-50 hover:border-gray-300'
                  }`}
                >
                  {page}
                </button>
              ))}
              
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-4 py-2 border-2 border-gray-200 rounded-xl text-sm font-semibold text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              >
                Next
              </button>
            </nav>
          </div>
        </div>
      )}

      {/* No Products Message */}
      {products.length === 0 && !loading && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
          <div className="text-center py-12">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No products found</h3>
            <p className="mt-1 text-sm text-gray-500">Try adjusting your filters or add a new product.</p>
            <div className="mt-6">
              <button
                onClick={() => navigate('/admin/products/add')}
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
              >
                Add New Product
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductManagement; 