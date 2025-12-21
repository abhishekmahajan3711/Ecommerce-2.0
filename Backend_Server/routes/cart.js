import express from 'express';
import { 
  getCart, 
  addToCart, 
  updateCartItem, 
  removeFromCart, 
  clearCart,
  cleanupInvalidItems
} from '../controllers/cartController.js';
import { cleanupCartsForAllInactiveProducts } from '../utils/cartCleanup.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// All cart routes require authentication
router.use(authenticateToken);

// GET /api/cart - Get user's cart
router.get('/', getCart);

// POST /api/cart/add - Add item to cart
router.post('/add', addToCart);

// PUT /api/cart/update/:itemId - Update cart item quantity
router.put('/update/:itemId', updateCartItem);

// DELETE /api/cart/remove/:itemId - Remove item from cart
router.delete('/remove/:itemId', removeFromCart);

// DELETE /api/cart/clear - Clear entire cart
router.delete('/clear', clearCart);

// DELETE /api/cart/cleanup-invalid - Remove all invalid items from cart
router.delete('/cleanup-invalid', cleanupInvalidItems);

// POST /api/cart/admin/cleanup-inactive - Admin route to clean up all carts with inactive products
router.post('/admin/cleanup-inactive', async (req, res) => {
  try {
    const result = await cleanupCartsForAllInactiveProducts();
    res.json(result);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to clean up carts',
      error: error.message
    });
  }
});

export default router; 