import { createContext, useContext, useState } from "react";
import api from "../utils/api";

const MentorRequestContext = createContext(null);

export const MentorRequestProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const sendRequest = async ({ mentorId, goal, message }) => {
    try {
      setLoading(true);
      setError(null);
      setSuccess(false);

      await api.post("/mentorship/request", {
        mentorId,
        goal,
        message,
      });

      setSuccess(true);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to send request");
    } finally {
      setLoading(false);
    }
  };

  return (
    <MentorRequestContext.Provider
      value={{ sendRequest, loading, error, success }}
    >
      {children}
    </MentorRequestContext.Provider>
  );
};

export const useMentorRequest = () => {
  const ctx = useContext(MentorRequestContext);
  if (!ctx) {
    throw new Error("useMentorRequest must be used inside MentorRequestProvider");
  }
  return ctx;
};
