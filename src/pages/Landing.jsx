import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Landing() {
  const navigate = useNavigate();
  const [skipped, setSkipped] = useState(false);

  useEffect(() => {
    // auto-navigate after animation duration (3500ms)
    const t = setTimeout(() => {
      if (!skipped) navigate("/home");
    }, 3500);
    return () => clearTimeout(t);
  }, [navigate, skipped]);

  function skip() {
    setSkipped(true);
    navigate("/home");
  }

  return (
    <div className="min-h-screen bg-black text-gray-100 relative overflow-hidden">
      {/* Full-screen intro overlay */}
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black">
        <button onClick={skip} className="absolute inset-0" aria-label="Skip intro" />
        <div className="text-center">
          <div className="mx-auto w-36 h-36 rounded-full bg-amber-300 flex items-center justify-center text-black font-bold text-2xl logo-anim">ANM</div>
          <div className="mt-6 text-xl text-zinc-300 tagline-anim">ANM Real Estate — Grand Land Draw</div>
          <div className="mt-3 text-sm text-zinc-400">Draw on 31 Dec 2025 — Book your ticket now</div>
        </div>
      </div>

      {/* Hidden main page content behind intro (for accessibility/SEO if needed) */}
      <div className="opacity-0 pointer-events-none">
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
      </div>
    </div>
  );
}
