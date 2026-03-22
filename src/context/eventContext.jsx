import React, {
  createContext,
  useState,
  useEffect,
  useMemo,
  useContext,
  useCallback,
} from "react";
import api from "../utils/api";
import { AuthContext } from "./AuthContext";

export const EventContext = createContext();

export const EventProvider = ({ children }) => {
  const { accessToken, user, loading: authLoading } = useContext(AuthContext);

  // FIX: single isGuest flag
  const isGuest = !user;

  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // FIX: modal state for guest restricted actions
  const [showAuthModal, setShowAuthModal] = useState(false);

  const getAuthHeaders = useCallback((isFormData = false) => {
    const headers = { Authorization: `Bearer ${accessToken}` };
    if (!isFormData) {
      headers['Content-Type'] = 'application/json';
    }
    return { headers };
  }, [accessToken]);

  // Fetch Events
  const fetchEvents = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // FIX: guests call /public/events, logged-in call /event
      if (isGuest) {
        const res = await api.get("/public/events");
        setEvents(res.data.data || res.data || []);
      } else {
        const res = await api.get("/event", getAuthHeaders());
        setEvents(res.data || []);
      }
    } catch (err) {
      console.error("Error fetching events:", err);
      setError(err.response?.data?.error || 'Failed to fetch events.');
    } finally {
      setLoading(false);
    }
  }, [accessToken, isGuest, getAuthHeaders]);

  // Create Event — protected
  const createEvent = useCallback(async (formData) => {
    if (isGuest) { setShowAuthModal(true); return; }
    setError(null);
    try {
      const res = await api.post("/event", formData, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      const newEvent = { type: "event", ...res.data };
      setEvents(prev => [...prev, newEvent].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
      return newEvent;
    } catch (err) {
      console.error("Error creating event:", err);
      setError(err.response?.data?.error || 'Failed to create event.');
      throw err;
    }
  }, [accessToken, isGuest]);

  // Update Event — protected
  const updateEvent = useCallback(async (id, formData) => {
    if (isGuest) { setShowAuthModal(true); return; }
    setError(null);
    try {
      const res = await api.put(`/event/${id}`, formData, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      const updatedEvent = { type: "event", ...res.data };
      setEvents(prev => prev.map(e => (e._id === id ? updatedEvent : e)));
      return updatedEvent;
    } catch (err) {
      console.error("Error updating event:", err);
      setError(err.response?.data?.error || 'Failed to update event.');
      throw err;
    }
  }, [accessToken, isGuest]);

  // Delete Event — protected
  const deleteEvent = useCallback(async (id) => {
    if (isGuest) { setShowAuthModal(true); return; }
    setError(null);
    try {
      await api.delete(`/event/${id}`, getAuthHeaders());
      setEvents(prev => prev.filter(e => e._id !== id));
    } catch (err) {
      console.error("Error deleting event:", err);
      setError(err.response?.data?.error || 'Failed to delete event.');
      throw err;
    }
  }, [accessToken, isGuest, getAuthHeaders]);

  // Increment Interest — protected
  const incrementInterest = useCallback(async (eventId) => {
    // FIX: guest clicks Register/Interested → open modal
    if (isGuest) { setShowAuthModal(true); return; }

    try {
      const res = await api.patch(`/event/${eventId}/interest`, {}, getAuthHeaders());
      const { interestCount: updatedInterestCount, interestedUsers: updatedInterestedUsers } = res.data;

      if (typeof updatedInterestCount === 'number' && Array.isArray(updatedInterestedUsers)) {
        setEvents((prevEvents) =>
          prevEvents.map((event) => {
            if (event._id === eventId) {
              return {
                ...event,
                interestCount: updatedInterestCount,
                interestedUsers: updatedInterestedUsers,
                isInterested: user?._id ? updatedInterestedUsers.includes(user._id) : false,
              };
            }
            return event;
          })
        );
      }
      return res.data;
    } catch (err) {
      console.error("Increment Interest Error:", err.response?.data?.message || err.message);
      throw err;
    }
  }, [accessToken, isGuest, getAuthHeaders, user]);

  // Initial Data Load
  // FIX: fetch for both guests and logged-in users
  useEffect(() => {
    if (!authLoading) {
      fetchEvents();
    }
  }, [authLoading, accessToken, fetchEvents]);

  const contextValue = useMemo(() => ({
    events,
    loading,
    error,
    isGuest,           // FIX: expose for events page
    showAuthModal,     // FIX: expose for modal rendering
    setShowAuthModal,  // FIX: expose for modal close
    fetchEvents,
    createEvent,
    updateEvent,
    deleteEvent,
    incrementInterest,
  }), [events, loading, error, isGuest, showAuthModal,
      fetchEvents, createEvent, updateEvent, deleteEvent, incrementInterest]);

  return (
    <EventContext.Provider value={contextValue}>
      {children}
    </EventContext.Provider>
  );
};

export const useEvents = () => useContext(EventContext);