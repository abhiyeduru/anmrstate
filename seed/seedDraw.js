import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, serverTimestamp } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyC_8iXpZ3pZEqIon5rNk8uX-Lh5AfhE7CM",
  authDomain: "ecommer-3efa3.firebaseapp.com",
  projectId: "ecommer-3efa3",
  storageBucket: "ecommer-3efa3.firebasestorage.app",
  messagingSenderId: "128426505128",
  appId: "1:128426505128:web:b8ad0e1744577b3b7fa39d",
  measurementId: "G-R5C66D9MSE"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function seed() {
  const draws = collection(db, "draws");
  await addDoc(draws, {
    title: "Premium Plot Lucky Draw",
    prize: "Residential Plot - Sector 12",
    date: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7), // 7 days from now
    ticketPrice: 1000,
    totalTickets: 500,
    ticketsSold: 0,
    ticketCounter: 0,
    status: "active",
    createdAt: serverTimestamp()
  });
  console.log("Seeded draw");
}

seed().catch(console.error);
