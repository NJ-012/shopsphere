import { Router } from 'express';
import { getFeaturedProducts, getCategories } from '../controllers/productController.js';

const router = Router();

router.get('/featured', getFeaturedProducts);
router.get('/categories', getCategories);

export default router;

