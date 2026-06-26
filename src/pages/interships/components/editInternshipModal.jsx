import { useState, useRef, useEffect } from "react";
import { useInternships } from "../../../context/internshipContext";
import { useAuth } from "../../../context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import { FiX, FiUploadCloud, FiCheck, FiBriefcase, FiAlertCircle, FiPlus, FiTrash2 } from "react-icons/fi";

const EditInternshipModal = ({ isOpen, onClose, internship, onSuccess }) => {
  const { user } = useAuth();
  const { updateInternship } = useInternships();
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
    status: "open",
    type: "remote",
    applicationDeadline: "",
    openings: 1,
    hiringStatus: "OPEN",
    applicationForm: [],
  });

  const handleAddQuestion = () => {
    setForm((prev) => ({
      ...prev,
      applicationForm: [
        ...prev.applicationForm,
        { label: "", type: "text", required: false },
      ],
    }));
  };

  const handleQuestionChange = (index, field, value) => {
    setForm((prev) => {
      const updatedForm = [...prev.applicationForm];
      updatedForm[index] = { ...updatedForm[index], [field]: value };
      return { ...prev, applicationForm: updatedForm };
    });
  };

  const handleRemoveQuestion = (index) => {
    setForm((prev) => ({
      ...prev,
      applicationForm: prev.applicationForm.filter((_, i) => i !== index),
    }));
  };

  const [logoFile, setLogoFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState("");
  const [isDragActive, setIsDragActive] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (internship && isOpen) {
      const formatDateForInput = (dateString) => {
        if (!dateString) return "";
        try {
          const d = new Date(dateString);
          if (isNaN(d.getTime())) return "";
          const offset = d.getTimezoneOffset();
          const localDate = new Date(d.getTime() - (offset * 60 * 1000));
          return localDate.toISOString().slice(0, 16);
        } catch (e) {
          return "";
        }
      };

      setForm({
        title: internship.title || "",
        description: internship.description || "",
        stipend: internship.stipend !== undefined ? String(internship.stipend) : "",
        durationValue: internship.durationValue !== undefined ? String(internship.durationValue) : "",
        durationUnit: internship.durationUnit || "month",
        location: internship.location || "",
        eligibility: internship.eligibility || "",
        skills: Array.isArray(internship.skills) ? internship.skills.join(", ") : internship.skills || "",
        applyLink: internship.applyLink || "",
        companyName: internship.companyName || "",
        companyWebsite: internship.companyWebsite || "",
        status: internship.status || "open",
        type: internship.type || "remote",
        applicationDeadline: formatDateForInput(internship.applicationDeadline),
        openings: internship.openings !== undefined ? internship.openings : 1,
        hiringStatus: internship.hiringStatus || "OPEN",
        applicationForm: Array.isArray(internship.applicationForm) ? internship.applicationForm : [],
      });
      setLogoPreview(internship.companyLogo || "");
      setLogoFile(null);
      setError(null);
    }
  }, [internship, isOpen]);

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
      alert("You must be logged in as admin to update an internship!");
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
    formData.append("status", form.status);
    formData.append("type", form.type);

    // Application settings fields
    if (form.applicationDeadline) {
      formData.append("applicationDeadline", form.applicationDeadline);
    } else {
      formData.append("applicationDeadline", "");
    }
    formData.append("openings", Number(form.openings) || 1);
    formData.append("hiringStatus", form.hiringStatus);
    formData.append("applicationForm", JSON.stringify(form.applicationForm));

    if (logoFile) {
      formData.append("companyLogo", logoFile);
    }

    try {
      const updated = await updateInternship(internship._id, formData);
      onSuccess?.(updated);
      onClose();
    } catch (err) {
      console.error("Update internship failed:", err);
      setError(
        err.response?.data?.errors || 
        err.response?.data?.message || 
        err.response?.data || 
        "Update internship failed. Please try again."
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
                <h2 className="text-xl font-extrabold text-slate-800 dark:text-white leading-tight">Edit Internship</h2>
                <p className="text-xs font-medium text-slate-400 mt-0.5">Modify internship listing details</p>
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

            {/* Company Name, Status, and Logo */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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

              {/* Status */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Listing Status</label>
                <select
                  name="status"
                  value={form.status}
                  onChange={handleChange}
                  className="w-full border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 p-3 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-semibold text-slate-700 dark:text-slate-200"
                >
                  <option value="open">Open</option>
                  <option value="closed">Closed</option>
                </select>
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
                      : logoPreview
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

                  {logoPreview ? (
                    <div className="flex items-center gap-3">
                      <img
                        src={logoPreview}
                        alt="Logo Preview"
                        className="w-10 h-10 object-cover rounded-xl border border-gray-100"
                      />
                      <div className="text-left">
                        <p className="text-xs font-bold text-slate-700 dark:text-slate-200 line-clamp-1">
                          {logoFile ? logoFile.name : "Current Logo"}
                        </p>
                        <p className="text-[10px] text-emerald-500 font-bold flex items-center gap-1">
                          <FiCheck /> {logoFile ? "File selected" : "Logo active"}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center gap-3">
                      <FiUploadCloud size={20} className="text-slate-400" />
                      <div className="text-left">
                        <p className="text-xs font-extrabold text-slate-600 dark:text-slate-300">Upload Logo</p>
                        <p className="text-[10px] font-medium text-slate-400">Drag or click</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* ── Application Settings ── */}
            <div className="pt-4 border-t border-gray-100 dark:border-slate-800/60">
              <h3 className="text-sm font-bold text-indigo-600 dark:text-indigo-400 mb-4 flex items-center gap-2">
                <FiBriefcase size={16} />
                Application Settings
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Application Deadline */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Application Deadline</label>
                  <input
                    type="datetime-local"
                    name="applicationDeadline"
                    value={form.applicationDeadline}
                    onChange={handleChange}
                    className="w-full border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 p-3 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-medium text-slate-800 dark:text-white"
                  />
                </div>

                {/* Openings */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Openings</label>
                  <input
                    type="number"
                    name="openings"
                    min="1"
                    placeholder="e.g. 5"
                    value={form.openings}
                    onChange={handleChange}
                    className="w-full border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 p-3 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-medium text-slate-800 dark:text-white"
                    required
                  />
                </div>

                {/* Hiring Status */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Hiring Status</label>
                  <select
                    name="hiringStatus"
                    value={form.hiringStatus}
                    onChange={handleChange}
                    className="w-full border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 p-3 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-semibold text-slate-700 dark:text-slate-200"
                  >
                    <option value="OPEN">OPEN</option>
                    <option value="CLOSED">CLOSED</option>
                  </select>
                </div>
              </div>
            </div>

            {/* ── Custom Questions Form Builder ── */}
            <div className="pt-4 border-t border-gray-100 dark:border-slate-800/60">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-sm font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-2">
                  <FiPlus size={16} />
                  Custom Application Questions
                </h3>
                <button
                  type="button"
                  onClick={handleAddQuestion}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/40 dark:hover:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 font-bold text-xs rounded-xl transition-all"
                >
                  <FiPlus size={14} /> Add Question
                </button>
              </div>

              {form.applicationForm.length === 0 ? (
                <p className="text-xs text-slate-400 dark:text-slate-500 italic p-4 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-100 dark:border-slate-900 text-center">
                  No custom questions added yet. Candidates will submit standard profile information (Resume, Email, Phone, College, etc.)
                </p>
              ) : (
                <div className="space-y-3">
                  {form.applicationForm.map((question, index) => (
                    <div
                      key={index}
                      className="flex flex-col md:flex-row items-stretch md:items-center gap-3 p-4 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-100 dark:border-slate-900 relative animate-fadeIn"
                    >
                      {/* Label Input */}
                      <div className="flex-1">
                        <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Question Label</label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. What is your CGPA? / Share your portfolio link"
                          value={question.label}
                          onChange={(e) => handleQuestionChange(index, "label", e.target.value)}
                          className="w-full border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-2 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500 font-medium text-slate-800 dark:text-white"
                        />
                      </div>

                      {/* Type Selector */}
                      <div className="w-full md:w-[130px]">
                        <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Input Type</label>
                        <select
                          value={question.type}
                          onChange={(e) => handleQuestionChange(index, "type", e.target.value)}
                          className="w-full border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-2 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500 font-semibold text-slate-700 dark:text-slate-200"
                        >
                          <option value="text">Short Answer</option>
                          <option value="textarea">Paragraph</option>
                          <option value="number">Number</option>
                        </select>
                      </div>

                      {/* Required Checkbox */}
                      <div className="flex items-center gap-2 self-start md:self-auto mt-2 md:mt-5">
                        <input
                          type="checkbox"
                          id={`required-${index}`}
                          checked={question.required}
                          onChange={(e) => handleQuestionChange(index, "required", e.target.checked)}
                          className="w-4 h-4 rounded text-indigo-600 border-slate-200 dark:border-slate-800 focus:ring-indigo-500"
                        />
                        <label htmlFor={`required-${index}`} className="text-xs font-bold text-slate-500 cursor-pointer">
                          Required
                        </label>
                      </div>

                      {/* Delete Button */}
                      <button
                        type="button"
                        onClick={() => handleRemoveQuestion(index)}
                        className="p-2 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/20 rounded-xl transition-all self-end md:self-auto mt-2 md:mt-5"
                        title="Remove question"
                      >
                        <FiTrash2 size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
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
                  "Save Changes"
                )}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default EditInternshipModal;
