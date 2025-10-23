import React, { useState } from "react";
import { createTicket } from "../services/firestoreService";

export default function TicketForm({ drawId, onBooked }) {
  const [form, setForm] = useState({ name: "", adhar: "", phone: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function handleChange(e) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    if (!form.name || !form.adhar || !form.phone) {
      setError("All fields required");
      return;
    }
    setLoading(true);
    try {
      const res = await createTicket(drawId, form);
      // Build a simple ticket object for UI/Download. createdAt uses client time for immediate display.
      const ticket = {
        id: res.id,
        ticketNumber: res.ticketNumber,
        name: form.name,
        adhar: form.adhar,
        phone: form.phone,
        createdAt: new Date()
      };
      onBooked && onBooked(ticket);
      setForm({ name: "", adhar: "", phone: "" });
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to book");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3 max-w-md">
  <input name="name" value={form.name} onChange={handleChange} placeholder="Full name" className="w-full p-2 border rounded bg-black/20" />
  <input name="adhar" value={form.adhar} onChange={handleChange} placeholder="Aadhaar number" className="w-full p-2 border rounded bg-black/20" />
  <input name="phone" value={form.phone} onChange={handleChange} placeholder="Phone" className="w-full p-2 border rounded bg-black/20" />
      {error && <div className="text-amber-300 text-sm">{error}</div>}
      <div>
        <button type="submit" disabled={loading} className="px-4 py-2 rounded font-semibold" style={{ backgroundColor: "var(--accent)", color: "#000" }}>
          {loading ? "Booking..." : "Book Ticket"}
        </button>
      </div>
    </form>
  );
}
