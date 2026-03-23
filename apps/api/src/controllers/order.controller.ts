import { Request, Response } from 'express';
import { db } from '../config/firebase';

export const getOrders = async (req: Request, res: Response): Promise<void> => {
  try {
    const snapshot = await db.collection('orders').orderBy('createdAt', 'desc').get();
    const orders = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching orders', error });
  }
};

export const getOrder = async (req: Request, res: Response): Promise<void> => {
  try {
    const docRef = await db.collection('orders').doc(req.params.id).get();
    if (docRef.exists) {
      res.json({ id: docRef.id, ...docRef.data() });
    } else {
      res.status(404).json({ message: 'Order not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error fetching order', error });
  }
};

export const updateOrderStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const { status } = req.body;
    await db.collection('orders').doc(req.params.id).update({ 
      status, 
      updatedAt: new Date().toISOString() 
    });
    res.json({ id: req.params.id, status });
  } catch (error) {
    res.status(500).json({ message: 'Error updating order', error });
  }
};
