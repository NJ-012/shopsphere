import express from 'express';
import { createOrder, getMyOrders, getOrderById, cancelOrder } from '../controllers/orderController.js';
import { protect, checkRole } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);
router.post('/', checkRole('CUSTOMER'), createOrder);
router.get('/', checkRole('CUSTOMER'), getMyOrders);
router.get('/:id', checkRole('CUSTOMER'), getOrderById);
router.put('/:id/cancel', checkRole('CUSTOMER'), cancelOrder);

export default router;

