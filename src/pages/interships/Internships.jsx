import { useEffect, useState } from "react";
import { useInternships } from "../../context/internshipContext";
import InternshipCard from "./components/internshipCard";
import InternshipFilter from "./components/internshipfilter";
import Pagination from "./components/pagination";
import CreateInternshipModal from "./components/createInternshipModal";
import { useAuth } from "../../context/AuthContext";
import SignupModal from "../../components/ui/SignupModal";
import { motion } from "framer-motion";
import { FiBriefcase, FiSearch, FiSliders, FiX } from "react-icons/fi";

// ─── Skeleton Card ─────────────────────────────────────────────────────────────
const SkeletonCard = () => (
  <div className="bg-white rounded-3xl overflow-hidden border border-gray-100" style={{ boxShadow: "0 2px 16px rgba(0,0,0,0.06)" }}>
    <div className="h-1.5 bg-gradient-to-r from-gray-200 to-gray-100 animate-pulse" />
    <div className="p-6 space-y-4">
      <div className="flex items-center gap-4">
        <div className="w-14 h-14 rounded-2xl bg-gray-200 animate-pulse flex-shrink-0" />
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-gray-200 rounded-lg w-4/5 animate-pulse" />
          <div className="h-3 bg-gray-100 rounded-lg w-1/3 animate-pulse" />
        </div>
      </div>
      <div className="flex gap-2">
        <div className="h-7 w-24 rounded-full bg-blue-50 animate-pulse" />
        <div className="h-7 w-20 rounded-full bg-indigo-50 animate-pulse" />
        <div className="h-7 w-20 rounded-full bg-emerald-50 animate-pulse" />
      </div>
      <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
        <div className="h-3 w-24 bg-gray-100 rounded animate-pulse" />
        <div className="h-8 w-28 rounded-xl bg-gray-200 animate-pulse" />
      </div>
    </div>
  </div>
);

// ─── Stats pill ───────────────────────────────────────────────────────────────
const StatPill = ({ value, label }) => (
  <div className="flex flex-col items-center px-5 py-3 bg-white/20 backdrop-blur-sm rounded-2xl border border-white/30">
    <span className="text-2xl font-extrabold text-white">{value}</span>
    <span className="text-xs font-medium text-white/80 mt-0.5">{label}</span>
  </div>
);

// ─── Main Component ───────────────────────────────────────────────────────────
const Internships = () => {
  const { internships, currentPage, totalPages, loading, fetchInternships } =
    useInternships();

  const { user } = useAuth();
  const isGuest = !user;

  const [filters, setFilters] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

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
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
          {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
        </div>
      );
    }

    if (internships.length === 0) {
      return (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl p-16 text-center border border-gray-100"
          style={{ boxShadow: "0 2px 16px rgba(0,0,0,0.06)" }}
        >
          <div className="w-20 h-20 bg-indigo-50 rounded-full flex items-center justify-center mx-auto mb-5">
            <FiSearch size={32} className="text-indigo-300" />
          </div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">No Results Found</h3>
          <p className="text-gray-400 text-sm max-w-xs mx-auto">
            No internships match your filters. Try adjusting your search criteria.
          </p>
        </motion.div>
      );
    }

    return (
      <div className="space-y-8">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="grid grid-cols-1 xl:grid-cols-2 gap-5"
        >
          {internships.map((internship, i) => (
            <motion.div
              key={internship._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <InternshipCard
                internship={internship}
                isGuest={isGuest}
                onRestrictedAction={() => setShowAuthModal(true)}
              />
            </motion.div>
          ))}
        </motion.div>

        <div className="mt-10">
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/40">

      {/* ── Hero Header ── */}
      <div className="bg-gradient-to-br from-indigo-600 via-blue-600 to-cyan-600 pt-24 pb-16 px-4 sm:px-8 relative overflow-hidden">
        {/* Decorative blobs */}
        <div className="absolute -top-20 -right-20 w-96 h-96 bg-white/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 w-80 h-80 bg-white/5 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-6xl mx-auto relative z-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <div className="flex items-center gap-2.5 mb-4">
                <div className="w-9 h-9 bg-white/20 rounded-xl flex items-center justify-center">
                  <FiBriefcase size={18} className="text-white" />
                </div>
                <span className="text-white/80 text-sm font-semibold uppercase tracking-wider">Opportunities</span>
              </div>
              <h1 className="text-4xl sm:text-5xl font-extrabold text-white leading-tight tracking-tight">
                Internship <br className="sm:hidden" />
                <span className="text-cyan-300">Opportunities</span>
              </h1>
              <p className="text-white/70 mt-3 text-base font-medium max-w-md">
                Discover real-world experience opportunities tailored for campus students.
              </p>
            </div>

            <div className="flex items-center gap-3 flex-wrap">
              <StatPill value={internships.length || "—"} label="Listings" />
              <StatPill value="100%" label="Verified" />
              {!isGuest && user?.role === "admin" && (
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="flex items-center gap-2 px-5 py-3 bg-white text-indigo-700 font-bold text-sm rounded-2xl hover:bg-indigo-50 hover:shadow-lg transition-all duration-200"
                >
                  + Add Internship
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── Guest Banner ── */}
      {isGuest && (
        <div className="max-w-6xl mx-auto px-4 sm:px-8 -mt-4 mb-0 relative z-20">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl border border-indigo-100 shadow-lg p-4 flex items-center justify-between gap-4"
          >
            <p className="text-gray-700 font-medium text-sm">
              👋 <strong>Browsing as guest.</strong> Create a free account to apply for internships.
            </p>
            <button
              onClick={() => setShowAuthModal(true)}
              className="shrink-0 px-4 py-2 bg-indigo-600 text-white text-sm font-bold rounded-xl hover:bg-indigo-700 transition-colors"
            >
              Join Now
            </button>
          </motion.div>
        </div>
      )}

      {/* ── Main Content ── */}
      <div className="max-w-6xl mx-auto px-4 sm:px-8 py-8">

        {/* Mobile filter toggle */}
        <div className="lg:hidden mb-5">
          <button
            onClick={() => setMobileFilterOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-semibold text-gray-700 shadow-sm hover:border-indigo-300 transition-colors"
          >
            <FiSliders size={15} className="text-indigo-500" />
            Filters
          </button>
        </div>

        {/* Mobile filter drawer */}
        {mobileFilterOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setMobileFilterOpen(false)} />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              className="absolute left-0 top-0 bottom-0 w-80 bg-white shadow-2xl overflow-y-auto"
            >
              <div className="flex items-center justify-between p-5 border-b border-gray-100">
                <h2 className="font-bold text-gray-900">Filters</h2>
                <button onClick={() => setMobileFilterOpen(false)} className="p-2 text-gray-400 hover:text-gray-700 rounded-xl hover:bg-gray-100 transition-colors">
                  <FiX size={18} />
                </button>
              </div>
              <div className="p-5">
                <InternshipFilter onFilter={handleFilter} />
              </div>
            </motion.div>
          </div>
        )}

        <div className="flex flex-col lg:flex-row gap-7">
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
              <p className="text-sm text-gray-500 font-medium mb-5">
                Showing <strong className="text-gray-800">{internships.length}</strong> internship{internships.length !== 1 ? "s" : ""}
                {Object.keys(filters).some(k => filters[k]) ? " matching your filters" : ""}
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
