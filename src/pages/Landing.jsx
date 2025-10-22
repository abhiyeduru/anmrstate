import React from "react";
import { Link } from "react-router-dom";

export default function Landing() {
  return (
    <div className="min-h-screen bg-black text-gray-100 flex flex-col">
      <header className="py-6">
        <div className="container mx-auto px-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-amber-300 rounded flex items-center justify-center font-bold text-black">ANM</div>
            <div className="font-semibold" style={{ color: "var(--accent)" }}>ANM RealEstate</div>
          </div>
          <nav>
            <Link to="/draw" className="px-3 py-2 rounded bg-amber-300 text-black font-semibold">Book Ticket</Link>
          </nav>
        </div>
      </header>

      <section className="flex-1 container mx-auto px-4 py-12 flex flex-col lg:flex-row items-center gap-8">
        <div className="lg:w-1/2">
          <h1 className="text-4xl md:text-5xl font-extrabold" style={{ color: "var(--accent)" }}>ANM Grand Land Draw</h1>
          <p className="mt-4 text-zinc-300 max-w-xl">Win a premium residential plot near Mula Peta. The draw will be held on December 31, 2025 — secure your tickets now.</p>

          <div className="mt-6 flex gap-3">
            <Link to="/signup" className="px-6 py-3 rounded font-semibold" style={{ backgroundColor: "var(--accent)", color: "#000" }}>Enter the Draw</Link>
            <Link to="/draw" className="px-5 py-3 rounded border border-zinc-700 text-zinc-300">View Draw</Link>
          </div>

          <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 bg-zinc-900 rounded border border-zinc-800 text-center">
              <div className="text-sm text-zinc-400">Ticket Price</div>
              <div className="text-lg font-bold" style={{ color: "var(--accent)" }}>₹999</div>
            </div>
            <div className="p-4 bg-zinc-900 rounded border border-zinc-800 text-center">
              <div className="text-sm text-zinc-400">Draw Date</div>
              <div className="text-lg font-bold" style={{ color: "var(--accent)" }}>31 Dec 2025</div>
            </div>
            <div className="p-4 bg-zinc-900 rounded border border-zinc-800 text-center">
              <div className="text-sm text-zinc-400">Prizes</div>
              <div className="text-lg font-bold" style={{ color: "var(--accent)" }}>Residential Plots</div>
            </div>
          </div>
        </div>

        <div className="lg:w-1/2 rounded-lg overflow-hidden border border-zinc-800 bg-zinc-900 p-2">
          <img src="https://picsum.photos/900/600?random=50" alt="hero" className="w-full h-80 object-cover rounded" />
        </div>
      </section>

      <footer className="py-8">
        <div className="container mx-auto px-4 text-center text-zinc-400">© {new Date().getFullYear()} ANM Real Estate — All rights reserved</div>
      </footer>
    </div>
  );
}
