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
  const contributorName = isAdminUploader ? 'CampusPull' : resource?.uploadedBy?.name || 'CampusPull';
  const contributorAvatar = isAdminUploader ? CAMPUSPULL_LOGO : resource?.uploadedBy?.avatar;

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
    // FIX: guest preview triggers modal (spec: "Show preview content, Download triggers modal")
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
      beginner: 'text-green-600 bg-green-50 border-green-200',
      intermediate: 'text-yellow-600 bg-yellow-50 border-yellow-200',
      advanced: 'text-red-600 bg-red-50 border-red-200',
    };
    return colors?.[difficulty] || colors?.beginner;
  };

  // LIST VIEW
  if (viewMode === 'list') {
    return (
      <div className="knowledge-card bg-white border border-slate-200 rounded-xl p-4 sm:p-6 hover:shadow-brand-lg transition-all duration-300">
        <div className="flex items-start gap-3 sm:space-x-4">
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-surface rounded-lg overflow-hidden flex-shrink-0">
            <Image src={resource?.thumbnail} alt={resource?.title} className="w-full h-full object-cover" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex justify-between mb-2">
              <div className="flex-1 min-w-0 pr-2">
                <h3 className="font-semibold text-base sm:text-lg line-clamp-1">{resource?.title}</h3>
                <p className="text-sm text-insight-gray line-clamp-2">{resource?.description}</p>
              </div>
              <Button variant="ghost" size="icon" onClick={handleBookmark}>
                <Icon name={isBookmarked && !isGuest ? 'Bookmark' : 'BookmarkPlus'} size={18} />
              </Button>
            </div>
            <div className="flex items-center gap-3 text-xs text-insight-gray mb-3">
              <span className={`px-2 py-1 rounded-full border ${getDifficultyColor(resource?.difficulty)}`}>
                {resource?.difficulty}
              </span>
              <span>{resource?.downloads} downloads</span>
              <span>{resource?.views} views</span>
            </div>
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Image src={contributorAvatar} alt={contributorName} className="w-6 h-6 rounded-full" />
                <span className="text-sm">by {contributorName}</span>
                {(isAdminUploader || resource?.uploadedBy?.verified) && (
                  <Icon name="BadgeCheck" size={14} color="var(--color-academic-blue)" />
                )}
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={handlePreview}>Preview</Button>
                <Button size="sm" onClick={handleDownload}>
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
    <div className="group bg-white border border-slate-200 rounded-2xl overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col h-full relative">
      <div className="relative h-48 bg-slate-100 overflow-hidden shrink-0">
        <Image src={resource?.thumbnail} alt={resource?.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        <div className="absolute top-3 right-3 z-10">
          <Button variant="ghost" size="icon" onClick={handleBookmark} className="bg-white/90 shadow-sm hover:bg-white text-indigo-600 rounded-full h-8 w-8">
            <Icon name={isBookmarked && !isGuest ? 'Bookmark' : 'BookmarkPlus'} size={16} />
          </Button>
        </div>
        <div className="absolute top-3 left-3 flex gap-2">
          {resource?.subject && (
            <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-white/95 text-indigo-700 shadow-sm backdrop-blur-sm">
              {resource.subject.replace(/-/g, ' ')}
            </span>
          )}
          {resource?.difficulty && (
            <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider shadow-sm backdrop-blur-sm ${
              resource.difficulty === 'beginner' ? 'bg-green-100/95 text-green-700' :
              resource.difficulty === 'intermediate' ? 'bg-yellow-100/95 text-yellow-700' :
              'bg-red-100/95 text-red-700'
            }`}>
              {resource.difficulty}
            </span>
          )}
        </div>
      </div>

      <div className="p-5 flex flex-col flex-1">
        <h3 className="font-bold text-gray-900 text-lg mb-2 line-clamp-2 group-hover:text-indigo-600 transition-colors">
          {resource?.title}
        </h3>
        <p className="text-sm text-gray-500 line-clamp-3 mb-4 flex-1">
          {resource?.description}
        </p>
        
        <div className="flex justify-between items-center mb-4 text-xs font-medium text-gray-400">
          <div className="flex items-center gap-1.5">
            <Icon name="DownloadCloud" size={14} />
            <span>{resource?.downloads || 0} downloads</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Icon name="Eye" size={14} />
            <span>{resource?.views || 0} views</span>
          </div>
        </div>
        
        <div className="flex items-center gap-2 mb-5">
          <Image src={contributorAvatar} alt={contributorName} className="w-7 h-7 rounded-full ring-2 ring-indigo-50" />
          <div className="flex flex-col">
            <span className="text-xs font-semibold text-gray-700 flex items-center gap-1">
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
              <Button size="sm" variant="outline" className="flex-1 border-indigo-200 text-indigo-600 hover:bg-indigo-50" iconName="Edit" onClick={() => onEditClick(resource)}>
                Edit
              </Button>
              <Button
                size="sm" variant="outline"
                className="flex-none px-3 text-red-600 border-red-200 hover:bg-red-50 hover:border-red-300 transition-colors"
                iconName="Trash2"
                onClick={() => onDeleteClick(resource)}
              />
            </>
          )}
          <Button size="sm" className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white shadow-md hover:shadow-lg transition-all" onClick={handleDownload} iconName="Download">
            {downloading ? '...' : 'Download'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ResourceCard;