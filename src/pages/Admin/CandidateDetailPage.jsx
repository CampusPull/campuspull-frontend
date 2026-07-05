import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { getApplicationById, updateApplicationStatus, updateApplicationNotes } from "../../services/applicationService";
import { FiArrowLeft, FiUser, FiMail, FiPhone, FiBookOpen, FiFileText, FiLink, FiAlertCircle, FiLoader, FiMessageSquare } from "react-icons/fi";
import { toast } from "react-toastify";

export default function CandidateDetailPage() {
  const { applicationId } = useParams();
  const navigate = useNavigate();

  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Form states for edits
  const [status, setStatus] = useState("APPLIED");
  const [updatingStatus, setUpdatingStatus] = useState(false);

  const [adminNotes, setAdminNotes] = useState("");
  const [savingNotes, setSavingNotes] = useState(false);

  const fetchApplicationDetails = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getApplicationById(applicationId);
      // Week 2: response key is "application" not "data"
      const data = res?.application || res?.data || res;
      setApplication(data);
      setStatus(data.status || "APPLIED");
      setAdminNotes(data.adminNotes || "");
    } catch (err) {
      console.error("Failed to fetch candidate details:", err);
      setError(err.response?.data?.message || err.message || "Failed to load candidate details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (applicationId) {
      fetchApplicationDetails();
    }
  }, [applicationId]);

  const handleStatusUpdate = async () => {
    setUpdatingStatus(true);
    try {
      await updateApplicationStatus(applicationId, status);
      toast.success("Application status updated successfully!");
      setApplication(prev => prev ? { ...prev, status } : null);
    } catch (err) {
      const errMsg = err.response?.data?.message || err.message || "Failed to update status";
      toast.error(errMsg);
    } finally {
      setUpdatingStatus(false);
    }
  };

  const handleNotesSave = async () => {
    setSavingNotes(true);
    try {
      await updateApplicationNotes(applicationId, adminNotes);
      toast.success("Admin notes saved successfully!");
      setApplication(prev => prev ? { ...prev, adminNotes } : null);
    } catch (err) {
      const errMsg = err.response?.data?.message || err.message || "Failed to save notes";
      toast.error(errMsg);
    } finally {
      setSavingNotes(false);
    }
  };

  const formatAppliedDate = (dateString) => {
    if (!dateString) return "—";
    const d = new Date(dateString);
    if (isNaN(d)) return "—";
    const day = d.getDate();
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const month = months[d.getMonth()];
    const year = d.getFullYear();
    return `${day} ${month} ${year}`;
  };

  if (loading) {
    return (
      <div className="p-6 pt-28 md:pt-32 bg-gray-50 min-h-screen flex flex-col items-center justify-center">
        <FiLoader className="animate-spin text-indigo-500 mb-3" size={32} />
        <p className="text-gray-500 font-medium">Loading candidate details...</p>
      </div>
    );
  }

  if (error || !application) {
    return (
      <div className="p-6 pt-28 md:pt-32 bg-gray-50 min-h-screen flex flex-col items-center justify-center space-y-4">
        <div className="w-14 h-14 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center mx-auto border border-red-100 shadow-sm">
          <FiAlertCircle size={24} />
        </div>
        <p className="text-gray-700 font-semibold">{error || "Application not found"}</p>
        <button
          onClick={fetchApplicationDetails}
          className="px-5 py-2 bg-indigo-600 text-white font-bold text-xs rounded-xl hover:bg-indigo-700 transition"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 pt-28 md:pt-32 bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Back Link */}
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-1 text-xs font-bold text-indigo-600 hover:text-indigo-800 transition bg-transparent border-none cursor-pointer"
        >
          <FiArrowLeft size={14} /> Back to Application List
        </button>

        {/* Candidate Title info */}
        <div className="bg-white rounded-3xl border border-gray-100 shadow-xl p-6 md:p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-indigo-50 border border-indigo-100 rounded-2xl flex items-center justify-center text-indigo-600 shrink-0">
              <FiUser size={26} />
            </div>
            <div>
              <h1 className="text-2xl font-extrabold text-gray-900 leading-tight">
                {application.fullName}
              </h1>
              <p className="text-gray-500 text-sm font-semibold mt-0.5">
                Applied on {formatAppliedDate(application.createdAt)}
              </p>
            </div>
          </div>

          <div className="shrink-0 flex items-center gap-2">
            <span className="text-xs text-gray-400 font-bold uppercase tracking-wider">Current Status:</span>
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-black border ${
              application.status === "SELECTED" ? "bg-green-100 text-green-800 border-green-200" :
              application.status === "REJECTED" ? "bg-red-100 text-red-800 border-red-200" :
              application.status === "UNDER_REVIEW" ? "bg-blue-100 text-blue-800 border-blue-200" :
              application.status === "SHORTLISTED" ? "bg-amber-100 text-amber-800 border-amber-200" :
              application.status === "SENT_TO_COMPANY" ? "bg-purple-100 text-purple-800 border-purple-200" :
              "bg-gray-100 text-gray-800 border-gray-200"
            }`}>
              {(application.status || "APPLIED").replace("_", " ")}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Main Info Columns */}
          <div className="md:col-span-2 space-y-6">
            {/* Candidate Details card */}
            <div className="bg-white rounded-3xl border border-gray-100 shadow-xl p-6 space-y-4">
              <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest border-b border-gray-100 pb-2">
                Candidate Profile
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wide block">Email Address</span>
                  <span className="font-semibold text-gray-800 break-all">{application.email}</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wide block">Phone</span>
                  <span className="font-semibold text-gray-800">{application.phone}</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wide block">College</span>
                  <span className="font-semibold text-gray-800">{application.college}</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wide block">Branch &amp; Year</span>
                  <span className="font-semibold text-gray-800">{application.branch} · Year {application.year}</span>
                </div>
              </div>

              {/* Links */}
              {(application.linkedin || application.github || application.portfolio) && (
                <div className="pt-4 border-t border-gray-100 space-y-3">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wide block">Social Profiles</span>
                  <div className="flex flex-wrap gap-2">
                    {application.linkedin && (
                      <a
                        href={application.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1.5 bg-blue-50 border border-blue-100 text-blue-700 hover:bg-blue-100 rounded-xl text-xs font-bold transition flex items-center gap-1"
                      >
                        <FiLink size={12} /> LinkedIn
                      </a>
                    )}
                    {application.github && (
                      <a
                        href={application.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1.5 bg-slate-100 border border-slate-200 text-slate-700 hover:bg-slate-200 rounded-xl text-xs font-bold transition flex items-center gap-1"
                      >
                        <FiLink size={12} /> GitHub
                      </a>
                    )}
                    {application.portfolio && (
                      <a
                        href={application.portfolio}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1.5 bg-indigo-50 border border-indigo-100 text-indigo-700 hover:bg-indigo-100 rounded-xl text-xs font-bold transition flex items-center gap-1"
                      >
                        <FiLink size={12} /> Portfolio
                      </a>
                    )}
                  </div>
                </div>
              )}

              {/* Resume button */}
              {application.resumeUrl && (
                <div className="pt-4 border-t border-gray-100">
                  <button
                    onClick={() => window.open(application.resumeUrl, "_blank")}
                    className="w-full sm:w-auto px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-blue-600 hover:shadow-lg text-white font-bold text-xs rounded-xl transition flex items-center justify-center gap-2"
                  >
                    <FiFileText size={14} />
                    View Resume / PDF
                  </button>
                </div>
              )}
            </div>

            {/* Additional responses card */}
            {application.additionalResponses && application.additionalResponses.length > 0 && (
              <div className="bg-white rounded-3xl border border-gray-100 shadow-xl p-6 space-y-4">
                <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest border-b border-gray-100 pb-2">
                  Additional Responses
                </h3>
                <div className="space-y-4 divide-y divide-gray-50">
                  {application.additionalResponses.map((resp, i) => (
                    <div key={i} className={`pt-3 ${i === 0 ? "pt-0" : ""}`}>
                      <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">
                        {resp.question}
                      </p>
                      <p className="text-sm text-gray-800 font-semibold leading-relaxed whitespace-pre-line">
                        {resp.answer || "—"}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Status Update / Notes Sidebar */}
          <div className="space-y-6">
            {/* Status Update card */}
            <div className="bg-white rounded-3xl border border-gray-100 shadow-xl p-6 space-y-4">
              <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest border-b border-gray-100 pb-2 flex items-center gap-1.5">
                <span>⚡</span> Update Status
              </h3>
              <div className="space-y-3">
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:bg-white transition cursor-pointer"
                >
                  <option value="APPLIED">Applied</option>
                  <option value="UNDER_REVIEW">Under Review</option>
                  <option value="SHORTLISTED">Shortlisted</option>
                  <option value="SENT_TO_COMPANY">Sent to Company</option>
                  <option value="SELECTED">Selected</option>
                  <option value="REJECTED">Rejected</option>
                </select>
                <button
                  onClick={handleStatusUpdate}
                  disabled={updatingStatus}
                  className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow transition"
                >
                  {updatingStatus ? "Updating..." : "Update Status"}
                </button>
              </div>
            </div>

            {/* Admin Notes card */}
            <div className="bg-white rounded-3xl border border-gray-100 shadow-xl p-6 space-y-4">
              <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest border-b border-gray-100 pb-2 flex items-center gap-1.5">
                <FiMessageSquare size={14} className="text-slate-400" />
                <span>Admin Notes</span>
              </h3>
              <div className="space-y-3">
                <textarea
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  rows={5}
                  placeholder="Type candidate evaluation details, notes, or tags here..."
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-300 transition resize-none"
                />
                <button
                  onClick={handleNotesSave}
                  disabled={savingNotes}
                  className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow transition"
                >
                  {savingNotes ? "Saving..." : "Save Notes"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
