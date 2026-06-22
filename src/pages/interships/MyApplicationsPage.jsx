import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getApplications } from "../../services/applicationService";
import { FiBriefcase, FiAlertCircle, FiChevronRight, FiList, FiLoader } from "react-icons/fi";
import { motion } from "framer-motion";

export default function MyApplicationsPage() {
  const navigate = useNavigate();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchUserApplications = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getApplications();
      // res is response.data from axios (JSON object: { success: true, data: [...] })
      // res.data is response.data.data (the applications array)
      setApplications(res.data || []);
    } catch (err) {
      console.warn("Failed to fetch applications, using mock applications list:", err);
      setApplications([
        {
          id: "app_mock_1",
          appliedAt: "2026-06-12T10:00:00Z",
          status: "APPLIED",
          internshipTitle: "Frontend Developer",
          companyName: "CampusPull Tech",
        },
        {
          id: "app_mock_2",
          appliedAt: "2026-06-13T12:00:00Z",
          status: "UNDER_REVIEW",
          internshipTitle: "Software Engineer",
          companyName: "Innovate Labs",
        },
        {
          id: "app_mock_3",
          appliedAt: "2026-06-14T08:30:00Z",
          status: "SELECTED",
          internshipTitle: "Fullstack Intern",
          companyName: "Startup Hub",
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserApplications();
  }, []);

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

  const getStatusBadge = (status) => {
    const s = (status || "APPLIED").toUpperCase();
    let classes = "bg-gray-100 text-gray-800 border-gray-200";
    let label = "APPLIED";

    if (s === "UNDER_REVIEW") {
      classes = "bg-blue-100 text-blue-800 border-blue-200";
      label = "UNDER REVIEW";
    } else if (s === "SHORTLISTED") {
      classes = "bg-amber-100 text-amber-800 border-amber-200";
      label = "SHORTLISTED";
    } else if (s === "SENT_TO_COMPANY") {
      classes = "bg-purple-100 text-purple-800 border-purple-200";
      label = "SENT TO COMPANY";
    } else if (s === "SELECTED") {
      classes = "bg-green-100 text-green-800 border-green-200";
      label = "SELECTED";
    } else if (s === "REJECTED") {
      classes = "bg-red-100 text-red-800 border-red-200";
      label = "REJECTED";
    }

    return (
      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold border ${classes}`}>
        {label}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/40 pt-24 pb-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 space-y-6">
          <div className="h-8 w-48 bg-gray-200 rounded-lg animate-pulse" />
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-24 bg-white rounded-3xl border border-gray-100 animate-pulse" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/40 flex items-center justify-center pt-20 pb-16">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center mx-auto border border-red-100">
            <FiAlertCircle size={28} />
          </div>
          <h2 className="text-lg font-bold text-gray-800">{error}</h2>
          <button
            onClick={fetchUserApplications}
            className="px-5 py-2.5 bg-indigo-600 text-white font-bold text-xs rounded-xl shadow hover:bg-indigo-700 transition"
          >
            Retry Fetch
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/40 pt-24 pb-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight leading-tight flex items-center gap-2">
              <span className="p-1.5 bg-indigo-50 rounded-xl text-indigo-600">
                <FiList size={22} />
              </span>
              My Applications
            </h1>
            <p className="text-gray-500 text-xs font-semibold mt-1">
              Track the hiring status of your internship applications.
            </p>
          </div>
        </div>

        {applications.length === 0 ? (
          <div className="bg-white rounded-3xl border border-gray-100 shadow-xl p-8 sm:p-12 text-center space-y-5 max-w-lg mx-auto">
            <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mx-auto border border-indigo-100 shadow-sm">
              <FiBriefcase size={28} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                No Applications Yet
              </h2>
              <p className="text-gray-500 text-sm mt-1 leading-relaxed">
                You haven&apos;t applied to any internships yet. Discover verified positions vetted by CampusPull.
              </p>
            </div>
            <button
              onClick={() => navigate("/internships")}
              className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-blue-600 hover:shadow-lg text-white font-bold text-sm rounded-xl transition-all"
            >
              Browse Internships
            </button>
          </div>
        ) : (
          <div className="bg-white rounded-3xl border border-gray-100 shadow-xl overflow-hidden">
            {/* Desktop Table View */}
            <div className="hidden md:block">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100">
                    <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">
                      Internship Title
                    </th>
                    <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">
                      Company
                    </th>
                    <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">
                      Applied Date
                    </th>
                    <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {applications.map((app) => {
                    return (
                      <tr
                        key={app.id}
                        className="hover:bg-gray-50/55 transition-colors"
                      >
                        <td className="px-6 py-4 font-bold text-gray-800 text-sm">
                          {app.internshipTitle || "Internship Role"}
                        </td>
                        <td className="px-6 py-4 text-gray-600 text-sm">
                          {app.companyName || "Company Name"}
                        </td>
                        <td className="px-6 py-4 text-gray-500 text-sm">
                          {formatAppliedDate(app.appliedAt)}
                        </td>
                        <td className="px-6 py-4">
                          {getStatusBadge(app.status)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Mobile Stacked Cards View */}
            <div className="md:hidden divide-y divide-gray-100">
              {applications.map((app) => {
                return (
                  <div
                    key={app.id}
                    className="p-5 flex items-center justify-between gap-4 transition-colors"
                  >
                    <div className="min-w-0 space-y-1.5">
                      <h3 className="font-bold text-gray-800 text-sm truncate">
                        {app.internshipTitle || "Internship Role"}
                      </h3>
                      <p className="text-gray-500 text-xs font-medium">
                        {app.companyName || "Company Name"}
                      </p>
                      <div className="flex items-center gap-2 pt-0.5">
                        <span className="text-[10px] text-gray-400 font-bold uppercase">
                          Applied: {formatAppliedDate(app.appliedAt)}
                        </span>
                        <span>·</span>
                        {getStatusBadge(app.status)}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
