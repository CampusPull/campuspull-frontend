import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FiExternalLink } from "react-icons/fi";

const PartnerSection = () => {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  // Check prefers-reduced-motion media query
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mediaQuery.matches);
    const listener = (e) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener("change", listener);
    return () => mediaQuery.removeEventListener("change", listener);
  }, []);

  const revealVariants = prefersReducedMotion
    ? {
        hidden: { opacity: 1, y: 0 },
        visible: { opacity: 1, y: 0 }
      }
    : {
        hidden: { opacity: 0, y: 25 },
        visible: { 
          opacity: 1, 
          y: 0,
          transition: { type: "spring", stiffness: 85, damping: 18 }
        }
      };

  return (
    <motion.section 
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-60px" }}
      variants={revealVariants}
      className="max-w-6xl mx-auto px-6 w-full relative"
    >
      <div className="bg-white text-slate-900 border border-slate-100 rounded-3xl p-6 md:p-8 shadow-xl relative overflow-hidden flex flex-col lg:flex-row lg:items-center justify-between gap-6 hover:shadow-2xl transition-all duration-500">
        
        {/* Subtle background glow pattern */}
        <div className="absolute top-0 right-0 w-60 h-60 bg-indigo-50/40 rounded-full blur-[80px] pointer-events-none" />

        {/* Left Side: Brand and short description */}
        <div className="flex flex-col gap-3 text-left relative z-10">
          
          <div className="flex flex-wrap items-center gap-3">
            <span className="px-2.5 py-0.5 rounded-full text-[8px] font-black tracking-widest uppercase bg-slate-100 text-slate-500 border border-slate-200">
              Official Partner
            </span>
            <a 
              href="https://hiregram.ai?source=campuspull" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center space-x-1.5 hover:opacity-85 transition-opacity focus:outline-none"
            >
              <img 
                src="/assets/images/hiregramai_logo.jpeg" 
                alt="Hiregram" 
                className="h-6 w-auto rounded object-contain"
              />
              <span className="text-sm font-bold font-poppins tracking-tight text-slate-900">
                hiregram.ai
              </span>
              <FiExternalLink className="text-slate-400" size={11} />
            </a>
          </div>

          <h3 className="text-xl md:text-2xl font-extrabold font-poppins text-slate-900 tracking-tight leading-tight">
            Interview like{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
              never before
            </span>
          </h3>

          <p className="text-xs text-slate-600 max-w-2xl font-medium leading-relaxed">
            Prepare for interviews with Hiregram's AI mock interviewer, Sara. Conduct natural, human-like conversations and receive real-time feedback with detailed reports tailored to your target role.
          </p>

        </div>

        {/* Right Side: Quick Action CTA Group */}
        <div className="flex flex-row items-center gap-3 shrink-0 relative z-10">
          <Link 
            to="/partners" 
            className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl transition-all duration-300 text-center w-fit focus:outline-none"
          >
            Learn More
          </Link>
          <a 
            href="https://hiregram.ai?source=campuspull" 
            target="_blank" 
            rel="noopener noreferrer"
            className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition-all duration-300 inline-flex items-center justify-center w-fit focus:outline-none shadow-sm hover:scale-[1.01]"
          >
            Try hiregram
            <FiExternalLink className="ml-1.5" size={12} />
          </a>
        </div>

      </div>
    </motion.section>
  );
};

export default PartnerSection;
