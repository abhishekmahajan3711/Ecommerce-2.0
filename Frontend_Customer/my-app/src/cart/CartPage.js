import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { 
  FaTrash, 
  FaShoppingCart, 
  FaArrowLeft, 
  FaCreditCard,
  FaMinus,
  FaPlus
} from 'react-icons/fa';
import { 
  fetchCart, 
  updateCartItem, 
  removeFromCart, 
  clearCart,
  clearError,
  cleanupInvalidItems
} from '../store/slices/cartSlice';

// Helper to get the correct image URL
const getImageUrl = (img) => {
  if (!img) return 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=100&h=100&fit=crop';
  if (img.startsWith('/uploads/')) return `http://localhost:5000${img}`;
  return img;
};

const CartPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const { items, total, itemCount, loading, error } = useSelector((state) => state.cart);
  const [hasShownInvalidItemsAlert, setHasShownInvalidItemsAlert] = useState(false);
  const [isCleaningUp, setIsCleaningUp] = useState(false);

  useEffect(() => {
    // Redirect to signin if not authenticated
    if (!isAuthenticated) {
      navigate('/signin', { state: { from: '/cart' } });
      return;
    }

    // Fetch cart data
    dispatch(fetchCart());
    // Reset alert state when fetching new cart data
    setHasShownInvalidItemsAlert(false);
  }, [dispatch, isAuthenticated, navigate]);

  // Check for invalid items and remove them automatically
  useEffect(() => {
    if (items.length > 0 && !loading && !hasShownInvalidItemsAlert) {
      const invalidItems = items.filter(item => !item.product);
      if (invalidItems.length > 0) {
        // Show notification to user first
        const message = invalidItems.length === 1 
          ? '1 item in your cart is no longer available and will be removed.'
          : `${invalidItems.length} items in your cart are no longer available and will be removed.`;
        
        // Use setTimeout to avoid blocking the UI
        setTimeout(() => {
          alert(message);
          setHasShownInvalidItemsAlert(true);
        }, 100);
        
        // Remove invalid items automatically
        invalidItems.forEach(item => {
          dispatch(removeFromCart(item._id));
        });
      }
    }
  }, [items, dispatch, loading, hasShownInvalidItemsAlert]);

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleQuantityChange = async (itemId, newQuantity) => {
    if (newQuantity >= 1) {
      dispatch(updateCartItem({ itemId, quantity: newQuantity }));
    }
  };

  const handleRemoveItem = (itemId) => {
    if (window.confirm('Are you sure you want to remove this item from your cart?')) {
      dispatch(removeFromCart(itemId));
    }
  };

  const handleClearCart = () => {
    if (window.confirm('Are you sure you want to clear your entire cart?')) {
      dispatch(clearCart());
    }
  };

  const handleCheckout = () => {
    if (items.length === 0) {
      alert('Your cart is empty!');
      return;
    }
    
    // Filter out items with null products
    const validItems = items.filter(item => item.product);
    const invalidItems = items.filter(item => !item.product);
    
    if (validItems.length === 0) {
      alert('No valid items in cart! Please remove unavailable items and add new products.');
      return;
    }
    
    // If there are invalid items, show warning but allow checkout with valid items
    if (invalidItems.length > 0) {
      const proceed = window.confirm(
        `You have ${invalidItems.length} unavailable item(s) in your cart. ` +
        `These will be excluded from your order. Do you want to proceed with ${validItems.length} valid item(s)?`
      );
      
      if (!proceed) {
        return;
      }
    }
    
    // Calculate total for valid items only
    const validTotal = validItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    navigate('/payment', { 
      state: { 
        items: validItems.map(item => ({
          ...item.product,
          quantity: item.quantity,
          price: item.price
        })),
        total: validTotal
      }
    });
  };

  const handleCleanupInvalidItems = async () => {
    const invalidItems = items.filter(item => !item.product);
    if (invalidItems.length > 0) {
      const confirm = window.confirm(
        `Remove ${invalidItems.length} unavailable item(s) from your cart?`
      );
      
      if (confirm) {
        setIsCleaningUp(true);
        try {
          // Use the new cleanup action that handles everything on the backend
          const result = await dispatch(cleanupInvalidItems()).unwrap();
          
          // Show success message
          alert(result.message || `${invalidItems.length} unavailable item(s) have been removed from your cart.`);
        } catch (error) {
          console.error('Error removing invalid items:', error);
          alert(error.message || 'Some items could not be removed. Please try again.');
        } finally {
          setIsCleaningUp(false);
        }
      }
    }
  };

  if (!isAuthenticated) {
    return null; // Will redirect to signin
  }

  if (loading && items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Shopping Cart</h1>
          <p className="text-gray-600 mt-2">
            {items.filter(item => item.product).length} valid {items.filter(item => item.product).length === 1 ? 'item' : 'items'} in your cart
            {items.filter(item => !item.product).length > 0 && (
              <span className="text-orange-600 ml-2">
                ({items.filter(item => !item.product).length} unavailable {items.filter(item => !item.product).length === 1 ? 'item' : 'items'})
              </span>
            )}
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md mb-6">
            <div className="flex justify-between items-center">
              <span>{error}</span>
              <button
                onClick={() => dispatch(clearError())}
                className="text-red-400 hover:text-red-600"
              >
                ×
              </button>
            </div>
          </div>
        )}

        {items.length === 0 ? (
          /* Empty Cart */
          <div className="text-center py-12">
            <FaShoppingCart className="mx-auto h-16 w-16 text-gray-400 mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
            <p className="text-gray-600 mb-6">Looks like you haven't added any items to your cart yet.</p>
            <button
              onClick={() => navigate('/products')}
              className="bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors"
            >
              Start Shopping
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                <div className="p-6 border-b border-gray-200">
                  <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold text-gray-900">Cart Items</h2>
                    <div className="flex gap-4">
                      {items.filter(item => !item.product).length > 0 && (
                        <button
                          onClick={handleCleanupInvalidItems}
                          disabled={isCleaningUp}
                          className={`text-sm font-medium ${
                            isCleaningUp 
                              ? 'text-gray-400 cursor-not-allowed' 
                              : 'text-orange-600 hover:text-orange-700'
                          }`}
                        >
                          {isCleaningUp ? 'Removing...' : 'Remove Unavailable Items'}
                        </button>
                      )}
                      <button
                        onClick={handleClearCart}
                        className="text-red-600 hover:text-red-700 text-sm font-medium"
                      >
                        Clear Cart
                      </button>
                    </div>
                  </div>
                </div>

                <div className="divide-y divide-gray-200">
                  {items.map((item) => {
                    // Handle invalid items (deleted or inactive products)
                    if (!item.product) {
                      return (
                        <div key={item._id} className="p-6 bg-red-50 border-l-4 border-red-400">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                              <div className="w-20 h-20 bg-gray-200 rounded-lg flex items-center justify-center">
                                <FaTrash className="w-8 h-8 text-gray-400" />
                              </div>
                              <div className="flex-1">
                                <h3 className="font-semibold text-red-800 mb-1">
                                  Product No Longer Available
                                </h3>
                                <p className="text-sm text-red-600 mb-2">
                                  This item has been removed from our store or is no longer active.
                                </p>
                                <div className="flex items-center gap-4">
                                  <span className="text-sm text-gray-500">
                                    Quantity: {item.quantity}
                                  </span>
                                  <span className="text-sm text-gray-500">
                                    Price: ₹{item.price.toFixed(2)} each
                                  </span>
                                </div>
                              </div>
                            </div>
                            <button
                              onClick={() => handleRemoveItem(item._id)}
                              className="text-red-600 hover:text-red-700 p-2 bg-white rounded-lg border border-red-200"
                              title="Remove unavailable item"
                            >
                              <FaTrash className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      );
                    }
                    
                    return (
                      <div key={item._id} className="p-6">
                        <div className="flex items-center gap-4">
                          {/* Product Image */}
                          <img
                            src={getImageUrl(item.product.mainImage || (item.product.images && item.product.images[0]))}
                            alt={item.product.name || 'Product'}
                            className="w-20 h-20 object-cover rounded-lg"
                          />

                          {/* Product Details */}
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-900 mb-1">
                              {item.product.name}
                            </h3>
                            <p className="text-sm text-gray-600 mb-2">
                              {item.product.brand}
                            </p>
                            <div className="flex items-center gap-4">
                              {/* Quantity Controls */}
                              <div className="flex items-center border border-gray-300 rounded-lg">
                                <button
                                  onClick={() => handleQuantityChange(item._id, item.quantity - 1)}
                                  className="px-3 py-1 text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                  disabled={item.quantity <= 1}
                                >
                                  <FaMinus className="w-3 h-3" />
                                </button>
                                <span className="px-3 py-1 border-x border-gray-300 min-w-[2rem] text-center">
                                  {item.quantity}
                                </span>
                                <button
                                  onClick={() => handleQuantityChange(item._id, item.quantity + 1)}
                                  className="px-3 py-1 text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                  disabled={item.quantity >= (item.product.stock || 0)}
                                >
                                  <FaPlus className="w-3 h-3" />
                                </button>
                              </div>

                              {/* Price */}
                              <div className="text-right">
                                <div className="font-semibold text-gray-900">
                                  {`₹${(item.price * item.quantity).toFixed(2)}`}
                                </div>
                                <div className="text-sm text-gray-500">
                                  {`₹${item.price.toFixed(2)} each`}
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Remove Button */}
                          <button
                            onClick={() => handleRemoveItem(item._id)}
                            className="text-red-600 hover:text-red-700 p-2"
                            title="Remove item"
                          >
                            <FaTrash className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-sm p-6 sticky top-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Order Summary</h2>
                
                <div className="space-y-3 mb-6">
                  {(() => {
                    const validItems = items.filter(item => item.product);
                    const invalidItems = items.filter(item => !item.product);
                    const validTotal = validItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
                    
                    return (
                      <>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Subtotal ({validItems.length} valid items)</span>
                          <span className="font-medium">₹{validTotal.toFixed(2)}</span>
                        </div>
                        {invalidItems.length > 0 && (
                          <div className="flex justify-between text-sm">
                            <span className="text-orange-600">Unavailable items ({invalidItems.length})</span>
                            <span className="text-orange-600">₹0.00</span>
                          </div>
                        )}
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Shipping</span>
                          <span className="font-medium text-green-600">Free</span>
                        </div>
                        <div className="border-t border-gray-200 pt-3">
                          <div className="flex justify-between text-lg font-semibold">
                            <span>Total</span>
                            <span>₹{validTotal.toFixed(2)}</span>
                          </div>
                        </div>
                      </>
                    );
                  })()}
                </div>

                <button
                  onClick={handleCheckout}
                  disabled={loading || items.length === 0}
                  className="w-full bg-green-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <FaCreditCard />
                  {loading ? 'Processing...' : 'Proceed to Checkout'}
                </button>

                <div className="mt-4 text-center">
                  <button
                    onClick={() => navigate('/products')}
                    className="text-green-600 hover:text-green-700 text-sm font-medium"
                  >
                    Continue Shopping
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
  };

  export default CartPage; 