import React, {
  createContext,
  useState,
  useEffect,
  useContext,
  useMemo,
  useCallback,
} from "react";
import { useAuth } from "./AuthContext";
import api from "../utils/api";
import { debounce } from "lodash";

export const ExploreContext = createContext();

export const ExploreProvider = ({ children }) => {
  const { accessToken, user, loading: authLoading } = useAuth();
  const [suggestions, setSuggestions] = useState([]);
  const [originalSuggestions, setOriginalSuggestions] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [activeRole, setActiveRole] = useState("all");

  // --- Pagination State ---
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);

  const [incomingRequests, setIncomingRequests] = useState([]);
  const [outgoingRequestIds, setOutgoingRequestIds] = useState(new Set());
  const [acceptedConnectionIds, setAcceptedConnectionIds] = useState(new Set());
  const [connections, setConnections] = useState([]);

  const getImageUrl = useCallback((path) => {
    if (!path) return null;
    if (path.startsWith("http")) return path;
    let baseUrl = api.defaults.baseURL || "";
    baseUrl = baseUrl.replace(/\/api\/?$/, "");
    const cleanPath = path.startsWith("/") ? path : `/${path}`;
    return `${baseUrl}${cleanPath}`;
  }, []);

  // --- Fetch Suggestions ---
  const fetchSuggestions = useCallback(
    async (pageNum = 1, isLoadMore = false) => {
      if (!accessToken) return;

      if (isLoadMore) setLoadingMore(true);
      else setLoading(true);

      setError("");
      try {
        const { data } = await api.get(
          `/connection/suggestions?page=${pageNum}&limit=20&role=${activeRole}`, // Add &role here
          { headers: { Authorization: `Bearer ${accessToken}` } }
        );

        // data should now be { users: [], hasMore: boolean } based on our backend change
        const newUsers = data.users || [];

        setSuggestions((prev) =>
          isLoadMore ? [...prev, ...newUsers] : newUsers
        );
        setOriginalSuggestions((prev) =>
          isLoadMore ? [...prev, ...newUsers] : newUsers
        );
        setHasMore(data.hasMore);
        setPage(pageNum);
      } catch (err) {
        console.error("Fetch Suggestions Error:", err);
        setError("Failed to fetch suggestions");
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    },
    [accessToken, activeRole]
  );

  const loadMoreSuggestions = useCallback(() => {
    if (!loadingMore && hasMore) {
      fetchSuggestions(page + 1, true);
    }
  }, [fetchSuggestions, page, loadingMore, hasMore]);

  // --- Fetch Pending Requests ---
  const fetchRequests = useCallback(async () => {
    if (!accessToken || !user?._id) return;
    try {
      const { data } = await api.get("/connection/requests/pending", {
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      const incoming = data.filter((req) => req.recipient._id === user._id);
      const outgoingIds = new Set(
        data
          .filter((req) => req.requester._id === user._id)
          .map((req) => req.recipient._id)
      );

      setIncomingRequests(incoming);
      setOutgoingRequestIds(outgoingIds);
    } catch (err) {
      console.error("Failed to fetch requests", err);
    }
  }, [accessToken, user?._id]);

  // --- Fetch Accepted Connections ---
  const fetchConnections = useCallback(async () => {
    if (!accessToken || !user?._id) return;
    try {
      const { data: connectedUsers } = await api.get(
        "/connection/connections",
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );
      const validConnections = connectedUsers.filter(
        (u) => u !== null && u !== undefined
      );
      setConnections(validConnections);
      const ids = new Set(validConnections.map((u) => u._id));
      setAcceptedConnectionIds(ids);
    } catch (err) {
      console.error("Failed to fetch connections", err);
      setConnections([]);
      setAcceptedConnectionIds(new Set());
    }
  }, [accessToken, user?._id]);

  // --- Request Actions (send, accept, ignore) ---
  const sendRequest = useCallback(
    async (recipientId) => {
      if (!accessToken) return;
      try {
        await api.post(
          "/connection/request",
          { recipientId },
          { headers: { Authorization: `Bearer ${accessToken}` } }
        );
        setOutgoingRequestIds((prev) => new Set(prev).add(recipientId));
      } catch (err) {
        alert(err.response?.data?.message || "Failed to send request");
      }
    },
    [accessToken]
  );

  const acceptRequest = useCallback(
    async (requestId) => {
      if (!accessToken) return;
      try {
        await api.post(
          "/connection/respond",
          { requestId, action: "accept" },
          { headers: { Authorization: `Bearer ${accessToken}` } }
        );
        fetchRequests();
        fetchConnections();
      } catch (err) {
        alert(err.response?.data?.message || "Failed to accept request");
      }
    },
    [accessToken, fetchRequests, fetchConnections]
  );

  const ignoreRequest = useCallback(
    async (requestId) => {
      if (!accessToken) return;
      try {
        await api.post(
          "/connection/respond",
          { requestId, action: "reject" },
          { headers: { Authorization: `Bearer ${accessToken}` } }
        );
        fetchRequests();
      } catch (err) {
        alert(err.response?.data?.message || "Failed to ignore request");
      }
    },
    [accessToken, fetchRequests]
  );

  // --- API Search Function ---
  const performSearch = useCallback(
    async (query) => {
      if (!accessToken) return;
      if (!query.trim()) {
      // 1. Reset the suggestions to empty first to show a fresh state
      setSuggestions([]); 
      // 2. Explicitly re-fetch the suggestions based on the current activeRole
      fetchSuggestions(1, false); 
      return;
    }
      setLoading(true);
      try {
        const { data } = await api.get(
          `/connection/search?q=${encodeURIComponent(
            query
          )}&role=${activeRole}`, // Add &role here
          { headers: { Authorization: `Bearer ${accessToken}` } }
        );
        setSuggestions(data);
        setHasMore(false); // Search usually returns all matches or has its own pagination
      } catch (err) {
        setError("Failed to perform search");
        setSuggestions([]);
      } finally {
        setLoading(false);
      }
    },
    [accessToken, fetchSuggestions, activeRole]
  );

  const debouncedSearch = useMemo(
    () => debounce(performSearch, 300),
    [performSearch]
  );

  useEffect(() => {
    debouncedSearch(search);
    return () => debouncedSearch.cancel();
  }, [search, debouncedSearch]);

  useEffect(() => {
    if (!authLoading && accessToken) {
      setSuggestions([]);
      fetchSuggestions(1, false);
      fetchRequests();
      fetchConnections();
    }
  }, [
    accessToken,
    fetchSuggestions,
    fetchRequests,
    fetchConnections,
    authLoading,
    activeRole,
  ]);

  const contextValue = useMemo(
    () => ({
      suggestions,
      search,
      setSearch,
      loading,
      loadingMore, 
      hasMore, 
      error,
      sendRequest,
      incomingRequests,
      outgoingRequestIds,
      acceptedConnectionIds,
      connections,
      connectionCount: connections.length,
      acceptRequest,
      ignoreRequest,
      getImageUrl,
      loadMoreSuggestions,
      activeRole,
      setActiveRole,
    }),
    [
      suggestions,
      search,
      loading,
      loadingMore,
      hasMore,
      error,
      sendRequest,
      incomingRequests,
      outgoingRequestIds,
      acceptedConnectionIds,
      connections,
      acceptRequest,
      ignoreRequest,
      getImageUrl,
      loadMoreSuggestions,
      activeRole,
      setActiveRole,
    ]
  );

  return (
    <ExploreContext.Provider value={contextValue}>
      {children}
    </ExploreContext.Provider>
  );
};

export const useExplore = () => useContext(ExploreContext);
