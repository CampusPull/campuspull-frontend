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
  const { accessToken } = useContext(AuthContext);

  const [internships, setInternships] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const getAuthHeaders = () => ({
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  // 🔹 Fetch Internships (Public)
  const fetchInternships = useCallback(
  async (page = 1, filters = {}) => {
    setLoading(true);
    setError(null);

    try {
      // 1. CLEAN THE FILTERS
      // We only want to send fields that actually have a value
      const cleanFilters = Object.fromEntries(
        Object.entries(filters).filter(([_, value]) => {
          return value !== "" && value !== null && value !== undefined;
        })
      );

      // 2. CONSTRUCT QUERY
      const query = new URLSearchParams({
        page,
        ...cleanFilters,
      }).toString();

      // 3. FETCH DATA
      const res = await api.get(`/internships?${query}`);

      setInternships(res.data.data);
      setCurrentPage(res.data.currentPage);
      setTotalPages(res.data.totalPages);
      setTotalItems(res.data.totalItems);

      return res.data;
    } catch (err) {
      console.error("Fetch Internships Error:", err);
      setError(
        err.response?.data?.message || "Failed to fetch internships"
      );
    } finally {
      setLoading(false);
    }
  },
  []
);

  // 🔹 Get Internship By ID
  const getInternshipById = useCallback(async (id) => {
    try {
      const res = await api.get(`/internships/${id}`);
      return res.data.data;
    } catch (err) {
      console.error("Get Internship Error:", err);
      throw err;
    }
  }, []);

  // 🔹 Create Internship (Admin)
  const createInternship = useCallback(
    async (data) => {
      if (!accessToken) throw new Error("Not authenticated");

      try {
        await api.post("/internships", data, getAuthHeaders());

        // Refresh first page to maintain correct pagination order
        await fetchInternships(1);
      } catch (err) {
        console.error("Create Internship Error:", err);
        throw err;
      }
    },
    [accessToken, fetchInternships]
  );

  // 🔹 Update Internship (Admin)
  const updateInternship = useCallback(
    async (id, data) => {
      if (!accessToken) throw new Error("Not authenticated");

      try {
        const res = await api.put(
          `/internships/${id}`,
          data,
          getAuthHeaders()
        );

        setInternships((prev) =>
          prev.map((item) =>
            item._id === id ? res.data.data : item
          )
        );

        return res.data.data;
      } catch (err) {
        console.error("Update Internship Error:", err);
        throw err;
      }
    },
    [accessToken]
  );

  // 🔹 Delete Internship (Admin)
  const deleteInternship = useCallback(
    async (id) => {
      if (!accessToken) throw new Error("Not authenticated");

      try {
        await api.delete(
          `/internships/${id}`,
          getAuthHeaders()
        );

        // Refresh current page after deletion
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
      fetchInternships,
      getInternshipById,
      createInternship,
      updateInternship,
      deleteInternship,
    }),
    [
      internships,
      currentPage,
      totalPages,
      totalItems,
      loading,
      error,
      fetchInternships,
      getInternshipById,
      createInternship,
      updateInternship,
      deleteInternship,
    ]
  );

  return (
    <InternshipContext.Provider value={contextValue}>
      {children}
    </InternshipContext.Provider>
  );
};

export const useInternships = () => useContext(InternshipContext);
