import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../../utils/api";

const TeamProfiles = () => {
  const navigate = useNavigate();
  const [dynamicTeam, setDynamicTeam] = useState([]);
  const [loading, setLoading] = useState(true);
  const [imageErrors, setImageErrors] = useState({});
  const [alertMessage, setAlertMessage] = useState("");

  const staticTeam = [
    { 
      name: "Satyam Sagar", 
      role: "The Hacker", 
      image: "/assets/images/satyam.jpg",
      emails: ["satyamsagar311@gmail.com"]
    },
    { 
      name: "Zaid", 
      role: "The Hustler", 
      image: "/assets/images/zaid.jpg",
      emails: []
    },
    { 
      name: "Sanskriti", 
      role: "The Scout", 
      image: "/assets/images/myphoto.jpg",
      emails: []
    },
    { 
      name: "Sakshi Sharma", 
      role: "The Curator", 
      image: "/assets/images/sakshi.jpg",
      emails: []
    },
    { 
      name: "Shoiab", 
      role: "The Storyteller", 
      image: "/assets/images/shoiab.jpg",
      emails: []
    },
    { 
      name: "Shreyanshu", 
      role: "Frontend Engineer", 
      image: "/assets/images/Shreyanshu.jpeg",
      emails: ["k.shreyanshugupta@gmail.com", "shreyanshu9472@gmail.com"]
    },
    { 
      name: "Sakshi Pathak", 
      role: "Backend Engineer", 
      image: "/assets/images/sakshi-pathak.jpg",
      emails: []
    },
    { 
      name: "Abhinav Tomar", 
      role: "Social Manager", 
      image: "/assets/images/abhinav.jpg",
      emails: []
    },
  ];

  useEffect(() => {
    const fetchTeamProfiles = async () => {
      try {
        // Fetch public explore users
        const res = await api.get("/explore/users?limit=100");
        const registeredUsers = res.data?.data || res.data?.users || [];
        
        const updated = staticTeam.map(member => {
          // 1. Try to find user dynamically by email address
          let found = null;
          if (member.emails && member.emails.length > 0) {
            found = registeredUsers.find(u => 
              u.email && member.emails.some(email => email.toLowerCase() === u.email.toLowerCase())
            );
          }
          
          // 2. If not found by email, try matching by name
          if (!found) {
            found = registeredUsers.find(u => 
              u.name.toLowerCase().includes(member.name.toLowerCase()) || 
              member.name.toLowerCase().includes(u.name.toLowerCase())
            );
          }
          
          if (found) {
            return {
              ...member,
              id: found._id,
              isRegistered: true,
              image: found.profileImage || member.image
            };
          }
          
          return {
            ...member,
            isRegistered: false
          };
        });
        
        setDynamicTeam(updated);
      } catch (err) {
        console.error("Error loading dynamic team profiles:", err);
        // Fallback to static mapping (unregistered)
        setDynamicTeam(staticTeam.map(m => ({
          ...m,
          id: null,
          isRegistered: false
        })));
      } finally {
        setLoading(false);
      }
    };
    
    fetchTeamProfiles();
  }, []);

  const handleCardClick = (member) => {
    if (member.isRegistered && member.id) {
      navigate(`/profile/${member.id}`);
    } else {
      setAlertMessage(`💡 ${member.name} is yet to register their CampusPull profile. We will notify you once they join!`);
      setTimeout(() => setAlertMessage(""), 4000);
    }
  };

  const getInitialsAvatar = (name) => {
    const parts = name.split(" ");
    const initials = parts.map(p => p[0]).join("").substring(0, 2).toUpperCase();
    const hash = name.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const gradients = [
      "from-pink-500 to-rose-500",
      "from-indigo-500 to-blue-500",
      "from-purple-500 to-indigo-500",
      "from-amber-500 to-orange-500",
      "from-teal-500 to-emerald-500",
      "from-sky-500 to-indigo-500",
    ];
    const grad = gradients[hash % gradients.length];
    return (
      <div className={`w-full h-full bg-gradient-to-tr ${grad} flex items-center justify-center text-white font-extrabold text-2xl tracking-wider uppercase`}>
        {initials}
      </div>
    );
  };

  const teamList = dynamicTeam.length > 0 ? dynamicTeam : staticTeam;

  return (
    <section className="mb-20 px-4">
      <div className="max-w-3xl mx-auto text-center mb-12">
        <h2 className="text-4xl font-extrabold text-slate-800 tracking-tight mb-4 flex items-center justify-center gap-2">
          Meet Our Team <span className="animate-pulse">👩‍💻👨‍💻</span>
        </h2>
        <p className="text-slate-500 text-lg font-medium leading-relaxed">
          The builders, curators, and visionaries working to bridge the gap between academic learning and professional success.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
        {teamList.map((member, index) => {
          const hasError = imageErrors[member.name] || !member.image || member.image.includes("satyam.jpg") || member.image.includes("zaid.jpg") || member.image.includes("shoiab.jpg") || member.image.includes("sakshi-pathak.jpg") || member.image.includes("abhinav.jpg");
          
          return (
            <div
              key={index}
              onClick={() => handleCardClick(member)}
              className="bg-white border border-indigo-50/70 rounded-3xl p-6 text-center transform transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_20px_50px_rgba(99,102,241,0.08)] flex flex-col items-center justify-between cursor-pointer relative overflow-hidden group min-h-[300px]"
            >
              {/* Glowing top line on card hover */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              
              {/* Dynamic registration status indicator */}
              <div className="absolute top-4 right-4 flex items-center gap-1.5 bg-slate-50 px-2 py-0.5 rounded-full border border-slate-100/50">
                {member.isRegistered ? (
                  <span className="flex h-2 w-2 relative">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                  </span>
                ) : (
                  <span className="h-1.5 w-1.5 rounded-full bg-slate-300"></span>
                )}
                <span className="text-[9px] font-extrabold tracking-wider uppercase text-slate-400">
                  {member.isRegistered ? "Active" : "Soon"}
                </span>
              </div>

              <div className="w-full flex flex-col items-center">
                {/* Premium Gradient Ring + Image container */}
                <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 p-[3px] shadow-lg mb-5 group-hover:scale-105 transition-transform duration-300">
                  <div className="w-full h-full rounded-full overflow-hidden bg-slate-100 flex items-center justify-center">
                    {hasError ? (
                      getInitialsAvatar(member.name)
                    ) : (
                      <img
                        src={member.image}
                        alt={member.name}
                        className="w-full h-full object-cover"
                        onError={() => setImageErrors(prev => ({ ...prev, [member.name]: true }))}
                      />
                    )}
                  </div>
                </div>

                {/* Name & Role */}
                <h3 className="text-lg font-extrabold text-slate-800 mb-1 group-hover:text-indigo-600 transition-colors">
                  {member.name}
                </h3>
                <p className="text-xs font-bold text-indigo-600 mb-2 uppercase tracking-widest font-inter">
                  {member.role || "Team Member"}
                </p>
                <p className="text-[11px] text-slate-400 max-w-[200px] mx-auto leading-relaxed mt-1 font-medium font-inter">
                  {member.isRegistered ? "Click to view campus profile, connections & activity." : "Campus profile is currently in setup mode."}
                </p>
              </div>

              {/* Dynamic bottom action label */}
              <div className="mt-6 w-full pt-4 border-t border-slate-50 flex items-center justify-center">
                {member.isRegistered ? (
                  <span className="inline-flex items-center gap-1 text-xs font-bold text-indigo-600 group-hover:text-indigo-700 transition-colors">
                    View Profile 
                    <svg className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-[10px] font-extrabold tracking-wider uppercase text-slate-300">
                    Pending Register
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Floating Animated Slide-in Toast */}
      {alertMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 border border-slate-800 text-white px-5 py-3.5 rounded-2xl shadow-2xl flex items-center gap-3 animate-bounce shadow-slate-950/20 max-w-sm">
          <p className="text-xs font-bold leading-relaxed">{alertMessage}</p>
          <button 
            onClick={() => setAlertMessage("")} 
            className="text-slate-400 hover:text-white font-extrabold text-sm ml-2"
          >
            &times;
          </button>
        </div>
      )}
    </section>
  );
};

export default TeamProfiles;
