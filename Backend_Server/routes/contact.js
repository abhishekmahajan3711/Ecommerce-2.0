import express from 'express';
import { 
  submitContact, 
  getAllContacts, 
  getContactById, 
  updateContactStatus, 
  deleteContact, 
  getContactStats,
  getUserContacts
} from '../controllers/contactController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Public route - Submit contact form
router.post('/submit', submitContact);

// User routes - Protected
router.get('/user/queries', authenticateToken, getUserContacts);

// Admin routes - Protected
router.get('/admin/all', authenticateToken, getAllContacts);
router.get('/admin/stats', authenticateToken, getContactStats);
router.get('/admin/:id', authenticateToken, getContactById);
router.put('/admin/:id', authenticateToken, updateContactStatus);
router.delete('/admin/:id', authenticateToken, deleteContact);

export default router; 