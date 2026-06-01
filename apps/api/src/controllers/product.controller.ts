import { Request, Response } from 'express';
import { db } from '../config/firebase';

export const getProducts = async (req: Request, res: Response): Promise<void> => {
  try {
    const snapshot = await db.collection('products').get();
    const products = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching products', error });
  }
};

export const getProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const docRef = await db.collection('products').doc(req.params.id).get();
    if (docRef.exists) {
      res.json({ id: docRef.id, ...docRef.data() });
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error fetching product', error });
  }
};

import { uploadImageToStorage } from '../utils/firebaseStorage';

export const createProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    let imageUrl = req.body.image || '';
    if (req.file) {
      imageUrl = await uploadImageToStorage(req.file, 'products');
    }
    
    // Parse numeric fields coming from FormData strings
    const price = typeof req.body.price === 'string' ? parseFloat(req.body.price) : req.body.price;
    const stock = typeof req.body.stock === 'string' ? parseInt(req.body.stock, 10) : req.body.stock;

    // GPM Fields
    const regular_price = req.body.regular_price ? (typeof req.body.regular_price === 'string' ? parseFloat(req.body.regular_price) : req.body.regular_price) : undefined;
    const gpm_price = req.body.gpm_price ? (typeof req.body.gpm_price === 'string' ? parseFloat(req.body.gpm_price) : req.body.gpm_price) : undefined;
    const is_gpm_product = req.body.is_gpm_product === 'true' || req.body.is_gpm_product === true;

    const newProduct = { 
      ...req.body, 
      price, 
      stock, 
      regular_price,
      gpm_price,
      is_gpm_product,
      vendor_id: req.body.vendor_id || null,
      image: imageUrl, 
      createdAt: new Date().toISOString() 
    };
    
    const docId = String(req.body.name || req.body.title || `product_${Date.now()}`).replace(/\//g, '-');
    await db.collection('products').doc(docId).set(newProduct);
    res.status(201).json({ id: docId, ...newProduct });
  } catch (error: any) {
    console.error('Error creating product:', error);
    res.status(500).json({ message: 'Error creating product', error: error.message || error });
  }
};

export const updateProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const updateData = { ...req.body };
    
    if (req.file) {
      updateData.image = await uploadImageToStorage(req.file, 'products');
    }
    
    if (updateData.price) updateData.price = typeof updateData.price === 'string' ? parseFloat(updateData.price) : updateData.price;
    if (updateData.stock) updateData.stock = typeof updateData.stock === 'string' ? parseInt(updateData.stock, 10) : updateData.stock;

    if (updateData.regular_price) updateData.regular_price = typeof updateData.regular_price === 'string' ? parseFloat(updateData.regular_price) : updateData.regular_price;
    if (updateData.gpm_price) updateData.gpm_price = typeof updateData.gpm_price === 'string' ? parseFloat(updateData.gpm_price) : updateData.gpm_price;
    if (updateData.is_gpm_product !== undefined) updateData.is_gpm_product = updateData.is_gpm_product === 'true' || updateData.is_gpm_product === true;

    await db.collection('products').doc(req.params.id).update(updateData);
    res.json({ id: req.params.id, ...updateData });
  } catch (error) {
    res.status(500).json({ message: 'Error updating product', error });
  }
};

export const deleteProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    await db.collection('products').doc(req.params.id).delete();
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting product', error });
  }
};
