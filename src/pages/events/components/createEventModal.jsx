// src/pages/events/components/CreateEventModal.jsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Image as ImageIcon, Link as LinkIcon, AlertTriangle } from 'lucide-react';
import { useEvents } from '../../../context/eventContext'; // Adjust path
import Icon from '../../../components/AppIcon'; // Adjust path
import Button from '../../../components/ui/Button'; // Adjust path

const CreateEventModal = ({ isOpen, onClose, onEventCreated }) => {
  const { createEvent } = useEvents();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [media, setMedia] = useState(null); // File object
  const [registrationLink, setRegistrationLink] = useState('');
  const [isCompulsory, setIsCompulsory] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleFileChange = (e) => {
    setMedia(e.target.files[0] || null);
  };

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setDate('');
    setMedia(null);
    setRegistrationLink('');
    setIsCompulsory(false);
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('date', date); // Backend expects ISO string or parsable date string
    if (media) formData.append('banner', media); // Backend route uses 'banner'
    if (registrationLink) formData.append('registrationLink', registrationLink);
    formData.append('isCompulsory', isCompulsory);

    try {
      const newEvent = await createEvent(formData);
      onEventCreated(newEvent); // Notify parent
      resetForm();
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to create event. Please check inputs.');
      console.error("Create Event Error:", err);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

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

        <h2 className="text-xl font-semibold mb-5 text-slate-800">Create New Event</h2>

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
            <label className="block mb-1 font-medium text-sm text-slate-700">Banner/Image (Optional)</label>
            <div className="flex items-center gap-2 border border-slate-300 rounded px-3 py-2">
              <ImageIcon size={16} className="text-slate-500" />
              <input type="file" accept="image/*" onChange={handleFileChange}
                 className="text-sm file:mr-3 file:py-1 file:px-3 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer w-full"/>
            </div>
             {media && <p className="text-xs text-slate-500 mt-1">Selected: {media.name}</p>}
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
             <input type="checkbox" id="isCompulsory" checked={isCompulsory} onChange={(e) => setIsCompulsory(e.target.checked)}
               className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"/>
             <label htmlFor="isCompulsory" className="text-sm font-medium text-slate-700 flex items-center gap-1">
               <AlertTriangle size={14} className="text-red-500 inline"/> Mandatory for Students?
             </label>
           </div>

          {error && <p className="text-red-600 text-sm bg-red-50 p-2 rounded border border-red-200">{error}</p>}

          <Button type="submit" disabled={loading} className="w-full bg-gradient-to-r from-[#3B82F6] to-[#6366F1] text-white hover:opacity-90">
            {loading ? "Creating..." : "Create Event"}
          </Button>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default CreateEventModal;
