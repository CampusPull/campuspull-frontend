import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Lightbulb, Rocket, TrendingUp, X } from "lucide-react";
import Confetti from "react-confetti";

// Milestone images (from public folder)
const milestoneImages = {
  2024: "/assets/images/ABESIT.png",
  2025: "/assets/images/logo.png",
  Future: "/assets/images/logo.png",
};

const PlatformEvolution = () => {
  const [activeYear, setActiveYear] = useState(null);
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    // Set initial window size for confetti
    setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    const handleResize = () =>
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    window.addEventListener("resize", handleResize);

    // Show confetti every time the section mounts for 20 seconds
    setShowConfetti(true);
    const timer = setTimeout(() => setShowConfetti(false), 20000);

    return () => {
      window.removeEventListener("resize", handleResize);
      clearTimeout(timer);
    };
  }, []); // Runs every time component mounts (visiting section)

  const steps = [
    {
      year: "2024",
      title: "Idea Born",
      text: "The vision to connect students and alumni emerged. We started brainstorming features and goals to make mentorship and networking seamless.",
      icon: <Lightbulb className="w-6 h-6 text-yellow-500" />,
      img: milestoneImages["2024"],
    },
    {
      year: "2025",
      title: "Prototype Launched",
      text: "Our first prototype was launched at ABESIT, gathering feedback from students and alumni. This helped us improve user experience and design.",
      icon: <Rocket className="w-6 h-6 text-blue-500" />,
      img: milestoneImages["2025"],
    },
    {
      year: "Future",
      title: "Expansion",
      text: "We aim to expand to multiple colleges and communities, connecting students and alumni on a larger scale with enhanced features.",
      icon: <TrendingUp className="w-6 h-6 text-green-500" />,
      img: milestoneImages["Future"],
    },
  ];

  return (
    <section className="bg-gradient-to-r from-indigo-50 to-purple-50 shadow-md rounded-3xl p-8 md:p-12 max-w-6xl mx-auto mb-12 relative">
      {/* Confetti for visiting section */}
      {showConfetti && (
        <Confetti
          width={windowSize.width}
          height={windowSize.height}
          numberOfPieces={150}
          recycle={false}
        />
      )}

      <h2 className="text-4xl font-extrabold text-indigo-700 mb-12 text-center">
        Platform Evolution 📈
      </h2>

      <div className="relative">
        {/* Vertical Line */}
        <div className="absolute left-1/2 transform -translate-x-1/2 h-full border-l-4 border-indigo-300"></div>

        {/* Timeline Items */}
        {steps.map((step, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: index * 0.3 }}
            viewport={{ once: true }}
            className={`mb-16 flex flex-col md:flex-row items-center cursor-pointer ${
              index % 2 === 0 ? "md:justify-start" : "md:justify-end"
            } w-full`}
            onClick={() => setActiveYear(step.year)}
          >
            <div
              className={`relative w-full md:w-5/12 ${
                index % 2 === 0 ? "md:text-right md:pr-10" : "md:text-left md:pl-10"
              }`}
            >
              {/* Dot with Icon */}
              <div
                className="absolute top-0 left-1/2 transform -translate-x-1/2 
                           bg-white border-4 border-indigo-500 rounded-full w-14 h-14 
                           flex items-center justify-center shadow-xl"
              >
                {step.icon}
              </div>

              {/* Content Box */}
              <div className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-2xl transition relative overflow-hidden mt-8 md:mt-0">
                <h3 className="text-2xl font-bold text-indigo-700 relative">{step.year}</h3>
                <h4 className="text-xl font-semibold text-indigo-500 mt-2 relative">{step.title}</h4>
                <p className="text-gray-700 mt-2 relative">{step.text}</p>
              </div>
            </div>
          </motion.div>
        ))}

        {/* Popup Modal */}
        <AnimatePresence>
          {activeYear && (
            <motion.div
              key="modal"
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveYear(null)} // click outside to close
            >
              <motion.div
                className="bg-white rounded-3xl shadow-2xl p-8 max-w-lg w-11/12 relative"
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.8 }}
                onClick={(e) => e.stopPropagation()} // prevent closing when clicking inside
              >
                {/* Confetti inside modal */}
                <Confetti
                  width={windowSize.width}
                  height={windowSize.height}
                  recycle={false}
                  numberOfPieces={100}
                />

                <button
                  className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"
                  onClick={() => setActiveYear(null)}
                >
                  <X className="w-6 h-6" />
                </button>

                {/* Modal Content */}
                {steps
                  .filter((step) => step.year === activeYear)
                  .map((step) => (
                    <div key={step.year}>
                      <img
                        src={step.img}
                        alt={step.year}
                        className="w-full h-48 object-cover rounded-2xl mb-4"
                      />
                      <h3 className="text-3xl font-bold text-indigo-700 mb-2">{step.year}</h3>
                      <h4 className="text-2xl font-semibold text-indigo-500 mb-4">{step.title}</h4>
                      <p className="text-gray-700">{step.text}</p>
                    </div>
                  ))}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};

export default PlatformEvolution;
