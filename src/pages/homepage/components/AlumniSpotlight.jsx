import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../../utils/api';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import { useExplore } from '../../../context/exploreContext'; 
import { motion, AnimatePresence } from 'framer-motion';

const AlumniSpotlight = () => {
  const navigate = useNavigate();
  
  const { 
    sendRequest, 
    outgoingRequestIds, 
    acceptedConnectionIds 
  } = useExplore();

  const [alumniStories, setAlumniStories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [connectionNote, setConnectionNote] = useState("");
  const [isSent, setIsSent] = useState(false);
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    const fetchAlumni = async () => {
      try {
        const { data } = await api.get('/explore/users?role=alumni&limit=10');
        const users = data.data || data.users || data || [];
        setAlumniStories(Array.isArray(users) ? users : []);
      } catch (error) {
        console.error("Failed to fetch alumni:", error);
        setAlumniStories([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchAlumni();
  }, []);

  useEffect(() => {
    if (!isAutoPlaying || alumniStories.length === 0) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % alumniStories.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [isAutoPlaying, alumniStories.length]);

  const nextSlide = () => {
    if (alumniStories.length > 0) {
      setCurrentSlide((prev) => (prev + 1) % alumniStories.length);
      setIsAutoPlaying(false);
    }
  };
  const prevSlide = () => {
    if (alumniStories.length > 0) {
      setCurrentSlide((prev) => (prev - 1 + alumniStories.length) % alumniStories.length);
      setIsAutoPlaying(false);
    }
  };

  const currentAlumni = alumniStories[currentSlide];
  const isPending = currentAlumni && outgoingRequestIds.has(currentAlumni._id);
  const isConnected = currentAlumni && acceptedConnectionIds.has(currentAlumni._id);

  const [mentorshipGoal, setMentorshipGoal] = useState("Career Guidance & Job Prep");
  const [mentorshipMessage, setMentorshipMessage] = useState("");

  const handleConnectClick = async (e) => {
    e.stopPropagation();
    if (isConnected) {
      navigate('/chatPage', { 
        state: { 
          newChat: { 
            id: currentAlumni._id, 
            name: currentAlumni.name, 
            profileImage: currentAlumni.profileImage 
          } 
        } 
      });
      return;
    }
    try {
      await sendRequest(currentAlumni._id);
    } catch (err) {
      console.error("Failed to send connection request", err);
    }
  };

  const handleMentorshipClick = (e) => {
    e.stopPropagation();
    setIsAutoPlaying(false);
    setMentorshipGoal("Career Guidance & Job Prep");
    setMentorshipMessage(`Hi ${currentAlumni?.name || 'Alumni'}, I'm a student at ${currentAlumni?.college || 'University'}. I would love to schedule a mentorship session to get placement preparation guidance.`);
    setIsModalOpen(true);
  };

  const handleSendMentorshipRequest = async (e) => {
    e.preventDefault();
    if (!mentorshipGoal.trim()) return alert("Goal is required");
    setIsSending(true);

    try {
      await api.post("/mentorship/request", {
        mentorId: currentAlumni._id,
        goal: mentorshipGoal.trim(),
        message: mentorshipMessage.trim(),
      });
      setIsSending(false);
      setIsSent(true);
      
      setTimeout(() => {
        setIsModalOpen(false);
        setIsSent(false);
        setMentorshipGoal("Career Guidance & Job Prep");
        setMentorshipMessage("");
        setIsAutoPlaying(true); 
      }, 2000);

    } catch (error) {
      setIsSending(false);
      alert(error.response?.data?.message || "You already have a pending mentorship request with this mentor.");
      setIsModalOpen(false);
      setIsAutoPlaying(true);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-96 bg-slate-50">
        <div className="relative flex justify-center items-center">
          <div className="absolute animate-ping w-16 h-16 rounded-full bg-indigo-200 opacity-75"></div>
          <div className="relative animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
      </div>
    );
  }

  if (!currentAlumni || alumniStories.length === 0) return null;

  const name = currentAlumni.name || 'Alumni Member';
  const currentRole = currentAlumni.designation || currentAlumni.headline || (currentAlumni.experience?.length > 0 ? currentAlumni.experience[0].role : 'Professional');
  const company = currentAlumni.currentCompany || (currentAlumni.experience?.length > 0 ? currentAlumni.experience[0].company : 'Organization');
  const university = currentAlumni.college || (currentAlumni.education?.length > 0 ? currentAlumni.education[0].school : 'University');
  const profileImage = currentAlumni.profileImage || '/avatar.png';
  const bio = currentAlumni.bio || "Passionate about technology and sharing experiences with the community. Let's connect and grow together.";
  const skills = currentAlumni.skills?.length > 0 ? currentAlumni.skills.slice(0, 5) : ["Mentorship", "Leadership", "Technology"];

  return (
    <section className="py-12 bg-slate-950 relative overflow-hidden font-sans">
      
      {/* Subtle Background Glows */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-indigo-500/5 rounded-full blur-[100px] pointer-events-none"></div>
        <div className="absolute -bottom-40 left-10 w-96 h-96 bg-purple-500/5 rounded-full blur-[120px] pointer-events-none"></div>
      </div>

      <div className="max-w-6xl mx-auto px-6 relative z-10">
        
        {/* Header Section */}
        <div className="text-center mb-10">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl sm:text-5xl font-black font-poppins text-white mb-4 tracking-tight"
          >
            Alumni Success Stories
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto font-medium"
          >
            Get inspired by those who've walked the path. Connect directly with mentors shaping the industry.
          </motion.p>
        </div>

        {/* Featured Card */}
        <div className="relative max-w-5xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div 
              key={currentSlide}
              onClick={() => navigate(`/profile/${currentAlumni._id}`)}
              initial={{ opacity: 0, scale: 0.98, filter: "blur(4px)" }}
              animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
              exit={{ opacity: 0, scale: 1.02, filter: "blur(4px)" }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="cursor-pointer bg-white border border-slate-150/80 rounded-[32px] p-8 sm:p-12 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center shadow-lg hover:shadow-2xl transition-all duration-300"
            >
              
              {/* Left Column: Profile Card Info (4 cols) */}
              <div className="lg:col-span-4 flex flex-col items-center lg:items-start text-center lg:text-left border-b lg:border-b-0 lg:border-r border-slate-100 pb-8 lg:pb-0 lg:pr-8">
                {/* Profile Badge & Image */}
                <div className="relative mb-6">
                  <div className="w-28 h-28 rounded-full p-1 border border-slate-200 bg-slate-50 flex items-center justify-center shadow-sm">
                    <img
                      src={profileImage}
                      alt={name}
                      className="w-full h-full object-cover rounded-full"
                    />
                  </div>
                  <div className="absolute -bottom-2 right-1/2 translate-x-1/2 lg:translate-x-0 lg:right-0 bg-emerald-50 text-emerald-700 text-[10px] font-extrabold px-3 py-1 rounded-full border border-emerald-100 shadow-sm flex items-center gap-1">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                    Available
                  </div>
                </div>
                
                <h3 className="text-xl font-extrabold text-slate-900 mb-1 tracking-tight">{name}</h3>
                <p className="text-indigo-600 font-extrabold text-xs tracking-wide uppercase leading-snug">{currentRole}</p>
                <p className="text-slate-500 font-bold text-xs mt-1">{company}</p>
                <p className="text-slate-400 font-extrabold text-[10px] mt-4 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200/50">{university}</p>
              </div>

              {/* Right Column: Bio & Actions (8 cols) */}
              <div className="lg:col-span-8 flex flex-col h-full justify-between lg:pl-4 text-left">
                <div className="space-y-6">
                  {/* Bio/Quote Box */}
                  <div className="relative pl-6 border-l-2 border-indigo-500/30">
                    <span className="absolute -top-3 -left-3.5 text-5xl text-slate-200 font-serif leading-none select-none">“</span>
                    <p className="text-sm sm:text-base text-slate-600 italic leading-relaxed relative z-10 font-semibold">
                      {bio}
                    </p>
                  </div>

                  {/* Skills tags */}
                  <div>
                    <h5 className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-3">Expertise</h5>
                    <div className="flex flex-wrap gap-2">
                      {skills.map((skill, idx) => (
                        <span 
                          key={idx} 
                          className="px-3 py-1.5 bg-slate-50 hover:bg-slate-100 text-slate-600 text-[10px] font-extrabold rounded-xl border border-slate-100 transition-colors"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="mt-8 flex flex-col sm:flex-row gap-3">
                  <button 
                    onClick={handleConnectClick}
                    disabled={isPending}
                    className={`group relative overflow-hidden flex-1 sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-bold text-xs transition-all duration-300 shadow-sm hover:scale-[1.01] ${
                      isConnected 
                        ? "bg-emerald-600 text-white shadow-emerald-600/10" 
                        : isPending 
                          ? "bg-slate-100 text-slate-400 cursor-not-allowed shadow-none"
                          : "bg-slate-900 hover:bg-slate-800 text-white"
                    }`}
                  >
                    <Icon name={isConnected ? "MessageCircle" : isPending ? "Clock" : "UserPlus"} size={14} />
                    <span>
                      {isConnected ? "Chat" : isPending ? "Request Sent" : "Send Request"}
                    </span>
                  </button>

                  <button 
                    onClick={handleMentorshipClick}
                    className="group relative overflow-hidden flex-1 sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-bold text-xs bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-800 transition-all duration-300 hover:scale-[1.01]"
                  >
                    <Icon name="Users" size={14} />
                    <span>Request Mentorship</span>
                  </button>
                </div>
              </div>

            </motion.div>
          </AnimatePresence>

          {/* Floating Navigation Buttons */}
          {alumniStories.length > 1 && (
            <>
              <button 
                onClick={prevSlide} 
                className="absolute left-0 lg:-left-6 top-1/2 -translate-y-1/2 -ml-4 lg:ml-0 w-10 h-10 bg-white hover:bg-slate-50 text-slate-800 rounded-full shadow-md border border-slate-150 transition-all flex items-center justify-center z-20 group cursor-pointer focus:outline-none"
              >
                <Icon name="ChevronLeft" size={18} className="group-hover:-translate-x-0.5 transition-transform" />
              </button>
              <button 
                onClick={nextSlide} 
                className="absolute right-0 lg:-right-6 top-1/2 -translate-y-1/2 -mr-4 lg:mr-0 w-10 h-10 bg-white hover:bg-slate-50 text-slate-800 rounded-full shadow-md border border-slate-150 transition-all flex items-center justify-center z-20 group cursor-pointer focus:outline-none"
              >
                <Icon name="ChevronRight" size={18} className="group-hover:translate-x-0.5 transition-transform" />
              </button>
            </>
          )}

          {/* Carousel Indicators */}
          {alumniStories.length > 1 && (
            <div className="flex justify-center gap-2 mt-8">
              {alumniStories.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setCurrentSlide(idx);
                    setIsAutoPlaying(false);
                  }}
                  className={`h-1 rounded-full transition-all duration-300 ${
                    idx === currentSlide ? "w-6 bg-indigo-500" : "w-1.5 bg-slate-700 hover:bg-slate-600"
                  }`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>
          )}
        </div>

        {/* View All Button */}
        <div className="text-center mt-10">
          <button 
            onClick={() => navigate('/explore')} 
            className="inline-flex items-center space-x-1.5 px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 hover:text-indigo-600 font-bold text-xs rounded-xl transition-all shadow-sm border border-slate-200 hover:border-indigo-200 cursor-pointer focus:outline-none"
          >
            <span>Explore all alumni</span>
            <Icon name="ArrowRight" size={14} />
          </button>
        </div>
      </div>

      {/* Mentorship Request Modal (Minimalist White) */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm"
          >
            <motion.div 
              initial={{ scale: 0.98, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.98, opacity: 0, y: 15 }}
              className="bg-white rounded-3xl w-full max-w-md p-6 sm:p-8 shadow-2xl border border-slate-100 text-slate-700 text-left"
            >
              {!isSent ? (
                <>
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <h3 className="text-lg font-extrabold text-slate-900">Request Mentorship</h3>
                      <p className="text-xs text-slate-500 mt-1">Submit a request to schedule a 1-on-1 session with {name}.</p>
                    </div>
                    <button onClick={() => { setIsModalOpen(false); setIsAutoPlaying(true); }} className="p-2 -mr-2 -mt-2 text-slate-450 hover:bg-slate-100 hover:text-slate-600 rounded-full transition-colors cursor-pointer focus:outline-none">
                      <Icon name="X" size={18} />
                    </button>
                  </div>

                  <form onSubmit={handleSendMentorshipRequest} className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">Mentorship Goal</label>
                      <select
                        value={mentorshipGoal}
                        onChange={(e) => setMentorshipGoal(e.target.value)}
                        className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none text-slate-700 text-xs transition-all font-semibold cursor-pointer"
                      >
                        <option value="Career Guidance & Job Prep">Career Guidance & Job Prep</option>
                        <option value="Resume Review & LinkedIn Polish">Resume Review & LinkedIn Polish</option>
                        <option value="Mock Technical / HR Interview">Mock Technical / HR Interview</option>
                        <option value="Project & Tech Stack Mentoring">Project & Tech Stack Mentoring</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">Personalized Message</label>
                      <textarea
                        value={mentorshipMessage}
                        onChange={(e) => setMentorshipMessage(e.target.value)}
                        className="w-full h-28 p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none resize-none text-slate-700 text-xs font-medium leading-relaxed transition-all"
                        placeholder="Tell the mentor what you would like to discuss..."
                        maxLength={300}
                        required
                      />
                      <div className="flex justify-end text-[9px] text-slate-450 mt-1 font-bold">
                        {mentorshipMessage.length}/300
                      </div>
                    </div>
                    
                    <div className="flex gap-3 pt-2">
                      <button 
                        type="button" 
                        onClick={() => { setIsModalOpen(false); setIsAutoPlaying(true); }} 
                        className="flex-1 py-2.5 bg-white text-slate-600 font-bold rounded-xl hover:bg-slate-50 border border-slate-200 transition-colors text-xs cursor-pointer focus:outline-none"
                      >
                        Cancel
                      </button>
                      <button 
                        type="submit" 
                        disabled={isSending}
                        className="flex-1 py-2.5 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-colors shadow-sm flex justify-center items-center text-xs cursor-pointer focus:outline-none"
                      >
                        {isSending ? <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white/40 border-t-white"></div> : "Submit Request"}
                      </button>
                    </div>
                  </form>
                </>
              ) : (
                <motion.div 
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="text-center py-8"
                >
                  <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-5">
                    <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center animate-bounce">
                      <Icon name="Check" size={24} className="text-emerald-600" />
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-1.5">Request Sent!</h3>
                  <p className="text-slate-500 text-xs max-w-[240px] mx-auto leading-relaxed font-semibold">
                    {name} has been notified and will review your mentorship request shortly.
                  </p>
                </motion.div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default AlumniSpotlight;