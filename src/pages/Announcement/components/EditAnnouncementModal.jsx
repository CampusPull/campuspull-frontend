// src/pages/announcements/components/EditAnnouncementModal.jsx
import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { useAnnouncements } from '../../../context/announcementContext';

const EditAnnouncementModal = ({ isOpen, onClose, announcement, onUpdated }) => {
  const { updateAnnouncement } = useAnnouncements();

  // State initialized from the announcement prop
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [important, setImportant] = useState(false);
  const [attachment, setAttachment] = useState(null); // For new attachment
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Pre-fill form when the announcement prop changes
 useEffect(() => {
    console.log("[EditAnnouncementModal useEffect] Running. Announcement Prop:", announcement);

    if (announcement) {
      // Set state directly
      setTitle(announcement.title || '');
      setContent(announcement.content || '');
      setImportant(announcement.important || false);
      setAttachment(null); // Reset file input

      // --- FIX: Log the actual state variables ---
      console.log("[EditAnnouncementModal useEffect] Setting state:", {
        title: announcement.title || '',
        content: announcement.content || '',
        important: announcement.important || false,
      });
      // --- END FIX ---
    } else {
      console.log("[EditAnnouncementModal useEffect] Announcement prop is null/undefined.");
    }
  }, [announcement]);

  if (!isOpen || !announcement) return null;

  const handleFileChange = (e) => {
    setAttachment(e.target.files[0] || null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append('title', title);
    formData.append('content', content);
    formData.append('important', important);
    if (attachment) { // Only append if a *new* file is selected
      formData.append('attachment', attachment);
    }

    try {
      await updateAnnouncement(announcement._id, formData);
      onUpdated(); // Call the success handler passed from parent
      onClose();   // Close the modal
    } catch (err) {
      setError(err.message || 'Failed to update announcement.');
      console.error("Update Announcement Error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-2xl p-6 w-full max-w-lg relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
          disabled={loading}
        >
          <Icon name="X" size={20} />
        </button>

        <h2 className="text-xl font-semibold mb-4">Edit Announcement</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Title */}
          <div>
            <label className="block mb-1 font-medium text-sm">Title</label>
            <input
              type="text" value={title} onChange={(e) => setTitle(e.target.value)}
              className="w-full border rounded px-3 py-2" required maxLength={150}
            />
          </div>

          {/* Content */}
          <div>
            <label className="block mb-1 font-medium text-sm">Content</label>
            <textarea
              value={content} onChange={(e) => setContent(e.target.value)}
              className="w-full border rounded px-3 py-2 h-32 resize-none" required
            />
          </div>

          {/* File Input */}
          <div>
            <label className="block mb-1 font-medium text-sm">New Attachment (Optional)</label>
            <input
              type="file" onChange={handleFileChange}
              className="w-full border rounded px-3 py-2 text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
            {announcement.attachmentUrl && !attachment && (
              <p className="text-xs text-gray-500 mt-1">Current: <a href={announcement.attachmentUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">{announcement.attachmentUrl.split('/').pop()}</a></p>
            )}
             {attachment && (
              <p className="text-xs text-gray-500 mt-1">New: {attachment.name}</p>
            )}
          </div>

          {/* Important Checkbox */}
          <div className="flex items-center">
            <input
              type="checkbox" id="edit-important-checkbox" checked={important} onChange={(e) => setImportant(e.target.checked)}
              className="w-4 h-4 text-academic-blue border-slate-300 rounded focus:ring-academic-blue"
            />
            <label htmlFor="edit-important-checkbox" className="ml-2 block text-sm font-medium">
              Mark as Important
            </label>
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <Button type="submit" disabled={loading} className="w-full bg-academic-blue hover:bg-blue-700">
            {loading ? "Saving Changes..." : "Save Changes"}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default EditAnnouncementModal;
