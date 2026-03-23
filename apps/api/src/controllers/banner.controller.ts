import { Request, Response } from 'express';
import { db } from '../config/firebase';
import { uploadImageToStorage } from '../utils/firebaseStorage';

export const getBanners = async (req: Request, res: Response) => {
  try {
    const bannersSnapshot = await db.collection('banners').orderBy('createdAt', 'desc').get();
    const banners: any[] = [];
    bannersSnapshot.forEach((doc) => {
      banners.push({ id: doc.id, ...doc.data() });
    });
    res.status(200).json(banners);
  } catch (error: any) {
    console.error('Error fetching banners:', error);
    res.status(500).json({ message: 'Error fetching banners', error: error.message || error });
  }
};

export const createBanner = async (req: Request, res: Response) => {
  try {
    let imageUrl = req.body.image || '';

    if (req.file) {
      imageUrl = await uploadImageToStorage(req.file, 'banners');
    }

    const isActive = req.body.isActive === 'true' || req.body.isActive === true;
    const newBanner = { ...req.body, isActive, image: imageUrl, createdAt: new Date().toISOString() };
    
    const baseName = req.body.title || `banner_${Date.now()}`;
    const docId = String(baseName).replace(/\//g, '-');
    
    await db.collection('banners').doc(docId).set(newBanner);
    res.status(201).json({ id: docId, ...newBanner });
  } catch (error: any) {
    console.error('Error creating banner:', error);
    res.status(500).json({ message: 'Error creating banner', error: error.message || error });
  }
};

export const updateBanner = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    let updateData = { ...req.body };
    
    if (req.file) {
      updateData.image = await uploadImageToStorage(req.file, 'banners');
    }
    
    if (updateData.isActive !== undefined) {
      updateData.isActive = updateData.isActive === 'true' || updateData.isActive === true;
    }
    
    await db.collection('banners').doc(id).update(updateData);
    res.json({ id, ...updateData });
  } catch (error: any) {
    console.error('Error updating banner:', error);
    res.status(500).json({ message: 'Error updating banner', error: error.message || error });
  }
};

export const deleteBanner = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await db.collection('banners').doc(id).delete();
    res.status(200).json({ message: 'Banner deleted successfully' });
  } catch (error: any) {
    console.error('Error deleting banner:', error);
    res.status(500).json({ message: 'Error deleting banner', error: error.message || error });
  }
};
