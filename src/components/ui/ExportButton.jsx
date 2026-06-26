import React, { useState, useRef, useEffect } from "react";
import { toast } from "react-toastify";
import Icon from "../AppIcon";
import { exportApplications, exportInternshipApplications } from "../../services/applicationService";

export default function ExportButton({ internshipId, filters = {}, label = "Export Candidates" }) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close dropdown on Escape key press
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleExport = async (exportType) => {
    setLoading(true);
    setIsOpen(false); // Close dropdown when export starts

    try {
      let params = {};
      
      if (exportType === "FILTERED") {
        // Map filters, filter out "ALL" and empty strings
        Object.keys(filters).forEach((key) => {
          const val = filters[key];
          if (val !== undefined && val !== null && val !== "ALL" && val !== "") {
            params[key] = val;
          }
        });
      } else if (exportType === "SHORTLISTED") {
        params = { status: "SHORTLISTED" };
      }

      let res;
      if (internshipId) {
        res = await exportInternshipApplications(internshipId, params);
      } else {
        res = await exportApplications(params);
      }

      // Check if response is successful and has blob data
      if (res && res.data) {
        const blob = new Blob([res.data], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
        const dateStr = new Date().toISOString().split("T")[0];
        const filename = `candidates-export-${dateStr}.xlsx`;
        
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", filename);
        document.body.appendChild(link);
        link.click();
        
        // Clean up
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        toast.success("Export downloaded successfully");
      } else {
        throw new Error("Invalid response format");
      }
    } catch (err) {
      console.error("Export error:", err);
      toast.error("Export failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <button
        onClick={() => !loading && setIsOpen(!isOpen)}
        disabled={loading}
        className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-sm transition disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
      >
        {loading ? (
          <svg className="animate-spin h-3.5 w-3.5 text-white" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
        ) : (
          <Icon name="Download" size={14} />
        )}
        <span>{loading ? "Exporting..." : label}</span>
        {!loading && (
          <Icon
            name="ChevronDown"
            size={12}
            className={`transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
          />
        )}
      </button>

      {isOpen && !loading && (
        <div
          className="absolute right-0 mt-2 w-48 rounded-2xl bg-white border border-slate-200 shadow-2xl p-1.5 z-50 animate-fade-in origin-top-right transition-all"
          style={{ boxShadow: "0 10px 40px -10px rgba(0, 0, 0, 0.12)" }}
        >
          <button
            onClick={() => handleExport("ALL")}
            className="w-full flex items-center gap-2 px-3 py-2 text-xs font-bold text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 rounded-xl cursor-pointer transition text-left"
          >
            <Icon name="FileText" size={14} className="text-slate-400" />
            <span>Export All</span>
          </button>
          <button
            onClick={() => handleExport("FILTERED")}
            className="w-full flex items-center gap-2 px-3 py-2 text-xs font-bold text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 rounded-xl cursor-pointer transition text-left"
          >
            <Icon name="Filter" size={14} className="text-slate-400" />
            <span>Export Filtered</span>
          </button>
          <button
            onClick={() => handleExport("SHORTLISTED")}
            className="w-full flex items-center gap-2 px-3 py-2 text-xs font-bold text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 rounded-xl cursor-pointer transition text-left"
          >
            <Icon name="UserCheck" size={14} className="text-slate-400" />
            <span>Export Shortlisted</span>
          </button>
        </div>
      )}
    </div>
  );
}
