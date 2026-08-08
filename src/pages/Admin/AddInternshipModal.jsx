import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Briefcase, Loader2 } from "lucide-react";
import { createOpenInternship } from "../../services/applicationService";
import { toast } from "react-toastify";

export default function AddInternshipModal({ isOpen, onClose, onSuccess }) {
  const [form, setForm] = useState({
    title: "",
    companyName: "",
    applyLink: "",
    deadline: "",
    location: "",
    stipend: "",
    description: "",
  });

  const [validationErrors, setValidationErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    // Clear validation error on change
    if (validationErrors[name]) {
      setValidationErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const errors = {};
    if (!form.title.trim()) errors.title = "Title is required";
    if (!form.companyName.trim()) errors.companyName = "Company name is required";
    
    // Validate applyLink URL
    if (!form.applyLink.trim()) {
      errors.applyLink = "Apply link is required";
    } else {
      try {
        const url = new URL(form.applyLink);
        if (url.protocol !== "http:" && url.protocol !== "https:") {
          errors.applyLink = "Apply link must start with http:// or https://";
        }
      } catch (_) {
        errors.applyLink = "Please enter a valid URL (e.g., https://company.com/apply)";
      }
    }

    // Validate deadline date is in the future
    if (!form.deadline) {
      errors.deadline = "Deadline is required";
    } else {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const selected = new Date(form.deadline);
      if (selected < today) {
        errors.deadline = "Deadline must be in the future";
      }
    }

    // Validate description length
    if (form.description.length > 500) {
      errors.description = "Description must not exceed 500 characters";
    }

    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }

    setSubmitting(true);
    try {
      const res = await createOpenInternship(form);
      if (res && res.success) {
        toast.success("Internship created successfully!");
        setForm({
          title: "",
          companyName: "",
          applyLink: "",
          deadline: "",
          location: "",
          stipend: "",
          description: "",
        });
        onSuccess?.();
        onClose();
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        throw new Error(res?.message || "Failed to create internship");
      }
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || err.message || "Failed to create internship");
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
          className="bg-white w-full max-w-2xl rounded-3xl border border-slate-100 shadow-2xl overflow-hidden z-10 flex flex-col max-h-[90vh]"
        >
          {/* Header */}
          <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-gradient-to-r from-indigo-50/50 to-blue-50/30">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-500 flex items-center justify-center text-white shadow-md shadow-indigo-500/20">
                <Briefcase className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl font-extrabold text-slate-800 leading-tight">Add New Internship</h2>
                <p className="text-xs font-semibold text-slate-400 mt-0.5">Post an external internship listing</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-slate-100 text-slate-400 hover:text-slate-600 rounded-xl transition-all duration-200 focus:outline-none"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-5">
            
            {/* Title & Company */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-1.5">
                  Internship Title <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  name="title"
                  placeholder="e.g., Backend Engineer Intern"
                  value={form.title}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 bg-slate-50 border ${validationErrors.title ? "border-rose-300 focus:border-rose-500 focus:ring-rose-500/20" : "border-slate-100 focus:border-indigo-500 focus:ring-indigo-500/20"} rounded-2xl text-sm font-semibold text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 transition-all`}
                  required
                />
                {validationErrors.title && (
                  <p className="text-[11px] font-bold text-rose-500 mt-1">{validationErrors.title}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-1.5">
                  Company Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  name="companyName"
                  placeholder="e.g., Acme Corp"
                  value={form.companyName}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 bg-slate-50 border ${validationErrors.companyName ? "border-rose-300 focus:border-rose-500 focus:ring-rose-500/20" : "border-slate-100 focus:border-indigo-500 focus:ring-indigo-500/20"} rounded-2xl text-sm font-semibold text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 transition-all`}
                  required
                />
                {validationErrors.companyName && (
                  <p className="text-[11px] font-bold text-rose-500 mt-1">{validationErrors.companyName}</p>
                )}
              </div>
            </div>

            {/* Apply Link & Deadline */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-1.5">
                  Apply Link <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  name="applyLink"
                  placeholder="e.g., https://company.com/careers/apply"
                  value={form.applyLink}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 bg-slate-50 border ${validationErrors.applyLink ? "border-rose-300 focus:border-rose-500 focus:ring-rose-500/20" : "border-slate-100 focus:border-indigo-500 focus:ring-indigo-500/20"} rounded-2xl text-sm font-semibold text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 transition-all`}
                  required
                />
                {validationErrors.applyLink && (
                  <p className="text-[11px] font-bold text-rose-500 mt-1">{validationErrors.applyLink}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-1.5">
                  Deadline <span className="text-rose-500">*</span>
                </label>
                <input
                  type="date"
                  name="deadline"
                  value={form.deadline}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 bg-slate-50 border ${validationErrors.deadline ? "border-rose-300 focus:border-rose-500 focus:ring-rose-500/20" : "border-slate-100 focus:border-indigo-500 focus:ring-indigo-500/20"} rounded-2xl text-sm font-semibold text-slate-700 focus:outline-none focus:ring-2 transition-all cursor-pointer`}
                  required
                />
                {validationErrors.deadline && (
                  <p className="text-[11px] font-bold text-rose-500 mt-1">{validationErrors.deadline}</p>
                )}
              </div>
            </div>

            {/* Location & Stipend (Optional) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-1.5">
                  Location (Optional)
                </label>
                <input
                  type="text"
                  name="location"
                  placeholder="e.g., Remote, Bangalore"
                  value={form.location}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-semibold text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-1.5">
                  Stipend (Optional)
                </label>
                <input
                  type="text"
                  name="stipend"
                  placeholder="e.g., ₹15,000/month, Unpaid"
                  value={form.stipend}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-semibold text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                />
              </div>
            </div>

            {/* Description (Optional) */}
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="block text-xs font-black uppercase tracking-widest text-slate-400">
                  Description (Optional)
                </label>
                <span className={`text-[10px] font-bold ${form.description.length > 500 ? "text-rose-500" : "text-slate-400"}`}>
                  {form.description.length} / 500
                </span>
              </div>
              <textarea
                name="description"
                placeholder="Brief description of the role (maximum 500 characters)..."
                rows={4}
                value={form.description}
                onChange={handleChange}
                className={`w-full px-4 py-3 bg-slate-50 border ${validationErrors.description ? "border-rose-300 focus:border-rose-500 focus:ring-rose-500/20" : "border-slate-100 focus:border-indigo-500 focus:ring-indigo-500/20"} rounded-2xl text-sm font-semibold text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 transition-all resize-none`}
              />
              {validationErrors.description && (
                <p className="text-[11px] font-bold text-rose-500 mt-1">{validationErrors.description}</p>
              )}
            </div>

            {/* Footer Actions */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
              <button
                type="button"
                disabled={submitting}
                onClick={onClose}
                className="px-5 py-3 border border-slate-200 rounded-2xl text-xs font-black text-slate-600 bg-white hover:bg-slate-50 disabled:opacity-50 transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-black rounded-2xl disabled:opacity-50 transition-all shadow-md shadow-indigo-600/10 cursor-pointer animate-none"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    Creating...
                  </>
                ) : (
                  "Create Internship"
                )}
              </button>
            </div>

          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
