import React, { useState } from "react";
import { Link } from "react-router-dom";

export default function Gallery() {
  const images = [
    { src: "https://images.unsplash.com/photo-1560184897-6c0b8f4f0aef?auto=format&fit=crop&w=1600&q=60", caption: "Premium Plot — Akashalokoram" },
    { src: "https://images.unsplash.com/photo-1572120360610-d971b9b1a4ad?auto=format&fit=crop&w=1600&q=60", caption: "Handover Moment — Past Winner" },
    { src: "https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&w=1600&q=60", caption: "Site Office" },
    { src: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1600&q=60", caption: "Community View" },
    { src: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1600&q=60", caption: "Masterplan Overview" },
    { src: "https://images.unsplash.com/photo-1549187774-b4e9b0445b1e?auto=format&fit=crop&w=1600&q=60", caption: "Office Interior" }
  ];

  const [active, setActive] = useState(null);

  function open(index) {
    setActive(index);
    document.body.style.overflow = "hidden";
  }
  function close() {
    setActive(null);
    document.body.style.overflow = "";
  }
  function prev() {
    setActive((i) => (i === 0 ? images.length - 1 : i - 1));
  }
  function next() {
    setActive((i) => (i === images.length - 1 ? 0 : i + 1));
  }

  return (
    <div className="min-h-screen bg-black text-gray-100">
      <div className="container mx-auto px-4 py-12 space-y-8">
        {/* HERO */}
        <section className="grid md:grid-cols-2 gap-8 items-center">
          <div>
            <div style={{ color: "var(--accent)" }} className="uppercase text-sm font-semibold mb-3">ANM Real Estate</div>
            <h1 style={{ color: "var(--accent)" }} className="text-3xl md:text-4xl font-extrabold">Gallery — ANM Real Estate</h1>
            <p className="mt-4 text-zinc-300 max-w-2xl">
              A curated collection of property visuals, handover moments and site imagery from Akashalokoram and ANM events.
              Visual transparency builds trust — view past winners, planned masterplans and site office photos.
            </p>

            <div className="mt-6 flex gap-3">
              <Link to="/draw" className="px-5 py-3 rounded font-semibold" style={{ backgroundColor: "var(--accent)", color: "#000" }}>Join Draw</Link>
              <Link to="/about" className="px-4 py-3 rounded border border-zinc-700 text-zinc-300">About the Project</Link>
            </div>
          </div>

          <div className="rounded-lg overflow-hidden border border-zinc-800 bg-zinc-900 p-2">
            <img src={images[0].src} alt={images[0].caption} className="w-full h-64 object-cover rounded" />
            <div className="mt-3 p-3 bg-zinc-900 rounded border-l-4" style={{ borderColor: "var(--accent)" }}>
              <div className="text-sm text-zinc-400">Featured</div>
              <div className="text-lg font-semibold" style={{ color: "var(--accent)" }}>{images[0].caption}</div>
              <div className="text-sm mt-2 text-zinc-400">Akashalokoram • Mula Peta • Srikakulam</div>
            </div>
          </div>
        </section>

        {/* GRID */}
        <section>
          <h2 className="text-2xl font-bold" style={{ color: "var(--accent)" }}>Portfolio</h2>
          <p className="text-sm text-zinc-400 mt-2">Tap any image to enlarge. Gallery includes plots, past winners and office photos.</p>

          <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {images.map((img, idx) => (
              <button
                key={idx}
                onClick={() => open(idx)}
                className="overflow-hidden rounded-lg border border-zinc-800 bg-zinc-900 p-0 focus:outline-none"
                aria-label={`Open image ${idx + 1}`}
              >
                <img src={img.src} alt={img.caption} className="w-full h-40 object-cover transform hover:scale-105 transition" />
                <div className="p-2 text-xs text-zinc-300 text-left">{img.caption}</div>
              </button>
            ))}
          </div>
        </section>

        {/* PAST WINNERS */}
        <section className="bg-zinc-900 rounded-lg p-6 border border-zinc-800">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold" style={{ color: "var(--accent)" }}>Past Winners & Handover</h3>
            <div className="text-sm text-zinc-400">Real photos from our transparent handovers</div>
          </div>

          <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="rounded overflow-hidden border border-zinc-800 bg-black/30 p-3">
              <img src={images[1].src} alt="winner" className="w-full h-36 object-cover rounded" />
              <div className="mt-3 text-sm text-zinc-300">R. Kumar — Winner • Handover</div>
            </div>
            <div className="rounded overflow-hidden border border-zinc-800 bg-black/30 p-3">
              <img src={images[3].src} alt="community" className="w-full h-36 object-cover rounded" />
              <div className="mt-3 text-sm text-zinc-300">Community View — Site</div>
            </div>
            <div className="rounded overflow-hidden border border-zinc-800 bg-black/30 p-3">
              <img src={images[2].src} alt="office" className="w-full h-36 object-cover rounded" />
              <div className="mt-3 text-sm text-zinc-300">ANM Site Office</div>
            </div>
          </div>
        </section>

        {/* TRUST & CTA */}
        <section className="bg-zinc-900 rounded-lg p-6 border border-zinc-800 text-center">
          <h3 className="text-xl font-bold" style={{ color: "var(--accent)" }}>Transparency & Trust</h3>
          <p className="mt-3 text-zinc-300">We publish winner photos, documentation and handover events to ensure complete transparency.</p>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-4">
            <img src="https://via.placeholder.com/120x36?text=Trust" alt="trust" className="h-8 object-contain" />
            <img src="https://via.placeholder.com/120x36?text=Media" alt="media" className="h-8 object-contain" />
            <img src="https://via.placeholder.com/120x36?text=Cert" alt="cert" className="h-8 object-contain" />
          </div>

          <div className="mt-6">
            <Link to="/signup" className="px-6 py-3 rounded font-semibold" style={{ backgroundColor: "var(--accent)", color: "#000" }}>REGISTER FOR THE DRAW</Link>
          </div>
        </section>
      </div>

      {/* LIGHTBOX */}
      {active !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4">
          <button onClick={close} className="absolute top-6 right-6 text-zinc-300 p-2 rounded hover:text-white">Close</button>

          <div className="max-w-4xl w-full">
            <div className="relative">
              <img src={images[active].src} alt={images[active].caption} className="w-full h-[60vh] object-contain rounded-md" />
              <div className="absolute left-4 top-1/2 -translate-y-1/2">
                <button onClick={prev} className="p-3 rounded-full bg-zinc-900 border border-zinc-700 text-zinc-100 hover:bg-zinc-800">‹</button>
              </div>
              <div className="absolute right-4 top-1/2 -translate-y-1/2">
                <button onClick={next} className="p-3 rounded-full bg-zinc-900 border border-zinc-700 text-zinc-100 hover:bg-zinc-800">›</button>
              </div>
            </div>

            <div className="mt-4 bg-zinc-900 p-4 rounded border border-zinc-800 flex items-center justify-between">
              <div>
                <div className="text-sm font-semibold" style={{ color: "var(--accent)" }}>{images[active].caption}</div>
                <div className="text-xs text-zinc-400 mt-1">ANM Real Estate • Akashalokoram</div>
              </div>
              <div className="text-xs text-zinc-400">Image {active + 1} of {images.length}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
