import express from 'express';
import { 
  getAllCategories, 
  getAllCategoriesForAdmin,
  getCategoryById,
  createCategory, 
  updateCategory, 
  deleteCategory 
} from '../controllers/categoryController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Public routes (for customer frontend)
router.get('/', getAllCategories);

// Admin routes (protected)
router.get('/admin', authenticateToken, getAllCategoriesForAdmin);
router.get('/admin/:id', authenticateToken, getCategoryById);
router.post('/admin', authenticateToken, createCategory);
router.put('/admin/:id', authenticateToken, updateCategory);
router.delete('/admin/:id', authenticateToken, deleteCategory);

export default router; 