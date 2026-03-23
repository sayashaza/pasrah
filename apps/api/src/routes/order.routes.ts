import { Router } from 'express';
import { getOrders, getOrder, updateOrderStatus } from '../controllers/order.controller';
import { verifyToken } from '../middleware/auth.middleware';

const router = Router();

// Protected admin routes for management
router.get('/', verifyToken, getOrders);
router.get('/:id', verifyToken, getOrder);
router.patch('/:id/status', verifyToken, updateOrderStatus);

export default router;
