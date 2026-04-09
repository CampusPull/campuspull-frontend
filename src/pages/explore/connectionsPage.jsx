import React from "react";
import { Link, useNavigate } from "react-router-dom"; // ✅ Import Link
import { FaArrowLeft, FaUserCircle, FaLinkedin, FaEnvelope, FaPaperPlane } from "react-icons/fa";
import { useExplore } from "../../context/exploreContext"; 



export default function ConnectionsPage({ onBack }) { // ✅ Accepts onBack prop
  const { connections, loading } = useExplore();

  const navigate = useNavigate();

  return (
    <div className="min-h-screen p-4 md:p-10 bg-gradient-to-br from-pink-50 via-white to-blue-50">
      
      {/* BACK BUTTON */}
      <button
        onClick={() => navigate('/explore')} // ✅ Calls the function passed from Explore.jsx
        className="mb-8 flex items-center gap-2 px-5 py-2.5 bg-white/80 backdrop-blur-md shadow-sm border border-pink-100 text-pink-600 rounded-full font-medium hover:bg-white hover:shadow-md transition-all"
      >
        <FaArrowLeft /> Back to Explore
      </button>

      <div className="flex items-center gap-3 mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Your Connections</h1>
        <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-bold">
            {connections.length}
        </span>
      </div>

      {loading && (
        <div className="flex justify-center items-center h-40">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-pink-500"></div>
        </div>
      )}
      
      {!loading && connections.length === 0 ? (
        <div className="text-center py-20 bg-white/50 rounded-3xl border border-dashed border-gray-300">
            <p className="text-gray-500 text-lg">You haven't made any connections yet.</p>
            <p className="text-sm text-gray-400 mt-2">Go back to "Find People" to start networking!</p>
        </div>
      ) : (
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {connections.map((user) => {
            const imgSrc = user.profileImage 
                ? (user.profileImage.startsWith("http") ? user.profileImage : `${user.profileImage}`) 
                : null;

            return (
                <div key={user._id} className="group relative p-6 bg-white/60 backdrop-blur-xl border border-white/40 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <div className="flex flex-col items-center">
                    
                    {/* CLICKABLE AVATAR -> /user/:id */}
                    <Link to={`/profile/${user._id}`}>
                        <div className="w-24 h-24 rounded-full mb-4 overflow-hidden border-4 border-white shadow-md group-hover:border-pink-100 transition-colors cursor-pointer hover:scale-105 transform duration-300">
                            {imgSrc ? (
                                <img src={imgSrc} alt={user.name} className="w-full h-full object-cover" />
                            ) : (
                                <FaUserCircle className="text-gray-300 text-6xl w-full h-full bg-gray-50" />
                            )}
                        </div>
                    </Link>

                    {/* CLICKABLE NAME -> /user/:id */}
                    <Link to={`/profile/${user._id}`} className="hover:underline decoration-pink-500 underline-offset-2">
                        <h2 className="text-xl font-bold text-gray-800 text-center mb-1 hover:text-pink-600 transition-colors">
                            {user.name}
                        </h2>
                    </Link>
                    
                    <p className="text-sm text-pink-600 font-medium text-center mb-2">{user.role}</p>

                    {(user.college || user.degree) && (
                        <p className="text-xs text-gray-500 text-center mb-3">
                            {user.degree} {user.college ? `• ${user.college}` : ""}
                        </p>
                    )}

                    <div className="flex flex-wrap justify-center gap-1.5 mb-5 w-full">
                        {user.skills && user.skills.slice(0, 3).map((skill) => (
                            <span key={skill} className="px-2 py-0.5 bg-gray-100 text-gray-600 text-[10px] uppercase tracking-wider font-semibold rounded-md">
                                {skill}
                            </span>
                        ))}
                    </div>

                    <div className="flex items-center justify-center gap-4 w-full pt-4 border-t border-gray-100">
                        {user.linkedin && (
                            <a href={user.linkedin} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-blue-600 transition-colors text-xl">
                                <FaLinkedin />
                            </a>
                        )}
                        {user.email && (
                            <a href={`mailto:${user.email}`} className="text-gray-400 hover:text-red-500 transition-colors text-xl">
                                <FaEnvelope />
                            </a>
                        )}
                        <button className="text-gray-400 hover:text-pink-600 transition-colors text-xl">
                            <FaPaperPlane />
                        </button>
                    </div>
                </div>
                </div>
            );
          })}
        </div>
      )}
    </div>
  );
}