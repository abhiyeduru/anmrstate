import React from "react";
import { Link } from "react-router-dom";

export default function About() {
  return (
    <div className="min-h-screen bg-black text-gray-100">
      <div className="container mx-auto px-4 py-12 space-y-10">
        {/* HERO */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div>
            <div style={{ color: "var(--accent)" }} className="uppercase text-sm font-semibold mb-3">ANM Real Estate</div>
            <h1 style={{ color: "var(--accent)" }} className="text-3xl md:text-4xl font-extrabold leading-tight">
              THE VISION: MULA PETA LAND DRAW
            </h1>
            <p className="mt-4 text-gray-300 max-w-2xl">
              More than a plot — a stake in Andhra's next gateway. ANM Real Estate presents the Mula Peta Land Draw:
              a fair, transparent opportunity to own premium plots at Akashalokoram near Mula Peta, Srikakulam.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                to="/signup"
                className="px-6 py-3 rounded font-semibold shadow"
                style={{ backgroundColor: "var(--accent)", color: "#000" }}
              >
                REGISTER FOR THE DRAW
              </Link>
              <Link to="/draw" className="px-5 py-3 rounded border border-zinc-700 text-zinc-300">View Draw Details</Link>
            </div>
          </div>

          <div className="rounded-lg overflow-hidden border border-zinc-800 bg-zinc-900 p-4">
            <img
              src="https://images.unsplash.com/photo-1505691723518-36a6f5f1b8a2?auto=format&fit=crop&w=900&q=60"
              alt="Akashalokoram masterplan"
              className="w-full h-64 object-cover rounded"
            />
            <div className="mt-4 p-4 bg-zinc-800 rounded border-l-4" style={{ borderColor: "var(--accent)" }}>
              <div className="text-sm text-zinc-400">Draw Date</div>
              <div className="text-lg font-semibold" style={{ color: "var(--accent)" }}>December 31, 2025</div>
              <div className="text-sm text-zinc-400 mt-2">Location</div>
              <div className="text-sm">Akashalokoram, Mula Peta, Srikakulam, Andhra Pradesh</div>
            </div>
          </div>
        </section>

        {/* OUR STORY */}
        <section className="bg-zinc-900 rounded-lg p-6 border border-zinc-800">
          <h2 style={{ color: "var(--accent)" }} className="text-2xl font-bold">A LEGACY FORGED IN VISION</h2>
          <p className="mt-3 text-gray-300">
            At ANM Real Estate, we don't just sell land — we unlock futures. The Mula Peta Land Draw offers a limited number
            of premium plots through a fair, fully transparent lottery mechanism. Winners will receive legal handover and
            full documentation, ensuring trust and clarity at every step.
          </p>
        </section>

        {/* FUTURE SCOPE */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-zinc-900 rounded-lg p-6 border border-zinc-800">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold">THE STRATEGIC HEART: THE MULA PETA PORT</h3>
              <div className="text-sm font-semibold" style={{ color: "var(--accent)" }}>Future Focus</div>
            </div>

            <p className="mt-3 text-gray-300">
              The planned Mula Peta Port is a game-changer. This infrastructure project will catalyze economic growth,
              spur industrial development, and dramatically increase demand for nearby residential and commercial land.
            </p>

            <ul className="mt-4 space-y-3 text-gray-300">
              <li className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: "var(--accent)" }}><svg className="w-4 h-4" fill="none" stroke="black" viewBox="0 0 24 24"><path strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" d="M3 10l1 1 1-1"/></svg></div>
                <div>
                  <div className="font-semibold">Economic Surge</div>
                  <div className="text-sm text-zinc-400">Jobs, logistics, and industry — driving long-term demand.</div>
                </div>
              </li>

              <li className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: "var(--accent)" }}><svg className="w-4 h-4" fill="none" stroke="black" viewBox="0 0 24 24"><path strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" d="M3 10l1 1 1-1"/></svg></div>
                <div>
                  <div className="font-semibold">Infrastructure Boom</div>
                  <div className="text-sm text-zinc-400">Major investments in roads, utilities and civic amenities.</div>
                </div>
              </li>

              <li className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: "var(--accent)" }}><svg className="w-4 h-4" fill="none" stroke="black" viewBox="0 0 24 24"><path strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" d="M3 10l1 1 1-1"/></svg></div>
                <div>
                  <div className="font-semibold">Property Appreciation</div>
                  <div className="text-sm text-zinc-400">Early landowners historically benefit from strong capital gains.</div>
                </div>
              </li>
            </ul>
          </div>

          <div className="bg-zinc-900 rounded-lg p-6 border border-zinc-800">
            <h3 className="text-xl font-semibold">MAP & CONNECTIVITY</h3>
            <p className="mt-3 text-gray-300">Akashalokoram is strategically positioned with planned connectivity to the new port site and major highways.</p>

            <div className="mt-4 rounded overflow-hidden border border-zinc-800">
              <img src="https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=900&q=60" alt="map" className="w-full h-40 object-cover"/>
              <div className="p-4 bg-zinc-900">
                <div className="text-sm text-zinc-400">Site</div>
                <div className="font-semibold" style={{ color: "var(--accent)" }}>Akashalokoram, Mula Peta</div>
                <div className="text-sm mt-2 text-zinc-400">Proposed connection to Mula Peta Port • Easy access to regional infrastructure</div>
              </div>
            </div>
          </div>
        </section>

        {/* WHY PARTICIPATE */}
        <section className="bg-zinc-900 rounded-lg p-6 border border-zinc-800">
          <h3 style={{ color: "var(--accent)" }} className="text-2xl font-bold">AN INVITATION TO ELEVATE</h3>
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded border border-zinc-800 bg-black/40">
              <div className="font-semibold">Prime Location</div>
              <div className="text-sm text-zinc-400">Plots within the influence zone of the new AP port.</div>
            </div>
            <div className="p-4 rounded border border-zinc-800 bg-black/40">
              <div className="font-semibold">High-Growth Investment</div>
              <div className="text-sm text-zinc-400">Early entry into a rapidly developing region.</div>
            </div>
            <div className="p-4 rounded border border-zinc-800 bg-black/40">
              <div className="font-semibold">Fair & Transparent</div>
              <div className="text-sm text-zinc-400">Randomized draws with public announcements and legal handovers.</div>
            </div>
            <div className="p-4 rounded border border-zinc-800 bg-black/40">
              <div className="font-semibold">Legacy Building</div>
              <div className="text-sm text-zinc-400">Secure an asset for generations.</div>
            </div>
          </div>
        </section>

        {/* TRUST & CTA */}
        <section className="bg-zinc-900 rounded-lg p-6 border border-zinc-800 text-center">
          <div className="max-w-2xl mx-auto">
            <h3 className="text-xl font-bold" style={{ color: "var(--accent)" }}>Build Your Legacy with ANM Real Estate</h3>
            <p className="mt-3 text-zinc-300">Register for the Mula Peta Land Draw and position yourself at the heart of Andhra Pradesh's next success story. Draw closes on <span style={{ color: "var(--accent)" }}>December 31, 2025</span>.</p>

            <div className="mt-6 flex flex-wrap items-center justify-center gap-4">
              <Link to="/signup" className="px-6 py-3 rounded font-semibold" style={{ backgroundColor: "var(--accent)", color: "#000" }}>SECURE YOUR FUTURE</Link>
              <Link to="/contact" className="px-5 py-3 rounded border border-zinc-700 text-zinc-300">Contact Us</Link>
            </div>

            <div className="mt-6 flex items-center justify-center gap-6">
              <img src="https://via.placeholder.com/100x40?text=Trust" alt="trust" className="h-8 object-contain"/>
              <img src="https://via.placeholder.com/100x40?text=Media" alt="media" className="h-8 object-contain"/>
              <img src="https://via.placeholder.com/100x40?text=Cert" alt="cert" className="h-8 object-contain"/>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
