import express from 'express';
import { 
  getAllCustomers, 
  getCustomerById,
  updateCustomerStatus, 
  deleteCustomer,
  getCustomerStats
} from '../controllers/customerController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// All routes require authentication
router.use(authenticateToken);

// Get all customers with filters and pagination
router.get('/', getAllCustomers);

// Get customer statistics
router.get('/stats', getCustomerStats);

// Get customer by ID
router.get('/:id', getCustomerById);

// Update customer status
router.put('/:id/status', updateCustomerStatus);

// Delete customer
router.delete('/:id', deleteCustomer);

export default router; 