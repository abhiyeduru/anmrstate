import React, { useEffect, useState } from "react";
import Countdown from "../components/Countdown";
import TicketForm from "../components/TicketForm";
import TicketModal from "../components/TicketModal";
import { listDraws, listTickets } from "../services/firestoreService";

export default function Draw() {
  const [draw, setDraw] = useState(null);
  const [tickets, setTickets] = useState([]);
  const [confirmed, setConfirmed] = useState(null);
  const [bookingOpen, setBookingOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    try {
      const d = await listDraws();
      const active = d.find(x => x.status === "active") || d[0] || null;
      setDraw(active);
      if (active) {
        const t = await listTickets(active.id);
        setTickets(t);
      } else {
        setTickets([]);
      }
    } catch (err) {
      console.error("Load draw error", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  function handleBooked(res) {
    // res: { id, ticketNumber }
    setConfirmed(res);
    setBookingOpen(false);
    load();
  }

  const sold = draw ? (draw.ticketsSold || tickets.length || 0) : 0;
  const total = draw ? (draw.totalTickets || null) : null;
  const pct = total ? Math.min(100, Math.round((sold / total) * 100)) : null;

  return (
    <div className="min-h-screen bg-black text-gray-100">
      <div className="container mx-auto px-4 py-12 space-y-8">

        {/* Hero / Draw Summary */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div>
              <div style={{ color: "var(--accent)" }} className="text-sm font-semibold uppercase">ANM Real Estate — Grand Draw</div>
              <h2 className="text-2xl md:text-3xl font-extrabold mt-2" style={{ color: "var(--accent)" }}>
                {draw?.title || "Grand Land Draw — Akashalokoram"}
              </h2>
              <p className="mt-2 text-zinc-300 max-w-xl">{draw?.prize || "Win a premium residential plot near Mula Peta."}</p>

              <div className="mt-4 flex items-center gap-4">
                <div className="text-sm text-zinc-400">Ticket Price</div>
                <div className="text-xl font-bold" style={{ color: "var(--accent)" }}>{draw?.ticketPrice ? `₹${draw.ticketPrice}` : "Free"}</div>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-sm text-zinc-400 mr-2">Draw Date</div>
              <div className="bg-zinc-800 px-4 py-2 rounded border border-zinc-700">
                <div className="text-sm text-zinc-300">{draw && draw.date ? (draw.date.toDate ? draw.date.toDate().toLocaleString() : new Date(draw.date).toLocaleString()) : "Dec 31, 2025"}</div>
                <div className="mt-2">
                  <Countdown target={draw && draw.date ? (draw.date.toDate ? draw.date.toDate() : draw.date) : new Date("2025-12-31T00:00:00")} />
                </div>
              </div>

              <button
                onClick={() => setBookingOpen(true)}
                className="ml-2 px-5 py-3 rounded font-semibold shadow"
                style={{ backgroundColor: "var(--accent)", color: "#000" }}
              >
                BOOK YOUR TICKET NOW
              </button>
            </div>
          </div>
        </div>

        {/* Stats & Booking */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="col-span-2 bg-zinc-900 rounded-lg p-6 border border-zinc-800">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-zinc-400">Total Sold</div>
                <div className="text-2xl font-bold" style={{ color: "var(--accent)" }}>{sold}</div>
              </div>

              <div>
                <div className="text-sm text-zinc-400">Available Slots</div>
                <div className="text-lg font-semibold text-zinc-100">{total ? Math.max(0, total - sold) : "Unlimited"}</div>
              </div>
            </div>

            <div className="mt-6">
              <div className="w-full bg-zinc-800 rounded h-3 overflow-hidden border border-zinc-700">
                <div
                  className="h-3"
                  style={{
                    width: pct ? `${pct}%` : (sold ? "100%" : "0%"),
                    background: "linear-gradient(90deg, rgba(212,175,55,1), rgba(255,215,0,1))"
                  }}
                />
              </div>
              <div className="mt-2 text-xs text-zinc-400">{total ? `${pct}% filled (${sold}/${total})` : `${sold} tickets sold`}</div>
            </div>

            {/* Booking Form Inline (visible on wide screens) */}
            <div className="mt-6">
              <div className="text-sm font-semibold" style={{ color: "var(--accent)" }}>Book Now</div>
              <div className="mt-3">
                {/* show inline on large screens, else rely on modal CTA */}
                <div className="hidden lg:block">
                  <TicketForm drawId={draw?.id} onBooked={handleBooked} />
                </div>
                <div className="lg:hidden text-sm text-zinc-400">Tap "BOOK YOUR TICKET NOW" to open booking form.</div>
              </div>
            </div>
          </div>

          {/* Recent Bookings */}
          <div className="bg-zinc-900 rounded-lg p-4 border border-zinc-800">
            <div className="flex items-center justify-between">
              <h4 className="font-semibold" style={{ color: "var(--accent)" }}>Recent Bookings</h4>
              <div className="text-xs text-zinc-400">{tickets.length} entries</div>
            </div>

            <div className="mt-3 max-h-56 overflow-auto">
              {tickets.length ? (
                <ul className="space-y-3">
                  {tickets.slice().reverse().map(t => (
                    <li key={t.id} className="p-3 rounded border border-zinc-800 bg-black/30">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-sm font-mono" style={{ color: "var(--accent)" }}>{t.ticketNumber}</div>
                          <div className="text-xs text-zinc-400">{t.name} • {t.phone}</div>
                        </div>
                        <div className="text-xs text-zinc-400">{t.createdAt ? new Date(t.createdAt.seconds * 1000).toLocaleString() : "-"}</div>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="text-sm text-zinc-400 p-4 rounded border border-zinc-800">No tickets yet. Be the first to book!</div>
              )}
            </div>

            <div className="mt-4 text-center">
              <button onClick={() => { /* optional: scroll to top booking */ setBookingOpen(true); }} className="px-4 py-2 rounded" style={{ backgroundColor: "var(--accent)", color: "#000" }}>
                Book Now
              </button>
            </div>
          </div>
        </div>

        {/* Confirmation Modal */}
        <TicketModal ticket={confirmed} onClose={() => setConfirmed(null)} />

        {/* Booking Modal */}
        {bookingOpen && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50">
            <div className="w-full max-w-xl bg-zinc-900 rounded-lg p-6 border border-zinc-800">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold" style={{ color: "var(--accent)" }}>Book Ticket</h3>
                <button onClick={() => setBookingOpen(false)} className="text-zinc-400">Close</button>
              </div>
              <div className="mt-4">
                <TicketForm drawId={draw?.id} onBooked={handleBooked} />
              </div>
            </div>
          </div>
        )}

        {/* Mobile sticky CTA (visible on small screens) */}
        <div className="lg:hidden fixed inset-x-0 bottom-4 px-4 z-50">
          <div className="max-w-3xl mx-auto">
            <button
              onClick={() => setBookingOpen(true)}
              className="w-full py-3 rounded-xl font-semibold shadow-lg flex items-center justify-center gap-3"
              style={{ backgroundColor: "var(--accent)", color: "#000" }}
              aria-label="Book ticket"
            >
              <span className="text-sm">BOOK NOW</span>
              <span className="text-sm font-mono">{draw?.ticketPrice ? `₹${draw.ticketPrice}` : 'Free'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
