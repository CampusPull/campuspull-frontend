import React from "react";

const HeroSection = () => {
  return (
    <section
      className="relative text-center py-20 mb-12 rounded-2xl overflow-hidden bg-cover bg-center"
      style={{ backgroundImage: "url('/assets/images/download.jpg')" }}
    >
      {/* Single dark blur overlay */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm"></div>

      {/* Content */}
      <div className="relative z-10 px-4">
        <h1 className="text-5xl md:text-6xl font-extrabold text-white mb-6 drop-shadow-lg">
          About <span className="text-yellow-300">Campus-Pull</span>
        </h1>
        <p className="text-lg md:text-xl text-white max-w-3xl mx-auto drop-shadow-md">
          Campus-Pull is your companion for growth – bringing together students,
          alumni, and faculty into one connected ecosystem.
        </p>
      </div>
    </section>
  );
};

export default HeroSection;
