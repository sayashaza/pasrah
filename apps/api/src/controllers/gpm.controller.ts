import { Request, Response } from 'express';
import { db } from '../config/firebase';

// ================= EVENTS =================
export const getEvents = async (req: Request, res: Response): Promise<void> => {
  try {
    const snapshot = await db.collection('gpm_events').get();
    const events = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching events', error });
  }
};

export const createEvent = async (req: Request, res: Response): Promise<void> => {
  try {
    const newEvent = {
      ...req.body,
      status: req.body.status || 'draft',
      opened_at: null,
      closed_at: null,
      event_date: req.body.event_date || new Date().toISOString(),
    };
    
    const docRef = await db.collection('gpm_events').add(newEvent);
    res.status(201).json({ id: docRef.id, ...newEvent });
  } catch (error: any) {
    res.status(500).json({ message: 'Error creating event', error: error.message });
  }
};

export const updateEvent = async (req: Request, res: Response): Promise<void> => {
  try {
    await db.collection('gpm_events').doc(req.params.id).update(req.body);
    res.json({ id: req.params.id, ...req.body });
  } catch (error: any) {
    res.status(500).json({ message: 'Error updating event', error: error.message });
  }
};

export const closeEvent = async (req: Request, res: Response): Promise<void> => {
  try {
    const eventRef = db.collection('gpm_events').doc(req.params.id);
    const eventDoc = await eventRef.get();
    
    if (!eventDoc.exists) {
      res.status(404).json({ message: 'Event not found' });
      return;
    }
    
    if (eventDoc.data()?.status === 'closed') {
      res.status(400).json({ message: 'Event is already closed' });
      return;
    }
    
    await eventRef.update({
      status: 'closed',
      closed_at: new Date().toISOString()
    });
    res.json({ message: 'Event closed successfully' });
  } catch (error: any) {
    res.status(500).json({ message: 'Error closing event', error: error.message });
  }
};

export const getEventSummary = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    
    // Aggregate stock data
    const stocksSnapshot = await db.collection('gpm_event_stocks').where('event_id', '==', id).get();
    let total_initial_stock = 0;
    let total_sold = 0;
    
    const vendorSales: Record<string, { total_sold: number, total_revenue: number }> = {};
    
    stocksSnapshot.forEach(doc => {
      const data = doc.data();
      total_initial_stock += (data.initial_stock || 0);
      total_sold += (data.sold_qty || 0);
    });

    // Aggregate sub_orders revenue
    const ordersSnapshot = await db.collection('sub_orders')
      .where('event_id', '==', id)
      .where('status', '==', 'paid')
      .get();
      
    let total_revenue = 0;
    ordersSnapshot.forEach(doc => {
      const data = doc.data();
      const amount = data.subtotal || 0;
      total_revenue += amount;
      
      if (!vendorSales[data.vendor_id]) {
        vendorSales[data.vendor_id] = { total_sold: 0, total_revenue: 0 };
      }
      vendorSales[data.vendor_id].total_revenue += amount;
    });

    res.json({
      total_initial_stock,
      total_sold,
      total_revenue,
      vendor_sales: vendorSales
    });
  } catch (error: any) {
    res.status(500).json({ message: 'Error fetching event summary', error: error.message });
  }
};

// ================= VENDORS =================
export const getVendorsByEvent = async (req: Request, res: Response): Promise<void> => {
  try {
    const { eventId } = req.params;
    const snapshot = await db.collection('gpm_vendors').where('event_id', '==', eventId).get();
    const vendors = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json(vendors);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching vendors', error });
  }
};

export const createVendor = async (req: Request, res: Response): Promise<void> => {
  try {
    const newVendor = {
      ...req.body,
      cashier_ids: req.body.cashier_ids || [],
    };
    
    const docRef = await db.collection('gpm_vendors').add(newVendor);
    res.status(201).json({ id: docRef.id, ...newVendor });
  } catch (error: any) {
    res.status(500).json({ message: 'Error creating vendor', error: error.message });
  }
};

// ================= STOCKS =================
export const getStocksByEvent = async (req: Request, res: Response): Promise<void> => {
  try {
    const { eventId } = req.params;
    const snapshot = await db.collection('gpm_event_stocks').where('event_id', '==', eventId).get();
    const stocks = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json(stocks);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching stocks', error });
  }
};

export const createStock = async (req: Request, res: Response): Promise<void> => {
  try {
    const { initial_stock } = req.body;
    const newStock = {
      ...req.body,
      sold_qty: 0,
      remaining_stock: initial_stock || 0,
    };
    
    const docRef = await db.collection('gpm_event_stocks').add(newStock);
    res.status(201).json({ id: docRef.id, ...newStock });
  } catch (error: any) {
    res.status(500).json({ message: 'Error creating stock', error: error.message });
  }
};

export const deleteStock = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const docRef = db.collection('gpm_event_stocks').doc(id);
    const doc = await docRef.get();
    if (!doc.exists) {
      res.status(404).json({ message: 'Stock not found' });
      return;
    }
    await docRef.delete();
    res.json({ message: 'Stock deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ message: 'Error deleting stock', error: error.message });
  }
};

export const deleteVendor = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const docRef = db.collection('gpm_vendors').doc(id);
    const doc = await docRef.get();
    if (!doc.exists) {
      res.status(404).json({ message: 'Vendor not found' });
      return;
    }
    // Also delete all stocks associated with this vendor
    const stocksSnap = await db.collection('gpm_event_stocks').where('vendor_id', '==', id).get();
    const batch = db.batch();
    stocksSnap.docs.forEach(d => batch.delete(d.ref));
    batch.delete(docRef);
    await batch.commit();
    res.json({ message: 'Vendor and associated stocks deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ message: 'Error deleting vendor', error: error.message });
  }
};
