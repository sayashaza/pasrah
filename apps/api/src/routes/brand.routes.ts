import { Router } from 'express';
import { getBrands, createBrand, updateBrand, deleteBrand } from '../controllers/brand.controller';
import { verifyToken } from '../middleware/auth.middleware';
import multer from 'multer';

const upload = multer({ storage: multer.memoryStorage() });
const router = Router();

router.get('/', getBrands);
router.post('/', verifyToken, upload.single('image'), createBrand);
router.put('/:id', verifyToken, upload.single('image'), updateBrand);
router.delete('/:id', verifyToken, deleteBrand);

export default router;
