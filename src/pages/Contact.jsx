import React, { useState } from "react";
import { saveContact } from "../services/firestoreService";

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  function change(e) { setForm(prev => ({ ...prev, [e.target.name]: e.target.value })); }

  async function submit(e) {
    e.preventDefault();
    setMsg("");
    if (!form.name || !form.email || !form.message) {
      setMsg("Please fill all fields.");
      return;
    }
    setLoading(true);
    try {
      await saveContact(form);
      setMsg("Message sent. We'll respond shortly.");
      setForm({ name: "", email: "", message: "" });
    } catch (err) {
      console.error(err);
      setMsg("Failed to send. Try again later.");
    } finally {
      setLoading(false);
    }
  }

  const phone = "+91 7396761111";
  const addressLine = "Santhabommali, Srikakulam, Andhra Pradesh";
  const pincode = "532195";
  const mapsQuery = encodeURIComponent(`${addressLine} ${pincode}`);

  return (
    <div className="min-h-screen bg-black text-gray-100">
      <div className="container mx-auto px-4 py-12 space-y-8">
        <header className="grid md:grid-cols-2 gap-6 items-center">
          <div>
            <div style={{ color: "var(--accent)" }} className="uppercase text-sm font-semibold mb-2">Contact ANM Real Estate</div>
            <h1 className="text-3xl font-extrabold" style={{ color: "var(--accent)" }}>Get in touch</h1>
            <p className="mt-3 text-zinc-300 max-w-xl">
              For queries about the Mula Peta Land Draw, bookings or partnership opportunities, contact our support team.
              We respond promptly to all enquiries.
            </p>

            <div className="mt-6 space-y-3 text-sm text-zinc-300">
              <div><span className="font-semibold text-zinc-400">Phone:</span> <a href={`tel:${phone}`} className="text-zinc-100" style={{ color: "var(--accent)" }}>{phone}</a></div>
              <div><span className="font-semibold text-zinc-400">Address:</span> <span className="text-zinc-100">{addressLine} • {pincode}</span></div>
              <div><span className="font-semibold text-zinc-400">Support:</span> <span style={{ color: "var(--accent)" }}>7396761111</span></div>
              <div className="mt-2">
                <a href={`https://maps.google.com?q=${mapsQuery}`} target="_blank" rel="noreferrer" className="text-sm text-zinc-300 underline">Open in Google Maps</a>
                <span className="mx-2">•</span>
                <a href={`https://wa.me/917396761111`} target="_blank" rel="noreferrer" className="text-sm" style={{ color: "var(--accent)" }}>Chat on WhatsApp</a>
              </div>
            </div>
          </div>

          <div className="bg-zinc-900 rounded-lg p-6 border border-zinc-800">
            <h3 className="text-lg font-semibold" style={{ color: "var(--accent)" }}>Send Us a Message</h3>
            <form onSubmit={submit} className="mt-4 space-y-3">
              <input name="name" value={form.name} onChange={change} placeholder="Name" className="w-full p-3 rounded border border-zinc-800 bg-black/30 text-zinc-100" />
              <input name="email" value={form.email} onChange={change} placeholder="Email" className="w-full p-3 rounded border border-zinc-800 bg-black/30 text-zinc-100" />
              <textarea name="message" value={form.message} onChange={change} rows="5" placeholder="Message" className="w-full p-3 rounded border border-zinc-800 bg-black/30 text-zinc-100" />
              {msg && <div className="text-sm text-amber-300">{msg}</div>}
              <div className="flex items-center justify-between">
                <button type="submit" disabled={loading} className="px-4 py-2 rounded font-semibold" style={{ backgroundColor: "var(--accent)", color: "#000" }}>
                  {loading ? "Sending..." : "Send Message"}
                </button>
                <div className="text-xs text-zinc-400">We aim to reply within 24 hours.</div>
              </div>
            </form>
          </div>
        </header>

        <section className="bg-zinc-900 rounded-lg p-6 border border-zinc-800">
          <h3 className="text-xl font-semibold" style={{ color: "var(--accent)" }}>Office & Support</h3>
          <p className="mt-2 text-zinc-300">Visit or send correspondence to our local office.</p>
          <div className="mt-4 grid md:grid-cols-2 gap-4">
            <div className="p-4 bg-black/30 rounded border border-zinc-800">
              <div className="text-sm text-zinc-400">Address</div>
              <div className="font-semibold text-zinc-100 mt-1">{addressLine}</div>
              <div className="text-sm text-zinc-400 mt-1">PIN: {pincode}</div>
            </div>
            <div className="p-4 bg-black/30 rounded border border-zinc-800">
              <div className="text-sm text-zinc-400">Phone & Support</div>
              <div className="font-semibold text-zinc-100 mt-1">{phone}</div>
              <div className="text-sm text-zinc-400 mt-1">Support: <span style={{ color: "var(--accent)" }}>7396761111</span></div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
