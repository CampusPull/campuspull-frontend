import { createContext, useContext, useState } from "react";
import api from "../utils/api";
import { useAuth } from "./AuthContext";
import { toast } from "react-toastify";

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

  const executeOriginalSendRequest = async ({ mentorId, goal, message }) => {
    try {
      setLoading(true);
      setError(null);
      setSuccess(false);

      // ✅ API call
      await api.post("/mentorship/request", {
        mentorId,
        goal: goal.trim(),
        message: message?.trim(),
      });

      setSuccess(true);
      return true;
    } catch (err) {
      console.log("ERROR RESPONSE:", err.response);

      setError(
        err.response?.data?.message ||
        err.message ||
        "Failed to send request"
      );
      return false;
    } finally {
      setLoading(false);
    }
  };

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
        const errMsg = "Failed to load Razorpay SDK. Please check your network connection.";
        setError(errMsg);
        toast.error(errMsg);
        setPaymentStage("failed");
        return false;
      }

      // 📦 Call backend create-order API
      // Note: amount is ₹29
      let orderRes;
      try {
        orderRes = await api.post("/payments/create-order", {
          mentorId,
          amount: 29,
        });
      } catch (orderErr) {
        const errMsg = orderErr.response?.data?.message || orderErr.message || "Failed to create payment order";
        setError(errMsg);
        toast.error(errMsg);
        setPaymentStage("failed");
        return false;
      }

      const orderData = orderRes.data;
      if (!orderData || !orderData.orderId) {
        const errMsg = "Order details not received from server";
        setError(errMsg);
        toast.error(errMsg);
        setPaymentStage("failed");
        return false;
      }

      // 📱 Open Razorpay Checkout modal
      setPaymentStage("payment_processing");
      return new Promise((resolve) => {
        const options = {
          key: import.meta.env.VITE_RAZORPAY_KEY_ID || orderData.key || "rzp_test_REPLACE_WITH_ACTUAL_KEY",
          amount: orderData.amount || 2900,
          currency: orderData.currency || "INR",
          name: "CampusPull Mentorship",
          description: "Mentorship Session Fee",
          order_id: orderData.orderId,
          handler: async (response) => {
            setPaymentStage("verifying");
            try {
              // 🔍 Verify Razorpay payment
              await api.post("/payments/verify", {
                razorpayOrderId: response.razorpay_order_id,
                razorpayPaymentId: response.razorpay_payment_id,
                razorpaySignature: response.razorpay_signature,
              });

              // If verification success → NOW call existing sendRequest()
              setPaymentStage("idle");
              const res = await executeOriginalSendRequest({ mentorId, goal, message });
              resolve(res);
            } catch (verifyErr) {
              console.error("Payment Verification Error:", verifyErr);
              const errMsg = verifyErr.response?.data?.message || verifyErr.message || "Payment verification failed. Please contact support.";
              setError(errMsg);
              toast.error(errMsg);
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
              setError("Payment cancelled");
              toast.warn("Payment cancelled");
              setPaymentStage("idle");
              resolve(false);
            }
          }
        };

        const rzp = new window.Razorpay(options);
        rzp.on("payment.failed", (resp) => {
          const errMsg = resp.error?.description || "Payment failed";
          setError(errMsg);
          toast.error(errMsg);
          setPaymentStage("failed");
          resolve(false);
        });
        rzp.open();
      });

    } catch (err) {
      console.error("ERROR IN PAYMENT FLOW:", err);
      const errMsg = err.response?.data?.message || err.message || "Failed to process mentorship payment";
      setError(errMsg);
      toast.error(errMsg);
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
