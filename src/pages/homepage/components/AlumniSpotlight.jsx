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
  const currentRole = currentAlumni.headline || currentAlumni.experience?.[0]?.role || 'Professional';
  const company = currentAlumni.currentCompany || currentAlumni.experience?.[0]?.company || 'Organization';
  const university = currentAlumni.college || 'University';
  const profileImage = currentAlumni.profileImage || '/avatar.png';
  const bio = currentAlumni.bio || "Passionate about technology and sharing experiences with the community. Let's connect and grow together.";
  const skills = currentAlumni.skills?.length > 0 ? currentAlumni.skills.slice(0, 5) : ["Mentorship", "Leadership", "Technology"];
  const journeyCollege = currentAlumni.education?.[0]?.degree || "Student";
  const journeyFirstJob = currentAlumni.experience?.[currentAlumni.experience?.length - 1]?.role || "First Role";

  return (
    <section className="py-24 bg-slate-50 relative overflow-hidden font-sans">
      {/* Premium Background Elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-indigo-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
        <div className="absolute top-40 -left-40 w-96 h-96 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-40 left-1/2 w-96 h-96 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header Section */}
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 mb-4 tracking-tight"
          >
            Alumni Success Stories
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto"
          >
            Get inspired by those who've walked the path. Connect directly with mentors shaping the industry.
          </motion.p>
        </div>

        {/* Featured Glassmorphism Card */}
        <div className="relative max-w-5xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div 
              key={currentSlide}
              onClick={() => navigate(`/profile/${currentAlumni._id}`)}
              initial={{ opacity: 0, scale: 0.95, filter: "blur(10px)" }}
              animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
              exit={{ opacity: 0, scale: 1.05, filter: "blur(10px)" }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="cursor-pointer bg-white/70 backdrop-blur-2xl rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/80 p-8 sm:p-12 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center"
            >
              
              {/* Left Content Area (8 cols) */}
              <div className="lg:col-span-7 flex flex-col h-full justify-center">
                {/* Profile Badge & Image */}
                <div className="flex flex-col sm:flex-row sm:items-center gap-6 mb-8">
                  <div className="relative">
                    <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full p-1 bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500">
                      <Image
                        src={profileImage}
                        alt={name}
                        className="w-full h-full object-cover rounded-full border-4 border-white"
                      />
                    </div>
                    <div className="absolute -bottom-2 -right-2 bg-emerald-100 text-emerald-700 text-xs font-bold px-3 py-1 rounded-full border-2 border-white shadow-sm flex items-center gap-1">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                      Available
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-1">{name}</h3>
                    <p className="text-indigo-600 font-semibold text-lg">{currentRole}</p>
                    <p className="text-slate-500 font-medium">{company}</p>
                  </div>
                </div>

                {/* Quote Box */}
                <div className="relative mb-8 pl-6 border-l-4 border-indigo-200">
                  <span className="absolute -top-4 -left-3 text-5xl text-indigo-100 font-serif leading-none">"</span>
                  <p className="text-lg sm:text-xl text-slate-700 italic leading-relaxed relative z-10">
                    {bio}
                  </p>
                </div>

                {/* Skills */}
                <div className="mb-10">
                  <div className="flex flex-wrap gap-2">
                    {skills.map((skill, idx) => (
                      <span 
                        key={idx} 
                        className="px-4 py-1.5 bg-slate-100/80 hover:bg-indigo-50 text-slate-700 hover:text-indigo-700 text-sm font-medium rounded-full transition-colors border border-slate-200/60"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                 {/* Action Buttons */}
                <div className="mt-auto flex flex-col sm:flex-row gap-3">
                  <button 
                    onClick={handleConnectClick}
                    disabled={isPending}
                    className={`group relative overflow-hidden flex-1 sm:w-auto inline-flex items-center justify-center gap-2.5 px-6 py-3 rounded-xl font-semibold transition-all duration-300 shadow-sm hover:shadow hover:-translate-y-0.5 ${
                      isConnected 
                        ? "bg-emerald-500 text-white shadow-emerald-500/25" 
                        : isPending 
                          ? "bg-slate-200 text-slate-500 cursor-not-allowed shadow-none"
                          : "bg-slate-900 text-white shadow-slate-900/20 hover:bg-slate-800"
                    }`}
                  >
                    <Icon name={isConnected ? "MessageCircle" : isPending ? "Clock" : "UserPlus"} size={16} />
                    <span>
                      {isConnected ? "Chat" : isPending ? "Request Sent" : "Send Request"}
                    </span>
                  </button>

                  <button 
                    onClick={handleMentorshipClick}
                    className="group relative overflow-hidden flex-1 sm:w-auto inline-flex items-center justify-center gap-2.5 px-6 py-3 rounded-xl font-semibold bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white transition-all duration-300 shadow-md hover:shadow-lg hover:-translate-y-0.5"
                  >
                    <Icon name="Users" size={16} />
                    <span>Request Mentorship</span>
                  </button>
                </div>
              </div>

              {/* Right Content Area: Journey Track (5 cols) */}
              <div className="lg:col-span-5 bg-gradient-to-b from-indigo-50/50 to-purple-50/50 rounded-3xl p-6 sm:p-8 border border-white shadow-inner h-full flex flex-col justify-center">
                <h4 className="text-sm font-bold text-indigo-400 uppercase tracking-widest mb-6">Career Journey</h4>
                
                <div className="relative">
                  {/* Vertical Line */}
                  <div className="absolute left-6 top-6 bottom-6 w-0.5 bg-gradient-to-b from-indigo-200 via-purple-200 to-transparent"></div>
                  
                  {/* Step 1 */}
                  <div className="relative flex gap-5 mb-8 group">
                    <div className="relative z-10 w-12 h-12 bg-white rounded-2xl shadow-sm border border-indigo-100 flex items-center justify-center shrink-0 group-hover:scale-110 group-hover:border-indigo-300 transition-transform">
                      <Icon name="GraduationCap" size={20} className="text-indigo-500" />
                    </div>
                    <div className="pt-2">
                      <h5 className="text-base font-bold text-slate-900 leading-tight">{journeyCollege}</h5>
                      <p className="text-sm text-slate-500">{university}</p>
                    </div>
                  </div>

                  {/* Step 2 */}
                  <div className="relative flex gap-5 mb-8 group">
                    <div className="relative z-10 w-12 h-12 bg-white rounded-2xl shadow-sm border border-purple-100 flex items-center justify-center shrink-0 group-hover:scale-110 group-hover:border-purple-300 transition-transform">
                      <Icon name="Briefcase" size={20} className="text-purple-500" />
                    </div>
                    <div className="pt-2">
                      <h5 className="text-base font-bold text-slate-900 leading-tight">{journeyFirstJob}</h5>
                      <p className="text-sm text-slate-500">First Role</p>
                    </div>
                  </div>

                  {/* Step 3 (Current) */}
                  <div className="relative flex gap-5 group">
                    <div className="relative z-10 w-12 h-12 bg-slate-900 rounded-2xl shadow-md border border-slate-700 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                      <Icon name="Star" size={20} className="text-amber-400" />
                    </div>
                    <div className="pt-2">
                      <h5 className="text-base font-bold text-slate-900 leading-tight">{currentRole}</h5>
                      <p className="text-sm text-indigo-600 font-medium">{company}</p>
                    </div>
                  </div>
                </div>
              </div>

            </motion.div>
          </AnimatePresence>

          {/* Floating Navigation Buttons */}
          {alumniStories.length > 1 && (
            <>
              <button 
                onClick={prevSlide} 
                className="absolute left-0 lg:-left-6 top-1/2 -translate-y-1/2 -ml-4 lg:ml-0 w-12 h-12 bg-white/90 backdrop-blur-sm text-slate-800 hover:text-indigo-600 hover:bg-white rounded-full shadow-[0_4px_20px_rgb(0,0,0,0.1)] border border-slate-100 transition-all flex items-center justify-center z-20 group"
              >
                <Icon name="ChevronLeft" size={20} className="group-hover:-translate-x-0.5 transition-transform" />
              </button>
              <button 
                onClick={nextSlide} 
                className="absolute right-0 lg:-right-6 top-1/2 -translate-y-1/2 -mr-4 lg:mr-0 w-12 h-12 bg-white/90 backdrop-blur-sm text-slate-800 hover:text-indigo-600 hover:bg-white rounded-full shadow-[0_4px_20px_rgb(0,0,0,0.1)] border border-slate-100 transition-all flex items-center justify-center z-20 group"
              >
                <Icon name="ChevronRight" size={20} className="group-hover:translate-x-0.5 transition-transform" />
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
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    idx === currentSlide ? "w-8 bg-indigo-600" : "w-2 bg-slate-300 hover:bg-slate-400"
                  }`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>
          )}
        </div>

        {/* View All Button */}
        <div className="text-center mt-16">
          <button 
            onClick={() => navigate('/explore')} 
            className="inline-flex items-center space-x-2 px-6 py-2.5 bg-white text-slate-700 hover:text-indigo-600 font-semibold rounded-full transition-all shadow-sm border border-slate-200 hover:border-indigo-200 hover:shadow-md"
          >
            <span>Explore all alumni</span>
            <Icon name="ArrowRight" size={16} />
          </button>
        </div>
      </div>

      {/* Mentorship Request Modal (Glassmorphism) */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm"
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="bg-white rounded-3xl w-full max-w-md p-6 sm:p-8 shadow-2xl border border-slate-100"
            >
              {!isSent ? (
                <>
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <h3 className="text-xl font-bold text-slate-900">Request Mentorship from {name}</h3>
                      <p className="text-sm text-slate-500 mt-1">Get 1-on-1 career coaching and advice.</p>
                    </div>
                    <button onClick={() => { setIsModalOpen(false); setIsAutoPlaying(true); }} className="p-2 -mr-2 -mt-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600 rounded-full transition-colors">
                      <Icon name="X" size={20} />
                    </button>
                  </div>

                  <form onSubmit={handleSendMentorshipRequest} className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-1.5">Mentorship Goal</label>
                      <select
                        value={mentorshipGoal}
                        onChange={(e) => setMentorshipGoal(e.target.value)}
                        className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none text-slate-700 text-sm transition-all font-medium"
                      >
                        <option value="Career Guidance & Job Prep">Career Guidance & Job Prep</option>
                        <option value="Resume Review & LinkedIn Polish">Resume Review & LinkedIn Polish</option>
                        <option value="Mock Technical / HR Interview">Mock Technical / HR Interview</option>
                        <option value="Project & Tech Stack Mentoring">Project & Tech Stack Mentoring</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-1.5">Personalized Message</label>
                      <textarea
                        value={mentorshipMessage}
                        onChange={(e) => setMentorshipMessage(e.target.value)}
                        className="w-full h-28 p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none resize-none text-slate-700 text-sm transition-all"
                        placeholder="Tell the mentor what you would like to discuss..."
                        maxLength={300}
                        required
                      />
                      <div className="flex justify-end text-[10px] text-slate-400 mt-1 font-semibold">
                        {mentorshipMessage.length}/300
                      </div>
                    </div>
                    
                    <div className="flex gap-3 pt-2">
                      <button 
                        type="button" 
                        onClick={() => { setIsModalOpen(false); setIsAutoPlaying(true); }} 
                        className="flex-1 py-3 bg-white text-slate-600 font-semibold rounded-xl hover:bg-slate-50 border border-slate-200 transition-colors text-sm"
                      >
                        Cancel
                      </button>
                      <button 
                        type="submit" 
                        disabled={isSending}
                        className="flex-1 py-3 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-600/20 flex justify-center items-center text-sm"
                      >
                        {isSending ? <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white/40 border-t-white"></div> : "Submit Request"}
                      </button>
                    </div>
                  </form>
                </>
              ) : (
                <motion.div 
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="text-center py-10"
                >
                  <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-6">
                    <div className="w-14 h-14 bg-emerald-100 rounded-full flex items-center justify-center animate-bounce">
                      <Icon name="Check" size={28} className="text-emerald-600" />
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-2">Request Sent!</h3>
                  <p className="text-slate-500 text-sm max-w-[250px] mx-auto leading-relaxed">
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