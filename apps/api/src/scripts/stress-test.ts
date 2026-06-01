import * as admin from 'firebase-admin';

// Initialize Firebase Admin (assumes GOOGLE_APPLICATION_CREDENTIALS or default env is set)
// Or use simple init if local emulator
process.env.FIRESTORE_EMULATOR_HOST = '127.0.0.1:8080';
admin.initializeApp({ projectId: 'demo-bigcart' });

const db = admin.firestore();

async function runStressTest() {
  console.log('--- Starting Atomic Transaction Stress Test ---');
  
  const eventId = 'test-event';
  const vendorId = 'test-vendor';
  const productId = 'test-product';
  
  // 1. Setup Initial Stock (100 units)
  const stockRef = db.collection('gpm_event_stocks').doc('test-stock-doc');
  await stockRef.set({
    event_id: eventId,
    vendor_id: vendorId,
    product_id: productId,
    initial_stock: 100,
    sold_qty: 0,
    remaining_stock: 100
  });
  console.log('✅ Initial stock set to 100');

  // 2. Setup a Dummy SubOrder that requests 10 units
  const subOrderRef = db.collection('sub_orders').doc('test-suborder');
  await subOrderRef.set({
    event_id: eventId,
    vendor_id: vendorId,
    status: 'pending',
    items: [
      { product_id: productId, qty: 10, product_name: 'Beras' }
    ]
  });
  console.log('✅ Dummy SubOrder created (requests 10 units)');

  // 3. Define the atomic payment function (same logic as transaction.controller.ts)
  const simulatePayment = async (workerId: number) => {
    try {
      await db.runTransaction(async (transaction) => {
        const subOrderDoc = await transaction.get(subOrderRef);
        const subOrder = subOrderDoc.data();
        
        if (subOrder?.status === 'paid') {
          throw new Error('Sub order already paid'); // Expected for workers 2-20
        }

        const stocksSnapshot = await db.collection('gpm_event_stocks')
          .where('event_id', '==', eventId)
          .where('vendor_id', '==', vendorId)
          .where('product_id', '==', productId)
          .get();
        
        const stockDoc = stocksSnapshot.docs[0];
        const currentStock = stockDoc.data();
        
        if (currentStock.remaining_stock < 10) {
          throw new Error('Insufficient stock');
        }

        // Deduct stock
        transaction.update(stockDoc.ref, {
          sold_qty: currentStock.sold_qty + 10,
          remaining_stock: currentStock.remaining_stock - 10
        });

        // Mark paid
        transaction.update(subOrderRef, {
          status: 'paid',
          paid_at: new Date().toISOString()
        });
      });
      console.log(`🟢 Worker ${workerId}: SUCCESS! Payment confirmed and stock deducted.`);
    } catch (err: any) {
      console.log(`🔴 Worker ${workerId}: FAILED - ${err.message}`);
    }
  };

  // 4. Hammer the database with 20 concurrent requests
  console.log('🚀 Firing 20 concurrent payment requests for the same SubOrder...');
  const promises = [];
  for (let i = 1; i <= 20; i++) {
    promises.push(simulatePayment(i));
  }
  
  await Promise.all(promises);

  // 5. Verify Final State
  const finalStock = (await stockRef.get()).data();
  const finalSubOrder = (await subOrderRef.get()).data();

  console.log('\n--- FINAL RESULTS ---');
  console.log(`SubOrder Status: ${finalSubOrder?.status}`);
  console.log(`Sold Qty: ${finalStock?.sold_qty}`);
  console.log(`Remaining Stock: ${finalStock?.remaining_stock}`);

  if (finalStock?.remaining_stock === 90 && finalStock?.sold_qty === 10) {
    console.log('🏆 TEST PASSED: Race condition prevented! Stock was only deducted exactly ONCE.');
  } else {
    console.log('💥 TEST FAILED: Race condition occurred!');
  }
}

runStressTest().catch(console.error);
