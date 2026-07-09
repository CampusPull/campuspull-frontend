import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FiCheckCircle, FiArrowRight, FiUsers } from "react-icons/fi";

const MentorshipSuccessPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4 pt-24 pb-12">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="w-full max-w-lg bg-white rounded-3xl p-8 border border-gray-100 shadow-xl text-center relative overflow-hidden"
      >
        {/* Glow decoration */}
        <div className="absolute -top-24 -left-24 w-48 h-48 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />

        {/* Success Icon */}
        <motion.div 
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200, damping: 15 }}
          className="w-20 h-20 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mx-auto border border-emerald-100 shadow-sm mb-6"
        >
          <FiCheckCircle size={40} className="stroke-[1.5]" />
        </motion.div>

        <h1 className="text-3xl font-black text-slate-900 tracking-tight mb-3">
          Payment Successful!
        </h1>
        
        <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-6">
          ₹29.00 paid securely via Razorpay
        </p>

        <div className="bg-slate-50 border border-slate-100 rounded-2xl p-5 mb-8 text-left space-y-3">
          <p className="text-sm text-slate-700 font-semibold leading-relaxed">
            🚀 Your mentorship request has been submitted.
          </p>
          <p className="text-xs text-slate-500 font-medium leading-relaxed">
            The mentor will review your goal proposal and schedule a session with dates, times, and a connection link. You will receive an email notification when they respond.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={() => navigate("/mentorship/my-requests")}
            className="flex-1 px-5 py-3.5 bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs uppercase tracking-wider rounded-2xl shadow-md transition-all flex items-center justify-center gap-2"
          >
            <span>View My Requests</span>
            <FiArrowRight size={14} />
          </button>
          
          <button
            onClick={() => navigate("/mentorship/mentors")}
            className="flex-1 px-5 py-3.5 bg-white border border-slate-200 hover:border-slate-300 text-slate-700 hover:text-slate-900 font-extrabold text-xs uppercase tracking-wider rounded-2xl transition-all flex items-center justify-center gap-2"
          >
            <FiUsers size={14} />
            <span>Find More Mentors</span>
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default MentorshipSuccessPage;
