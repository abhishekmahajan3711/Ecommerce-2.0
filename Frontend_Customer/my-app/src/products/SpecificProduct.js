import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaStar, FaShoppingCart, FaCreditCard, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { addToCart, selectIsProductInCart } from '../store/slices/cartSlice';

const SpecificProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state) => state.auth);
  const { loading: cartLoading, addingItems, items } = useSelector((state) => state.cart);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [showSuccess, setShowSuccess] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [showFullDescription, setShowFullDescription] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await axios.get(`http://localhost:5000/api/products/${id}`);
        setProduct(response.data.data);
      } catch (err) {
        console.error('Error fetching product:', err);
        setError(err.response?.data?.message || 'Failed to fetch product details');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProduct();
    }
  }, [id]);

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Reset quantity when product changes
  useEffect(() => {
    if (product) {
      setQuantity(1);
      setSelectedImageIndex(0);
    }
  }, [product]);

  const handleQuantityChange = (newQuantity) => {
    const maxStock = product.stock || 0;
    if (newQuantity >= 1 && newQuantity <= maxStock) {
      setQuantity(newQuantity);
    }
  };

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      navigate('/signin', { state: { from: `/product/${id}` } });
      return;
    }
    
    if (!product || !product._id) {
      return;
    }
    
    dispatch(addToCart({ productId: product._id, quantity }));
  };

  const buyNow = () => {
    // Navigate to checkout page with product data
    navigate('/payment', { 
      state: { 
        items: [{ ...product, quantity }],
        total: product.price * quantity
      }
    });
  };

  // Helper function to check if product is in cart
  const isProductInCart = (productId) => {
    return items.some(item => item.product._id === productId);
  };

  // Get all images for the product
  const getAllImages = () => {
    const images = [];
    if (product.mainImage) {
      images.push(product.mainImage);
    }
    if (product.images && product.images.length > 0) {
      product.images.forEach(img => {
        if (img !== product.mainImage) {
          images.push(img);
        }
      });
    }
    return images.length > 0 ? images : ["https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=600&h=600&fit=crop"];
  };

  const images = product ? getAllImages() : [];

  const nextImage = () => {
    setSelectedImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setSelectedImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  // Helper to get the correct image URL
  const getImageUrl = (img) => {
    if (!img) return 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=600&h=600&fit=crop';
    if (img.startsWith('/uploads/')) return `http://localhost:5000${img}`;
    return img;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Error</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={() => window.history.back()} 
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Product Not Found</h2>
          <p className="text-gray-600 mb-4">The product you're looking for doesn't exist.</p>
          <button 
            onClick={() => window.history.back()} 
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8">
            {/* Product Image Gallery */}
            <div>
              <div className="relative">
                <img
                  src={getImageUrl(images[selectedImageIndex])}
                  alt={`${product.name} - Image ${selectedImageIndex + 1}`}
                  className="w-full h-96 object-cover rounded-lg"
                />
                {images.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-md"
                    >
                      <FaChevronLeft className="text-gray-600" />
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-md"
                    >
                      <FaChevronRight className="text-gray-600" />
                    </button>
                  </>
                )}
              </div>
              
              {/* Image Thumbnails */}
              {images.length > 1 && (
                <div className="flex gap-2 mt-4 overflow-x-auto">
                  {images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImageIndex(index)}
                      className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 ${
                        index === selectedImageIndex ? 'border-green-500' : 'border-gray-200'
                      }`}
                    >
                      <img
                        src={getImageUrl(image)}
                        alt={`${product.name} thumbnail ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div>
              <div className="mb-4">
                <span className="text-sm text-gray-500 uppercase tracking-wide">{product.brand}</span>
                <h1 className="text-3xl font-bold text-gray-900 mt-1">{product.name}</h1>
                {product.shortDescription && (
                  <p className="text-gray-600 mt-2">{product.shortDescription}</p>
                )}
              </div>

              {/* Rating */}
              <div className="flex items-center mb-4">
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className={i < Math.floor(product.rating?.average || 0) ? "text-yellow-400" : "text-gray-300"}>
                      ★
                    </span>
                  ))}
                </div>
                <span className="text-sm text-gray-600 ml-2">({product.rating?.count || 0} reviews)</span>
              </div>

              {/* Price */}
              <div className="mb-6">
                <div className="flex items-center gap-3">
                  <span className="text-3xl font-bold text-green-600">₹{product.price}</span>
                  {product.originalPrice > product.price && (
                    <span className="text-xl text-gray-500 line-through">₹{product.originalPrice}</span>
                  )}
                  {product.discount > 0 && (
                    <span className="bg-red-100 text-red-800 text-sm font-medium px-2 py-1 rounded">
                      {product.discount}% OFF
                    </span>
                  )}
                </div>
              </div>


              {/* Success Message */}
              {showSuccess && (
                <div className="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-md mb-6">
                  ✓ Item added to cart successfully!
                </div>
              )}

              {/* Dietary Badges */}
              <div className="flex flex-wrap gap-2 mb-6">
                {product.isVegetarian && (
                  <span className="bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded">Vegetarian</span>
                )}
                {product.isVegan && (
                  <span className="bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded">Vegan</span>
                )}
                {product.isGlutenFree && (
                  <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded">Gluten Free</span>
                )}
                {product.isOrganic && (
                  <span className="bg-yellow-100 text-yellow-800 text-xs font-medium px-2 py-1 rounded">Organic</span>
                )}
                {product.isNonGMO && (
                  <span className="bg-purple-100 text-purple-800 text-xs font-medium px-2 py-1 rounded">Non-GMO</span>
                )}
              </div>

              {/* Quantity and Add to Cart */}
              <div className="mb-6">
                <div className="flex items-center gap-4 mb-4">
                  <label className="text-sm font-medium text-gray-700">Quantity:</label>
                  <div className="flex items-center border border-gray-300 rounded-lg">
                    <button
                      onClick={() => handleQuantityChange(quantity - 1)}
                      className="px-3 py-2 text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={quantity <= 1}
                    >
                      -
                    </button>
                    <span className="px-4 py-2 border-x border-gray-300 min-w-[3rem] text-center">{quantity}</span>
                    <button
                      onClick={() => handleQuantityChange(quantity + 1)}
                      className="px-3 py-2 text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={quantity >= (product.stock || 0)}
                    >
                      +
                    </button>
                  </div>
                  <span className="text-sm text-gray-500">({product.stock || 0} in stock)</span>
                </div>

                <div className="flex flex-col gap-3">
                  <button
                    onClick={buyNow}
                    className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                  >
                    <FaCreditCard />
                    Buy Now
                  </button>
                  <button
                    onClick={isProductInCart(product?._id) ? () => navigate('/cart') : handleAddToCart}
                    disabled={addingItems[product?._id]}
                    className={`w-full py-3 px-6 rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 ${
                      isProductInCart(product?._id) 
                        ? 'bg-blue-600 text-white hover:bg-blue-700' 
                        : 'bg-green-600 text-white hover:bg-green-700'
                    }`}
                  >
                    <FaShoppingCart />
                    {addingItems[product?._id] ? 'Adding...' : isProductInCart(product?._id) ? 'Go to Cart' : 'Add to Cart'}
                  </button>
                </div>
              </div>
            </div>
          </div>

          
              {/* Description */}
              <div className="mt-8 mb-6 max-w-5xl mx-auto">
                <p
                  className={`text-gray-600 text-base leading-relaxed transition-all ${
                    showFullDescription ? '' : 'line-clamp-4'
                  }`}
                  style={{ whiteSpace: showFullDescription ? 'pre-line' : 'normal' }}
                >
                  {product.description}
                </p>
                {product.description && product.description.length > 100 && (
                  <button
                    className="mt-2 text-blue-600 text-sm underline focus:outline-none"
                    onClick={() => setShowFullDescription((prev) => !prev)}
                  >
                    {showFullDescription ? 'Show less' : 'Read more'}
                  </button>
                )}
              </div>

          {/* Product Details */}
          <div className="border-t border-gray-200 px-8 py-8">
            
            <div className="space-y-6">
              {/* First Row: Product Information, Ingredients, Benefits */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Product Information Card */}
                <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Product Information</h3>
                  <div className="space-y-3">
                    {product.sku && (
                      <div className="flex justify-between items-center py-2 border-b border-gray-100">
                        <span className="text-gray-600 font-medium">SKU</span>
                        <span className="font-semibold text-gray-900">{product.sku}</span>
                      </div>
                    )}
                    {product.weight && (
                      <div className="flex justify-between items-center py-2 border-b border-gray-100">
                        <span className="text-gray-600 font-medium">Weight</span>
                        <span className="font-semibold text-gray-900">{product.weight.value} {product.weight.unit}</span>
                      </div>
                    )}
                    {product.servingSize && (
                      <div className="flex justify-between items-center py-2 border-b border-gray-100">
                        <span className="text-gray-600 font-medium">Serving Size</span>
                        <span className="font-semibold text-gray-900">{product.servingSize}</span>
                      </div>
                    )}
                    {product.servingsPerContainer && (
                      <div className="flex justify-between items-center py-2 border-b border-gray-100">
                        <span className="text-gray-600 font-medium">Servings per Container</span>
                        <span className="font-semibold text-gray-900">{product.servingsPerContainer}</span>
                      </div>
                    )}
                    {product.category && (
                      <div className="flex justify-between items-center py-2 border-b border-gray-100">
                        <span className="text-gray-600 font-medium">Category</span>
                        <span className="font-semibold text-gray-900 capitalize">{product.category}</span>
                      </div>
                    )}
                    {product.subcategory && (
                      <div className="flex justify-between items-center py-2">
                        <span className="text-gray-600 font-medium">Subcategory</span>
                        <span className="font-semibold text-gray-900">{product.subcategory}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Ingredients Card */}
                <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Ingredients</h3>
                  <div className="space-y-2">
                    {product.ingredients && product.ingredients.length > 0 ? (
                      product.ingredients.map((ingredient, index) => (
                        <div key={index} className="flex items-start">
                          <span className="text-gray-500 mr-3 mt-1">•</span>
                          <span className="text-gray-700">{ingredient}</span>
                        </div>
                      ))
                    ) : (
                      <div className="text-gray-500 italic">Ingredients information not available</div>
                    )}
                  </div>
                </div>

                {/* Benefits Card */}
                <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Benefits</h3>
                  <div className="space-y-2">
                    {product.benefits && product.benefits.length > 0 ? (
                      product.benefits.map((benefit, idx) => (
                        <div key={idx} className="flex items-start text-left">
                          <span className="text-gray-500 mr-2 mt-1">•</span>
                          <span className="text-gray-700 text-left">{benefit}</span>
                        </div>
                      ))
                    ) : (
                      <div className="text-gray-500 italic text-left">Benefits information not available</div>
                    )}
                  </div>
                </div>
              </div>

              {/* Second Row: Warnings, Usage Instructions, Nutritional Information */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Warnings Card */}
                {product.warnings && product.warnings.length > 0 ? (
                  <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                    <h3 className="text-xl font-bold text-gray-900 mb-4">Warnings</h3>
                    <div className="space-y-2">
                      {product.warnings.map((warning, idx) => (
                        <div key={idx} className="flex items-start text-left">
                          <span className="text-gray-500 mr-2 mt-1">•</span>
                          <span className="text-gray-700 text-left">{warning}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                    <h3 className="text-xl font-bold text-gray-900 mb-4">Warnings</h3>
                    <div className="text-gray-500 italic text-left">No warnings available</div>
                  </div>
                )}

                {/* Usage Instructions Card */}
                {product.usageInstructions ? (
                  <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                    <h3 className="text-xl font-bold text-gray-900 mb-4">Usage Instructions</h3>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <p className="text-gray-700 leading-relaxed">{product.usageInstructions}</p>
                    </div>
                  </div>
                ) : (
                  <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                    <h3 className="text-xl font-bold text-gray-900 mb-4">Usage Instructions</h3>
                    <div className="text-gray-500 italic">Usage instructions not available</div>
                  </div>
                )}

                {/* Nutritional Information */}
                {product.nutritionalInfo ? (
                  <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                    <h3 className="text-xl font-bold text-gray-900 mb-4">Nutritional Information</h3>
                    <div className="grid grid-cols-2 gap-3">
                      {product.nutritionalInfo.calories > 0 && (
                        <div className="text-center p-3 bg-gray-50 rounded-lg border border-gray-200">
                          <div className="text-xs text-gray-600 font-medium mb-1">Calories</div>
                          <div className="text-lg font-bold text-gray-900">{product.nutritionalInfo.calories}</div>
                        </div>
                      )}
                      {product.nutritionalInfo.protein > 0 && (
                        <div className="text-center p-3 bg-gray-50 rounded-lg border border-gray-200">
                          <div className="text-xs text-gray-600 font-medium mb-1">Protein</div>
                          <div className="text-lg font-bold text-gray-900">{product.nutritionalInfo.protein}g</div>
                        </div>
                      )}
                      {product.nutritionalInfo.carbohydrates > 0 && (
                        <div className="text-center p-3 bg-gray-50 rounded-lg border border-gray-200">
                          <div className="text-xs text-gray-600 font-medium mb-1">Carbs</div>
                          <div className="text-lg font-bold text-gray-900">{product.nutritionalInfo.carbohydrates}g</div>
                        </div>
                      )}
                      {product.nutritionalInfo.fat > 0 && (
                        <div className="text-center p-3 bg-gray-50 rounded-lg border border-gray-200">
                          <div className="text-xs text-gray-600 font-medium mb-1">Fat</div>
                          <div className="text-lg font-bold text-gray-900">{product.nutritionalInfo.fat}g</div>
                        </div>
                      )}
                      {product.nutritionalInfo.fiber > 0 && (
                        <div className="text-center p-3 bg-gray-50 rounded-lg border border-gray-200">
                          <div className="text-xs text-gray-600 font-medium mb-1">Fiber</div>
                          <div className="text-lg font-bold text-gray-900">{product.nutritionalInfo.fiber}g</div>
                        </div>
                      )}
                      {product.nutritionalInfo.sugar > 0 && (
                        <div className="text-center p-3 bg-gray-50 rounded-lg border border-gray-200">
                          <div className="text-xs text-gray-600 font-medium mb-1">Sugar</div>
                          <div className="text-lg font-bold text-gray-900">{product.nutritionalInfo.sugar}g</div>
                        </div>
                      )}
                      {product.nutritionalInfo.sodium > 0 && (
                        <div className="text-center p-3 bg-gray-50 rounded-lg border border-gray-200">
                          <div className="text-xs text-gray-600 font-medium mb-1">Sodium</div>
                          <div className="text-lg font-bold text-gray-900">{product.nutritionalInfo.sodium}mg</div>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                    <h3 className="text-xl font-bold text-gray-900 mb-4">Nutritional Information</h3>
                    <div className="text-gray-500 italic">Nutritional information not available</div>
                  </div>
                )}
              </div>

              {/* Allergens Card - Full Width */}
              {product.allergens && product.allergens.length > 0 && (
                <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Allergens</h3>
                  <div className="flex flex-wrap gap-2">
                    {product.allergens.map((allergen, index) => (
                      <span key={index} className="bg-gray-100 text-gray-700 text-sm font-semibold px-3 py-2 rounded-full border border-gray-200">
                        {allergen}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>


          </div>
        </div>
      </div>
    </div>
  );
};

export default SpecificProduct;
