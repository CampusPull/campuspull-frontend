import { useState, useRef } from "react";
import { useInternships } from "../../../context/internshipContext";
import { useAuth } from "context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import { FiX, FiUploadCloud, FiFile, FiCheck, FiBriefcase, FiAlertCircle } from "react-icons/fi";

const CreateInternshipModal = ({ isOpen, onClose, onSuccess }) => {
  const { user } = useAuth();
  const { createInternship } = useInternships();
  const fileInputRef = useRef(null);

  const [form, setForm] = useState({
    title: "",
    description: "",
    stipend: "",
    durationValue: "",
    durationUnit: "month",
    location: "",
    eligibility: "",
    skills: "",
    applyLink: "",
    companyName: "",
    companyWebsite: "",
    type: "remote",
  });

  const [logoFile, setLogoFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState("");
  const [isDragActive, setIsDragActive] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setIsDragActive(true);
    } else if (e.type === "dragleave") {
      setIsDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      setLogoFile(file);
      setLogoPreview(URL.createObjectURL(file));
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setLogoFile(file);
      setLogoPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    const createdBy = user?._id || user?.id;
    if (!createdBy) {
      alert("You must be logged in to create an internship!");
      setSubmitting(false);
      return;
    }

    const formData = new FormData();
    formData.append("title", form.title);
    formData.append("description", form.description);
    formData.append("stipend", Number(form.stipend) || 0);
    formData.append("durationValue", Number(form.durationValue));
    formData.append("durationUnit", form.durationUnit);
    formData.append("location", form.location);
    formData.append("eligibility", form.eligibility || "");
    
    // Split and save skills array
    const skillsArray = form.skills
      .split(",")
      .map((s) => s.trim().toLowerCase())
      .filter(Boolean);
    formData.append("skills", JSON.stringify(skillsArray));

    formData.append("applyLink", form.applyLink);
    formData.append("companyName", form.companyName);
    formData.append("companyWebsite", form.companyWebsite);
    formData.append("createdBy", createdBy);
    formData.append("type", form.type);

    if (logoFile) {
      formData.append("companyLogo", logoFile);
    }

    try {
      await createInternship(formData);
      onSuccess?.();
      onClose();
    } catch (err) {
      console.error("Create internship failed:", err);
      setError(
        err.response?.data?.errors || 
        err.response?.data?.message || 
        err.response?.data || 
        "Create internship failed. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

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
          className="bg-white/90 dark:bg-slate-900/95 backdrop-blur-md w-full max-w-2xl rounded-3xl border border-gray-100 dark:border-slate-800 shadow-2xl overflow-hidden z-10 flex flex-col max-h-[90vh]"
        >
          {/* Header */}
          <div className="p-6 border-b border-gray-100 dark:border-slate-800/60 flex justify-between items-center bg-gradient-to-r from-indigo-50/50 to-blue-50/30 dark:from-slate-900 dark:to-slate-900/50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-500 flex items-center justify-center text-white shadow-md shadow-indigo-500/20">
                <FiBriefcase size={20} />
              </div>
              <div>
                <h2 className="text-xl font-extrabold text-slate-800 dark:text-white leading-tight">Create Internship</h2>
                <p className="text-xs font-medium text-slate-400 mt-0.5">Post a new opportunity for students</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-xl transition-all duration-200 focus:outline-none"
            >
              <FiX size={20} />
            </button>
          </div>

          {/* Form Content */}
          <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-5">
            
            {/* Title */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Opportunity Title</label>
              <input
                type="text"
                name="title"
                placeholder="e.g. Frontend React Developer Intern"
                value={form.title}
                onChange={handleChange}
                className="w-full border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 p-3 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-medium text-slate-800 dark:text-white"
                required
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Description & Requirements</label>
              <textarea
                name="description"
                placeholder="Describe roles, responsibilities, and qualifications..."
                rows={4}
                value={form.description}
                onChange={handleChange}
                className="w-full border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 p-3 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-medium text-slate-800 dark:text-white"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Stipend */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Monthly Stipend (₹)</label>
                <input
                  type="number"
                  name="stipend"
                  placeholder="e.g. 10000 (Enter 0 for unpaid)"
                  value={form.stipend}
                  onChange={handleChange}
                  className="w-full border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 p-3 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-medium text-slate-800 dark:text-white"
                />
              </div>

              {/* Location */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Location</label>
                <input
                  type="text"
                  name="location"
                  placeholder="e.g. Bangalore, Remote, Pune"
                  value={form.location}
                  onChange={handleChange}
                  className="w-full border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 p-3 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-medium text-slate-800 dark:text-white"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Duration Value */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Duration Value</label>
                <input
                  type="number"
                  name="durationValue"
                  placeholder="e.g. 3, 6"
                  value={form.durationValue}
                  onChange={handleChange}
                  className="w-full border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 p-3 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-medium text-slate-800 dark:text-white"
                  required
                />
              </div>

              {/* Duration Unit */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Duration Unit</label>
                <select
                  name="durationUnit"
                  value={form.durationUnit}
                  onChange={handleChange}
                  className="w-full border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 p-3 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-semibold text-slate-700 dark:text-slate-200"
                >
                  <option value="week">Week(s)</option>
                  <option value="month">Month(s)</option>
                </select>
              </div>

              {/* Internship Type */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Internship Type</label>
                <select
                  name="type"
                  value={form.type}
                  onChange={handleChange}
                  className="w-full border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 p-3 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-semibold text-slate-700 dark:text-slate-200"
                >
                  <option value="remote">Remote</option>
                  <option value="on-site">On-site</option>
                  <option value="hybrid">Hybrid</option>
                </select>
              </div>
            </div>

            {/* Eligibility & Skills */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Eligibility</label>
                <input
                  type="text"
                  name="eligibility"
                  placeholder="e.g. B.Tech / MCA (3rd / 4th Year)"
                  value={form.eligibility}
                  onChange={handleChange}
                  className="w-full border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 p-3 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-medium text-slate-800 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Skills (Comma separated)</label>
                <input
                  type="text"
                  name="skills"
                  placeholder="e.g. React, Node.js, CSS"
                  value={form.skills}
                  onChange={handleChange}
                  className="w-full border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 p-3 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-medium text-slate-800 dark:text-white"
                  required
                />
              </div>
            </div>

            {/* Application & Company Link */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Apply Link</label>
                <input
                  type="text"
                  name="applyLink"
                  placeholder="e.g. linkemate.com/apply"
                  value={form.applyLink}
                  onChange={handleChange}
                  className="w-full border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 p-3 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-medium text-slate-800 dark:text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Company Website</label>
                <input
                  type="text"
                  name="companyWebsite"
                  placeholder="e.g. linkemate.com"
                  value={form.companyWebsite}
                  onChange={handleChange}
                  className="w-full border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 p-3 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-medium text-slate-800 dark:text-white"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Company Name */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Company Name</label>
                <input
                  type="text"
                  name="companyName"
                  placeholder="e.g. LinkeMate Corp"
                  value={form.companyName}
                  onChange={handleChange}
                  className="w-full border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 p-3 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-medium text-slate-800 dark:text-white"
                  required
                />
              </div>

              {/* Upload Logo */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Company Logo</label>
                <div
                  onDragEnter={handleDrag}
                  onDragOver={handleDrag}
                  onDragLeave={handleDrag}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={`border-2 border-dashed rounded-2xl p-4 text-center cursor-pointer transition-all duration-200 flex flex-col items-center justify-center h-[90px] relative overflow-hidden ${
                    isDragActive
                      ? "border-indigo-500 bg-indigo-50/50 dark:bg-indigo-950/20"
                      : logoFile
                      ? "border-emerald-500 bg-emerald-50/20 dark:bg-emerald-950/10"
                      : "border-slate-200 dark:border-slate-800 hover:border-indigo-400 dark:hover:border-slate-700 bg-white dark:bg-slate-950"
                  }`}
                >
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept="image/*"
                    className="hidden"
                  />

                  {logoFile ? (
                    <div className="flex items-center gap-3">
                      {logoPreview && (
                        <img
                          src={logoPreview}
                          alt="Logo Preview"
                          className="w-10 h-10 object-cover rounded-xl border border-gray-100"
                        />
                      )}
                      <div className="text-left">
                        <p className="text-xs font-bold text-slate-700 dark:text-slate-200 line-clamp-1">{logoFile.name}</p>
                        <p className="text-[10px] text-emerald-500 font-bold flex items-center gap-1">
                          <FiCheck /> File selected
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center gap-3">
                      <FiUploadCloud size={20} className="text-slate-400 animate-pulse" />
                      <div className="text-left">
                        <p className="text-xs font-extrabold text-slate-600 dark:text-slate-300">Upload Company Logo</p>
                        <p className="text-[10px] font-medium text-slate-400">Drag file or click to browse</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Error display */}
            {error && (
              <div className="flex items-start gap-2.5 p-3.5 bg-rose-50 dark:bg-rose-950/20 text-rose-600 dark:text-rose-400 rounded-2xl text-xs font-semibold border border-rose-100 dark:border-rose-900/30">
                <FiAlertCircle size={15} className="shrink-0 mt-0.5" />
                <div className="text-left w-full overflow-hidden">
                  <p className="font-bold">{typeof error === "string" ? error : "Please correct the errors below:"}</p>
                  <pre className="text-[10px] font-mono mt-1.5 whitespace-pre-wrap bg-white/50 dark:bg-black/20 p-2 rounded-lg max-h-[150px] overflow-y-auto">{JSON.stringify(error, null, 2)}</pre>
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="pt-4 border-t border-gray-100 dark:border-slate-800 flex justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                disabled={submitting}
                className="px-5 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-800 text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-900 font-bold text-sm transition-all focus:outline-none"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="relative overflow-hidden px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-blue-600 text-white font-bold text-sm rounded-2xl hover:shadow-lg hover:shadow-indigo-500/20 active:scale-95 transition-all duration-200 focus:outline-none disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center min-w-[100px]"
              >
                {submitting ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  "Create Listing"
                )}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default CreateInternshipModal;
