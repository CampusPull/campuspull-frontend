// import React, {
//   createContext,
//   useState,
//   useEffect,
//   useContext,
//   useMemo,
//   useCallback,
// } from "react";
// import { useAuth } from "./AuthContext";
// import api from "../utils/api";
// import { debounce } from "lodash";

// export const ExploreContext = createContext();

// export const ExploreProvider = ({ children }) => {
//   const { accessToken, user, loading: authLoading } = useAuth();
//   const [suggestions, setSuggestions] = useState([]);
//   const [originalSuggestions, setOriginalSuggestions] = useState([]);
//   const [search, setSearch] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");
//   const [activeRole, setActiveRole] = useState("all");

//   // --- Pagination State ---
//   const [page, setPage] = useState(1);
//   const [hasMore, setHasMore] = useState(false);
//   const [loadingMore, setLoadingMore] = useState(false);

//   const [incomingRequests, setIncomingRequests] = useState([]);
//   const [outgoingRequestIds, setOutgoingRequestIds] = useState(new Set());
//   const [acceptedConnectionIds, setAcceptedConnectionIds] = useState(new Set());
//   const [connections, setConnections] = useState([]);

//   const getImageUrl = useCallback((path) => {
//     if (!path) return null;
//     if (path.startsWith("http")) return path;
//     let baseUrl = api.defaults.baseURL || "";
//     baseUrl = baseUrl.replace(/\/api\/?$/, "");
//     const cleanPath = path.startsWith("/") ? path : `/${path}`;
//     return `${baseUrl}${cleanPath}`;
//   }, []);

//   // --- Fetch Suggestions ---
//   const fetchSuggestions = useCallback(
//     async (pageNum = 1, isLoadMore = false) => {
//       if (!accessToken) return;

//       if (isLoadMore) setLoadingMore(true);
//       else setLoading(true);

//       setError("");
//       try {
//         const { data } = await api.get(
//           `/connection/suggestions?page=${pageNum}&limit=20&role=${activeRole}`, // Add &role here
//           { headers: { Authorization: `Bearer ${accessToken}` } }
//         );

//         // data should now be { users: [], hasMore: boolean } based on our backend change
//         const newUsers = data.users || [];

//         setSuggestions((prev) =>
//           isLoadMore ? [...prev, ...newUsers] : newUsers
//         );
//         setOriginalSuggestions((prev) =>
//           isLoadMore ? [...prev, ...newUsers] : newUsers
//         );
//         setHasMore(data.hasMore);
//         setPage(pageNum);
//       } catch (err) {
//         console.error("Fetch Suggestions Error:", err);
//         setError("Failed to fetch suggestions");
//       } finally {
//         setLoading(false);
//         setLoadingMore(false);
//       }
//     },
//     [accessToken, activeRole]
//   );

//   const loadMoreSuggestions = useCallback(() => {
//     if (!loadingMore && hasMore) {
//       fetchSuggestions(page + 1, true);
//     }
//   }, [fetchSuggestions, page, loadingMore, hasMore]);

//   // --- Fetch Pending Requests ---
//   const fetchRequests = useCallback(async () => {
//     if (!accessToken || !user?._id) return;
//     try {
//       const { data } = await api.get("/connection/requests/pending", {
//         headers: { Authorization: `Bearer ${accessToken}` },
//       });

//       const incoming = data.filter((req) => req.recipient._id === user._id);
//       const outgoingIds = new Set(
//         data
//           .filter((req) => req.requester._id === user._id)
//           .map((req) => req.recipient._id)
//       );

//       setIncomingRequests(incoming);
//       setOutgoingRequestIds(outgoingIds);
//     } catch (err) {
//       console.error("Failed to fetch requests", err);
//     }
//   }, [accessToken, user?._id]);

//   // --- Fetch Accepted Connections ---
//   const fetchConnections = useCallback(async () => {
//     if (!accessToken || !user?._id) return;
//     try {
//       const { data: connectedUsers } = await api.get(
//         "/connection/connections",
//         {
//           headers: { Authorization: `Bearer ${accessToken}` },
//         }
//       );
//       const validConnections = connectedUsers.filter(
//         (u) => u !== null && u !== undefined
//       );
//       setConnections(validConnections);
//       const ids = new Set(validConnections.map((u) => u._id));
//       setAcceptedConnectionIds(ids);
//     } catch (err) {
//       console.error("Failed to fetch connections", err);
//       setConnections([]);
//       setAcceptedConnectionIds(new Set());
//     }
//   }, [accessToken, user?._id]);

//   // --- Request Actions (send, accept, ignore) ---
//   const sendRequest = useCallback(
//     async (recipientId) => {
//       if (!accessToken) return;
//       try {
//         await api.post(
//           "/connection/request",
//           { recipientId },
//           { headers: { Authorization: `Bearer ${accessToken}` } }
//         );
//         setOutgoingRequestIds((prev) => new Set(prev).add(recipientId));
//       } catch (err) {
//         alert(err.response?.data?.message || "Failed to send request");
//       }
//     },
//     [accessToken]
//   );

//   const acceptRequest = useCallback(
//     async (requestId) => {
//       if (!accessToken) return;
//       try {
//         await api.post(
//           "/connection/respond",
//           { requestId, action: "accept" },
//           { headers: { Authorization: `Bearer ${accessToken}` } }
//         );
//         fetchRequests();
//         fetchConnections();
//       } catch (err) {
//         alert(err.response?.data?.message || "Failed to accept request");
//       }
//     },
//     [accessToken, fetchRequests, fetchConnections]
//   );

//   const ignoreRequest = useCallback(
//     async (requestId) => {
//       if (!accessToken) return;
//       try {
//         await api.post(
//           "/connection/respond",
//           { requestId, action: "reject" },
//           { headers: { Authorization: `Bearer ${accessToken}` } }
//         );
//         fetchRequests();
//       } catch (err) {
//         alert(err.response?.data?.message || "Failed to ignore request");
//       }
//     },
//     [accessToken, fetchRequests]
//   );

//   // --- API Search Function ---
//   const performSearch = useCallback(
//     async (query) => {
//       if (!accessToken) return;
//       if (!query.trim()) {
//       // 1. Reset the suggestions to empty first to show a fresh state
//       setSuggestions([]); 
//       // 2. Explicitly re-fetch the suggestions based on the current activeRole
//       fetchSuggestions(1, false); 
//       return;
//     }
//       setLoading(true);
//       try {
//         const { data } = await api.get(
//           `/connection/search?q=${encodeURIComponent(
//             query
//           )}&role=${activeRole}`, // Add &role here
//           { headers: { Authorization: `Bearer ${accessToken}` } }
//         );
//         setSuggestions(data);
//         setHasMore(false); // Search usually returns all matches or has its own pagination
//       } catch (err) {
//         setError("Failed to perform search");
//         setSuggestions([]);
//       } finally {
//         setLoading(false);
//       }
//     },
//     [accessToken, fetchSuggestions, activeRole]
//   );

//   const debouncedSearch = useMemo(
//     () => debounce(performSearch, 300),
//     [performSearch]
//   );

//   useEffect(() => {
//     debouncedSearch(search);
//     return () => debouncedSearch.cancel();
//   }, [search, debouncedSearch]);

//   useEffect(() => {
//     if (!authLoading && accessToken) {
//       setSuggestions([]);
//       fetchSuggestions(1, false);
//       fetchRequests();
//       fetchConnections();
//     }
//   }, [
//     accessToken,
//     fetchSuggestions,
//     fetchRequests,
//     fetchConnections,
//     authLoading,
//     activeRole,
//   ]);

//   const contextValue = useMemo(
//     () => ({
//       suggestions,
//       search,
//       setSearch,
//       loading,
//       loadingMore, 
//       hasMore, 
//       error,
//       sendRequest,
//       incomingRequests,
//       outgoingRequestIds,
//       acceptedConnectionIds,
//       connections,
//       connectionCount: connections.length,
//       acceptRequest,
//       ignoreRequest,
//       getImageUrl,
//       loadMoreSuggestions,
//       activeRole,
//       setActiveRole,
//     }),
//     [
//       suggestions,
//       search,
//       loading,
//       loadingMore,
//       hasMore,
//       error,
//       sendRequest,
//       incomingRequests,
//       outgoingRequestIds,
//       acceptedConnectionIds,
//       connections,
//       acceptRequest,
//       ignoreRequest,
//       getImageUrl,
//       loadMoreSuggestions,
//       activeRole,
//       setActiveRole,
//     ]
//   );

//   return (
//     <ExploreContext.Provider value={contextValue}>
//       {children}
//     </ExploreContext.Provider>
//   );
// };

// export const useExplore = () => useContext(ExploreContext);







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
        // FIX: guests call /public/users, logged-in users call /connection/suggestions
        if (isGuest) {
          const { data } = await api.get(
            `/public/users?page=${pageNum}&limit=20`
          );
          const newUsers = data.data || data.users || [];
          setSuggestions((prev) =>
            isLoadMore ? [...prev, ...newUsers] : newUsers
          );
          setHasMore(data.hasMore ?? false);
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
        // FIX: guests use public endpoint, logged-in use protected
        const endpoint = isGuest
          ? `/public/users?q=${encodeURIComponent(query)}`
          : `/connection/search?q=${encodeURIComponent(query)}&role=${activeRole}`;

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