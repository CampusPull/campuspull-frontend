import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import { motion } from "framer-motion";

const ResourcePreviewGrid = () => {
  const [hoveredResource, setHoveredResource] = useState(null);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const navigate = useNavigate();

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
        hidden: { opacity: 0, y: 40 },
        visible: { 
          opacity: 1, 
          y: 0,
          transition: { type: "spring", stiffness: 80, damping: 18 }
        }
      };

  const trendingResources = [
    {
      id: 1,
      title: "Data Structures & Algorithms Complete Guide",
      type: "Study Material",
      subject: "Computer Science",
      downloads: 2847,
      rating: 4.9,
      difficulty: "Intermediate",
      thumbnail: "https://images.pexels.com/photos/4164418/pexels-photo-4164418.jpeg?auto=compress&cs=tinysrgb&w=400",
      author: "Campus Pull",
      authorAvatar: "https://images.pexels.com/photos/3785079/pexels-photo-3785079.jpeg?auto=compress&cs=tinysrgb&w=100",
      tags: ["DSA", "Coding", "Interviews"],
      lastUpdated: "2 days ago"
    },
    {
      id: 2,
      title: "Google Software Engineer Interview Questions 2024",
      type: "Interview PYQs",
      subject: "Technical Interviews",
      downloads: 1923,
      rating: 4.8,
      difficulty: "Advanced",
      thumbnail: "https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=400",
      author: "Campus pull",
      authorAvatar: "https://images.pexels.com/photos/3769021/pexels-photo-3769021.jpeg?auto=compress&cs=tinysrgb&w=100",
      tags: ["Google", "System Design", "Coding"],
      lastUpdated: "1 week ago"
    },
    {
      id: 3,
      title: "Full Stack Developer Roadmap 2024",
      type: "Career Roadmap",
      subject: "Web Development",
      downloads: 3156,
      rating: 4.9,
      difficulty: "Beginner",
      thumbnail: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=400&q=80",
      author: "Campus pull",
      authorAvatar: "https://images.pexels.com/photos/3785079/pexels-photo-3785079.jpeg?auto=compress&cs=tinysrgb&w=100",
      tags: ["React", "Node.js", "MongoDB"],
      lastUpdated: "3 days ago"
    },
    {
      id: 4,
      title: "Machine Learning Mathematics Essentials",
      type: "Study Material",
      subject: "Mathematics",
      downloads: 1654,
      rating: 4.7,
      difficulty: "Advanced",
      thumbnail: "https://images.pexels.com/photos/3861969/pexels-photo-3861969.jpeg?auto=compress&cs=tinysrgb&w=400",
      author: "Campus pull",
      authorAvatar: "https://images.pexels.com/photos/3769021/pexels-photo-3769021.jpeg?auto=compress&cs=tinysrgb&w=100",
      tags: ["Linear Algebra", "Statistics", "ML"],
      lastUpdated: "5 days ago"
    },
    {
      id: 5,
      title: "Product Management Case Studies",
      type: "Career Roadmap",
      subject: "Business",
      downloads: 987,
      rating: 4.6,
      difficulty: "Intermediate",
      thumbnail: "https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=400",
      author: "Campus pull",
      authorAvatar: "https://images.pexels.com/photos/3785079/pexels-photo-3785079.jpeg?auto=compress&cs=tinysrgb&w=100",
      tags: ["Strategy", "Analytics", "Leadership"],
      lastUpdated: "1 day ago"
    },
    {
      id: 6,
      title: "GATE Computer Science Previous Year Papers",
      type: "Interview PYQs",
      subject: "Competitive Exams",
      downloads: 4231,
      rating: 4.9,
      difficulty: "Advanced",
      thumbnail: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=400&q=80",
      author: "Campuss pull",
      authorAvatar: "https://images.pexels.com/photos/3785079/pexels-photo-3785079.jpeg?auto=compress&cs=tinysrgb&w=100",
      tags: ["GATE", "CS", "Preparation"],
      lastUpdated: "4 days ago"
    }
  ];

  const getTypeIcon = (type) => {
    switch (type) {
      case 'Study Material': return 'BookOpen';
      case 'Interview PYQs': return 'MessageSquare';
      case 'Career Roadmap': return 'Map';
      default: return 'FileText';
    }
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Beginner': return 'text-emerald-400 bg-emerald-500/10 border border-emerald-500/20';
      case 'Intermediate': return 'text-amber-400 bg-amber-500/10 border border-amber-500/20';
      case 'Advanced': return 'text-red-400 bg-red-500/10 border border-red-500/20';
      default: return 'text-slate-400 bg-white/5 border border-white/10';
    }
  };

  return (
    <motion.section 
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      variants={revealVariants}
      className="py-16 bg-transparent relative w-full"
    >
      {/* Decorative background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-indigo-500/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-6xl mx-auto px-6 relative z-10">
        {/* Section Header */}
        <div className="text-left mb-12">
          <span className="text-xs font-bold text-indigo-400 uppercase tracking-widest bg-indigo-950/30 border border-indigo-500/10 px-3 py-1 rounded-full">
            📚 Knowledge Hub
          </span>
          <h2 className="text-3xl sm:text-5xl font-black font-poppins mt-3 text-white">
            Trending Resources
          </h2>
          <p className="text-sm text-slate-400 mt-2 max-w-xl">
            Discover the most popular study materials, interview questions, and career roadmaps shared by our community.
          </p>
        </div>

        {/* Resource Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {trendingResources?.map((resource) => (
            <motion.div
              key={resource.id}
              whileHover={prefersReducedMotion ? {} : { y: -6, scale: 1.02 }}
              style={{ willChange: "transform" }}
              className="knowledge-card bg-slate-900/20 backdrop-blur-md rounded-[32px] overflow-hidden border border-white/5 hover:border-indigo-500/30 group cursor-pointer transition-all duration-300 shadow-2xl relative flex flex-col justify-between h-[420px]"
              onMouseEnter={() => setHoveredResource(resource.id)}
              onMouseLeave={() => setHoveredResource(null)}
            >
              {/* Resource Thumbnail */}
              <div className="relative h-44 overflow-hidden">
                <Image
                  src={resource.thumbnail}
                  alt={resource.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent"></div>
                <div className="absolute top-3 left-3">
                  <div className="flex items-center space-x-1 bg-slate-950/80 backdrop-blur-sm rounded-full px-3 py-1 border border-white/5">
                    <Icon name={getTypeIcon(resource.type)} size={12} color="#818cf8" />
                    <span className="text-[10px] font-inter font-bold text-indigo-300 uppercase tracking-wider">{resource.type}</span>
                  </div>
                </div>
                <div className="absolute top-3 right-3">
                  <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-bold tracking-wider uppercase ${getDifficultyColor(resource.difficulty)}`}>
                    {resource.difficulty}
                  </span>
                </div>
                {hoveredResource === resource.id && (
                  <div className="absolute inset-0 flex items-center justify-center bg-slate-950/40 backdrop-blur-sm transition-all duration-300">
                    <div className="text-center text-white">
                      <div className="flex items-center justify-center space-x-4 mb-2">
                        <div className="flex items-center space-x-1 bg-slate-950/60 backdrop-blur-sm px-2.5 py-1 rounded-full border border-white/5">
                          <Icon name="Download" size={12} color="white" />
                          <span className="text-xs font-bold font-inter">{resource.downloads.toLocaleString()}</span>
                        </div>
                        <div className="flex items-center space-x-1 bg-slate-950/60 backdrop-blur-sm px-2.5 py-1 rounded-full border border-white/5">
                          <Icon name="Star" size={12} color="#F59E0B" />
                          <span className="text-xs font-bold font-inter">{resource.rating}</span>
                        </div>
                      </div>
                      <div className="text-[10px] opacity-80 uppercase tracking-widest font-bold font-inter">Click to view</div>
                    </div>
                  </div>
                )}
              </div>

              {/* Resource Content */}
              <div className="p-6 flex flex-col justify-between flex-grow">
                <div>
                  <h3 className="text-base font-extrabold text-white leading-snug group-hover:text-indigo-300 transition-colors duration-300 line-clamp-2">
                    {resource.title}
                  </h3>
                  <p className="text-xs text-slate-400 font-medium font-inter mt-1.5">{resource.subject}</p>
                </div>

                <div>
                  <div className="flex flex-wrap gap-1.5 mb-5 mt-4">
                    {resource.tags.slice(0, 3).map(tag => (
                      <span key={tag} className="px-2.5 py-0.5 bg-white/5 border border-white/5 text-[9px] font-bold font-inter text-slate-300 uppercase tracking-wide rounded-full">{tag}</span>
                    ))}
                  </div>
                  <div className="flex items-center justify-between pt-4 border-t border-white/5">
                    <div className="flex items-center space-x-2">
                      <div className="w-7 h-7 rounded-full overflow-hidden border border-white/10">
                        <Image src={resource.authorAvatar} alt={resource.author} className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <p className="text-[10px] font-bold font-inter text-white">{resource.author}</p>
                        <p className="text-[8px] text-slate-500 font-medium font-inter">{resource.lastUpdated}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2.5 text-[10px] text-slate-400 font-semibold font-inter">
                      <div className="flex items-center space-x-1">
                        <Icon name="Download" size={12} />
                        <span>{resource.downloads}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Icon name="Star" size={12} color="#F59E0B" />
                        <span>{resource.rating}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Explore All Resources Button */}
        <div className="text-center mt-12">
          <button
            onClick={() => navigate("/resources-hub")}
            className="inline-flex items-center space-x-2 px-8 py-3.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-inter font-bold text-sm rounded-full transition-all duration-300 hover:scale-105 shadow-[0_0_30px_rgba(99,102,241,0.2)] hover:shadow-[0_0_40px_rgba(99,102,241,0.45)] cursor-pointer"
          >
            <span>Explore All Resources</span>
            <Icon name="ArrowRight" size={16} />
          </button>
        </div>
      </div>
    </motion.section>
  );
};

export default ResourcePreviewGrid;
