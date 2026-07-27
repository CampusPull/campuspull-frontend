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

  // FIX: single isGuest flag
  const isGuest = !user;

  const [resources, setResources] = useState([]);
  const [roadmaps, setRoadmaps] = useState([]);
  const [pyqs, setPyqs] = useState([]);
  const [bookmarkedResources, setBookmarkedResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // FIX: modal state for guest restricted actions
  const [showAuthModal, setShowAuthModal] = useState(false);

  const getAuthHeaders = () => ({
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  const canEditResource = (resource, type) => {
    if (!user) return false;
    if (user.role === "admin") return true;
    if (type === "notes") return resource.uploadedBy?._id === user._id;
    return false;
  };

  const toggleLessonProgress = async (lessonId) => {
    if (isGuest) { setShowAuthModal(true); return; }
    if (!lessonId) return;
    try {
      const res = await api.patch("/profile/progress/toggle", { lessonId }, getAuthHeaders());
      partialUpdateUser({ completedLessons: res.data });
    } catch (err) {
      console.error("Lesson progress toggle error:", err);
      throw err;
    }
  };

  // ===== Fetch functions =====
  // FIX: guests call /public/resources, logged-in call protected endpoints
  const fetchResources = useCallback(async (params = {}) => {
    try {
      setError(null);
      if (isGuest) {
        const res = await api.get("/public/resources", { params });

        // Handle both possible backend shapes: Structured Object OR Flat Array
        if (res.data.notes || res.data.data?.notes) {
          const payload = res.data.data?.notes ? res.data.data : res.data;
          setResources(payload.notes || []);
          setRoadmaps(payload.roadmaps || []);
          setPyqs(payload.pyqs || []);
        } else {
          // Flat array fallback (paginated discriminator models)
          const allResources = Array.isArray(res.data.data) ? res.data.data : (Array.isArray(res.data) ? res.data : []);

          const roadmapsArray = allResources.filter(r => r.modules !== undefined || r.type === 'roadmap' || r.resourceType === 'roadmap');
          const pyqsArray = allResources.filter(r => r.company !== undefined || r.type === 'pyq' || r.resourceType === 'pyq');
          const notesArray = allResources.filter(r =>
            r.modules === undefined && r.company === undefined &&
            r.type !== 'roadmap' && r.type !== 'pyq' &&
            r.resourceType !== 'roadmap' && r.resourceType !== 'pyq'
          );

          setResources(notesArray);
          setRoadmaps(roadmapsArray);
          setPyqs(pyqsArray);
        }
      } else {
        const res = await api.get("/resources/notes", { ...getAuthHeaders(), params });
        setResources(res.data);
      }
    } catch (err) {
      setError(err.response?.data?.error || err.message);
    }
  }, [accessToken, isGuest]);

  const fetchRoadmaps = useCallback(async (params = {}) => {
    // FIX: skip for guests — /public/resources covers the public list
    if (isGuest) return;
    try {
      setError(null);
      const res = await api.get("/resources/roadmaps", { ...getAuthHeaders(), params });
      setRoadmaps(res.data);
    } catch (err) {
      setError(err.response?.data?.error || err.message);
    }
  }, [accessToken, isGuest]);

  const fetchPYQs = useCallback(async (params = {}) => {
    // FIX: skip for guests
    if (isGuest) return;
    try {
      setError(null);
      const res = await api.get("/resources/pyqs", { ...getAuthHeaders(), params });
      setPyqs(res.data);
    } catch (err) {
      setError(err.response?.data?.error || err.message);
    }
  }, [accessToken, isGuest]);

  const fetchBookmarkedResources = useCallback(async () => {
    // FIX: guests have no bookmarks
    if (isGuest) return;
    try {
      setError(null);
      const res = await api.get("/resources/bookmarks", getAuthHeaders());
      setBookmarkedResources(res.data);
    } catch (err) {
      setError(err.response?.data?.error || err.message);
    }
  }, [accessToken, isGuest]);

  // ===== Upload — protected =====
  const uploadNotes = async (formData) => {
    if (isGuest) { setShowAuthModal(true); return; }
    try {
      setError(null);
      const res = await api.post("/resources/notes/upload", formData, {
        ...getAuthHeaders(),
        headers: { ...getAuthHeaders().headers, "Content-Type": "multipart/form-data" },
      });
      setResources((prev) => [res.data, ...prev]);
      return res.data;
    } catch (err) {
      setError(err.response?.data?.error || err.message);
      throw err;
    }
  };

  const uploadRoadmap = async (formData) => {
    if (isGuest) { setShowAuthModal(true); return; }
    try {
      setError(null);
      const res = await api.post("/resources/roadmaps/upload", formData, {
        ...getAuthHeaders(),
        headers: { ...getAuthHeaders().headers, "Content-Type": "multipart/form-data" },
      });
      setRoadmaps((prev) => [res.data, ...prev]);
      return res.data;
    } catch (err) {
      setError(err.response?.data?.error || err.message);
      throw err;
    }
  };

  const uploadPYQ = async (formData) => {
    if (isGuest) { setShowAuthModal(true); return; }
    try {
      setError(null);
      const res = await api.post("/resources/pyqs/upload", formData, {
        ...getAuthHeaders(),
        headers: { ...getAuthHeaders().headers, "Content-Type": "multipart/form-data" },
      });
      setPyqs((prev) => [res.data, ...prev]);
      return res.data;
    } catch (err) {
      setError(err.response?.data?.error || err.message);
      throw err;
    }
  };

  // ===== UPDATE — protected =====
  const updateRoadmap = async (id, formData) => {
    if (isGuest) { setShowAuthModal(true); return; }
    try {
      setError(null);
      const res = await api.put(`/resources/roadmaps/${id}`, formData, {
        ...getAuthHeaders(),
        headers: { ...getAuthHeaders().headers, "Content-Type": "multipart/form-data" },
      });
      setRoadmaps((prev) => prev.map((r) => (r._id === id ? res.data : r)));
      return res.data;
    } catch (err) {
      setError(err.response?.data?.error || err.message);
      throw err;
    }
  };

  const updateNote = async (id, formData) => {
    if (isGuest) { setShowAuthModal(true); return; }
    try {
      setError(null);
      const res = await api.put(`/resources/notes/${id}`, formData, {
        ...getAuthHeaders(),
        headers: { ...getAuthHeaders().headers, "Content-Type": "multipart/form-data" },
      });
      setResources((prev) => prev.map((r) => (r._id === id ? res.data : r)));
      return res.data;
    } catch (err) {
      setError(err.response?.data?.error || err.message);
      throw err;
    }
  };

  const updatePYQ = async (id, formData) => {
    if (isGuest) { setShowAuthModal(true); return; }
    try {
      setError(null);
      const res = await api.put(`/resources/pyqs/${id}`, formData, {
        ...getAuthHeaders(),
        headers: { ...getAuthHeaders().headers, "Content-Type": "multipart/form-data" },
      });
      setPyqs((prev) => prev.map((r) => (r._id === id ? res.data : r)));
      return res.data;
    } catch (err) {
      setError(err.response?.data?.error || err.message);
      throw err;
    }
  };

  // ===== DELETE — protected =====
  const deleteResource = async (id, type) => {
    if (isGuest) { setShowAuthModal(true); return; }
    try {
      setError(null);
      await api.delete(`/resources/${type}/${id}`, getAuthHeaders());
      if (type === "notes") setResources((prev) => prev.filter((r) => r._id !== id));
      if (type === "roadmaps") setRoadmaps((prev) => prev.filter((r) => r._id !== id));
      if (type === "pyqs") setPyqs((prev) => prev.filter((r) => r._id !== id));
      setBookmarkedResources((prev) => prev.filter((r) => r._id !== id));
    } catch (err) {
      setError(err.response?.data?.error || err.message);
      throw err;
    }
  };

  // Helper to normalize resource types to backend-expected strings: notes, roadmap, pyq
  const getEndpointType = (type) => {
    if (!type) return "notes";
    const t = type.toLowerCase();
    if (t.includes("note")) return "notes";
    if (t.includes("roadmap")) return "roadmap";
    if (t.includes("pyq") || t.includes("interview")) return "pyq";
    return t;
  };

  // Helper to map resource types to frontend state keys: notes, roadmaps, pyqs
  const getStateKeyType = (type) => {
    if (!type) return "notes";
    const t = type.toLowerCase();
    if (t.includes("note")) return "notes";
    if (t.includes("roadmap")) return "roadmaps";
    if (t.includes("pyq") || t.includes("interview")) return "pyqs";
    return t;
  };

  const updateState = (type, updatedItem) => {
    const merge = (prev) =>
      prev.map((r) => (r._id === updatedItem._id ? { ...r, ...updatedItem } : r));
    const stateKey = getStateKeyType(type);
    if (stateKey === "notes") setResources(merge);
    if (stateKey === "pyqs") setPyqs(merge);
    if (stateKey === "roadmaps") setRoadmaps(merge);
    setBookmarkedResources(merge);
  };

  // ===== Interactions =====
  const incrementView = async (id, type) => {
    try {
      const endpointType = getEndpointType(type);
      const res = await api.patch(`/resources/${endpointType}/${id}/view`);
      updateState(type, res.data);
    } catch (err) {
      console.error("View increment error:", err);
    }
  };

  const incrementDownload = async (id, type) => {
    // FIX: guest download triggers modal (spec: "Download triggers modal")
    if (isGuest) { setShowAuthModal(true); return; }
    try {
      const endpointType = getEndpointType(type);
      const res = await api.patch(`/resources/${endpointType}/${id}/download`);
      updateState(type, res.data);
    } catch (err) {
      console.error("Download increment error:", err);
    }
  };

  const toggleBookmark = async (id, type) => {
    // FIX: guest bookmark triggers modal
    if (isGuest) { setShowAuthModal(true); return; }
    try {
      const endpointType = getEndpointType(type);
      const res = await api.patch(`/resources/${endpointType}/${id}/bookmark`, {}, getAuthHeaders());
      updateState(type, res.data);
    } catch (err) {
      console.error("Bookmark toggle error:", err);
    }
  };

  // ===== Initial load =====
  // FIX: load for both guests and logged-in users
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      if (isGuest) {
        await fetchResources(); // only public resources for guests
      } else {
        await Promise.all([
          fetchResources(),
          fetchRoadmaps(),
          fetchPYQs(),
          fetchBookmarkedResources(),
        ]);
      }
      setLoading(false);
    };
    loadData();
  }, [accessToken, isGuest]);

  const value = useMemo(
    () => ({
      resources,
      roadmaps,
      pyqs,
      bookmarkedResources,
      loading,
      error,
      user,
      isGuest,           // FIX: expose for UI
      showAuthModal,     // FIX: expose for modal
      setShowAuthModal,  // FIX: expose for modal close

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
    [resources, roadmaps, pyqs, bookmarkedResources, loading, error, user, isGuest, showAuthModal]
  );

  return (
    <ResourceContext.Provider value={value}>
      {children}
    </ResourceContext.Provider>
  );
};