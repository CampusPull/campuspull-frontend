import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, AlertTriangle, Loader2 } from "lucide-react";
import { deleteOpenInternship } from "../../services/applicationService";
import { toast } from "react-toastify";

export default function DeleteConfirmModal({ isOpen, onClose, internship, onSuccess }) {
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen || !internship) return null;

  const handleDelete = async () => {
    setSubmitting(true);
    try {
      const res = await deleteOpenInternship(internship._id);
      if (res && res.success) {
        toast.success(res.message || "Internship deleted successfully!");
        onSuccess?.();
        onClose();
      } else {
        throw new Error(res?.message || "Failed to delete internship");
      }
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || err.message || "Failed to delete internship. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
          onClick={onClose}
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="bg-white w-full max-w-md rounded-3xl border border-slate-100 shadow-2xl overflow-hidden z-10 flex flex-col"
        >
          {/* Header */}
          <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-rose-50/30">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-rose-500 flex items-center justify-center text-white shadow-md shadow-rose-500/20">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-extrabold text-slate-800 leading-tight">Delete Internship</h2>
                <p className="text-xs font-semibold text-slate-400 mt-0.5">This action is permanent</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-slate-100 text-slate-400 hover:text-slate-600 rounded-xl transition-all duration-200 focus:outline-none"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 space-y-4">
            <p className="text-sm font-semibold text-slate-600 leading-relaxed">
              Are you sure you want to delete this open internship opportunity?
            </p>
            <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4">
              <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest">Opportunity Title</h4>
              <p className="text-sm font-extrabold text-slate-800 mt-1">{internship.title}</p>
              <p className="text-xs font-bold text-indigo-600 mt-0.5">{internship.companyName}</p>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="p-6 border-t border-slate-100 flex items-center justify-end gap-3 bg-slate-50/50">
            <button
              disabled={submitting}
              onClick={onClose}
              className="px-5 py-3 border border-slate-200 rounded-2xl text-xs font-black text-slate-600 bg-white hover:bg-slate-50 disabled:opacity-50 transition-all cursor-pointer"
            >
              Cancel
            </button>
            <button
              disabled={submitting}
              onClick={handleDelete}
              className="flex items-center gap-2 px-5 py-3 bg-rose-600 hover:bg-rose-700 text-white text-xs font-black rounded-2xl disabled:opacity-50 transition-all shadow-md shadow-rose-600/10 cursor-pointer"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete Internship"
              )}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
