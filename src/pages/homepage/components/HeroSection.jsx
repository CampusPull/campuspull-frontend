import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import { 
  FiUsers, 
  FiBookOpen, 
  FiBriefcase, 
  FiVolume2, 
  FiVolumeX, 
  FiChevronLeft, 
  FiChevronRight, 
  FiArrowRight 
} from "react-icons/fi";

export default function HeroSection() {
  const { user } = useAuth();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isMuted, setIsMuted] = useState(true);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const videoRef = useRef(null);

  // Check prefers-reduced-motion media query
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mediaQuery.matches);
    const listener = (e) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener("change", listener);
    return () => mediaQuery.removeEventListener("change", listener);
  }, []);

  // Track mouse coordinates for parallax transforms
  const handleMouseMove = (e) => {
    if (prefersReducedMotion) return;
    const { clientX, clientY } = e;
    const width = window.innerWidth;
    const height = window.innerHeight;
    const x = (clientX / width) - 0.5;
    const y = (clientY / height) - 0.5;
    setMousePos({ x, y });
  };

  const slides = [
    {
      type: "video",
      title: "Welcome to ",
      highlight: "CampusPull",
      subtitle: "Your trusted platform to connect and grow with alumni and students.",
      ctaText: user ? "Explore Platform" : "Join CampusPull",
      ctaLink: user ? "/explore" : "/auth?signup=true",
      guestText: user ? null : "Explore as Guest",
      guestLink: "/explore",
    },
    {
      type: "gradient",
      bgClass: "from-indigo-950 via-slate-950 to-indigo-900/40",
      icon: <FiUsers className="text-4xl text-indigo-400 mb-4 animate-bounce" />,
      title: "Find Alumni ",
      highlight: "Mentorship",
      subtitle: "Get 1-on-1 guidance, mock interviews, and career support directly from graduates who've walked the path.",
      ctaText: "Find a Mentor",
      ctaLink: user?.role === "alumni" ? "/mentorship/profile" : "/mentorship/mentors",
    },
    {
      type: "gradient",
      bgClass: "from-blue-950 via-slate-950 to-cyan-900/40",
      icon: <FiBookOpen className="text-4xl text-cyan-400 mb-4 animate-pulse" />,
      title: "Study Notes & ",
      highlight: "Interview PYQs",
      subtitle: "Access curated branch-wise university notes, roadmaps, and verified company previous year questions.",
      ctaText: "Browse Resources",
      ctaLink: "/resources-hub",
    },
    {
      type: "gradient",
      bgClass: "from-emerald-950 via-slate-950 to-teal-900/40",
      icon: <FiBriefcase className="text-4xl text-emerald-400 mb-4 hover:rotate-12 transition-transform" />,
      title: "Direct Internship ",
      highlight: "Openings",
      subtitle: "Apply directly for industry internships on the website with your PDF resume. No tedious external forms.",
      ctaText: "Explore Internships",
      ctaLink: "/internships",
    }
  ];

  // Auto-play slides
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 8000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setIsMuted(videoRef.current.muted);
    }
  };

  // Dynamic parallax styles
  const bgParallaxStyle = prefersReducedMotion
    ? {}
    : {
        transform: `translate3d(${mousePos.x * 20}px, ${mousePos.y * 20}px, 0) translateZ(0)`,
        willChange: "transform"
      };

  const textParallaxStyle = prefersReducedMotion
    ? {}
    : {
        transform: `translate3d(${mousePos.x * -10}px, ${mousePos.y * -10}px, 0) translateZ(0)`,
        willChange: "transform"
      };

  return (
    <section 
      onMouseMove={handleMouseMove}
      className="relative w-full h-[100vh] min-h-[600px] bg-slate-950 overflow-hidden flex items-center justify-center font-sans select-none z-10"
      style={{ willChange: "transform" }}
    >
      {/* 1. SLIDE BACKGROUNDS */}
      <div className="absolute inset-0 z-0">
        <AnimatePresence mode="wait">
          {slides[currentSlide].type === "video" ? (
            <motion.div
              key="slide-video"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8 }}
              className="absolute inset-0 w-full h-full"
            >
              <video
                ref={videoRef}
                className="w-full h-full object-cover object-center"
                autoPlay
                muted={isMuted}
                playsInline
                loop
                controls={false}
              >
                <source src="/assets/images/intro.mp4" type="video/mp4" />
              </video>
              {/* Dark Overlay Inside the Video Container */}
              <div className="absolute inset-0 bg-gradient-to-b from-slate-950/50 via-slate-950/75 to-slate-950 pointer-events-none" />

              {/* Mute Button */}
              <button
                onClick={toggleMute}
                className="absolute bottom-24 right-8 z-30 p-3 bg-black/40 backdrop-blur-md text-white border border-white/20 rounded-full hover:bg-black/60 transition-colors shadow-lg cursor-pointer"
              >
                {isMuted ? <FiVolumeX size={18} /> : <FiVolume2 size={18} />}
              </button>
            </motion.div>
          ) : (
            <motion.div
              key={`slide-gradient-${currentSlide}`}
              initial={{ opacity: 0, scale: 1.03 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8 }}
              className={`absolute inset-0 w-full h-full bg-gradient-to-br ${slides[currentSlide].bgClass} flex flex-col items-center justify-center`}
            >
              <div className="absolute inset-0 bg-gradient-to-b from-slate-950/40 via-transparent to-slate-950 pointer-events-none" />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* 2. VECTOR GRID PATTERN LAYER */}
      <div 
        style={bgParallaxStyle}
        className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a_1.5px,transparent_1.5px),linear-gradient(to_bottom,#0f172a_1.5px,transparent_1.5px)] bg-[size:5rem_5rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-35 pointer-events-none z-0"
      />

      {/* 3. GLOWING HARDWARE ACCELERATED ORBS (Static on reduced motion) */}
      {!prefersReducedMotion && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
          {/* Orb 1: Indigo */}
          <motion.div 
            animate={{ 
              y: [0, -35, 0],
              x: [0, 20, 0],
              scale: [1, 1.1, 1]
            }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
            style={{ willChange: "transform", transform: "translateZ(0)" }}
            className="absolute top-[15%] right-[15%] w-96 h-96 bg-indigo-500/10 rounded-full blur-[110px]"
          />

          {/* Orb 2: Purple */}
          <motion.div 
            animate={{ 
              y: [0, 40, 0],
              x: [0, -25, 0],
              scale: [1, 1.15, 1]
            }}
            transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
            style={{ willChange: "transform", transform: "translateZ(0)" }}
            className="absolute bottom-[15%] left-[10%] w-[450px] h-[450px] bg-purple-500/10 rounded-full blur-[130px]"
          />
        </div>
      )}

      {/* 4. DRIP PARTICLE ANIMATION */}
      {!prefersReducedMotion && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
          {[...Array(12)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ 
                x: Math.random() * window.innerWidth, 
                y: Math.random() * window.innerHeight + 100,
                opacity: Math.random() * 0.4 + 0.1,
                scale: Math.random() * 0.6 + 0.4
              }}
              animate={{ 
                y: [null, -100],
                opacity: [null, 0]
              }}
              transition={{ 
                duration: Math.random() * 8 + 6, 
                repeat: Infinity, 
                ease: "linear",
                delay: Math.random() * 5
              }}
              style={{ willChange: "transform, opacity", transform: "translateZ(0)" }}
              className="absolute w-2 h-2 bg-indigo-400 rounded-full blur-[1px]"
            />
          ))}
        </div>
      )}

      {/* 5. SLIDE CONTENT VIEWPORT */}
      <div 
        style={textParallaxStyle}
        className="relative z-10 flex flex-col items-center justify-center px-6 w-full max-w-5xl text-center"
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={`content-${currentSlide}`}
            initial={{ opacity: 0, y: 30, filter: "blur(10px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: -30, filter: "blur(10px)" }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-3xl flex flex-col items-center"
          >
            {/* Showcase icon (for gradient slides) */}
            {slides[currentSlide].icon && (
              <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center mb-6 border border-white/10 shadow-inner text-white">
                {slides[currentSlide].icon}
              </div>
            )}

            {/* Slide Title */}
            <h1 className="text-4xl sm:text-6xl md:text-7xl font-black font-poppins mb-6 tracking-tight leading-[1.08] text-white">
              {slides[currentSlide].title}
              <span className="block sm:inline text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-500 select-text drop-shadow-[0_0_20px_rgba(99,102,241,0.15)]">
                {slides[currentSlide].highlight}
              </span>
            </h1>

            {/* Slide Subtitle */}
            <p className="text-sm sm:text-lg md:text-xl mb-10 max-w-xl text-slate-300 font-medium leading-relaxed drop-shadow-md">
              {slides[currentSlide].subtitle}
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-5 justify-center items-center">
              <Link to={slides[currentSlide].ctaLink}>
                <button 
                  className="px-8 py-3.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white text-sm sm:text-base font-bold rounded-full transition-all duration-300 hover:scale-105 active:scale-98 shadow-[0_0_30px_rgba(99,102,241,0.3)] hover:shadow-[0_0_40px_rgba(99,102,241,0.55)] inline-flex items-center gap-2 cursor-pointer"
                >
                  {slides[currentSlide].ctaText}
                  <FiArrowRight size={18} />
                </button>
              </Link>
              {slides[currentSlide].guestText && (
                <Link to={slides[currentSlide].guestLink}>
                  <button className="px-8 py-3.5 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 text-slate-200 text-sm sm:text-base font-bold rounded-full transition-all duration-300 hover:scale-105 active:scale-98 cursor-pointer">
                    {slides[currentSlide].guestText}
                  </button>
                </Link>
              )}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* 6. SLIDING ARROW NAVIGATION */}
      <button
        onClick={prevSlide}
        className="absolute left-6 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-slate-900/30 hover:bg-slate-900/60 border border-white/5 text-white flex items-center justify-center transition-all cursor-pointer hover:scale-105 active:scale-95 shadow-2xl backdrop-blur-sm"
        aria-label="Previous Slide"
      >
        <FiChevronLeft size={20} />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-6 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-slate-900/30 hover:bg-slate-900/60 border border-white/5 text-white flex items-center justify-center transition-all cursor-pointer hover:scale-105 active:scale-95 shadow-2xl backdrop-blur-sm"
        aria-label="Next Slide"
      >
        <FiChevronRight size={20} />
      </button>

      {/* 7. CAROUSEL DOT INDICATORS */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 flex gap-2.5">
        {slides.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentSlide(idx)}
            className={`h-2.5 rounded-full transition-all duration-300 cursor-pointer ${
              idx === currentSlide ? "w-8 bg-indigo-500" : "w-2.5 bg-white/20 hover:bg-white/40"
            }`}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>

      {/* Floating bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-slate-950 to-transparent pointer-events-none z-10" />
    </section>
  );
}
