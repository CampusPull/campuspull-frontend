import { Link } from "react-router-dom";
import { FiMapPin, FiClock, FiCreditCard, FiArrowRight } from "react-icons/fi";
import { motion } from "framer-motion";

const InternshipCard = ({ internship, isGuest, onRestrictedAction }) => {
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
  } = internship;

  const formattedDuration =
    durationValue && durationUnit
      ? `${durationValue} ${durationUnit}${durationValue > 1 ? "s" : ""}`
      : internship.duration || "—";

  // Subtle random-ish color per card (deterministic by title first char)
  const accentColors = [
    "from-indigo-500 to-blue-500",
    "from-violet-500 to-purple-500",
    "from-blue-500 to-cyan-500",
    "from-emerald-500 to-teal-500",
    "from-rose-500 to-pink-500",
  ];
  const accent = accentColors[(title?.charCodeAt(0) || 0) % accentColors.length];

  return (
    <motion.div
      whileHover={{ y: -4, boxShadow: "0 20px 40px rgba(79,70,229,0.10)" }}
      transition={{ duration: 0.2 }}
      className="group bg-white border border-gray-100 rounded-3xl overflow-hidden flex flex-col h-full"
      style={{ boxShadow: "0 2px 16px rgba(0,0,0,0.06)" }}
    >
      {/* Color accent stripe */}
      <div className={`h-1.5 bg-gradient-to-r ${accent} flex-shrink-0`} />

      <div className="p-6 flex flex-col h-full">
        {/* Header: Logo + Title */}
        <div className="flex items-start gap-4 mb-5">
          <div className="relative flex-shrink-0">
            <div className="w-14 h-14 rounded-2xl border-2 border-gray-100 bg-gray-50 shadow-sm overflow-hidden flex items-center justify-center">
              {companyLogo ? (
                <img
                  src={companyLogo}
                  alt={companyName}
                  className="w-full h-full object-cover"
                  onError={(e) => { e.target.style.display = "none"; }}
                />
              ) : (
                <span className="text-lg font-extrabold text-indigo-400">
                  {companyName?.charAt(0).toUpperCase()}
                </span>
              )}
            </div>
            <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-500 border-2 border-white rounded-full" />
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
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-1 bg-indigo-50 text-indigo-600 rounded-lg flex-shrink-0">
              {type}
            </span>
          )}
        </div>

        {/* Info Badges */}
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

        {/* Spacer */}
        <div className="flex-1" />

        {/* Action Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100 mt-2">
          <span className="text-xs text-gray-400 font-medium">
            🟢 Actively hiring
          </span>
          <Link
            to={`/internships/${_id}`}
            className={`flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r ${accent} text-white text-xs font-bold rounded-xl hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 active:scale-95`}
          >
            View Details
            <FiArrowRight size={12} />
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

export default InternshipCard;