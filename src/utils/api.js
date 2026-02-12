import axios from "axios";

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const api = axios.create({
  baseURL: API_BASE_URL, // Use the constant
  withCredentials: true,
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

   
    if (originalRequest.url.includes("/auth/login")) {
        return Promise.reject(error);
    }

    if (
      error.response?.status === 401 && 
      !originalRequest._retry && 
      !originalRequest.url.includes("/auth/refresh")
    ) {
      originalRequest._retry = true;
      
      try {
        // Try to get a new token
        const res = await api.post("/auth/refresh", {}, { withCredentials: true });
        const newToken = res.data.accessToken;

        if (newToken) {
          api.defaults.headers.common["Authorization"] = `Bearer ${newToken}`;
          originalRequest.headers["Authorization"] = `Bearer ${newToken}`;
          return api(originalRequest); // Retry the original failed request
        }
      } catch (error_) {
        // If refresh fails, just throw. 
        // AuthContext will catch this and set user = null
        console.error("Session expired:", error_);
        throw error_;
      }
    }

    throw error;
  }
);

export default api;