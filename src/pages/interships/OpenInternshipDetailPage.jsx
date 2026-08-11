import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { getOpenInternshipById } from "../../services/applicationService";
import { 
  ArrowLeft, 
  MapPin, 
  IndianRupee, 
  Calendar, 
  ExternalLink, 
  AlertCircle, 
  Loader2, 
  Briefcase 
} from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";

const DetailsSkeleton = () => (
  <div className="max-w-4xl mx-auto bg-white rounded-3xl border border-slate-100 p-8 md:p-12 space-y-6 animate-pulse shadow-sm">
    <div className="flex items-center gap-4">
      <div className="w-16 h-16 rounded-2xl bg-slate-100 shrink-0" />
      <div className="flex-1 space-y-2.5">
        <div className="h-4 bg-slate-100 rounded w-1/4" />
        <div className="h-7 bg-slate-100 rounded w-2/3" />
      </div>
    </div>
    <div className="flex flex-wrap gap-3">
      <div className="h-8 bg-slate-100 rounded-xl w-24" />
      <div className="h-8 bg-slate-100 rounded-xl w-32" />
      <div className="h-8 bg-slate-100 rounded-xl w-28" />
    </div>
    <div className="space-y-4 pt-6 border-t border-slate-50">
      <div className="h-4 bg-slate-100 rounded w-full" />
      <div className="h-4 bg-slate-100 rounded w-5/6" />
      <div className="h-4 bg-slate-100 rounded w-2/3" />
    </div>
    <div className="pt-8 flex justify-end gap-3">
      <div className="h-12 bg-slate-100 rounded-2xl w-24" />
      <div className="h-12 bg-slate-100 rounded-2xl w-36" />
    </div>
  </div>
);

export default function OpenInternshipDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [internship, setInternship] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDetails = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getOpenInternshipById(id);
      if (res && res.success && res.data) {
        setInternship(res.data);
      } else {
        throw new Error(res?.message || "Internship not found");
      }
    } catch (err) {
      console.error(err);
      setError(
        err.response?.status === 404 
          ? "Open internship not found" 
          : "Failed to load open internship details. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDetails();
  }, [id]);

  //Badge configuration based on deadline date
  const getDeadlineBadge = (deadlineStr) => {
    if (!deadlineStr) return { text: "No deadline", classes: "bg-slate-50 text-slate-500 border-slate-100" };
    
    const deadline = new Date(deadlineStr);
    const now = new Date();
    
    // Normalize date parts to compare full days
    const cleanDeadline = new Date(deadline.getFullYear(), deadline.getMonth(), deadline.getDate());
    const cleanNow = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    
    const diffTime = cleanDeadline - cleanNow;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      return { 
        text: "Expired", 
        classes: "bg-slate-100 text-slate-600 border-slate-200" 
      };
    } else if (diffDays < 3) {
      return { 
        text: diffDays === 0 ? "Expires today" : `Expires in ${diffDays} day${diffDays > 1 ? "s" : ""}`, 
        classes: "bg-rose-50 text-rose-700 border-rose-200" 
      };
    } else if (diffDays <= 7) {
      return { 
        text: `Expires in ${diffDays} days`, 
        classes: "bg-amber-50 text-amber-700 border-amber-200" 
      };
    } else {
      const formattedDate = deadline.toLocaleDateString("en-US", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });
      return { 
        text: `Expires: ${formattedDate}`, 
        classes: "bg-emerald-50 text-emerald-700 border-emerald-200" 
      };
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/20 to-indigo-50/30 pt-28 pb-20 px-4">
        <DetailsSkeleton />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/20 to-indigo-50/30 pt-28 pb-20 px-4 flex flex-col items-center justify-center space-y-4">
        <div className="w-16 h-16 bg-rose-50 rounded-full flex items-center justify-center border border-rose-100 shadow-sm">
          <AlertCircle className="text-rose-500 w-8 h-8" />
        </div>
        <h2 className="text-xl font-extrabold text-slate-800">Internship Not Found</h2>
        <p className="text-slate-500 text-sm max-w-md text-center">{error}</p>
        <div className="flex gap-3">
          <button
            onClick={() => navigate("/internships?tab=open")}
            className="px-5 py-3 border border-slate-200 rounded-2xl text-xs font-black text-slate-600 bg-white hover:bg-slate-50 transition-all cursor-pointer"
          >
            Go back
          </button>
          <button
            onClick={fetchDetails}
            className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-2xl transition-all shadow-md shadow-indigo-600/10 cursor-pointer"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const badge = getDeadlineBadge(internship.deadline);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/20 to-indigo-50/30 pt-28 pb-20 px-4 sm:px-8">
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Back navigation */}
        <button
          onClick={() => navigate("/internships?tab=open")}
          className="flex items-center gap-2 text-xs font-black text-slate-500 hover:text-slate-800 transition-colors bg-white px-4 py-2.5 rounded-xl border border-slate-100 w-max cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to list
        </button>

        {/* Details Card */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-white rounded-3xl border border-slate-100 shadow-brand-lg p-6 sm:p-10 md:p-12 space-y-8 relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-emerald-500 to-teal-500" />

          {/* Title Area */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100">
                  <Briefcase className="w-4 h-4" />
                </div>
                <h4 className="text-sm font-black text-emerald-600 uppercase tracking-wider">
                  {internship.companyName}
                </h4>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-800 leading-tight">
                {internship.title}
              </h1>
            </div>
            
            {/* External Redirect info chip */}
            <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 sm:max-w-xs shrink-0">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-relaxed">
                Application Platform
              </p>
              <p className="text-xs font-bold text-slate-700 mt-1 flex items-center gap-1.5">
                <ExternalLink className="w-3.5 h-3.5 text-indigo-500" />
                External Website
              </p>
            </div>
          </div>

          {/* Quick Info Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t border-slate-100">
            {/* Location */}
            {internship.location && (
              <div className="bg-slate-50/50 border border-slate-100 rounded-2xl p-4 flex flex-col gap-1">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  Location
                </span>
                <span className="text-sm text-slate-800 font-extrabold">{internship.location}</span>
              </div>
            )}

            {/* Stipend */}
            {internship.stipend && (
              <div className="bg-slate-50/50 border border-slate-100 rounded-2xl p-4 flex flex-col gap-1">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1">
                  <IndianRupee className="w-3.5 h-3.5 text-slate-400" />
                  Stipend
                </span>
                <span className="text-sm text-slate-800 font-extrabold">{internship.stipend}</span>
              </div>
            )}

            {/* Status / Deadline */}
            <div className="bg-slate-50/50 border border-slate-100 rounded-2xl p-4 flex flex-col gap-1.5">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                Hiring Deadline
              </span>
              <span className={`text-[10px] font-black border px-2.5 py-1 rounded-xl w-max uppercase ${badge.classes}`}>
                {badge.text}
              </span>
            </div>
          </div>

          {/* Description Section */}
          <div className="space-y-4 pt-6 border-t border-slate-100">
            <h2 className="text-lg font-extrabold text-slate-850">About the Role</h2>
            {internship.description ? (
              <p className="text-sm text-slate-650 leading-relaxed font-semibold whitespace-pre-wrap">
                {internship.description}
              </p>
            ) : (
              <p className="text-sm text-slate-400 italic">No description provided for this listing.</p>
            )}
          </div>

          {/* Actions */}
          <div className="pt-8 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
            <span className="text-xs font-bold text-slate-450 text-center sm:text-left leading-relaxed">
              * Note: You will be redirected to the original application website. CampusPull does not collect applicant info for external opportunities.
            </span>
            <button
              onClick={() => window.open(internship.applyLink, "_blank", "noopener,noreferrer")}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white text-sm font-black rounded-2xl transition-all shadow-brand-md hover:shadow-brand-lg active:scale-98 cursor-pointer shrink-0"
            >
              Apply on Company Website
              <ExternalLink className="w-4 h-4" />
            </button>
          </div>

        </motion.div>
      </div>
    </div>
  );
}
