import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { listDraws } from "../services/firestoreService";
import Countdown from "../components/Countdown";

export default function Home() {
  const [draws, setDraws] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hoverPlot, setHoverPlot] = useState(null);
  const [nextDraw, setNextDraw] = useState(null);

  useEffect(() => {
    async function load() {
      try {
        const d = await listDraws();
        const sorted = (d || []).slice().sort((a, b) => {
          const da = a.date ? (a.date.toDate ? a.date.toDate() : new Date(a.date)) : new Date(0);
          const db = b.date ? (b.date.toDate ? b.date.toDate() : new Date(b.date)) : new Date(0);
          return da - db;
        });
        setDraws(sorted || []);
        // pick the first upcoming draw (date in future) or first in list
        const now = new Date();
        const upcoming = (sorted || []).find(x => {
          const dt = x.date ? (x.date.toDate ? x.date.toDate() : new Date(x.date)) : null;
          return dt && dt > now;
        }) || (sorted && sorted[0]) || null;
        setNextDraw(upcoming);
      } catch (e) {
        console.error("Failed loading draws", e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  // sample masterplan grid (12 plots)
  const plots = Array.from({ length: 12 }).map((_, i) => ({ id: `P-${String(i + 1).padStart(3, "0")}`, price: (i + 1) * 250000 }));

  return (
    <div className="min-h-screen bg-black text-gray-100">
      <div className="container mx-auto px-4 py-12 space-y-12">
        {/* Marquee / Announcement banner */}
        <div className="w-full overflow-hidden">
          <div className="bg-amber-500 text-black px-4 py-2 rounded-lg mb-4">
            <div className="flex items-center justify-between gap-4">
              <div className="flex-1">
                <div className="sr-only">Announcement</div>
                <div className="whitespace-nowrap animate-marquee">
                  <strong>Upcoming Draw — December 31, 2025:</strong>
                  &nbsp;The ANM Grand Land Draw will be held on December 31, 2025. Book your ticket now to participate and win a premium residential plot!
                </div>
              </div>
              <div className="flex-shrink-0">
                <Link to="/draw" className="px-4 py-2 rounded font-semibold bg-black text-amber-300">Book Ticket Now</Link>
              </div>
            </div>
          </div>
        </div>
        {/* HERO */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div>
            <div style={{ color: "var(--accent)" }} className="uppercase text-sm font-semibold mb-3">ANM Real Estate</div>
            <h1 style={{ color: "var(--accent)" }} className="text-3xl md:text-5xl font-extrabold leading-tight">
              YOUR DREAM PLOT AWAITS.
            </h1>
            <p className="mt-4 text-zinc-300 max-w-2xl">
              Be the Winner in the ANM Grand Land Draw. Fairness. Opportunity. Legacy.
              Secure your position near Mula Peta, Akashalokoram, Srikakulam — the future gateway of Andhra Pradesh.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <Link to="/signup" className="px-6 py-3 rounded font-semibold shadow" style={{ backgroundColor: "var(--accent)", color: "#000" }}>
                ENTER THE DRAW NOW
              </Link>
              <Link to="/draw" className="px-5 py-3 rounded border border-zinc-700 text-zinc-300">View Draw Details</Link>
            </div>

            <div className="mt-8 flex flex-col sm:flex-row sm:items-center sm:gap-6 gap-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-zinc-900 rounded-full flex items-center justify-center shadow">
                  <svg className="w-6 h-6 text-amber-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" d="M12 6v6l4 2"/></svg>
                </div>
                <div>
                  <div className="text-sm font-semibold text-white">Secure & Verified</div>
                  <div className="text-xs text-zinc-400">KYC & documentation for winners</div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-zinc-900 rounded-full flex items-center justify-center shadow">
                  <svg className="w-6 h-6 text-amber-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/></svg>
                </div>
                <div>
                  <div className="text-sm font-semibold text-white">Transparent Process</div>
                  <div className="text-xs text-zinc-400">Recorded draws & public announcements</div>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-lg overflow-hidden border border-zinc-800 bg-zinc-900 p-4">
            <img src="https://picsum.photos/900/600?random=1" alt="masterplan" className="w-full h-64 object-cover rounded" />
            <div className="mt-4 p-4 bg-zinc-800 rounded border-l-4" style={{ borderColor: "var(--accent)" }}>
              <div className="text-sm text-zinc-400">Next Draw</div>
              <div className="text-lg font-semibold" style={{ color: "var(--accent)" }}>{nextDraw?.title || "Grand Land Draw"}</div>
              <div className="mt-2 text-sm text-zinc-400">Draw Date: <span style={{ color: "var(--accent)" }}>December 31, 2025</span></div>
              <div className="mt-3">
                {nextDraw && nextDraw.date ? (
                  <Countdown target={nextDraw.date && nextDraw.date.toDate ? nextDraw.date.toDate() : nextDraw.date} />
                ) : (
                  <div className="text-sm text-zinc-400">Date to be announced</div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* FEATURES */}
        <section className="bg-zinc-900 rounded-lg p-6 border border-zinc-800">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-4 rounded border border-zinc-800 bg-black/30">
              <h4 className="font-semibold text-white">Why Participate?</h4>
              <p className="text-sm text-zinc-400 mt-2">Low ticket price, high-value rewards, and verified transparency at every step.</p>
            </div>
            <div className="p-4 rounded border border-zinc-800 bg-black/30">
              <h4 className="font-semibold text-white">How It Works</h4>
              <p className="text-sm text-zinc-400 mt-2">Register → Book → Get a unique ticket number → Winners announced publicly.</p>
            </div>
            <div className="p-4 rounded border border-zinc-800 bg-black/30">
              <h4 className="font-semibold text-white">Future Scope</h4>
              <p className="text-sm text-zinc-400 mt-2">Located near the proposed Mula Peta Port — a prime site for growth and appreciation.</p>
            </div>
          </div>
        </section>

        {/* MASTERPLAN */}
        <section className="bg-zinc-900 rounded-lg p-6 border border-zinc-800">
          <h3 className="text-2xl font-bold" style={{ color: "var(--accent)" }}>Masterplan Preview</h3>
          <p className="text-sm text-zinc-400 mt-2">Hover any plot to preview details. Click Book to participate in the draw.</p>

          <div className="mt-6 grid grid-cols-3 md:grid-cols-6 gap-3">
            {plots.map((p) => (
              <div
                key={p.id}
                onMouseEnter={() => setHoverPlot(p)}
                onMouseLeave={() => setHoverPlot(null)}
                className={`p-3 rounded-md border cursor-pointer transition-all ${hoverPlot?.id === p.id ? "bg-amber-50/10 border-amber-400 scale-105" : "bg-black/30 border-zinc-800"}`}
                title={`Plot ${p.id} — ₹${p.price.toLocaleString()}`}
              >
                <div className="text-sm font-mono text-zinc-100">{p.id}</div>
                <div className="text-xs text-zinc-400 mt-1">₹{p.price.toLocaleString()}</div>
              </div>
            ))}
          </div>

          {hoverPlot && (
            <div className="mt-4 p-4 bg-zinc-800 rounded border border-zinc-700">
              <div className="font-semibold" style={{ color: "var(--accent)" }}>Plot {hoverPlot.id}</div>
              <div className="text-sm text-zinc-400">Estimated price: ₹{hoverPlot.price.toLocaleString()} • Prime location • Planned connectivity to Mula Peta Port</div>
            </div>
          )}
        </section>

        {/* URGENCY & CTA */}
        <section className="bg-gradient-to-r from-zinc-900 to-black rounded-lg p-6 border border-zinc-800 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <div className="text-sm uppercase text-zinc-400">Limited Time Opportunity</div>
            <div className="mt-3">
              <div className="text-sm text-zinc-300">Next Draw</div>
              <div className="text-lg font-semibold" style={{ color: "var(--accent)" }}>{nextDraw?.title || "Grand Land Draw"}</div>
              <div className="mt-2">
                {nextDraw && nextDraw.date ? (
                  <Countdown target={nextDraw.date && nextDraw.date.toDate ? nextDraw.date.toDate() : nextDraw.date} />
                ) : (
                  <div className="text-sm text-zinc-400">No scheduled draw yet</div>
                )}
              </div>
            </div>
          </div>

          <div className="text-right">
            <div className="text-sm text-zinc-400 mb-3">Draw closes on <span style={{ color: "var(--accent)" }}>December 31, 2025</span></div>
            <Link to="/signup" className="px-5 py-3 rounded font-semibold" style={{ backgroundColor: "var(--accent)", color: "#000" }}>SECURE MY SPOT NOW</Link>
          </div>
        </section>
      </div>
    </div>
  );
}
