import React, { useState, useContext } from "react";
import { ResourceContext } from "../../../context/resourceContext";
import { motion } from "framer-motion";
import { FiX, FiUploadCloud, FiLink, FiBookOpen, FiHash, FiUser } from "react-icons/fi";

const UploadModal = ({ isOpen, onClose }) => {
  const { uploadNotes } = useContext(ResourceContext);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Simplified Form Fields
  const [subjectName, setSubjectName] = useState("");
  const [subjectCode, setSubjectCode] = useState("");
  const [teacherName, setTeacherName] = useState("");
  const [noteFileType, setNoteFileType] = useState("file"); // "file" or "url"
  const [noteFile, setNoteFile] = useState(null);
  const [link, setLink] = useState("");

  const [isDragging, setIsDragging] = useState(false);

  if (!isOpen) return null;

  const resetForms = () => {
    setSubjectName("");
    setSubjectCode("");
    setTeacherName("");
    setNoteFile(null);
    setLink("");
    setNoteFileType("file");
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.size > 20 * 1024 * 1024) {
        setError("File is too large! Maximum allowed size is 20MB.");
        setNoteFile(null);
        return;
      }
      setError(null);
      setNoteFile(file);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size > 20 * 1024 * 1024) {
        setError("File is too large! Maximum allowed size is 20MB.");
        setNoteFile(null);
        return;
      }
      setError(null);
      setNoteFile(file);
    }
  };

  const triggerFileSelect = () => {
    document.getElementById("note-file-input")?.click();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const payload = new FormData();
      payload.append("title", subjectName);
      
      // If "Uploaded By" is filled, add it to description, otherwise keep it blank
      const desc = teacherName ? `Uploaded by: ${teacherName}` : "";
      payload.append("description", desc);
      payload.append("tags", ""); // Keep empty tags

      if (noteFileType === "file") {
        if (!noteFile) {
          throw new Error("Please select a document file to upload!");
        }
        if (noteFile.size > 20 * 1024 * 1024) {
          throw new Error("File is too large! Maximum allowed size is 20MB.");
        }
        payload.append("file", noteFile);
      } else {
        payload.append("link", link || "");
      }
      
      payload.append("branch", subjectCode);
      payload.append("semester", "1"); // Default semester 1 to satisfy backend validation
      
      await uploadNotes(payload);

      resetForms();
      onClose();
    } catch (err) {
      setError(err.response?.data?.error || err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-md p-4">
      {/* Framer motion wrapper for entry */}
      <motion.div
        initial={{ opacity: 0, scale: 0.97, y: 8 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.97, y: 8 }}
        transition={{ duration: 0.25, ease: "easeOut" }}
        className="relative w-full max-w-md bg-white border border-slate-100 rounded-[2rem] overflow-hidden flex flex-col shadow-[0_20px_50px_rgba(79,70,229,0.12)] max-h-[92vh]"
      >
        {/* Accent Top Bar */}
        <div className="h-1.5 bg-gradient-to-r from-indigo-500 via-purple-500 to-blue-500 shrink-0" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-100/80 text-slate-400 hover:text-indigo-600 focus:outline-none transition-all duration-200 hover:scale-105 active:scale-95 z-10"
        >
          <FiX size={14} />
        </button>

        {/* Header Section (Fixed at Top) */}
        <div className="px-6 pt-6 pb-3 text-center shrink-0">
          <div className="mx-auto w-12 h-12 bg-gradient-to-tr from-indigo-50 to-blue-50 rounded-xl flex items-center justify-center text-indigo-600 shadow-sm border border-indigo-100/30 mb-3 transition-transform hover:scale-105 duration-300">
            <FiUploadCloud size={22} className="animate-pulse" />
          </div>
          <h2 className="text-xl font-black text-slate-800 tracking-tight leading-none mb-1.5">
            Upload Resource
          </h2>
          <p className="text-slate-400 text-[11px] md:text-xs max-w-[280px] mx-auto leading-normal">
            Share notes, PDFs, PPTs, and study materials with the student community.
          </p>
        </div>

        {/* Scrollable Form Container */}
        <form onSubmit={handleSubmit} className="flex-grow flex flex-col overflow-hidden">
          <div className="flex-grow overflow-y-auto px-6 pb-4 space-y-4 scrollbar-thin">
            
            {/* Subject Name Input */}
            <div className="space-y-1">
              <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400">
                Subject Name <span className="text-rose-500">*</span>
              </label>
              <div className="relative rounded-xl shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <FiBookOpen size={14} />
                </div>
                <input
                  type="text"
                  required
                  value={subjectName}
                  onChange={(e) => setSubjectName(e.target.value)}
                  placeholder=""
                  className="block w-full pl-10 pr-4 py-2.5 bg-slate-50/50 hover:bg-slate-50/80 border border-slate-200/80 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 focus:bg-white transition-all text-xs font-semibold"
                />
              </div>
            </div>

            {/* Two column layout for Code and Teacher */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {/* Subject Code Input */}
              <div className="space-y-1">
                <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400">
                  Subject Code <span className="text-rose-500">*</span>
                </label>
                <div className="relative rounded-xl shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <FiHash size={14} />
                  </div>
                  <input
                    type="text"
                    required
                    value={subjectCode}
                    onChange={(e) => setSubjectCode(e.target.value)}
                    placeholder=""
                    className="block w-full pl-10 pr-4 py-2.5 bg-slate-50/50 hover:bg-slate-50/80 border border-slate-200/80 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 focus:bg-white transition-all text-xs font-semibold"
                  />
                </div>
              </div>

              {/* Uploaded By Input */}
              <div className="space-y-1">
                <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400">
                  Uploaded By (Teacher)
                </label>
                <div className="relative rounded-xl shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <FiUser size={14} />
                  </div>
                  <input
                    type="text"
                    value={teacherName}
                    onChange={(e) => setTeacherName(e.target.value)}
                    placeholder=""
                    className="block w-full pl-10 pr-4 py-2.5 bg-slate-50/50 hover:bg-slate-50/80 border border-slate-200/80 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 focus:bg-white transition-all text-xs font-semibold"
                  />
                </div>
              </div>
            </div>

            {/* Segmented Toggle */}
            <div className="space-y-1">
              <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400">
                Upload Type
              </label>
              <div className="relative flex p-0.5 bg-slate-100/80 backdrop-blur-sm rounded-xl border border-slate-200/20">
                {/* Sliding highlighter background */}
                <div className="absolute inset-y-0.5 rounded-lg bg-white shadow-sm transition-all duration-300 pointer-events-none"
                  style={{
                    width: 'calc(50% - 3px)',
                    left: noteFileType === 'file' ? '2.5px' : 'calc(50% + 0.5px)'
                  }}
                />
                <button
                  type="button"
                  onClick={() => setNoteFileType("file")}
                  className={`relative z-10 flex-1 py-2 text-[11px] font-bold rounded-lg transition-colors duration-300 flex items-center justify-center gap-1.5 focus:outline-none ${
                    noteFileType === "file" ? "text-indigo-600 font-extrabold" : "text-slate-500 hover:text-slate-800"
                  }`}
                >
                  <FiUploadCloud size={13} />
                  <span>Upload File</span>
                </button>
                <button
                  type="button"
                  onClick={() => setNoteFileType("url")}
                  className={`relative z-10 flex-1 py-2 text-[11px] font-bold rounded-lg transition-colors duration-300 flex items-center justify-center gap-1.5 focus:outline-none ${
                    noteFileType === "url" ? "text-indigo-600 font-extrabold" : "text-slate-500 hover:text-slate-800"
                  }`}
                >
                  <FiLink size={13} />
                  <span>Drive Link</span>
                </button>
              </div>
            </div>

            {/* Conditional Input UI */}
            <div className="min-h-[110px] flex flex-col justify-center">
              {noteFileType === "file" ? (
                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={triggerFileSelect}
                  className={`group border-2 border-dashed rounded-2xl p-4 text-center cursor-pointer transition-all duration-300 flex flex-col items-center justify-center gap-1.5 ${
                    isDragging
                      ? "border-indigo-500 bg-indigo-50/20 shadow-[0_0_15px_rgba(99,102,241,0.06)]"
                      : noteFile
                      ? "border-emerald-500 bg-emerald-50/5"
                      : "border-slate-200 hover:border-indigo-400 bg-slate-50/20 hover:bg-slate-50/40"
                  }`}
                >
                  <input
                    type="file"
                    id="note-file-input"
                    accept=".pdf,.docx,.pptx,.ppt,.doc,.zip,.rar"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-300 ${
                    noteFile 
                      ? "bg-emerald-50 text-emerald-600" 
                      : "bg-slate-100 text-slate-400 group-hover:scale-105 group-hover:bg-indigo-50 group-hover:text-indigo-600"
                  }`}>
                    <FiUploadCloud size={15} />
                  </div>
                  
                  {noteFile ? (
                    <div className="space-y-0.5">
                      <p className="text-[11px] font-bold text-slate-700 truncate max-w-[280px]">
                        {noteFile.name}
                      </p>
                      <p className="text-[9px] text-emerald-600 font-semibold flex items-center justify-center gap-1">
                        <span>✓ File Selected</span>
                        <span className="text-slate-400">({(noteFile.size / (1024 * 1024)).toFixed(2)} MB)</span>
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-0.5">
                      <p className="text-[11px] font-bold text-slate-500 group-hover:text-indigo-600 transition-colors">
                        Drop your file here or <span className="underline">browse</span>
                      </p>
                      <p className="text-[9px] text-slate-400 font-medium">
                        PDF, DOCX, PPTX, PPT (Max 20MB)
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-1">
                  <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400">
                    Drive / External Link <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative rounded-xl shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <FiLink size={14} />
                    </div>
                    <input
                      type="url"
                      required={noteFileType === "url"}
                      value={link}
                      onChange={(e) => setLink(e.target.value)}
                      placeholder=""
                      className="block w-full pl-10 pr-4 py-2.5 bg-slate-50/50 hover:bg-slate-50/80 border border-slate-200/80 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 focus:bg-white transition-all text-xs font-semibold"
                    />
                  </div>
                  <p className="text-[9px] text-slate-400 font-medium pl-1 mt-1">
                    Ensure link permission is set to "Anyone with the link".
                  </p>
                </div>
              )}
            </div>

          </div>

          {/* Sticky Bottom Actions */}
          <div className="px-6 pb-6 pt-3 bg-white border-t border-slate-100/85 shrink-0 space-y-3">
            {error && (
              <motion.p
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-rose-500 text-[10px] font-bold text-center bg-rose-50 border border-rose-100 rounded-xl py-2 px-3"
              >
                {error}
              </motion.p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-6 text-[10px] font-bold uppercase tracking-wider text-white bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 rounded-xl shadow-md hover:shadow-lg shadow-indigo-500/5 hover:shadow-indigo-500/15 hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center gap-1.5 focus:outline-none"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-3.5 w-3.5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  <span>Uploading Resource...</span>
                </>
              ) : (
                <>
                  <FiUploadCloud size={14} />
                  <span>Upload Resource</span>
                </>
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default UploadModal;