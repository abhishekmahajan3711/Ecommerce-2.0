import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaArrowRight, FaLeaf, FaHeart, FaShieldAlt, FaTruck, FaStar } from 'react-icons/fa';
import { useSelector, useDispatch } from 'react-redux';
import { fetchHeroSection } from '../store/slices/heroSlice';
import { fetchCategories } from '../store/slices/categorySlice';
import { motion } from 'framer-motion';
import FloatingShapes from '../components/FloatingShapes';

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const hero = useSelector(state => state.hero.data);
  const heroLoading = useSelector(state => state.hero.loading);
  const heroError = useSelector(state => state.hero.error);
  const categoriesData = useSelector(state => state.category.data);
  const categoriesLoading = useSelector(state => state.category.loading);
  const categoriesError = useSelector(state => state.category.error);

  const handleGetStarted = () => {
    if (isAuthenticated) {
      navigate('/products');
    } else {
      navigate('/signin');
    }
  };

  // Fetch featured products from backend
  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:5000/api/products/featured');
        const data = await response.json();
        
        if (data.success) {
          setFeaturedProducts(data.data);
        } else {
          console.error('Failed to fetch featured products:', data.message);
        }
      } catch (error) {
        console.error('Error fetching featured products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedProducts();
  }, []);

  useEffect(() => {
    if (!hero && !heroLoading && !heroError) {
      dispatch(fetchHeroSection());
    }
  }, [hero, heroLoading, heroError, dispatch]);

  useEffect(() => {
    if (!categoriesData.length && !categoriesLoading && !categoriesError) {
      dispatch(fetchCategories());
    }
  }, [categoriesData, categoriesLoading, categoriesError, dispatch]);

  // Fallback categories if API fails
  const fallbackCategories = [
    { name: "Vitamins", icon: "💊", link: "/products?category=vitamins", color: "bg-cyan-100" },
    { name: "Minerals", icon: "⚡", link: "/products?category=minerals", color: "bg-cyan-100" },
    { name: "Protein", icon: "💪", link: "/products?category=protein", color: "bg-red-100" },
    { name: "Omega-3", icon: "🐟", link: "/products?category=omega3", color: "bg-yellow-100" },
    { name: "Probiotics", icon: "🦠", link: "/products?category=probiotics", color: "bg-purple-100" },
    { name: "Antioxidants", icon: "🛡️", link: "/products?category=antioxidants", color: "bg-pink-100" }
  ];

  // Use categories from API or fallback
  const displayCategories = categoriesData.length > 0 ? categoriesData : fallbackCategories;

  const benefits = [
    {
      icon: <FaLeaf className="text-3xl text-cyan-600" />,
      title: "Nature-Inspired Formulations",
      description: "Our upcoming range may include products made with naturally derived ingredients."
    },
    {
      icon: <FaHeart className="text-3xl text-red-600" />,
      title: "Wellness-Oriented",
      description: "We aim to offer formulations that align with general health and wellness goals."
    },
    {
      icon: <FaShieldAlt className="text-3xl text-cyan-600" />,
      title: "Thoughtful Quality",
      description: "We strive to source from trusted partners and may incorporate quality checks as we grow."
    },
    {
      icon: <FaTruck className="text-3xl text-orange-600" />,
      title: "Hassle-Free Shipping",
      description: "We plan to offer fast and reliable delivery options, including free shipping on select orders."
    }
  ];
  

  // Helper to get the correct image URL
  const getImageUrl = (img) => {
    if (!img) return 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=600&h=400&fit=crop';
    if (img.startsWith('/uploads/')) return `http://localhost:5000${img}`;
    return img;
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300 relative">
      <FloatingShapes />
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-cyan-500 to-teal-500 dark:from-cyan-700 dark:to-teal-700 text-white transition-colors duration-300 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          {heroLoading ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <div className="bg-gray-400 h-12 mb-6 rounded-lg animate-pulse"></div>
                <div className="bg-gray-400 h-8 mb-8 rounded-lg animate-pulse"></div>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <div className="bg-gray-400 h-12 w-32 rounded-lg animate-pulse"></div>
                  <div className="bg-gray-400 h-12 w-32 rounded-lg animate-pulse"></div>
                </div>
              </div>
              <div className="hidden lg:block">
                <div className="bg-gray-400 h-96 rounded-lg animate-pulse"></div>
              </div>
            </div>
          ) : heroError ? (
            <div className="text-center">
              <div className="text-2xl font-bold mb-4">Server is down</div>
              <p className="text-cyan-100">Please try again later</p>
            </div>
          ) : hero ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
              >
                <motion.h1 
                  className="font-poppins text-4xl md:text-6xl font-bold mb-6"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.8 }}
                >
                  {hero.heading}
                </motion.h1>
                <motion.p 
                  className="text-xl mb-8 text-cyan-100"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 0.8 }}
                >
                  {hero.subheading}
                </motion.p>
                <motion.div 
                  className="flex flex-col sm:flex-row gap-4 justify-center"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6, duration: 0.8 }}
                >
                  {hero.buttons && hero.buttons.map((btn, idx) => (
                    <motion.div
                      key={idx}
                      whileHover={{ scale: 1.05, rotateY: 5 }}
                      whileTap={{ scale: 0.95 }}
                      style={{ transformStyle: 'preserve-3d' }}
                    >
                      <Link
                        to={btn.link}
                        className={
                          idx === 0
                            ? "bg-white text-cyan-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors inline-flex items-center justify-center shadow-lg"
                            : "border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-cyan-600 transition-colors inline-flex items-center justify-center shadow-lg"
                        }
                      >
                        {btn.text}
                        {idx === 0 && <FaArrowRight className="ml-2" />}
                      </Link>
                    </motion.div>
                  ))}
                </motion.div>
              </motion.div>
              <motion.div 
                className="hidden lg:block"
                initial={{ opacity: 0, scale: 0.8, rotateY: -30 }}
                animate={{ 
                  opacity: 1, 
                  scale: 1, 
                  rotateY: 0,
                  y: [0, -20, 0]
                }}
                transition={{ 
                  duration: 1,
                  y: {
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }
                }}
                style={{ transformStyle: 'preserve-3d' }}
                whileHover={{ scale: 1.05, rotateY: 5 }}
              >
                <img
                  src="/pharma.jpg"
                  alt="Hero"
                  className="rounded-lg shadow-2xl"
                  style={{ transform: 'translateZ(50px)' }}
                />
              </motion.div>
            </div>
          ) : null}
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-gray-50 dark:bg-gray-800 transition-colors duration-300 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Shop by Category</h2>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Explore our comprehensive range of health supplements organized by category
            </p>
          </div>
          
          {categoriesLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
              {[1, 2, 3, 4, 5, 6].map((item) => (
                <div key={item} className="animate-pulse">
                  <div className="bg-gray-200 h-24 rounded-lg mb-3"></div>
                  <div className="bg-gray-200 h-4 rounded"></div>
                </div>
              ))}
            </div>
          ) : categoriesError ? (
            <div className="text-center">
              <p className="text-gray-600">Failed to load categories. Using default categories.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
              {displayCategories.map((category, index) => (
                <motion.div
                  key={category._id || index}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  whileHover={{ 
                    scale: 1.1, 
                    rotateY: 10,
                    rotateX: 10,
                    z: 50
                  }}
                  style={{ transformStyle: 'preserve-3d' }}
                >
                  <Link
                    to={category.link}
                    className={`${category.color} p-6 rounded-lg text-center hover:shadow-2xl transition-all duration-300 block`}
                    style={{ transform: 'translateZ(20px)' }}
                  >
                    <motion.div 
                      className="text-4xl mb-3"
                      whileHover={{ scale: 1.2, rotate: 360 }}
                      transition={{ duration: 0.5 }}
                    >
                      {category.icon}
                    </motion.div>
                    <h3 className="font-semibold text-gray-900">{category.name}</h3>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 bg-white dark:bg-gray-900 transition-colors duration-300 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Featured Products</h2>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Our most popular and highly-rated health supplements
            </p>
          </div>
          
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((item) => (
                <div key={item} className="animate-pulse">
                  <div className="bg-gray-200 h-48 rounded-lg mb-4"></div>
                  <div className="bg-gray-200 h-4 rounded mb-2"></div>
                  <div className="bg-gray-200 h-4 rounded w-3/4"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts.map((product, index) => (
                <motion.div
                  key={product._id}
                  initial={{ opacity: 0, rotateY: -90 }}
                  whileInView={{ opacity: 1, rotateY: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, duration: 0.6 }}
                  whileHover={{ 
                    y: -10,
                    rotateY: 5,
                    scale: 1.03,
                    transition: { duration: 0.3 }
                  }}
                  style={{ transformStyle: 'preserve-3d' }}
                  className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-2xl transition-all duration-300"
                >
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <img
                      src={getImageUrl(product.mainImage)}
                      alt={product.name}
                      className="w-full h-48 object-cover"
                    />
                  </motion.div>
                  <div className="p-4" style={{ transform: 'translateZ(30px)' }}>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2">{product.name}</h3>
                    <div className="flex items-center mb-2">
                      <div className="flex text-yellow-400">
                        {[...Array(5)].map((_, i) => (
                          <motion.div
                            key={i}
                            whileHover={{ scale: 1.3, rotate: 360 }}
                            transition={{ duration: 0.3 }}
                          >
                            <FaStar 
                              className={i < Math.floor(product.rating?.average || 0) ? "text-yellow-400" : "text-gray-300"} 
                            />
                          </motion.div>
                        ))}
                      </div>
                      <span className="text-sm text-gray-600 ml-2">({product.rating?.count || 0})</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-lg font-bold text-cyan-600">₹{product.price}</span>
                        {product.originalPrice > product.price && (
                          <span className="text-sm text-gray-500 line-through ml-2">₹{product.originalPrice}</span>
                        )}
                      </div>
                      <motion.div
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <Link
                          to={`/product/${product._id}`}
                          className="bg-teal-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-cyan-700 transition-colors"
                        >
                          View Details
                        </Link>
                      </motion.div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
          
          <div className="text-center mt-8">
            <motion.div
              whileHover={{ scale: 1.1, rotateY: 5 }}
              whileTap={{ scale: 0.95 }}
              style={{ transformStyle: 'preserve-3d', display: 'inline-block' }}
            >
              <Link
                to="/products"
                className="inline-flex items-center bg-cyan-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-cyan-700 transition-colors shadow-xl"
              >
                <span style={{ transform: 'translateZ(20px)' }}>View All Products</span>
                <motion.span
                  animate={{ x: [0, 5, 0] }}
                  transition={{ duration: 1, repeat: Infinity }}
                  style={{ transform: 'translateZ(20px)' }}
                >
                  <FaArrowRight className="ml-2" />
                </motion.span>
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 bg-gray-50 dark:bg-gray-800 transition-colors duration-300 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Why Choose AstraPharma?</h2>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              We're committed to providing you with the highest quality health supplements
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => (
              <motion.div 
                key={index} 
                className="text-center"
                initial={{ opacity: 0, y: 50, rotateX: -90 }}
                whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15, duration: 0.6 }}
                whileHover={{ 
                  scale: 1.1,
                  rotateY: 10,
                  z: 50,
                  transition: { duration: 0.3 }
                }}
                style={{ transformStyle: 'preserve-3d' }}
              >
                <motion.div 
                  className="flex justify-center mb-4"
                  whileHover={{ 
                    scale: 1.3, 
                    rotate: 360,
                    transition: { duration: 0.6 }
                  }}
                  style={{ transform: 'translateZ(40px)' }}
                >
                  {benefit.icon}
                </motion.div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">{benefit.title}</h3>
                <p className="text-gray-600 dark:text-gray-300">{benefit.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-cyan-600 dark:bg-cyan-800 text-white transition-colors duration-300 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Start Your Health Journey?</h2>
          <p className="text-xl mb-8 text-cyan-100">
          Join health-focused individuals across the country who choose AstraPharma as their trusted partner in wellness and nutrition.
          </p>
          <motion.button
            onClick={handleGetStarted}
            className="bg-white text-cyan-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors inline-flex items-center shadow-2xl"
            whileHover={{ 
              scale: 1.1,
              rotateY: 10,
              rotateX: -5,
              transition: { duration: 0.3 }
            }}
            whileTap={{ scale: 0.95 }}
            style={{ transformStyle: 'preserve-3d' }}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span style={{ transform: 'translateZ(20px)' }}>Get Started Today</span>
            <motion.span
              animate={{ x: [0, 5, 0] }}
              transition={{ duration: 1, repeat: Infinity }}
              style={{ transform: 'translateZ(20px)' }}
            >
              <FaArrowRight className="ml-2" />
            </motion.span>
          </motion.button>
        </div>
      </section>
    </div>
  );
};

export default Home;
