import { Request, Response } from 'express';
import { db } from '../config/firebase';

export const getBrands = async (req: Request, res: Response): Promise<void> => {
  try {
    const snapshot = await db.collection('brands').get();
    const brands = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json(brands);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching brands', error });
  }
};

import { uploadImageToStorage } from '../utils/firebaseStorage';

export const createBrand = async (req: Request, res: Response): Promise<void> => {
  try {
    let imageUrl = req.body.image || '';
    if (req.file) {
      imageUrl = await uploadImageToStorage(req.file, 'brands');
    }

    const newBrand = { ...req.body, image: imageUrl, createdAt: new Date().toISOString() };
    const docId = String(req.body.name || `brand_${Date.now()}`).replace(/\//g, '-');
    await db.collection('brands').doc(docId).set(newBrand);
    res.status(201).json({ id: docId, ...newBrand });
  } catch (error: any) {
    console.error('Error creating brand:', error);
    res.status(500).json({ message: 'Error creating brand', error: error.message || error });
  }
};

export const updateBrand = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    let updateData = { ...req.body };
    
    if (req.file) {
      updateData.image = await uploadImageToStorage(req.file, 'brands');
    }
    
    await db.collection('brands').doc(id).update(updateData);
    res.json({ id, ...updateData });
  } catch (error: any) {
    console.error('Error updating brand:', error);
    res.status(500).json({ message: 'Error updating brand', error: error.message || error });
  }
};

export const deleteBrand = async (req: Request, res: Response): Promise<void> => {
  try {
    await db.collection('brands').doc(req.params.id).delete();
    res.json({ message: 'Brand deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting brand', error });
  }
};
