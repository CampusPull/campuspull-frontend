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

  const isGuest = !user;
  const isAdmin = user?.role === "admin"; // ✅ IMPORTANT

  const [internships, setInternships] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const getAuthHeaders = () => ({
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  // ✅ FETCH
  const fetchInternships = useCallback(
    async (page = 1, filters = {}) => {
      setLoading(true);
      setError(null);

      try {
        const cleanFilters = Object.fromEntries(
          Object.entries(filters).filter(
            ([_, value]) => value !== "" && value !== null && value !== undefined
          )
        );

        const query = new URLSearchParams({ page, ...cleanFilters }).toString();

        const res = await api.get(`/internships?${query}`);

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
    []
  );

  // ✅ GET BY ID
  const getInternshipById = useCallback(async (id) => {
    const res = await api.get(`/internships/${id}`);
    return res.data.data;
  }, []);

  // ✅ CREATE (Admin UI only, backend enforces)
  const createInternship = useCallback(
    async (data) => {
      if (!accessToken) throw new Error("Not authenticated");

      const res = await api.post("/internships", data, getAuthHeaders());

      // ✅ optimistic update instead of refetch
      setInternships((prev) => [res.data.data, ...prev]);

      return res.data.data;
    },
    [accessToken]
  );

  // ✅ UPDATE DETAILS
  const updateInternship = useCallback(
    async (id, data) => {
      if (!accessToken) throw new Error("Not authenticated");

      const res = await api.put(`/internships/${id}`, data, getAuthHeaders());

      setInternships((prev) =>
        prev.map((item) => (item._id === id ? res.data.data : item))
      );

      return res.data.data;
    },
    [accessToken]
  );

  // ✅ TOGGLE STATUS (NEW - aligned with backend)
  const toggleInternshipStatus = useCallback(
    async (id, currentStatus) => {
      if (!accessToken) throw new Error("Not authenticated");

      const newStatus = currentStatus === "open" ? "closed" : "open";

      const res = await api.patch(
        `/internships/${id}/status`,
        { status: newStatus },
        getAuthHeaders()
      );

      setInternships((prev) =>
        prev.map((item) =>
          item._id === id ? { ...item, status: newStatus } : item
        )
      );

      return res.data.data;
    },
    [accessToken]
  );

  // ✅ DELETE
  const deleteInternship = useCallback(
    async (id) => {
      if (!accessToken) throw new Error("Not authenticated");

      await api.delete(`/internships/${id}`, getAuthHeaders());

      // ✅ local removal instead of refetch
      setInternships((prev) => prev.filter((item) => item._id !== id));
    },
    [accessToken]
  );

  // ✅ TOGGLE SAVE/BOOKMARK (NEW)
  const toggleSaveInternship = useCallback(
    async (id) => {
      if (!accessToken) throw new Error("Not authenticated");

      const res = await api.post(`/internships/${id}/save`, {}, getAuthHeaders());
      const { saved } = res.data;

      // Update state locally
      setInternships((prev) =>
        prev.map((item) => {
          if (item._id === id) {
            const userId = user?._id || user?.id;
            let updatedSavedBy = item.savedBy || [];
            if (saved) {
              if (!updatedSavedBy.includes(userId)) {
                updatedSavedBy = [...updatedSavedBy, userId];
              }
            } else {
              updatedSavedBy = updatedSavedBy.filter((uid) => uid !== userId);
            }
            return { ...item, savedBy: updatedSavedBy };
          }
          return item;
        })
      );

      return res.data;
    },
    [accessToken, user]
  );

  // ✅ DIRECT APPLY ON WEBSITE (NEW)
  const applyToInternship = useCallback(
    async (id, formData) => {
      if (!accessToken) throw new Error("Not authenticated");

      const res = await api.post(`/internships/${id}/apply`, formData, getAuthHeaders());
      return res.data;
    },
    [accessToken]
  );

  const contextValue = useMemo(
    () => ({
      internships,
      currentPage,
      totalPages,
      totalItems,
      loading,
      error,
      isGuest,
      isAdmin, // ✅ expose this
      fetchInternships,
      getInternshipById,
      createInternship,
      updateInternship,
      toggleInternshipStatus, // ✅ NEW
      deleteInternship,
      toggleSaveInternship, // ✅ NEW
      applyToInternship, // ✅ NEW
    }),
    [
      internships,
      currentPage,
      totalPages,
      totalItems,
      loading,
      error,
      isGuest,
      isAdmin,
      fetchInternships,
      getInternshipById,
      createInternship,
      updateInternship,
      toggleInternshipStatus,
      deleteInternship,
      toggleSaveInternship,
      applyToInternship,
    ]
  );

  return (
    <InternshipContext.Provider value={contextValue}>
      {children}
    </InternshipContext.Provider>
  );
};

export const useInternships = () => useContext(InternshipContext);