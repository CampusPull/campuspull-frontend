// src/pages/events/events.jsx (or your file path)
import React, { useState, useContext } from "react"; // Removed useEffect unless needed later
import { motion, AnimatePresence } from "framer-motion";
import { PlusCircle, Search, Inbox, AlertTriangle } from "lucide-react"; // Updated icons
import { Helmet } from 'react-helmet'; // Added Helmet

// Import Context Hooks
import { useEvents } from "../../context/eventContext"; // Adjust path
import { useAuth } from "../../context/AuthContext";   // Adjust path

// Import Components
import EventCard from "./components/eventCard";             // We'll create/update this next
import CreateEventModal from "./components/createEventModal"; // We'll create/update this next
import EditEventModal from "./components/editEventModal";     // We'll create/update this next
// import LoadingSkeleton from './components/LoadingSkeleton'; // Optional: Create a skeleton

const EventsPage = () => {
  // --- Get data from Context ---
  const { events, loading, error, deleteEvent } = useEvents();
  const { user } = useAuth();
  // ---

  // --- Local UI State ---
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null); // Holds the event object being edited
  const [searchTerm, setSearchTerm] = useState(""); // Basic search state
  const [isDeleting, setIsDeleting] = useState(null); // Track which event is being deleted
  // ---

  // --- Role Check for Creating/Editing ---
  // Based on your backend: admin or alumni can create/edit/delete
  const canManageEvents = user?.role === "admin" || user?.role === "alumni"|| user?.role === "teacher";

  // --- Event Handlers ---
  const handleEditClick = (eventToEdit) => {
    setEditingEvent(eventToEdit);
  };

  const handleDeleteClick = async (id) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      setIsDeleting(id);
      try {
        await deleteEvent(id);
        // State updates via context
      } catch (err) {
        alert(`Deletion failed: ${err.message || 'Unknown error'}`);
        console.error("Delete failed:", err);
      } finally {
        setIsDeleting(null);
      }
    }
  };

  const handleEventCreated = () => {
    setShowCreateModal(false); // Close modal after creation
    // Data updates via context
  };

  const handleEventUpdated = () => {
    setEditingEvent(null); // Close modal after update
    // Data updates via context
  };

  // --- Filtering Logic (Basic Example) ---
  const filteredEvents = events.filter(event =>
    event.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    event.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <Helmet>
        <title>Events - CampusPull</title>
        <meta name="description" content="Discover and manage campus events." />
      </Helmet>
      {/* Assume Header is global via App.js */}
      <div className="min-h-screen bg-gradient-to-b from-[#F3F4FD] via-white to-[#E0E7FF] py-6 px-4 sm:px-6 lg:px-8 text-[#1E293B]">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10"
        >
          <h1 className="text-4xl sm:text-5xl font-extrabold text-[#3B82F6] mb-3">
            CampusPull Events
          </h1>
          <p className="text-[#475569] text-base sm:text-lg max-w-2xl mx-auto">
            Discover upcoming workshops, seminars, meetups, and activities.
          </p>
        </motion.div>

        {/* Search & Create Button Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-center sm:justify-between gap-4 mb-10 max-w-6xl mx-auto">
          <div className="relative w-full sm:max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search events by title or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-full border border-[#CBD5E1] shadow-sm focus:ring-2 focus:ring-[#6366F1] focus:outline-none bg-white"
            />
          </div>
          {canManageEvents && (
            <motion.button
              onClick={() => setShowCreateModal(true)}
              whileHover={{ scale: 1.05 }}
              className="w-full sm:w-auto bg-gradient-to-r from-[#3B82F6] to-[#6366F1] text-white font-semibold rounded-full shadow-md px-5 py-2.5 flex items-center justify-center gap-2 hover:opacity-90"
            >
              <PlusCircle size={20} /> Create Event
            </motion.button>
          )}
        </div>

        {/* Event Display Area */}
        <div className="max-w-7xl mx-auto">
          {loading && <p className="text-center text-gray-500">Loading events...</p> /* Replace with Skeleton */}
          
          {error && (
            <div className="text-center py-10 text-red-600">
              <AlertTriangle size={40} className="mx-auto mb-2" />
              <p>Error loading events: {error}</p>
            </div>
          )}

          {!loading && !error && filteredEvents.length === 0 && (
            <div className="text-center py-16">
              <Inbox size={48} className="mx-auto mb-4 text-gray-400" />
              <p className="text-gray-500 text-lg">
                {searchTerm ? "No events match your search." : "No events scheduled yet."}
              </p>
              {canManageEvents && !searchTerm && (
                 <p className="text-gray-500 text-sm mt-2">Why not create the first one?</p>
              )}
            </div>
          )}

          {!loading && !error && filteredEvents.length > 0 && (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {filteredEvents.map((event, index) => { // Added index for logging


              // Add a quick check here too before rendering the card
              if (!event || !event._id) {
                console.error(`[EventsPage] Skipping render for invalid event at index ${index}:`, event);
                return null; // Don't render card if event is invalid
              }

              return (
                <EventCard
                  key={event._id}
                  event={event} // Pass the validated event object
                  onEdit={handleEditClick}
                  onDelete={handleDeleteClick}
                  isDeleting={isDeleting === event._id}
                />
              );
            })}
          </div>
        )}
      </div>

        {/* Modals */}
        <AnimatePresence>
          {showCreateModal && (
            <CreateEventModal
              isOpen={showCreateModal}
              onClose={() => setShowCreateModal(false)}
              onEventCreated={handleEventCreated}
            />
          )}
          {editingEvent && (
            <EditEventModal
              isOpen={!!editingEvent}
              onClose={() => setEditingEvent(null)}
              event={editingEvent}
              onEventUpdated={handleEventUpdated}
            />
          )}
        </AnimatePresence>

        {/* Removed Floating Button if Create button is now at the top */}
      </div>
    </>
  );
};

export default EventsPage;
