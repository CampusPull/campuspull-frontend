import React from "react";
import { Link } from "react-router-dom"; // <--- 1. IMPORT LINK
import { FaArrowLeft, FaUserCircle, FaCheck, FaTimes, FaBriefcase } from "react-icons/fa";
import { useExplore } from "../../context/exploreContext"; 
import { useNavigate } from "react-router-dom";


export default function RequestsPage({ onBack }) {
  const { incomingRequests, acceptRequest, ignoreRequest, loading } = useExplore();

  const navigate = useNavigate();
  return (
    <div className="min-h-screen p-4 md:p-10 bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100">
      
      <div className="max-w-7xl mx-auto">
        <button
            onClick={() => navigate('/explore')}
            className="mb-8 group flex items-center gap-2 px-5 py-2.5 bg-white/60 backdrop-blur-md shadow-sm border border-white/50 text-gray-600 rounded-full font-medium hover:bg-white hover:text-indigo-600 hover:shadow-md transition-all"
        >
            <FaArrowLeft className="group-hover:-translate-x-1 transition-transform"/> Back to Explore
        </button>

        <div className="flex items-center gap-4 mb-8">
            <h1 className="text-3xl font-extrabold text-gray-800">Incoming Requests</h1>
            {incomingRequests.length > 0 && (
                <span className="bg-red-500 text-white text-sm font-bold px-3 py-1 rounded-full shadow-lg">
                    {incomingRequests.length} Pending
                </span>
            )}
        </div>

        {loading && (
            <div className="flex justify-center items-center h-40">
                <div className="animate-spin rounded-full h-10 w-10 border-4 border-indigo-200 border-t-indigo-600"></div>
            </div>
        )}
        
        {!loading && incomingRequests.length === 0 ? (
            <div className="text-center py-20 bg-white/40 backdrop-blur-xl rounded-3xl border border-dashed border-gray-300">
                <p className="text-gray-500 text-xl font-medium">No incoming requests.</p>
                <p className="text-sm text-gray-400 mt-2">You are all caught up!</p>
            </div>
        ) : (
            <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {incomingRequests.map((req) => {
                const user = req.requester;
                if (!user) return null;

                const imgSrc = user.profileImage 
                    ? (user.profileImage.startsWith("http") ? user.profileImage : `${BASE_URL}${user.profileImage}`) 
                    : null;

                return (
                    <div
                    key={req._id} 
                    className="group relative p-6 bg-white/70 backdrop-blur-xl border border-white/50 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                    >
                    <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 mb-5">
                        
                        {/* ✅ 2. CLICKABLE IMAGE */}
                        <Link to={`/profile/${user._id}`} className="flex-shrink-0">
                            <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-white shadow-md bg-gray-50 cursor-pointer hover:scale-105 transition-transform">
                                {imgSrc ? (
                                    <img src={imgSrc} alt={user.name} className="w-full h-full object-cover" />
                                ) : (
                                    <FaUserCircle className="text-indigo-200 text-5xl w-full h-full p-1" />
                                )}
                            </div>
                        </Link>

                        <div className="text-center sm:text-left">
                            
                            {/* ✅ 3. CLICKABLE NAME */}
                            <Link to={`/profile/${user._id}`} className="hover:underline decoration-indigo-500 underline-offset-2">
                                <h2 className="text-lg font-bold text-gray-800 hover:text-indigo-700 transition-colors">
                                    {user.name}
                                </h2>
                            </Link>

                            <p className="text-sm text-indigo-600 font-medium flex items-center justify-center sm:justify-start gap-1">
                                <FaBriefcase size={12} className="opacity-80"/> {user.role || "Student"}
                            </p>
                            
                            <div className="flex flex-wrap justify-center sm:justify-start gap-1 mt-2">
                                {user.skills && user.skills.slice(0, 2).map((skill, i) => (
                                    <span key={i} className="text-[10px] bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-md uppercase font-bold tracking-wider border border-indigo-100">
                                        {skill}
                                    </span>
                                ))}
                                {user.skills && user.skills.length > 2 && <span className="text-[10px] text-gray-400 font-medium">+{user.skills.length - 2}</span>}
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-3 pt-4 border-t border-gray-100">
                        <button
                            onClick={() => acceptRequest(req._id)} 
                            className="flex-1 px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-semibold shadow-md hover:shadow-lg hover:from-green-600 hover:to-emerald-700 transition-all flex items-center justify-center gap-2"
                        >
                            <FaCheck size={14} /> Accept
                        </button>
                        <button
                            onClick={() => ignoreRequest(req._id)} 
                            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-600 border border-gray-200 rounded-xl font-semibold transition-all flex items-center justify-center gap-2"
                        >
                            <FaTimes size={14} /> Ignore
                        </button>
                    </div>
                    </div>
                );
            })}
            </div>
        )}
      </div>
    </div>
  );
}