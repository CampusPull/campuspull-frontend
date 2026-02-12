import {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
  useCallback,
} from "react";
import api from "../utils/api";
import { useNavigate } from "react-router-dom";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [accessToken, setAccessToken] = useState("");
  const navigate = useNavigate();

  // Helper: Set Auth Header
  const setAuthHeader = (token) => {
    if (token) {
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    } else {
      delete api.defaults.headers.common["Authorization"];
    }
  };

  // --- LOGIN ---
  const login = async (credentials) => {
    try {
      const res = await api.post("/auth/login", credentials);
      const { user, accessToken: newToken } = res.data;

      setAccessToken(newToken);
      setAuthHeader(newToken);
      setUser(user);

      navigate("/homepage", { replace: true });
    } catch (err) {
      // If error is "Please verify email", it will be thrown here
      // and caught by your Auth.jsx component to show the Toast.
      throw err;
    }
  };

  // --- SIGNUP (UPDATED) ---
  const signup = async (data) => {
    try {
      // 🚀 CHANGED: Backend now sends an email, NOT a token.
      // We do NOT log the user in automatically anymore.
      await api.post("/auth/signup", data);

      // We do NOT setAccessToken or navigate to homepage.
      // We simply return, so Auth.jsx can show the "Check your email" toast.
    } catch (err) {
      throw err;
    }
  };

  // --- LOGOUT ---
  const logout = useCallback(async () => {
    try {
      await api.post("/auth/logout", {});
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      setAccessToken("");
      setAuthHeader(null);
      setUser(null);
      navigate("/auth", { replace: true });
    }
  }, [navigate]);

  // --- SILENT REFRESH LOGIC ---
  const refreshAuth = useCallback(async () => {
    try {
      // Check if we have a valid session cookie
      const res = await api.post("/auth/refresh", {});
      const { accessToken: newToken } = res.data;

      // 1. Update State
      setAccessToken(newToken);

      // 2. Update global defaults for future calls
      setAuthHeader(newToken);

      const userRes = await api.get("/auth/me", {
        headers: { Authorization: `Bearer ${newToken}` },
      });

      setUser(userRes.data.user);
      return true;
    } catch (err) {
      // Silent fail is expected if not logged in
      console.error("Silent refresh failed:", err);
      setAuthHeader(null);
      setUser(null);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  // 1. Initial Load
  useEffect(() => {
    refreshAuth();
  }, [refreshAuth]);

  // 2. Scheduled Refresh
  useEffect(() => {
    if (!accessToken) return;
    const interval = setInterval(() => {
      refreshAuth();
    }, 14 * 60 * 1000);
    return () => clearInterval(interval);
  }, [accessToken, refreshAuth]);

  const partialUpdateUser = (updates) => {
    setUser((prev) => (prev ? { ...prev, ...updates } : null));
  };

  const contextValue = useMemo(
    () => ({
      user,
      loading,
      accessToken,
      login,
      signup,
      logout,
      partialUpdateUser,
    }),
    [user, loading, accessToken, logout]
  );

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
