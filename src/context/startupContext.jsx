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

export const StartupContext = createContext();

export const StartupProvider = ({ children }) => {
  const { accessToken, user, loading: authLoading } = useContext(AuthContext);

  // FIX: single isGuest flag
  const isGuest = !user;

  const [startups, setStartups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // FIX: modal state for guest restricted actions
  const [showAuthModal, setShowAuthModal] = useState(false);

  const getAuthHeaders = useCallback((isFormData = false) => {
    const headers = { Authorization: `Bearer ${accessToken}` };
    if (!isFormData) {
      headers["Content-Type"] = "application/json";
    }
    return { headers };
  }, [accessToken]);

  // Fetch Startups
  const fetchStartups = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // FIX: guests call /public/startups, logged-in call /startups
      if (isGuest) {
        const res = await api.get("/public/startups");
        setStartups(res.data?.data || res.data || []);
      } else {
        const res = await api.get("/startups", getAuthHeaders());
        setStartups(res.data?.data || []);
      }
    } catch (err) {
      console.error("Error fetching startups:", err);
      setError(err.response?.data?.message || "Failed to fetch startups.");
    } finally {
      setLoading(false);
    }
  }, [accessToken, isGuest, getAuthHeaders]);

  // Create Startup — protected
  const createStartup = useCallback(async (formData) => {
    // FIX: guest guard
    if (isGuest) { setShowAuthModal(true); return; }

    setError(null);
    try {
      const res = await api.post("/startups", formData, getAuthHeaders(true));
      const newStartup = res.data.data;
      setStartups((prev) =>
        [newStartup, ...prev].sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        )
      );
      return newStartup;
    } catch (err) {
      console.error("Error creating startup:", err);
      setError(err.response?.data?.message || "Failed to create startup.");
      throw err;
    }
  }, [accessToken, isGuest, getAuthHeaders]);

  // FIX: load for both guests and logged-in users
  useEffect(() => {
    if (!authLoading) {
      fetchStartups();
    }
  }, [authLoading, accessToken, isGuest, fetchStartups]);

  const contextValue = useMemo(() => ({
    startups,
    loading,
    error,
    isGuest,           // FIX: expose for UI
    showAuthModal,     // FIX: expose for modal
    setShowAuthModal,  // FIX: expose for modal close
    fetchStartups,
    createStartup,
  }), [startups, loading, error, isGuest, showAuthModal, fetchStartups, createStartup]);

  return (
    <StartupContext.Provider value={contextValue}>
      {children}
    </StartupContext.Provider>
  );
};

export const useStartups = () => useContext(StartupContext);