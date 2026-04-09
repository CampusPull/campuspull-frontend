// src/pages/announcements/AnnouncementPage.jsx
import React, { useState, useContext } from 'react'; // Removed useEffect
import { Helmet } from 'react-helmet';
// Removed Header import - Assuming it's global
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import AnnouncementCard from './components/announcementCard'; // Corrected case
import CreateAnnouncementModal from './components/createannouncementmodal'; // Corrected case
import LoadingSkeleton from './components/loadingSkeleton';
import { useAuth } from '../../context/AuthContext';
// Removed api import - Context handles API calls
import { useAnnouncements } from '../../context/announcementContext'; // <-- 1. Import the hook
import EditAnnouncementModal from './components/EditAnnouncementModal';

const AnnouncementPage = () => {
  const { user } = useAuth();
  // --- 2. Use the context ---
  const { announcements, loading, error,deleteAnnouncement } = useAnnouncements();
  // --- END ---

  // Removed local state for announcements, loading, error

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingAnnouncement, setEditingAnnouncement] = useState(null); 
  const [isDeleting, setIsDeleting] = useState(null);

  // Determine if the user can create announcements
  const canCreateAnnouncements = user?.role === 'admin' || user?.role === 'teacher';

  // Removed useEffect for fetching - Context handles this

  const handleAnnouncementCreated = (newAnnouncement) => {
   setIsCreateModalOpen(false);
  };
  // --- Handler for clicking Edit button ---
  const handleEditClick = (announcementToEdit) => {
    console.log("[AnnouncementPage] handleEditClick received:", announcementToEdit);
    setEditingAnnouncement(announcementToEdit);
  };

  // --- Handler for clicking Delete button ---
  const handleDeleteClick = async (id) => {
    // Optional: Add a confirmation dialog
    if (window.confirm('Are you sure you want to delete this announcement?')) {
      setIsDeleting(id); // Show loading/disabled state on the specific card (optional)
      try {
        await deleteAnnouncement(id);
        // State updates automatically via context
      } catch (err) {
        // Optionally show an error message to the user
        alert(`Deletion failed: ${err.message}`);
        console.error("Delete failed:", err);
      } finally {
        setIsDeleting(null);
      }
    }
  };

  const handleAnnouncementUpdated = () => {
    setEditingAnnouncement(null); // Close the edit modal on success
  };

  return (
    <>
      <Helmet>
        <title>Announcements - CampusPull</title>
        <meta name="description" content="View important announcements and updates." />
      </Helmet>

      <div className="min-h-screen bg-background p-4 lg:p-6 space-y-6">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
             <div className="w-10 h-10 bg-gradient-to-br from-achievement-amber to-orange-500 rounded-lg flex items-center justify-center">
               <Icon name="Megaphone" size={20} color="white" />
             </div>
             <div>
               <h1 className="font-poppins font-bold text-wisdom-charcoal text-2xl lg:text-3xl">
                 Announcements
               </h1>
               <p className="text-insight-gray text-sm">
                 Latest updates and important information.
               </p>
             </div>
           </div>
           {/* Create Button (for Admins/Teachers) */}
           {canCreateAnnouncements && (
             <Button
               variant="default"
               className="bg-academic-blue hover:bg-blue-700"
               iconName="Plus"
               onClick={() => setIsCreateModalOpen(true)}
             >
               New Announcement
             </Button>
           )}
         </div>

        {/* Display Announcements or Loading/Error State */}
        {loading && <LoadingSkeleton count={3} />}

        {error && (
          <div className="text-center py-12 text-red-600">
            <Icon name="AlertTriangle" size={48} className="mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">Error Loading Announcements</h3>
            <p className="text-sm">{error}</p>
          </div>
        )}

        {/* Use context state for announcements */}
        {!loading && !error && announcements.length === 0 && (
          <div className="text-center py-12">
            <Icon name="Inbox" size={48} color="var(--color-insight-gray)" className="mx-auto mb-4" />
            <h3 className="text-lg font-medium text-wisdom-charcoal mb-2">No Announcements Yet</h3>
            <p className="text-insight-gray text-sm">Check back later for updates.</p>
          </div>
        )}

        {!loading && !error && announcements.length > 0 && (
          <div className="space-y-4">
            {/* Map over announcements from context */}
            {announcements.map((announcement) => (
              <AnnouncementCard
                key={announcement._id}
                announcement={announcement}
                onEdit={handleEditClick}   
                onDelete={handleDeleteClick}
                isDeleting={isDeleting === announcement._id}
              />
            ))}
          </div>
        )}
      </div>

      {/* Create Modal */}
      {isCreateModalOpen && (
        <CreateAnnouncementModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          onCreated={handleAnnouncementCreated} // Pass handler (optional now)
        />
      )}
      {editingAnnouncement && (
        <EditAnnouncementModal
          isOpen={!!editingAnnouncement}
          onClose={() => setEditingAnnouncement(null)}
          announcement={editingAnnouncement}
          onUpdated={handleAnnouncementUpdated} // Handler for when update succeeds
        />
      )}
    </>
  );
};

export default AnnouncementPage;
