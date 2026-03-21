import { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./AuthContext";
import api from "../utils/api";

const MentorDiscoveryContext = createContext(null);

export const MentorDiscoveryProvider = ({ children }) => {
  const { user } = useAuth();

  // FIX: single isGuest flag
  const isGuest = !user;

  const [mentors, setMentors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // FIX: modal state for guest restricted actions
  const [showAuthModal, setShowAuthModal] = useState(false);

  const fetchMentors = async (params = {}) => {
    try {
      setLoading(true);
      // FIX: guests call /public/mentors, logged-in call /mentorship/mentors
      if (isGuest) {
        const res = await api.get("/public/mentors", { params });
        setMentors(res.data.data || res.data.mentors || res.data || []);
      } else {
        const res = await api.get("/mentorship/mentors", { params });
        setMentors(res.data.mentors || []);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load mentors");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMentors();
  }, [isGuest]); // FIX: re-fetch when auth state changes

  return (
    <MentorDiscoveryContext.Provider
      value={{
        mentors,
        loading,
        error,
        fetchMentors,
        isGuest,           // FIX: expose for UI
        showAuthModal,     // FIX: expose for modal
        setShowAuthModal,  // FIX: expose for modal close
      }}
    >
      {children}
    </MentorDiscoveryContext.Provider>
  );
};

export const useMentorDiscovery = () => {
  const ctx = useContext(MentorDiscoveryContext);
  if (!ctx) {
    throw new Error("useMentorDiscovery must be used inside MentorDiscoveryProvider");
  }
  return ctx;
};