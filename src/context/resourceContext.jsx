import React, {
  createContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
  useContext,
} from "react";
import api from "../utils/api";
import { AuthContext } from "./AuthContext";

export const ResourceContext = createContext();

export const ResourceProvider = ({ children }) => {
  const { accessToken, user, partialUpdateUser } = useContext(AuthContext);

  const [resources, setResources] = useState([]);
  const [roadmaps, setRoadmaps] = useState([]);
  const [pyqs, setPyqs] = useState([]);
  const [bookmarkedResources, setBookmarkedResources] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ===== Helper: Attach token =====
  const getAuthHeaders = () => ({
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  // ===== Permission helper (UI ONLY) =====
  const canEditResource = (resource, type) => {
    if (!user) return false;
    if (user.role === "admin") return true;

    if (type === "notes") {
      return resource.uploadedBy?._id === user._id;
    }

    return false;
  };

  // ===== Lesson progress =====
  const toggleLessonProgress = async (lessonId) => {
    if (!lessonId) return;
    try {
      const res = await api.patch(
        "/profile/progress/toggle",
        { lessonId },
        getAuthHeaders()
      );
      partialUpdateUser({ completedLessons: res.data });
    } catch (err) {
      console.error("Lesson progress toggle error:", err);
      throw err;
    }
  };

  // ===== Fetch functions =====
  const fetchResources = useCallback(async () => {
    try {
      setError(null);
      const res = await api.get("/resources/notes", getAuthHeaders());
      setResources(res.data);
    } catch (err) {
      setError(err.response?.data?.error || err.message);
    }
  }, [accessToken]);

  const fetchRoadmaps = useCallback(async () => {
    try {
      setError(null);
      const res = await api.get("/resources/roadmaps", getAuthHeaders());
      setRoadmaps(res.data);
    } catch (err) {
      setError(err.response?.data?.error || err.message);
    }
  }, [accessToken]);

  const fetchPYQs = useCallback(async () => {
    try {
      setError(null);
      const res = await api.get("/resources/pyqs", getAuthHeaders());
      setPyqs(res.data);
    } catch (err) {
      setError(err.response?.data?.error || err.message);
    }
  }, [accessToken]);

  const fetchBookmarkedResources = useCallback(async () => {
    try {
      setError(null);
      const res = await api.get("/resources/bookmarks", getAuthHeaders());
      setBookmarkedResources(res.data);
    } catch (err) {
      setError(err.response?.data?.error || err.message);
    }
  }, [accessToken]);

  // ===== Upload =====
  const uploadNotes = async (formData) => {
    try {
      setError(null);
      const res = await api.post("/resources/notes/upload", formData, {
        ...getAuthHeaders(),
        headers: {
          ...getAuthHeaders().headers,
          "Content-Type": "multipart/form-data",
        },
      });
      setResources((prev) => [res.data, ...prev]);
      return res.data;
    } catch (err) {
      setError(err.response?.data?.error || err.message);
      throw err;
    }
  };

  const uploadRoadmap = async (formData) => {
    try {
      setError(null);
      const res = await api.post("/resources/roadmaps/upload", formData, {
        ...getAuthHeaders(),
        headers: {
          ...getAuthHeaders().headers,
          "Content-Type": "multipart/form-data",
        },
      });
      setRoadmaps((prev) => [res.data, ...prev]);
      return res.data;
    } catch (err) {
      setError(err.response?.data?.error || err.message);
      throw err;
    }
  };

  const uploadPYQ = async (formData) => {
    try {
      setError(null);
      const res = await api.post("/resources/pyqs/upload", formData, {
        ...getAuthHeaders(),
        headers: {
          ...getAuthHeaders().headers,
          "Content-Type": "multipart/form-data",
        },
      });
      setPyqs((prev) => [res.data, ...prev]);
      return res.data;
    } catch (err) {
      setError(err.response?.data?.error || err.message);
      throw err;
    }
  };

  // ===== UPDATE =====
  const updateRoadmap = async (id, formData) => {
    try {
      setError(null);
      const res = await api.put(`/resources/roadmaps/${id}`, formData, {
        ...getAuthHeaders(),
        headers: {
          ...getAuthHeaders().headers,
          "Content-Type": "multipart/form-data",
        },
      });
      setRoadmaps((prev) => prev.map((r) => (r._id === id ? res.data : r)));
      return res.data;
    } catch (err) {
      setError(err.response?.data?.error || err.message);
      throw err;
    }
  };

  const updateNote = async (id, formData) => {
    try {
      setError(null);
      const res = await api.put(`/resources/notes/${id}`, formData, {
        ...getAuthHeaders(),
        headers: {
          ...getAuthHeaders().headers,
          "Content-Type": "multipart/form-data",
        },
      });
      setResources((prev) => prev.map((r) => (r._id === id ? res.data : r)));
      return res.data;
    } catch (err) {
      setError(err.response?.data?.error || err.message);
      throw err;
    }
  };

  const updatePYQ = async (id, formData) => {
    try {
      setError(null);
      const res = await api.put(`/resources/pyqs/${id}`, formData, {
        ...getAuthHeaders(),
        headers: {
          ...getAuthHeaders().headers,
          "Content-Type": "multipart/form-data",
        },
      });
      setPyqs((prev) => prev.map((r) => (r._id === id ? res.data : r)));
      return res.data;
    } catch (err) {
      setError(err.response?.data?.error || err.message);
      throw err;
    }
  };

  // ===== DELETE =====
  const deleteResource = async (id, type) => {
  try {
    setError(null);
    // Note: ensure your backend routes match these plural strings: 'notes', 'roadmaps', 'pyqs'
    await api.delete(`/resources/${type}/${id}`, getAuthHeaders());

    // UI State Update: Remove the item so it disappears immediately
    if (type === "notes")
      setResources((prev) => prev.filter((r) => r._id !== id));
    if (type === "roadmaps")
      setRoadmaps((prev) => prev.filter((r) => r._id !== id));
    if (type === "pyqs")
      setPyqs((prev) => prev.filter((r) => r._id !== id));
    
    // Always check bookmarks too
    setBookmarkedResources((prev) => prev.filter((r) => r._id !== id));
    
  } catch (err) {
    setError(err.response?.data?.error || err.message);
    throw err; // Re-throw so the Modal can catch the error
  }
};

  // ===== State merge helper =====
  const updateState = (type, updatedItem) => {
    const merge = (prev) =>
      prev.map((r) =>
        r._id === updatedItem._id ? { ...r, ...updatedItem } : r
      );

    if (type === "notes") setResources(merge);
    if (type === "pyqs") setPyqs(merge);
    if (type === "roadmaps") setRoadmaps(merge);
    setBookmarkedResources(merge);
  };

  // ===== Interactions =====
  const incrementView = async (id, type) => {
    try {
      const res = await api.patch(`/resources/${type}/${id}/view`);
      updateState(type, res.data);
    } catch (err) {
      console.error("View increment error:", err);
    }
  };

  const incrementDownload = async (id, type) => {
    try {
      const res = await api.patch(`/resources/${type}/${id}/download`);
      updateState(type, res.data);
    } catch (err) {
      console.error("Download increment error:", err);
    }
  };

  const toggleBookmark = async (id, type) => {
    try {
      const res = await api.patch(
        `/resources/${type}/${id}/bookmark`,
        {},
        getAuthHeaders()
      );
      updateState(type, res.data);
    } catch (err) {
      console.error("Bookmark toggle error:", err);
    }
  };

  // ===== Initial load =====
  useEffect(() => {
    if (!accessToken) return;
    const loadData = async () => {
      setLoading(true);
      await Promise.all([
        fetchResources(),
        fetchRoadmaps(),
        fetchPYQs(),
        fetchBookmarkedResources(),
      ]);
      setLoading(false);
    };
    loadData();
  }, [accessToken]);

  // ===== Context value =====
  const value = useMemo(
    () => ({
      resources,
      roadmaps,
      pyqs,
      bookmarkedResources,
      loading,
      error,
      user,

      refreshResources: fetchResources,
      refreshRoadmaps: fetchRoadmaps,
      refreshPYQs: fetchPYQs,
      refreshBookmarks: fetchBookmarkedResources,

      uploadNotes,
      uploadRoadmap,
      uploadPYQ,

      updateRoadmap,
      updateNote,
      updatePYQ,
      deleteResource,

      deleteNote: async (id) => deleteResource(id, "notes"),
      deleteRoadmap: async (id) => deleteResource(id, "roadmaps"),
      deletePYQ: async (id) => deleteResource(id, "pyqs"),

      incrementView,
      incrementDownload,
      toggleBookmark,
      toggleLessonProgress,

      canEditResource,
    }),
    [
      resources,
      roadmaps,
      pyqs,
      bookmarkedResources,
      loading,
      error,
      user,
    ]
  );

  return (
    <ResourceContext.Provider value={value}>
      {children}
    </ResourceContext.Provider>
  );
};
