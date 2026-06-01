import { Router } from 'express';
import { placeOrder, paySubOrder, getSubOrdersByVendor } from '../controllers/transaction.controller';
import { verifyToken, requireRole } from '../middleware/auth.middleware';

const router = Router();

// Place order (Customer can place order, also Cashier/Admin for manual orders)
router.post('/place-order', verifyToken, requireRole(['CUSTOMER', 'CASHIER', 'ADMIN']), placeOrder);

// Cashier endpoints
router.post('/sub-orders/:subOrderId/pay', verifyToken, requireRole(['CASHIER', 'ADMIN']), paySubOrder);
router.get('/events/:eventId/vendors/:vendorId/sub-orders', verifyToken, requireRole(['CASHIER', 'ADMIN']), getSubOrdersByVendor);

export default router;
