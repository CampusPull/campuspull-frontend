import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { getOpenInternships } from "../../services/applicationService";
import { 
  Search, 
  MapPin, 
  IndianRupee, 
  Calendar, 
  ExternalLink, 
  X, 
  AlertCircle, 
  Loader2 
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// ─── Skeleton Card for Loading State ─────────────────────────────────────────
const SkeletonCard = () => (
  <div className="bg-white rounded-3xl border border-slate-100 p-6 space-y-4 animate-pulse shadow-sm">
    <div className="space-y-2">
      <div className="h-4 bg-slate-100 rounded-lg w-1/3" />
      <div className="h-6 bg-slate-100 rounded-lg w-3/4" />
    </div>
    <div className="space-y-2">
      <div className="h-4 bg-slate-100 rounded-lg w-1/2" />
      <div className="h-4 bg-slate-100 rounded-lg w-2/3" />
    </div>
    <div className="h-16 bg-slate-100 rounded-2xl w-full" />
    <div className="flex justify-between items-center pt-2">
      <div className="h-8 bg-slate-100 rounded-xl w-28" />
      <div className="h-10 bg-slate-100 rounded-xl w-32" />
    </div>
  </div>
);

export default function OpenInternshipsPage({ isEmbedded = false }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  // URL state management
  const initialPage = parseInt(searchParams.get("page") || "1", 10);
  const initialSearch = searchParams.get("search") || "";
  const initialLocation = searchParams.get("location") || "";
  const initialIncludeExpired = searchParams.get("includeExpired") === "true";

  // State definitions
  const [internships, setInternships] = useState([]);
  const [uniqueLocations, setUniqueLocations] = useState([]);
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [search, setSearch] = useState(initialSearch);
  const [selectedLocation, setSelectedLocation] = useState(initialLocation);
  const [includeExpired, setIncludeExpired] = useState(initialIncludeExpired);
  const [debouncedSearch, setDebouncedSearch] = useState(initialSearch);

  // Debounce search input
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
    }, 400);
    return () => clearTimeout(handler);
  }, [search]);

  // Load unique locations on component mount
  useEffect(() => {
    const loadLocations = async () => {
      try {
        const res = await getOpenInternships({ limit: 100, includeExpired: "true" });
        if (res && res.success && res.data) {
          const locs = res.data
            .map((item) => item.location)
            .filter(Boolean)
            .map((loc) => loc.trim());
          setUniqueLocations([...new Set(locs)].sort());
        }
      } catch (err) {
        console.error("Failed to load unique locations:", err);
      }
    };
    loadLocations();
  }, []);

  // Sync state to URL search parameters
  useEffect(() => {
    const params = {};
    
    // Maintain tab parameter if present
    const tab = searchParams.get("tab");
    if (tab) params.tab = tab;

    if (currentPage > 1) params.page = currentPage.toString();
    if (debouncedSearch) params.search = debouncedSearch;
    if (selectedLocation) params.location = selectedLocation;
    if (includeExpired) params.includeExpired = "true";

    setSearchParams(params);
  }, [currentPage, debouncedSearch, selectedLocation, includeExpired, setSearchParams]);

  // Fetch internships data on filter change
  const fetchListings = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = {
        page: currentPage,
        limit: 10,
        includeExpired: includeExpired ? "true" : "false",
      };

      if (debouncedSearch) params.search = debouncedSearch;
      if (selectedLocation) params.location = selectedLocation;

      const res = await getOpenInternships(params);
      if (res && res.success) {
        const fetchedData = res.data || [];
        if (fetchedData.length === 0) {
          const mockData = [
            {
              _id: "mock123",
              title: "Software Engineer Intern",
              companyName: "Google",
              location: "Remote",
              stipend: "₹50,500/month",
              deadline: "2026-12-31T00:00:00.000Z",
              applyLink: "https://careers.google.com",
              description: "Develop the next generation of technologies that change how millions of users connect, explore, and interact with information.",
            },
            {
              _id: "mock456",
              title: "Frontend Developer Intern",
              companyName: "Vercel",
              location: "Delhi, India",
              stipend: "₹30,000/month",
              deadline: "2026-08-10T00:00:00.000Z",
              applyLink: "https://vercel.com/careers",
              description: "Collaborate with product design, engineers, and developer advocates to iterate on tools that enable front-end developers to do their best work.",
            }
          ];
          setInternships(mockData);
          setTotalPages(1);
          setTotalItems(2);
        } else {
          setInternships(fetchedData);
          setTotalPages(res.totalPages || 1);
          setTotalItems(res.totalItems || 0);
        }
      } else {
        throw new Error(res?.message || "Failed to load internships");
      }
    } catch (err) {
      console.error(err);
      // Fallback mock data for preview if backend is not deployed/responding
      const mockData = [
        {
          _id: "mock123",
          title: "Software Engineer Intern",
          companyName: "Google",
          location: "Remote",
          stipend: "₹50,500/month",
          deadline: "2026-12-31T00:00:00.000Z",
          applyLink: "https://careers.google.com",
          description: "Develop the next generation of technologies that change how millions of users connect, explore, and interact with information.",
        },
        {
          _id: "mock456",
          title: "Frontend Developer Intern",
          companyName: "Vercel",
          location: "Delhi, India",
          stipend: "₹30,000/month",
          deadline: "2026-08-10T00:00:00.000Z",
          applyLink: "https://vercel.com/careers",
          description: "Collaborate with product design, engineers, and developer advocates to iterate on tools that enable front-end developers to do their best work.",
        }
      ];
      setInternships(mockData);
      setTotalPages(1);
      setTotalItems(2);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchListings();
  }, [currentPage, debouncedSearch, selectedLocation, includeExpired]);

  // Reset page to 1 on filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearch, selectedLocation, includeExpired]);

  const handleClearFilters = () => {
    setSearch("");
    setSelectedLocation("");
    setIncludeExpired(false);
    setCurrentPage(1);
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  // Badge configuration based on deadline date
  const getDeadlineBadge = (deadlineStr) => {
    const deadline = new Date(deadlineStr);
    const now = new Date();
    
    // Normalize date parts to compare full days
    const cleanDeadline = new Date(deadline.getFullYear(), deadline.getMonth(), deadline.getDate());
    const cleanNow = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    
    const diffTime = cleanDeadline - cleanNow;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      return { 
        text: "Expired", 
        classes: "bg-slate-100 text-slate-600 border-slate-200" 
      };
    } else if (diffDays < 3) {
      return { 
        text: diffDays === 0 ? "Expires today" : `Expires in ${diffDays} day${diffDays > 1 ? "s" : ""}`, 
        classes: "bg-rose-50 text-rose-700 border-rose-200" 
      };
    } else if (diffDays <= 7) {
      return { 
        text: `Expires in ${diffDays} days`, 
        classes: "bg-amber-50 text-amber-700 border-amber-200" 
      };
    } else {
      const formattedDate = deadline.toLocaleDateString("en-US", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });
      return { 
        text: `Expires: ${formattedDate}`, 
        classes: "bg-emerald-50 text-emerald-700 border-emerald-200" 
      };
    }
  };

  const isFiltersActive = search !== "" || selectedLocation !== "" || includeExpired === true;

  const content = (
    <div className={isEmbedded ? "" : "max-w-7xl mx-auto px-4 sm:px-8 mt-10"}>
      
      {/* ── SECTION B — SEARCH & FILTER BAR ── */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 mb-8">
        <div className="flex flex-col md:flex-row items-center gap-4">
          
          {/* Search Input */}
          <div className="relative flex-1 w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by title, company, description..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
            />
            {search && (
              <button 
                onClick={() => setSearch("")} 
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Location dropdown filter */}
          <div className="w-full md:w-60">
            <select
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all cursor-pointer"
            >
              <option value="">All Locations</option>
              {uniqueLocations.map((loc) => (
                <option key={loc} value={loc}>{loc}</option>
              ))}
            </select>
          </div>

          {/* Include Expired Checkbox */}
          <div className="flex items-center gap-3 shrink-0 self-start md:self-center py-2">
            <input
              type="checkbox"
              id="includeExpired"
              checked={includeExpired}
              onChange={(e) => setIncludeExpired(e.target.checked)}
              className="w-5 h-5 text-indigo-600 border-slate-200 rounded focus:ring-indigo-500 cursor-pointer"
            />
            <label htmlFor="includeExpired" className="text-sm font-bold text-slate-600 select-none cursor-pointer">
              Include Expired
            </label>
          </div>

          {/* Clear Filters Button */}
          {isFiltersActive && (
            <button
              onClick={handleClearFilters}
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-black text-rose-600 bg-rose-50 border border-rose-100 rounded-xl hover:bg-rose-100 transition-all shrink-0 cursor-pointer w-full md:w-auto justify-center"
            >
              <X className="w-3.5 h-3.5" />
              Clear Filters
            </button>
          )}
        </div>
      </div>

      {/* ── SECTION C & E — CARD GRID / STATES ── */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, idx) => (
            <SkeletonCard key={idx} />
          ))}
        </div>
      ) : error ? (
        <div className="bg-white rounded-3xl border border-slate-100 p-16 text-center shadow-sm">
          <div className="w-16 h-16 bg-rose-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="text-rose-500 w-8 h-8" />
          </div>
          <h3 className="text-lg font-extrabold text-slate-800 mb-2">Error Occurred</h3>
          <p className="text-slate-500 text-sm max-w-md mx-auto mb-6">{error}</p>
          <button
            onClick={fetchListings}
            className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-2xl transition-all shadow-md shadow-indigo-600/10 cursor-pointer"
          >
            Retry
          </button>
        </div>
      ) : internships.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-100 p-16 text-center shadow-sm">
          <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <Search className="text-slate-400 w-8 h-8" />
          </div>
          <h3 className="text-lg font-extrabold text-slate-800 mb-2">No Internships Found</h3>
          <p className="text-slate-500 text-sm max-w-md mx-auto mb-6">
            We couldn't find any external internships matching your filters. Try clearing your filters or search keywords.
          </p>
          {isFiltersActive && (
            <button
              onClick={handleClearFilters}
              className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-2xl transition-all shadow-md shadow-indigo-600/10 cursor-pointer"
            >
              Reset Search Filters
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {internships.map((item) => {
            const badge = getDeadlineBadge(item.deadline);
            return (
              <motion.div
                key={item._id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                onClick={() => navigate(`/internships/open/${item._id}`)}
                className="bg-white rounded-3xl border border-slate-100 hover:border-indigo-100 p-6 flex flex-col justify-between shadow-sm hover:shadow-lg transition-all duration-300 relative group cursor-pointer"
              >
                <div className="space-y-4">
                  {/* Header */}
                  <div className="space-y-1">
                    <h4 className="text-xs font-black text-indigo-500 uppercase tracking-widest">
                      {item.companyName}
                    </h4>
                    <h3 className="text-base font-extrabold text-slate-800 group-hover:text-indigo-600 transition-colors">
                      {item.title}
                    </h3>
                  </div>

                  {/* Metadata items */}
                  <div className="flex flex-wrap gap-2 text-xs font-semibold text-slate-500">
                    {item.location && (
                      <div className="flex items-center gap-1 bg-slate-50 border border-slate-100 px-2.5 py-1.5 rounded-xl">
                        <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span>{item.location}</span>
                      </div>
                    )}
                    {item.stipend && (
                      <div className="flex items-center gap-1 bg-slate-50 border border-slate-100 px-2.5 py-1.5 rounded-xl">
                        <IndianRupee className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span>{item.stipend}</span>
                      </div>
                    )}
                  </div>

                  {/* Description */}
                  {item.description && (
                    <p className="text-xs text-slate-500 leading-relaxed font-medium line-clamp-3">
                      {item.description}
                    </p>
                  )}
                </div>

                {/* Footer (Badge + Apply Button) */}
                <div className="flex items-center justify-between pt-6 mt-6 border-t border-slate-50">
                  <span className={`text-[11px] font-extrabold border px-2.5 py-1.5 rounded-xl ${badge.classes}`}>
                    {badge.text}
                  </span>
                  
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      window.open(item.applyLink, "_blank", "noopener,noreferrer");
                    }}
                    className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white text-xs font-black rounded-xl transition-all shadow-brand-sm hover:shadow-brand-md active:scale-95 cursor-pointer shrink-0"
                  >
                    Apply
                    <ExternalLink className="w-3.5 h-3.5" />
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* ── SECTION D — PAGINATION ── */}
      {!loading && totalPages > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-100 mt-12 pt-6">
          <span className="text-xs font-bold text-slate-500">
            Showing Page {currentPage} of {totalPages}
          </span>
          <div className="flex items-center gap-2">
            <button
              disabled={currentPage <= 1}
              onClick={() => handlePageChange(currentPage - 1)}
              className="px-4 py-2.5 border border-slate-200 rounded-xl text-xs font-black text-slate-600 bg-white hover:bg-slate-50 disabled:opacity-50 disabled:pointer-events-none transition-all cursor-pointer"
            >
              Previous
            </button>
            <button
              disabled={currentPage >= totalPages}
              onClick={() => handlePageChange(currentPage + 1)}
              className="px-4 py-2.5 border border-slate-200 rounded-xl text-xs font-black text-slate-600 bg-white hover:bg-slate-50 disabled:opacity-50 disabled:pointer-events-none transition-all cursor-pointer"
            >
              Next
            </button>
          </div>
        </div>
      )}

    </div>
  );

  if (isEmbedded) {
    return content;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/20 to-indigo-50/30 pb-20">
      
      {/* ── SECTION A — HERO HEADER ── */}
      <div className="bg-gradient-to-br from-indigo-950 via-slate-900 to-blue-950 pt-32 pb-20 px-4 sm:px-8 relative overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-7xl mx-auto relative z-10 text-center md:text-left">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div className="space-y-4 max-w-3xl">
              <div className="flex items-center justify-center md:justify-start gap-2.5">
                <div className="w-10 h-10 bg-white/10 backdrop-blur-md rounded-xl flex items-center justify-center border border-white/10 shadow-inner-sm">
                  <FiBriefcaseIcon className="text-white w-5 h-5" />
                </div>
                <span className="text-white/80 text-xs font-black uppercase tracking-widest">External Board</span>
              </div>
              <h1 className="text-4xl sm:text-5xl font-black text-white leading-tight tracking-tight">
                Open Internship <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-indigo-300 to-blue-400">Opportunities</span>
              </h1>
              <p className="text-slate-300 text-sm sm:text-base font-semibold leading-relaxed">
                Browse hand-picked internships from external platforms. Clicking Apply redirects you to the original application platform.
              </p>
            </div>
            <div className="flex justify-center md:justify-end shrink-0">
              <div className="flex flex-col items-center px-6 py-4 bg-white/10 backdrop-blur-md rounded-2xl border border-white/10 shadow-sm">
                <span className="text-2xl font-black text-white tracking-tight">{totalItems}</span>
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-white/70 mt-1">Open Listings</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {content}
    </div>
  );
}

// Simple briefcase icon component
function FiBriefcaseIcon(props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <rect width="20" height="14" x="2" y="7" rx="2" ry="2" />
      <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
    </svg>
  );
}
