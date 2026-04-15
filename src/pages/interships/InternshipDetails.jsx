import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { getInternshipById } from "../../services/internshipService";
import { useInternships } from "../../context/internshipContext";
import { useAuth } from "../../context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiMapPin,
  FiClock,
  FiCreditCard,
  FiArrowLeft,
  FiBriefcase,
  FiExternalLink,
  FiShare2,
  FiBookmark,
  FiCheckCircle,
  FiAlertCircle,
  FiCalendar,
  FiUser,
  FiX,
} from "react-icons/fi";



// ─── Skeleton Loader ──────────────────────────────────────────────────────────
const SkeletonBlock = ({ className }) => (
  <div className={`bg-gray-200 rounded-xl animate-pulse ${className}`} />
);

const DetailSkeleton = () => (
  <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/40 pt-20 pb-16">
    <div className="max-w-4xl mx-auto px-4">
      {/* Breadcrumb skeleton */}
      <SkeletonBlock className="h-4 w-48 mb-8" />

      {/* Hero card skeleton */}
      <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8 mb-6">
        <div className="flex items-start gap-6">
          <SkeletonBlock className="w-20 h-20 rounded-2xl flex-shrink-0" />
          <div className="flex-1 space-y-3">
            <SkeletonBlock className="h-8 w-3/4" />
            <SkeletonBlock className="h-4 w-1/3" />
          </div>
        </div>
        <div className="flex gap-3 mt-6 flex-wrap">
          <SkeletonBlock className="h-9 w-28 rounded-full" />
          <SkeletonBlock className="h-9 w-28 rounded-full" />
          <SkeletonBlock className="h-9 w-28 rounded-full" />
        </div>
      </div>

      {/* Description skeleton */}
      <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8 space-y-3">
        <SkeletonBlock className="h-6 w-40 mb-4" />
        <SkeletonBlock className="h-4 w-full" />
        <SkeletonBlock className="h-4 w-5/6" />
        <SkeletonBlock className="h-4 w-4/5" />
        <SkeletonBlock className="h-4 w-3/4" />
        <SkeletonBlock className="h-4 w-full" />
        <SkeletonBlock className="h-4 w-2/3" />
      </div>
    </div>
  </div>
);

// ─── Guest Auth Modal ─────────────────────────────────────────────────────────
const GuestModal = ({ onClose }) => (
  <AnimatePresence>
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        className="bg-white rounded-3xl shadow-2xl p-8 max-w-sm w-full relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-all"
        >
          <FiX size={18} />
        </button>

        <div className="w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center mx-auto mb-5">
          <FiBriefcase size={28} className="text-indigo-600" />
        </div>

        <h3 className="text-xl font-bold text-gray-900 text-center mb-2">
          Join CampusPull to Apply
        </h3>
        <p className="text-gray-500 text-sm text-center mb-6 leading-relaxed">
          Create a free account to apply for internships, track applications,
          and connect with your campus community.
        </p>

        <div className="space-y-3">
          <Link
            to="/auth?signup=true"
            className="block w-full py-3.5 bg-gradient-to-r from-indigo-600 to-blue-600 text-white font-bold text-sm rounded-xl text-center hover:shadow-lg hover:shadow-indigo-200 hover:-translate-y-0.5 transition-all duration-200"
          >
            Create Free Account
          </Link>
          <Link
            to="/auth"
            className="block w-full py-3.5 bg-gray-50 text-gray-700 font-semibold text-sm rounded-xl text-center hover:bg-gray-100 transition-all"
          >
            Sign In
          </Link>
        </div>
      </motion.div>
    </motion.div>
  </AnimatePresence>
);

// ─── Info Badge ───────────────────────────────────────────────────────────────
const InfoBadge = ({ icon: Icon, label, value, color }) => (
  <div
    className={`flex items-center gap-2.5 px-4 py-2.5 rounded-2xl border ${color}`}
  >
    <Icon size={15} />
    <div>
      <p className="text-[10px] font-bold uppercase tracking-wider opacity-70">
        {label}
      </p>
      <p className="text-sm font-bold">{value}</p>
    </div>
  </div>
);

// ─── Main Component ───────────────────────────────────────────────────────────
const InternshipDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const isGuest = !user;


  const { toggleInternshipStatus, updateInternship } = useInternships();

const handleToggleStatus = async () => {
  if (!internship) return;

  try {
    const updated = await toggleInternshipStatus(
      internship._id,
      internship.status
    );

    setInternship(updated);
  } catch (err) {
    console.error("Toggle failed", err);
  }
};

  const [internship, setInternship] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showGuestModal, setShowGuestModal] = useState(false);
  const [saved, setSaved] = useState(false);
  const [copied, setCopied] = useState(false);

  const isAdmin = user?.role === "admin";
  const isClosed = internship?.status === "closed";

  useEffect(() => {
    const fetchInternship = async () => {
      try {
        const res = await getInternshipById(id, isGuest);
        setInternship(res.data);
      } catch (error) {
        console.error("Failed to fetch internship:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchInternship();
  }, [id, isGuest]);

  const handleApply = () => {
    // 🔴 BLOCK if closed
    if (internship.status === "closed") return;

    // 🔐 guest check
    if (isGuest) {
      setShowGuestModal(true);
      return;
    }

    window.open(internship.applyLink, "_blank");
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formattedDuration = internship
    ? `${internship.durationValue} ${internship.durationUnit}${internship.durationValue > 1 ? "s" : ""}`
    : "";

  // Parse skills if available
  const skills = internship?.skills
    ? Array.isArray(internship.skills)
      ? internship.skills
      : internship.skills
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean)
    : [];

  if (loading) return <DetailSkeleton />;

  if (!internship) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50 flex items-center justify-center pt-16">
        <div className="text-center">
          <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <FiAlertCircle size={36} className="text-red-400" />
          </div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">
            Internship Not Found
          </h2>
          <p className="text-gray-500 mb-6">
            This opportunity may have expired or been removed.
          </p>
          <Link
            to="/internships"
            className="px-6 py-3 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 transition-colors"
          >
            Browse All Internships
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      {showGuestModal && (
        <GuestModal onClose={() => setShowGuestModal(false)} />
      )}

      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/40 pt-20 pb-32">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          {/* ── Breadcrumb ── */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 text-sm text-gray-500 mb-6"
          >
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-1.5 font-semibold text-indigo-600 hover:text-indigo-800 transition-colors group"
            >
              <FiArrowLeft
                size={14}
                className="group-hover:-translate-x-0.5 transition-transform"
              />
              Back
            </button>
            <span className="text-gray-300">/</span>
            <Link
              to="/internships"
              className="hover:text-gray-800 transition-colors"
            >
              Internships
            </Link>
            <span className="text-gray-300">/</span>
            <span className="text-gray-700 font-medium truncate max-w-[200px]">
              {internship.title}
            </span>
          </motion.div>

          {/* ── Hero Card ── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden mb-5"
          >
            {/* Gradient stripe */}
            <div className="h-2 bg-gradient-to-r from-indigo-500 via-blue-500 to-cyan-500" />

            <div className="p-7 sm:p-9">
              {/* Company header */}
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div className="flex items-center gap-5">
                  <div className="relative flex-shrink-0">
                    <div className="w-20 h-20 rounded-2xl border-2 border-gray-100 bg-gray-50 shadow-md overflow-hidden flex items-center justify-center">
                      {internship.companyLogo ? (
                        <img
                          src={internship.companyLogo}
                          alt={internship.companyName}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.style.display = "none";
                            e.target.nextSibling.style.display = "flex";
                          }}
                        />
                      ) : null}
                      <div
                        className={`w-full h-full bg-gradient-to-br from-indigo-100 to-blue-100 items-center justify-center ${internship.companyLogo ? "hidden" : "flex"}`}
                        style={{
                          display: internship.companyLogo ? "none" : "flex",
                        }}
                      >
                        <FiBriefcase size={28} className="text-indigo-400" />
                      </div>
                    </div>
                    <span className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 border-2 border-white rounded-full shadow" />
                  </div>
                  <span
                    className={`inline-block mt-2 px-3 py-1 text-xs font-bold rounded-full ${
                      isClosed
                        ? "bg-red-100 text-red-600"
                        : "bg-green-100 text-green-600"
                    }`}
                  >
                    {isClosed ? "Closed" : "Actively Hiring"}
                  </span>

                  <div>
                    <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 leading-tight">
                      {internship.title}
                    </h1>
                    <p className="text-gray-500 font-semibold mt-1 flex items-center gap-1.5">
                      <FiUser size={13} />
                      {internship.companyName}
                    </p>
                  </div>
                </div>

                {/* Action buttons */}
                <div className="flex items-center gap-2 ml-auto">
                  {/* 🔐 ADMIN CONTROLS */}
                  {isAdmin && (
                    <>
                      <button
                        onClick={() =>
                          navigate(`/admin/internships/edit/${internship._id}`)
                        }
                        className="px-3 py-2 text-xs font-bold bg-blue-500 text-white rounded-xl"
                      >
                        Edit
                      </button>

                      <button
                        onClick={handleToggleStatus}
                        className={`px-3 py-2 text-xs font-bold rounded-xl ${
                          isClosed
                            ? "bg-green-500 text-white"
                            : "bg-red-500 text-white"
                        }`}
                      >
                        {isClosed ? "Open" : "Close"}
                      </button>
                    </>
                  )}
                  <button
                    onClick={() => setSaved((s) => !s)}
                    title="Save internship"
                    className={`p-2.5 rounded-xl border transition-all duration-200 ${
                      saved
                        ? "bg-indigo-50 border-indigo-200 text-indigo-600"
                        : "bg-gray-50 border-gray-200 text-gray-400 hover:text-indigo-500 hover:border-indigo-200"
                    }`}
                  >
                    <FiBookmark
                      size={16}
                      fill={saved ? "currentColor" : "none"}
                    />
                  </button>
                  <button
                    onClick={handleShare}
                    title="Copy link"
                    className="p-2.5 rounded-xl border bg-gray-50 border-gray-200 text-gray-400 hover:text-indigo-500 hover:border-indigo-200 transition-all duration-200 relative"
                  >
                    <FiShare2 size={16} />
                    {copied && (
                      <span className="absolute -top-8 left-1/2 -translate-x-1/2 text-[10px] font-bold bg-gray-900 text-white px-2 py-1 rounded-lg whitespace-nowrap">
                        Copied!
                      </span>
                    )}
                  </button>
                </div>
              </div>

              {/* Info badges */}
              <div className="flex flex-wrap gap-3 mt-7">
                <InfoBadge
                  icon={FiCreditCard}
                  label="Stipend"
                  value={
                    internship.stipend > 0
                      ? `₹${internship.stipend?.toLocaleString()}/mo`
                      : "Unpaid"
                  }
                  color="bg-blue-50 text-blue-700 border-blue-100"
                />
                <InfoBadge
                  icon={FiClock}
                  label="Duration"
                  value={formattedDuration || internship.duration || "—"}
                  color="bg-indigo-50 text-indigo-700 border-indigo-100"
                />
                <InfoBadge
                  icon={FiMapPin}
                  label="Location"
                  value={internship.location}
                  color="bg-emerald-50 text-emerald-700 border-emerald-100"
                />
                {internship.type && (
                  <InfoBadge
                    icon={FiBriefcase}
                    label="Type"
                    value={internship.type}
                    color="bg-amber-50 text-amber-700 border-amber-100"
                  />
                )}
              </div>
            </div>
          </motion.div>

          {/* ── Description Card ── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-3xl shadow-xl border border-gray-100 p-7 sm:p-9 mb-5"
          >
            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <span className="w-7 h-7 bg-indigo-50 rounded-lg flex items-center justify-center">
                <FiBriefcase size={14} className="text-indigo-600" />
              </span>
              About the Role
            </h2>
            <p className="text-gray-600 text-sm sm:text-base leading-relaxed whitespace-pre-line">
              {internship.description}
            </p>

            {/* Skills section */}
            {skills.length > 0 && (
              <div className="mt-7 pt-6 border-t border-gray-100">
                <h3 className="text-sm font-bold text-gray-700 mb-3 uppercase tracking-wider">
                  Skills Required
                </h3>
                <div className="flex flex-wrap gap-2">
                  {skills.map((skill, i) => (
                    <span
                      key={i}
                      className="px-3 py-1.5 text-xs font-semibold bg-gradient-to-r from-indigo-50 to-blue-50 text-indigo-700 border border-indigo-100 rounded-full"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </motion.div>

          {/* ── What You'll Get card (if extra perks available) ── */}
          {internship.perks && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="bg-gradient-to-r from-indigo-600 to-blue-600 rounded-3xl p-7 sm:p-9 mb-5 text-white"
            >
              <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                <FiCheckCircle size={18} />
                What You&apos;ll Get
              </h2>
              <ul className="space-y-2">
                {(Array.isArray(internship.perks)
                  ? internship.perks
                  : internship.perks.split(",")
                ).map((perk, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-2.5 text-sm text-white/90"
                  >
                    <FiCheckCircle
                      size={14}
                      className="mt-0.5 flex-shrink-0 text-emerald-300"
                    />
                    {perk.trim()}
                  </li>
                ))}
              </ul>
            </motion.div>
          )}

          {/* ── Quick Details card ── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-3xl shadow-xl border border-gray-100 p-7 sm:p-9"
          >
            <h2 className="text-lg font-bold text-gray-900 mb-5 flex items-center gap-2">
              <span className="w-7 h-7 bg-indigo-50 rounded-lg flex items-center justify-center">
                <FiCalendar size={14} className="text-indigo-600" />
              </span>
              Quick Details
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              {[
                { label: "Company", value: internship.companyName },
                { label: "Location", value: internship.location },
                {
                  label: "Duration",
                  value: formattedDuration || internship.duration,
                },
                {
                  label: "Stipend",
                  value:
                    internship.stipend > 0
                      ? `₹${internship.stipend?.toLocaleString()} / month`
                      : "Unpaid",
                },
                internship.openings && {
                  label: "Openings",
                  value: `${internship.openings} positions`,
                },
                internship.lastDate && {
                  label: "Last Date to Apply",
                  value: new Date(internship.lastDate).toLocaleDateString(
                    "en-IN",
                    { day: "numeric", month: "long", year: "numeric" },
                  ),
                },
              ]
                .filter(Boolean)
                .map(({ label, value }) => (
                  <div
                    key={label}
                    className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl"
                  >
                    <FiCheckCircle
                      size={14}
                      className="text-indigo-400 mt-0.5 flex-shrink-0"
                    />
                    <div>
                      <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider">
                        {label}
                      </p>
                      <p className="font-semibold text-gray-800 mt-0.5">
                        {value}
                      </p>
                    </div>
                  </div>
                ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* ── Sticky Apply Footer ── */}
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3, type: "spring", damping: 20 }}
        className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-lg border-t border-gray-200 shadow-2xl"
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between gap-4">
          <div>
            <p className="font-bold text-gray-900 text-sm">
              {internship.title}
            </p>
            <p className="text-gray-500 text-xs">
              {internship.companyName} · {internship.location}
            </p>
          </div>
          <div className="flex items-center gap-3 flex-shrink-0">
            {isGuest && (
              <p className="text-xs text-gray-400 hidden sm:block">
                Sign in to apply
              </p>
            )}
            <button
              onClick={handleApply}
              disabled={internship.status === "closed"}
              className={`flex items-center gap-2 px-6 py-3 text-white font-bold text-sm rounded-xl transition-all duration-200 ${
                internship.status === "closed"
                  ? "bg-gray-300 cursor-not-allowed"
                  : "bg-gradient-to-r from-indigo-600 to-blue-600 hover:shadow-lg"
              }`}
            >
              {internship.status === "closed"
                ? "Applications Closed"
                : "Apply Now"}
              {internship.status !== "closed" && <FiExternalLink size={14} />}
            </button>
          </div>
        </div>
      </motion.div>
    </>
  );
};

export default InternshipDetails;
