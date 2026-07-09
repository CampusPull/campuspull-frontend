import { useState, useEffect } from "react";
import { useMentorRequest } from "../../../context/mentorRequestContext";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FiX, FiAlertTriangle, FiUser } from "react-icons/fi";

const RequestMentorModal = ({ mentor, onClose }) => {
  const { sendRequest, loading, error, success, paymentStage } = useMentorRequest();
  const navigate = useNavigate();
  const [goal, setGoal] = useState("");
  const [message, setMessage] = useState("");

  const GOAL_LIMIT = 100;
  const MESSAGE_LIMIT = 500;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!goal.trim()) return;

    await sendRequest({
      mentorId: mentor.userId._id,
      goal,
      message,
    });
  };

  useEffect(() => {
    if (success) {
      onClose();
      navigate("/mentorship/success");
    }
  }, [success, onClose, navigate]);

  const mentorName = mentor?.userId?.name || "Alumni Mentor";

  const getButtonText = () => {
    if (paymentStage === "creating_order") return "Creating Order...";
    if (paymentStage === "payment_processing") return "Processing Payment...";
    if (paymentStage === "verifying") return "Verifying Payment...";
    if (paymentStage === "failed") return "Continue & Pay ₹29";
    if (loading) return "Processing...";
    return "Continue & Pay ₹29";
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
      {/* Backdrop */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
      />

      {/* Modal Container */}
      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.92, y: 15 }}
        transition={{ type: "spring", stiffness: 350, damping: 28 }}
        className="w-full max-w-md bg-white border border-slate-100 rounded-3xl p-7 shadow-2xl relative overflow-hidden text-left text-slate-900 z-10"
      >
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-all cursor-pointer border border-slate-200 bg-white"
          aria-label="Close modal"
        >
          <FiX size={15} />
        </button>

        {/* Header */}
        <div className="mb-6 pr-8">
          <span className="text-[10px] font-black uppercase tracking-widest text-indigo-600 px-2.5 py-1 bg-indigo-50 border border-indigo-100 rounded-lg inline-block mb-3.5 font-sans">
            Request Mentorship
          </span>
          <h2 className="text-2xl font-extrabold font-sans text-slate-900 tracking-tight">
            Write Proposal
          </h2>
          
          <div className="mt-2.5 flex items-center gap-2 text-xs font-semibold text-slate-600 bg-slate-50 border border-slate-100 rounded-2xl px-3 py-1.5 w-max shadow-sm">
            <FiUser className="text-indigo-600 shrink-0" size={13} />
            <span>Reaching out to <strong className="text-slate-900 font-extrabold">{mentorName}</strong></span>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Goal Input */}
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 block mb-1">
              What do you want help with? *
            </label>
            <input
              type="text"
              className="w-full border border-slate-200 bg-white p-3.5 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-medium text-slate-800 placeholder-slate-400"
              placeholder=""
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
              required
            />
            {/* Counter */}
            <div className="text-[10px] text-slate-400 font-bold text-right">
              <span
                className={
                  goal.length > GOAL_LIMIT
                    ? "text-red-500"
                    : goal.length > GOAL_LIMIT * 0.8
                      ? "text-yellow-500"
                      : "text-slate-400"
                }
              >
                {goal.length}/{GOAL_LIMIT}
              </span>
            </div>
          </div>

          {/* Message Area */}
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 block mb-1">
              Additional message (optional)
            </label>
            <textarea
              className="w-full border border-slate-200 bg-white p-3.5 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-medium text-slate-800 placeholder-slate-400 resize-none"
              placeholder=""
              rows={4}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
            {/* Counter */}
            <div className="text-[10px] text-slate-400 font-bold text-right">
              <span
                className={
                  message.length > MESSAGE_LIMIT
                    ? "text-red-500"
                    : message.length > MESSAGE_LIMIT * 0.8
                      ? "text-yellow-500"
                      : "text-slate-400"
                }
              >
                {message.length}/{MESSAGE_LIMIT}
              </span>
            </div>
          </div>

          {/* Error Rendering */}
          {error && (
            <motion.div 
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-2xl border border-red-200 bg-red-50 p-3.5 text-xs text-red-600 font-semibold flex items-center gap-2"
            >
              <FiAlertTriangle className="text-red-500 shrink-0" size={14} />
              <span>{error}</span>
            </motion.div>
          )}

          {/* Actions */}
          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-2xl border border-slate-200 text-slate-500 hover:bg-slate-50 font-bold text-sm transition-all focus:outline-none cursor-pointer"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={
                loading ||
                !goal.trim() ||
                goal.length > GOAL_LIMIT ||
                message.length > MESSAGE_LIMIT
              }
              className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm rounded-2xl transition-all duration-200 focus:outline-none disabled:opacity-50 disabled:pointer-events-none cursor-pointer flex items-center justify-center"
            >
              {getButtonText()}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default RequestMentorModal;
