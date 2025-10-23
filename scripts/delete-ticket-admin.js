/**
 * Usage:
 *  node scripts/delete-ticket-admin.js <ticketId>
 *
 * Requires a Firebase service account JSON file pointed at by GOOGLE_APPLICATION_CREDENTIALS
 * or set the path below.
 *
 * This script deletes a ticket, removes the reserved ticketNumbers entry (if any),
 * and decrements ticketsSold on the associated draw. It runs with admin privileges
 * so it bypasses Firestore rules — use carefully.
 */

const admin = require('firebase-admin');
const ticketId = process.argv[2];

if (!ticketId) {
  console.error('Usage: node scripts/delete-ticket-admin.js <ticketId>');
  process.exit(1);
}

if (!admin.apps.length) {
  try {
    admin.initializeApp();
  } catch (e) {
    console.error('Failed to initialize firebase-admin. Make sure GOOGLE_APPLICATION_CREDENTIALS is set to a service account JSON file.');
    console.error(e);
    process.exit(1);
  }
}

const db = admin.firestore();

async function run() {
  try {
    await db.runTransaction(async (tx) => {
      const ticketRef = db.collection('tickets').doc(ticketId);
      const tSnap = await tx.get(ticketRef);
      if (!tSnap.exists) throw new Error('Ticket not found');
      const t = tSnap.data();

      // read draw if present
      let drawRef = null;
      let drawSnap = null;
      if (t.drawId) {
        drawRef = db.collection('draws').doc(t.drawId);
        drawSnap = await tx.get(drawRef);
      }

      // delete ticket
      tx.delete(ticketRef);

      // delete reserved ticket number
      if (t.number !== undefined && t.number !== null) {
        const numRef = db.collection('ticketNumbers').doc(String(t.number));
        tx.delete(numRef);
      }

      // decrement ticketsSold
      if (drawSnap && drawSnap.exists) {
        const current = drawSnap.data().ticketsSold || 0;
        tx.update(drawRef, { ticketsSold: Math.max(0, current - 1) });
      }
    });

    console.log('Ticket deleted successfully:', ticketId);
    process.exit(0);
  } catch (err) {
    console.error('Failed to delete ticket:', err);
    process.exit(1);
  }
}

run();
