import React, { useState, useContext, useMemo } from "react";
import Icon from "../../../components/AppIcon";
import Image from "../../../components/AppImage";
import Button from "../../../components/ui/Button";
import { ResourceContext } from "../../../context/resourceContext";

const CareerRoadmapCard = ({ roadmap, viewMode = "grid", onEditClick, onDeleteClick, isGuest, onRestrictedAction }) => {
  const { toggleBookmark, toggleLessonProgress, deleteRoadmap, user } = useContext(ResourceContext);

  const [expandedModules, setExpandedModules] = useState({});
  const [isBookmarked, setIsBookmarked] = useState(roadmap?.isBookmarked || false);
  const [isTogglingLesson, setIsTogglingLesson] = useState(null);

  const { _id, title, description, modules, uploadedBy, thumbnail } = roadmap;

  // FIX: guests can never edit
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

  const toggleModule = (moduleId) => {
    setExpandedModules((prev) => ({ ...prev, [moduleId]: !prev[moduleId] }));
  };

  const handleBookmark = async (e) => {
    e?.stopPropagation();
    // FIX: guest triggers modal
    if (isGuest) { onRestrictedAction?.(); return; }
    try {
      setIsBookmarked(!isBookmarked);
      await toggleBookmark(_id, "roadmap");
    } catch (err) {
      console.error("Bookmark toggle failed:", err);
      setIsBookmarked(isBookmarked);
    }
  };

  const handleDelete = async () => {
    if (isGuest) { onRestrictedAction?.(); return; }
    const confirmed = window.confirm("Are you sure you want to delete this roadmap?");
    if (!confirmed) return;
    try {
      await deleteRoadmap(_id);
    } catch (err) {
      console.error("Failed to delete roadmap:", err);
    }
  };

  const handleToggleLesson = async (resourceId, e) => {
    e.stopPropagation();
    // FIX: guest triggers modal
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

  // LIST VIEW
  if (viewMode === "list") {
    return (
      <div className="knowledge-card bg-white border border-slate-200 rounded-xl p-6 hover:shadow-brand-lg transition-all duration-300 mb-4">
        <div className="flex flex-col md:flex-row items-start space-x-0 md:space-x-4 space-y-4 md:space-y-0">
          <div className="flex-shrink-0 w-full md:w-48 h-32 bg-surface rounded-lg overflow-hidden relative">
            {thumbnail ? (
              <Image src={thumbnail} alt={title} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-r from-academic-blue to-credibility-indigo">
                <Icon name="Route" size={32} color="white" />
              </div>
            )}
          </div>

          <div className="flex-1 min-w-0 w-full">
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1">
                <h3 className="font-inter font-semibold text-wisdom-charcoal text-lg mb-1">{title}</h3>
                <p className="text-insight-gray text-sm line-clamp-2 mb-3">{description}</p>
              </div>
              <Button variant="ghost" size="icon" onClick={handleBookmark} className="ml-2">
                <Icon
                  name={isBookmarked && !isGuest ? "Bookmark" : "BookmarkPlus"}
                  size={18}
                  color={isBookmarked && !isGuest ? "var(--color-academic-blue)" : "var(--color-insight-gray)"}
                />
              </Button>
            </div>

            <div className="flex flex-wrap items-center gap-4 mb-4">
              <div className="flex items-center space-x-1">
                <Icon name="BookOpen" size={14} color="var(--color-insight-gray)" />
                <span className="text-xs text-insight-gray">{modulesCount} Modules</span>
              </div>
              <div className="flex items-center space-x-1">
                <Icon name="FileText" size={14} color="var(--color-insight-gray)" />
                <span className="text-xs text-insight-gray">{totalLessons} Lessons</span>
              </div>
              {/* FIX: hide progress for guests — they have no completedLessons */}
              {!isGuest && (
                <div className="flex-1 max-w-xs min-w-[150px]">
                  <div className="flex justify-between text-[10px] text-gray-500 mb-1">
                    <span>Progress</span>
                    <span>{progressPercentage}%</span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-1.5">
                    <div className="bg-gradient-to-r from-blue-500 to-green-500 h-1.5 rounded-full" style={{ width: `${progressPercentage}%` }} />
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Image src={uploadedBy?.avatar} alt={uploadedBy?.name} className="w-6 h-6 rounded-full" />
                <span className="text-sm text-insight-gray">by {uploadedBy?.name}</span>
              </div>
              <div className="flex space-x-2">
                {canEdit && (
                  <Button variant="outline" size="sm" iconName="Edit" onClick={() => onEditClick(roadmap)}>Edit</Button>
                )}
                <Button variant="default" size="sm" className="bg-academic-blue hover:bg-blue-700">
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
    <div className="knowledge-card relative bg-white border border-slate-200 rounded-xl overflow-hidden hover:shadow-brand-lg transition-all duration-300">
      <div className="relative h-40 bg-slate-100 overflow-hidden">
        {thumbnail ? (
          <Image src={thumbnail} alt={title} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-r from-academic-blue to-credibility-indigo">
            <Icon name="Route" size={48} color="white" />
          </div>
        )}
        <div className="absolute inset-0 bg-black bg-opacity-30" />
        <Button
          variant="ghost" size="icon"
          onClick={handleBookmark}
          className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm hover:bg-white"
        >
          <Icon
            name={isBookmarked && !isGuest ? "Bookmark" : "BookmarkPlus"}
            size={18}
            color={isBookmarked && !isGuest ? "var(--color-academic-blue)" : "var(--color-insight-gray)"}
          />
        </Button>
        <div className="absolute bottom-4 left-4 p-4">
          <h3 className="font-bold text-white text-2xl mb-1 line-clamp-2">{title}</h3>
          <p className="text-white text-opacity-90 text-sm line-clamp-2">{description}</p>
        </div>
      </div>

      {/* Stats */}
      <div className="px-6 py-4 border-b border-slate-100 flex justify-around">
        <div className="text-center">
          <div className="font-bold text-academic-blue text-lg">{modulesCount}</div>
          <div className="text-xs text-insight-gray">Modules</div>
        </div>
        <div className="text-center">
          <div className="font-bold text-academic-blue text-lg">{totalLessons}</div>
          <div className="text-xs text-insight-gray">Lessons</div>
        </div>
        <div className="text-center">
          <div className="font-bold text-academic-blue text-lg">{roadmap.bookmarks?.length || 0}</div>
          <div className="text-xs text-insight-gray">Bookmarks</div>
        </div>
      </div>

      {/* FIX: only show progress bar for logged-in users */}
      {!isGuest && (
        <div className="px-6 py-4 border-b border-slate-100">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Progress: {progressPercentage}%</span>
            <span className="text-xs text-gray-500">{completedLessons} of {totalLessons} completed</span>
          </div>
          <div className="w-full bg-slate-200 rounded-full h-2">
            <div className="bg-gradient-to-r from-blue-500 to-green-500 h-2 rounded-full transition-all duration-500" style={{ width: `${progressPercentage}%` }} />
          </div>
        </div>
      )}

      {/* Modules */}
      <div className="p-6 space-y-4 max-h-72 overflow-y-auto">
        {modules?.map((module, index) => (
          <div key={module._id || index} className="relative">
            {index < modules.length - 1 && (
              <div className="absolute left-4 top-8 w-px h-full border-l-2 border-dashed border-slate-300" />
            )}
            <div className="flex items-start space-x-4 cursor-pointer" onClick={() => toggleModule(module._id || index)}>
              <div className="w-8 h-8 rounded-full bg-academic-blue border-2 border-white shadow-sm flex items-center justify-center flex-shrink-0 z-10">
                <Icon name="BookOpen" size={14} color="white" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium text-gray-800 text-sm">{module.moduleTitle}</h4>
                  <Icon name={expandedModules[module._id || index] ? "ChevronUp" : "ChevronDown"} size={14} color="gray" />
                </div>
                {expandedModules[module._id || index] && (
                  <div className="mt-3 p-3 bg-slate-50 rounded-lg">
                    <p className="text-xs text-gray-600 mb-2">{module.moduleDescription}</p>
                    <ul className="space-y-1">
                      {module.resources?.map((res, resIdx) => (
                        <li key={res._id || resIdx} className="flex items-center justify-between">
                          <a
                            href={res.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 text-xs text-blue-600 hover:underline"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <Icon name="PlayCircle" size={12} />
                            {res.title}
                          </a>
                          {/* FIX: lesson progress hidden for guests */}
                          {!isGuest && (
                            <button
                              onClick={(e) => handleToggleLesson(res._id, e)}
                              className={`p-1 rounded-full hover:bg-slate-200 ${isTogglingLesson === res._id ? "animate-spin" : ""}`}
                              disabled={isTogglingLesson === res._id}
                            >
                              <Icon
                                name={isTogglingLesson === res._id ? "Loader" : isLessonComplete(res._id) ? "CheckCircle" : "Circle"}
                                size={20}
                                color={isLessonComplete(res._id) ? "#10B981" : "#6B7280"}
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
      <div className="px-6 py-4 bg-slate-50 border-t border-slate-100">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Image src={uploadedBy?.avatar} alt={uploadedBy?.name} className="w-6 h-6 rounded-full" />
            <span className="text-sm text-insight-gray">by {uploadedBy?.name}</span>
            {uploadedBy?.verified && <Icon name="BadgeCheck" size={14} color="var(--color-academic-blue)" />}
          </div>
          <div className="flex space-x-2">
            {canEdit && (
              <>
                <Button variant="outline" size="sm" iconName="Edit" onClick={() => onEditClick(roadmap)}>Edit</Button>
                <Button variant="outline" size="sm" iconName="Trash" className="text-red-600 border-red-200 hover:bg-red-50" onClick={handleDelete}>Delete</Button>
              </>
            )}
            <Button variant="default" size="sm" className="bg-academic-blue hover:bg-blue-700">
              View Roadmap
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CareerRoadmapCard;