import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  addDoc,
  updateDoc,
  query,
  where,
  orderBy,
  serverTimestamp,
  runTransaction,
  writeBatch,
  deleteDoc
} from "firebase/firestore";
import { db } from "../firebase";

/*
Functions:
- listDraws()
- createDraw(draw)
- createTicket(drawId, userInfo) -> uses transaction to increment ticketCounter
- listTickets(drawId)
- markWinner(drawId, ticketId)
- saveContact(contact)
- exportTicketsToCSV(tickets)
*/

export async function listDraws() {
  const col = collection(db, "draws");
  const snap = await getDocs(col);
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

export async function createDraw(draw) {
  const col = collection(db, "draws");
  const docRef = await addDoc(col, {
    ...draw,
    createdAt: serverTimestamp(),
    ticketCounter: 0,
    ticketsSold: 0,
    status: "active"
  });
  const snap = await getDoc(docRef);
  return { id: docRef.id, ...snap.data() };
}

export async function createTicket(drawId, user) {
  const drawRef = doc(db, "draws", drawId);
  const ticketsCol = collection(db, "tickets");
  const minNum = 151;
  const maxNum = 2000;

  const result = await runTransaction(db, async (tx) => {
    const drawSnap = await tx.get(drawRef);
    if (!drawSnap.exists()) throw new Error("Draw not found");

    const drawData = drawSnap.data();

    // Try random picks first
    let selected = null;
    const tries = 300;
    for (let i = 0; i < tries; i++) {
      const n = Math.floor(Math.random() * (maxNum - minNum + 1)) + minNum;
      const numRef = doc(db, "ticketNumbers", String(n));
      const numSnap = await tx.get(numRef);
      if (!numSnap.exists()) {
        // reserve this number
        tx.set(numRef, { drawId, reservedAt: serverTimestamp() });
        selected = n;
        break;
      }
    }

    // Fallback: sequential scan for first free number
    if (!selected) {
      for (let n = minNum; n <= maxNum; n++) {
        const numRef = doc(db, "ticketNumbers", String(n));
        const numSnap = await tx.get(numRef);
        if (!numSnap.exists()) {
          tx.set(numRef, { drawId, reservedAt: serverTimestamp() });
          selected = n;
          break;
        }
      }
    }

    if (!selected) throw new Error("No available ticket numbers");

    const ticketNumber = `LUCKY-${String(selected).padStart(4, "0")}`;

    const ticketRef = doc(ticketsCol);
    tx.set(ticketRef, {
      drawId,
      name: user.name,
      email: user.email,
      phone: user.phone,
      userId: user.userId || null,
      ticketNumber,
      number: selected,
      createdAt: serverTimestamp(),
      status: "booked"
    });

    tx.update(drawRef, {
      ticketsSold: (drawData.ticketsSold || 0) + 1
    });

    return { id: ticketRef.id, ticketNumber };
  });

  return result;
}

export async function listTickets(drawId) {
  // fetch tickets for a draw without server-side orderBy to avoid composite index requirement
  const q = query(collection(db, "tickets"), where("drawId", "==", drawId));
  const snap = await getDocs(q);
  const docs = snap.docs.map(d => ({ id: d.id, ...d.data() }));

  // sort client-side by createdAt ascending (oldest first)
  docs.sort((a, b) => {
    const ta = a.createdAt ? (a.createdAt.seconds || 0) * 1000 : 0;
    const tb = b.createdAt ? (b.createdAt.seconds || 0) * 1000 : 0;
    return ta - tb;
  });

  return docs;
}

export async function markWinner(drawId, ticketId) {
  const ticketRef = doc(db, "tickets", ticketId);
  await updateDoc(ticketRef, { status: "winner", pickedAt: serverTimestamp() });
  const drawRef = doc(db, "draws", drawId);
  await updateDoc(drawRef, { status: "closed", winnerTicketId: ticketId });
}

export async function saveContact(contact) {
  const col = collection(db, "contacts");
  await addDoc(col, { ...contact, createdAt: serverTimestamp() });
}

export function exportTicketsToCSV(tickets) {
  if (!tickets || !tickets.length) return null;
  const headers = ["Ticket Number", "Name", "Email", "Phone", "Status", "Created At"];
  const rows = tickets.map(t => [
    t.ticketNumber,
    t.name,
    t.email,
    t.phone,
    t.status || "",
    t.createdAt ? new Date(t.createdAt.seconds * 1000).toISOString() : ""
  ]);
  const csv = [headers, ...rows].map(r => r.map(c => `"${String(c).replace(/"/g, '""')}"`).join(",")).join("\n");
  return new Blob([csv], { type: "text/csv" });
}

export async function listAllTickets() {
  const q = query(collection(db, "tickets"), orderBy("createdAt", "desc"));
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

export async function deleteDraw(drawId) {
  if (!drawId) throw new Error("drawId required");
  const ticketsQ = query(collection(db, "tickets"), where("drawId", "==", drawId));
  const ticketsSnap = await getDocs(ticketsQ);
  const batch = writeBatch(db);

  ticketsSnap.forEach(t => {
    const tRef = doc(db, "tickets", t.id);
    batch.delete(tRef);
  });

  const drawRef = doc(db, "draws", drawId);
  batch.delete(drawRef);

  await batch.commit();
}
