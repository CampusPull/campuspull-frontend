import React, {
  createContext,
  useState,
  useCallback,
  useMemo,
  useContext,
} from "react";
import api from "../utils/api";
import { AuthContext } from "./AuthContext";

export const InternshipContext = createContext();

export const InternshipProvider = ({ children }) => {
  const { accessToken, user } = useContext(AuthContext);

  // FIX: single isGuest flag
  const isGuest = !user;

  const [internships, setInternships] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const getAuthHeaders = () => ({
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  // Fetch Internships
  const fetchInternships = useCallback(
    async (page = 1, filters = {}) => {
      setLoading(true);
      setError(null);

      try {
        const cleanFilters = Object.fromEntries(
          Object.entries(filters).filter(([_, value]) => {
            return value !== "" && value !== null && value !== undefined;
          })
        );

        const query = new URLSearchParams({ page, ...cleanFilters }).toString();

        // FIX: guests call /public/internships, logged-in call /internships
        const endpoint = isGuest
          ? `/public/internships?${query}`
          : `/internships?${query}`;

        const res = await api.get(endpoint);

        setInternships(res.data.data);
        setCurrentPage(res.data.currentPage);
        setTotalPages(res.data.totalPages);
        setTotalItems(res.data.totalItems);

        return res.data;
      } catch (err) {
        console.error("Fetch Internships Error:", err);
        setError(err.response?.data?.message || "Failed to fetch internships");
      } finally {
        setLoading(false);
      }
    },
    [isGuest]
  );

  // Get Internship By ID
  const getInternshipById = useCallback(async (id) => {
    try {
      // FIX: guests call /public/internships/:id
      const endpoint = isGuest
        ? `/public/internships/${id}`
        : `/internships/${id}`;
      const res = await api.get(endpoint);
      return res.data.data;
    } catch (err) {
      console.error("Get Internship Error:", err);
      throw err;
    }
  }, [isGuest]);

  // Create Internship (Admin only)
  const createInternship = useCallback(
    async (data) => {
      if (!accessToken) throw new Error("Not authenticated");
      try {
        await api.post("/internships", data, getAuthHeaders());
        await fetchInternships(1);
      } catch (err) {
        console.error("Create Internship Error:", err);
        throw err;
      }
    },
    [accessToken, fetchInternships]
  );

  // Update Internship (Admin only)
  const updateInternship = useCallback(
    async (id, data) => {
      if (!accessToken) throw new Error("Not authenticated");
      try {
        const res = await api.put(`/internships/${id}`, data, getAuthHeaders());
        setInternships((prev) =>
          prev.map((item) => (item._id === id ? res.data.data : item))
        );
        return res.data.data;
      } catch (err) {
        console.error("Update Internship Error:", err);
        throw err;
      }
    },
    [accessToken]
  );

  // Delete Internship (Admin only)
  const deleteInternship = useCallback(
    async (id) => {
      if (!accessToken) throw new Error("Not authenticated");
      try {
        await api.delete(`/internships/${id}`, getAuthHeaders());
        await fetchInternships(currentPage);
      } catch (err) {
        console.error("Delete Internship Error:", err);
        throw err;
      }
    },
    [accessToken, fetchInternships, currentPage]
  );

  const contextValue = useMemo(
    () => ({
      internships,
      currentPage,
      totalPages,
      totalItems,
      loading,
      error,
      isGuest,          // FIX: expose for UI
      fetchInternships,
      getInternshipById,
      createInternship,
      updateInternship,
      deleteInternship,
    }),
    [
      internships, currentPage, totalPages, totalItems,
      loading, error, isGuest, fetchInternships, getInternshipById,
      createInternship, updateInternship, deleteInternship,
    ]
  );

  return (
    <InternshipContext.Provider value={contextValue}>
      {children}
    </InternshipContext.Provider>
  );
};

export const useInternships = () => useContext(InternshipContext);