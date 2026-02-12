import React, { useState, useMemo, useContext } from "react";
import Icon from "../../../components/AppIcon";
import Image from "../../../components/AppImage";
import Button from "../../../components/ui/Button";
import { ResourceContext } from "../../../context/resourceContext";

const InterviewPYQSection = ({ pyqs, viewMode = "grid", onEditClick, onDeleteClick }) => {
  const { user } = useContext(ResourceContext);
  const [selectedCompany, setSelectedCompany] = useState("all");
  const [selectedDifficulty, setSelectedDifficulty] = useState("all");
  const [showAllCompanies, setShowAllCompanies] = useState(false);
  const VISIBLE_COMPANY_COUNT = 8;

  // Check if current user is admin
  const isAdmin = user?.role === "admin";

  // --- Helpers ---
  const difficultyLevels = [
    { value: "all", label: "All Levels" },
    {
      value: "beginner",
      label: "Easy",
      color: "text-green-600 bg-green-100 border-green-200",
    },
    {
      value: "intermediate",
      label: "Medium",
      color: "text-yellow-600 bg-yellow-100 border-yellow-200",
    },
    {
      value: "advanced",
      label: "Hard",
      color: "text-red-600 bg-red-100 border-red-200",
    },
  ];

  const getDifficultyColor = (difficulty) => {
    const colors = {
      beginner: "text-green-700 bg-green-50 border-green-200",
      intermediate: "text-yellow-700 bg-yellow-50 border-yellow-200",
      advanced: "text-red-700 bg-red-50 border-red-200",
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

  return (
    <div className="space-y-6">
      {/* --- Filters Section --- */}
      <div className="bg-white/70 backdrop-blur-xl border border-white/50 rounded-2xl p-6 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Company Filter */}
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">
              Filter by Company
            </label>
            <div className="flex flex-wrap gap-2">
              {visibleCompanies?.map((company) => (
                <button
                  key={company?.value}
                  onClick={() => setSelectedCompany(company?.value)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all duration-200 ${
                    selectedCompany === company?.value
                      ? "bg-indigo-600 text-white border-indigo-600 shadow-md"
                      : "bg-white text-gray-600 border-gray-200 hover:border-indigo-300 hover:text-indigo-600"
                  }`}
                >
                  {company?.label}
                  <span
                    className={`ml-1.5 text-[10px] ${selectedCompany === company?.value ? "text-indigo-200" : "text-gray-400"}`}
                  >
                    {company?.count}
                  </span>
                </button>
              ))}
              {companyFilters.length > VISIBLE_COMPANY_COUNT && (
                <button
                  onClick={() => setShowAllCompanies((prev) => !prev)}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold
               border border-dashed border-gray-300
               text-gray-500 hover:text-indigo-600
               hover:border-indigo-300 transition"
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
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">
              Difficulty Level
            </label>
            <div className="flex flex-wrap gap-2">
              {difficultyLevels?.map((level) => (
                <button
                  key={level?.value}
                  onClick={() => setSelectedDifficulty(level?.value)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all duration-200 ${
                    selectedDifficulty === level?.value
                      ? "bg-indigo-600 text-white border-indigo-600 shadow-md"
                      : "bg-white text-gray-600 border-gray-200 hover:border-indigo-300 hover:text-indigo-600"
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
          const isOwner = user?._id === pyq?.uploadedBy?._id;
          const showActions = isOwner || isAdmin;

          // ==========================================
          // LIST VIEW ITEM
          // ==========================================
          if (viewMode === "list") {
            return (
              <div
                key={pyq._id}
                className="group bg-white/70 backdrop-blur-xl border border-white/50 rounded-2xl p-5 hover:shadow-xl transition-all duration-300"
              >
                <div className="flex flex-col sm:flex-row items-start gap-5">
                  <div className="flex-shrink-0 w-16 h-16 bg-white rounded-xl shadow-sm border border-gray-100 flex items-center justify-center overflow-hidden p-2 group-hover:scale-105 transition-transform">
                    {pyq.thumbnail ? (
                      <Image
                        src={pyq.thumbnail}
                        alt={pyq.company}
                        className="w-full h-full object-contain"
                      />
                    ) : (
                      <Icon name="Briefcase" size={28} color="#4f46e5" />
                    )}
                  </div>

                  <div className="flex-1 w-full">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-bold text-gray-800 text-lg group-hover:text-indigo-700 transition-colors">
                          {pyq.company}
                        </h3>
                        <p className="text-gray-500 text-sm font-medium">
                          {pyq.title}
                        </p>
                      </div>
                      <div
                        className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider border ${getDifficultyColor(pyq?.difficulty)}`}
                      >
                        {getDifficultyLabel(pyq?.difficulty)}
                      </div>
                    </div>

                    <p className="text-gray-500 text-sm mb-3 line-clamp-2">
                      {pyq.description || "No description provided."}
                    </p>

                    <div className="flex flex-wrap gap-2 mb-4">
                      {pyq.tags?.slice(0, 5).map((tag, i) => (
                        <span
                          key={i}
                          className="px-2 py-0.5 bg-indigo-50 text-indigo-600 text-[10px] rounded-md border border-indigo-100 font-semibold"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-gray-100/50">
                      <div className="flex items-center gap-2">
                        <Image
                          src={pyq?.uploadedBy?.avatar}
                          className="w-5 h-5 rounded-full"
                        />
                        <span className="text-xs text-gray-500">
                          by {pyq?.uploadedBy?.name}
                        </span>
                      </div>
                      <div className="flex gap-2">
                        {showActions && (
                          <>
                            <Button
                              variant="outline"
                              size="sm"
                              iconName="Edit"
                              onClick={() => onEditClick(pyq)}
                            >
                              Edit
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              iconName="Trash2"
                              className="text-red-500 border-red-100 hover:bg-red-50 hover:border-red-200"
                              onClick={() => onDeleteClick(pyq)}
                            >
                              Delete
                            </Button>
                          </>
                        )}
                        <Button
                          variant="default"
                          size="sm"
                          className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-md border-none"
                          onClick={() => window.open(pyq?.link, "_blank")}
                        >
                          View PYQ
                        </Button>
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
              className="group bg-white/70 backdrop-blur-xl border border-white/50 rounded-2xl p-6 hover:shadow-xl transition-all duration-300 flex flex-col h-full"
            >
              <div className="relative h-32 rounded-xl overflow-hidden mb-4">
                {pyq.thumbnail ? (
                  <>
                    <Image
                      src={pyq.thumbnail}
                      alt={pyq.company}
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent" />
                  </>
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-600" />
                )}

                <div className="relative z-10 p-4 h-full flex flex-col justify-end">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-white font-bold text-lg leading-tight">
                        {pyq.company}
                      </h3>
                      <p className="text-indigo-100 text-sm font-medium">
                        {pyq.title}
                      </p>
                    </div>

                    <div
                      className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider border backdrop-blur-sm
        ${getDifficultyColor(pyq?.difficulty)} bg-white/90`}
                    >
                      {getDifficultyLabel(pyq?.difficulty)}
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white/50 p-3 rounded-xl border border-white/50 mb-4 flex-1">
                <p className="text-gray-600 text-sm leading-relaxed line-clamp-3">
                  {pyq?.description || "No description provided."}
                </p>
              </div>

              <div className="flex flex-wrap gap-1.5 mb-5">
                {pyq?.tags?.length > 0 ? (
                  pyq.tags.slice(0, 4).map((topic, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-indigo-50 text-indigo-600 text-[10px] font-semibold rounded-md border border-indigo-100"
                    >
                      {topic}
                    </span>
                  ))
                ) : (
                  <span className="text-xs text-gray-400 italic">
                    No topics listed.
                  </span>
                )}
                {pyq?.tags?.length > 4 && (
                  <span className="px-2 py-1 bg-gray-50 text-gray-400 text-[10px] rounded-md border border-gray-100">
                    +{pyq?.tags?.length - 4}
                  </span>
                )}
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-gray-100/50 mt-auto">
                <div className="flex items-center space-x-2">
                  <Image
                    src={pyq?.uploadedBy?.avatar}
                    alt={pyq?.uploadedBy?.name}
                    className="w-6 h-6 rounded-full border border-white shadow-sm"
                  />
                  <span className="text-xs text-gray-500 font-medium">
                    by {pyq?.uploadedBy?.name}
                  </span>
                  {pyq?.uploadedBy?.verified && (
                    <Icon name="BadgeCheck" size={14} color="#4f46e5" />
                  )}
                </div>
                <div className="flex space-x-2">
                  {showActions && (
                    <>
                      <Button
                        variant="outline"
                        size="sm"
                        iconName="Edit"
                        className="border-gray-200 hover:border-indigo-300 hover:text-indigo-600"
                        onClick={() => onEditClick(pyq)}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        iconName="Trash2"
                        className="border-red-100 text-red-500 hover:bg-red-50 hover:border-red-200"
                        onClick={() => onDeleteClick(pyq)}
                      >
                        Delete
                      </Button>
                    </>
                  )}
                  <Button
                    variant="default"
                    size="sm"
                    className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md hover:shadow-lg hover:from-indigo-700 hover:to-purple-700 border-none"
                    onClick={() => window.open(pyq?.link, "_blank")}
                  >
                    Access
                  </Button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* No Results Message */}
      {filteredPYQs?.length === 0 && (
        <div className="text-center py-20 bg-white/40 backdrop-blur-md rounded-3xl border border-dashed border-gray-300">
          <Icon
            name="Search"
            size={48}
            color="#9ca3af"
            className="mx-auto mb-4 opacity-50"
          />
          <h3 className="text-lg font-bold text-gray-700 mb-1">
            No PYQs Found
          </h3>
          <p className="text-gray-500 text-sm">
            Try adjusting your filters to see more results.
          </p>
        </div>
      )}
    </div>
  );
};

export default InterviewPYQSection;