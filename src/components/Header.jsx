import React, { useState } from "react";
import { Link, NavLink } from "react-router-dom";

export default function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="bg-black border-b border-zinc-800">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-md flex items-center justify-center shadow-sm"
            style={{ backgroundColor: "var(--accent)" }}
          >
            <span className="font-bold text-sm" style={{ color: "#000" }}>ANM</span>
          </div>
          <span className="font-bold text-lg" style={{ color: "var(--accent)" }}>ANM RealEstate</span>
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          <NavLink to="/" className={({isActive}) => `text-sm ${isActive ? "text-[color:var(--accent)]" : "text-zinc-300 hover:text-[color:var(--accent)]"}`}>Home</NavLink>
          <NavLink to="/about" className={({isActive}) => `text-sm ${isActive ? "text-[color:var(--accent)]" : "text-zinc-300 hover:text-[color:var(--accent)]"}`}>About</NavLink>
          <NavLink to="/draw" className={({isActive}) => `text-sm ${isActive ? "text-[color:var(--accent)]" : "text-zinc-300 hover:text-[color:var(--accent)]"}`}>Draw</NavLink>
          <NavLink to="/gallery" className={({isActive}) => `text-sm ${isActive ? "text-[color:var(--accent)]" : "text-zinc-300 hover:text-[color:var(--accent)]"}`}>Gallery</NavLink>
          <NavLink to="/contact" className={({isActive}) => `text-sm ${isActive ? "text-[color:var(--accent)]" : "text-zinc-300 hover:text-[color:var(--accent)]"}`}>Contact</NavLink>
        </nav>

        <div className="hidden md:flex items-center gap-4">
          <Link to="/admin/login" className="px-3 py-1 rounded-full border" style={{ borderColor: "var(--accent)", color: "var(--accent)" }}>Admin</Link>
        </div>

        {/* Mobile menu button */}
        <div className="md:hidden flex items-center">
          <button onClick={() => setOpen(!open)} className="p-2 rounded text-zinc-300 hover:text-[color:var(--accent)]">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {open ? (
                <path strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile dropdown */}
      {open && (
        <div className="md:hidden bg-zinc-900 border-t border-zinc-800">
          <div className="container mx-auto px-4 py-3 space-y-2 flex flex-col">
            <NavLink onClick={() => setOpen(false)} to="/" className={({isActive}) => `text-sm ${isActive ? "text-[color:var(--accent)]" : "text-zinc-300 hover:text-[color:var(--accent)]"}`}>Home</NavLink>
            <NavLink onClick={() => setOpen(false)} to="/about" className={({isActive}) => `text-sm ${isActive ? "text-[color:var(--accent)]" : "text-zinc-300 hover:text-[color:var(--accent)]"}`}>About</NavLink>
            <NavLink onClick={() => setOpen(false)} to="/draw" className={({isActive}) => `text-sm ${isActive ? "text-[color:var(--accent)]" : "text-zinc-300 hover:text-[color:var(--accent)]"}`}>Draw</NavLink>
            <NavLink onClick={() => setOpen(false)} to="/gallery" className={({isActive}) => `text-sm ${isActive ? "text-[color:var(--accent)]" : "text-zinc-300 hover:text-[color:var(--accent)]"}`}>Gallery</NavLink>
            <NavLink onClick={() => setOpen(false)} to="/contact" className={({isActive}) => `text-sm ${isActive ? "text-[color:var(--accent)]" : "text-zinc-300 hover:text-[color:var(--accent)]"}`}>Contact</NavLink>
            <Link to="/admin/login" onClick={() => setOpen(false)} className="mt-2 px-3 py-2 rounded-full border text-center" style={{ borderColor: "var(--accent)", color: "var(--accent)" }}>Admin</Link>
          </div>
        </div>
      )}
    </header>
  );
}
