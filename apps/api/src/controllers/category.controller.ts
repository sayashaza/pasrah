import { Request, Response } from 'express';
import { db } from '../config/firebase';

export const getCategories = async (req: Request, res: Response): Promise<void> => {
  try {
    const snapshot = await db.collection('categories').get();
    const categories = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching categories', error });
  }
};

import { uploadImageToStorage } from '../utils/firebaseStorage';

export const createCategory = async (req: Request, res: Response): Promise<void> => {
  try {
    let imageUrl = req.body.image || '';
    if (req.file) {
      imageUrl = await uploadImageToStorage(req.file, 'categories');
    }

    const isActive = req.body.isActive === 'true' || req.body.isActive === true;
    const newCategory = { ...req.body, isActive, image: imageUrl, createdAt: new Date().toISOString() };
    const docId = String(req.body.name || `category_${Date.now()}`).replace(/\//g, '-');
    await db.collection('categories').doc(docId).set(newCategory);
    res.status(201).json({ id: docId, ...newCategory });
  } catch (error: any) {
    console.error('Error creating category:', error);
    res.status(500).json({ message: 'Error creating category', error: error.message || error });
  }
};

export const updateCategory = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    let updateData = { ...req.body };
    
    if (req.file) {
      updateData.image = await uploadImageToStorage(req.file, 'categories');
    }
    
    if (updateData.isActive !== undefined) {
      updateData.isActive = updateData.isActive === 'true' || updateData.isActive === true;
    }
    
    await db.collection('categories').doc(id).update(updateData);
    res.json({ id, ...updateData });
  } catch (error: any) {
    console.error('Error updating category:', error);
    res.status(500).json({ message: 'Error updating category', error: error.message || error });
  }
};

export const deleteCategory = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    await db.collection('categories').doc(id).delete();
    res.json({ message: 'Category deleted successfully' });
  } catch (error: any) {
    console.error('Error deleting category:', error);
    res.status(500).json({ message: 'Error deleting category', error: error.message || error });
  }
};
