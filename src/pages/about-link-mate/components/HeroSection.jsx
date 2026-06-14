import React from "react";
import { Info } from "lucide-react";

const HeroSection = () => {
  return (
    <section className="relative text-center py-16 md:py-24 bg-gradient-to-tr from-slate-950 via-indigo-950 to-slate-900 overflow-hidden text-white rounded-3xl mb-12 shadow-xl border border-slate-900">
      {/* Background Radial Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(99,102,241,0.15),transparent_45%)]"></div>
      <div className="absolute top-1/2 left-1/4 w-[500px] h-[500px] bg-purple-500/5 rounded-full blur-[140px] pointer-events-none"></div>
      
      {/* Content */}
      <div className="relative z-10 max-w-3xl mx-auto px-6">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-500/10 text-indigo-400 text-xs font-bold uppercase tracking-widest rounded-full border border-indigo-500/25 mb-6 animate-pulse">
          <Info size={12} /> The Story of CampusPull
        </span>
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white mb-6 leading-tight">
          Knowledge Without <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">Boundaries</span>
        </h1>
        <p className="text-slate-300 text-sm md:text-base max-w-xl mx-auto leading-relaxed font-medium">
          Discover the drive, community principles, and ABESIT partnership powering the student career and collaboration engine.
        </p>
      </div>
    </section>
  );
};

export default HeroSection;
