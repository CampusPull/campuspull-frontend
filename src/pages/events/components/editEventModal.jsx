// src/pages/events/components/EditEventModal.jsx
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, Image as ImageIcon, Link as LinkIcon, AlertTriangle } from 'lucide-react';
import { useEvents } from '../../../context/eventContext'; // Adjust path
import Icon from '../../../components/AppIcon'; // Adjust path
import Button from '../../../components/ui/Button'; // Adjust path
import Image from '../../../components/AppImage'; // Adjust path for displaying current image

// Helper to format date for input type="date"
const formatDateForInput = (dateString) => {
  if (!dateString) return '';
  try {
    const date = new Date(dateString);
    return date.toISOString().split('T')[0]; // YYYY-MM-DD format
  } catch (e) {
    return '';
  }
};

const EditEventModal = ({ isOpen, onClose, event, onEventUpdated }) => {
  const { updateEvent } = useEvents();

  // Form State
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [media, setMedia] = useState(null); // New file object
  const [registrationLink, setRegistrationLink] = useState('');
  const [isCompulsory, setIsCompulsory] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Pre-fill form when 'event' prop changes
  useEffect(() => {
    if (event) {
      setTitle(event.title || '');
      setDescription(event.description || '');
      setDate(formatDateForInput(event.date)); // Format date for input
      setMedia(null); // Reset file input
      setRegistrationLink(event.registrationLink || '');
      setIsCompulsory(event.isCompulsory || false);
      setError(null);
    }
  }, [event]);

  const handleFileChange = (e) => {
    setMedia(e.target.files[0] || null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData();
    // Only append fields if they have potentially changed or are required
    formData.append('title', title);
    formData.append('description', description);
    formData.append('date', date);
    if (media) formData.append('banner', media); // Only send if new file selected
    formData.append('registrationLink', registrationLink);
    formData.append('isCompulsory', isCompulsory);

    try {
      await updateEvent(event._id, formData);
      onEventUpdated(); // Notify parent
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to update event.');
      console.error("Update Event Error:", err);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !event) return null;

  return (
    <motion.div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50 p-4"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
    >
      <motion.div
        className="bg-white rounded-xl p-6 max-w-lg w-full shadow-xl border border-slate-200 relative max-h-[90vh] overflow-y-auto"
        initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
      >
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-slate-400 hover:text-slate-600"
          disabled={loading}
        >
          <X size={20} />
        </button>

        <h2 className="text-xl font-semibold mb-5 text-slate-800">Edit Event</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Title */}
          <div>
            <label className="block mb-1 font-medium text-sm text-slate-700">Event Title <span className="text-red-500">*</span></label>
            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)}
              className="w-full border border-slate-300 rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" required maxLength={100} />
          </div>

          {/* Date */}
          <div>
            <label className="block mb-1 font-medium text-sm text-slate-700">Date <span className="text-red-500">*</span></label>
            <input type="date" value={date} onChange={(e) => setDate(e.target.value)}
              className="w-full border border-slate-300 rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" required />
          </div>

          {/* Description */}
          <div>
            <label className="block mb-1 font-medium text-sm text-slate-700">Description</label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)}
              className="w-full border border-slate-300 rounded px-3 py-2 h-24 resize-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" maxLength={1000} />
          </div>

          {/* Media */}
          <div>
            <label className="block mb-1 font-medium text-sm text-slate-700">Change Banner/Image (Optional)</label>
             {/* Display current image if exists */}
             {event.media && !media && (
                <div className="mb-2 w-full h-32 rounded border border-slate-200 overflow-hidden">
                    <Image src={event.media} alt="Current banner" className="w-full h-full object-cover"/>
                </div>
            )}
            <div className="flex items-center gap-2 border border-slate-300 rounded px-3 py-2">
              <ImageIcon size={16} className="text-slate-500" />
              <input type="file" accept="image/*" onChange={handleFileChange}
                 className="text-sm file:mr-3 file:py-1 file:px-3 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer w-full"/>
            </div>
             {media && <p className="text-xs text-slate-500 mt-1">New file selected: {media.name}</p>}
          </div>

          {/* Registration Link */}
          <div>
            <label className="block mb-1 font-medium text-sm text-slate-700">Registration Link (Optional)</label>
            <div className="flex items-center gap-2 border border-slate-300 rounded px-3 py-2 focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500">
               <LinkIcon size={16} className="text-slate-500" />
               <input type="url" placeholder="https://forms.gle/..." value={registrationLink} onChange={(e) => setRegistrationLink(e.target.value)}
                 className="w-full outline-none bg-transparent"/>
             </div>
          </div>

          {/* Compulsory Checkbox */}
          <div className="flex items-center gap-2 pt-2">
             <input type="checkbox" id="editIsCompulsory" checked={isCompulsory} onChange={(e) => setIsCompulsory(e.target.checked)}
               className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"/>
             <label htmlFor="editIsCompulsory" className="text-sm font-medium text-slate-700 flex items-center gap-1">
               <AlertTriangle size={14} className="text-red-500 inline"/> Mandatory for Students?
             </label>
           </div>

          {error && <p className="text-red-600 text-sm bg-red-50 p-2 rounded border border-red-200">{error}</p>}

          <Button type="submit" disabled={loading} className="w-full bg-gradient-to-r from-[#3B82F6] to-[#6366F1] text-white hover:opacity-90">
            {loading ? "Saving Changes..." : "Save Changes"}
          </Button>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default EditEventModal;
