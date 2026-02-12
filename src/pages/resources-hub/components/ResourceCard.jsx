import React, { useState, useContext } from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';
import { ResourceContext } from '../../../context/resourceContext';

const CAMPUSPULL_LOGO = '/assets/campuspull-logo.png'; // make sure this exists in /public/assets

const ResourceCard = ({
  resource,
  viewMode = 'grid',
  onEditClick,
  onDeleteClick,
}) => {
  const {
    toggleBookmark,
    incrementDownload,
    incrementView,
    user,
  } = useContext(ResourceContext);

  const [isBookmarked, setIsBookmarked] = useState(resource?.isBookmarked || false);
  const [downloading, setDownloading] = useState(false);

  // ===== Permissions =====
  const isOwner = user?._id === resource?.uploadedBy?._id;
  const isAdmin = user?.role === 'admin';
  const canModify = isAdmin || isOwner;

  // ===== Branding logic =====
  const isAdminUploader = resource?.uploadedBy?.role === 'admin';

  const contributorName = isAdminUploader
    ? 'CampusPull'
    : resource?.uploadedBy?.name || 'CampusPull';

  const contributorAvatar = isAdminUploader
    ? CAMPUSPULL_LOGO
    : resource?.uploadedBy?.avatar;

  // ===== Handlers =====
  const handleBookmark = async (e) => {
    e?.stopPropagation();
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

  const getResourceTypeIcon = (type) => {
    const icons = {
      notes: 'FileText',
      roadmaps: 'Route',
      pyqs: 'MessageCircle',
    };
    return icons?.[type] || 'FileText';
  };

  // ===== LIST VIEW =====
  if (viewMode === 'list') {
    return (
      <div className="knowledge-card bg-white border border-slate-200 rounded-xl p-6 hover:shadow-brand-lg transition-all duration-300">
        <div className="flex items-start space-x-4">
          <div className="w-20 h-20 bg-surface rounded-lg overflow-hidden">
            <Image src={resource?.thumbnail} alt={resource?.title} className="w-full h-full object-cover" />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex justify-between mb-2">
              <div>
                <h3 className="font-semibold text-lg line-clamp-1">{resource?.title}</h3>
                <p className="text-sm text-insight-gray line-clamp-2">{resource?.description}</p>
              </div>

              <Button variant="ghost" size="icon" onClick={handleBookmark}>
                <Icon name={isBookmarked ? 'Bookmark' : 'BookmarkPlus'} size={18} />
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

  // ===== GRID VIEW =====
  return (
    <div className="knowledge-card bg-white border border-slate-200 rounded-xl overflow-hidden hover:shadow-brand-lg transition-all duration-300">
      <div className="relative h-48 bg-surface">
        <Image src={resource?.thumbnail} alt={resource?.title} className="w-full h-full object-cover" />

        <div className="absolute top-3 right-3">
          <Button variant="ghost" size="icon" onClick={handleBookmark} className="bg-white/90">
            <Icon name={isBookmarked ? 'Bookmark' : 'BookmarkPlus'} size={18} />
          </Button>
        </div>

        <div className="absolute top-3 left-3">
          <span className={`px-2 py-1 rounded-full text-xs border ${getDifficultyColor(resource?.difficulty)}`}>
            {resource?.difficulty}
          </span>
        </div>
      </div>

      <div className="p-4">
        <h3 className="font-semibold text-lg mb-2 line-clamp-2">{resource?.title}</h3>
        <p className="text-sm text-insight-gray line-clamp-3 mb-3">{resource?.description}</p>

        <div className="flex justify-between items-center mb-3 text-xs text-insight-gray">
          <span>{resource?.downloads} downloads</span>
          <span>{resource?.views} views</span>
        </div>

        <div className="flex items-center gap-2 mb-4">
          <Image src={contributorAvatar} alt={contributorName} className="w-6 h-6 rounded-full" />
          <span className="text-sm">by {contributorName}</span>
          {(isAdminUploader || resource?.uploadedBy?.verified) && (
            <Icon name="BadgeCheck" size={14} color="var(--color-academic-blue)" />
          )}
        </div>

        <div className="flex gap-2">
          {canModify && (
            <>
              <Button size="sm" variant="outline" className="flex-1" iconName="Edit" onClick={() => onEditClick(resource)}>
                Edit
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="flex-1 text-red-600 border-red-200 hover:bg-red-50"
                iconName="Trash2"
                onClick={() => onDeleteClick(resource)}
              >
                Delete
              </Button>
            </>
          )}

          <Button size="sm" className="flex-1" onClick={handleDownload} iconName="Download">
            {downloading ? '...' : 'Download'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ResourceCard;
