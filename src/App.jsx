import React from "react";

export default function App() {
  return (
    <div
      className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-black to-gray-900"
      style={{ ["--accent"]: "#D4AF37" }}
    >
      <div className="max-w-2xl w-full mx-auto px-6 py-12 text-center">
        <div className="bg-zinc-900 border-2 rounded-2xl p-12 shadow-2xl" style={{ borderColor: "var(--accent)" }}>
          {/* Maintenance Icon */}
          <div className="mb-8 flex justify-center">
            <svg 
              className="w-24 h-24" 
              style={{ color: "var(--accent)" }}
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" 
              />
            </svg>
          </div>

          {/* Main Message */}
          <h1 
            className="text-4xl md:text-5xl font-bold mb-6"
            style={{ color: "var(--accent)" }}
          >
            Under Maintenance
          </h1>
          
          <p className="text-xl text-gray-300 mb-4">
            The website is currently under maintenance
          </p>
          
          <p className="text-base text-gray-400 mb-8">
            We're working hard to improve your experience. Please check back soon.
          </p>

          {/* Decorative Line */}
          <div className="flex items-center justify-center gap-3 mt-8">
            <div className="h-px w-20 bg-gradient-to-r from-transparent" style={{ background: `linear-gradient(to right, transparent, var(--accent))` }}></div>
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: "var(--accent)" }}></div>
            <div className="h-px w-20" style={{ background: `linear-gradient(to left, transparent, var(--accent))` }}></div>
          </div>

          {/* Contact Info */}
          <p className="text-sm text-gray-500 mt-8">
            For urgent inquiries, please contact us directly
          </p>
        </div>
      </div>
    </div>
  );
}
