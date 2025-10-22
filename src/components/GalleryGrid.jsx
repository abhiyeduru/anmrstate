import React, { useState } from "react";

export default function GalleryGrid({ images = [] }) {
  const [active, setActive] = useState(null);
  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {images.map((src, i) => (
          <div key={i} className="cursor-pointer" onClick={() => setActive(src)}>
            <img src={src} alt={`img-${i}`} className="w-full h-40 object-cover rounded" />
          </div>
        ))}
      </div>

      {active && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center p-4" onClick={() => setActive(null)}>
          <img src={active} alt="preview" className="max-h-full max-w-full rounded" />
        </div>
      )}
    </>
  );
}
