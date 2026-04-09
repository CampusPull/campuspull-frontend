// src/pages/events/components/EventCard.jsx
import React, { useState, useContext } from 'react'; // Added useContext
import { motion } from 'framer-motion';
import { Calendar, Clock, Edit, Trash2, Link as LinkIcon, AlertTriangle, User, Eye, Check } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext'; // Adjust path
import { useEvents } from '../../../context/eventContext'; // Adjust path
import Image from '../../../components/AppImage'; // Adjust path
import Button from '../../../components/ui/Button'; // Adjust path
import Icon from '../../../components/AppIcon'; // Adjust path

// Helper to format Event Date (with time)
const formatEventDate = (dateString) => {
  if (!dateString) return 'Date TBD';
  try {
    const options = { year: 'numeric', month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit', hour12: true };
    const dateObj = new Date(dateString);
    if (isNaN(dateObj.getTime())) return 'Invalid Date';
    return dateObj.toLocaleDateString('en-US', options) || 'Invalid Date';
  } catch (e) {
    console.error("Error formatting event date:", dateString, e);
    return 'Invalid Date';
  }
};

// Helper for Creation Date (date only)
const formatCreationDate = (dateString) => {
  if (!dateString) return '';
  try {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    const dateObj = new Date(dateString);
    if (isNaN(dateObj.getTime())) return '';
    return dateObj.toLocaleDateString('en-US', options) || '';
  } catch (e) {
    console.error("Error formatting creation date:", dateString, e);
    return '';
  }
};

const EventCard = ({ event, onEdit, onDelete, isDeleting }) => {
  const { user, loading: authLoading } = useAuth();
  const { incrementInterest } = useEvents(); // Get the function from context

  // Default event to empty object and interestedUsers to empty array for safety
  const { _id, title, description, date, media, createdBy, registrationLink, isCompulsory, interestCount, interestedUsers = [], createdAt } = event || {};

  // Prevent rendering if event data is fundamentally missing
  if (!event || !_id) {
     console.error("EventCard received invalid event prop:", event);
     return null;
  }

  const [isProcessingInterest, setIsProcessingInterest] = useState(false);

  // console.log(`[EventCard] Received User Object:`, user);

const currentUserId = user?._id;

// 🎯 Ensure conversion to string for reliable comparison
const currentUserIdString = currentUserId ? currentUserId.toString() : null;

// Derive interested state based on the currentUserIdString
const currentUserIsInterested = !!currentUserIdString
     ? interestedUsers.some(userId => 
      String(userId) === currentUserIdString
      ) 
      : false;
  // console.log(`[EventCard Render ID: ${event?._id}] User ID: ${user?._id}, Interested Users:`, interestedUsers, `currentUserIsInterested: ${currentUserIsInterested}`);
  const canManage = user && (user.role === 'admin' ||  user._id === createdBy?._id);

  // Handler for the "Show Interest" button
  const handleInterestClick = async () => {
    if (isProcessingInterest || currentUserIsInterested) return;

    setIsProcessingInterest(true);
    try {
      await incrementInterest(_id);
      // UI update happens automatically when the 'event' prop changes due to context update
    } catch (err) {
      console.error("Failed to record interest", err);
    } finally {
      setIsProcessingInterest(false);
    }
  };

  // Handler for the "Register" button
  const handleRegisterClick = () => {
    if (registrationLink) {
      window.open(registrationLink, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      whileHover={{ scale: 1.03, boxShadow: '0 10px 20px rgba(0, 0, 0, 0.1)' }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className="bg-white rounded-xl overflow-hidden shadow-md border border-slate-200 flex flex-col"
    >
      {/* Optional Media */}
      {media && (
        <div className="h-40 bg-slate-100">
          <Image src={media} alt={title || 'Event banner'} className="w-full h-full object-cover" />
        </div>
      )}

      <div className="p-5 flex flex-col flex-grow">
        {/* Header: Title & Badges */}
        <div className="flex justify-between items-start mb-2">
          <h2 className="text-xl font-semibold text-slate-800 mr-2">{title || 'Untitled Event'}</h2>
          {isCompulsory && (
            <span className="flex-shrink-0 flex items-center gap-1 bg-red-100 text-red-700 text-xs px-2 py-0.5 rounded-full font-medium" title="Mandatory Event">
              <AlertTriangle size={12} /> Mandatory
            </span>
          )}
        </div>

        {/* Event Date & Time */}
        <div className="flex items-center gap-2 text-sm text-slate-500 mb-3">
          <Calendar size={14} />
          <span>{formatEventDate(date)}</span>
        </div>

        {/* Description */}
        <p className="text-sm text-slate-600 mb-4 flex-grow line-clamp-3">
          {description || "No description provided."}
        </p>

        {/* Interest Count */}
        <div className="flex items-center gap-2 text-sm text-slate-500 mb-4">
          <Eye size={14} />
          <span>{Number(interestCount) || 0} interested</span>
        </div>

        {/* Action Buttons Area */}
        <div className="flex flex-col sm:flex-row gap-2 mb-4">
          {/* Show Interest Button */}
          <button
            onClick={handleInterestClick}
            disabled={isProcessingInterest || currentUserIsInterested} // Disable when loading OR already interested
            className={`flex-1 rounded-xl inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-md text-sm font-semibold transition-all duration-150 border ${
              isProcessingInterest
                ? 'bg-slate-200 text-slate-500 border-slate-300 cursor-wait'       // Loading state
                : currentUserIsInterested
                ? 'bg-green-100 text-green-700 border-green-200 cursor-default'   // Interested state
                : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50 cursor-pointer' // Default state
            }`}
          >
            {isProcessingInterest ? (
              <Icon name="Loader" size={14} className="animate-spin" />
            ) : currentUserIsInterested ? (
              <Check size={14} /> // Check icon when interested
            ) : (
              <Eye size={14} /> // Eye icon when not interested
            )}
            <span>{currentUserIsInterested ? 'Interested' : (isProcessingInterest ? 'Processing...' : 'Show Interest')}</span>
          </button>

          {/* Registration Button (Conditional) */}
          {registrationLink && (
            <button
              onClick={handleRegisterClick}
              className="flex-1 rounded-xl inline-flex items-center justify-center gap-1.5 px-3 py-2 bg-gradient-to-r from-[#3B82F6] to-[#6366F1] text-white rounded-md text-sm font-semibold hover:opacity-90 transition-opacity"
            >
              <LinkIcon size={14} />
              Register
            </button>
          )}
        </div>

        {/* Footer: Author, Creation Date & Edit/Delete Actions */}
        <div className="border-t border-slate-100 pt-3 mt-auto flex justify-between items-center">
          {/* Author & Creation Date */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 text-xs text-slate-500">
             <div className="flex items-center gap-1.5">
               <User size={12} />
               <span>By {createdBy && createdBy.name ? createdBy.name : 'CampusPull User'}</span>
             </div>
             {createdAt && (
                 <div className="flex items-center gap-1.5">
                    <Clock size={12} />
                    <span>Created: {formatCreationDate(createdAt)}</span>
                 </div>
             )}
          </div>

          {/* Action Buttons (Edit/Delete) */}
          {canManage && (
            <div className="flex items-center space-x-1">
              <Button
                variant="ghost" size="icon"
                onClick={() => onEdit(event)}
                title="Edit Event"
                className="text-slate-500 hover:text-blue-600 hover:bg-blue-100"
                disabled={isDeleting}
              >
                <Edit size={16} />
              </Button>
              <Button
                variant="ghost" size="icon"
                onClick={() => onDelete(_id)}
                title="Delete Event"
                className="text-slate-500 hover:text-red-600 hover:bg-red-100"
                disabled={isDeleting}
              >
                {isDeleting ? <Icon name="Loader" size={16} className="animate-spin" /> : <Trash2 size={16} />}
              </Button>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default EventCard;
