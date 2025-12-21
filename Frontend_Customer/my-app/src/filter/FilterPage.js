import React, { useState, useEffect } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { FaSearch, FaFilter, FaShoppingCart, FaCreditCard } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { addToCart } from '../store/slices/cartSlice';
import { motion, AnimatePresence } from 'framer-motion';
import FloatingShapes from '../components/FloatingShapes';

const FilterPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  


  // Scroll to top when component mounts or search params change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [searchParams]);
  const [filters, setFilters] = useState({
    category: searchParams.get('category') || '',
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
    minRating: searchParams.get('minRating') || '',
    brand: searchParams.get('brand') || '',
    isVegetarian: searchParams.get('isVegetarian') === 'true',
    isVegan: searchParams.get('isVegan') === 'true',
    isGlutenFree: searchParams.get('isGlutenFree') === 'true',
    isOrganic: searchParams.get('isOrganic') === 'true'
  });
  const [sortBy, setSortBy] = useState(searchParams.get('sortBy') || 'featured');
  const [sortOrder, setSortOrder] = useState(searchParams.get('sortOrder') || 'asc');
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state) => state.auth);
  const { addingItems, items } = useSelector((state) => state.cart);

  // Fetch categories and brands on component mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/products/categories');
        setCategories(res.data.data || []);
      } catch (err) {
        console.error('Error fetching categories:', err);
      }
    };

    const fetchBrands = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/products/brands');
        setBrands(res.data.data || []);
      } catch (err) {
        console.error('Error fetching brands:', err);
      }
    };

    fetchCategories();
    fetchBrands();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        let url = 'http://localhost:5000/api/products?';
        const params = [];
        
        if (searchQuery) params.push(`search=${encodeURIComponent(searchQuery)}`);
        if (filters.category) params.push(`category=${encodeURIComponent(filters.category)}`);
        if (filters.minPrice) params.push(`minPrice=${filters.minPrice}`);
        if (filters.maxPrice) params.push(`maxPrice=${filters.maxPrice}`);
        if (filters.minRating) params.push(`minRating=${filters.minRating}`);
        if (filters.brand) params.push(`brand=${encodeURIComponent(filters.brand)}`);
        if (filters.isVegetarian) params.push('isVegetarian=true');
        if (filters.isVegan) params.push('isVegan=true');
        if (filters.isGlutenFree) params.push('isGlutenFree=true');
        if (filters.isOrganic) params.push('isOrganic=true');
        if (sortBy) params.push(`sortBy=${sortBy}`);
        if (sortOrder) params.push(`sortOrder=${sortOrder}`);
        
        url += params.join('&');
        const res = await axios.get(url);
        setProducts(res.data.data || []);
      } catch (err) {
        console.error('Error fetching products:', err);
        setProducts([]);
      }
      setLoading(false);
    };
    fetchProducts();
  }, [searchQuery, filters, sortBy, sortOrder]);

  useEffect(() => {
    setSearchQuery(searchParams.get('search') || '');
    setFilters({
      category: searchParams.get('category') || '',
      minPrice: searchParams.get('minPrice') || '',
      maxPrice: searchParams.get('maxPrice') || '',
      minRating: searchParams.get('minRating') || '',
      brand: searchParams.get('brand') || '',
      isVegetarian: searchParams.get('isVegetarian') === 'true',
      isVegan: searchParams.get('isVegan') === 'true',
      isGlutenFree: searchParams.get('isGlutenFree') === 'true',
      isOrganic: searchParams.get('isOrganic') === 'true'
    });
    setSortBy(searchParams.get('sortBy') || 'featured');
    setSortOrder(searchParams.get('sortOrder') || 'asc');
  }, [searchParams]);

  // Update search params when searchQuery changes
  useEffect(() => {
    updateSearchParams();
  }, [searchQuery]);

  const updateSearchParams = () => {
    const params = {};
    if (searchQuery) params.search = searchQuery;
    if (filters.category) params.category = filters.category;
    if (filters.minPrice) params.minPrice = filters.minPrice;
    if (filters.maxPrice) params.maxPrice = filters.maxPrice;
    if (filters.minRating) params.minRating = filters.minRating;
    if (filters.brand) params.brand = filters.brand;
    if (filters.isVegetarian) params.isVegetarian = 'true';
    if (filters.isVegan) params.isVegan = 'true';
    if (filters.isGlutenFree) params.isGlutenFree = 'true';
    if (filters.isOrganic) params.isOrganic = 'true';
    if (sortBy) params.sortBy = sortBy;
    if (sortOrder) params.sortOrder = sortOrder;
    
    setSearchParams(params);
  };

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    
    // Update URL params immediately
    const params = {};
    if (searchQuery) params.search = searchQuery;
    if (newFilters.category) params.category = newFilters.category;
    if (newFilters.minPrice) params.minPrice = newFilters.minPrice;
    if (newFilters.maxPrice) params.maxPrice = newFilters.maxPrice;
    if (newFilters.minRating) params.minRating = newFilters.minRating;
    if (newFilters.brand) params.brand = newFilters.brand;
    if (newFilters.isVegetarian) params.isVegetarian = 'true';
    if (newFilters.isVegan) params.isVegan = 'true';
    if (newFilters.isGlutenFree) params.isGlutenFree = 'true';
    if (newFilters.isOrganic) params.isOrganic = 'true';
    if (sortBy) params.sortBy = sortBy;
    if (sortOrder) params.sortOrder = sortOrder;
    
    setSearchParams(params);
  };

  const clearFilters = () => {
    const clearedFilters = {
      category: '',
      minPrice: '',
      maxPrice: '',
      minRating: '',
      brand: '',
      isVegetarian: false,
      isVegan: false,
      isGlutenFree: false,
      isOrganic: false
    };
    setFilters(clearedFilters);
    setSearchQuery(''); // Clear search query
    setSortBy('featured');
    setSortOrder('asc');
    
    // Clear URL params completely
    setSearchParams({});
  };

  const handleAddToCart = (product) => {
    if (!isAuthenticated) {
      navigate('/signin', { state: { from: '/products' } });
      return;
    }
    
    if (!product || !product._id) {
      return;
    }
    
    dispatch(addToCart({ productId: product._id, quantity: 1 }));
  };

  const buyNow = (product) => {
    // Navigate to checkout page with product data
    navigate('/payment', { 
      state: { 
        items: [{ ...product, quantity: 1 }],
        total: product.price
      }
    });
  };

  // Helper function to check if product is in cart
  const isProductInCart = (productId) => {
    return items.some(item => item.product && item.product._id === productId);
  };

  // Helper to get the correct image URL
  const getImageUrl = (img) => {
    if (!img) return 'https://via.placeholder.com/300x300?text=No+Image';
    if (img.startsWith('/uploads/')) return `http://localhost:5000${img}`;
    return img;
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300 relative">
      <FloatingShapes />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        <motion.div 
          className="mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Products</h1>
          <p className="text-gray-600 dark:text-gray-300">Discover our premium health supplements</p>
        </motion.div>

        <motion.div 
          className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 mb-6 transition-colors duration-300"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <motion.div 
                className="relative"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
              >
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors duration-300"
                />
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                  <FaSearch />
                </div>
              </motion.div>
            </div>
            <div className="flex gap-2">
              <motion.button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 transition-colors duration-300"
                whileHover={{ scale: 1.05, rotateY: 5 }}
                whileTap={{ scale: 0.95 }}
              >
                <FaFilter />
                Filters
              </motion.button>
              <motion.select
                value={`${sortBy}-${sortOrder}`}
                onChange={(e) => {
                  const [newSortBy, newSortOrder] = e.target.value.split('-');
                  setSortBy(newSortBy);
                  setSortOrder(newSortOrder);
                }}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors duration-300"
                whileHover={{ scale: 1.05 }}
              >
                <option value="featured-asc">Featured</option>
                <option value="name-asc">Name A-Z</option>
                <option value="name-desc">Name Z-A</option>
                <option value="price-asc">Price Low to High</option>
                <option value="price-desc">Price High to Low</option>
                <option value="rating-desc">Highest Rated</option>
              </motion.select>
            </div>
          </div>
        </motion.div>

        {/* Filter Panel */}
        <AnimatePresence>
          {showFilters && (
            <motion.div 
              className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 mb-6 transition-colors duration-300"
              initial={{ opacity: 0, height: 0, y: -20 }}
              animate={{ opacity: 1, height: 'auto', y: 0 }}
              exit={{ opacity: 0, height: 0, y: -20 }}
              transition={{ duration: 0.4 }}
            >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Filters</h3>
              <motion.button
                onClick={clearFilters}
                className="text-sm text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                Clear All
              </motion.button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Category Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Category ({categories.length})</label>
                <select
                  value={filters.category}
                  onChange={(e) => handleFilterChange('category', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors duration-300"
                >
                  <option value="">All Categories</option>
                  {categories.map(category => (
                    <option key={category} value={category}>
                      {category.charAt(0).toUpperCase() + category.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              {/* Brand Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Brand ({brands.length})</label>
                <select
                  value={filters.brand}
                  onChange={(e) => handleFilterChange('brand', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="">All Brands</option>
                  {brands.map(brand => (
                    <option key={brand} value={brand}>{brand}</option>
                  ))}
                </select>
              </div>

              {/* Price Range */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Price Range</label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    placeholder="Min"
                    value={filters.minPrice}
                    onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                    className="w-1/2 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                  <input
                    type="number"
                    placeholder="Max"
                    value={filters.maxPrice}
                    onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                    className="w-1/2 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
              </div>

              {/* Rating Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Minimum Rating</label>
                <select
                  value={filters.minRating}
                  onChange={(e) => handleFilterChange('minRating', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="">Any Rating</option>
                  <option value="4">4+ Stars</option>
                  <option value="3">3+ Stars</option>
                  <option value="2">2+ Stars</option>
                </select>
              </div>
            </div>

            {/* Dietary Filters */}
            <div className="mt-6">
              <h4 className="text-sm font-medium text-gray-700 mb-3">Dietary Preferences</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={filters.isVegetarian}
                    onChange={(e) => handleFilterChange('isVegetarian', e.target.checked)}
                    className="mr-2 text-green-600 focus:ring-green-500"
                  />
                  <span className="text-sm">Vegetarian</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={filters.isVegan}
                    onChange={(e) => handleFilterChange('isVegan', e.target.checked)}
                    className="mr-2 text-green-600 focus:ring-green-500"
                  />
                  <span className="text-sm">Vegan</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={filters.isGlutenFree}
                    onChange={(e) => handleFilterChange('isGlutenFree', e.target.checked)}
                    className="mr-2 text-green-600 focus:ring-green-500"
                  />
                  <span className="text-sm">Gluten Free</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={filters.isOrganic}
                    onChange={(e) => handleFilterChange('isOrganic', e.target.checked)}
                    className="mr-2 text-green-600 focus:ring-green-500"
                  />
                  <span className="text-sm">Organic</span>
                </label>
              </div>
            </div>


          </motion.div>
          )}
        </AnimatePresence>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((item) => (
              <div key={item} className="animate-pulse">
                <div className="bg-gray-200 h-48 rounded-lg mb-4"></div>
                <div className="bg-gray-200 h-4 rounded mb-2"></div>
                <div className="bg-gray-200 h-4 rounded w-3/4"></div>
              </div>
            ))}
          </div>
        ) : (
          <>
            <motion.div 
              className="mb-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <p className="text-gray-600 dark:text-gray-300">
                Showing {products.length} products
                {(searchQuery || Object.values(filters).some(v => v && v !== '')) && (
                  <motion.button
                    onClick={clearFilters}
                    className="ml-2 text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300 underline"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Clear filters
                  </motion.button>
                )}
              </p>
            </motion.div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((product, index) => (
              <motion.div 
                key={product._id} 
                className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-2xl transition-all duration-300"
                initial={{ opacity: 0, rotateY: -90, scale: 0.8 }}
                animate={{ opacity: 1, rotateY: 0, scale: 1 }}
                transition={{ delay: index * 0.05, duration: 0.5 }}
                whileHover={{ 
                  y: -15,
                  rotateY: 5,
                  rotateX: 5,
                  scale: 1.03,
                  transition: { duration: 0.3 }
                }}
                style={{ transformStyle: 'preserve-3d' }}
              >
                <Link to={`/product/${product._id}`}>
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <img
                      src={getImageUrl(product.mainImage || (product.images && product.images[0]))}
                      alt={product.name}
                      className="w-full h-48 object-cover"
                    />
                  </motion.div>
                </Link>
                <div className="p-4" style={{ transform: 'translateZ(30px)' }}>
                  <Link to={`/product/${product._id}`}>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2">{product.name}</h3>
                  </Link>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{product.brand}</p>
                  <div className="flex items-center mb-2">
                    <div className="flex text-yellow-400">
                      {[...Array(5)].map((_, i) => (
                        <motion.span 
                          key={i} 
                          className={i < Math.floor(product.rating?.average || 0) ? "text-yellow-400" : "text-gray-300"}
                          whileHover={{ scale: 1.3, rotate: 360 }}
                          transition={{ duration: 0.3 }}
                        >
                          ★
                        </motion.span>
                      ))}
                    </div>
                    <span className="text-sm text-gray-600 dark:text-gray-400 ml-2">({product.rating?.count || 0})</span>
                  </div>
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <span className="text-lg font-bold text-green-600 dark:text-green-400">₹{product.price}</span>
                      {product.originalPrice > product.price && (
                        <span className="text-sm text-gray-500 dark:text-gray-500 line-through ml-2">₹{product.originalPrice}</span>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <motion.button
                      onClick={() => buyNow(product)}
                      className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <FaCreditCard />
                      Buy Now
                    </motion.button>
                    <motion.button
                      onClick={isProductInCart(product._id) ? () => navigate('/cart') : () => handleAddToCart(product)}
                      disabled={addingItems[product._id]}
                      className={`w-full py-2 px-4 rounded-lg text-sm font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 ${
                        isProductInCart(product._id) 
                          ? 'bg-blue-600 text-white hover:bg-blue-700' 
                          : 'bg-green-600 text-white hover:bg-green-700'
                      }`}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <FaShoppingCart />
                      {addingItems[product._id] ? 'Adding...' : isProductInCart(product._id) ? 'Go to Cart' : 'Add to Cart'}
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
            {products.length === 0 && !loading && (
              <motion.div 
                className="text-center py-12"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
              >
                <p className="text-gray-500 dark:text-gray-400 text-lg">No products found matching your criteria.</p>
                <motion.button
                  onClick={clearFilters}
                  className="mt-4 text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300 underline"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Clear all filters
                </motion.button>
              </motion.div>
            )}
          </div>
          </>
        )}
      </div>
    </div>
  );
};

export default FilterPage;
