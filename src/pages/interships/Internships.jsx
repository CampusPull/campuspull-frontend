import { useEffect, useState } from "react";
import { useInternships } from "../../context/internshipContext";
import InternshipCard from "./components/internshipCard";
import InternshipFilter from "./components/internshipfilter";
import Pagination from "./components/pagination";
import CreateInternshipModal from "./components/createInternshipModal";
import EditInternshipModal from "./components/editInternshipModal";
import { useAuth } from "../../context/AuthContext";
import SignupModal from "../../components/ui/SignupModal";
import { motion } from "framer-motion";
import { FiBriefcase, FiSearch, FiSliders, FiX, FiPlus, FiArrowRight } from "react-icons/fi";

// ─── Skeleton Card ─────────────────────────────────────────────────────────────
const SkeletonCard = () => (
  <div className="bg-white rounded-3xl overflow-hidden border border-slate-100 p-6 space-y-5 animate-pulse" style={{ boxShadow: "0 4px 20px rgba(0,0,0,0.03)" }}>
    <div className="flex items-center gap-4">
      <div className="w-14 h-14 rounded-2xl bg-slate-100 flex-shrink-0" />
      <div className="flex-1 space-y-2">
        <div className="h-4.5 bg-slate-100 rounded-lg w-4/5" />
        <div className="h-3 bg-slate-100/60 rounded-lg w-1/3" />
      </div>
    </div>
    <div className="flex gap-2">
      <div className="h-7 w-20 rounded-full bg-slate-100" />
      <div className="h-7 w-24 rounded-full bg-slate-100" />
      <div className="h-7 w-16 rounded-full bg-slate-100" />
    </div>
    <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
      <div className="h-3.5 w-24 bg-slate-100 rounded-lg" />
      <div className="h-8.5 w-28 rounded-xl bg-slate-100" />
    </div>
  </div>
);

// ─── Stats pill ───────────────────────────────────────────────────────────────
const StatPill = ({ value, label }) => (
  <div className="flex flex-col items-center px-6 py-3.5 bg-white/10 backdrop-blur-md rounded-2xl border border-white/10 shadow-sm hover:bg-white/20 transition-all duration-300">
    <span className="text-2xl font-black text-white tracking-tight">{value}</span>
    <span className="text-[10px] font-extrabold uppercase tracking-widest text-white/70 mt-1">{label}</span>
  </div>
);

// ─── Main Component ───────────────────────────────────────────────────────────
const Internships = () => {
  const {
    internships,
    currentPage,
    totalPages,
    loading,
    fetchInternships,
    toggleInternshipStatus,
  } = useInternships();

  const { user } = useAuth();
  const isGuest = !user;

  const [filters, setFilters] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedInternship, setSelectedInternship] = useState(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  const handleToggleStatus = async (id, currentStatus) => {
    try {
      await toggleInternshipStatus(id, currentStatus);
    } catch (err) {
      console.error("Failed to toggle status:", err);
    }
  };

  const handleEdit = (internship) => {
    setSelectedInternship(internship);
    setIsEditModalOpen(true);
  };

  useEffect(() => {
    fetchInternships();
  }, []);

  const handleFilter = (newFilters) => {
    setFilters(newFilters);
    fetchInternships(1, newFilters);
    setMobileFilterOpen(false);
  };

  const handlePageChange = (page) => {
    fetchInternships(page, filters);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const renderInternshipContent = () => {
    if (loading) {
      return (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
        </div>
      );
    }

    if (internships.length === 0) {
      return (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl p-16 text-center border border-slate-100"
          style={{ boxShadow: "0 4px 20px rgba(0,0,0,0.03)" }}
        >
          <div className="w-20 h-20 bg-indigo-50 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner-sm">
            <FiSearch size={32} className="text-indigo-400/80" />
          </div>
          <h3 className="text-xl font-extrabold text-slate-800 mb-2">No Results Found</h3>
          <p className="text-slate-400 text-sm max-w-sm mx-auto font-medium">
            No internships match your active filters. Try adjusting or resetting your search criteria.
          </p>
        </motion.div>
      );
    }

    return (
      <div className="space-y-8">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="grid grid-cols-1 xl:grid-cols-2 gap-6"
        >
          {internships.map((internship, i) => (
            <motion.div
              key={internship._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
            >
              <InternshipCard
                internship={internship}
                isGuest={isGuest}
                isAdmin={user?.role === "admin"}
                onRestrictedAction={() => setShowAuthModal(true)}
                onToggleStatus={handleToggleStatus}
                onEdit={handleEdit}
              />
            </motion.div>
          ))}
        </motion.div>

        <div className="mt-10 flex justify-center">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/20 to-indigo-50/30">

      {/* ── Hero Header ── */}
      <div className="bg-gradient-to-br from-indigo-950 via-slate-900 to-blue-950 pt-16 pb-16 px-4 sm:px-8 relative overflow-hidden">
        {/* Ambient Glowing Blobs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-6xl mx-auto relative z-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div className="space-y-4">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 bg-white/10 backdrop-blur-md rounded-xl flex items-center justify-center border border-white/10 shadow-inner-sm">
                  <FiBriefcase size={18} className="text-white" />
                </div>
                <span className="text-white/80 text-xs font-black uppercase tracking-widest">Opportunities</span>
              </div>
              <h1 className="text-4xl sm:text-5xl font-black text-white leading-tight tracking-tight">
                Internship <br className="sm:hidden" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-indigo-300 to-blue-400">Portal</span>
              </h1>
              <p className="text-slate-300 text-sm sm:text-base font-semibold max-w-md leading-relaxed">
                Discover high-value direct opportunities tailored specifically for university campus students.
              </p>
            </div>

            <div className="flex items-center gap-4 flex-wrap">
              <StatPill value={internships.length || "—"} label="Listings" />
              <StatPill value="100%" label="Verified" />
              {!isGuest && user?.role === "admin" && (
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="flex items-center gap-2.5 px-6 py-4 bg-gradient-to-r from-indigo-500 to-blue-500 text-white font-extrabold text-sm rounded-2xl hover:shadow-lg hover:shadow-indigo-500/20 hover:-translate-y-0.5 transition-all duration-300 active:scale-98 cursor-pointer border border-indigo-400/20"
                >
                  <FiPlus size={16} />
                  Add Internship
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── Guest Banner ── */}
      {isGuest && (
        <div className="max-w-6xl mx-auto px-4 sm:px-8 -mt-6 mb-0 relative z-20">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/95 backdrop-blur-xl rounded-2xl border border-indigo-100 shadow-brand-lg p-4.5 flex flex-col sm:flex-row items-center justify-between gap-4"
          >
            <p className="text-slate-700 font-semibold text-sm text-center sm:text-left leading-relaxed">
              👋 <strong className="text-indigo-600 font-extrabold">Browsing as guest.</strong> Create a free account to apply directly for verified internships.
            </p>
            <button
              onClick={() => setShowAuthModal(true)}
              className="shrink-0 w-full sm:w-auto px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-blue-600 text-white text-xs font-black rounded-xl hover:shadow-md hover:shadow-indigo-500/10 hover:scale-102 transition-all duration-200 cursor-pointer"
            >
              Get Started
            </button>
          </motion.div>
        </div>
      )}

      {/* ── Main Content ── */}
      <div className="max-w-6xl mx-auto px-4 sm:px-8 py-8">

        {/* Mobile filter toggle */}
        <div className="lg:hidden mb-6">
          <button
            onClick={() => setMobileFilterOpen(true)}
            className="flex items-center gap-2.5 px-5 py-3 bg-white border border-slate-200 rounded-2xl text-sm font-extrabold text-slate-700 shadow-sm hover:border-indigo-400 hover:shadow-brand-sm transition-all duration-300 cursor-pointer"
          >
            <FiSliders size={15} className="text-indigo-500" />
            Filters
          </button>
        </div>

        {/* Mobile filter drawer */}
        {mobileFilterOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setMobileFilterOpen(false)} />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 220 }}
              className="absolute left-0 top-0 bottom-0 w-80 bg-slate-50 shadow-2xl overflow-y-auto z-10 flex flex-col"
            >
              <div className="flex items-center justify-between p-5 bg-white border-b border-slate-100">
                <h2 className="font-extrabold text-slate-800 tracking-tight">Filters</h2>
                <button onClick={() => setMobileFilterOpen(false)} className="p-2 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100 transition-colors">
                  <FiX size={18} />
                </button>
              </div>
              <div className="p-5 flex-grow">
                <InternshipFilter onFilter={handleFilter} />
              </div>
            </motion.div>
          </div>
        )}

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sticky Sidebar Filter */}
          <aside className="hidden lg:block w-72 flex-shrink-0">
            <div className="sticky top-24">
              <InternshipFilter onFilter={handleFilter} />
            </div>
          </aside>

          {/* Internship List */}
          <main className="flex-grow min-w-0">
            {/* Result count */}
            {!loading && internships.length > 0 && (
              <p className="text-sm text-slate-500 font-semibold mb-6 flex items-center gap-1.5 bg-white/40 border border-slate-100 rounded-xl px-4 py-2 w-max">
                Showing <strong className="text-slate-800 font-extrabold">{internships.length}</strong> active opportunity{internships.length !== 1 ? "ies" : ""}
                {Object.keys(filters).some(k => filters[k]) ? " matching filters" : ""}
              </p>
            )}
            {renderInternshipContent()}
          </main>
        </div>
      </div>

      {/* Admin Modal */}
      <CreateInternshipModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />

      <EditInternshipModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        internship={selectedInternship}
        onSuccess={() => fetchInternships(currentPage, filters)}
      />

      {/* Guest Signup Modal */}
      {showAuthModal && (
        <SignupModal
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
          message="Create an account to apply for internships"
        />
      )}
    </div>
  );
};

export default Internships;
