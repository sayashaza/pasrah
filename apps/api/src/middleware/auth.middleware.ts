import { Request, Response, NextFunction } from 'express';
import { auth, db } from '../config/firebase';

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
    
    // Fetch custom role from Firestore
    const userDoc = await db.collection('users').doc(decodedToken.uid).get();
    const userData = userDoc.exists ? userDoc.data() : null;
    
    // Auto-grant ADMIN to super admin email
    let role = userData?.role?.toUpperCase() || 'CUSTOMER';
    if (decodedToken.email === 'admin@bigcart.com') {
      role = 'ADMIN';
    }
    
    req.user = {
      ...decodedToken,
      role,
      vendor_id: userData?.vendor_id || null,
    };
    
    next();
  } catch (err: any) {
    if (err.code === 'auth/id-token-expired') {
      res.status(401).json({ message: 'Token Expired' });
    } else {
      res.status(403).json({ message: 'Unauthorized / Invalid Token' });
    }
  }
};

export const requireRole = (roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user || !req.user.role) {
      res.status(403).json({ message: 'Forbidden. Role not identified.' });
      return;
    }
    
    if (!roles.includes(req.user.role.toUpperCase())) {
      res.status(403).json({ message: `Forbidden. Requires one of roles: ${roles.join(', ')}` });
      return;
    }
    
    next();
  };
};
