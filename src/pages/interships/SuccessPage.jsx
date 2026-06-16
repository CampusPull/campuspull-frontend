import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FiCheckCircle, FiBriefcase, FiList } from "react-icons/fi";
import { motion } from "framer-motion";

export default function SuccessPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/40 flex items-center justify-center pt-20 pb-16">
      <div className="max-w-md w-full mx-auto px-6 text-center">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", damping: 15 }}
          className="bg-white rounded-3xl border border-gray-100 shadow-2xl p-8 space-y-6"
        >
          {/* Success Checkmark Circle */}
          <div className="w-20 h-20 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mx-auto border-2 border-emerald-100 shadow-md">
            <FiCheckCircle size={44} />
          </div>

          <div className="space-y-2">
            <h1 className="text-xl md:text-2xl font-extrabold text-gray-900 tracking-tight leading-tight">
              Application Submitted Successfully!
            </h1>
            <p className="text-gray-500 text-sm leading-relaxed max-w-[280px] mx-auto">
              We&apos;ve received your application. The company will review it and update your status.
            </p>
          </div>

          {/* Action buttons */}
          <div className="pt-2 flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => navigate(`/internships/${id}`)}
              className="flex-1 px-5 py-3 border border-gray-200 hover:border-indigo-200 text-gray-700 hover:text-indigo-600 font-bold text-sm rounded-xl bg-white hover:bg-indigo-50/20 transition-all flex items-center justify-center gap-2 shadow-sm"
            >
              <FiBriefcase size={16} />
              View Internship
            </button>
            <button
              onClick={() => navigate("/applications")}
              className="flex-1 px-5 py-3 bg-gradient-to-r from-indigo-600 to-blue-600 hover:shadow-lg text-white font-bold text-sm rounded-xl transition-all flex items-center justify-center gap-2"
            >
              <FiList size={16} />
              My Applications
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
