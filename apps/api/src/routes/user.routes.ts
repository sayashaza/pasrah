import { Router } from 'express';
import { getUsers, deleteUser, registerCustomUser } from '../controllers/user.controller';
import { verifyToken } from '../middleware/auth.middleware';

const router = Router();

// Public route for manual registration
router.post('/register', registerCustomUser);

// Protected admin routes
router.get('/', verifyToken, getUsers);
router.delete('/:id', verifyToken, deleteUser);

export default router;
