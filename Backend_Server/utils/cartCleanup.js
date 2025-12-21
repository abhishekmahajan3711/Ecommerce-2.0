import Cart from '../models/Cart.js';

// Remove inactive or deleted products from all carts
export const cleanupCartsForInactiveProducts = async (productIds) => {
  try {
    if (!Array.isArray(productIds) || productIds.length === 0) {
      return { success: true, message: 'No products to clean up' };
    }

    // Find all carts that contain the inactive/deleted products
    const cartsToUpdate = await Cart.find({
      'items.product': { $in: productIds }
    });

    if (cartsToUpdate.length === 0) {
      return { success: true, message: 'No carts contain the specified products' };
    }

    let totalItemsRemoved = 0;
    const updatedCarts = [];

    // Update each cart by removing the inactive products
    for (const cart of cartsToUpdate) {
      const originalItemCount = cart.items.length;
      
      // Filter out items with inactive/deleted products
      cart.items = cart.items.filter(item => !productIds.includes(item.product.toString()));
      
      const itemsRemoved = originalItemCount - cart.items.length;
      totalItemsRemoved += itemsRemoved;

      if (itemsRemoved > 0) {
        // Recalculate totals (the pre-save hook will handle this)
        await cart.save();
        updatedCarts.push(cart._id);
      }
    }

    return {
      success: true,
      message: `Cleaned up ${totalItemsRemoved} items from ${updatedCarts.length} carts`,
      cartsUpdated: updatedCarts.length,
      itemsRemoved: totalItemsRemoved
    };

  } catch (error) {
    console.error('Error cleaning up carts for inactive products:', error);
    return {
      success: false,
      message: 'Failed to clean up carts',
      error: error.message
    };
  }
};

// Remove a single inactive/deleted product from all carts
export const cleanupCartsForSingleProduct = async (productId) => {
  return await cleanupCartsForInactiveProducts([productId]);
};

// Clean up carts for products that are currently inactive
export const cleanupCartsForAllInactiveProducts = async () => {
  try {
    // Import Product model here to avoid circular dependency
    const { default: Product } = await import('../models/Product.js');
    
    // Find all inactive products
    const inactiveProducts = await Product.find({ isActive: false }).select('_id');
    const inactiveProductIds = inactiveProducts.map(product => product._id);

    if (inactiveProductIds.length === 0) {
      return { success: true, message: 'No inactive products found' };
    }

    return await cleanupCartsForInactiveProducts(inactiveProductIds);

  } catch (error) {
    console.error('Error cleaning up carts for all inactive products:', error);
    return {
      success: false,
      message: 'Failed to clean up carts for inactive products',
      error: error.message
    };
  }
}; 