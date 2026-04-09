// src/pages/announcements/components/AnnouncementCard.jsx
import React from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage'; // Assuming you have an Image component
import Button from '../../../components/ui/Button';
import { useAuth } from '../../../context/AuthContext'; // To potentially show edit/delete

const AnnouncementCard = ({ announcement,onDelete, onEdit }) => {
  const { user } = useAuth();
  const { title, content, createdAt, createdBy, important, attachmentUrl } = announcement;

  // Format date (example)
  const formattedDate = new Date(createdAt).toLocaleDateString('en-US', {
    year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
  });

  // --- TODO: Check if current user can edit/delete this announcement ---
  const canModify = user?.role === 'admin' || (user?.role === 'teacher' && user?._id === createdBy?._id);

  return (
    <div className={`knowledge-card bg-white border ${important ? 'border-l-4 border-achievement-amber shadow-lg' : 'border-slate-200 shadow-brand-sm'} rounded-xl overflow-hidden transition-all duration-300`}>
      <div className="p-5 sm:p-6">
        <div className="flex items-start justify-between mb-3">
          {/* Title and Importance Icon */}
          <div className="flex items-center space-x-2">
            {important && <Icon name="AlertTriangle" size={18} color="var(--color-achievement-amber)" />}
            <h2 className="font-inter font-semibold text-wisdom-charcoal text-lg">{title}</h2>
          </div>
          {/* Edit/Delete Buttons (Optional) */}
          {canModify && (
            <div className="flex space-x-1">
              <Button variant="ghost" size="icon" onClick={()=>onEdit(announcement)} title="Edit">
                <Icon name="Edit" size={16} />
              </Button>
              <Button variant="ghost" size="icon"onClick={() => onDelete(announcement._id)} title="Delete" className="text-red-600 hover:bg-red-50">
                <Icon name="Trash2" size={16} />
              </Button>
            </div>
          )}
        </div>

        {/* Content */}
        <p className="text-insight-gray text-sm leading-relaxed mb-4 whitespace-pre-wrap">
          {content}
        </p>
        {attachmentUrl && (
          <div className="mb-4">
            <a
              href={attachmentUrl}
              target="_blank" // Open in new tab
              rel="noopener noreferrer" // Security best practice
              download // Suggest downloading the file (browser behavior varies)
              className="inline-flex items-center space-x-2 px-3 py-1.5 bg-blue-50 text-blue-700 rounded-full text-xs font-medium border border-blue-200 hover:bg-blue-100 hover:text-blue-800 transition-colors"
            >
              <Icon name="Paperclip" size={12} />
              <span>View Attachment</span>
              <Icon name="ExternalLink" size={12} />
            </a>
          </div>
        )}

        {/* Footer: Author and Date */}
        <div className="flex items-center justify-between text-xs text-insight-gray pt-3 border-t border-slate-100">
          <div className="flex items-center space-x-2">
            <Image 
              src={createdBy?.avatar || '/default-avatar.png'} // Provide a default avatar
              alt={createdBy?.name || 'Admin'}
              className="w-5 h-5 rounded-full"
            />
            <span>By {createdBy?.name || 'Admin'}</span>
            {createdBy?.verified && <Icon name="BadgeCheck" size={12} color="var(--color-academic-blue)" />}
          </div>
          <span>{formattedDate}</span>
        </div>
      </div>
    </div>
  );
};

export default AnnouncementCard;