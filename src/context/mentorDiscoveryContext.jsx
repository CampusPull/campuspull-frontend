import { createContext, useContext, useEffect, useState } from "react";
import api from "../utils/api";

const MentorDiscoveryContext = createContext(null);

export const MentorDiscoveryProvider = ({ children }) => {
  const [mentors, setMentors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchMentors = async (params = {}) => {
    try {
      setLoading(true);
      const res = await api.get("/mentorship/mentors", {
        params,
      });
      setMentors(res.data.mentors);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load mentors");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMentors();
  }, []);

  return (
    <MentorDiscoveryContext.Provider
      value={{ mentors, loading, error, fetchMentors }}
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
