import { Router } from 'express';
import {
  getAllProducts,
  getFeaturedProducts,
  getCategories,
  getProductById
} from '../controllers/productController.js';

const router = Router();

router.get('/', getAllProducts);
router.get('/featured', getFeaturedProducts);
router.get('/categories', getCategories);
router.get('/:id', getProductById);

export default router;
