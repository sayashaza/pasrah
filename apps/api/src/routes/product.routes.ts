import { Router } from 'express';
import { getProducts, getProduct, createProduct, updateProduct, deleteProduct } from '../controllers/product.controller';
import { verifyToken } from '../middleware/auth.middleware';
import multer from 'multer';

const upload = multer({ storage: multer.memoryStorage() });
const router = Router();

// Publicly accessible for the mobile app
router.get('/', getProducts);
router.get('/:id', getProduct);

// Protected routes for the Admin Dashboard
router.post('/', verifyToken, upload.single('image'), createProduct);
router.put('/:id', verifyToken, upload.single('image'), updateProduct);
router.delete('/:id', verifyToken, deleteProduct);

export default router;
