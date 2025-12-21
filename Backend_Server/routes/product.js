import express from 'express';
import { searchProducts, getCategories, getBrands, getFeaturedProducts, getProductById, getHeroSection } from '../controllers/productController.js';

const router = express.Router();

router.get('/', searchProducts);
router.get('/categories', getCategories);
router.get('/brands', getBrands);
router.get('/featured', getFeaturedProducts);
router.get('/hero', getHeroSection);
router.get('/:id', getProductById);

export default router; 