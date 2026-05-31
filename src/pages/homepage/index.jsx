import React, { useEffect, useState } from "react";
import Header from "../../components/ui/Header";
import HeroSection from "./components/HeroSection";
import AlumniSpotlight from "./components/AlumniSpotlight";
import MobileSearchBar from "./components/MobileSearchBar";
import Footer from "./components/Footer";
import PodcastSection from "./components/podcastSection";

import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { FiBriefcase, FiUsers, FiArrowRight, FiMapPin, FiCalendar, FiDollarSign } from "react-icons/fi";
import { useInternships } from "../../context/internshipContext";
import { useAuth } from "../../context/AuthContext";
import { useExplore } from "../../context/exploreContext";
import SignupModal from "../../components/ui/SignupModal";
import RequestMentorModal from "../Mentorship/components/requestMentorModal";
import { MentorRequestProvider } from "../../context/mentorRequestContext";
import api from "../../utils/api";

const Homepage = () => {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const { internships, fetchInternships } = useInternships();
  const { user } = useAuth();
  const isGuest = !user;
  const { 
    sendRequest, 
    outgoingRequestIds, 
    acceptedConnectionIds, 
    showAuthModal, 
    setShowAuthModal 
  } = useExplore();
  const [dynamicMentors, setDynamicMentors] = useState([]);
  const [selectedMentor, setSelectedMentor] = useState(null);

  // Check prefers-reduced-motion media query
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mediaQuery.matches);
    const listener = (e) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener("change", listener);
    return () => mediaQuery.removeEventListener("change", listener);
  }, []);

  // Fetch real internships from context
  useEffect(() => {
    if (fetchInternships) {
      fetchInternships(1);
    }
  }, []);

  // Fetch real alumni mentors from database mentorship API (guest-aware)
  useEffect(() => {
    const fetchMentors = async () => {
      try {
        const endpoint = isGuest ? "/public/mentors" : "/mentorship/mentors";
        const res = await api.get(endpoint);
        const mentorsList = res.data.data || res.data.mentors || res.data || [];
        if (Array.isArray(mentorsList) && mentorsList.length > 0) {
          setDynamicMentors(mentorsList);
        } else {
          // Try explore search as a fallback if mentors specific table is empty
          const { data } = await api.get('/explore/users?role=alumni&limit=3');
          const users = data.data || data.users || data || [];
          if (Array.isArray(users) && users.length > 0) {
            setDynamicMentors(users);
          }
        }
      } catch (err) {
        console.error("Failed to fetch mentors dynamically", err);
        // Fallback explore call
        try {
          const { data } = await api.get('/explore/users?role=alumni&limit=3');
          const users = data.data || data.users || data || [];
          if (Array.isArray(users) && users.length > 0) {
            setDynamicMentors(users);
          }
        } catch (fallbackErr) {
          console.error("Mentor discovery fallback also failed", fallbackErr);
        }
      }
    };
    fetchMentors();
  }, [isGuest]);

  // Standard spring scroll reveal variant
  const revealVariants = prefersReducedMotion
    ? {
        hidden: { opacity: 1, y: 0 },
        visible: { opacity: 1, y: 0 }
      }
    : {
        hidden: { opacity: 0, y: 40 },
        visible: { 
          opacity: 1, 
          y: 0,
          transition: { type: "spring", stiffness: 80, damping: 18 }
        }
      };

  // 1. High-end Showcase Internships Mock Data (Fallback)
  const showcaseInternships = [
    {
      title: "Software Engineering Intern",
      company: "Google Cloud",
      loc: "Bengaluru, India (Hybrid)",
      stipend: "₹85,000 / month",
      duration: "6 Months",
      skills: ["React", "Node.js", "Docker"],
      accent: "from-blue-500/10 to-indigo-500/10 hover:border-blue-500/30",
      id: "1"
    },
    {
      title: "UI/UX Design Intern",
      company: "Innovate Lab",
      loc: "Mumbai, India (Remote)",
      stipend: "₹45,000 / month",
      duration: "3 Months",
      skills: ["Figma", "Design Systems", "Prototyping"],
      accent: "from-purple-500/10 to-pink-500/10 hover:border-purple-500/30",
      id: "2"
    },
    {
      title: "Data Science Intern",
      company: "CloudScale Analytics",
      loc: "Hyderabad, India (On-site)",
      stipend: "₹60,000 / month",
      duration: "6 Months",
      skills: ["Python", "TensorFlow", "Pandas"],
      accent: "from-cyan-500/10 to-emerald-500/10 hover:border-cyan-500/30",
      id: "3"
    }
  ];

  // 2. High-end Alumni Mentors Mock Data (Fallback)
  const showcaseMentors = [
    {
      name: "Siddharth Sharma",
      role: "Senior Software Engineer at Meta",
      grad: "CSE Batch of 2021",
      sessions: "54 completed sessions",
      specialty: "System Design, Mock Coding, Resume Prep",
      img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&h=150&q=80",
      accent: "border-indigo-500/20 shadow-[0_0_15px_rgba(99,102,241,0.05)] hover:border-indigo-500/40",
      id: "1"
    },
    {
      name: "Riddhi Malhotra",
      role: "UX Lead at Microsoft",
      grad: "ECE Batch of 2020",
      sessions: "42 completed sessions",
      specialty: "Design Portfolios, Product Thinking",
      img: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&h=150&q=80",
      accent: "border-purple-500/20 shadow-[0_0_15px_rgba(168,85,247,0.05)] hover:border-purple-500/40",
      id: "2"
    },
    {
      name: "Aman Verma",
      role: "Lead Data Scientist at Amazon",
      grad: "IT Batch of 2019",
      sessions: "68 completed sessions",
      specialty: "Machine Learning, Analytics Case Prep",
      img: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&h=150&q=80",
      accent: "border-cyan-500/20 shadow-[0_0_15px_rgba(6,182,212,0.05)] hover:border-cyan-500/40",
      id: "3"
    }
  ];

  // Dynamic Internships Mapping
  const displayInternships = (internships && internships.length > 0)
    ? internships.slice(0, 3).map((item, idx) => {
        const title = item.title || item.role || "Software Engineering Intern";
        const company = item.companyName || item.company || "Google Cloud";
        const loc = item.location || item.loc || "Bengaluru, India (Hybrid)";
        
        const stipend = typeof item.stipend === 'number' 
          ? `₹${item.stipend.toLocaleString()} / month`
          : item.stipend || "₹85,000 / month";
          
        const duration = item.durationValue && item.durationUnit
          ? `${item.durationValue} ${item.durationUnit}${item.durationValue > 1 ? "s" : ""}`
          : item.duration || "6 Months";

        const skills = Array.isArray(item.skills) && item.skills.length > 0
          ? item.skills
          : ["React", "Node.js", "Docker"];

        const id = item._id || item.id;

        return {
          title,
          company,
          loc,
          stipend,
          duration,
          skills,
          accent: idx === 0 
            ? "from-blue-500/10 to-indigo-500/10 hover:border-blue-500/30"
            : idx === 1
              ? "from-purple-500/10 to-pink-500/10 hover:border-purple-500/30"
              : "from-cyan-500/10 to-emerald-500/10 hover:border-cyan-500/30",
          id
        };
      })
    : showcaseInternships;

  // Dynamic Alumni Mentors Mapping
  const displayMentors = (dynamicMentors && dynamicMentors.length > 0)
    ? dynamicMentors.slice(0, 3).map((item, idx) => {
        const mentorUser = item.userId || item;
        const name = mentorUser.name || "Alumni Mentor";
        const role = mentorUser.headline || item.headline || (mentorUser.experience?.length > 0 ? mentorUser.experience[0].role : "Senior Engineer");
        const grad = mentorUser.college || mentorUser.education?.[0]?.school || "CSE Graduate";
        
        const sessionsText = typeof item.sessionsCompleted === 'number'
          ? `${item.sessionsCompleted} Sessions Completed`
          : "Verified Mentor";

        const specialty = Array.isArray(item.domains) && item.domains.length > 0
          ? item.domains.slice(0, 3).join(", ")
          : (Array.isArray(mentorUser.skills) && mentorUser.skills.length > 0
              ? mentorUser.skills.slice(0, 3).join(", ")
              : "Mock Coding, Resume Prep");

        const img = mentorUser.profileImage || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&h=150&q=80";
        const id = mentorUser._id || mentorUser.id || item._id;

        return {
          name,
          role,
          grad,
          sessions: sessionsText,
          specialty,
          img,
          accent: idx === 0 
            ? "border-indigo-500/20 shadow-[0_0_15px_rgba(99,102,241,0.05)] hover:border-indigo-500/40"
            : idx === 1
              ? "border-purple-500/20 shadow-[0_0_15px_rgba(168,85,247,0.05)] hover:border-purple-500/40"
              : "border-cyan-500/20 shadow-[0_0_15px_rgba(6,182,212,0.05)] hover:border-cyan-500/40",
          id
        };
      })
    : showcaseMentors;

  return (
    <div className="min-h-screen bg-slate-950 text-white overflow-hidden selection:bg-indigo-500/30">
      {/* Header */}
      <Header />
      
      {/* Mobile Search Bar */}
      <MobileSearchBar />
      
      {/* Main Content */}
      <main className="pt-0 flex flex-col gap-24 relative z-10 pb-20">
        
        {/* HERO SECTION (100vh Immersive) */}
        <HeroSection />

        {/* PODCAST SHOWCASE SECTION */}
        <PodcastSection />

        {/* FEATURED INTERNSHIPS SHOWCASE */}
        <motion.section 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={revealVariants}
          className="max-w-6xl mx-auto px-6 w-full relative"
        >
          {/* Glowing blur vector */}
          <div className="absolute top-1/2 left-0 w-80 h-80 bg-indigo-500/5 rounded-full blur-[100px] pointer-events-none" />

          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
            <div className="text-left">
              <h2 className="text-3xl sm:text-5xl font-black font-poppins mt-3 text-white">
                Featured Internships
              </h2>
              <p className="text-sm text-slate-400 mt-2 max-w-xl">
                Browse direct entry roles vetted by CampusPull. Apply instantly using your stored credentials and PDF resume.
              </p>
            </div>
            <Link to="/internships" className="group flex items-center gap-2 text-indigo-400 hover:text-indigo-300 font-bold text-sm cursor-pointer whitespace-nowrap">
              All Openings
              <FiArrowRight className="transition-transform group-hover:translate-x-1" size={16} />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {displayInternships.map((intern, i) => (
              <motion.div
                key={i}
                whileHover={prefersReducedMotion ? {} : { y: -6, scale: 1.02 }}
                style={{ willChange: "transform" }}
                className={`p-6 border border-white/5 bg-slate-900/20 backdrop-blur-md rounded-[32px] text-left transition-all duration-300 flex flex-col justify-between h-[360px] relative overflow-hidden group shadow-2xl bg-gradient-to-br ${intern.accent}`}
              >
                {/* Glowing radial orb overlay */}
                <div className="absolute -bottom-10 -right-10 w-24 h-24 bg-white/5 rounded-full blur-xl group-hover:bg-indigo-500/10 transition-all duration-500" />
                
                <div>
                  <div className="flex justify-between items-start mb-6">
                    <span className="px-3 py-1 rounded-full text-[9px] font-bold tracking-wider uppercase bg-white/5 text-slate-300 border border-white/5">
                      {intern.duration}
                    </span>
                    <span className="text-[10px] font-extrabold text-indigo-400 uppercase tracking-wide">
                      {intern.company}
                    </span>
                  </div>
                  
                  <h3 className="text-lg font-extrabold text-white mb-4 leading-snug group-hover:text-indigo-300 transition-colors">
                    {intern.title}
                  </h3>

                  <div className="space-y-2 text-xs text-slate-400 mb-6 font-medium">
                    <div className="flex items-center gap-2">
                      <FiMapPin className="text-slate-500" />
                      <span>{intern.loc}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FiDollarSign className="text-slate-500" />
                      <span>{intern.stipend}</span>
                    </div>
                  </div>
                </div>

                <div>
                  {/* Skill Badges */}
                  <div className="flex flex-wrap gap-1.5 mb-6">
                    {intern.skills.map((skill, j) => (
                      <span key={j} className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-white/5 text-slate-300">
                        {skill}
                      </span>
                    ))}
                  </div>

                  <Link to={intern.id ? `/internships/${intern.id}` : "/internships"}>
                    <button className="w-full py-2.5 bg-white/5 hover:bg-white/10 text-white font-bold text-xs rounded-2xl border border-white/5 group-hover:border-indigo-500/20 transition-all cursor-pointer">
                      Quick Apply
                    </button>
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* ALUMNI SPOTLIGHT (Student Success Stories) */}
        <AlumniSpotlight />

      </main>
      
      {/* Footer */}
      <Footer />

      {/* Request modal — only for logged-in users */}
      {selectedMentor && !isGuest && (
        <MentorRequestProvider>
          <RequestMentorModal
            mentor={selectedMentor}
            onClose={() => setSelectedMentor(null)}
          />
        </MentorRequestProvider>
      )}

      {/* Guest Signup Modal */}
      {showAuthModal && (
        <SignupModal
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
          message="Create an account to connect with alumni mentors"
        />
      )}
    </div>
  );
};

export default Homepage;