import React, { useState, useContext, useMemo } from "react";
import Icon from "../../../components/AppIcon";
import Image from "../../../components/AppImage";
import Button from "../../../components/ui/Button";
import { ResourceContext } from "../../../context/resourceContext";

const CareerRoadmapCard = ({ roadmap, viewMode = "grid", onEditClick, onDeleteClick, isGuest, onRestrictedAction }) => {
  const { toggleBookmark, toggleLessonProgress, incrementView, user } = useContext(ResourceContext);

  const [expandedModules, setExpandedModules] = useState({});
  const [isBookmarked, setIsBookmarked] = useState(roadmap?.isBookmarked || false);
  const [isTogglingLesson, setIsTogglingLesson] = useState(null);

  const { _id, title, description, modules, uploadedBy, thumbnail } = roadmap;

  // guests can never edit
  const isOwner = !isGuest && user?._id === uploadedBy?._id;
  const isAdmin = !isGuest && user?.role === "admin";
  const canEdit = isOwner || isAdmin;

  const { totalLessons, completedLessons, progressPercentage } = useMemo(() => {
    const roadmapLessonIds = new Set(
      modules?.flatMap((mod) => mod.resources.map((res) => res._id)) || []
    );
    const total = roadmapLessonIds.size;
    const userCompletedIds = new Set(user?.completedLessons || []);
    let completedCount = 0;
    for (const lessonId of roadmapLessonIds) {
      if (userCompletedIds.has(lessonId)) completedCount++;
    }
    return {
      totalLessons: total,
      completedLessons: completedCount,
      progressPercentage: total === 0 ? 0 : Math.round((completedCount / total) * 100),
    };
  }, [modules, user?.completedLessons]);

  if (!roadmap) return <div className="text-center p-4">No roadmap data available</div>;

  const modulesCount = modules?.length || 0;

  const toggleModule = async (moduleId) => {
    const isExpanding = !expandedModules[moduleId];
    setExpandedModules((prev) => ({ ...prev, [moduleId]: !prev[moduleId] }));
    if (isExpanding) {
      try {
        await incrementView(_id, "roadmap");
      } catch (err) {
        console.error("Failed to increment roadmap view:", err);
      }
    }
  };

  const handleBookmark = async (e) => {
    e?.stopPropagation();
    if (isGuest) { onRestrictedAction?.(); return; }
    try {
      setIsBookmarked(!isBookmarked);
      await toggleBookmark(_id, "roadmap");
    } catch (err) {
      console.error("Bookmark toggle failed:", err);
      setIsBookmarked(isBookmarked);
    }
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    if (isGuest) { onRestrictedAction?.(); return; }
    onDeleteClick?.(roadmap);
  };

  const handleToggleLesson = async (resourceId, e) => {
    e.stopPropagation();
    if (isGuest) { onRestrictedAction?.(); return; }
    if (isTogglingLesson === resourceId) return;
    setIsTogglingLesson(resourceId);
    try {
      await toggleLessonProgress(resourceId);
    } catch (err) {
      console.error("Failed to toggle lesson:", err);
    } finally {
      setIsTogglingLesson(null);
    }
  };

  const isLessonComplete = (resourceId) => {
    if (isGuest) return false;
    return user?.completedLessons?.includes(resourceId);
  };

  const accentColors = [
    "from-indigo-500 to-blue-500",
    "from-violet-500 to-purple-500",
    "from-blue-500 to-cyan-500",
    "from-emerald-500 to-teal-500",
    "from-rose-500 to-pink-500",
  ];
  const accent = accentColors[(title?.charCodeAt(0) || 0) % accentColors.length];

  // LIST VIEW
  if (viewMode === "list") {
    return (
      <div className="bg-white border border-slate-100 rounded-3xl p-6 hover:shadow-[0_12px_30px_-8px_rgba(79,70,229,0.12)] transition-all duration-300 mb-4 relative text-left">
        {/* Accent line top */}
        <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${accent} rounded-t-3xl`} />
        
        <div className="flex flex-col md:flex-row items-start space-x-0 md:space-x-4 space-y-4 md:space-y-0 pt-1">
          <div className="flex-shrink-0 w-full md:w-48 h-32 bg-slate-50 rounded-2xl overflow-hidden relative border-2 border-slate-100 shadow-sm flex items-center justify-center">
            {thumbnail ? (
              <Image src={thumbnail} alt={title} className="w-full h-full object-cover" />
            ) : (
              <Icon name="Route" size={32} className="text-indigo-400" />
            )}
          </div>

          <div className="flex-1 min-w-0 w-full">
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1">
                <h3 className="font-extrabold text-slate-800 text-lg mb-1 leading-snug hover:text-indigo-600 transition-colors">{title}</h3>
                <p className="text-slate-400 text-sm line-clamp-2 mb-3 font-semibold">{description}</p>
              </div>
              <button 
                onClick={handleBookmark} 
                className="ml-2 p-2.5 rounded-xl bg-white/95 hover:bg-white border border-slate-100 hover:shadow-md transition-all duration-300 text-slate-400 hover:text-indigo-600 focus:outline-none"
              >
                <Icon
                  name={isBookmarked && !isGuest ? "Bookmark" : "BookmarkPlus"}
                  size={16}
                  className={isBookmarked && !isGuest ? "fill-indigo-600 text-indigo-600" : ""}
                />
              </button>
            </div>

            <div className="flex flex-wrap items-center gap-4 mb-4">
              <div className="flex items-center space-x-1 text-slate-400 font-bold">
                <Icon name="BookOpen" size={14} />
                <span className="text-xs">{modulesCount} Modules</span>
              </div>
              <div className="flex items-center space-x-1 text-slate-400 font-bold">
                <Icon name="FileText" size={14} />
                <span className="text-xs">{totalLessons} Lessons</span>
              </div>
              {!isGuest && (
                <div className="flex-1 max-w-xs min-w-[150px]">
                  <div className="flex justify-between text-[10px] font-bold text-slate-400 mb-1">
                    <span>Progress</span>
                    <span>{progressPercentage}%</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-1.5">
                    <div className="bg-gradient-to-r from-indigo-500 to-emerald-500 h-1.5 rounded-full transition-all duration-500" style={{ width: `${progressPercentage}%` }} />
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-slate-100">
              <div className="flex items-center space-x-2">
                <Image src={uploadedBy?.profileImage} alt={uploadedBy?.name} className="w-6 h-6 rounded-full border border-slate-100 shadow-sm ring-2 ring-indigo-500/10" />
                <span className="text-xs text-slate-500 font-extrabold">by {uploadedBy?.name}</span>
              </div>
              <div className="flex space-x-2">
                {canEdit && (
                  <button 
                    onClick={() => onEditClick(roadmap)} 
                    className="border border-slate-200 hover:border-slate-300 text-slate-500 hover:text-slate-800 hover:bg-slate-50 font-bold text-xs py-2 px-3.5 rounded-xl bg-transparent cursor-pointer"
                  >
                    Edit
                  </button>
                )}
                <Button variant="default" size="sm" className="bg-gradient-to-r from-indigo-500 to-blue-500 text-white font-bold rounded-xl border-none shadow-sm hover:shadow-lg text-xs cursor-pointer">
                  View Roadmap
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // GRID VIEW
  return (
    <div className="group bg-white border border-slate-100 rounded-3xl overflow-hidden hover:shadow-[0_12px_30px_-8px_rgba(79,70,229,0.12)] transition-all duration-300 flex flex-col h-full relative text-left shadow-inner-sm">
      {/* Top accent line */}
      <div className={`h-1.5 bg-gradient-to-r ${accent} transition-transform duration-300 group-hover:scale-y-110 shrink-0`} />

      <div className="relative h-40 bg-slate-50 overflow-hidden border-b border-slate-100 shrink-0">
        {thumbnail ? (
          <Image src={thumbnail} alt={title} className="w-full h-full object-cover group-hover:scale-105 transition-all duration-500" />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-r from-indigo-50/50 to-blue-50/50">
            <Icon name="Route" size={48} className="text-indigo-400/80" />
          </div>
        )}
        <div className="absolute inset-0 bg-black/10" />
        <button
          onClick={handleBookmark}
          className="absolute top-3 right-3 bg-white/95 hover:bg-white border border-slate-100 text-slate-400 hover:text-indigo-600 rounded-xl p-2.5 shadow-sm"
        >
          <Icon
            name={isBookmarked && !isGuest ? "Bookmark" : "BookmarkPlus"}
            size={16}
            className={isBookmarked && !isGuest ? "fill-indigo-600 text-indigo-600" : ""}
          />
        </button>
        <div className="absolute bottom-4 left-4 right-4 z-10 text-left">
          <h3 className="font-extrabold text-white text-xl mb-1 line-clamp-1 drop-shadow-md">{title}</h3>
          <p className="text-slate-100 text-xs line-clamp-2 leading-relaxed opacity-95 drop-shadow-sm">{description}</p>
        </div>
      </div>

      {/* Stats */}
      <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex justify-around shrink-0">
        <div className="text-center">
          <div className="font-extrabold text-indigo-600 text-base">{modulesCount}</div>
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Modules</div>
        </div>
        <div className="text-center">
          <div className="font-extrabold text-indigo-600 text-base">{totalLessons}</div>
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Lessons</div>
        </div>
        <div className="text-center">
          <div className="font-extrabold text-indigo-600 text-base">{roadmap.bookmarks?.length || 0}</div>
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Bookmarks</div>
        </div>
      </div>

      {/* Progress */}
      {!isGuest && (
        <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/30 shrink-0">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-500">Progress: {progressPercentage}%</span>
            <span className="text-[10px] text-slate-400 font-bold">{completedLessons} of {totalLessons} completed</span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-2">
            <div className="bg-gradient-to-r from-indigo-500 to-emerald-500 h-2 rounded-full transition-all duration-500" style={{ width: `${progressPercentage}%` }} />
          </div>
        </div>
      )}

      {/* Modules List */}
      <div className="p-6 space-y-4 max-h-72 overflow-y-auto flex-1">
        {modules?.map((module, index) => (
          <div key={module._id || index} className="relative text-left">
            {index < modules.length - 1 && (
              <div className="absolute left-4 top-8 w-px h-full border-l border-dashed border-slate-200" />
            )}
            <div className="flex items-start space-x-4 cursor-pointer" onClick={() => toggleModule(module._id || index)}>
              <div className="w-8 h-8 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-500 shadow-sm flex items-center justify-center flex-shrink-0 z-10">
                <Icon name="BookOpen" size={14} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h4 className="font-extrabold text-slate-700 text-sm">{module.moduleTitle}</h4>
                  <Icon name={expandedModules[module._id || index] ? "ChevronUp" : "ChevronDown"} size={14} className="text-slate-400" />
                </div>
                {expandedModules[module._id || index] && (
                  <div className="mt-3 p-4 bg-slate-50/50 border border-slate-100 rounded-2xl">
                    <p className="text-xs text-slate-400 mb-3 leading-relaxed font-semibold">{module.moduleDescription}</p>
                    <ul className="space-y-2">
                      {module.resources?.map((res, resIdx) => (
                        <li key={res._id || resIdx} className="flex items-center justify-between">
                          <a
                            href={res.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 text-xs text-indigo-600 hover:text-indigo-500 font-extrabold"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <Icon name="PlayCircle" size={12} />
                            {res.title}
                          </a>
                          {!isGuest && (
                            <button
                              onClick={(e) => handleToggleLesson(res._id, e)}
                              className={`p-1 rounded-full hover:bg-slate-100 ${isTogglingLesson === res._id ? "animate-spin" : ""}`}
                              disabled={isTogglingLesson === res._id}
                            >
                              <Icon
                                name={isTogglingLesson === res._id ? "Loader" : isLessonComplete(res._id) ? "CheckCircle" : "Circle"}
                                size={20}
                                color={isLessonComplete(res._id) ? "#10B981" : "#9CA3AF"}
                              />
                            </button>
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="px-6 py-4 bg-slate-50/50 border-t border-slate-100 mt-auto shrink-0">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Image src={uploadedBy?.profileImage} alt={uploadedBy?.name} className="w-6 h-6 rounded-full border border-slate-100 shadow-sm ring-2 ring-indigo-500/10" />
            <span className="text-xs font-extrabold text-slate-500">by {uploadedBy?.name}</span>
            {uploadedBy?.verified && <Icon name="BadgeCheck" size={14} className="text-blue-500" />}
          </div>
          <div className="flex space-x-2">
            {canEdit && (
              <>
                <button 
                  onClick={() => onEditClick(roadmap)} 
                  className="border border-slate-200 hover:border-slate-300 text-slate-500 hover:text-slate-800 hover:bg-slate-50 font-bold text-xs py-2 px-3.5 rounded-xl bg-transparent cursor-pointer"
                >
                  Edit
                </button>
                <button 
                  onClick={handleDelete} 
                  className="text-red-500 border border-red-200 hover:bg-red-50 hover:border-red-300 font-bold text-xs py-2 px-3 rounded-xl border bg-transparent cursor-pointer flex items-center justify-center"
                >
                  <Icon name="Trash2" size={14} />
                </button>
              </>
            )}
            <button className="bg-gradient-to-r from-indigo-500 to-blue-500 text-white font-bold text-xs py-2 px-4.5 rounded-xl border-none shadow-sm hover:shadow-lg cursor-pointer flex items-center justify-center">
              View Roadmap
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CareerRoadmapCard;