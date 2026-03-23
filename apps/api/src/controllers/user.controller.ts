import { Request, Response } from 'express';
import { db, auth } from '../config/firebase';

export const getUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    const snapshot = await db.collection('users').get();
    const users = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching users', error });
  }
};

export const deleteUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.params.id;
    // Delete from Firebase Auth
    await auth.deleteUser(userId).catch(err => console.log('Auth user not found, deleting from DB only', err));
    // Delete from Firestore
    await db.collection('users').doc(userId).delete();
    
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting user', error });
  }
};
