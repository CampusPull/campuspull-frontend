import React, { useState, useContext, useEffect } from "react";
import { Helmet } from "react-helmet";
import { useSearchParams } from "react-router-dom";
import FilterSidebar from "./components/FilterSidebar";
import SearchBar from "./components/SearchBar";
import ViewToggle from "./components/ViewToggle";
import ResourceCard from "./components/ResourceCard";
import CareerRoadmapCard from "./components/CareerRoadmapCard";
import InterviewPYQSection from "./components/InterviewPYQSection";
import LoadingSkeleton from "./components/LoadingSkeleton";
import Icon from "../../components/AppIcon";
import { ResourceContext } from "../../context/resourceContext";
import UploadModal from "./components/uploadModel";
import EditResourceModal from "./components/EditResourceModal";
import DeleteResourceModal from "./components/DeleteResouceModal";
import SignupModal from "../../components/ui/SignupModal";
import { useAuth } from "../../context/AuthContext";
import ActiveFilters from "./components/ActiveFilters";
import { FiUploadCloud } from "react-icons/fi";
import AcademicResources from "pages/AcademicResources";
import { AcademicProvider } from "../../context/AcademicContext";
import api from "../../utils/api";

// ─── Stats pill ───────────────────────────────────────────────────────────────
const StatPill = ({ value, label }) => (
  <div className="flex flex-col items-center px-6 py-3.5 bg-white/10 backdrop-blur-md rounded-2xl border border-white/10 shadow-sm hover:bg-white/20 transition-all duration-300 select-none">
    <span className="text-2xl font-black text-white tracking-tight">
      {value}
    </span>
    <span className="text-[10px] font-extrabold uppercase tracking-widest text-white/70 mt-1">
      {label}
    </span>
  </div>
);

const ResourcesHub = () => {
  const {
    resources,
    roadmaps,
    pyqs,
    bookmarkedResources,
    loading,
    canEditResource,
    isGuest,
    showAuthModal,
    setShowAuthModal,
    refreshResources,
    refreshRoadmaps,
    refreshPYQs,
  } = useContext(ResourceContext);

  const context = useContext(ResourceContext);
  const getBookmarkedResources =
    context.getBookmarkedResources || context.refreshBookmarks;

  const { user } = useAuth();
  const [localBookmarks, setLocalBookmarks] = useState([]);
  const [searchParams, setSearchParams] = useSearchParams();

  // Helper to parse query arrays
  const getParamArray = (key) => {
    const val = searchParams.get(key);
    return val ? val.split(",") : [];
  };

  // State Management linked directly with URL Search Params
  const [searchQuery, setSearchQuery] = useState(
    searchParams.get("search") || "",
  );
  const [sortBy, setSortBy] = useState(searchParams.get("sortBy") || "newest");
  const [activeSection, setActiveSection] = useState(
    searchParams.get("type") || "academic",
  );
  const [viewMode, setViewMode] = useState("grid");
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [editingResource, setEditingResource] = useState(null);
  const [deletingResource, setDeletingResource] = useState(null);

  const [filters, setFilters] = useState({
    type: searchParams.get("type") || "academic",
    verifiedOnly: searchParams.get("verified") === "true",
    branch: getParamArray("branch"),
    semester: getParamArray("semester"),
    company: searchParams.get("company") || "",
    year: getParamArray("year"),
    difficulty: searchParams.get("difficulty") || "",
    tags: getParamArray("tags"),
    subName: searchParams.get("subName") || "",
  });

  // Keep type filter and activeSection tab perfectly in sync, and clear irrelevant filters when switching tabs
  useEffect(() => {
    setFilters((prev) => {
      const base = {
        type: activeSection,
        verifiedOnly: false,
        branch: [],
        semester: [],
        company: "",
        difficulty: "",
        tags: [],
        subName: "",
      };

      if (activeSection === "notes") {
        const academicYears = (prev.year || []).filter((y) =>
          ["1", "2", "3", "4"].includes(y),
        );
        return { ...base, year: academicYears };
      } else if (activeSection === "roadmaps") {
        const academicYears = (prev.year || []).filter((y) =>
          ["1", "2", "3", "4"].includes(y),
        );
        return { ...base, year: academicYears };
      } else if (activeSection === "pyqs") {
        const calendarYears = (prev.year || []).filter(
          (y) => !["1", "2", "3", "4"].includes(y),
        );
        return { ...base, year: calendarYears };
      } else {
        return { ...base, year: [] };
      }
    });

    if (activeSection === "roadmaps" && sortBy === "downloads") {
      setSortBy("newest");
    }
  }, [activeSection]);

  // Synchronize state with URL Query Parameters in real-time
  useEffect(() => {
    const params = {};
    if (searchQuery) params.search = searchQuery;
    if (sortBy && sortBy !== "newest") params.sortBy = sortBy;
    if (activeSection && activeSection !== "academic") params.type = activeSection;
    if (filters.verifiedOnly) params.verified = "true";

    if (activeSection === "notes") {
      if (filters.subName) params.subName = filters.subName;
      if (filters.year && filters.year.length > 0)
        params.year = filters.year.join(",");
    } else if (activeSection === "roadmaps") {
      if (filters.year && filters.year.length > 0)
        params.year = filters.year.join(",");
    } else if (activeSection === "pyqs") {
      if (filters.company) params.company = filters.company;
      if (filters.difficulty) params.difficulty = filters.difficulty;
      if (filters.year && filters.year.length > 0)
        params.year = filters.year.join(",");
    }

    setSearchParams(params, { replace: true });
  }, [searchQuery, sortBy, activeSection, filters, setSearchParams]);

  // Unified Server-Side Filter Fetcher
  useEffect(() => {
    if (isGuest) return;
    const triggerFetch = async () => {
      // 1. Fetch Notes
      if (activeSection === "notes") {
        const notesParams = { sortBy };
        if (searchQuery) notesParams.search = searchQuery;
        if (filters.subName) notesParams.subName = filters.subName;
        if (filters.year && filters.year.length > 0) {
          notesParams.year = filters.year.join(",");
        }
        await refreshResources(notesParams);
      }

      // 2. Fetch Roadmaps
      if (activeSection === "roadmaps") {
        const roadmapsParams = { sortBy };
        if (searchQuery) roadmapsParams.search = searchQuery;
        if (filters.year && filters.year.length > 0) {
          roadmapsParams.year = filters.year.join(",");
        }
        await refreshRoadmaps(roadmapsParams);
      }

      // 3. Fetch PYQs
      if (activeSection === "pyqs") {
        const pyqsParams = { sortBy };
        if (searchQuery) pyqsParams.search = searchQuery;
        if (filters.company) pyqsParams.company = filters.company;
        if (filters.difficulty) pyqsParams.difficulty = filters.difficulty;
        if (filters.year && filters.year.length > 0) {
          pyqsParams.year = filters.year.join(",");
        }
        await refreshPYQs(pyqsParams);
      }
    };

    const timeout = setTimeout(() => {
      triggerFetch();
    }, 300);
    return () => clearTimeout(timeout);
  }, [
    searchQuery,
    sortBy,
    activeSection,
    filters.subName,
    filters.year,
    filters.company,
    filters.difficulty,
    isGuest,
    refreshResources,
    refreshRoadmaps,
    refreshPYQs,
  ]);

  // Fetch bookmarks when tab is active
  useEffect(() => {
    if (activeSection === "bookmarks" && !isGuest) {
      if (typeof getBookmarkedResources === "function") {
        getBookmarkedResources();
      } else {
        const fetchBookmarksDirect = async () => {
          try {
            const res = await api.get("/resources/bookmarks", {
              headers: {
                Authorization: `Bearer ${user?.token || localStorage.getItem("token")}`,
              },
            });
            setLocalBookmarks(res.data);
          } catch (err) {
            console.error("Direct bookmarks fetch failed:", err);
          }
        };
        fetchBookmarksDirect();
      }
    }
  }, [activeSection, isGuest, getBookmarkedResources, user?.token]);

  // Synchronize localBookmarks with bookmarkedResources
  useEffect(() => {
    if (bookmarkedResources) {
      setLocalBookmarks(
        bookmarkedResources.filter((r) => r.isBookmarked !== false),
      );
    }
  }, [bookmarkedResources]);

  // Lock body scroll when mobile filter is open
  useEffect(() => {
    if (isMobileFilterOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileFilterOpen]);

  // Handle optimistic bookmark removal
  const handleBookmarkToggle = (resourceId, nextBookmarkedState) => {
    if (activeSection === "bookmarks" && !nextBookmarkedState) {
      setLocalBookmarks((prev) => prev.filter((r) => r._id !== resourceId));
    }
  };

  const handleFilterChange = (section, values) => {
    if (section === "type") {
      setActiveSection(values);
    }
    setFilters((prev) => ({ ...prev, [section]: values }));
  };

  const handleRemoveFilter = (category, value) => {
    if (category === "search") {
      setSearchQuery("");
    } else if (category === "type") {
      setActiveSection("all");
    } else if (category === "verifiedOnly") {
      setFilters((prev) => ({ ...prev, verifiedOnly: false }));
    } else if (
      category === "subName" ||
      category === "company" ||
      category === "difficulty"
    ) {
      setFilters((prev) => ({ ...prev, [category]: "" }));
    } else {
      setFilters((prev) => ({
        ...prev,
        [category]: prev[category].filter((v) => v !== value),
      }));
    }
  };

  const handleClearAllFilters = () => {
    setSearchQuery("");
    setActiveSection("all");
    setFilters({
      type: "academic",
      verifiedOnly: false,
      branch: [],
      semester: [],
      company: "",
      year: [],
      difficulty: "",
      tags: [],
      subName: "",
    });
  };

  // Guests can never upload
  const canUploadNotes =
    !isGuest && ["admin", "teacher", "alumni"].includes(user?.role);
  const canUploadAll = !isGuest && user?.role === "admin";
  const canUpload = canUploadNotes || canUploadAll;

  // ─── Precision Search & Filter Logic ───

  // 1. Study Notes
  const filteredResources =
    resources?.filter((res) => {
      if (isGuest && searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchTitle = res.title?.toLowerCase().includes(query);
        const matchDesc = res.description?.toLowerCase().includes(query);
        const matchTags = res.tags?.some((t) =>
          t.toLowerCase().includes(query),
        );
        if (!matchTitle && !matchDesc && !matchTags) return false;
      }

      if (activeSection === "notes") {
        if (
          filters.subName &&
          !res.subName?.toLowerCase().includes(filters.subName.toLowerCase())
        )
          return false;
        if (
          filters.year &&
          filters.year.length > 0 &&
          !filters.year.includes(String(res.year))
        )
          return false;
      }

      return true;
    }) || [];

  // 2. Career Roadmaps
  const filteredRoadmaps =
    roadmaps?.filter((road) => {
      if (isGuest && searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchTitle = road.title?.toLowerCase().includes(query);
        const matchDesc = road.description?.toLowerCase().includes(query);
        if (!matchTitle && !matchDesc) return false;
      }

      if (activeSection === "roadmaps") {
        if (
          filters.year &&
          filters.year.length > 0 &&
          !filters.year.includes(String(road.year))
        )
          return false;
      }

      return true;
    }) || [];

  // 3. Interview PYQs
  const filteredPyqs =
    pyqs?.filter((pyq) => {
      if (isGuest && searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchCompany = pyq.company?.toLowerCase().includes(query);
        const matchDesc = pyq.description?.toLowerCase().includes(query);
        if (!matchCompany && !matchDesc) return false;
      }

      if (activeSection === "pyqs") {
        if (
          filters.company &&
          !pyq.company?.toLowerCase().includes(filters.company.toLowerCase())
        )
          return false;
        if (filters.difficulty && pyq.difficulty !== filters.difficulty)
          return false;
        if (
          filters.year &&
          filters.year.length > 0 &&
          !filters.year.includes(String(pyq.year))
        )
          return false;
      }

      return true;
    }) || [];

  // Sorting
  const sortFn = (a, b) => {
    switch (sortBy) {
      case "newest":
        return new Date(b.createdAt) - new Date(a.createdAt);
      case "popular":
      case "downloads":
        return (b.downloads || 0) - (a.downloads || 0);
      case "rating":
        return (b.rating || 0) - (a.rating || 0);
      case "views":
        return (b.views || 0) - (a.views || 0);
      default:
        return 0;
    }
  };

  const sortedResources = [...filteredResources].sort(sortFn);
  const sortedRoadmaps = [...filteredRoadmaps].sort(sortFn);
  const sortedPyqs = [...filteredPyqs].sort(sortFn);

  // Result Counts
  let displayedCount = 0;
  if (activeSection === "all") {
    displayedCount =
      sortedResources.length + sortedRoadmaps.length + sortedPyqs.length;
  } else if (activeSection === "notes") displayedCount = sortedResources.length;
  else if (activeSection === "roadmaps") displayedCount = sortedRoadmaps.length;
  else if (activeSection === "pyqs") displayedCount = sortedPyqs.length;
  else if (activeSection === "bookmarks")
    displayedCount = localBookmarks.length;

  const totalRawCount =
    (resources?.length || 0) + (roadmaps?.length || 0) + (pyqs?.length || 0);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/20 to-indigo-50/30 text-slate-800 pb-20 select-none">
        <div className="bg-gradient-to-br from-indigo-950 via-slate-900 to-blue-950 pt-24 pb-16 px-6 relative overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none" />
          <div className="max-w-[1800px] mx-auto relative z-10 w-full">
            <div className="h-8 bg-white/10 rounded-lg w-1/3 animate-pulse mb-3" />
            <div className="h-12 bg-white/10 rounded-lg w-1/2 animate-pulse" />
          </div>
        </div>
        <div className="max-w-[1800px] mx-auto w-full px-4 md:px-8 lg:px-12 py-6">
          <LoadingSkeleton viewMode={viewMode} />
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Resources Hub - CampusPull | Knowledge Without Boundaries</title>
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/20 to-indigo-50/30 text-slate-800 selection:bg-indigo-500/20 pb-20">
        {/* ── Hero Header ── */}
        <div className="bg-gradient-to-br from-indigo-950 via-slate-900 to-blue-950 pt-24 pb-16 px-6 relative overflow-hidden">
          {/* Ambient Glowing Blobs */}
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none" />

          <div className="max-w-[1800px] mx-auto relative z-10 w-full">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
              <div className="space-y-4 text-left">
                <div className="flex items-center gap-2.5 font-sans">
                  <div className="w-10 h-10 bg-white/10 backdrop-blur-md rounded-xl flex items-center justify-center border border-white/10 shadow-inner-sm">
                    <Icon name="BookOpen" size={18} className="text-white" />
                  </div>
                  <span className="text-white/80 text-xs font-black uppercase tracking-widest">
                    Knowledge Hub
                  </span>
                </div>
                <h1 className="text-4xl sm:text-5xl font-black text-white leading-tight tracking-tight">
                  Resources <br className="sm:hidden" />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-indigo-300 to-blue-400">
                    Hub
                  </span>
                </h1>
                <p className="text-slate-300 text-sm sm:text-base font-semibold max-w-md leading-relaxed">
                  Discover study notes, Verified Teacher notes, roadmaps, and
                  Interview PYQs.
                </p>
              </div>

              <div className="flex items-center gap-4 flex-wrap">
                <StatPill
                  value={resources?.length || "0"}
                  label="Study Notes"
                />
                <StatPill value={roadmaps?.length || "0"} label="Roadmaps" />
                <StatPill value={pyqs?.length || "0"} label="PYQs" />
              </div>
            </div>
          </div>
        </div>

        {/* ── Guest Banner ── */}
        {isGuest && (
          <div className="max-w-[1800px] mx-auto px-4 md:px-8 lg:px-12 -mt-6 mb-0 relative z-20 w-full">
            <div
              className="bg-white/95 backdrop-blur-xl rounded-2xl border border-indigo-100 p-4.5 flex flex-col sm:flex-row items-center justify-between gap-4 text-left"
              style={{ boxShadow: "0 10px 30px -10px rgba(79,70,229,0.15)" }}
            >
              <p className="text-slate-700 font-semibold text-sm leading-relaxed">
                👋{" "}
                <strong className="text-indigo-600 font-extrabold">
                  Browsing as guest.
                </strong>{" "}
                Create a free account to download resources and bookmark them.
              </p>
              <button
                onClick={() => setShowAuthModal(true)}
                className="shrink-0 w-full sm:w-auto px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-blue-600 text-white text-xs font-black rounded-xl hover:shadow-md hover:shadow-indigo-500/10 hover:scale-102 transition-all duration-200 cursor-pointer border-none"
              >
                Join Now
              </button>
            </div>
          </div>
        )}

        {/* ── Main Content Area ── */}
        <div className="max-w-[1800px] mx-auto w-full px-4 md:px-8 lg:px-12 py-6">
          {/* Mobile Filter Drawer (Overlay drawer) */}
          {isMobileFilterOpen && activeSection !== "bookmarks" && (
            <FilterSidebar
              activeType={activeSection}
              filters={filters}
              onFilterChange={handleFilterChange}
              onClearFilters={handleClearAllFilters}
              isMobile={true}
              onClose={() => setIsMobileFilterOpen(false)}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              sortBy={sortBy}
              onSortChange={setSortBy}
            />
          )}

          {/* Main Content Pane */}
          <div className="w-full space-y-6">
            <SearchBar
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              onFilterToggle={() => setIsMobileFilterOpen(true)}
              isMobile={true}
              hideFilterButton={activeSection === "bookmarks"}
            />

            {/* Tabs Section */}
            <div className="flex items-center justify-center gap-1 overflow-x-auto scrollbar-none flex-nowrap px-4">
              {[
                {
                  key: "academic",
                  label: "Academic",
                  icon: "GraduationCap",
                },

                {
                  key: "notes",
                  label: "General Notes",
                  count: resources?.length || 0,
                  icon: "FileText",
                },

                {
                  key: "roadmaps",
                  label: "Career Roadmaps",
                  count: roadmaps?.length || 0,
                  icon: "Route",
                },

                {
                  key: "pyqs",
                  label: "Interview PYQs",
                  count: pyqs?.length || 0,
                  icon: "MessageCircle",
                },

                ...(!isGuest
                  ? [
                      {
                        key: "bookmarks",
                        label: "Bookmarks",
                        count: localBookmarks.length,
                        icon: "Bookmark",
                      },
                    ]
                  : []),
              ].map((section) => {
                const isActive = activeSection === section.key;
                return (
                  <button
                    key={section.key}
                    onClick={() => setActiveSection(section.key)}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap cursor-pointer transition-all border ${
                      isActive
                        ? "bg-indigo-600 text-white border-indigo-600 shadow-md"
                        : "bg-white border-slate-200 text-slate-500 hover:bg-slate-50"
                    }`}
                  >
                    <Icon name={section.icon} size={15} />
                    <span>{section.label}</span>
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs font-bold ${
                        isActive
                          ? "bg-white/20 text-white"
                          : "bg-indigo-100 text-indigo-600"
                      }`}
                    >
                      {section.count}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Active Filter Chips */}
            <ActiveFilters
              filters={{ ...filters, search: searchQuery }}
              onRemoveFilter={handleRemoveFilter}
              onClearAll={handleClearAllFilters}
            />

            {/* View Toggle Bar (includes SortDropdown and ViewMode) */}
            <ViewToggle
              viewMode={viewMode}
              onViewModeChange={setViewMode}
              totalResults={displayedCount}
              sortBy={sortBy}
              onSortChange={setSortBy}
            />

            {/* Empty State Banner */}
            {displayedCount === 0 && (
              <div className="flex flex-col items-center justify-center p-16 bg-white rounded-3xl border border-dashed border-slate-200 text-center shadow-sm">
                <div className="w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center mb-6 border border-indigo-100/50 shadow-inner">
                  <Icon
                    name={
                      activeSection === "bookmarks" ? "Bookmark" : "FolderOpen"
                    }
                    size={28}
                    className="text-indigo-500 opacity-80 animate-pulse"
                  />
                </div>
                <h4 className="text-xl font-extrabold text-slate-800 mb-2 font-poppins">
                  {activeSection === "bookmarks"
                    ? "No bookmarks yet."
                    : "No resources match your filters"}
                </h4>
                <p className="text-sm text-slate-500 font-semibold max-w-sm leading-relaxed mb-6">
                  {activeSection === "bookmarks"
                    ? "Save resources by clicking the bookmark icon on any card."
                    : "We couldn't find any resources matching your search options. Try adjusting your checkboxes or reset them below."}
                </p>
                {activeSection !== "bookmarks" && (
                  <button
                    onClick={handleClearAllFilters}
                    className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-blue-600 text-white text-xs font-black rounded-xl shadow-md shadow-indigo-500/10 hover:scale-103 active:scale-98 transition-all duration-200 cursor-pointer border-none"
                  >
                    Reset All Filters
                  </button>
                )}
              </div>
            )}

            {activeSection === "academic" && (
              <AcademicProvider>
                <AcademicResources />
              </AcademicProvider>
            )}

            {/* BOOKMARKS */}
            {displayedCount > 0 &&
              activeSection === "bookmarks" &&
              localBookmarks.length > 0 && (
                <div className="space-y-4 text-left">
                  <div
                    className={
                      viewMode === "grid"
                        ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5"
                        : "flex flex-col gap-4"
                    }
                  >
                    {localBookmarks.map((resource) => (
                      <ResourceCard
                        key={resource._id}
                        resource={{ ...resource, isBookmarked: true }}
                        viewMode={viewMode}
                        canEdit={
                          !isGuest &&
                          canEditResource(resource, resource.type || "notes")
                        }
                        onEditClick={() =>
                          setEditingResource({
                            data: resource,
                            type: resource.type || "notes",
                          })
                        }
                        onDeleteClick={() =>
                          setDeletingResource({
                            ...resource,
                            type: resource.type || "notes",
                          })
                        }
                        isGuest={isGuest}
                        onRestrictedAction={() => setShowAuthModal(true)}
                        onBookmarkToggle={handleBookmarkToggle}
                      />
                    ))}
                  </div>
                </div>
              )}

            {/* NOTES */}
            {displayedCount > 0 &&
               activeSection === "notes" &&
              sortedResources.length > 0 && (
                <div className="space-y-8 text-left">
                  {activeSection === "all" && (
                    <h3 className="text-xl sm:text-2xl font-black font-poppins text-slate-800 border-b border-slate-100 pb-3">
                      Study Notes
                    </h3>
                  )}
                  {Object.entries(
                    sortedResources.reduce((acc, resource) => {
                      const category = resource.branch || "Uncategorized";
                      if (!acc[category]) acc[category] = [];
                      acc[category].push(resource);
                      return acc;
                    }, {}),
                  ).map(([category, resourcesInCategory]) => (
                    <div key={category} className="space-y-4">
                      <h4 className="text-base sm:text-lg font-extrabold text-indigo-600 capitalize flex items-center gap-2.5">
                        <Icon
                          name="Folder"
                          size={18}
                          className="text-indigo-500"
                        />
                        <span>{category.replace(/-/g, " ")}</span>
                        <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 border border-indigo-100 px-2.5 py-0.5 rounded-full shadow-sm">
                          {resourcesInCategory.length}
                        </span>
                      </h4>
                      <div
                        className={
                          viewMode === "grid"
                            ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5"
                            : "flex flex-col gap-4"
                        }
                      >
                        {resourcesInCategory.map((resource) => (
                          <ResourceCard
                            key={resource._id}
                            resource={resource}
                            viewMode={viewMode}
                            canEdit={
                              !isGuest && canEditResource(resource, "notes")
                            }
                            onEditClick={() =>
                              setEditingResource({
                                data: resource,
                                type: "notes",
                              })
                            }
                            onDeleteClick={() =>
                              setDeletingResource({
                                ...resource,
                                type: "notes",
                              })
                            }
                            isGuest={isGuest}
                            onRestrictedAction={() => setShowAuthModal(true)}
                            onBookmarkToggle={handleBookmarkToggle}
                          />
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}

            {/* ROADMAPS */}
            {displayedCount > 0 &&
              ( activeSection === "roadmaps") &&
              sortedRoadmaps.length > 0 && (
                <div className="space-y-4 text-left">
                  {activeSection === "all" && (
                    <h3 className="text-xl sm:text-2xl font-black font-poppins text-slate-800 border-b border-slate-100 pb-3 pt-6">
                      Career Roadmaps
                    </h3>
                  )}
                  <div
                    className={
                      viewMode === "grid"
                        ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5"
                        : "flex flex-col gap-4"
                    }
                  >
                    {sortedRoadmaps.map((roadmap) => (
                      <CareerRoadmapCard
                        key={roadmap._id}
                        roadmap={roadmap}
                        viewMode={viewMode}
                        canEdit={
                          !isGuest && canEditResource(roadmap, "roadmaps")
                        }
                        onEditClick={() =>
                          setEditingResource({
                            data: roadmap,
                            type: "roadmaps",
                          })
                        }
                        onDeleteClick={(roadmap) =>
                          setDeletingResource({ ...roadmap, type: "roadmap" })
                        }
                        isGuest={isGuest}
                        onRestrictedAction={() => setShowAuthModal(true)}
                      />
                    ))}
                  </div>
                </div>
              )}

            {/* PYQS */}
            {displayedCount > 0 &&
              ( activeSection === "pyqs") &&
              sortedPyqs.length > 0 && (
                <div className="space-y-4 text-left">
                  {activeSection === "all" && (
                    <h3 className="text-xl sm:text-2xl font-black font-poppins text-slate-800 border-b border-slate-100 pb-3 pt-6">
                      Interview PYQs
                    </h3>
                  )}
                  <InterviewPYQSection
                    pyqs={sortedPyqs}
                    viewMode={viewMode}
                    canEdit={(pyq) => !isGuest && canEditResource(pyq, "pyqs")}
                    onEditClick={(pyq) =>
                      setEditingResource({ data: pyq, type: "pyqs" })
                    }
                    onDeleteClick={(pyq) =>
                      setDeletingResource({ ...pyq, type: "pyq" })
                    }
                  />
                </div>
              )}
          </div>
        </div>

        {/* Floating bottom Upload button */}
        {canUpload && (
          <button
            onClick={() => setIsUploadOpen(true)}
            className="group fixed bottom-6 right-6 z-50 flex items-center gap-2 overflow-hidden bg-gradient-to-r from-indigo-600 to-blue-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 w-14 h-14 md:hover:w-36 md:hover:px-5 justify-center md:hover:justify-start border border-indigo-400/20"
            title="Upload Resource"
          >
            <FiUploadCloud size={22} className="shrink-0" />
            <span className="opacity-0 md:group-hover:opacity-100 whitespace-nowrap text-sm font-bold transition-all duration-300 overflow-hidden max-w-0 md:group-hover:max-w-xs">
              Upload
            </span>
          </button>
        )}

        {isUploadOpen && (
          <UploadModal
            isOpen
            onClose={() => setIsUploadOpen(false)}
            canUploadNotes={canUploadNotes}
            canUploadAll={canUploadAll}
          />
        )}

        {editingResource && (
          <EditResourceModal
            isOpen
            resource={editingResource.data}
            type={editingResource.type}
            onClose={() => setEditingResource(null)}
          />
        )}

        {deletingResource && (
          <DeleteResourceModal
            isOpen
            resource={deletingResource}
            onClose={() => setDeletingResource(null)}
          />
        )}

        {showAuthModal && (
          <SignupModal
            isOpen={showAuthModal}
            onClose={() => setShowAuthModal(false)}
            message="Create an account to download and bookmark resources"
          />
        )}
      </div>
    </>
  );
};

export default ResourcesHub;
