import { Link, useNavigate } from "react-router-dom";
import { FiMapPin, FiClock, FiCreditCard, FiArrowRight, FiBookmark } from "react-icons/fi";
import { motion } from "framer-motion";
import { useInternships } from "../../../context/internshipContext";
import { useAuth } from "../../../context/AuthContext";

const InternshipCard = ({
  internship,
  isGuest,
  isAdmin,
  onRestrictedAction,
  onToggleStatus,
  onEdit,
}) => {
  const navigate = useNavigate();
  const { toggleSaveInternship } = useInternships();
  const { user } = useAuth();

  const {
    _id,
    title,
    companyName,
    companyLogo,
    stipend,
    durationValue,
    durationUnit,
    location,
    type,
    status, // ✅ IMPORTANT
  } = internship;

  const formattedDuration =
    durationValue && durationUnit
      ? `${durationValue} ${durationUnit}${durationValue > 1 ? "s" : ""}`
      : internship.duration || "—";

  const accentColors = [
    "from-indigo-500 to-blue-500",
    "from-violet-500 to-purple-500",
    "from-blue-500 to-cyan-500",
    "from-emerald-500 to-teal-500",
    "from-rose-500 to-pink-500",
  ];
  const accent = accentColors[(title?.charCodeAt(0) || 0) % accentColors.length];

  const isClosed = status === "closed";

  const userId = user?._id || user?.id;
  const isSaved = internship.savedBy?.includes(userId);

  const handleSave = async (e) => {
    e.stopPropagation();
    if (isGuest) {
      onRestrictedAction();
      return;
    }
    try {
      await toggleSaveInternship(_id);
    } catch (err) {
      console.error("Save Internship Error:", err);
    }
  };

  return (
    <motion.div
      whileHover={{ y: -4, boxShadow: "0 20px 40px rgba(79,70,229,0.10)" }}
      transition={{ duration: 0.2 }}
      onClick={() => navigate(`/internships/${_id}`)}
      className={`group bg-white border border-gray-100 rounded-3xl overflow-hidden flex flex-col h-full cursor-pointer relative ${
        isClosed ? "opacity-70" : ""
      }`}
      style={{ boxShadow: "0 2px 16px rgba(0,0,0,0.06)" }}
    >
      {/* Accent */}
      <div className={`h-1.5 bg-gradient-to-r ${accent}`} />

      <div className="p-6 flex flex-col h-full relative">
        
        {/* Bookmark Button */}
        <button
          onClick={handleSave}
          className="absolute top-4 right-4 p-2 rounded-full bg-white/80 hover:bg-white border border-gray-100 hover:shadow-md transition-all duration-200 z-10 text-gray-400 hover:text-indigo-600 focus:outline-none"
        >
          <FiBookmark
            size={16}
            className={isSaved ? "fill-indigo-600 text-indigo-600" : "text-gray-400 group-hover:text-indigo-500"}
          />
        </button>

        {/* 🔴 CLOSED BADGE */}
        {isClosed && (
          <span className="absolute top-4 right-14 text-[10px] font-bold px-2 py-1 bg-red-500 text-white rounded-lg">
            CLOSED
          </span>
        )}

        {/* Header */}
        <div className="flex items-start gap-4 mb-5">
          <div className="relative flex-shrink-0">
            <div className="w-14 h-14 rounded-2xl border-2 border-gray-100 bg-gray-50 shadow-sm overflow-hidden flex items-center justify-center">
              {companyLogo ? (
                <img
                  src={companyLogo}
                  alt={companyName}
                  className="w-full h-full object-cover"
                  onError={(e) => (e.target.style.display = "none")}
                />
              ) : (
                <span className="text-lg font-extrabold text-indigo-400">
                  {companyName?.charAt(0).toUpperCase()}
                </span>
              )}
            </div>
          </div>

          <div className="min-w-0 flex-1">
            <h3 className="text-base font-bold text-gray-900 group-hover:text-indigo-600 transition-colors leading-snug line-clamp-2">
              {title}
            </h3>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mt-1 truncate">
              {companyName}
            </p>
          </div>

          {type && (
            <span className="text-[10px] font-bold px-2 py-1 bg-indigo-50 text-indigo-600 rounded-lg">
              {type}
            </span>
          )}
        </div>

        {/* Info */}
        <div className="flex flex-wrap gap-2 mb-5">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold border border-blue-100">
            <FiCreditCard size={12} />
            {stipend > 0 ? `₹${stipend?.toLocaleString()}/mo` : "Unpaid"}
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-indigo-50 text-indigo-700 text-xs font-semibold border border-indigo-100">
            <FiClock size={12} />
            {formattedDuration}
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold border border-emerald-100">
            <FiMapPin size={12} />
            {location}
          </div>
        </div>

        <div className="flex-1" />

        {/* Footer */}
        <div className="flex flex-col gap-3 pt-4 border-t border-gray-100">
          
          {/* ✅ STATUS TEXT */}
          <span
            className={`text-xs font-medium ${
              isClosed ? "text-red-500" : "text-emerald-500"
            }`}
          >
            {isClosed ? "Closed" : "Actively hiring"}
          </span>

          <div className="flex items-center justify-between">
            {/* View */}
            <Link
              to={`/internships/${_id}`}
              onClick={(e) => e.stopPropagation()}
              className={`flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-xl transition-all duration-200 ${
                isClosed
                  ? "bg-gray-200 text-gray-700"
                  : `bg-gradient-to-r ${accent} text-white hover:shadow-lg`
              }`}
            >
              View Details
              <FiArrowRight size={12} />
            </Link>

            {/* 🔐 ADMIN CONTROLS */}
            {isAdmin && (
              <div className="flex gap-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onEdit(internship);
                  }}
                  className="text-xs px-3 py-1 bg-blue-500 text-white rounded-lg"
                >
                  Edit
                </button>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleStatus(_id, status);
                  }}
                  className={`text-xs px-3 py-1 rounded-lg ${
                    isClosed
                      ? "bg-green-500 text-white"
                      : "bg-red-500 text-white"
                  }`}
                >
                  {isClosed ? "Open" : "Close"}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default InternshipCard;