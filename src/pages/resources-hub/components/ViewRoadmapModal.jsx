import React, { useState, useContext, useMemo } from "react";
import Icon from "../../../components/AppIcon";
import { ResourceContext } from "../../../context/resourceContext";

const ViewRoadmapModal = ({ isOpen, onClose, roadmap, isGuest, onRestrictedAction }) => {
  const { toggleLessonProgress, incrementView, user } = useContext(ResourceContext);
  const [expandedModules, setExpandedModules] = useState({});
  const [isTogglingLesson, setIsTogglingLesson] = useState(null);

  const _id = roadmap?._id;
  const title = roadmap?.title;
  const description = roadmap?.description;
  const modules = roadmap?.modules;

  const { totalLessons, completedLessons, progressPercentage } = useMemo(() => {
    const roadmapLessonIds = new Set(
      modules?.flatMap((mod) => mod.resources?.map((res) => res._id) || []) || []
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

  if (!isOpen || !roadmap) return null;

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

  const handleToggleLesson = async (resourceId, e) => {
    e.stopPropagation();
    if (isGuest) {
      onRestrictedAction?.();
      return;
    }
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-2xl bg-white border border-slate-100 rounded-[2rem] overflow-hidden flex flex-col shadow-2xl max-h-[90vh] text-slate-800 transition-all duration-300">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200/60 text-slate-400 hover:text-slate-600 focus:outline-none transition-all duration-200 cursor-pointer z-10"
        >
          <Icon name="X" size={16} />
        </button>

        {/* Modal Header */}
        <div className="p-6 pb-4 border-b border-slate-100 flex items-start gap-4 pr-12 text-left">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-r from-indigo-500 to-blue-500 flex items-center justify-center flex-shrink-0 text-white shadow-md">
            <Icon name="Route" size={24} />
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-slate-800 font-poppins">{title}</h2>
            <p className="text-sm text-slate-500 mt-1 font-semibold leading-relaxed">{description}</p>
          </div>
        </div>

        {/* Progress Tracker for Registered Users */}
        {!isGuest && (
          <div className="px-6 py-4 bg-slate-50/50 border-b border-slate-100/50 flex flex-col gap-2">
            <div className="flex items-center justify-between text-xs font-bold text-slate-600">
              <span>Your Roadmap Progress</span>
              <span>{progressPercentage}% Completed ({completedLessons} of {totalLessons} lessons)</span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-indigo-500 to-blue-500 h-2 rounded-full transition-all duration-500"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          </div>
        )}

        {/* Modules Outline List */}
        <div className="p-6 space-y-4 overflow-y-auto flex-1 text-left custom-scrollbar">
          {modules && modules.length > 0 ? (
            modules.map((module, idx) => {
              const isExpanded = !!expandedModules[module._id || idx];
              return (
                <div
                  key={module._id || idx}
                  className="border border-slate-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300"
                >
                  {/* Module Accordion Header */}
                  <div
                    onClick={() => toggleModule(module._id || idx)}
                    className="flex items-center justify-between p-4 bg-slate-50/60 cursor-pointer hover:bg-slate-50 transition-colors font-poppins"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-7 h-7 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-xs">
                        {idx + 1}
                      </div>
                      <h4 className="font-extrabold text-slate-800 text-sm leading-snug">{module.moduleTitle}</h4>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-400">
                        {module.resources?.length || 0} lessons
                      </span>
                      <Icon
                        name={isExpanded ? "ChevronUp" : "ChevronDown"}
                        size={16}
                        className="text-slate-400"
                      />
                    </div>
                  </div>

                  {/* Module Content / Resources */}
                  {isExpanded && (
                    <div className="p-4 border-t border-slate-100 space-y-3 bg-white">
                      {module.moduleDescription && (
                        <p className="text-xs text-slate-500 font-semibold leading-relaxed border-b border-slate-50 pb-2.5">
                          {module.moduleDescription}
                        </p>
                      )}
                      <ul className="space-y-2">
                        {module.resources && module.resources.length > 0 ? (
                          module.resources.map((res, resIdx) => {
                            const complete = isLessonComplete(res._id);
                            return (
                              <li
                                key={res._id || resIdx}
                                className="flex items-center justify-between gap-4 p-2 hover:bg-slate-50/50 rounded-xl transition-colors"
                              >
                                <a
                                  href={res.link}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex items-center gap-2 text-xs font-bold text-indigo-600 hover:text-indigo-800 hover:underline min-w-0"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  <Icon name="PlayCircle" size={16} className="flex-shrink-0" />
                                  <span className="truncate">{res.title}</span>
                                </a>
                                {!isGuest && (
                                  <button
                                    onClick={(e) => handleToggleLesson(res._id, e)}
                                    className={`p-1.5 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors ${
                                      isTogglingLesson === res._id ? "animate-spin" : ""
                                    }`}
                                    disabled={isTogglingLesson === res._id}
                                    title={complete ? "Mark as incomplete" : "Mark as complete"}
                                  >
                                    <Icon
                                      name={isTogglingLesson === res._id ? "Loader2" : complete ? "CheckCircle" : "Circle"}
                                      size={18}
                                      className={complete ? "text-emerald-500 fill-emerald-50" : ""}
                                    />
                                  </button>
                                )}
                              </li>
                            );
                          })
                        ) : (
                          <li className="text-xs font-semibold text-slate-400 italic">No resources added to this module.</li>
                        )}
                      </ul>
                    </div>
                  )}
                </div>
              );
            })
          ) : (
            <div className="text-center py-8 text-slate-400 font-semibold italic">No modules outline available for this roadmap.</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ViewRoadmapModal;
