import React from "react";
import { Link } from "react-router-dom";

export default function Prizes() {
  const prizes = [
    { id: 1, title: "10 cents (land plot)" },
    { id: 2, title: "5 cents (land plot)" },
    { id: 3, title: "4 cents (land plot)" },
    { id: 4, title: "1 cent (land plot)" },
    { id: 5, title: "₹5,000" },
    { id: 6, title: "₹4,000" },
    { id: 7, title: "₹3,500" },
    { id: 8, title: "₹3,000" },
    { id: 9, title: "₹2,000" },
    { id: 10, title: "₹1,500" },
  ];

  return (
    <div className="min-h-screen bg-black text-gray-100">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto bg-zinc-900 rounded-lg p-6 border border-zinc-800">
          <h1 className="text-2xl font-bold mb-4" style={{ color: "var(--accent)" }}>Prizes</h1>
          <p className="text-sm text-zinc-400 mb-6">The ANM Grand Land Draw prizes — listed in order from top prize to consolation prizes.</p>

          <ol className="list-decimal pl-5 space-y-4">
            {prizes.map(p => (
              <li key={p.id} className="p-3 rounded border border-zinc-800 bg-black/20">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-semibold">Prize {p.id}</div>
                    <div className="text-sm text-zinc-400 mt-1">{p.title}</div>
                  </div>
                  <div className="text-xs text-zinc-300">{p.id <= 4 ? 'Land Plot' : 'Cash Prize'}</div>
                </div>
              </li>
            ))}
          </ol>

          <div className="mt-6 text-right">
            <Link to="/draw" className="px-4 py-2 rounded font-semibold" style={{ backgroundColor: "var(--accent)", color: "#000" }}>Enter the Draw</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
