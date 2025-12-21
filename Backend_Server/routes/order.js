import express from 'express';
import { createOrder, getOrders, cancelOrder } from '../controllers/orderController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// All order routes require authentication
router.use(authenticateToken);

// POST /api/orders - create order from cart
router.post('/', createOrder);
// GET /api/orders - list user's orders
router.get('/', getOrders);

// PATCH /api/orders/:id/cancel - cancel order
router.patch('/:id/cancel', cancelOrder);

export default router;
