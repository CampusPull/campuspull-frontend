import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

export default function HeroSection() {
  const [showContent, setShowContent] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const videoRef = useRef(null);

  useEffect(() => {
    const timer = setTimeout(() => setShowContent(true), 1000);
    return () => clearTimeout(timer);
  }, []);

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setIsMuted(videoRef.current.muted);
    }
  };

  return (
    /* REMOVED: h-screen 
       ADDED: relative w-full
    */
    <section className="relative w-full bg-black flex flex-col items-center justify-center">
      {/* Video now dictates the height. 
          w-full makes it span the width, height auto-adjusts based on the file.
      */}
      <div className="relative w-full leading-[0]">
        <video
          ref={videoRef}
          /* MOBILE: w-full h-auto object-contain (shows full video)
       DESKTOP (md): h-screen object-cover (fills the screen, no black bars)
    */
          className="w-full h-auto md:h-screen md:object-cover object-contain"
          autoPlay
          muted={isMuted}
          playsInline
          loop
          controls={false}
        >
          <source src="/assets/images/intro.mp4" type="video/mp4" />
        </video>

        {/* Mute Button - adjusted for desktop height */}
        <button
          onClick={toggleMute}
          className="absolute bottom-6 right-6 z-30 p-3 bg-black/40 backdrop-blur-md text-white border border-white/20 rounded-full text-xs font-bold"
        >
          {isMuted ? "🔇 UNMUTE" : "🔊 MUTE"}
        </button>

        {/* Dark Overlay inside the video container */}
        <div className="absolute inset-0 bg-black/20 pointer-events-none" />
      </div>

      {/* Content: Overlaid on top of the video area.
          We use absolute inset-0 to center it over the dynamic height video.
      */}
      {showContent && (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center px-6 text-center text-white">
          <motion.h1
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="text-2xl sm:text-5xl md:text-7xl font-poppins font-bold mb-2 drop-shadow-2xl"
          >
            Welcome to <span className="text-purple-400">CampusPull</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-xs sm:text-lg md:text-xl mb-6 max-w-md opacity-90"
          >
            Your trusted platform to connect and grow.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Link to="/explore">
              <button className="px-5 py-2 sm:px-8 sm:py-3 bg-purple-600 text-white text-sm sm:text-base font-bold rounded-lg shadow-lg">
                Get Started
              </button>
            </Link>
          </motion.div>
        </div>
      )}
    </section>
  );
}
