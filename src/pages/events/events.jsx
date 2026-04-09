import React, { useState, useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PlusCircle, Search, Inbox, AlertTriangle } from "lucide-react";
import { Helmet } from 'react-helmet';
import { useEvents } from "../../context/eventContext";
import { useAuth } from "../../context/AuthContext";
import EventCard from "./components/eventCard";
import CreateEventModal from "./components/createEventModal";
import EditEventModal from "./components/editEventModal";
import SignupModal from "../../components/ui/SignupModal"; // FIX: import modal

const EventsPage = () => {
  const {
    events,
    loading,
    error,
    deleteEvent,
    isGuest,          // FIX: from eventContext
    showAuthModal,    // FIX: from eventContext
    setShowAuthModal, // FIX: from eventContext
  } = useEvents();

  const { user } = useAuth();

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDeleting, setIsDeleting] = useState(null);

  // FIX: guests can never manage events
  const canManageEvents = user?.role === "admin" || user?.role === "alumni" || user?.role === "teacher";

  const handleEditClick = (eventToEdit) => setEditingEvent(eventToEdit);

  const handleDeleteClick = async (id) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      setIsDeleting(id);
      try {
        await deleteEvent(id);
      } catch (err) {
        alert(`Deletion failed: ${err.message || 'Unknown error'}`);
      } finally {
        setIsDeleting(null);
      }
    }
  };

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

      <div className="min-h-screen bg-gradient-to-b from-[#F3F4FD] via-white to-[#E0E7FF] py-6 px-4 sm:px-6 lg:px-8 text-[#1E293B]">

        {/* Header */}
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

        {/* FIX: Guest banner */}
        {isGuest && (
          <div className="max-w-6xl mx-auto mb-6 p-4 bg-blue-50 border border-blue-200 rounded-2xl flex items-center justify-between gap-4">
            <p className="text-blue-700 font-medium text-sm">
              👋 You're browsing as a guest. Create an account to register for events.
            </p>
            <button
              onClick={() => setShowAuthModal(true)}
              className="shrink-0 px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-xl hover:bg-blue-700 transition"
            >
              Join Now
            </button>
          </div>
        )}

        {/* Search & Create Bar */}
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
          {/* FIX: only logged-in managers see Create button */}
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
          {loading && <p className="text-center text-gray-500">Loading events...</p>}

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
              {filteredEvents.map((event, index) => {
                if (!event || !event._id) return null;
                return (
                  <EventCard
                    key={event._id}
                    event={event}
                    onEdit={handleEditClick}
                    onDelete={handleDeleteClick}
                    isDeleting={isDeleting === event._id}
                    isGuest={isGuest}                          // FIX: pass guest state
                    onRestrictedAction={() => setShowAuthModal(true)} // FIX: pass modal trigger
                  />
                );
              })}
            </div>
          )}
        </div>

        {/* Modals — only for logged-in users */}
        <AnimatePresence>
          {showCreateModal && (
            <CreateEventModal
              isOpen={showCreateModal}
              onClose={() => setShowCreateModal(false)}
              onEventCreated={() => setShowCreateModal(false)}
            />
          )}
          {editingEvent && (
            <EditEventModal
              isOpen={!!editingEvent}
              onClose={() => setEditingEvent(null)}
              event={editingEvent}
              onEventUpdated={() => setEditingEvent(null)}
            />
          )}
        </AnimatePresence>

        {/* FIX: Signup modal for guest restricted actions */}
        {showAuthModal && (
          <SignupModal
            isOpen={showAuthModal}
            onClose={() => setShowAuthModal(false)}
            message="Create an account to register for events"
          />
        )}
      </div>
    </>
  );
};

export default EventsPage;