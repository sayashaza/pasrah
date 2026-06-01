import { Router } from 'express';
import { 
  getEvents, createEvent, updateEvent, closeEvent, getEventSummary,
  getVendorsByEvent, createVendor, 
  getStocksByEvent, createStock 
} from '../controllers/gpm.controller';
import { verifyToken, requireRole } from '../middleware/auth.middleware';

const router = Router();

// === Events ===
// Public can see active events
router.get('/events', getEvents);
// Admin only
router.post('/events', verifyToken, requireRole(['ADMIN']), createEvent);
router.put('/events/:id', verifyToken, requireRole(['ADMIN']), updateEvent);
router.post('/events/:id/close', verifyToken, requireRole(['ADMIN']), closeEvent);
router.get('/events/:id/summary', verifyToken, requireRole(['ADMIN']), getEventSummary);

// === Vendors ===
router.get('/events/:eventId/vendors', getVendorsByEvent);
router.post('/vendors', verifyToken, requireRole(['ADMIN']), createVendor);

// === Stocks ===
router.get('/events/:eventId/stocks', getStocksByEvent);
router.post('/stocks', verifyToken, requireRole(['ADMIN']), createStock);

export default router;
