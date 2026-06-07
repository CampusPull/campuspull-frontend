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
      whileHover={{ y: -5, boxShadow: "0 12px 30px -8px rgba(79,70,229,0.12)" }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      onClick={() => navigate(`/internships/${_id}`)}
      className={`group bg-white border border-slate-100 rounded-3xl overflow-hidden flex flex-col h-full cursor-pointer relative transition-all duration-300 ${
        isClosed ? "opacity-60 grayscale-[10%]" : ""
      }`}
      style={{ boxShadow: "0 4px 20px rgba(0,0,0,0.02), 0 1px 2px rgba(0,0,0,0.01)" }}
    >
      {/* Accent Indicator */}
      <div className={`h-1.5 bg-gradient-to-r ${accent} transition-transform duration-300 group-hover:scale-y-110`} />

      <div className="p-6 flex flex-col h-full relative">
        
        {/* Bookmark Button */}
        <button
          onClick={handleSave}
          className="absolute top-4 right-4 p-2.5 rounded-xl bg-white/90 hover:bg-white border border-slate-100 hover:shadow-md transition-all duration-300 z-10 text-slate-400 hover:text-indigo-600 hover:scale-105 active:scale-95 focus:outline-none"
        >
          <FiBookmark
            size={16}
            className={`transition-all duration-300 ${isSaved ? "fill-indigo-600 text-indigo-600 scale-110" : "text-slate-400 group-hover:scale-105"}`}
          />
        </button>

        {/* 🔴 CLOSED BADGE */}
        {isClosed && (
          <span className="absolute top-4.5 right-14 text-[9px] font-black uppercase tracking-widest px-2.5 py-1 bg-rose-500 text-white rounded-lg shadow-sm shadow-rose-500/10">
            Closed
          </span>
        )}

        {/* Header */}
        <div className="flex items-start gap-4 mb-5 pr-8">
          <div className="relative flex-shrink-0">
            <div className="w-14 h-14 rounded-2xl border-2 border-slate-100 bg-slate-50 shadow-sm overflow-hidden flex items-center justify-center transition-transform duration-300 group-hover:scale-105">
              {companyLogo ? (
                <img
                  src={companyLogo}
                  alt={companyName}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.style.display = "none";
                    if (e.target.nextSibling) {
                      e.target.nextSibling.style.display = "flex";
                    }
                  }}
                />
              ) : null}
              <div
                className={`w-full h-full bg-gradient-to-br from-indigo-100 to-blue-100 items-center justify-center ${companyLogo ? "hidden" : "flex"}`}
                style={{
                  display: companyLogo ? "none" : "flex",
                }}
              >
                <span className="text-xl font-extrabold text-indigo-400">
                  {companyName?.charAt(0).toUpperCase()}
                </span>
              </div>
            </div>
          </div>

          <div className="min-w-0 flex-1">
            <h3 className="text-base font-extrabold text-slate-800 group-hover:text-indigo-600 transition-colors leading-snug line-clamp-2">
              {title}
            </h3>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1.5 truncate">
              {companyName}
            </p>
          </div>
        </div>

        {/* Tags Row */}
        <div className="flex flex-wrap gap-2.5 mb-6">
          {type && (
            <span className="text-[10px] font-black uppercase tracking-wider px-3 py-1 bg-indigo-50/80 text-indigo-600 rounded-full border border-indigo-100/30">
              {type}
            </span>
          )}
          <div className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-blue-50/50 text-blue-600 text-[11px] font-bold border border-blue-100/50">
            <FiCreditCard size={12} className="text-blue-500/80" />
            {stipend > 0 ? `₹${stipend?.toLocaleString()}/mo` : "Unpaid"}
          </div>
          <div className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-indigo-50/50 text-indigo-600 text-[11px] font-bold border border-indigo-100/50">
            <FiClock size={12} className="text-indigo-500/80" />
            {formattedDuration}
          </div>
          <div className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-emerald-50/50 text-emerald-600 text-[11px] font-bold border border-emerald-100/50">
            <FiMapPin size={12} className="text-emerald-500/80" />
            {location}
          </div>
        </div>

        <div className="flex-1" />

        {/* Footer Actions */}
        <div className="flex flex-col gap-3.5 pt-4 border-t border-slate-100">
          <div className="flex items-center justify-between">
            <Link
              to={`/internships/${_id}`}
              onClick={(e) => e.stopPropagation()}
              className={`flex items-center gap-2 px-5 py-2.5 text-xs font-bold uppercase tracking-wider rounded-xl transition-all duration-300 cursor-pointer shadow-md hover:-translate-y-0.5 hover:shadow-lg ${
                isClosed
                  ? "bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed shadow-none"
                  : `bg-gradient-to-r ${accent} text-white hover:shadow-indigo-500/20`
              }`}
            >
              <span>View Details</span>
              <FiArrowRight size={13} className="transition-transform duration-300 group-hover:translate-x-1" />
            </Link>

          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default InternshipCard;