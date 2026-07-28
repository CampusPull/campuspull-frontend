import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FiArrowRight, FiExternalLink, FiAward } from "react-icons/fi";
import gsap from "gsap";
import Footer from "./homepage/components/Footer";

const PartnersPage = () => {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

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
        hidden: { opacity: 0, y: 30 },
        visible: { 
          opacity: 1, 
          y: 0,
          transition: { type: "spring", stiffness: 85, damping: 20 }
        }
      };

  const partnerFeatures = [
    {
      num: "01",
      title: "Voice-native sessions",
      desc: "Real-time, low-latency conversation that listens, waits, and responds like a human interviewer."
    },
    {
      num: "02",
      title: "Smart follow-ups",
      desc: "Each answer steers the next question, exactly like a sharp interviewer would."
    },
    {
      num: "03",
      title: "Structured feedback",
      desc: "A structured report that scores your technical and communication skills, then shows you exactly how to get better."
    },
    {
      num: "04",
      title: "Role-aware questions",
      desc: "DSA, technical and guesstimate rounds drawn from your resume and target role."
    },
    {
      num: "05",
      title: "Full transcript & playback",
      desc: "Re-read every answer and listen back, so you can see exactly where you drifted."
    },
    {
      num: "06",
      title: "Practice on repeat",
      desc: "Practice at 2am the night before, or twenty times a week. Completely free."
    }
  ];

  const onFeatureEnter = (index) => {
    if (prefersReducedMotion) return;
    gsap.to(`.gsap-line-${index}`, { width: "100%", duration: 0.35, ease: "power2.out" });
    gsap.to(`.gsap-num-${index}`, { color: "#4f46e5", duration: 0.25 });
    gsap.to(`.gsap-title-${index}`, { x: 8, color: "#111827", duration: 0.25, ease: "power2.out" });
  };

  const onFeatureLeave = (index) => {
    if (prefersReducedMotion) return;
    gsap.to(`.gsap-line-${index}`, { width: "0%", duration: 0.25, ease: "power2.inOut" });
    gsap.to(`.gsap-num-${index}`, { color: "#94a3b8", duration: 0.25 });
    gsap.to(`.gsap-title-${index}`, { x: 0, color: "#1f2937", duration: 0.25, ease: "power2.inOut" });
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col justify-between overflow-x-hidden">
      
      {/* Main Content Area */}
      <main className="flex-grow pt-32 pb-24 relative max-w-6xl mx-auto px-6 w-full">
        
        {/* Soft background glow */}
        <div className="absolute top-0 right-10 w-96 h-96 bg-indigo-100/30 rounded-full blur-[120px] pointer-events-none" />
        
        {/* --- HERO SECTION --- */}
        <section className="text-left mb-20 max-w-3xl">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={revealVariants}
            className="flex flex-col items-start"
          >
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-50 text-indigo-600 text-xs font-extrabold uppercase tracking-widest rounded-full border border-indigo-100 mb-6">
              <FiAward className="text-indigo-500" size={13} /> Corporate Partnerships
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold font-poppins tracking-tight mb-6 leading-tight text-slate-900">
              Ecosystem{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
                Partners
              </span>
            </h1>
            <p className="text-slate-600 text-sm md:text-base leading-relaxed font-medium">
              We collaborate with cutting-edge professional tools and platforms to provide CampusPull students with direct interview resources, official job boards, and automated preparation tools.
            </p>
          </motion.div>
        </section>

        {/* --- PARTNER SECTION --- */}
        <section className="mb-24">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={revealVariants}
            className="bg-white border border-slate-200/60 rounded-[32px] p-8 md:p-14 shadow-xl shadow-slate-100 relative overflow-hidden"
          >
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
              
              {/* Left Column: Info & Action */}
              <div className="lg:col-span-5 flex flex-col space-y-6 text-left">
                <a 
                  href="https://hiregram.ai" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center space-x-2 bg-slate-50 border border-slate-100 p-2.5 rounded-xl w-fit shadow-sm hover:border-indigo-200 transition-colors"
                >
                  <img 
                    src="/assets/images/hiregramai_logo.jpeg" 
                    alt="Hiregram" 
                    className="h-8 w-auto rounded-md object-contain"
                  />
                  <span className="text-base font-bold font-poppins tracking-tight text-slate-900">
                    hiregram.ai
                  </span>
                  <FiExternalLink className="text-slate-400" size={13} />
                </a>

                <h2 className="text-2xl md:text-3xl font-extrabold font-poppins text-slate-900 leading-snug">
                  Hiregram - AI Mock Interviews
                </h2>

                <div className="space-y-4 text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
                  <p>
                    Hiregram is an AI-powered mock interview platform that helps you prepare for real interviews with confidence.
                  </p>
                  <p>
                    Meet Sara, our AI interviewer, who conducts natural, human-like interviews tailored to your role and experience. Receive personalized follow-up questions, real-time conversational feedback, and detailed performance reports that highlight your strengths, uncover improvement areas, and provide actionable guidance.
                  </p>
                  <p>
                    Whether you're preparing for your first internship or your next big career move, Hiregram helps you practice smarter, improve faster, and become interview-ready.
                  </p>
                </div>

                <div className="pt-2">
                  <a 
                    href="https://hiregram.ai" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition-all duration-300 shadow-sm hover:shadow-md hover:scale-[1.01]"
                  >
                    Start Free Mock Interview
                    <FiExternalLink className="ml-2" size={14} />
                  </a>
                </div>
              </div>

              {/* Right Column: Numeric features list with hover borders */}
              <div className="lg:col-span-7 flex flex-col w-full">
                {partnerFeatures.map((feat, idx) => (
                  <div
                    key={idx}
                    onMouseEnter={() => onFeatureEnter(idx)}
                    onMouseLeave={() => onFeatureLeave(idx)}
                    className="py-5 text-left border-b border-slate-100 relative group cursor-default transition-all"
                  >
                    {/* Custom GSAP animated border line */}
                    <div className={`absolute bottom-0 left-0 w-0 h-[1.5px] bg-indigo-600 gsap-line-${idx}`} />

                    <div className="flex gap-4 items-start">
                      <span className={`text-sm font-extrabold text-slate-400 font-poppins shrink-0 gsap-num-${idx} transition-colors duration-200`}>
                        {feat.num}
                      </span>
                      <div className="flex-1 space-y-1">
                        <h4 className={`font-bold text-sm text-slate-800 gsap-title-${idx} transition-all duration-200`}>
                          {feat.title}
                        </h4>
                        <p className="text-xs text-slate-500 font-medium leading-relaxed">
                          {feat.desc}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

            </div>
          </motion.div>
        </section>

        {/* --- INCUBATION / CONTACT SECTION --- */}
        <section className="max-w-4xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={revealVariants}
            className="border border-slate-200 bg-white rounded-[32px] p-8 md:p-12 text-center shadow-md relative overflow-hidden"
          >
            <h2 className="text-2xl md:text-3xl font-extrabold font-poppins text-slate-900 mb-4">
              Become a CampusPull Partner
            </h2>
            <p className="text-slate-500 text-xs md:text-sm max-w-xl mx-auto leading-relaxed mb-8 font-medium">
              Are you an organization looking to recruit top-tier student talent, offer specialized career resources, or sponsor university initiatives? Let's connect and build the future of campus hiring.
            </p>
            <Link 
              to="/contact"
              className="inline-flex items-center justify-center px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition-all duration-300 hover:scale-[1.01]"
            >
              Get In Touch
              <FiArrowRight className="ml-2" size={15} />
            </Link>
          </motion.div>
        </section>

      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default PartnersPage;
