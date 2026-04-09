// src/context/AnnouncementContext.jsx
import React, {
  createContext,
  useState,
  useEffect,
  useContext,
  useMemo,
  useCallback,
} from "react";
import api from "../utils/api"; // Adjust path if needed
import { AuthContext } from "./AuthContext"; // Adjust path if needed

export const AnnouncementContext = createContext();

export const AnnouncementProvider = ({ children }) => {
  const { user, accessToken, loading: authLoading } = useContext(AuthContext);
  const isGuest = !user;

  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Helper for auth headers
  const getAuthHeaders = useCallback(() => ({
    headers: { Authorization: `Bearer ${accessToken}` },
  }), [accessToken]);

  // Fetch Announcements
  const fetchAnnouncements = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const endpoint = isGuest ? "/public/announcements" : "/announcements";
      const res = await api.get(endpoint, !isGuest ? getAuthHeaders() : {});
      setAnnouncements(res.data.data || res.data || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch announcements.');
      console.error("Fetch Announcements Error:", err);
    } finally {
      setLoading(false);
    }
  }, [isGuest, getAuthHeaders]);

  // Create Announcement
  const createAnnouncement = useCallback(async (formData) => {
    if (isGuest) throw new Error("Not authenticated");
    setError(null);
   try {
      // --- FIX: Remove explicit headers for FormData ---
      const res = await api.post('/announcements', formData, {
         headers: {
           // Let browser set Content-Type for multipart/form-data
           Authorization: `Bearer ${accessToken}`, 
         }
      });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create announcement.');
      console.error("Create Announcement Error:", err);
      throw err; // Re-throw for the modal to handle
    }
  }, [accessToken, isGuest, getAuthHeaders]);

  // --- Update Announcement ---
  const updateAnnouncement = useCallback(async (id, formData) => { // Expect FormData for potential file update
    if (isGuest) throw new Error("Not authenticated");
    setError(null);
    try {
      const res = await api.put(`/announcements/${id}`, formData, {
         headers: {
           Authorization: `Bearer ${accessToken}`,
           // Let browser set Content-Type for multipart/form-data
         }
      });
      // Update the announcement in the local state
      setAnnouncements((prev) =>
        prev.map((ann) => (ann._id === id ? res.data : ann))
      );
      return res.data; // Return the updated announcement
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update announcement.');
      console.error("Update Announcement Error:", err);
      throw err;
    }
  }, [accessToken, isGuest]);

  // --- Delete Announcement ---
  const deleteAnnouncement = useCallback(async (id) => {
    if (isGuest) throw new Error("Not authenticated");
    setError(null);
    try {
      await api.delete(`/announcements/${id}`, getAuthHeaders());
      // Remove the announcement from the local state
      setAnnouncements((prev) => prev.filter((ann) => ann._id !== id));
      // No data to return on successful delete
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete announcement.');
      console.error("Delete Announcement Error:", err);
      throw err;
    }
  }, [isGuest, getAuthHeaders]);

  useEffect(() => {
    if (!authLoading) {
      fetchAnnouncements();
    }
  }, [authLoading, fetchAnnouncements]); // Dependency array includes the memoized fetch function

  // Context Value
  const value = useMemo(
    () => ({
      announcements,
      loading,
      error,
      isGuest,
      fetchAnnouncements,
      createAnnouncement,
      updateAnnouncement,
      deleteAnnouncement,
    }),
    [announcements, loading, error, isGuest, fetchAnnouncements, createAnnouncement, updateAnnouncement,deleteAnnouncement]
  );

  return (
    <AnnouncementContext.Provider value={value}>
      {children}
    </AnnouncementContext.Provider>
  );
};

// Custom hook for easy consumption
export const useAnnouncements = () => useContext(AnnouncementContext);