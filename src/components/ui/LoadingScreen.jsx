import React from "react";
import { motion } from "framer-motion";

export const LoadingSpinner = ({ size = "md", color = "indigo", text }) => {
  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-12 h-12",
    lg: "w-16 h-16",
  };

  const spinnerSizes = {
    sm: 36,
    md: 44,
    lg: 52,
  };

  const colorGradients = {
    indigo: "from-indigo-600 via-blue-500 to-indigo-600",
    emerald: "from-emerald-500 via-teal-500 to-emerald-500",
    rose: "from-rose-500 via-pink-500 to-rose-500",
  };

  const colorStops = {
    indigo: { start: "#4f46e5", middle: "#3b82f6", end: "#4f46e5" },
    emerald: { start: "#10b981", middle: "#14b8a6", end: "#10b981" },
    rose: { start: "#f43f5e", middle: "#ec4899", end: "#f43f5e" },
  };

  const activeStop = colorStops[color] || colorStops.indigo;

  return (
    <div className="flex flex-col items-center justify-center space-y-4">
      <div className={`relative flex items-center justify-center ${sizeClasses[size]}`}>
        {/* Soft pulsing glow effect */}
        <div className={`absolute inset-0 bg-gradient-to-r ${colorGradients[color]} opacity-10 rounded-full blur-md animate-pulse`} />

        {/* Spinner SVG */}
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 120 120">
          {/* Background Track */}
          <circle
            cx="60"
            cy="60"
            r={spinnerSizes[size]}
            fill="none"
            stroke="#f1f5f9"
            strokeWidth="4"
          />
          {/* Animated Spinner Ring */}
          <motion.circle
            cx="60"
            cy="60"
            r={spinnerSizes[size]}
            fill="none"
            stroke={`url(#spinnerGrad-${color})`}
            strokeWidth="5"
            strokeLinecap="round"
            strokeDasharray="100 250"
            className="origin-center"
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 1.2, ease: "linear" }}
          />
          <defs>
            <linearGradient id={`spinnerGrad-${color}`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={activeStop.start} />
              <stop offset="50%" stopColor={activeStop.middle} />
              <stop offset="100%" stopColor={activeStop.end} />
            </linearGradient>
          </defs>
        </svg>
      </div>
      {text && (
        <motion.p
          initial={{ opacity: 0.6 }}
          animate={{ opacity: [0.6, 1, 0.6] }}
          transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
          className="text-xs font-semibold text-slate-500 tracking-wider"
        >
          {text}
        </motion.p>
      )}
    </div>
  );
};

const LoadingScreen = () => {
  return (
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-slate-50">
      {/* Ambient background colors */}
      <div className="absolute inset-0 bg-gradient-to-tr from-indigo-50/40 via-white to-blue-50/40" />

      {/* Decorative blurred glow circles */}
      <div className="absolute top-1/4 left-1/4 w-80 h-80 bg-indigo-200/25 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-blue-200/25 rounded-full blur-3xl" />

      <div className="relative z-10 flex flex-col items-center space-y-6">
        {/* Animated spinner ring with nested logo */}
        <div className="relative flex items-center justify-center w-28 h-28">
          {/* Pulse light under logo */}
          <div className="absolute inset-2 bg-indigo-500/10 rounded-full blur-xl animate-pulse" />

          {/* Logo container */}
          <motion.div
            initial={{ scale: 0.85, opacity: 0 }}
            animate={{ scale: [0.92, 1.02, 0.92], opacity: 1 }}
            transition={{
              scale: { repeat: Infinity, duration: 2.2, ease: "easeInOut" },
              opacity: { duration: 0.6 },
            }}
            className="w-16 h-16 flex items-center justify-center z-10"
          >
            <img
              src="/assets/images/logocampus.png"
              alt="CampusPull"
              className="w-full h-full object-contain filter drop-shadow-md"
              onError={(e) => {
                e.target.style.display = "none";
                const fallback = e.target.nextSibling;
                if (fallback) fallback.style.display = "flex";
              }}
            />
            {/* Fallback branded text-logo if image fails */}
            <div className="hidden w-14 h-14 rounded-2xl bg-indigo-600 items-center justify-center text-white font-extrabold text-2xl shadow-lg shadow-indigo-200">
              CP
            </div>
          </motion.div>

          {/* Spinner Ring */}
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 120 120">
            {/* Outer track */}
            <circle
              cx="60"
              cy="60"
              r="52"
              fill="none"
              stroke="#e2e8f0"
              strokeWidth="2"
              strokeDasharray="4 6"
              className="origin-center animate-[spin_24s_linear_infinite]"
            />
            {/* Spinner fill */}
            <motion.circle
              cx="60"
              cy="60"
              r="52"
              fill="none"
              stroke="url(#screenSpinnerGrad)"
              strokeWidth="4"
              strokeLinecap="round"
              strokeDasharray="120 200"
              className="origin-center"
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 1.6, ease: "linear" }}
            />
            <defs>
              <linearGradient id="screenSpinnerGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#4f46e5" />
                <stop offset="50%" stopColor="#3b82f6" />
                <stop offset="100%" stopColor="#10b981" />
              </linearGradient>
            </defs>
          </svg>
        </div>

        {/* Text descriptions */}
        <div className="flex flex-col items-center space-y-2 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg font-extrabold tracking-widest text-slate-800 uppercase font-poppins"
          >
            CampusPull
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: [0.5, 0.9, 0.5] }}
            transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
            className="text-[11px] font-bold text-slate-400 uppercase tracking-widest bg-slate-100 px-3 py-1 rounded-full border border-slate-200/50 shadow-sm"
          >
            Initializing session...
          </motion.p>
        </div>
      </div>

      {/* Decorative Bottom gradient bar */}
      <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-gradient-to-r from-indigo-500 via-blue-500 to-emerald-500 animate-[pulse_2.5s_infinite]" />
    </div>
  );
};

export default LoadingScreen;
