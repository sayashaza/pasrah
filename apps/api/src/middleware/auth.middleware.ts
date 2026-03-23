import { Request, Response, NextFunction } from 'express';
import { auth } from '../config/firebase';

export interface AuthRequest extends Request {
  user?: any;
}

export const verifyToken = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  const token = req.header('Authorization')?.split(' ')[1];
  
  if (!token) {
    res.status(401).json({ message: 'Access Denied. No Firebase ID token provided.' });
    return;
  }

  try {
    const decodedToken = await auth.verifyIdToken(token);
    req.user = decodedToken;
    next();
  } catch (err: any) {
    if (err.code === 'auth/id-token-expired') {
      res.status(401).json({ message: 'Token Expired' });
    } else {
      res.status(403).json({ message: 'Unauthorized / Invalid Token' });
    }
  }
};
