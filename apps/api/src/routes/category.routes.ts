import { Router } from 'express';
import { getCategories, createCategory, updateCategory, deleteCategory } from '../controllers/category.controller';
import { verifyToken } from '../middleware/auth.middleware';
import multer from 'multer';

const upload = multer({ storage: multer.memoryStorage() });
const router = Router();

router.get('/', getCategories);
router.post('/', verifyToken, upload.single('image'), createCategory);
router.put('/:id', verifyToken, upload.single('image'), updateCategory);
router.delete('/:id', verifyToken, deleteCategory);

export default router;
