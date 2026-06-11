import React, { useState, useContext } from "react";
import { ResourceContext } from "../../../context/resourceContext";
import { motion } from "framer-motion";
import toast, { Toaster } from "react-hot-toast";
import {
  FiX,
  FiUploadCloud,
  FiLink,
  FiBookOpen,
  FiHash,
  FiUser,
  FiTag,
  FiCompass,
  FiBriefcase,
  FiAward,
  FiPlus
} from "react-icons/fi";

const CAMPUSPULL_LOGO = "/assets/images/campuspullLogo.jpeg";

const UploadModal = ({ isOpen, onClose, canUploadNotes, canUploadAll }) => {
  const { uploadNotes, uploadRoadmap, uploadPYQ, user, refreshResources } = useContext(ResourceContext);

  const [type, setType] = useState("notes");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Notes Form State
  const [subjectName, setSubjectName] = useState("");
  const [subjectCode, setSubjectCode] = useState("");
  const [noteDescription, setNoteDescription] = useState("");
  const [noteYear, setNoteYear] = useState("1"); // Sends "1" | "2" | "3" | "4"
  const [noteFileType, setNoteFileType] = useState("file"); // "file" or "url"
  const [noteFile, setNoteFile] = useState(null);
  const [link, setLink] = useState("");
  const [thumbnail, setThumbnail] = useState(null);

  // Roadmap & PYQ Common Form State
  const [commonData, setCommonData] = useState({ title: "", description: "", tags: "", thumbnail: null });
  // PYQ Specific Form State
  const [pyqData, setPyqData] = useState({ company: "", year: "", difficulty: "Easy", link: "" });
  // Roadmap Specific Form State
  const [modules, setModules] = useState([{ moduleTitle: "", moduleDescription: "", resources: [{ title: "", link: "" }] }]);

  const [isDragging, setIsDragging] = useState(false);

  if (!isOpen) return null;

  const resetForms = () => {
    setSubjectName("");
    setSubjectCode("");
    setNoteDescription("");
    setNoteYear("1");
    setNoteFile(null);
    setLink("");
    setNoteFileType("file");
    setThumbnail(null);

    setCommonData({ title: "", description: "", tags: "", thumbnail: null });
    setPyqData({ company: "", year: "", difficulty: "Easy", link: "" });
    setModules([{ moduleTitle: "", moduleDescription: "", resources: [{ title: "", link: "" }] }]);
    setType("notes");
  };

  // --- Notes Drag/Drop Handlers ---
  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const validateAndSetFile = (file) => {
    const allowedExtensions = ["pdf", "doc", "docx"];
    const fileExtension = file.name.split(".").pop().toLowerCase();
    if (!allowedExtensions.includes(fileExtension)) {
      setError("Invalid file type! Only .pdf, .doc, and .docx files are allowed.");
      setNoteFile(null);
      return false;
    }
    if (file.size > 20 * 1024 * 1024) {
      setError("File is too large! Maximum allowed size is 20MB.");
      setNoteFile(null);
      return false;
    }
    setError(null);
    setNoteFile(file);
    return true;
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndSetFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      validateAndSetFile(e.target.files[0]);
    }
  };

  const triggerFileSelect = () => {
    document.getElementById("note-file-input")?.click();
  };

  // --- Roadmap/PYQ Change Handlers ---
  const handleCommonChange = (e) => setCommonData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  const handleThumbnailSelect = (e) => setCommonData(prev => ({ ...prev, thumbnail: e.target.files[0] }));
  const handlePyqChange = (e) => setPyqData(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleModuleChange = (modIdx, e) => {
    const newModules = [...modules];
    newModules[modIdx][e.target.name] = e.target.value;
    setModules(newModules);
  };

  const handleResourceChange = (modIdx, resIdx, e) => {
    const newModules = [...modules];
    newModules[modIdx].resources[resIdx][e.target.name] = e.target.value;
    setModules(newModules);
  };

  const addModule = () => setModules([...modules, { moduleTitle: "", moduleDescription: "", resources: [{ title: "", link: "" }] }]);

  const removeModule = (modIdx) => {
    if (modules.length > 1) {
      setModules(modules.filter((_, idx) => idx !== modIdx));
    }
  };

  const addResource = (modIdx) => {
    const newModules = [...modules];
    newModules[modIdx].resources.push({ title: "", link: "" });
    setModules(newModules);
  };

  const removeResource = (modIdx, resIdx) => {
    const newModules = [...modules];
    if (newModules[modIdx].resources.length > 1) {
      newModules[modIdx].resources = newModules[modIdx].resources.filter((_, idx) => idx !== resIdx);
      setModules(newModules);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const payload = new FormData();

      if (type === "notes") {
        if (!subjectName.trim()) {
          throw new Error("Subject Name is required.");
        }
        if (noteFileType === "file" && !noteFile) {
          throw new Error("Please select a document file to upload!");
        }
        if (noteFileType === "url" && !link.trim()) {
          throw new Error("Please enter a drive link.");
        }

        payload.append("title", subjectName.trim());
        payload.append("subName", subjectName.trim());
        payload.append("subjectCode", subjectCode.trim());
        payload.append("branch", subjectCode.trim());
        payload.append("year", noteYear);

        if (noteDescription.trim()) {
          payload.append("description", noteDescription.trim());
        }

        if (noteFileType === "file") {
          payload.append("file", noteFile);
        } else {
          payload.append("link", link.trim());
        }

        if (thumbnail) {
          payload.append("thumbnail", thumbnail);
        }

        await uploadNotes(payload);
        toast.success("Notes uploaded successfully!");
        if (refreshResources) await refreshResources();

      } else if (type === "roadmap") {
        if (!commonData.title.trim()) {
          throw new Error("Please provide a roadmap title!");
        }
        payload.append("title", commonData.title);
        payload.append("description", commonData.description || "");
        payload.append("tags", commonData.tags || "");
        if (commonData.thumbnail) {
          payload.append("thumbnail", commonData.thumbnail);
        }
        payload.append("modules", JSON.stringify(modules));
        await uploadRoadmap(payload);

      } else if (type === "pyq") {
        if (!pyqData.company.trim()) {
          throw new Error("Please provide a company name!");
        }
        if (!pyqData.link.trim()) {
          throw new Error("Please provide a link to the PYQs!");
        }
        payload.append("description", commonData.description || "");
        payload.append("tags", commonData.tags || "");
        if (commonData.thumbnail) {
          payload.append("thumbnail", commonData.thumbnail);
        }
        payload.append("link", pyqData.link);
        payload.append("company", pyqData.company);
        payload.append("year", pyqData.year || "");
        payload.append("difficulty", pyqData.difficulty);
        await uploadPYQ(payload);
      }

      resetForms();
      onClose();
    } catch (err) {
      setError(err.response?.data?.error || err.message);
    } finally {
      setLoading(false);
    }
  };

  // Styling Utilities
  const inputClass = "block w-full pl-10 pr-4 py-2.5 bg-slate-50/50 hover:bg-slate-50/80 focus:bg-white border border-slate-200 rounded-xl text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all text-xs font-semibold shadow-sm";
  const textareaClass = "block w-full px-4 py-2.5 bg-slate-50/50 hover:bg-slate-50/80 focus:bg-white border border-slate-200 rounded-xl text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all text-xs font-semibold shadow-sm min-h-[80px]";
  const selectClass = "block w-full pl-10 pr-4 py-2.5 bg-slate-50/50 hover:bg-slate-50/80 focus:bg-white border border-slate-200 rounded-xl text-slate-700 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all text-xs font-semibold shadow-sm cursor-pointer";
  const fileInputClass = "block w-full px-4 py-2 bg-slate-50/50 hover:bg-slate-50/80 focus:bg-white border border-slate-200 text-slate-700 rounded-xl placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all text-xs font-semibold shadow-sm cursor-pointer";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
      <Toaster position="top-center" reverseOrder={false} />
      {/* Framer motion wrapper for entry */}
      <motion.div
        initial={{ opacity: 0, scale: 0.97, y: 8 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.97, y: 8 }}
        transition={{ duration: 0.25, ease: "easeOut" }}
        className={`relative w-full ${type === 'roadmap' ? 'max-w-lg' : 'max-w-md'} bg-white border border-slate-100 rounded-[2rem] overflow-hidden flex flex-col shadow-2xl max-h-[92vh] text-slate-800 transition-all duration-300`}
      >
        {/* Accent Top Bar */}
        <div className="h-1.5 bg-gradient-to-r from-indigo-500 via-purple-500 to-blue-500 shrink-0" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200/60 text-slate-400 hover:text-slate-600 focus:outline-none transition-all duration-200 hover:scale-105 active:scale-95 z-10 cursor-pointer"
        >
          <FiX size={14} />
        </button>

        {/* Header Section */}
        <div className="px-6 pt-6 pb-3 text-center shrink-0">
          <div className="mx-auto w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-500 border border-indigo-100/30 mb-3 shadow-sm">
            <FiUploadCloud size={22} className="animate-pulse" />
          </div>
          <h2 className="text-xl font-extrabold text-slate-800 tracking-tight leading-none mb-1.5 font-poppins">
            Upload Resource
          </h2>
          <p className="text-slate-400 text-[11px] md:text-xs max-w-[280px] mx-auto leading-normal font-semibold">
            {type === 'notes' && "Share notes, PDFs, PPTs, and study materials with the student community."}
            {type === 'roadmap' && "Design and publish learning roadmaps for various careers and topics."}
            {type === 'pyq' && "Upload Previous Year interview questions from top recruiting companies."}
          </p>
        </div>

        {/* Scrollable Form Container */}
        <form onSubmit={handleSubmit} className="flex-grow flex flex-col overflow-hidden">
          <div className="flex-grow overflow-y-auto px-6 pb-4 space-y-4 scrollbar-thin">

            {/* Resource Type Selector (Visible only if user has access to upload all types) */}
            {canUploadAll && (
              <div className="space-y-1 text-left">
                <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400">
                  Resource Type
                </label>
                <div className="relative flex p-0.5 bg-slate-100 rounded-xl border border-slate-200/60">
                  {/* Sliding highlighter background */}
                  <div className="absolute inset-y-0.5 rounded-lg bg-white shadow-sm transition-all duration-300 pointer-events-none"
                    style={{
                      width: 'calc(33.33% - 3px)',
                      left: type === 'notes' ? '2.5px' : type === 'roadmap' ? 'calc(33.33% + 1px)' : 'calc(66.66% + 0.5px)'
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setType("notes")}
                    className={`relative z-10 flex-1 py-2 text-[11px] font-bold rounded-lg transition-colors duration-300 flex items-center justify-center gap-1.5 focus:outline-none border-none bg-transparent cursor-pointer ${type === "notes" ? "text-indigo-600 font-extrabold" : "text-slate-400 hover:text-slate-600"
                      }`}
                  >
                    <FiBookOpen size={13} />
                    <span>Study Notes</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setType("roadmap")}
                    className={`relative z-10 flex-1 py-2 text-[11px] font-bold rounded-lg transition-colors duration-300 flex items-center justify-center gap-1.5 focus:outline-none border-none bg-transparent cursor-pointer ${type === "roadmap" ? "text-indigo-600 font-extrabold" : "text-slate-400 hover:text-slate-600"
                      }`}
                  >
                    <FiCompass size={13} />
                    <span>Roadmap</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setType("pyq")}
                    className={`relative z-10 flex-1 py-2 text-[11px] font-bold rounded-lg transition-colors duration-300 flex items-center justify-center gap-1.5 focus:outline-none border-none bg-transparent cursor-pointer ${type === "pyq" ? "text-indigo-600 font-extrabold" : "text-slate-400 hover:text-slate-600"
                      }`}
                  >
                    <FiBriefcase size={13} />
                    <span>PYQ</span>
                  </button>
                </div>
              </div>
            )}

            {/* Render Notes Form */}
            {type === "notes" && (
              <>
                {/* Subject Name Input */}
                <div className="space-y-1 text-left">
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
                      className={inputClass}
                    />
                  </div>
                </div>

                {/* Two column layout for Code and Teacher */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-left">
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
                        className={inputClass}
                      />
                    </div>
                  </div>

                  {/* Uploaded By Display Badge */}
                  <div className="space-y-1">
                    <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400">
                      UPLOADED BY
                    </label>
                    <div className="relative rounded-xl border border-slate-200 bg-slate-100/70 h-[38px] px-3.5 flex items-center text-slate-500 select-none gap-2">
                      <img
                        src={user?.avatar || CAMPUSPULL_LOGO}
                        alt={user?.name || "User"}
                        className="w-5 h-5 rounded-full border border-slate-200 object-cover"
                      />
                      <span className="text-xs font-bold truncate">
                        {user?.role === "admin"
                          ? "CampusPull"
                          : user?.role === "alumni"
                          ? `${user.name} (Alumni)`
                          : user?.name || ""}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Thumbnail field */}
                <div className="space-y-1 text-left">
                  <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400">
                    THUMBNAIL (OPTIONAL)
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setThumbnail(e.target.files[0] || null)}
                    className={fileInputClass}
                  />
                  {thumbnail && (
                    <div className="mt-1.5 border border-slate-100 rounded-xl p-2 w-fit bg-slate-50 flex items-center gap-3 relative group">
                      <img
                        src={URL.createObjectURL(thumbnail)}
                        alt="Notes thumbnail preview"
                        className="max-h-[80px] rounded-lg object-contain"
                      />
                      <button
                        type="button"
                        onClick={() => setThumbnail(null)}
                        className="absolute -top-1.5 -right-1.5 p-1 rounded-full bg-rose-500 hover:bg-rose-600 text-white shadow-sm hover:scale-105 active:scale-95 transition-all border-none cursor-pointer flex items-center justify-center"
                        title="Clear Thumbnail"
                      >
                        <FiX size={12} />
                      </button>
                    </div>
                  )}
                </div>

                {/* Segmented Toggle for Notes Type */}
                <div className="space-y-1 text-left">
                  <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400">
                    Upload Type
                  </label>
                  <div className="relative flex p-0.5 bg-slate-100 rounded-xl border border-slate-200/60">
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
                      className={`relative z-10 flex-1 py-2 text-[11px] font-bold rounded-lg transition-colors duration-300 flex items-center justify-center gap-1.5 focus:outline-none border-none bg-transparent cursor-pointer ${noteFileType === "file" ? "text-indigo-600 font-extrabold" : "text-slate-400 hover:text-slate-600"
                        }`}
                    >
                      <FiUploadCloud size={13} />
                      <span>Upload File</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setNoteFileType("url")}
                      className={`relative z-10 flex-1 py-2 text-[11px] font-bold rounded-lg transition-colors duration-300 flex items-center justify-center gap-1.5 focus:outline-none border-none bg-transparent cursor-pointer ${noteFileType === "url" ? "text-indigo-600 font-extrabold" : "text-slate-400 hover:text-slate-600"
                        }`}
                    >
                      <FiLink size={13} />
                      <span>Drive Link</span>
                    </button>
                  </div>
                </div>

                {/* Conditional Input UI for Notes */}
                <div className="min-h-[110px] flex flex-col justify-center">
                  {noteFileType === "file" ? (
                    <div
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={handleDrop}
                      onClick={triggerFileSelect}
                      className={`group border-2 border-dashed rounded-2xl p-4 text-center cursor-pointer transition-all duration-300 flex flex-col items-center justify-center gap-1.5 ${isDragging
                          ? "border-indigo-500 bg-indigo-50"
                          : noteFile
                            ? "border-emerald-500 bg-emerald-50/50"
                            : "border-slate-200 hover:border-indigo-400 bg-white"
                        }`}
                    >
                      <input
                        type="file"
                        id="note-file-input"
                        accept=".pdf,.doc,.docx"
                        onChange={handleFileChange}
                        className="hidden"
                      />

                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-300 ${noteFile
                          ? "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20"
                          : "bg-slate-50 text-slate-400 group-hover:scale-105 group-hover:bg-indigo-50 group-hover:text-indigo-500 border border-slate-200"
                        }`}>
                        <FiUploadCloud size={15} />
                      </div>

                      {noteFile ? (
                        <div className="space-y-0.5">
                          <p className="text-[11px] font-bold text-slate-700 truncate max-w-[280px]">
                            {noteFile.name}
                          </p>
                          <p className="text-[9px] text-emerald-600 font-bold flex items-center justify-center gap-1">
                            <span>✓ File Selected</span>
                            <span className="text-slate-400">({(noteFile.size / (1024 * 1024)).toFixed(2)} MB)</span>
                          </p>
                        </div>
                      ) : (
                        <div className="space-y-0.5">
                          <p className="text-[11px] font-bold text-slate-400 group-hover:text-indigo-500 transition-colors">
                            Drop your file here or <span className="underline">browse</span>
                          </p>
                          <p className="text-[9px] text-slate-400 font-semibold">
                            PDF, DOC, DOCX (Max 20MB)
                          </p>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="space-y-1 text-left">
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
                          className={inputClass}
                        />
                      </div>
                      <p className="text-[9px] text-slate-400 font-bold pl-1 mt-1">
                        Ensure link permission is set to "Anyone with the link".
                      </p>
                    </div>
                  )}
                </div>

                {/* Description Textarea */}
                <div className="space-y-1 text-left">
                  <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400">
                    Description
                  </label>
                  <textarea
                    value={noteDescription}
                    onChange={(e) => setNoteDescription(e.target.value)}
                    placeholder="Briefly describe what this resource covers..."
                    className={textareaClass}
                  />
                </div>

                {/* Year dropdown selector */}
                <div className="space-y-1 text-left">
                  <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400">
                    Year
                  </label>
                  <div className="relative rounded-xl shadow-sm">
                    <select
                      value={noteYear}
                      onChange={(e) => setNoteYear(e.target.value)}
                      className="block w-full px-4 py-2.5 bg-slate-50/50 hover:bg-slate-50/80 focus:bg-white border border-slate-200 rounded-xl text-slate-700 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all text-xs font-semibold shadow-sm cursor-pointer"
                    >
                      <option value="1">1st Year</option>
                      <option value="2">2nd Year</option>
                      <option value="3">3rd Year</option>
                      <option value="4">4th Year</option>
                    </select>
                  </div>
                </div>
              </>
            )}

            {/* Render Roadmap Form */}
            {type === "roadmap" && (
              <>
                {/* Roadmap Title */}
                <div className="space-y-1 text-left">
                  <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400">
                    Roadmap Title <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative rounded-xl shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <FiBookOpen size={14} />
                    </div>
                    <input
                      type="text"
                      name="title"
                      required
                      value={commonData.title}
                      onChange={handleCommonChange}
                      placeholder=""
                      className={inputClass}
                    />
                  </div>
                </div>

                {/* Description */}
                <div className="space-y-1 text-left">
                  <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400">
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={commonData.description}
                    onChange={handleCommonChange}
                    placeholder=""
                    className={textareaClass}
                  />
                </div>

                {/* Thumbnail File Selector */}
                <div className="space-y-1 text-left">
                  <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400">
                    Thumbnail Image
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleThumbnailSelect}
                    className={fileInputClass}
                  />
                </div>

                {/* Tags */}
                <div className="space-y-1 text-left">
                  <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400">
                    Tags (comma-separated)
                  </label>
                  <div className="relative rounded-xl shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <FiTag size={14} />
                    </div>
                    <input
                      type="text"
                      name="tags"
                      value={commonData.tags}
                      onChange={handleCommonChange}
                      placeholder=""
                      className={inputClass}
                    />
                  </div>
                </div>

                {/* Roadmap Modules List */}
                <div className="space-y-4 text-left">
                  <h3 className="text-xs font-black uppercase tracking-widest text-slate-500 flex items-center gap-1.5">
                    <FiCompass size={14} />
                    <span>Roadmap Modules</span>
                  </h3>
                  <div className="space-y-4 max-h-[220px] overflow-y-auto pr-1.5 scrollbar-thin">
                    {modules.map((mod, modIdx) => (
                      <div key={modIdx} className="p-4 border border-slate-200 bg-slate-50/50 rounded-2xl space-y-3 relative">
                        {modules.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeModule(modIdx)}
                            className="absolute top-4 right-4 p-1.5 rounded-lg hover:bg-rose-50 text-slate-400 hover:text-rose-500 transition-all border-none bg-transparent cursor-pointer"
                            title="Remove Module"
                          >
                            <FiX size={14} />
                          </button>
                        )}
                        <div className="space-y-1 pr-6">
                          <label className="block text-[9px] font-black uppercase tracking-wider text-slate-400">
                            Module {modIdx + 1} Title <span className="text-rose-500">*</span>
                          </label>
                          <input
                            type="text"
                            placeholder=""
                            name="moduleTitle"
                            value={mod.moduleTitle}
                            onChange={(e) => handleModuleChange(modIdx, e)}
                            className="w-full bg-white border border-slate-200 text-slate-700 rounded-xl px-3 py-2 font-semibold text-xs focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 shadow-sm"
                            required
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="block text-[9px] font-black uppercase tracking-wider text-slate-400">
                            Module {modIdx + 1} Description
                          </label>
                          <textarea
                            placeholder=""
                            name="moduleDescription"
                            value={mod.moduleDescription}
                            onChange={(e) => handleModuleChange(modIdx, e)}
                            className="w-full bg-white border border-slate-200 text-slate-700 rounded-xl px-3 py-2 text-[11px] font-semibold focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 shadow-sm min-h-[60px]"
                          />
                        </div>

                        <div className="space-y-2 pl-4 border-l-2 border-dashed border-slate-200">
                          <h4 className="text-[10px] font-black uppercase tracking-wider text-slate-400">Lessons / Resources</h4>
                          {mod.resources.map((res, resIdx) => (
                            <div key={resIdx} className="flex gap-2 items-center">
                              <input
                                type="text"
                                placeholder=""
                                name="title"
                                value={res.title}
                                onChange={(e) => handleResourceChange(modIdx, resIdx, e)}
                                className="w-1/2 bg-white border border-slate-200 text-slate-700 rounded-xl px-3 py-2 text-[11px] font-semibold focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 shadow-sm"
                                required
                              />
                              <input
                                type="url"
                                placeholder=""
                                name="link"
                                value={res.link}
                                onChange={(e) => handleResourceChange(modIdx, resIdx, e)}
                                className="flex-1 bg-white border border-slate-200 text-slate-700 rounded-xl px-3 py-2 text-[11px] font-semibold focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 shadow-sm"
                                required
                              />
                              {mod.resources.length > 1 && (
                                <button
                                  type="button"
                                  onClick={() => removeResource(modIdx, resIdx)}
                                  className="p-1.5 rounded-lg hover:bg-rose-50 text-slate-400 hover:text-rose-500 transition-all border-none bg-transparent cursor-pointer"
                                  title="Remove Lesson"
                                >
                                  <FiX size={12} />
                                </button>
                              )}
                            </div>
                          ))}
                          <button
                            type="button"
                            onClick={() => addResource(modIdx)}
                            className="mt-1 bg-white hover:bg-indigo-50/50 text-indigo-600 border border-slate-200 hover:border-indigo-200 font-bold text-[10px] py-1.5 px-3 rounded-lg flex items-center gap-1.5 cursor-pointer transition-all shadow-sm"
                          >
                            <FiPlus size={14} />
                            <span>Add Lesson</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                  <button
                    type="button"
                    onClick={addModule}
                    className="w-full bg-slate-50 hover:bg-indigo-50/30 text-indigo-600 border border-indigo-200/50 font-bold text-[11px] py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 cursor-pointer transition-all shadow-sm"
                  >
                    <FiPlus size={16} />
                    <span>Add Module</span>
                  </button>
                </div>
              </>
            )}

            {/* Render PYQ Form */}
            {type === "pyq" && (
              <>
                {/* Company Name */}
                <div className="space-y-1 text-left">
                  <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400">
                    Company <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative rounded-xl shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <FiBriefcase size={14} />
                    </div>
                    <input
                      type="text"
                      name="company"
                      required
                      value={pyqData.company}
                      onChange={handlePyqChange}
                      placeholder=""
                      className={inputClass}
                    />
                  </div>
                </div>

                {/* Link */}
                <div className="space-y-1 text-left">
                  <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400">
                    GDrive / Document Link <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative rounded-xl shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <FiLink size={14} />
                    </div>
                    <input
                      type="url"
                      name="link"
                      required
                      value={pyqData.link}
                      onChange={handlePyqChange}
                      placeholder=""
                      className={inputClass}
                    />
                  </div>
                </div>

                {/* Two column layout for Year and Difficulty */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-left">
                  {/* Year */}
                  <div className="space-y-1">
                    <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400">
                      Year
                    </label>
                    <div className="relative rounded-xl shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                        <FiHash size={14} />
                      </div>
                      <input
                        type="number"
                        name="year"
                        value={pyqData.year}
                        onChange={handlePyqChange}
                        placeholder=""
                        className={inputClass}
                      />
                    </div>
                  </div>

                  {/* Difficulty */}
                  <div className="space-y-1">
                    <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400">
                      Difficulty
                    </label>
                    <div className="relative rounded-xl shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                        <FiAward size={14} />
                      </div>
                      <select
                        name="difficulty"
                        value={pyqData.difficulty}
                        onChange={handlePyqChange}
                        className={selectClass}
                      >
                        <option value="Easy">Easy</option>
                        <option value="Medium">Medium</option>
                        <option value="Hard">Hard</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div className="space-y-1 text-left">
                  <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400">
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={commonData.description}
                    onChange={handleCommonChange}
                    placeholder=""
                    className={textareaClass}
                  />
                </div>

                {/* Thumbnail File Selector */}
                <div className="space-y-1 text-left">
                  <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400">
                    Thumbnail Image
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleThumbnailSelect}
                    className={fileInputClass}
                  />
                </div>

                {/* Tags */}
                <div className="space-y-1 text-left">
                  <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400">
                    Tags (comma-separated)
                  </label>
                  <div className="relative rounded-xl shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <FiTag size={14} />
                    </div>
                    <input
                      type="text"
                      name="tags"
                      value={commonData.tags}
                      onChange={handleCommonChange}
                      placeholder=""
                      className={inputClass}
                    />
                  </div>
                </div>
              </>
            )}

          </div>

          {/* Sticky Bottom Actions */}
          <div className="px-6 pb-6 pt-3 bg-white border-t border-slate-100 shrink-0 space-y-3">
            {error && (
              <motion.p
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-rose-600 text-[10px] font-bold text-center bg-rose-50 border border-rose-200 rounded-xl py-2 px-3 animate-pulse"
              >
                {error}
              </motion.p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-6 text-[10px] font-bold uppercase tracking-wider text-white bg-gradient-to-r from-indigo-600 to-blue-600 rounded-xl shadow-md hover:shadow-lg shadow-indigo-500/10 hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center gap-1.5 focus:outline-none border-none cursor-pointer"
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