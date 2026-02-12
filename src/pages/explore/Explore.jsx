import React from "react"; 
import { Link, useNavigate } from "react-router-dom"; // ✅ 1. Import useNavigate
import {
  FaSearch,
  FaUserCircle,
  FaLinkedin,
  FaEnvelope,
  FaUserPlus,
  FaUsers,
  FaCheck,
  FaBriefcase,
  FaArrowDown
} from "react-icons/fa";
import { useExplore } from "../../context/exploreContext"; 
import { useAuth } from "../../context/AuthContext"; 


export default function Explore() {
  const { 
    suggestions, 
    search, 
    setSearch, 
    loading, 
    loadingMore, 
    hasMore,     
    loadMoreSuggestions,
    error, 
    sendRequest, 
    incomingRequests, 
    outgoingRequestIds, 
    connectionCount,
    activeRole,
    setActiveRole
  } = useExplore();

  const navigate = useNavigate(); 
  
  const handleFilterClick = (role) => {
    setActiveRole(role);
  };

  const roles = ["all", "student", "teacher", "alumni"];

  const displayedUsers = suggestions;


  return (
    <div className="min-h-screen p-4 md:p-10 bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100">
      
      {/* --- HEADER --- */}
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center mb-8 gap-6">
        <div>
          <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
            Explore Network
          </h1>
          <p className="text-gray-600 mt-2 font-medium">Connect with students & mentors around you.</p> 
        </div>

        <div className="flex gap-4">
          {/* Requests Button */}
          <button
            onClick={() => navigate('/requests')} // ✅ 3. Real Navigation
            className="relative px-6 py-3 bg-white/80 backdrop-blur-md hover:bg-white border border-white/40 text-indigo-700 rounded-2xl font-semibold shadow-sm flex items-center gap-2 transition-all hover:scale-105"
          >
            <FaUserPlus className="text-lg"/> Requests
            {incomingRequests?.length > 0 && (
               <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold h-6 w-6 flex items-center justify-center rounded-full border-2 border-white shadow-sm">
                 {incomingRequests.length}
               </span>
            )}
          </button>
          
          {/* Connections Button */}
          <button
            onClick={() => navigate('/connections')} // ✅ 4. Real Navigation
            className="relative px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-2xl font-semibold shadow-md flex items-center gap-2 transition-all hover:shadow-lg hover:scale-105"
          >
            <FaUsers className="text-lg"/> Connections
            {connectionCount > 0 && (
               <span className="bg-white/20 text-white text-xs font-bold px-2 py-0.5 rounded-full ml-2 border border-white/20">
                 {connectionCount}
               </span>
            )}
          </button>
        </div>
      </div>

      {/* --- SEARCH BAR --- */}
      <div className="max-w-7xl mx-auto flex justify-center mb-10">
        <div className="relative w-full max-w-2xl group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <FaSearch className="text-gray-400 group-focus-within:text-indigo-500 transition-colors" />
            </div>
            <input
                type="text"
                placeholder="Search by name, role, or skills..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-11 pr-5 py-4 bg-white/70 backdrop-blur-xl border border-white/50 rounded-2xl shadow-sm focus:ring-4 focus:ring-indigo-200 focus:outline-none focus:bg-white transition-all text-gray-700 placeholder-gray-500 text-lg"
            />
        </div>
      </div>
      {/* --- FILTER BAR (NEW SECTION) --- */}
      <div className="max-w-7xl mx-auto flex flex-wrap justify-center gap-3 mb-10">
        {roles.map((role) => (
          <button
            key={role}
            onClick={() => handleFilterClick(role)}
            className={`px-6 py-2 rounded-full font-bold capitalize transition-all duration-300 border-2 ${
              activeRole === role
                ? "bg-indigo-600 text-white border-indigo-600 shadow-lg scale-105"
                : "bg-white/50 text-indigo-600 border-white/20 hover:bg-white hover:border-indigo-300"
            }`}
          >
            {role === "all" ? "🌍 Everyone" : role}
          </button>
        ))}
      </div>

      {/* --- GRID --- */}
      <div className="max-w-7xl mx-auto">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            <span className="w-1.5 h-8 bg-indigo-500 rounded-full inline-block"></span>
            {search ? `Search Results (${displayedUsers.length})` : "Suggested for you"}
        </h2>

        {loading && (
            <div className="flex justify-center items-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-200 border-t-indigo-600"></div>
            </div>
        )}
        
        {error && <p className="text-center text-red-500 mt-6 bg-red-50 p-4 rounded-xl border border-red-100">{error}</p>}

        {!loading && !error && (
            <>
              <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {displayedUsers.length > 0 ? (
                  displayedUsers.map((user) => (
                  <UserCard 
                      key={user._id} 
                      cardUser={user} 
                      sendRequest={sendRequest} 
                      outgoingRequestIds={outgoingRequestIds} 
                  />
                  ))
              ) : (
                  <div className="col-span-full text-center py-20 bg-white/40 backdrop-blur-md rounded-3xl border border-dashed border-gray-300">
                      <p className="text-gray-500 text-xl font-medium">No profiles found.</p>
                      <p className="text-gray-400 mt-2">Try searching for something else!</p>
                  </div>
              )}
              </div>

              {/* ✅ LOAD MORE BUTTON SECTION */}
              {hasMore && (
                <div className="mt-12 flex justify-center pb-10">
                  <button
                    onClick={loadMoreSuggestions}
                    disabled={loadingMore}
                    className="flex items-center gap-2 px-8 py-3 bg-white border border-indigo-200 text-indigo-600 font-bold rounded-2xl shadow-sm hover:bg-indigo-50 hover:border-indigo-400 transition-all disabled:opacity-50"
                  >
                    {loadingMore ? (
                      <div className="animate-spin h-5 w-5 border-2 border-indigo-600 border-t-transparent rounded-full"></div>
                    ) : (
                      <FaArrowDown />
                    )}
                    {loadingMore ? "Loading..." : "Load More Suggestions"}
                  </button>
                </div>
              )}
            </>
        )}
      </div>
    </div>
  );
}

// --- CARD COMPONENT ---
const UserCard = ({ cardUser, sendRequest, outgoingRequestIds }) => { 
  const { acceptedConnectionIds, incomingRequests } = useExplore();
  const { user: loggedInUser } = useAuth(); 

  if (loggedInUser?._id === cardUser._id) return null; 

  const isConnected = acceptedConnectionIds.has(cardUser._id);
  const isRequestSent = outgoingRequestIds.has(cardUser._id);
  const hasIncomingRequest = incomingRequests.some(req => req.requester._id === cardUser._id);

  const profileImageUrl = cardUser.profileImage?.startsWith("http") ? cardUser.profileImage : cardUser.profileImage;
  const imgSrc = cardUser.profileImage ? profileImageUrl : null;

  let buttonContent = <><FaUserPlus /> Connect</>;
  let buttonDisabled = false;
  let buttonClasses = "bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-200";

  if (isConnected) {
    buttonContent = "Connected";
    buttonDisabled = true;
    buttonClasses = "bg-gray-100 text-gray-500 cursor-not-allowed border border-gray-200 shadow-none";
  } else if (isRequestSent) {
    buttonContent = <><FaCheck /> Sent</>;
    buttonDisabled = true;
    buttonClasses = "bg-green-50 text-green-600 border border-green-200 cursor-not-allowed shadow-none";
  } else if (hasIncomingRequest) {
    buttonContent = "Pending Request"; 
    buttonDisabled = true;
    buttonClasses = "bg-orange-50 text-orange-600 border border-orange-200 cursor-not-allowed shadow-none";
  }

  return (
      <div className="bg-white/70 backdrop-blur-xl border border-white/50 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 p-6 flex flex-col items-center group">
        
        {/* --- CLICKABLE IMAGE --- */}
        <div className="relative">
            <Link to={`/profile/${cardUser._id}`}>
                <div className="w-24 h-24 rounded-full mb-4 overflow-hidden border-4 border-white shadow-md group-hover:scale-105 transition-transform bg-gray-50 cursor-pointer">
                {imgSrc ? (
                    <img src={imgSrc} alt={cardUser.name} className="w-full h-full object-cover" />
                ) : (
                    <FaUserCircle className="text-indigo-200 text-7xl w-full h-full p-2" />
                )}
                </div>
            </Link>
        </div>

        {/* --- CLICKABLE NAME --- */}
        <Link to={`/profile/${cardUser._id}`} className="hover:underline decoration-indigo-500 underline-offset-4">
            <h2 className="text-lg font-bold text-gray-800 text-center hover:text-indigo-600 transition-colors">
                {cardUser.name}
            </h2>
        </Link>

        <p className="text-sm text-indigo-600 font-medium text-center mb-2 flex items-center justify-center gap-1">
            <FaBriefcase size={12} className="opacity-70"/> {cardUser.role || "Student"}
        </p>

        <p className="text-sm text-gray-500 text-center mb-4 px-2 line-clamp-2 min-h-[40px] leading-relaxed">
          {cardUser.bio || "No bio available."}
        </p>

        <div className="flex flex-wrap justify-center gap-1.5 mb-6 w-full">
           {(cardUser.skills && cardUser.skills.length > 0) ? (
             cardUser.skills.slice(0, 3).map((skill) => (
                <span key={skill} className="px-2.5 py-1 bg-indigo-50 text-indigo-700 text-[10px] uppercase tracking-wider font-bold rounded-lg border border-indigo-100">
                    {skill}
                </span>
             ))
           ) : <span className="text-xs text-gray-400 italic">No skills</span>}
        </div>
        
        <div className="flex items-center justify-center gap-4 mb-5 w-full border-t border-gray-100 pt-4"> 
          {cardUser.email && (
            <a href={`mailto:${cardUser.email}`} className="text-gray-400 hover:text-indigo-600 text-xl transition-colors"><FaEnvelope /></a>
          )}
          {cardUser.linkedin && (
            <a href={cardUser.linkedin} target="_blank" rel="noreferrer" className="text-gray-400 hover:text-blue-600 text-xl transition-colors"><FaLinkedin /></a>
          )}
        </div>

        <button
          className={`mt-auto w-full py-2.5 rounded-xl font-semibold text-sm transition-all flex items-center justify-center gap-2 shadow-md hover:shadow-lg ${buttonClasses}`}
          disabled={buttonDisabled}
          onClick={(e) => { 
              e.stopPropagation(); // Prevents clicking the button from triggering any parent clicks
              if (!buttonDisabled) sendRequest(cardUser._id); 
          }} 
        >
          {buttonContent}
        </button>
      </div>
  );
};
