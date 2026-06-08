import { useState, useEffect } from "react";
import { useMentorRequest } from "../../../context/mentorRequestContext";
import { motion } from "framer-motion";
import { FiX, FiAlertTriangle, FiUser } from "react-icons/fi";

const RequestMentorModal = ({ mentor, onClose }) => {
  const { sendRequest, loading, error, success } = useMentorRequest();
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
    }
  }, [success, onClose]);

  const mentorName = mentor?.userId?.name || "Alumni Mentor";

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
      {/* Backdrop with backdrop-blur */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-slate-950/80 backdrop-blur-md"
      />

      {/* Modal Container */}
      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.92, y: 15 }}
        transition={{ type: "spring", stiffness: 350, damping: 28 }}
        className="w-full max-w-md bg-slate-900/90 border border-white/10 rounded-[32px] p-7 shadow-[0_20px_50px_rgba(0,0,0,0.5)] backdrop-blur-2xl relative overflow-hidden text-left text-white z-10"
      >
        {/* Glow Effects */}
        <div className="absolute top-0 right-0 w-36 h-36 bg-indigo-500/10 rounded-full blur-[40px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-36 h-36 bg-cyan-500/5 rounded-full blur-[40px] pointer-events-none" />
        <div className="absolute top-0 inset-x-0 h-[1.5px] bg-gradient-to-r from-transparent via-indigo-500/40 to-transparent" />

        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-all cursor-pointer border border-white/5"
          aria-label="Close modal"
        >
          <FiX size={15} />
        </button>

        {/* Header */}
        <div className="mb-6 pr-8">
          <span className="text-[10px] font-black uppercase tracking-widest text-indigo-400 px-2.5 py-1 bg-indigo-500/10 border border-indigo-500/20 rounded-lg inline-block mb-3.5">
            🤝 Request Mentorship
          </span>
          <h2 className="text-2xl font-black font-poppins text-white tracking-tight">
            Write Proposal
          </h2>
          
          <div className="mt-2.5 flex items-center gap-2 text-xs font-semibold text-slate-300 bg-white/5 border border-white/5 rounded-2xl px-3 py-1.5 w-max shadow-sm">
            <FiUser className="text-indigo-400 shrink-0" size={13} />
            <span>Reaching out to <strong className="text-white font-extrabold">{mentorName}</strong></span>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Goal Input */}
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block">
              What do you want help with? *
            </label>
            <input
              type="text"
              className="w-full bg-slate-950/40 border border-white/10 rounded-2xl px-4 py-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all font-semibold"
              placeholder="e.g. DevOps roadmap, resume review, mock coding"
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
              required
            />
            {/* Counter */}
            <div className="text-[10px] text-slate-500 font-bold text-right">
              <span
                className={
                  goal.length > GOAL_LIMIT
                    ? "text-red-400"
                    : goal.length > GOAL_LIMIT * 0.8
                      ? "text-yellow-400"
                      : "text-slate-500"
                }
              >
                {goal.length}/{GOAL_LIMIT}
              </span>
            </div>
          </div>

          {/* Message Area */}
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block">
              Additional message (optional)
            </label>
            <textarea
              className="w-full bg-slate-950/40 border border-white/10 rounded-2xl px-4 py-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all font-semibold resize-none"
              placeholder="Brief context about your background, goals, or expectations"
              rows={4}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
            {/* Counter */}
            <div className="text-[10px] text-slate-500 font-bold text-right">
              <span
                className={
                  message.length > MESSAGE_LIMIT
                    ? "text-red-400"
                    : message.length > MESSAGE_LIMIT * 0.8
                      ? "text-yellow-400"
                      : "text-slate-500"
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
              className="rounded-2xl border border-red-500/20 bg-red-500/10 p-3.5 text-xs text-red-400 font-semibold backdrop-blur-md flex items-center gap-2"
            >
              <FiAlertTriangle className="text-red-400 shrink-0" size={14} />
              <span>{error}</span>
            </motion.div>
          )}

          {/* Actions */}
          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-3 text-xs font-black uppercase tracking-wider text-slate-400 hover:text-white rounded-2xl hover:bg-white/5 transition-all cursor-pointer"
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
              className="px-6 py-3 bg-gradient-to-r from-indigo-500 to-blue-600 hover:from-indigo-600 hover:to-blue-700 text-white text-xs font-black uppercase tracking-wider rounded-2xl shadow-lg shadow-indigo-500/10 hover:shadow-indigo-500/20 active:scale-98 transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer border border-indigo-400/20"
            >
              {loading ? "Sending..." : "Send Proposal"}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default RequestMentorModal;
