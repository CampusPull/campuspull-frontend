import { createContext, useContext, useState } from "react";
import api from "../utils/api";
import { useAuth } from "./AuthContext";

const MentorRequestContext = createContext(null);

const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

export const MentorRequestProvider = ({ children }) => {
  const { user } = useAuth();
  if (!import.meta.env.VITE_RAZORPAY_KEY_ID) {
    console.warn("VITE_RAZORPAY_KEY_ID not set in .env");
  }
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [paymentStage, setPaymentStage] = useState("idle"); // 'idle' | 'creating_order' | 'payment_processing' | 'verifying' | 'failed'

  const sendRequest = async ({ mentorId, goal, message }) => {
    try {
      setLoading(true);
      setError(null);
      setSuccess(false);
      setPaymentStage("idle");

      // 🔴 Validation FIRST (before API)
      if (!mentorId) {
        setError("Mentor not selected");
        return false;
      }

      if (!goal || goal.trim().length === 0) {
        setError("Please enter your goal");
        return false;
      }

      if (goal.length > 100) {
        setError("Goal cannot exceed 100 characters");
        return false;
      }

      if (message && message.length > 500) {
        setError("Message cannot exceed 500 characters");
        return false;
      }

      // 💳 Razorpay SDK dynamic load
      setPaymentStage("creating_order");
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        setError("Failed to load Razorpay SDK. Please check your network connection.");
        setPaymentStage("failed");
        return false;
      }

      // 📦 Call backend create-order API
      // Note: amount is ₹29 = 2900 paise. SOW specifies 2900 paise.
      const orderRes = await api.post("/payments/create-order", {
        mentorId,
        amount: 2900,
        currency: "INR"
      });

      const orderData = orderRes.data;

      // 📱 Open Razorpay Checkout modal
      setPaymentStage("payment_processing");
      return new Promise((resolve) => {
        const options = {
          key: import.meta.env.VITE_RAZORPAY_KEY_ID || orderData.key || "rzp_test_REPLACE_WITH_ACTUAL_KEY",
          amount: orderData.amount || 2900,
          currency: orderData.currency || "INR",
          name: "CampusPull",
          description: "Mentorship Request Session Fee",
          order_id: orderData.orderId || orderData.razorpayOrderId,
          handler: async (response) => {
            setPaymentStage("verifying");
            try {
              // 🔍 Verify Razorpay payment and create MentorRequest
              await api.post("/payments/verify", {
                razorpayOrderId: response.razorpay_order_id,
                razorpayPaymentId: response.razorpay_payment_id,
                razorpaySignature: response.razorpay_signature,
                mentorId,
                goal: goal.trim(),
                message: message?.trim()
              });

              setSuccess(true);
              setPaymentStage("idle");
              resolve(true);
            } catch (verifyErr) {
              console.error("Payment Verification Error:", verifyErr);
              setError(
                verifyErr.response?.data?.message || 
                verifyErr.message || 
                "Payment verification failed. Please contact support."
              );
              setPaymentStage("failed");
              resolve(false);
            }
          },
          prefill: {
            name: user?.name || "Student",
            email: user?.email || "student@campuspull.com",
          },
          theme: {
            color: "#2563EB"
          },
          modal: {
            ondismiss: () => {
              setError("Payment cancelled by student");
              setPaymentStage("idle");
              resolve(false);
            }
          }
        };

        const rzp = new window.Razorpay(options);
        rzp.on("payment.failed", (resp) => {
          setError(resp.error?.description || "Payment process failed");
          setPaymentStage("failed");
          resolve(false);
        });
        rzp.open();
      });

    } catch (err) {
      console.error("ERROR IN PAYMENT FLOW:", err);
      setError(
        err.response?.data?.message ||
        err.message ||
        "Failed to process mentorship payment"
      );
      setPaymentStage("failed");
      return false;
    } finally {
      setLoading(false);
    }
  };

  return (
    <MentorRequestContext.Provider
      value={{ sendRequest, loading, error, success, paymentStage }}
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
