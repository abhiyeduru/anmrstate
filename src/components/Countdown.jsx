import React, { useEffect, useState } from "react";

export default function Countdown({ target }) {
  const [diff, setDiff] = useState(calcDiff());

  function calcDiff() {
    const now = new Date();
    const t = new Date(target);
    const ms = Math.max(0, t - now);
    const d = Math.floor(ms / (1000 * 60 * 60 * 24));
    const h = Math.floor((ms / (1000 * 60 * 60)) % 24);
    const m = Math.floor((ms / (1000 * 60)) % 60);
    const s = Math.floor((ms / 1000) % 60);
    return { ms, d, h, m, s };
  }

  useEffect(() => {
    const id = setInterval(() => setDiff(calcDiff()), 1000);
    return () => clearInterval(id);
  }, [target]);

  if (!target) return null;

  // gold box classes: use CSS var --accent for gold, dark text for contrast
  const boxBase = "px-3 py-2 rounded shadow text-center";
  const boxStyle = {
    backgroundColor: "var(--accent)",
    color: "#000",
    minWidth: 56,
  };

  return (
    <div className="inline-flex space-x-3 text-sm">
      <div style={boxStyle} className={boxBase}>
        <div className="font-bold">{diff.d}</div>
        <div className="text-xs">Days</div>
      </div>
      <div style={boxStyle} className={boxBase}>
        <div className="font-bold">{String(diff.h).padStart(2, "0")}</div>
        <div className="text-xs">Hours</div>
      </div>
      <div style={boxStyle} className={boxBase}>
        <div className="font-bold">{String(diff.m).padStart(2, "0")}</div>
        <div className="text-xs">Min</div>
      </div>
      <div style={boxStyle} className={boxBase}>
        <div className="font-bold">{String(diff.s).padStart(2, "0")}</div>
        <div className="text-xs">Sec</div>
      </div>
    </div>
  );
}
