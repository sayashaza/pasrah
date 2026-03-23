import { Router } from 'express';
import { getUsers, deleteUser } from '../controllers/user.controller';
import { verifyToken } from '../middleware/auth.middleware';

const router = Router();

// Protected admin routes
router.get('/', verifyToken, getUsers);
router.delete('/:id', verifyToken, deleteUser);

export default router;
