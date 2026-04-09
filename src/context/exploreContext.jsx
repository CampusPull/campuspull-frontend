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

  // FIX: single isGuest flag used throughout
  const isGuest = !user;

  const [suggestions, setSuggestions] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [activeRole, setActiveRole] = useState("all");

  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);

  const [incomingRequests, setIncomingRequests] = useState([]);
  const [outgoingRequestIds, setOutgoingRequestIds] = useState(new Set());
  const [acceptedConnectionIds, setAcceptedConnectionIds] = useState(new Set());
  const [connections, setConnections] = useState([]);

  // Modal state for guest restricted actions
  const [showAuthModal, setShowAuthModal] = useState(false);

  // ---------- Fetch Suggestions ----------
  const fetchSuggestions = useCallback(
    async (pageNum = 1, isLoadMore = false) => {
      if (isLoadMore) setLoadingMore(true);
      else setLoading(true);

      setError("");

      try {
        // FIX: guests call /explore/users (public, no auth), logged-in call /connection/suggestions
        const roleQuery = activeRole !== 'all' ? `&role=${activeRole}` : '';
        if (isGuest) {
          const { data } = await api.get(
            `/explore/users?page=${pageNum}&limit=20${roleQuery}`
          );
          const newUsers = data.data || data.users || [];
          setSuggestions((prev) =>
            isLoadMore ? [...prev, ...newUsers] : newUsers
          );
          const more = data.pagination ? data.pagination.page < data.pagination.pages : (data.hasMore ?? false);
          setHasMore(more);
          setPage(pageNum);
        } else {
          const { data } = await api.get(
            `/connection/suggestions?page=${pageNum}&limit=20&role=${activeRole}`,
            { headers: { Authorization: `Bearer ${accessToken}` } }
          );
          const newUsers = data.users || [];
          setSuggestions((prev) =>
            isLoadMore ? [...prev, ...newUsers] : newUsers
          );
          setHasMore(data.hasMore);
          setPage(pageNum);
        }
      } catch (err) {
        console.error("Fetch Suggestions Error:", err);
        setError("Failed to fetch suggestions");
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    },
    [accessToken, activeRole, isGuest]
  );

  const loadMoreSuggestions = useCallback(() => {
    if (!loadingMore && hasMore) {
      fetchSuggestions(page + 1, true);
    }
  }, [fetchSuggestions, page, loadingMore, hasMore]);

  // ---------- Fetch Requests (only logged-in users) ----------
  const fetchRequests = useCallback(async () => {
    // FIX: guard — never call for guests
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

  // ---------- Fetch Connections (only logged-in users) ----------
  const fetchConnections = useCallback(async () => {
    // FIX: guard — never call for guests
    if (!accessToken || !user?._id) return;

    try {
      const { data: connectedUsers } = await api.get(
        "/connection/connections",
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );

      const valid = connectedUsers.filter(Boolean);
      setConnections(valid);
      setAcceptedConnectionIds(new Set(valid.map((u) => u._id)));
    } catch (err) {
      console.error("Failed to fetch connections", err);
      setConnections([]);
      setAcceptedConnectionIds(new Set());
    }
  }, [accessToken, user?._id]);

  // ---------- Send Request ----------
  const sendRequest = useCallback(
    async (recipientId) => {
      // FIX: show modal instead of hard redirecting to /auth
      if (isGuest) {
        setShowAuthModal(true);
        return;
      }

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
    [accessToken, isGuest]
  );

  // ---------- Search ----------
  const performSearch = useCallback(
    async (query) => {
      if (!query.trim()) {
        fetchSuggestions(1, false);
        return;
      }

      setLoading(true);

      try {
        // FIX: guests use /explore/users (public), logged-in use protected search
        const roleQuery = activeRole !== 'all' ? `&role=${activeRole}` : '';
        const endpoint = isGuest
          ? `/explore/users?search=${encodeURIComponent(query)}${roleQuery}`
          : `/connection/search?search=${encodeURIComponent(query)}&role=${activeRole}`;

        const { data } = await api.get(endpoint);

        setSuggestions(isGuest ? (data.data || []) : data);
        setHasMore(false);
      } catch {
        setError("Failed to perform search");
        setSuggestions([]);
      } finally {
        setLoading(false);
      }
    },
    [accessToken, activeRole, fetchSuggestions, isGuest]
  );

  const debouncedSearch = useMemo(
    () => debounce(performSearch, 300),
    [performSearch]
  );

  useEffect(() => {
    debouncedSearch(search);
    return () => debouncedSearch.cancel();
  }, [search, debouncedSearch]);

  // ---------- Initial Load ----------
  useEffect(() => {
    if (!authLoading) {
      fetchSuggestions(1, false);

      // FIX: only fetch protected data for logged-in users
      if (!isGuest) {
        fetchRequests();
        fetchConnections();
      }
    }
  }, [authLoading, accessToken, activeRole, isGuest, fetchSuggestions, fetchRequests, fetchConnections]);

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
      loadMoreSuggestions,
      activeRole,
      setActiveRole,
      isGuest,
      showAuthModal,
      setShowAuthModal,
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
      loadMoreSuggestions,
      activeRole,
      isGuest,
      showAuthModal,
    ]
  );

  return (
    <ExploreContext.Provider value={contextValue}>
      {children}
    </ExploreContext.Provider>
  );
};

export const useExplore = () => useContext(ExploreContext);