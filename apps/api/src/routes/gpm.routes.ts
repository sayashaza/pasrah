import { Router } from 'express';
import { 
  getEvents, createEvent, updateEvent, closeEvent, getEventSummary,
  getVendorsByEvent, createVendor, deleteVendor,
  getStocksByEvent, createStock, deleteStock
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
router.delete('/vendors/:id', verifyToken, requireRole(['ADMIN']), deleteVendor);

// === Stocks ===
router.get('/events/:eventId/stocks', getStocksByEvent);
router.post('/stocks', verifyToken, requireRole(['ADMIN']), createStock);
router.delete('/stocks/:id', verifyToken, requireRole(['ADMIN']), deleteStock);

export default router;
