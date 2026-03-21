
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

      navigate("/", { replace: true });
    } catch (err) {
      throw err;
    }
  };

  // --- SIGNUP ---
  const signup = async (data) => {
    try {
      await api.post("/auth/signup", data);
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
      const res = await api.post("/auth/refresh", {});
      const { accessToken: newToken } = res.data;

      setAccessToken(newToken);
      setAuthHeader(newToken);

      const userRes = await api.get("/auth/me", {
        headers: { Authorization: `Bearer ${newToken}` },
      });

      setUser(userRes.data.user);
      return true;
    } catch (err) {
      // Guest mode expected → ignore 401
      if (err.response?.status !== 401) {
        console.error("Silent refresh failed:", err);
      }

      setAuthHeader(null);
      setUser(null);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial load
  useEffect(() => {
    refreshAuth();
  }, [refreshAuth]);

  // Auto refresh every 14 minutes
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

  // Important: wait until auth check finishes
  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

