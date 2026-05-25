import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import { FiChevronLeft, FiChevronRight, FiPlay, FiVolume2, FiVolumeX, FiUsers, FiBookOpen, FiBriefcase } from "react-icons/fi";

export default function HeroSection() {
  const { user } = useAuth();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isMuted, setIsMuted] = useState(true);
  const videoRef = useRef(null);

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
      bgClass: "from-indigo-900 via-slate-900 to-indigo-950",
      icon: <FiUsers className="text-4xl text-indigo-400 mb-4 animate-bounce" />,
      title: "Find Alumni ",
      highlight: "Mentorship",
      subtitle: "Get 1-on-1 guidance, mock interviews, and career support directly from graduates who've walked the path.",
      ctaText: "Find a Mentor",
      ctaLink: user?.role === "alumni" ? "/mentorship/profile" : "/mentorship/mentors",
    },
    {
      type: "gradient",
      bgClass: "from-blue-950 via-slate-900 to-cyan-950",
      icon: <FiBookOpen className="text-4xl text-cyan-400 mb-4 animate-pulse" />,
      title: "Study Notes & ",
      highlight: "Interview PYQs",
      subtitle: "Access curated branch-wise university notes, roadmaps, and verified company previous year questions.",
      ctaText: "Browse Resources",
      ctaLink: "/resources-hub",
    },
    {
      type: "gradient",
      bgClass: "from-emerald-950 via-slate-900 to-teal-950",
      icon: <FiBriefcase className="text-4xl text-emerald-400 mb-4 hover:rotate-12 transition-transform" />,
      title: "Direct Internship ",
      highlight: "Openings",
      subtitle: "Apply directly for industry internships on the website with your PDF resume. No tedious external forms.",
      ctaText: "Explore Internships",
      ctaLink: "/internships",
    }
  ];

  // Auto-play slides (every 7 seconds)
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

  return (
    <section className="relative w-full h-[60vh] md:h-screen bg-slate-950 overflow-hidden flex items-center justify-center font-sans">
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
            <div className="absolute inset-0 bg-black/60 pointer-events-none" />

            {/* Mute Button */}
            <button
              onClick={toggleMute}
              className="absolute bottom-6 right-6 z-30 p-3 bg-black/40 backdrop-blur-md text-white border border-white/20 rounded-full hover:bg-black/60 transition-colors shadow-lg"
            >
              {isMuted ? <FiVolumeX size={18} /> : <FiVolume2 size={18} />}
            </button>
          </motion.div>
        ) : (
          <motion.div
            key={`slide-gradient-${currentSlide}`}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            className={`absolute inset-0 w-full h-full bg-gradient-to-br ${slides[currentSlide].bgClass} flex flex-col items-center justify-center`}
          >
            {/* Elegant light glowing blobs */}
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-[120px] pointer-events-none" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Slide Content Overlays */}
      <div className="absolute inset-0 z-10 flex flex-col items-center justify-center px-6 text-center text-white">
        <AnimatePresence mode="wait">
          <motion.div
            key={`content-${currentSlide}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="max-w-3xl flex flex-col items-center"
          >
            {slides[currentSlide].icon && slides[currentSlide].icon}
            
            <h1 className="text-3xl sm:text-5xl md:text-7xl font-bold font-poppins mb-4 tracking-tight drop-shadow-lg leading-tight">
              {slides[currentSlide].title}
              <span className="text-indigo-400 bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">
                {slides[currentSlide].highlight}
              </span>
            </h1>

            <p className="text-sm sm:text-lg md:text-xl mb-8 max-w-xl text-slate-300 font-medium leading-relaxed drop-shadow-md">
              {slides[currentSlide].subtitle}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link to={slides[currentSlide].ctaLink}>
                <button className="px-8 py-3.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white text-sm sm:text-base font-bold rounded-xl shadow-lg transition-all hover:scale-105 hover:shadow-indigo-500/20">
                  {slides[currentSlide].ctaText}
                </button>
              </Link>
              {slides[currentSlide].guestText && (
                <Link to={slides[currentSlide].guestLink}>
                  <button className="px-8 py-3.5 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/30 text-white text-sm sm:text-base font-bold rounded-xl shadow-lg transition-all hover:scale-105">
                    {slides[currentSlide].guestText}
                  </button>
                </Link>
              )}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Sliding Arrow Navigation */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-black/20 hover:bg-black/40 border border-white/10 text-white flex items-center justify-center transition-all"
        aria-label="Previous Slide"
      >
        <FiChevronLeft size={24} />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-black/20 hover:bg-black/40 border border-white/10 text-white flex items-center justify-center transition-all"
        aria-label="Next Slide"
      >
        <FiChevronRight size={24} />
      </button>

      {/* Carousel Slide Indicators */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-2">
        {slides.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentSlide(idx)}
            className={`h-2 rounded-full transition-all duration-300 ${
              idx === currentSlide ? "w-8 bg-white" : "w-2 bg-white/40 hover:bg-white/60"
            }`}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
