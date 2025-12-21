import express from 'express';
import { signup, signin, getCurrentUser, logout, updateUserName, updateUserAddress, changePassword, forgotPassword, resetPassword, sendVerificationEmail, verifyEmail, verifyFirebaseMobile } from '../controllers/authController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.post('/signup', signup);
router.post('/signin', signin);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.get('/verify-email', verifyEmail);

// Protected routes
router.get('/me', authenticateToken, getCurrentUser);
router.post('/logout', authenticateToken, logout);
router.put('/update-name', authenticateToken, updateUserName);
router.put('/update-address', authenticateToken, updateUserAddress);
router.put('/change-password', authenticateToken, changePassword);
router.post('/send-verification-email', authenticateToken, sendVerificationEmail);
router.post('/verify-firebase-mobile', authenticateToken, verifyFirebaseMobile);

export default router; 