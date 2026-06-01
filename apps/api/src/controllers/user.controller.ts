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

export const registerCustomUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { phone, pin, name, district, role, vendor_id, email: reqEmail, password: reqPassword } = req.body;
    
    // For phone+pin, we map it to a pseudo-email in Firebase Auth
    let email = reqEmail;
    let password = reqPassword;
    
    const authMethod = (phone && pin) ? 'phone_pin' : 'email_password';
    
    if (authMethod === 'phone_pin') {
      email = `${phone}@gpm.local`;
      password = pin; // Note: PIN should be minimum 6 digits for Firebase Auth
    }

    // 1. Create in Firebase Auth
    const userRecord = await auth.createUser({
      email,
      password,
      displayName: name,
    });

    // 2. Create in Firestore
    const userData = {
      id: userRecord.uid,
      email: email,
      displayName: name || '',
      phone: phone || '',
      district: district || '',
      role: role || 'CUSTOMER',
      vendor_id: vendor_id || null,
      auth_method: authMethod,
      status: 'ACTIVE',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await db.collection('users').doc(userRecord.uid).set(userData);

    res.status(201).json({ message: 'User created successfully', user: userData });
  } catch (error: any) {
    res.status(500).json({ message: 'Error creating user', error: error.message });
  }
};
