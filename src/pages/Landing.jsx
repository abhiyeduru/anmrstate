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

  function openUPIAmount(amount = 999) {
    try {
      const upiId = '73967611111@ybl';
      const pn = encodeURIComponent('ANM Real Estate');
      const tn = encodeURIComponent('Ticket Payment');
      const am = encodeURIComponent(String(amount));
      const phonepeIntent = `phonepe://pay?pa=${upiId}&pn=${pn}&am=${am}&tn=${tn}&cu=INR`;
      const upiIntent = `upi://pay?pa=${upiId}&pn=${pn}&am=${am}&tn=${tn}&cu=INR`;
      window.location.href = phonepeIntent;
      setTimeout(() => { window.location.href = upiIntent; }, 800);
    } catch (e) {
      const upi = `upi://pay?pa=73967611111@ybl&pn=ANM%20Real%20Estate&am=${amount}&tn=Ticket%20Payment&cu=INR`;
      window.location.href = upi;
    }
  }

  return (
    <div className="min-h-screen bg-black text-gray-100 relative overflow-hidden">
      {/* Full-screen intro overlay */}
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black">
        <button onClick={skip} className="absolute inset-0" aria-label="Skip intro" />
        <div className="text-center">
          <div className="mx-auto w-36 h-36 rounded-full bg-amber-300 flex items-center justify-center logo-anim">
            {/* logo removed — previous logo will be added when provided */}
            <div className="w-28 h-28 flex flex-col items-center justify-center text-black">
              <div className="text-2xl font-bold">ANM</div>
              <div className="text-xs font-semibold">Annamma Realestate</div>
            </div>
          </div>
          <div className="mt-6 text-xl text-zinc-300 tagline-anim">ANM — Annamma Realestate — Grand Land Draw</div>
          <div className="mt-3 text-sm text-zinc-400">Draw on 31 Dec 2025 — Book your ticket now</div>
        </div>
      </div>

      {/* Hidden main page content behind intro (for accessibility/SEO if needed) */}
      <div className="opacity-0 pointer-events-none">
        <header className="py-6">
          <div className="container mx-auto px-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-amber-300 rounded flex items-center justify-center">
                {/* small logo removed; placeholder text used until previous logo is provided */}
                <div className="w-8 h-8 flex items-center justify-center text-black font-semibold">ANM</div>
              </div>
              <div className="flex flex-col" style={{ color: "var(--accent)" }}>
                <div className="font-semibold">ANM</div>
                <div className="text-xs">Annamma Realestate</div>
              </div>
            </div>
            <nav>
              <button onClick={() => openUPIAmount(999)} className="px-3 py-2 rounded bg-amber-300 text-black font-semibold">Book Ticket</button>
            </nav>
          </div>
        </header>
      </div>
    </div>
  );
}
