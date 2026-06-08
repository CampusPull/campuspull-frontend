import React, { useState, useContext } from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';
import { ResourceContext } from '../../../context/resourceContext';

const CAMPUSPULL_LOGO = '/assets/images/campuspullLogo.jpeg';

// FIX: accept isGuest and onRestrictedAction
const ResourceCard = ({ resource, viewMode = 'grid', onEditClick, onDeleteClick, isGuest, onRestrictedAction }) => {
  const { toggleBookmark, incrementDownload, incrementView, user } = useContext(ResourceContext);

  const [isBookmarked, setIsBookmarked] = useState(resource?.isBookmarked || false);
  const [downloading, setDownloading] = useState(false);

  const isOwner = user?._id === resource?.uploadedBy?._id;
  const isAdmin = user?.role === 'admin';
  // FIX: guests can never modify
  const canModify = !isGuest && (isAdmin || isOwner);

  const isAdminUploader = resource?.uploadedBy?.role === 'admin';
  const genderSuffix = resource?.uploadedBy?.gender === 'male' ? ' Sir' : resource?.uploadedBy?.gender === 'female' ? ' Ma\'am' : '';
  const contributorName = resource?.uploadedBy?.name
    ? `${resource.uploadedBy.name}${genderSuffix}`
    : 'CampusPull';
  const contributorAvatar = resource?.uploadedBy?.avatar || null;
  console.log("uploadedBy full object:", resource?.uploadedBy);

  const handleBookmark = async (e) => {
    e?.stopPropagation();
    // FIX: guest bookmark triggers modal
    if (isGuest) { onRestrictedAction?.(); return; }
    try {
      setIsBookmarked(!isBookmarked);
      await toggleBookmark(resource._id, resource.type);
    } catch (err) {
      console.error('Bookmark toggle failed:', err);
      setIsBookmarked(isBookmarked);
    }
  };

  const handleDownload = async (e) => {
    e?.stopPropagation();
    // FIX: guest download triggers modal
    if (isGuest) { onRestrictedAction?.(); return; }
    if (downloading) return;
    setDownloading(true);
    try {
      await incrementDownload(resource._id, resource.type);
      if (resource?.link) window.open(resource.link, '_blank');
    } catch (err) {
      console.error('Download failed:', err);
    } finally {
      setDownloading(false);
    }
  };

  const handlePreview = async () => {
    // FIX: guest preview triggers modal
    if (isGuest) { onRestrictedAction?.(); return; }
    try {
      await incrementView(resource._id, resource.type);
      window.open(resource?.link, '_blank');
    } catch (err) {
      console.error('View increment failed:', err);
    }
  };

  const getDifficultyColor = (difficulty) => {
    const colors = {
      beginner: 'text-emerald-600 bg-emerald-50 border-emerald-100/50',
      intermediate: 'text-amber-600 bg-amber-50 border-amber-100/50',
      advanced: 'text-rose-600 bg-rose-50 border-rose-100/50',
    };
    return colors?.[difficulty] || colors?.beginner;
  };

  const accentColors = [
    "from-indigo-500 to-blue-500",
    "from-violet-500 to-purple-500",
    "from-blue-500 to-cyan-500",
    "from-emerald-500 to-teal-500",
    "from-rose-500 to-pink-500",
  ];
  const accent = accentColors[(resource?.title?.charCodeAt(0) || 0) % accentColors.length];

  // LIST VIEW
  if (viewMode === 'list') {
    return (
      <div className="bg-white border border-slate-100 rounded-3xl p-4 sm:p-6 hover:shadow-[0_12px_30px_-8px_rgba(79,70,229,0.12)] transition-all duration-300 relative text-left">
        {/* Accent line top */}
        <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${accent} rounded-t-3xl`} />
        
        <div className="flex items-start gap-3 sm:space-x-4 pt-1">
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-slate-50 rounded-2xl overflow-hidden flex-shrink-0 border-2 border-slate-100 shadow-sm flex items-center justify-center">
            {resource?.thumbnail ? (
              <Image src={resource?.thumbnail} alt={resource?.title} className="w-full h-full object-cover" />
            ) : (
              <Icon name="FileText" size={28} className="text-indigo-400" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex justify-between mb-2">
              <div className="flex-1 min-w-0 pr-2">
                <h3 className="font-extrabold text-slate-800 text-base sm:text-lg line-clamp-1 transition-colors hover:text-indigo-600">{resource?.title}</h3>
                <p className="text-sm text-slate-400 line-clamp-2 mt-1 font-semibold">{resource?.description}</p>
              </div>
              <button 
                onClick={handleBookmark} 
                className="p-2.5 rounded-xl bg-white/95 hover:bg-white border border-slate-100 hover:shadow-md transition-all duration-300 text-slate-400 hover:text-indigo-600 focus:outline-none"
              >
                <Icon name={isBookmarked && !isGuest ? 'Bookmark' : 'BookmarkPlus'} size={16} className={isBookmarked && !isGuest ? 'fill-indigo-600 text-indigo-600' : ''} />
              </button>
            </div>
            <div className="flex items-center gap-3 text-xs text-slate-400 mb-3 font-bold">
              <span className={`px-2.5 py-0.5 rounded-full border ${getDifficultyColor(resource?.difficulty)}`}>
                {resource?.difficulty}
              </span>
              <span>{resource?.downloads} downloads</span>
              <span>{resource?.views} views</span>
            </div>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pt-3 border-t border-slate-100">
              <div className="flex items-center gap-2">
                 {contributorAvatar ? (
                   <Image src={contributorAvatar} alt={contributorName} className="w-6 h-6 rounded-full border border-slate-100 shadow-sm ring-2 ring-indigo-500/10 object-cover" />
                 ) : (
                   <div className="w-6 h-6 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-[10px] font-black text-slate-600 ring-2 ring-indigo-500/10 shadow-sm">
                     {resource?.uploadedBy?.name?.charAt(0)?.toUpperCase() || "?"}
                   </div>
                 )}
                <span className="text-xs text-slate-500 font-extrabold">by {contributorName}</span>
                {(isAdminUploader || resource?.uploadedBy?.verified) && (
                  <Icon name="BadgeCheck" size={14} className="text-blue-500" />
                )}
              </div>
              <div className="flex gap-2 w-full sm:w-auto mt-2 sm:mt-0">
                <Button size="sm" variant="outline" className="border-slate-200 text-slate-500 hover:bg-slate-50 hover:text-slate-800 font-extrabold px-4" onClick={handlePreview}>Preview</Button>
                <Button size="sm" className="bg-gradient-to-r from-indigo-500 to-blue-500 text-white border-none shadow-sm hover:shadow-lg font-extrabold px-5 rounded-xl" onClick={handleDownload}>
                  {downloading ? '...' : 'Download'}
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
    <div className="group bg-white border border-slate-100 rounded-3xl overflow-hidden hover:shadow-[0_12px_30px_-8px_rgba(79,70,229,0.12)] hover:-translate-y-1 transition-all duration-300 flex flex-col h-full relative text-left">
      {/* Dynamic top gradient accent line */}
      <div className={`h-1.5 bg-gradient-to-r ${accent} transition-transform duration-300 group-hover:scale-y-110 shrink-0`} />

      <div className="relative h-44 bg-slate-50 overflow-hidden shrink-0 border-b border-slate-100">
        {resource?.thumbnail ? (
          <Image src={resource?.thumbnail} alt={resource?.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-r from-indigo-50/50 to-blue-50/50">
            <Icon name="FileText" size={48} className="text-indigo-400/80" />
          </div>
        )}
        <div className="absolute top-3 right-3 z-10">
          <button 
            onClick={handleBookmark} 
            className="p-2.5 rounded-xl bg-white/95 hover:bg-white border border-slate-100 hover:shadow-md transition-all duration-300 text-slate-400 hover:text-indigo-600 focus:outline-none"
          >
            <Icon name={isBookmarked && !isGuest ? 'Bookmark' : 'BookmarkPlus'} size={16} className={isBookmarked && !isGuest ? 'fill-indigo-600 text-indigo-600' : ''} />
          </button>
        </div>
        <div className="absolute top-3 left-3 flex gap-2">
          {resource?.subject && (
            <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-white/95 text-indigo-600 border border-slate-100 shadow-sm">
              {resource.subject.replace(/-/g, ' ')}
            </span>
          )}
          {resource?.difficulty && (
            <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm border bg-white/95 ${getDifficultyColor(resource?.difficulty)}`}>
              {resource.difficulty}
            </span>
          )}
        </div>
      </div>

      <div className="p-5 flex flex-col flex-1">
        <h3 className="font-extrabold text-slate-800 text-base mb-2 line-clamp-2 group-hover:text-indigo-600 transition-colors leading-snug">
          {resource?.title}
        </h3>
        <p className="text-sm text-slate-400 line-clamp-3 mb-4 flex-1 font-semibold leading-relaxed">
          {resource?.description}
        </p>
        
        <div className="flex justify-between items-center mb-4 text-xs font-bold text-slate-400 border-b border-slate-100/50 pb-3">
          <div className="flex items-center gap-1.5">
            <Icon name="DownloadCloud" size={14} className="text-slate-400" />
            <span>{resource?.downloads || 0} downloads</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Icon name="Eye" size={14} className="text-slate-400" />
            <span>{resource?.views || 0} views</span>
          </div>
        </div>
        
        <div className="flex items-center gap-2 mb-5">
           {contributorAvatar ? (
             <Image src={contributorAvatar} alt={contributorName} className="w-7 h-7 rounded-full border border-slate-100 shadow-sm ring-2 ring-indigo-500/10 object-cover" />
           ) : (
             <div className="w-7 h-7 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-[10px] font-black text-slate-600 ring-2 ring-indigo-500/10 shadow-sm">
               {resource?.uploadedBy?.name?.charAt(0)?.toUpperCase() || "?"}
             </div>
           )}
          <div className="flex flex-col">
            <span className="text-xs font-extrabold text-slate-500 flex items-center gap-1">
              {contributorName}
              {(isAdminUploader || resource?.uploadedBy?.verified) && (
                <Icon name="BadgeCheck" size={12} className="text-blue-500" />
              )}
            </span>
          </div>
        </div>

        <div className="flex gap-2 mt-auto shrink-0">
          {canModify && (
            <>
              <button 
                className="flex-1 border border-slate-200 hover:border-slate-300 text-slate-500 hover:text-slate-800 hover:bg-slate-50 font-bold rounded-xl py-2.5 transition-all text-xs cursor-pointer bg-transparent" 
                onClick={() => onEditClick(resource)}
              >
                Edit
              </button>
              <button
                className="flex-none px-3 border border-slate-200 text-red-500 hover:bg-red-50 hover:border-red-200 transition-all rounded-xl py-2.5 cursor-pointer bg-transparent"
                onClick={() => onDeleteClick(resource)}
              >
                <Icon name="Trash2" size={14} />
              </button>
            </>
          )}
          <button 
            className="flex-1 bg-gradient-to-r from-indigo-500 to-blue-500 text-white shadow-md hover:shadow-lg font-bold rounded-xl py-2.5 active:scale-95 transition-all border-none text-xs cursor-pointer flex items-center justify-center gap-1.5" 
            onClick={handleDownload}
          >
            <Icon name="Download" size={13} />
            {downloading ? '...' : 'Download'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResourceCard;