import express from 'express';
import { adminSignin, updateAdminPassword } from '../controllers/authController.js';
import { 
  getAllProductsForAdmin, 
  getProductById,
  createProduct, 
  updateProduct, 
  deleteProduct,
  uploadImage,
  updateHeroSection,
  uploadHeroImage
} from '../controllers/productController.js';
import { authenticateToken } from '../middleware/auth.js';
import { adminListOrders, adminUpdateOrder, adminGetOrder } from '../controllers/orderController.js';

const router = express.Router();

// Admin authentication routes
router.post('/signin', adminSignin);
router.put('/password', authenticateToken, updateAdminPassword);

// Admin product management routes
router.get('/products', authenticateToken, getAllProductsForAdmin);
router.post('/products', authenticateToken, createProduct);
router.get('/products/:id', authenticateToken, getProductById);
router.put('/products/:id', authenticateToken, updateProduct);
router.delete('/products/:id', authenticateToken, deleteProduct);

// Image upload route
router.post('/upload', authenticateToken, uploadImage);

// Hero section customization
router.put('/hero', authenticateToken, updateHeroSection);
router.post('/hero/upload', authenticateToken, uploadHeroImage);

// Admin order management
router.get('/orders', authenticateToken, adminListOrders);
router.put('/orders/:id', authenticateToken, adminUpdateOrder);
router.get('/orders/:id', authenticateToken, adminGetOrder);

export default router; 