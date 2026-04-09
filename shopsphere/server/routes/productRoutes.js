import { Router } from 'express';
import {
  getAllProducts,
  getFeaturedProducts,
  getCategories,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getVendorProducts
} from '../controllers/productController.js';
import { protect, checkRole } from '../middleware/authMiddleware.js';

const router = Router();

router.get('/', getAllProducts);
router.get('/featured', getFeaturedProducts);
router.get('/categories', getCategories);
router.get('/vendor', protect, checkRole('VENDOR'), getVendorProducts);
router.get('/:id', getProductById);

router.post('/', protect, checkRole('VENDOR'), createProduct);
router.put('/:id', protect, checkRole('VENDOR'), updateProduct);
router.delete('/:id', protect, checkRole('VENDOR'), deleteProduct);

export default router;
