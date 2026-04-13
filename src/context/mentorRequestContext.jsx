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

    // 🔴 Validation FIRST (before API)
    if (!mentorId) {
      return setError("Mentor not selected");
    }

    if (!goal || goal.trim().length === 0) {
      return setError("Please enter your goal");
    }

    if (goal.length > 100) {
      return setError("Goal cannot exceed 100 characters");
    }

    if (message && message.length > 500) {
      return setError("Message cannot exceed 500 characters");
    }

    // ✅ API call
    await api.post("/mentorship/request", {
      mentorId,
      goal: goal.trim(),
      message: message?.trim(),
    });

    setSuccess(true);
  } catch (err) {
    console.log("ERROR RESPONSE:", err.response);

    setError(
      err.response?.data?.message ||
      err.message ||
      "Failed to send request"
    );
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
