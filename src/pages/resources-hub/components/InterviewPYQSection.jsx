import React, { useState, useMemo, useContext } from "react";
import Icon from "../../../components/AppIcon";
import Image from "../../../components/AppImage";
import Button from "../../../components/ui/Button";
import { ResourceContext } from "../../../context/resourceContext";

const InterviewPYQSection = ({ pyqs, viewMode = "grid", onEditClick, onDeleteClick }) => {
  const { user, setShowAuthModal, incrementDownload } = useContext(ResourceContext);

  const handleAccess = async (e, pyq) => {
    e?.stopPropagation();
    if (isGuest) {
      setShowAuthModal(true);
      return;
    }
    try {
      await incrementDownload(pyq._id, "pyq");
      if (pyq?.link) window.open(pyq.link, "_blank");
    } catch (err) {
      console.error("Failed to access PYQ:", err);
    }
  };
  const [selectedCompany, setSelectedCompany] = useState("all");
  const [selectedDifficulty, setSelectedDifficulty] = useState("all");
  const [showAllCompanies, setShowAllCompanies] = useState(false);
  const VISIBLE_COMPANY_COUNT = 8;

  // Check user roles and permissions
  const isGuest = !user;
  const isAdmin = !isGuest && user?.role === "admin";

  // --- Helpers ---
  const difficultyLevels = [
    { value: "all", label: "All Levels" },
    {
      value: "beginner",
      label: "Easy",
      color: "text-emerald-600 bg-emerald-50 border-emerald-100",
    },
    {
      value: "intermediate",
      label: "Medium",
      color: "text-amber-600 bg-amber-50 border-amber-100",
    },
    {
      value: "advanced",
      label: "Hard",
      color: "text-rose-600 bg-rose-50 border-rose-100",
    },
  ];

  const getDifficultyColor = (difficulty) => {
    const colors = {
      beginner: "text-emerald-600 bg-emerald-50 border-emerald-100/50",
      intermediate: "text-amber-600 bg-amber-50 border-amber-100/50",
      advanced: "text-rose-600 bg-rose-50 border-rose-100/50",
    };
    return colors?.[difficulty] || colors?.intermediate;
  };

  const getDifficultyLabel = (val) =>
    difficultyLevels.find((l) => l.value === val)?.label || val;

  // --- Filter Logic ---
  const companyFilters = useMemo(() => {
    const counts = (pyqs || []).reduce((acc, pyq) => {
      if (pyq.company) acc[pyq.company] = (acc[pyq.company] || 0) + 1;
      return acc;
    }, {});

    const sortedCompanies = Object.entries(counts)
      .sort(([, countA], [, countB]) => countB - countA)
      .map(([name, count]) => ({ value: name, label: name, count }));

    return [
      { value: "all", label: "All Companies", count: pyqs?.length || 0 },
      ...sortedCompanies,
    ];
  }, [pyqs]);

  const visibleCompanies = useMemo(() => {
    if (showAllCompanies) return companyFilters;

    const sliced = companyFilters.slice(0, VISIBLE_COMPANY_COUNT);

    if (
      selectedCompany !== "all" &&
      !sliced.some((c) => c.value === selectedCompany)
    ) {
      const selected = companyFilters.find((c) => c.value === selectedCompany);
      return selected ? [...sliced, selected] : sliced;
    }

    return sliced;
  }, [showAllCompanies, companyFilters, selectedCompany]);

  const filteredPYQs = (pyqs || []).filter((pyq) => {
    const companyMatch =
      selectedCompany === "all" || pyq?.company === selectedCompany;
    const difficultyMatch =
      selectedDifficulty === "all" || pyq?.difficulty === selectedDifficulty;
    return companyMatch && difficultyMatch;
  });

  const accentColors = [
    "from-indigo-500 to-blue-500",
    "from-violet-500 to-purple-500",
    "from-blue-500 to-cyan-500",
    "from-emerald-500 to-teal-500",
    "from-rose-500 to-pink-500",
  ];

  return (
    <div className="space-y-6 text-left">
      {/* --- Filters Section --- */}
      <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Company Filter */}
          <div>
            <label className="block text-xs font-extrabold text-slate-400 uppercase tracking-widest mb-3">
              Filter by Company
            </label>
            <div className="flex flex-wrap gap-2">
              {visibleCompanies?.map((company) => (
                <button
                  key={company?.value}
                  onClick={() => setSelectedCompany(company?.value)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all duration-200 cursor-pointer ${
                    selectedCompany === company?.value
                      ? "bg-gradient-to-r from-indigo-600 to-blue-600 text-white border-none shadow-sm"
                      : "bg-slate-50 text-slate-500 border-slate-200/60 hover:border-indigo-200 hover:text-indigo-600 hover:bg-indigo-50/50"
                  }`}
                >
                  {company?.label}
                  <span
                    className={`ml-1.5 text-[10px] font-bold ${selectedCompany === company?.value ? "text-indigo-100" : "text-slate-400"}`}
                  >
                    {company?.count}
                  </span>
                </button>
              ))}
              {companyFilters.length > VISIBLE_COMPANY_COUNT && (
                <button
                  onClick={() => setShowAllCompanies((prev) => !prev)}
                  className="px-3 py-1.5 rounded-xl text-xs font-extrabold cursor-pointer
               border border-dashed border-slate-300 bg-transparent
               text-slate-400 hover:text-indigo-600
               hover:border-indigo-400 transition"
                >
                  {showAllCompanies
                    ? "Show less"
                    : `Show all (${companyFilters.length - 1})`}
                </button>
              )}
            </div>
          </div>

          {/* Difficulty Filter */}
          <div>
            <label className="block text-xs font-extrabold text-slate-400 uppercase tracking-widest mb-3">
              Difficulty Level
            </label>
            <div className="flex flex-wrap gap-2">
              {difficultyLevels?.map((level) => (
                <button
                  key={level?.value}
                  onClick={() => setSelectedDifficulty(level?.value)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all duration-200 cursor-pointer ${
                    selectedDifficulty === level?.value
                      ? "bg-gradient-to-r from-indigo-600 to-blue-600 text-white border-none shadow-sm"
                      : "bg-slate-50 text-slate-500 border-slate-200/60 hover:border-indigo-200 hover:text-indigo-600 hover:bg-indigo-50/50"
                  }`}
                >
                  {level?.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* --- PYQ Cards List --- */}
      <div
        className={
          viewMode === "grid"
            ? "grid grid-cols-1 lg:grid-cols-2 gap-6"
            : "flex flex-col gap-4"
        }
      >
        {filteredPYQs?.map((pyq) => {
          const ownerId = pyq?.uploadedBy?._id || pyq?.uploadedBy;
          const isOwner = !isGuest && user?._id === ownerId;
          const showActions = isOwner || isAdmin;
          const accent = accentColors[(pyq.company?.charCodeAt(0) || 0) % accentColors.length];

          // ==========================================
          // LIST VIEW ITEM
          // ==========================================
          if (viewMode === "list") {
            return (
              <div
                key={pyq._id}
                className="group bg-white border border-slate-100 rounded-3xl p-5 hover:shadow-[0_12px_30px_-8px_rgba(79,70,229,0.12)] relative transition-all duration-300"
              >
                {/* Accent line top */}
                <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${accent} rounded-t-3xl`} />
                
                <div className="flex flex-col sm:flex-row items-start gap-5 pt-1">
                  <div className="flex-shrink-0 w-16 h-16 bg-slate-50 rounded-2xl shadow-sm border-2 border-slate-100 flex items-center justify-center overflow-hidden p-2 group-hover:scale-105 transition-transform">
                    {pyq.thumbnail ? (
                      <Image
                        src={pyq.thumbnail}
                        alt={pyq.company}
                        className="w-full h-full object-contain"
                      />
                    ) : (
                      <Icon name="Briefcase" size={28} className="text-indigo-400" />
                    )}
                  </div>

                  <div className="flex-1 w-full">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-extrabold text-slate-800 text-lg group-hover:text-indigo-600 transition-colors leading-snug">
                          {pyq.company}
                        </h3>
                        <p className="text-slate-400 text-sm font-bold mt-0.5">
                          {pyq.title}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <div
                          className={`px-2.5 py-1 rounded-xl text-[10px] font-black uppercase tracking-widest border ${getDifficultyColor(pyq?.difficulty)}`}
                        >
                          {getDifficultyLabel(pyq?.difficulty)}
                        </div>
                        <div className="flex items-center gap-1 text-[11px] font-bold text-slate-400 bg-slate-50 border border-slate-200 px-2 py-1 rounded-xl shadow-sm">
                          <Icon name="Download" size={13} className="text-slate-400" />
                          <span>{pyq.downloads || 0}</span>
                        </div>
                      </div>
                    </div>

                    <p className="text-slate-400 text-sm mb-3 line-clamp-2 leading-relaxed font-semibold">
                      {pyq.description || "No description provided."}
                    </p>

                    <div className="flex flex-wrap gap-2 mb-4">
                      {pyq.tags?.slice(0, 5).map((tag, i) => (
                        <span
                          key={i}
                          className="px-2.5 py-0.5 bg-indigo-50 text-indigo-600 text-[10px] rounded-md border border-indigo-100/30 font-bold"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                      <div className="flex items-center gap-2">
                        <Image
                          src={pyq?.uploadedBy?.avatar}
                          className="w-5 h-5 rounded-full border border-slate-100 shadow-sm ring-2 ring-indigo-500/10"
                        />
                        <span className="text-xs text-slate-500 font-extrabold">
                          by {pyq?.uploadedBy?.name}
                        </span>
                      </div>
                      <div className="flex gap-2">
                        {showActions && (
                          <>
                            <button
                              className="border border-slate-200 hover:border-slate-300 text-slate-500 hover:text-slate-800 hover:bg-slate-50 font-bold px-3 py-1.5 text-xs rounded-xl bg-transparent cursor-pointer"
                              onClick={() => onEditClick(pyq)}
                            >
                              Edit
                            </button>
                            <button
                              className="text-red-500 border border-red-200 hover:bg-red-50 hover:border-red-300 font-bold px-3 py-1.5 text-xs rounded-xl bg-transparent cursor-pointer"
                              onClick={() => onDeleteClick(pyq)}
                            >
                              Delete
                            </button>
                          </>
                        )}
                        <button
                          className="bg-gradient-to-r from-indigo-500 to-blue-500 text-white font-bold px-4 py-2 rounded-xl border-none shadow-sm hover:shadow-lg text-xs cursor-pointer flex items-center justify-center gap-1"
                          onClick={(e) => handleAccess(e, pyq)}
                        >
                          View PYQ
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          }

          // ==========================================
          // GRID VIEW ITEM
          // ==========================================
          return (
            <div
              key={pyq?._id}
              className="group bg-white border border-slate-100 rounded-3xl overflow-hidden hover:shadow-[0_12px_30px_-8px_rgba(79,70,229,0.12)] transition-all duration-300 flex flex-col h-full relative shadow-inner-sm text-left"
            >
              {/* Dynamic top gradient line */}
              <div className={`h-1.5 bg-gradient-to-r ${accent} transition-transform duration-300 group-hover:scale-y-110 shrink-0`} />

              <div className="relative h-32 rounded-xl overflow-hidden mb-4 border border-slate-100 bg-slate-50 shrink-0 mt-3 mx-3">
                {pyq.thumbnail ? (
                  <>
                    <Image
                      src={pyq.thumbnail}
                      alt={pyq.company}
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/10" />
                  </>
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-r from-indigo-50/50 to-blue-50/50" />
                )}

                <div className="relative z-10 p-4 h-full flex flex-col justify-end">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-slate-800 font-extrabold text-lg leading-tight drop-shadow-sm">
                        {pyq.company}
                      </h3>
                      <p className="text-indigo-600 text-sm font-extrabold mt-0.5 drop-shadow-sm">
                        {pyq.title}
                      </p>
                    </div>

                    <div className="flex items-center gap-1.5 flex-shrink-0">
                      <div
                        className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border bg-white/95 shadow-sm ${getDifficultyColor(pyq?.difficulty).split(' ').slice(0,1).join(' ')}`}
                      >
                        {getDifficultyLabel(pyq?.difficulty)}
                      </div>
                      <div className="flex items-center gap-1 text-[10px] font-bold text-slate-500 bg-white/95 px-2.5 py-1 rounded-lg border border-slate-200 shadow-sm">
                        <Icon name="Download" size={11} className="text-slate-400" />
                        <span>{pyq.downloads || 0}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="px-5 flex-1 flex flex-col">
                <div className="bg-slate-50/50 p-4 rounded-2xl border border-slate-100 mb-4 flex-grow font-semibold text-slate-400 text-sm leading-relaxed">
                  <p className="line-clamp-3">
                    {pyq?.description || "No description provided."}
                  </p>
                </div>

                <div className="flex flex-wrap gap-1.5 mb-5">
                  {pyq?.tags?.length > 0 ? (
                    pyq.tags.slice(0, 4).map((topic, index) => (
                      <span
                        key={index}
                        className="px-2.5 py-1 bg-indigo-50 text-indigo-600 text-[10px] font-bold rounded-md border border-indigo-100/30"
                      >
                        {topic}
                      </span>
                    ))
                  ) : (
                    <span className="text-xs text-slate-400 italic">
                      No topics listed.
                    </span>
                  )}
                  {pyq?.tags?.length > 4 && (
                    <span className="px-2.5 py-1 bg-slate-100 text-slate-500 text-[10px] font-bold rounded-md border border-slate-200">
                      +{pyq?.tags?.length - 4}
                    </span>
                  )}
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-slate-100 mt-auto pb-4">
                  <div className="flex items-center space-x-2">
                    <Image
                      src={pyq?.uploadedBy?.avatar}
                      alt={pyq?.uploadedBy?.name}
                      className="w-6 h-6 rounded-full border border-slate-100 shadow-sm ring-2 ring-indigo-500/10"
                    />
                    <span className="text-xs text-slate-500 font-extrabold">
                      by {pyq?.uploadedBy?.name}
                    </span>
                    {pyq?.uploadedBy?.verified && (
                      <Icon name="BadgeCheck" size={14} className="text-blue-500" />
                    )}
                  </div>
                  <div className="flex space-x-2">
                    {showActions && (
                      <>
                        <button
                          className="border border-slate-200 hover:border-slate-300 text-slate-500 hover:text-slate-800 hover:bg-slate-50 font-bold rounded-xl py-2 px-3 transition-all text-xs cursor-pointer bg-transparent"
                          onClick={() => onEditClick(pyq)}
                        >
                          Edit
                        </button>
                        <button
                          className="text-red-500 border border-red-200 hover:bg-red-50 hover:border-red-300 transition-all rounded-xl py-2 px-3 cursor-pointer bg-transparent border"
                          onClick={() => onDeleteClick(pyq)}
                        >
                          <Icon name="Trash2" size={14} />
                        </button>
                      </>
                    )}
                    <button
                      className="bg-gradient-to-r from-indigo-500 to-blue-500 text-white font-bold rounded-xl py-2 px-4.5 active:scale-95 transition-all border-none text-xs cursor-pointer flex items-center justify-center shadow-md hover:shadow-lg"
                      onClick={(e) => handleAccess(e, pyq)}
                    >
                      Access
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* No Results Message */}
      {filteredPYQs?.length === 0 && (
        <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-slate-200 shadow-sm">
          <Icon
            name="Search"
            size={48}
            className="mx-auto mb-4 opacity-50 text-slate-400"
          />
          <h3 className="text-lg font-bold text-slate-700 mb-1">
            No PYQs Found
          </h3>
          <p className="text-slate-400 font-semibold text-sm">
            Try adjusting your filters to see more results.
          </p>
        </div>
      )}
    </div>
  );
};

export default InterviewPYQSection;