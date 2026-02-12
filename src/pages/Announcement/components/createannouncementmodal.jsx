// src/pages/announcements/components/CreateAnnouncementModal.jsx
import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
// Remove direct api import if not needed elsewhere in this file
// import api from '../../../utils/api';
import { useAnnouncements } from '../../../context/announcementContext'; // Correct path assumed

const CreateAnnouncementModal = ({ isOpen, onClose, onCreated }) => {
  // --- FIX 1: Import createAnnouncement from context ---
  const { createAnnouncement } = useAnnouncements();
  // --- END FIX ---

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [important, setImportant] = useState(false);
  const [loading, setLoading] = useState(false);
  const [attachment, setAttachment] = useState(null);
  const [error, setError] = useState(null);

  if (!isOpen) return null;

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
    if (attachment) {
      formData.append('attachment', attachment); // Append the file if selected
    }
    
    try {
      // --- FIX 2: Use the context function ---
      const newAnnouncement = await createAnnouncement(formData);

      onCreated(newAnnouncement); // Pass the newly created announcement back
      setTitle('');
      setContent('');
      setImportant(false);
      setAttachment(null);
      onClose();
    } catch (err) {
      // Error message is already set within the context function,
      // but we can catch it here if needed for specific modal feedback
      setError(err.message || 'Failed to create announcement.');
      console.error("Create Announcement Error:", err);
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

        <h2 className="text-xl font-semibold mb-4">Create New Announcement</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1 font-medium text-sm">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full border rounded px-3 py-2"
              required
              maxLength={150} // Match backend model
            />
          </div>

          <div>
            <label className="block mb-1 font-medium text-sm">Content</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full border rounded px-3 py-2 h-32 resize-none" // Removed resize-x, kept resize-y
              required
            />
          </div>

          <div>
            <label className="block mb-1 font-medium text-sm">Attachment (Optional)</label>
            <input
              type="file"
              onChange={handleFileChange}
              className="w-full border rounded px-3 py-2 text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
            {attachment && (
              <p className="text-xs text-gray-500 mt-1">Selected: {attachment.name}</p>
            )}
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="important-checkbox"
              checked={important}
              onChange={(e) => setImportant(e.target.checked)}
              className="w-4 h-4 text-academic-blue border-slate-300 rounded focus:ring-academic-blue"
            />
            <label htmlFor="important-checkbox" className="ml-2 block text-sm font-medium">
              Mark as Important
            </label>
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <Button type="submit" disabled={loading} className="w-full bg-academic-blue hover:bg-blue-700">
            {loading ? "Creating..." : "Create Announcement"}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default CreateAnnouncementModal;
