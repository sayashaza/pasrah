import { Router } from 'express';
import { getBanners, createBanner, updateBanner, deleteBanner } from '../controllers/banner.controller';
import { verifyToken } from '../middleware/auth.middleware';
import multer from 'multer';

const upload = multer({ storage: multer.memoryStorage() });
const router = Router();

router.get('/', getBanners);
router.post('/', verifyToken, upload.single('image'), createBanner);
router.put('/:id', verifyToken, upload.single('image'), updateBanner);
router.delete('/:id', verifyToken, deleteBanner);

export default router;
