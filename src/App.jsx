import React, { useState, useEffect } from "react";
import Routes from "./Routes";
import api from "./utils/api";
import { motion, AnimatePresence } from "framer-motion";
import { FiBell, FiX, FiCheck } from "react-icons/fi";

function App() {
  const [importantAnn, setImportantAnn] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchLatestAnnouncement = async () => {
      try {
        const res = await api.get("/public/announcements?limit=5");
        const announcements = res.data?.data || [];
        // Find the latest important announcement
        const latestImportant = announcements.find(ann => ann.important === true);
        if (latestImportant) {
          const isSeen = localStorage.getItem(`seen_announcement_${latestImportant._id}`);
          if (!isSeen) {
            setImportantAnn(latestImportant);
            setShowModal(true);
          }
        }
      } catch (err) {
        console.error("Failed to fetch public announcements for welcome popup:", err);
      }
    };
    fetchLatestAnnouncement();
  }, []);

  const handleClose = () => {
    if (importantAnn) {
      localStorage.setItem(`seen_announcement_${importantAnn._id}`, "true");
    }
    setShowModal(false);
  };

  return (
    <>
      <Routes />

      {/* Global Announcement Popup Modal */}
      <AnimatePresence>
        {showModal && importantAnn && (
          <div className="fixed inset-0 z-[999] flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
              onClick={handleClose}
            />

            {/* Modal Box */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 220 }}
              className="relative w-full max-w-md bg-white rounded-3xl border border-gray-100 shadow-2xl overflow-hidden z-10 flex flex-col"
              style={{ boxShadow: "0 20px 50px rgba(0,0,0,0.15)" }}
            >
              {/* Vibrant Decorative Top bar */}
              <div className="h-2.5 bg-gradient-to-r from-rose-500 via-pink-500 to-indigo-500" />

              {/* Close Button */}
              <button
                onClick={handleClose}
                className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition"
              >
                <FiX size={16} />
              </button>

              <div className="p-6 text-center space-y-4">
                {/* Bell Icon pulsing */}
                <div className="relative w-14 h-14 bg-indigo-50 rounded-full flex items-center justify-center mx-auto text-indigo-600 shadow-sm border border-indigo-100">
                  <FiBell size={24} className="animate-wiggle" />
                  <span className="absolute top-1 right-1 w-3 h-3 bg-rose-500 rounded-full border-2 border-white animate-ping" />
                  <span className="absolute top-1 right-1 w-3 h-3 bg-rose-500 rounded-full border-2 border-white" />
                </div>

                {/* Announcement details */}
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest bg-indigo-50 px-2.5 py-1 rounded-full border border-indigo-100">
                    📢 Important Notice
                  </span>
                  <h3 className="text-xl font-extrabold text-slate-800 pt-2 leading-snug">
                    {importantAnn.title}
                  </h3>
                  <p className="text-[10px] text-slate-400 font-semibold tracking-wide">
                    Posted on {new Date(importantAnn.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "long" })}
                  </p>
                </div>

                {/* Content Area */}
                <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 max-h-48 overflow-y-auto text-left">
                  <p className="text-xs text-slate-600 leading-relaxed whitespace-pre-line font-medium">
                    {importantAnn.content}
                  </p>
                </div>

                {/* Action CTA */}
                <button
                  onClick={handleClose}
                  className="w-full py-3 bg-gradient-to-r from-indigo-600 to-blue-600 text-white font-bold text-xs rounded-xl shadow-lg transition active:scale-98 flex items-center justify-center gap-1.5 focus:outline-none"
                >
                  <FiCheck size={14} /> Got it, thanks!
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}

export default App;
