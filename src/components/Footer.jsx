import React from "react";

export default function Footer() {
  return (
    <footer className="bg-zinc-900 border-t border-zinc-800 mt-8">
      <div className="container mx-auto px-4 py-6 text-center text-sm text-zinc-400">
        <div className="mb-2 flex items-center justify-center gap-4">
          <img src="/assets/anm-logo.svg" alt="ANM Real Estate" className="h-12 object-contain" onError={(e)=>{e.target.style.display='none'}} />
        </div>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 text-sm">
          <div className="text-left">
            <div className="font-semibold text-white">Founder</div>
            <div className="text-xs text-zinc-400">Chiranjeevi Reddy Yeduru • <a href="tel:+917396761111" className="underline">+91 73967 61111</a></div>
          </div>

          <div className="text-left">
            <div className="font-semibold text-white">Co-founder</div>
            <div className="text-xs text-zinc-400">Abhiram Yeduru • <a href="tel:+919182146476" className="underline">+91 91821 46476</a></div>
          </div>

          <div>
            <a href="https://instagram.com/anmrealestate.in" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-zinc-300 hover:text-amber-300">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-amber-300"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
              <span>Instagram</span>
            </a>
          </div>
        </div>
        <div className="mt-3 text-xs text-zinc-500">All rights reserved.</div>
      </div>
    </footer>
  );
}
