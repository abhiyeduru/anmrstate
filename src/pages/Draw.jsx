import React, { useEffect, useState, useMemo } from "react";
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

  // Prevent background scroll when booking modal is open (mobile UX)
  useEffect(() => {
    if (bookingOpen) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => { document.body.style.overflow = prev; };
    }
  }, [bookingOpen]);

  function handleBooked(res) {
    // res: { id, ticketNumber }
    setConfirmed(res);
    setBookingOpen(false);
    load();
  }

  const sold = draw ? (draw.ticketsSold || tickets.length || 0) : 0;
  const total = draw ? (draw.totalTickets || null) : null;
  const pct = total ? Math.min(100, Math.round((sold / total) * 100)) : null;
  // promotional mode: show dummy numbers for attraction instead of real stats
  const promoVisible = true; // flip to false to show real numbers again
  const promoSoldNumber = 500; // used to compute a promo percentage when total is available
  const promoSoldDisplay = "500+"; // displayed text for sold

  // helper: mask phone numbers to +91 9182xxxxxx style
  function maskPhone(phone) {
    if (!phone) return "";
    // extract digits
    const digits = String(phone).replace(/\D/g, "");
    // if starts with country code '91' or has 10 digits, prefer last 10
    const last10 = digits.length >= 10 ? digits.slice(digits.length - 10) : digits;
    const first4 = last10.slice(0, 4) || last10;
    return `+91 ${first4}xxxxxx`;
  }

  // promo dummy recent bookings (generated list shows masked phones and short messages)
  const promoBookings = useMemo(() => {
    // small name pools to create realistic Indian names
    const first = ["Aarav","Vivaan","Aditya","Vihaan","Sai","Arjun","Rohan","Kabir","Ishaan","Krishna","Ananya","Saanvi","Priya","Sakshi","Neha","Pooja","Riya","Sneha","Kumar","Reddy","Singh","Patel","Kumar","Sharma","Das"];
    const last = ["Reddy","Kumar","Singh","Patel","Sharma","Das","Gupta","Iyer","Nair","Menon","Verma","Choudhary","Khan","Rao","Joshi","Mehta","Bose","Kapoor","Gowda","Naik"];
    const messages = [
      "Booked 2 tickets, excited!",
      "Hope to win this time.",
      "Paid via UPI.",
      "Booking for family.",
      "Thanks ANM Real Estate!",
      "Double checked details.",
      "One ticket, fingers crossed.",
      "Booked quickly.",
      "Doing this for my parents.",
      "Happy to support the project."
    ];

    // target date range for createdAt: 2025-09-09 -> 2025-10-23 (inclusive)
    const start = new Date('2025-09-09T00:00:00Z').getTime();
    const end = new Date('2025-10-23T23:59:59Z').getTime();
    const range = end - start;

    const list = new Array(500).fill(0).map((_, i) => {
      const f = first[(i * 7) % first.length];
      const l = last[(i * 13) % last.length];
      const name = `${f} ${l}`;
      const phone = `91${Math.floor(7000000000 + ((i * 991) % 3000000000))}`; // generate varied 10- or 12-digit-ish numbers
      const ticketNumber = `LUCKY-${(1000 + i).toString().slice(-4)}`;
      const msg = messages[i % messages.length];

      // distribute timestamps uniformly across the date range
      const t = start + Math.floor((i / 499) * range) + (i % 60) * 1000;
      const seconds = Math.floor(t / 1000);

      return {
        id: `promo-${i}`,
        ticketNumber,
        name,
        phone,
        message: msg,
        createdAt: { seconds }
      };
    });

    return list.reverse(); // newest first
  }, []);

  function formatDate(createdAt) {
    if (!createdAt) return "-";
    if (createdAt.seconds) return new Date(createdAt.seconds * 1000).toLocaleString();
    if (createdAt.toDate) return createdAt.toDate().toLocaleString();
    try { return new Date(createdAt).toLocaleString(); } catch (e) { return String(createdAt); }
  }

  return (
    <div className="min-h-screen bg-black text-gray-100">
  {/* add extra bottom padding so sticky CTA doesn't cover content on mobile */}
  <div className="container mx-auto px-4 py-8 lg:py-12 space-y-8 pb-36 lg:pb-12">

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
                className="ml-2 hidden sm:inline-block px-5 py-3 rounded font-semibold shadow"
                style={{ backgroundColor: "var(--accent)", color: "#000" }}
              >
                BOOK YOUR TICKET NOW
              </button>
              {/* on very small screens, use the sticky CTA instead */}
            </div>
          </div>
        </div>

        {/* Stats & Booking */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="col-span-2 bg-zinc-900 rounded-lg p-6 border border-zinc-800">
            {promoVisible && (
              <div className="mb-4 p-3 rounded-lg bg-amber-400 text-black font-semibold text-center">
                {promoSoldDisplay} tickets sold — Limited slots remaining. Book now!
              </div>
            )}
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-zinc-400">Total Sold</div>
                  <div className="text-2xl font-bold" style={{ color: "var(--accent)" }}>
                    {promoVisible ? promoSoldDisplay : sold}
                  </div>
                </div>

                <div>
                  <div className="text-sm text-zinc-400">Available Slots</div>
                  <div className="text-lg font-semibold text-zinc-100">
                    {promoVisible ? (total ? Math.max(0, total - promoSoldNumber) : "Limited") : (total ? Math.max(0, total - sold) : "Unlimited")}
                  </div>
                </div>
              </div>

            <div className="mt-6">
              <div className="w-full bg-zinc-800 rounded h-3 overflow-hidden border border-zinc-700">
                <div
                  className="h-3"
                  style={{
                    width: (() => {
                      if (promoVisible) {
                        if (total) return `${Math.min(100, Math.round((promoSoldNumber / total) * 100))}%`;
                        return `50%`;
                      }
                      if (pct) return `${pct}%`;
                      return sold ? "100%" : "0%";
                    })(),
                    background: "linear-gradient(90deg, rgba(212,175,55,1), rgba(255,215,0,1))"
                  }}
                />
              </div>
              <div className="mt-2 text-xs text-zinc-400">{
                total
                  ? `${promoVisible ? Math.min(100, Math.round((promoSoldNumber / total) * 100)) : pct}% filled (${promoVisible ? promoSoldDisplay : sold}/${total})`
                  : `${promoVisible ? `${promoSoldDisplay} tickets sold` : `${sold} tickets sold`}`
              }</div>
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
              <div className="text-xs text-zinc-400">{promoVisible ? "Unlimited tickets — continue booking" : `${tickets.length} entries`}</div>
            </div>

            <div className="mt-3 max-h-56 sm:max-h-48 overflow-auto">
              {promoVisible ? (
                <ul className="space-y-3">
                  {promoBookings.map(t => (
                    <li key={t.id} className="p-2 sm:p-3 rounded border border-zinc-800 bg-black/30">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-sm font-mono" style={{ color: "var(--accent)" }}>{t.ticketNumber}</div>
                          <div className="text-xs text-zinc-400">{t.name} • {maskPhone(t.phone)}</div>
                          {t.message && <div className="text-xs text-zinc-300 mt-1">{t.message}</div>}
                        </div>
                        <div className="text-xs text-zinc-400">{formatDate(t.createdAt)}</div>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                tickets.length ? (
                  <ul className="space-y-3">
                    {tickets.slice().reverse().map(t => (
                      <li key={t.id} className="p-2 sm:p-3 rounded border border-zinc-800 bg-black/30">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="text-sm font-mono" style={{ color: "var(--accent)" }}>{t.ticketNumber}</div>
                            <div className="text-xs text-zinc-400">{t.name} • {maskPhone(t.phone)}</div>
                          </div>
                          <div className="text-xs text-zinc-400">{t.createdAt ? new Date(t.createdAt.seconds * 1000).toLocaleString() : "-"}</div>
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="text-sm text-zinc-400 p-4 rounded border border-zinc-800">No tickets yet. Tickets are unlimited — be the first to book!</div>
                )
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
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-2 z-50">
            <div className="w-full h-full lg:h-auto lg:w-full lg:max-w-xl bg-zinc-900 rounded-none lg:rounded-lg p-4 lg:p-6 border border-zinc-800 overflow-auto relative">
              {/* Absolute close button for mobile (bigger touch target) */}
              <button
                onClick={() => setBookingOpen(false)}
                aria-label="Close booking"
                className="absolute right-3 top-3 bg-black/50 text-zinc-200 rounded-full p-2 hover:bg-black/60"
                style={{ zIndex: 60 }}
              >
                Close
              </button>

              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold" style={{ color: "var(--accent)" }}>Book Ticket</h3>
                {/* keep the visual header spacing for large screens */}
                <div className="hidden lg:block" />
              </div>

              <div className="mt-4">
                <TicketForm drawId={draw?.id} onBooked={handleBooked} />
              </div>
            </div>
          </div>
        )}

        {/* Mobile sticky CTA (visible on small screens) */}
        <div className="lg:hidden fixed inset-x-0 bottom-4 px-4 z-40">
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
