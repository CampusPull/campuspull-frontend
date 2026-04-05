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
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Helper for auth headers
  const getAuthHeaders = useCallback((isFormData = false) => {
    const headers = { Authorization: `Bearer ${accessToken}` };
    if (!isFormData) {
      headers['Content-Type'] = 'application/json';
    }
    return { headers };
  }, [accessToken]);

  // Fetch Events
  const fetchEvents = useCallback(async () => {
    if (!user || !accessToken) {
      setEvents([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const res = await api.get("/event", getAuthHeaders());
      setEvents(res.data || []);
    } catch (err) {
      console.error("Error fetching events:", err);
      setError(err.response?.data?.error || 'Failed to fetch events.');
    } finally {
      setLoading(false);
    }
  }, [accessToken, user, getAuthHeaders]);

  // Create Event
  const createEvent = useCallback(async (formData) => {
    if (!accessToken) throw new Error("Not authenticated");
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
  }, [accessToken]);

  // Update Event
  const updateEvent = useCallback(async (id, formData) => {
    if (!accessToken) throw new Error("Not authenticated");
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
  }, [accessToken]);

  // Delete Event
  const deleteEvent = useCallback(async (id) => {
    if (!accessToken) throw new Error("Not authenticated");
    setError(null);
    try {
      await api.delete(`/event/${id}`, getAuthHeaders());
      setEvents(prev => prev.filter(e => e._id !== id));
    } catch (err) {
      console.error("Error deleting event:", err);
      setError(err.response?.data?.error || 'Failed to delete event.');
      throw err;
    }
  }, [accessToken, getAuthHeaders]);

  // Increment Interest (Fixed & Safe)
  const incrementInterest = useCallback(async (eventId) => {
    if (!accessToken) throw new Error("Not authenticated");

    try {
      const res = await api.patch(`/event/${eventId}/interest`, {}, getAuthHeaders());
      const { interestCount: updatedInterestCount, interestedUsers: updatedInterestedUsers } = res.data;

      if (typeof updatedInterestCount === 'number' && Array.isArray(updatedInterestedUsers)) {
        setEvents((prevEvents) => {
          return prevEvents.map((event) => {
            if (event._id === eventId) {
              return {
                ...event,
                interestCount: updatedInterestCount,
                interestedUsers: updatedInterestedUsers,
                // Defensive check: ensure user exists before checking ID
                isInterested: user?._id ? updatedInterestedUsers.includes(user._id) : false,
              };
            }
            return event;
          });
        });
      } else {
        console.error("[EventContext incrementInterest] Invalid response data:", res.data);
      }
      return res.data;
    } catch (err) {
      console.error("Increment Interest Error in Context:", err.response?.data?.message || err.message);
      throw err;
    }
  }, [accessToken, getAuthHeaders, user]);

  // Initial Data Load
  useEffect(() => {
    if (!authLoading && accessToken) {
      fetchEvents();
    } else if (!authLoading && !accessToken) {
      setEvents([]);
      setLoading(false);
      setError(null);
    } else {
      setLoading(true);
    }
  }, [authLoading, accessToken, fetchEvents, user]);

  const contextValue = useMemo(() => ({
    events,
    loading,
    error,
    fetchEvents,
    createEvent,
    updateEvent,
    deleteEvent,
    incrementInterest,
  }), [events, loading, error, fetchEvents, createEvent, updateEvent, deleteEvent, incrementInterest]);

  return (
    <EventContext.Provider value={contextValue}>
      {children}
    </EventContext.Provider>
  );
};

export const useEvents = () => useContext(EventContext);