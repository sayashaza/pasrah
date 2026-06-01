import { Request, Response } from 'express';
import { db } from '../config/firebase';
import { v4 as uuidv4 } from 'uuid';

export const placeOrder = async (req: Request, res: Response): Promise<void> => {
  try {
    const { event_id, customer_id, customer_name, is_manual, items } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      res.status(400).json({ message: 'No items in order' });
      return;
    }

    if (event_id) {
      const eventDoc = await db.collection('gpm_events').doc(event_id).get();
      if (!eventDoc.exists || eventDoc.data()?.status !== 'active') {
        res.status(400).json({ message: 'Event is not active or does not exist' });
        return;
      }
    }

    // Validate items
    for (const item of items) {
      if (Number(item.quantity) <= 0 || Number(item.price) < 0) {
        res.status(400).json({ message: 'Invalid item quantity or price' });
        return;
      }
    }

    const order_code = `GPM-${new Date().toISOString().slice(0,10).replace(/-/g,'')}-${Math.floor(1000 + Math.random() * 9000)}`;
    const orderRef = db.collection('orders').doc();
    const orderId = orderRef.id;

    // Calculate total
    const total_amount = items.reduce((sum: number, item: any) => {
      return sum + (Number(item.price) * Number(item.quantity));
    }, 0);

    const newOrder = {
      id: orderId,
      order_code,
      event_id: event_id || null,
      customer_id: customer_id || null,
      customer_name: customer_name || '',
      is_manual: is_manual || false,
      status: 'placed',
      total_amount,
      createdAt: new Date().toISOString(),
    };

    const batch = db.batch();
    batch.set(orderRef, newOrder);

    // Auto-group flat items[] by vendor_id server-side
    const vendorMap: Record<string, { items: any[]; subtotal: number }> = {};
    for (const item of items) {
      const vid = item.vendor_id || 'general';
      if (!vendorMap[vid]) vendorMap[vid] = { items: [], subtotal: 0 };
      vendorMap[vid].items.push(item);
      vendorMap[vid].subtotal += Number(item.price) * Number(item.quantity);
    }

    // Create one sub_order per vendor
    for (const [vendor_id, group] of Object.entries(vendorMap)) {
      const subOrderRef = db.collection('sub_orders').doc();
      batch.set(subOrderRef, {
        id: subOrderRef.id,
        order_id: orderId,
        order_code,
        event_id: event_id || null,
        vendor_id,
        items: group.items,
        subtotal: group.subtotal,
        status: 'pending',
        cashier_id: null,
        paid_at: null,
        createdAt: new Date().toISOString(),
      });
    }

    await batch.commit();

    res.status(201).json({
      message: 'Order placed successfully',
      orderId,
      order_code,
      order: newOrder,
    });
  } catch (error: any) {
    res.status(500).json({ message: 'Error placing order', error: error.message });
  }
};


export const paySubOrder = async (req: Request, res: Response): Promise<void> => {
  try {
    const { subOrderId } = req.params;
    const { cashier_id } = req.body;

    const subOrderRef = db.collection('sub_orders').doc(subOrderId);
    
    await db.runTransaction(async (transaction) => {
      const subOrderDoc = await transaction.get(subOrderRef);
      if (!subOrderDoc.exists) {
        throw new Error('Sub order not found');
      }

      const subOrder = subOrderDoc.data();
      if (subOrder?.status === 'paid') {
        throw new Error('Sub order already paid');
      }

      // Decrement stock for each item
      const items = subOrder?.items || [];
      for (const item of items) {
        if (item.qty <= 0) {
          throw new Error('Invalid item quantity');
        }

        // Find the stock document for this event, vendor, and product
        const stocksSnapshot = await db.collection('gpm_event_stocks')
          .where('event_id', '==', subOrder?.event_id)
          .where('vendor_id', '==', subOrder?.vendor_id)
          .where('product_id', '==', item.product_id)
          .get();

        if (!stocksSnapshot.empty) {
          const stockDoc = stocksSnapshot.docs[0];
          const stockRef = db.collection('gpm_event_stocks').doc(stockDoc.id);
          const currentStock = stockDoc.data();
          
          if (currentStock.remaining_stock < item.qty) {
            throw new Error(`Insufficient stock for product: ${item.product_name}`);
          }

          transaction.update(stockRef, {
            sold_qty: currentStock.sold_qty + item.qty,
            remaining_stock: currentStock.remaining_stock - item.qty
          });
        }
      }

      // Update sub order status
      transaction.update(subOrderRef, {
        status: 'paid',
        cashier_id: cashier_id || null,
        paid_at: new Date().toISOString()
      });
    });

    // We should also check if all sub_orders for the parent order are paid to mark the parent order as completed.
    // For simplicity, we can do it post-transaction or leave it as partial_paid logic on the client.

    res.json({ message: 'Payment confirmed and stock updated atomically' });
  } catch (error: any) {
    console.error('Transaction failed:', error);
    res.status(500).json({ message: 'Transaction failed', error: error.message });
  }
};

export const getSubOrdersByVendor = async (req: Request, res: Response): Promise<void> => {
  try {
    const { eventId, vendorId } = req.params;
    // For cashier to see pending orders for their booth
    const snapshot = await db.collection('sub_orders')
      .where('event_id', '==', eventId)
      .where('vendor_id', '==', vendorId)
      .get();
      
    const subOrders = snapshot.docs.map(doc => doc.data());
    res.json(subOrders);
  } catch (error: any) {
    res.status(500).json({ message: 'Error fetching sub orders', error: error.message });
  }
};
