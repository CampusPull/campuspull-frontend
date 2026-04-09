import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import { useExplore } from '../../../context/exploreContext'; 

const AlumniSpotlight = () => {
  const navigate = useNavigate();
  
  // ✅ Context Hook for Connection Logic
  const { 
    sendRequest, 
    outgoingRequestIds, 
    acceptedConnectionIds 
  } = useExplore();

  // ✅ State Management
  const [alumniStories, setAlumniStories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Carousel State
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  // Modal & Connection State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [connectionNote, setConnectionNote] = useState("");
  const [isSent, setIsSent] = useState(false);
  const [isSending, setIsSending] = useState(false);

  // ✅ 1. Fallback Static Data (Keeps your site alive if API fails)
  const staticAlumni = [
    {
      _id: "1", // Use simulated MongoIDs for static data
      name: "Swati Yadav",
      currentRole: " IT Project Manager",
      company: "Black Orange",
      companyLogo: "https://images.pexels.com/photos/4164418/pexels-photo-4164418.jpeg?auto=compress&cs=tinysrgb&w=100",
      profileImage: "/assets/images/swati.png",
      university: "ABESIT",
      graduationYear: "2026",
      mentorshipStatus: "Available",
      specialization: ["Management", "Team Work", "Microservices"],
      quote: `The transition from college to corporate wasn't easy, but having the right guidance made all the difference. Now I want to be that bridge for the next generation.`,
      achievements: [
        "Led Team to work on time",
        "Mentored 4+ junior developers",
        <a
  href="https://youtu.be/SH9OT4Sf5g8?si=QUq34LaSQ5LKpiK1"
  target="_blank"
  rel="noopener noreferrer"
  className="flex items-center gap-1 text-red-600 underline hover:text-red-700"
>
  ▶ Watch Podcast
</a>

      ],
      beforeImage: "https://images.pexels.com/photos/3769021/pexels-photo-3769021.jpeg?auto=compress&cs=tinysrgb&w=300",
      journey: {
        college: "Computer Science Student",
        firstJob: "IT Project Manager at Startup(Dehix)",
        current: " Engineer at BlackOrange"
      },
      menteeCount: 5,
      responseTime: "< 2 hours",
      rating: 5.0
    },
     {
      id: 2,
      name: "Ashiya Rana",
      currentRole: "Trainee",
      company: "Erasmith",
      companyLogo: "https://images.pexels.com/photos/4164418/pexels-photo-4164418.jpeg?auto=compress&cs=tinysrgb&w=100",
      profileImage: "/assets/images/ashi.png",
      university: "ABESIT",
      graduationYear: "2026",
      mentorshipStatus: "Available",
      specialization: ["Version Control (Git)", "Team Work", "Corporate Communication"],
      quote: `Being a trainee in a fast-paced tech environment has helped me build strong fundamentals and a problem-solving mindset. Every challenge I face today is shaping me into a better professional for tomorrow.`,
      achievements: [
         "Successfully completed trainee onboarding program",
  "Actively contributed to team tasks and internal projects",
  "Recognized for adaptability and learning attitude",
  "Participated in corporate training and skill development sessions"
      ],
      beforeImage: "https://images.pexels.com/photos/3769021/pexels-photo-3769021.jpeg?auto=compress&cs=tinysrgb&w=300",
      journey: {
        college: "Computer Science Student",
        firstJob: "Internship at CodeCraft Infotech",
        current: " Engineer at Erasmith"
      },
      menteeCount: 5,
      responseTime: "< 2 hours",
      rating: 5.0
    },
    {
      id: 3,
      name: "Riya Sharma",
      currentRole: "Software Tranee",
      company: "Contevolve",
      companyLogo: "https://images.pexels.com/photos/3861958/pexels-photo-3861958.jpeg?auto=compress&cs=tinysrgb&w=100",
      profileImage: "/assets/images/riya.png",
      university: "ABESIT",
      graduationYear: "2026",
      mentorshipStatus: "Available",
      specialization: ["Core Java & OOPs",
  "Data Structures Basics",
  "Frontend Development (HTML, CSS, JavaScript)",
  "REST API Consumption",
  "Debugging & Code Optimization"],
      quote: `Starting my journey as a software trainee has taught me that strong fundamentals and consistency matter more than titles. Every line of code I write today is preparing me for bigger challenges tomorrow.`,
      achievements: [
       "Completed structured software trainee onboarding program",
  "Developed and maintained small frontend modules",
  "Worked with REST APIs under senior developer guidance",
  "Improved debugging and problem-solving skills through live projects",
  <a
  href="https://youtu.be/oJXNEOpPCoI?si=kjDNbsgCwT7jR-2P"
  target="_blank"
  rel="noopener noreferrer"
  className="flex items-center gap-1 text-red-600 underline hover:text-red-700"
>
  ▶ Watch Podcast
</a>
      ],
      
      beforeImage: "https://images.pexels.com/photos/3769021/pexels-photo-3769021.jpeg?auto=compress&cs=tinysrgb&w=300",
      journey: {
        college: "Software Engineering Student",
        firstJob: "Software Developer",
        current: "Software Tranee at Contevovle"
      },
      menteeCount: 4,
      responseTime: "< 4 hours",
      rating: 5.0
    },
    {
      id: 4,
      name: "Samayak Vansh",
      currentRole: "Product Development Intern",
      company: "Black Orange",
      companyLogo: "https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=100",
      profileImage: "https://images.pexels.com/photos/3785079/pexels-photo-3785079.jpeg?auto=compress&cs=tinysrgb&w=400",
      university: "ABESIT",
      graduationYear: "2026",
      mentorshipStatus: "Available",
      specialization: ["Machine Learning", "Deep Learning",],
      quote: `Working as a product development intern has shown me how data and technology come together to build meaningful products. I believe learning fundamentals well and applying them to real problems is the key to long-term growth.`,
      achievements: [
        "Worked on data preprocessing and model training tasks",
        "Running an NGO",
  "Assisted in developing ML-based features for internal products",
   <a
  href="https://youtu.be/BuKWVegZKLI?si=orh4b4Y3xv7S67yP"
  target="_blank"
  rel="noopener noreferrer"
  className="flex items-center gap-1 text-red-600 underline hover:text-red-700"
>
  ▶ Watch Podcast
</a>
  
      ],
      beforeImage: "https://images.pexels.com/photos/3785079/pexels-photo-3785079.jpeg?auto=compress&cs=tinysrgb&w=300",
      journey: {
        college: "Software Student",
        firstJob: "Data Analyst",
        current: "Product Development Intern"
      },
      menteeCount: 18,
      responseTime: "< 1 day",
      rating: 4.9
    }
  ];

  useEffect(() => {
    const fetchAlumni = async () => {
      try {
        // Replace with your real endpoint
        // const { data } = await axios.get('http://localhost:5000/api/alumni/spotlight');
        // setAlumniStories(data);
        
        // For now, simulating API call with static data
        setTimeout(() => {
          setAlumniStories(staticAlumni);
          setIsLoading(false);
        }, 500);
      } catch (error) {
        console.error("Failed to fetch alumni:", error);
        setAlumniStories(staticAlumni); // Fallback
        setIsLoading(false);
      }
    };
    fetchAlumni();
  }, []);

  // ✅ 3. Auto-Play Carousel Effect
  useEffect(() => {
    if (!isAutoPlaying || alumniStories.length === 0) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % alumniStories.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [isAutoPlaying, alumniStories.length]);

  // Navigation Handlers
  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % alumniStories.length);
    setIsAutoPlaying(false);
  };
  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + alumniStories.length) % alumniStories.length);
    setIsAutoPlaying(false);
  };

  const currentAlumni = alumniStories[currentSlide];

  // ✅ 4. Smart Connection Logic
  // Check if current alumni ID exists in our Sets from Context
  const isPending = currentAlumni && outgoingRequestIds.has(currentAlumni._id);
  const isConnected = currentAlumni && acceptedConnectionIds.has(currentAlumni._id);

  const handleConnectClick = () => {
    if (isConnected) {
      // If accepted, maybe go to chat?
      alert(`You are already connected with ${currentAlumni.name}!`);
      return;
    }
    // Pause slider when modal opens
    setIsAutoPlaying(false);
    setIsModalOpen(true);
    setConnectionNote(`Hi ${currentAlumni?.name}, I'm a student at ${currentAlumni?.university}. I'd love to connect and learn from your journey.`);
  };

  const handleSendRequest = async (e) => {
    e.preventDefault();
    setIsSending(true);

    try {
      // ✅ Using the Context Function
      await sendRequest(currentAlumni._id, connectionNote);
      
      setIsSending(false);
      setIsSent(true);
      
      // Close modal after success animation
      setTimeout(() => {
        setIsModalOpen(false);
        setIsSent(false);
        setConnectionNote("");
        setIsAutoPlaying(true); // Resume slider
      }, 2000);

    } catch (error) {
      setIsSending(false);
      alert("Something went wrong. Please try again.");
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-96 bg-surface">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-academic-blue"></div>
      </div>
    );
  }

  if (!currentAlumni) return null;

  return (
    <section className="py-16 bg-gradient-to-br from-surface to-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <div className="absolute top-10 left-10 w-20 h-20 bg-academic-blue rounded-full blur-2xl"></div>
        <div className="absolute bottom-10 right-10 w-32 h-32 bg-achievement-amber rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-poppins font-bold text-wisdom-charcoal mb-4">
            Alumni and Placed Students Success Stories
          </h2>
          <p className="text-xl text-insight-gray font-inter max-w-2xl mx-auto">
            Learn from those who've walked the path before you. Connect with mentors who understand your journey.
          </p>
        </div>

        {/* Main Carousel */}
        <div className="relative">
          <div className="knowledge-card bg-white rounded-2xl shadow-brand-xl border border-slate-100 overflow-hidden">
            <div className="grid lg:grid-cols-2 gap-0">
              
              {/* Left Side - Alumni Profile */}
              <div className="p-8 lg:p-12">
                <div className="flex items-start space-x-4 mb-6">
                  <div className="relative">
                    <div className="w-20 h-20 rounded-full overflow-hidden border-3 border-academic-blue">
                      <Image
                        src={currentAlumni?.profileImage}
                        alt={currentAlumni?.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full overflow-hidden border-2 border-white">
                      <Image
                        src={currentAlumni?.companyLogo}
                        alt={currentAlumni?.company}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                  
                  <div className="flex-1">
                    <h3 className="text-2xl font-poppins font-bold text-wisdom-charcoal mb-1">
                      {currentAlumni?.name}
                    </h3>
                    <p className="text-lg text-academic-blue font-inter font-semibold mb-1">
                      {currentAlumni?.currentRole}
                    </p>
                    <p className="text-insight-gray font-inter">
                      {currentAlumni?.company} • {currentAlumni?.university} '{currentAlumni?.graduationYear}
                    </p>
                  </div>

                  <div className={`px-3 py-1 rounded-full text-xs font-inter font-medium ${
                    currentAlumni?.mentorshipStatus === 'Available' ? 'bg-emerald-50 text-progress-emerald' : 'bg-amber-50 text-achievement-amber'
                  }`}>
                    {currentAlumni?.mentorshipStatus}
                  </div>
                </div>

                {/* Quote */}
                <blockquote className="text-lg text-insight-gray font-inter leading-relaxed mb-6 italic">
                  "{currentAlumni?.quote}"
                </blockquote>

                {/* Specializations */}
                <div className="mb-6">
                  <h4 className="text-sm font-inter font-semibold text-wisdom-charcoal mb-3">Expertise Areas</h4>
                  <div className="flex flex-wrap gap-2">
                    {currentAlumni?.specialization?.map((skill) => (
                      <span key={skill} className="px-3 py-1 bg-academic-blue/10 text-academic-blue text-sm font-inter font-medium rounded-full">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-4 mb-8">
                  <div className="text-center">
                    <div className="text-2xl font-poppins font-bold text-wisdom-charcoal">{currentAlumni?.menteeCount}</div>
                    <div className="text-xs text-insight-gray font-inter">Mentees</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-poppins font-bold text-wisdom-charcoal">{currentAlumni?.rating}</div>
                    <div className="text-xs text-insight-gray font-inter">Rating</div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm font-poppins font-bold text-wisdom-charcoal mt-2">{currentAlumni?.responseTime}</div>
                    <div className="text-xs text-insight-gray font-inter">Response</div>
                  </div>
                </div>

                {/* ✅ Dynamic Connect Button */}
                <button 
                  onClick={handleConnectClick}
                  disabled={isPending}
                  className={`w-full font-inter font-medium py-3 px-6 rounded-lg transition-all duration-300 shadow-brand-md flex items-center justify-center space-x-2 ${
                    isConnected 
                      ? "bg-green-600 hover:bg-green-700 text-white" 
                      : isPending 
                        ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                        : "bg-academic-blue hover:bg-blue-700 text-white hover:shadow-brand-lg"
                  }`}
                >
                  <Icon name={isConnected ? "MessageCircle" : isPending ? "Clock" : "UserPlus"} size={18} />
                  <span>
                    {isConnected ? "Connected" : isPending ? "Request Pending" : "Connect as Mentor"}
                  </span>
                </button>
              </div>

              {/* Right Side - Journey Visualization */}
              <div className="bg-gradient-to-br from-academic-blue/5 to-credibility-indigo/5 p-8 lg:p-12">
                <h4 className="text-xl font-poppins font-bold text-wisdom-charcoal mb-8">Career Journey</h4>
                
                {/* Timeline */}
                <div className="space-y-6 mb-8">
                  {/* College Step */}
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-surface rounded-full flex items-center justify-center">
                      <Icon name="GraduationCap" size={20} color="var(--color-insight-gray)" />
                    </div>
                    <div>
                      <p className="font-inter font-semibold text-wisdom-charcoal">{currentAlumni?.journey?.college}</p>
                      <p className="text-sm text-insight-gray">{currentAlumni?.university}</p>
                    </div>
                  </div>
                  <div className="ml-6 border-l-2 border-dashed border-slate-300 h-8"></div>
                  
                  {/* First Job */}
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-achievement-amber/20 rounded-full flex items-center justify-center">
                      <Icon name="Briefcase" size={20} color="var(--color-achievement-amber)" />
                    </div>
                    <div>
                      <p className="font-inter font-semibold text-wisdom-charcoal">{currentAlumni?.journey?.firstJob}</p>
                      <p className="text-sm text-insight-gray">First Role</p>
                    </div>
                  </div>
                  <div className="ml-6 border-l-2 border-dashed border-slate-300 h-8"></div>
                  
                  {/* Current Job */}
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-academic-blue/20 rounded-full flex items-center justify-center">
                      <Icon name="Trophy" size={20} color="var(--color-academic-blue)" />
                    </div>
                    <div>
                      <p className="font-inter font-semibold text-wisdom-charcoal">{currentAlumni?.journey?.current}</p>
                      <p className="text-sm text-insight-gray">Current Position</p>
                    </div>
                  </div>
                </div>

                {/* Achievements */}
                <div>
                  <h5 className="text-lg font-inter font-semibold text-wisdom-charcoal mb-4">Key Achievements</h5>
                  <div className="space-y-3">
                    {currentAlumni?.achievements?.map((achievement, index) => (
                      <div key={index} className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-progress-emerald rounded-full mt-2 flex-shrink-0"></div>
                        <p className="text-sm text-insight-gray font-inter leading-relaxed">{achievement}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* Navigation Arrows */}
          <button onClick={prevSlide} className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white hover:bg-academic-blue text-academic-blue hover:text-white rounded-full shadow-brand-md transition-all flex items-center justify-center z-10">
            <Icon name="ChevronLeft" size={20} />
          </button>
          <button onClick={nextSlide} className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white hover:bg-academic-blue text-academic-blue hover:text-white rounded-full shadow-brand-md transition-all flex items-center justify-center z-10">
            <Icon name="ChevronRight" size={20} />
          </button>
        </div>

        {/* View All Button */}
        <div className="text-center mt-12">
          <button onClick={() => navigate('/explore')} className="inline-flex items-center space-x-2 px-8 py-3 bg-white hover:bg-academic-blue text-academic-blue hover:text-white border-2 border-academic-blue font-inter font-medium rounded-lg transition-all shadow-brand-md">
            <span>View All Alumni</span>
            <Icon name="Users" size={18} />
          </button>
        </div>
      </div>

      {/* ✅ CONNECTION REQUEST MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl transform transition-all scale-100">
            {!isSent ? (
              <>
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-poppins font-bold text-wisdom-charcoal">Connect with {currentAlumni?.name}</h3>
                  <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                    <Icon name="X" size={20} color="#64748b" />
                  </button>
                </div>

                <div className="flex items-center space-x-3 mb-6 p-3 bg-blue-50 rounded-lg border border-blue-100">
                   <div className="w-10 h-10 rounded-full overflow-hidden">
                     <Image src={currentAlumni?.profileImage} className="w-full h-full object-cover"/>
                   </div>
                   <div>
                     <p className="text-sm font-semibold text-wisdom-charcoal">{currentAlumni?.currentRole}</p>
                     <p className="text-xs text-insight-gray">at {currentAlumni?.company}</p>
                   </div>
                </div>

                <form onSubmit={handleSendRequest}>
                  <label className="block text-sm font-medium text-wisdom-charcoal mb-2">Add a note (recommended)</label>
                  <textarea
                    value={connectionNote}
                    onChange={(e) => setConnectionNote(e.target.value)}
                    className="w-full h-32 p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-academic-blue focus:border-transparent resize-none font-inter text-sm mb-6"
                    placeholder="Tell them why you want to connect..."
                    maxLength={300}
                  />
                  <div className="flex justify-between text-xs text-gray-400 mb-2">
                    <span>{connectionNote.length}/300</span>
                  </div>
                  
                  <div className="flex space-x-3">
                    <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-2.5 border border-slate-300 text-wisdom-charcoal font-medium rounded-lg hover:bg-slate-50 transition-colors">
                      Cancel
                    </button>
                    <button 
                      type="submit" 
                      disabled={isSending}
                      className="flex-1 py-2.5 bg-academic-blue text-white font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-brand-sm flex justify-center items-center"
                    >
                      {isSending ? <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div> : "Send Request"}
                    </button>
                  </div>
                </form>
              </>
            ) : (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
                  <Icon name="Check" size={32} color="#059669" />
                </div>
                <h3 className="text-xl font-bold text-wisdom-charcoal mb-2">Request Sent!</h3>
                <p className="text-insight-gray text-sm">{currentAlumni?.name} will be notified of your request.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
};

export default AlumniSpotlight;