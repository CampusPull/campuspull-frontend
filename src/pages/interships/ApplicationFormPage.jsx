import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ProfileContext } from "../../context/profileContext";
import { getInternshipById } from "../../services/internshipService";
import { createApplication, getApplications } from "../../services/applicationService";
import { toast } from "react-toastify";
import api from "../../utils/api";
import { motion } from "framer-motion";
import {
  FiArrowLeft,
  FiUser,
  FiMail,
  FiPhone,
  FiBookOpen,
  FiUploadCloud,
  FiFileText,
  FiAlertCircle,
  FiCheckCircle,
  FiGlobe,
  FiLoader
} from "react-icons/fi";

// Input style shared across the form
const inputCls =
  "w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 outline-none text-sm transition shadow-sm";

const labelCls =
  "text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1.5";

const cardCls =
  "bg-white rounded-3xl border border-gray-100 shadow-xl p-6 md:p-8 space-y-6";

export default function ApplicationFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { profile } = useContext(ProfileContext);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    college: "",
    branch: "",
    year: "",
    linkedin: "",
    github: "",
    portfolio: "",
  });

  const [resumeUrl, setResumeUrl] = useState("");
  const [isReplacingResume, setIsReplacingResume] = useState(false);
  const [uploadingResume, setUploadingResume] = useState(false);

  const [internship, setInternship] = useState(null);
  const [loadingInternship, setLoadingInternship] = useState(true);
  const [additionalResponses, setAdditionalResponses] = useState({});

  const [alreadyApplied, setAlreadyApplied] = useState(false);
  const [loadingAppliedCheck, setLoadingAppliedCheck] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // 1. Sync Profile Data to form state
  useEffect(() => {
    if (profile) {
      setFormData({
        fullName: profile.name || "",
        email: profile.email || "",
        phone: profile.phone || "",
        college: profile.college || "",
        branch: profile.department || "",
        year: profile.year || "",
        linkedin: profile.linkedin || "",
        github: profile.github || "",
        portfolio: profile.portfolio || "",
      });

      if (profile.resumeUrl || profile.resume) {
        setResumeUrl(profile.resumeUrl || profile.resume);
      }
    }
  }, [profile]);

  // 2. Fetch Internship Dynamic Fields / Details
  useEffect(() => {
    const fetchDetails = async () => {
      setLoadingInternship(true);
      try {
        const res = await getInternshipById(id);
        const data = res.data || res;
        console.log("Fetched internship object:", data);

        let formFields = data.applicationForm;
        // Check if applicationForm is empty/null/undefined
        if (!formFields || !Array.isArray(formFields) || formFields.length === 0) {
          // TODO: remove mock
          const mockQuestions = [
            { label: "What is your CGPA?", type: "number", required: true },
            { label: "Share your best AI project", type: "textarea", required: true },
            { label: "LinkedIn Profile", type: "text", required: false }
          ];
          formFields = mockQuestions;
        }

        const updatedInternship = {
          ...data,
          applicationForm: formFields
        };
        setInternship(updatedInternship);

        const initialResponses = {};
        formFields.forEach((field) => {
          initialResponses[field.label] = "";
        });
        setAdditionalResponses(initialResponses);
      } catch (err) {
        console.warn("Failed to fetch internship, using mock fallback for dynamic fields:", err);
        // TODO: replace mock with real API call so it is easy to swap later
        const mockInternship = {
          _id: id,
          title: "Frontend Developer Internship",
          companyName: "CampusPull Tech",
          hiringStatus: "OPEN",
          applicationDeadline: null,
          applicationForm: [
            { label: "What is your CGPA?", type: "number", required: true },
            { label: "Share your best AI project", type: "textarea", required: true },
            { label: "LinkedIn Profile", type: "text", required: false }
          ]
        };
        console.log("Using mock internship object:", mockInternship);
        setInternship(mockInternship);

        const initialResponses = {};
        mockInternship.applicationForm.forEach((field) => {
          initialResponses[field.label] = "";
        });
        setAdditionalResponses(initialResponses);
      } finally {
        setLoadingInternship(false);
      }
    };

    if (id) {
      fetchDetails();
    }
  }, [id]);

  // 3. Check if user already applied
  useEffect(() => {
    const checkAlreadyApplied = async () => {
      setLoadingAppliedCheck(true);
      try {
        const apps = await getApplications();
        const list = apps.data || apps;
        if (Array.isArray(list)) {
          const hasApplied = list.some(
            (app) =>
              app.internshipId === id ||
              app.internship?._id === id
          );
          setAlreadyApplied(hasApplied);
        }
      } catch (err) {
        console.error("Failed to check existing application status:", err);
      } finally {
        setLoadingAppliedCheck(false);
      }
    };

    if (id) {
      checkAlreadyApplied();
    }
  }, [id]);

  // 4. Handle Inline Resume Upload
  const handleResumeFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.type !== "application/pdf") {
      toast.error("Only PDF files are allowed!");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size exceeds 5MB limit!");
      return;
    }

    setUploadingResume(true);
    try {
      const uploadFormData = new FormData();
      uploadFormData.append("resume", file);
      uploadFormData.append("file", file);

      const res = await api.post("/profile/upload-resume", uploadFormData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      const url = res.data.resumeUrl || res.data.url;
      setResumeUrl(url);
      setIsReplacingResume(false);
      toast.success("Resume uploaded successfully!");
    } catch (err) {
      console.error("Upload resume failed:", err);
      toast.error(err.response?.data?.message || err.message || "Failed to upload resume. Please try again.");
    } finally {
      setUploadingResume(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAdditionalChange = (label, value) => {
    setAdditionalResponses({ ...additionalResponses, [label]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validations: Profile Info
    if (
      !formData.fullName.trim() ||
      !formData.email.trim() ||
      !formData.phone.trim() ||
      !formData.college.trim() ||
      !formData.branch.trim() ||
      !formData.year
    ) {
      toast.error("Please fill in all required profile fields!");
      return;
    }

    // Validations: Resume PDF
    if (!resumeUrl) {
      toast.error("Resume upload is mandatory to submit!");
      return;
    }

    // Validations: Dynamic fields
    if (internship?.applicationForm && Array.isArray(internship.applicationForm)) {
      for (const field of internship.applicationForm) {
        if (field.required && !String(additionalResponses[field.label] || "").trim()) {
          toast.error(`Please answer the required question: "${field.label}"`);
          return;
        }
      }
    }

    // Validations: Hiring state check
    const isDeadlinePassed = internship?.applicationDeadline
      ? new Date(internship.applicationDeadline) < new Date()
      : false;
    if (internship?.hiringStatus === "CLOSED" || isDeadlinePassed) {
      toast.error("Applications for this internship are closed!");
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        internshipId: id,
        ...formData,
        resumeUrl,
        additionalResponses: Object.entries(additionalResponses).map(([question, answer]) => ({
          question,
          answer: String(answer),
        })),
      };

      await createApplication(payload);
      toast.success("Application submitted successfully!");
      navigate(`/internships/${id}/apply/success`);
    } catch (err) {
      const errMsg = err.response?.data?.message || err.message || "Failed to submit application";
      toast.error(errMsg);
    } finally {
      setSubmitting(false);
    }
  };

  if (loadingInternship || loadingAppliedCheck) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/40 flex flex-col items-center justify-center pt-16">
        <FiLoader className="animate-spin text-indigo-600 mb-3" size={36} />
        <p className="text-gray-500 font-semibold animate-pulse text-sm">
          Loading application form...
        </p>
      </div>
    );
  }

  // Check deadline active state
  const isDeadlinePassed = internship?.applicationDeadline
    ? new Date(internship.applicationDeadline) < new Date()
    : false;
  const isClosed = internship?.hiringStatus === "CLOSED" || isDeadlinePassed;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/40 pt-20 pb-32">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        {/* Back link */}
        <Link
          to={`/internships/${id}`}
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-indigo-600 hover:text-indigo-800 transition-colors mb-6 group"
        >
          <FiArrowLeft className="group-hover:-translate-x-0.5 transition-transform" size={14} />
          Back to Details
        </Link>

        {/* ── BANNERS ── */}
        {alreadyApplied ? (
          <div className="bg-amber-50 border-2 border-amber-200 rounded-3xl p-7 text-center shadow-lg space-y-4 mb-6">
            <div className="w-14 h-14 bg-amber-100 text-amber-600 rounded-2xl flex items-center justify-center mx-auto shadow-sm">
              <FiCheckCircle size={28} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                You have already applied!
              </h2>
              <p className="text-gray-500 text-sm mt-1">
                Your application for **{internship?.title}** at **{internship?.companyName}** is already under review.
              </p>
            </div>
            <div className="pt-2 flex justify-center gap-3">
              <Link
                to="/applications"
                className="px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-blue-600 text-white font-bold text-xs rounded-xl hover:shadow-lg transition-all"
              >
                Go to My Applications
              </Link>
            </div>
          </div>
        ) : isClosed ? (
          <div className="bg-red-50 border-2 border-red-200 rounded-3xl p-7 text-center shadow-lg space-y-4 mb-6">
            <div className="w-14 h-14 bg-red-100 text-red-600 rounded-2xl flex items-center justify-center mx-auto shadow-sm">
              <FiAlertCircle size={28} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                Applications Closed
              </h2>
              <p className="text-gray-500 text-sm mt-1">
                Applications for **{internship?.title}** at **{internship?.companyName}** are no longer being accepted.
              </p>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Header info */}
            <div className="bg-white rounded-3xl border border-gray-100 shadow-xl p-6 md:p-8 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 shrink-0">
                <FiFileText size={22} />
              </div>
              <div>
                <h1 className="text-xl md:text-2xl font-extrabold text-gray-900 leading-tight">
                  Apply for {internship?.title}
                </h1>
                <p className="text-gray-500 text-sm font-medium mt-0.5">
                  {internship?.companyName}
                </p>
              </div>
            </div>

            {/* 1. PROFILE INFORMATION */}
            <div className={cardCls}>
              <h3 className="text-base font-bold text-indigo-700 flex items-center gap-2 border-b border-gray-100 pb-3">
                <span className="p-1 bg-indigo-50 rounded-lg text-indigo-600">
                  <FiUser size={14} />
                </span>
                Profile Information
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={labelCls}>Full Name <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    name="fullName"
                    required
                    value={formData.fullName}
                    onChange={handleInputChange}
                    className={inputCls}
                  />
                </div>
                <div>
                  <label className={labelCls}>Email Address <span className="text-red-500">*</span></label>
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                    className={inputCls}
                  />
                </div>
                <div>
                  <label className={labelCls}>Phone Number <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    name="phone"
                    required
                    value={formData.phone}
                    onChange={handleInputChange}
                    className={inputCls}
                  />
                </div>
                <div>
                  <label className={labelCls}>College Name <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    name="college"
                    required
                    value={formData.college}
                    onChange={handleInputChange}
                    className={inputCls}
                  />
                </div>
                <div>
                  <label className={labelCls}>Branch / Department <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    name="branch"
                    required
                    value={formData.branch}
                    onChange={handleInputChange}
                    className={inputCls}
                  />
                </div>
                <div>
                  <label className={labelCls}>Current Year (1-4) <span className="text-red-500">*</span></label>
                  <input
                    type="number"
                    name="year"
                    required
                    min={1}
                    max={4}
                    value={formData.year}
                    onChange={handleInputChange}
                    className={inputCls}
                  />
                </div>
              </div>
            </div>

            {/* 2. PROFESSIONAL LINKS */}
            <div className={cardCls}>
              <h3 className="text-base font-bold text-indigo-700 flex items-center gap-2 border-b border-gray-100 pb-3">
                <span className="p-1 bg-indigo-50 rounded-lg text-indigo-600">
                  <FiGlobe size={14} />
                </span>
                Professional Links
              </h3>
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className={labelCls}>LinkedIn URL (Optional)</label>
                  <input
                    type="url"
                    name="linkedin"
                    placeholder="https://linkedin.com/in/username"
                    value={formData.linkedin}
                    onChange={handleInputChange}
                    className={inputCls}
                  />
                </div>
                <div>
                  <label className={labelCls}>GitHub Profile URL (Optional)</label>
                  <input
                    type="url"
                    name="github"
                    placeholder="https://github.com/username"
                    value={formData.github}
                    onChange={handleInputChange}
                    className={inputCls}
                  />
                </div>
                <div>
                  <label className={labelCls}>Portfolio Link (Optional)</label>
                  <input
                    type="url"
                    name="portfolio"
                    placeholder="https://myportfolio.com"
                    value={formData.portfolio}
                    onChange={handleInputChange}
                    className={inputCls}
                  />
                </div>
              </div>
            </div>

            {/* 3. RESUME SECTION */}
            <div className={cardCls}>
              <h3 className="text-base font-bold text-indigo-700 flex items-center gap-2 border-b border-gray-100 pb-3">
                <span className="p-1 bg-indigo-50 rounded-lg text-indigo-600">
                  <FiFileText size={14} />
                </span>
                Resume Section <span className="text-red-500">*</span>
              </h3>

              {resumeUrl && !isReplacingResume ? (
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 border border-indigo-100 bg-indigo-50/30 rounded-2xl">
                  <div className="flex items-center gap-2">
                    <FiFileText className="text-indigo-500 shrink-0" size={24} />
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-wide">Selected Resume</p>
                      <p className="text-sm font-semibold text-gray-800 truncate max-w-[200px] sm:max-w-md">
                        {decodeURIComponent(resumeUrl.split("/").pop() || "Uploaded Resume")}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 w-full sm:w-auto shrink-0">
                    <button
                      type="button"
                      onClick={() => window.open(resumeUrl, "_blank")}
                      className="flex-1 sm:flex-initial px-4 py-2 border border-indigo-200 text-indigo-600 font-bold text-xs rounded-xl bg-white hover:bg-indigo-50 transition-colors"
                    >
                      View
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsReplacingResume(true)}
                      className="flex-1 sm:flex-initial px-4 py-2 border border-gray-200 text-gray-600 font-bold text-xs rounded-xl bg-white hover:bg-gray-50 transition-colors"
                    >
                      Replace
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <label
                    className={`flex flex-col items-center justify-center border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all duration-300 ${
                      uploadingResume
                        ? "border-indigo-500 bg-indigo-50"
                        : "border-slate-200 hover:border-indigo-400 bg-white"
                    }`}
                  >
                    <input
                      type="file"
                      accept=".pdf"
                      onChange={handleResumeFileChange}
                      className="hidden"
                      disabled={uploadingResume}
                    />
                    <div className="w-10 h-10 rounded-xl bg-slate-50 text-slate-400 flex items-center justify-center mb-2 shadow-sm border border-slate-200">
                      {uploadingResume ? (
                        <FiLoader className="animate-spin text-indigo-500" size={18} />
                      ) : (
                        <FiUploadCloud size={18} />
                      )}
                    </div>
                    <p className="text-sm font-bold text-gray-700">
                      {uploadingResume ? "Uploading your resume..." : "Click to select or drop resume file"}
                    </p>
                    <p className="text-[10px] text-gray-400 font-semibold mt-1">
                      PDF format only (Max 5MB)
                    </p>
                  </label>
                  {resumeUrl && (
                    <button
                      type="button"
                      onClick={() => setIsReplacingResume(false)}
                      className="text-xs text-indigo-600 font-bold hover:underline"
                    >
                      Cancel and keep existing resume
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* 4. ADDITIONAL QUESTIONS */}
            <div className={cardCls}>
              <h3 className="text-base font-bold text-indigo-700 flex items-center gap-2 border-b border-gray-100 pb-3">
                <span className="p-1 bg-indigo-50 rounded-lg text-indigo-600">
                  <FiBookOpen size={14} />
                </span>
                Additional Questions
              </h3>
              {internship?.applicationForm && internship.applicationForm.length > 0 ? (
                <div className="space-y-4">
                  {internship.applicationForm.map((field, index) => (
                    <div key={index} className="space-y-1.5">
                      <label className={labelCls}>
                        {field.label} {field.required && <span className="text-red-500">*</span>}
                      </label>
                      {field.type === "textarea" ? (
                        <textarea
                          required={field.required}
                          rows={3}
                          value={additionalResponses[field.label] || ""}
                          onChange={(e) => handleAdditionalChange(field.label, e.target.value)}
                          className={inputCls}
                        />
                      ) : field.type === "number" ? (
                        <input
                          type="number"
                          required={field.required}
                          value={additionalResponses[field.label] || ""}
                          onChange={(e) => handleAdditionalChange(field.label, e.target.value)}
                          className={inputCls}
                        />
                      ) : (
                        <input
                          type="text"
                          required={field.required}
                          value={additionalResponses[field.label] || ""}
                          onChange={(e) => handleAdditionalChange(field.label, e.target.value)}
                          className={inputCls}
                        />
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-400 italic">
                  No additional questions for this internship
                </p>
              )}
            </div>

            {/* 5. SUBMIT BUTTON */}
            <div className="flex justify-end pt-4">
              <button
                type="submit"
                disabled={submitting}
                className="w-full sm:w-auto px-8 py-3.5 bg-gradient-to-r from-indigo-600 to-blue-600 text-white font-bold text-sm rounded-xl hover:shadow-lg hover:shadow-indigo-200 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? (
                  <>
                    <FiLoader className="animate-spin" size={16} />
                    Submitting Application...
                  </>
                ) : (
                  "Submit Application"
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
