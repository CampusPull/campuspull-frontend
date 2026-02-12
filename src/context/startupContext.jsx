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

  const [startups, setStartups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Helper for auth headers
  const getAuthHeaders = useCallback((isFormData = false) => {
    const headers = { Authorization: `Bearer ${accessToken}` };
    if (!isFormData) {
      headers["Content-Type"] = "application/json";
    }
    return { headers };
  }, [accessToken]);

  // Fetch Startups
  const fetchStartups = useCallback(async () => {
    if (!accessToken) {
      setStartups([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const res = await api.get("/startups", getAuthHeaders());
      setStartups(res.data?.data || []);
    } catch (err) {
      console.error("Error fetching startups:", err);
      setError(err.response?.data?.message || "Failed to fetch startups.");
    } finally {
      setLoading(false);
    }
  }, [accessToken, getAuthHeaders]);

  // Create Startup (ADMIN – backend enforced)
  const createStartup = useCallback(async (formData) => {
    if (!accessToken) throw new Error("Not authenticated");

    setError(null);
    try {
      const res = await api.post(
        "/startups",
        formData,
        getAuthHeaders(true)
      );

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
  }, [accessToken, getAuthHeaders]);

  // Initial Load (mirrors EventContext exactly)
  useEffect(() => {
    if (!authLoading && accessToken) {
      fetchStartups();
    } else if (!authLoading && !accessToken) {
      setStartups([]);
      setLoading(false);
      setError(null);
    } else {
      setLoading(true);
    }
  }, [authLoading, accessToken, fetchStartups]);

  const contextValue = useMemo(() => ({
    startups,
    loading,
    error,
    fetchStartups,
    createStartup,
  }), [startups, loading, error, fetchStartups, createStartup]);

  return (
    <StartupContext.Provider value={contextValue}>
      {children}
    </StartupContext.Provider>
  );
};

export const useStartups = () => useContext(StartupContext);
