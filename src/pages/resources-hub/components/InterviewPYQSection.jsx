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
  // Check user roles and permissions
  const isGuest = !user;
  const isAdmin = !isGuest && user?.role === "admin";

  // --- Helpers ---
  const difficultyLevels = [
    { value: "all", label: "All Levels" },
    {
      value: "Easy",
      label: "Easy",
      color: "text-emerald-600 bg-emerald-50 border-emerald-100",
    },
    {
      value: "Medium",
      label: "Medium",
      color: "text-amber-600 bg-amber-50 border-amber-100",
    },
    {
      value: "Hard",
      label: "Hard",
      color: "text-rose-600 bg-rose-50 border-rose-100",
    },
  ];

  const getDifficultyColor = (difficulty) => {
    const d = (difficulty || "").toUpperCase();
    const colors = {
      BEGINNER: "text-emerald-600 bg-emerald-50 border-emerald-100/50",
      EASY: "text-emerald-600 bg-emerald-50 border-emerald-100/50",
      INTERMEDIATE: "text-amber-600 bg-amber-50 border-amber-100/50",
      MEDIUM: "text-amber-600 bg-amber-50 border-amber-100/50",
      ADVANCED: "text-rose-600 bg-rose-50 border-rose-100/50",
      HARD: "text-rose-600 bg-rose-50 border-rose-100/50",
    };
    return colors?.[d] || "text-emerald-600 bg-emerald-50 border-emerald-100/50";
  };

  const getDifficultyLabel = (val) =>
    difficultyLevels.find((l) => l.value === val)?.label || val;

  const accentColors = [
    "from-indigo-500 to-blue-500",
    "from-violet-500 to-purple-500",
    "from-blue-500 to-cyan-500",
    "from-emerald-500 to-teal-500",
    "from-rose-500 to-pink-500",
  ];

  return (
    <div className="space-y-6 text-left">
      {/* --- PYQ Cards List --- */}
      <div
        className={
          viewMode === "grid"
            ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5"
            : "flex flex-col gap-4"
        }
      >
        {pyqs?.map((pyq) => {
          const ownerId = pyq?.uploadedBy?._id || pyq?.uploadedBy;
          const isOwner = !isGuest && user?._id === ownerId;
          const showActions = isOwner || isAdmin;

          // Process tags to split by comma, trim whitespace, and filter out empty strings
          const cleanTags = (pyq?.tags || [])
            .flatMap((tag) => (typeof tag === "string" ? tag.split(",") : []))
            .map((t) => t.trim())
            .filter(Boolean);

          // ==========================================
          // LIST VIEW ITEM
          // ==========================================
          if (viewMode === "list") {
            return (
              <div
                key={pyq._id}
                className="group bg-white border border-slate-100 rounded-3xl p-5 hover:shadow-[0_12px_30px_-8px_rgba(79,70,229,0.12)] relative transition-all duration-300"
              >
                
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

                    <p className="line-clamp-2 text-sm text-gray-500 mb-3 leading-relaxed font-semibold">
                      {pyq.description || "No description provided."}
                    </p>

                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {cleanTags.slice(0, 3).map((tag, i) => (
                        <span
                          key={i}
                          className="px-2.5 py-0.5 bg-indigo-50 text-indigo-600 text-[10px] rounded-md border border-indigo-100/30 font-bold"
                        >
                          {tag}
                        </span>
                      ))}
                      {cleanTags.length > 3 && (
                        <span className="px-2.5 py-0.5 bg-slate-100 text-slate-500 text-[10px] font-bold rounded-md border border-slate-200">
                          +{cleanTags.length - 3}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                      <div className="flex items-center gap-2">
                        <Image
                          src={pyq?.uploadedBy?.profileImage}
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
              className="group bg-white border border-slate-100 rounded-3xl overflow-hidden hover:shadow-[0_12px_30px_-8px_rgba(79,70,229,0.12)] hover:-translate-y-1 transition-all duration-300 flex flex-col h-full min-h-[460px] relative text-left shadow-inner-sm"
            >
              <div className="relative h-44 bg-slate-50 overflow-hidden border-b border-slate-100 shrink-0">
                {pyq.thumbnail ? (
                  <Image
                    src={pyq.thumbnail}
                    alt={pyq.company}
                    className="w-full h-full object-cover group-hover:scale-105 transition-all duration-500"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-r from-indigo-50/50 to-blue-50/50">
                    <Icon name="Briefcase" size={48} className="text-indigo-400/80" />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent" />

                <div className="absolute bottom-4 left-4 right-4 z-10 text-left">
                  <h3 className="font-extrabold text-white text-xl mb-1 line-clamp-1 drop-shadow-md">
                    {pyq.company}
                  </h3>
                  <p className="text-slate-100 text-sm font-extrabold opacity-95 drop-shadow-sm">
                    {pyq.title}
                  </p>
                </div>

                <div className="absolute top-3 right-3 z-10 flex items-center gap-1.5">
                  <div
                    className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border bg-white/95 shadow-sm ${getDifficultyColor(pyq?.difficulty)}`}
                  >
                    {getDifficultyLabel(pyq?.difficulty)}
                  </div>
                  <div className="flex items-center gap-1 text-[10px] font-bold text-slate-500 bg-white/95 px-2.5 py-1 rounded-lg border border-slate-200 shadow-sm">
                    <Icon name="Download" size={11} className="text-slate-400" />
                    <span>{pyq.downloads || 0}</span>
                  </div>
                </div>
              </div>

              <div className="p-5 flex-1 flex flex-col">
                <div className="bg-slate-50/50 p-4 rounded-2xl border border-slate-100 mb-4 flex-1 font-semibold text-slate-400 text-sm leading-relaxed">
                  <p className="line-clamp-2 text-sm text-gray-500">
                    {pyq?.description || "No description provided."}
                  </p>
                </div>

                <div className="flex flex-wrap gap-1.5 mb-5">
                  {cleanTags.length > 0 ? (
                    cleanTags.slice(0, 3).map((topic, index) => (
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
                  {cleanTags.length > 3 && (
                    <span className="px-2.5 py-1 bg-slate-100 text-slate-500 text-[10px] font-bold rounded-md border border-slate-200">
                      +{cleanTags.length - 3}
                    </span>
                  )}
                </div>

                <div className="pt-4 border-t border-slate-100 mt-auto pb-0 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Image
                        src={pyq?.uploadedBy?.profileImage}
                        alt={pyq?.uploadedBy?.name}
                        className="w-6 h-6 rounded-full border border-slate-100 shadow-sm ring-2 ring-indigo-500/10 object-cover"
                      />
                      <span className="text-xs text-slate-500 font-extrabold">
                        by {pyq?.uploadedBy?.name}
                      </span>
                      {pyq?.uploadedBy?.verified && (
                        <Icon name="BadgeCheck" size={14} className="text-blue-500" />
                      )}
                    </div>
                    {showActions && (
                      <div className="flex items-center gap-1 ml-auto">
                        <button
                          className="border border-slate-200 hover:border-slate-300 text-slate-500 hover:text-slate-800 hover:bg-slate-50 font-bold rounded-xl py-1.5 px-3 transition-all text-xs cursor-pointer bg-transparent"
                          onClick={() => onEditClick(pyq)}
                        >
                          Edit
                        </button>
                        <button
                          className="text-red-500 border border-red-200 hover:bg-red-50 hover:border-red-300 transition-all rounded-xl py-1.5 px-2.5 cursor-pointer bg-transparent border flex items-center justify-center"
                          onClick={() => onDeleteClick(pyq)}
                        >
                          <Icon name="Trash2" size={14} />
                        </button>
                      </div>
                    )}
                  </div>
                  <button
                    className="w-full bg-gradient-to-r from-indigo-500 to-blue-500 text-white font-bold rounded-xl py-2.5 px-4.5 active:scale-95 transition-all border-none text-xs cursor-pointer flex items-center justify-center shadow-md hover:shadow-lg"
                    onClick={(e) => handleAccess(e, pyq)}
                  >
                    Access
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* No Results Message */}
      {pyqs?.length === 0 && (
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