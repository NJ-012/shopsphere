import { Router } from 'express';
import { getUsers, getVendors, getOrders } from '../controllers/adminController.js';
import { protect, checkRole } from '../middleware/authMiddleware.js';

const router = Router();

router.use(protect);
router.use(checkRole('ADMIN'));

router.get('/users', getUsers);
router.get('/vendors', getVendors);
router.get('/orders', getOrders);

export default router;
