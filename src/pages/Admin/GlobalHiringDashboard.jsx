import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../utils/api";
import { getDashboardStats, getRecentApplications } from "../../services/applicationService";
import Icon from "../../components/AppIcon";
import { FiAlertCircle, FiRefreshCw } from "react-icons/fi";

export default function GlobalHiringDashboard() {
  const navigate = useNavigate();

  const [stats, setStats] = useState(null);
  const [recentApplications, setRecentApplications] = useState([]);
  const [allInternships, setAllInternships] = useState([]);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDashboardData = async () => {
    setLoading(true);
    setError(null);
    try {
      const results = await Promise.allSettled([
        getDashboardStats(),
        getRecentApplications(),
        api.get("/internships"),
      ]);

      const statsRes = results[0].status === "fulfilled" ? results[0].value : null;
      const recentRes = results[1].status === "fulfilled" ? results[1].value : null;
      const internshipsRes = results[2].status === "fulfilled" ? results[2].value : null;

      // Support both nested { stats: ... } and flat structure from the stats response
      const statsObj = statsRes?.data || {};
      const resolvedStats = {
        activeInternships: statsObj.activeInternships || 0,
        totalApplications: statsObj.totalApplications || 0,
        applied: statsObj.applied || 0,
        underReview: statsObj.underReview || 0,
        shortlisted: statsObj.shortlisted || 0,
        selected: statsObj.selected || 0,
        rejected: statsObj.rejected || 0,
        closedInternships: statsObj.closedInternships ?? null,
      };

      // Handle shape of recent applications
      const apps = recentRes?.data || recentRes?.applications || [];
      setRecentApplications(apps.slice(0, 10));

      // Handle all internships
      const internshipsData = internshipsRes?.data?.data || internshipsRes?.data || [];
      setAllInternships(internshipsData);

      // Fallback for closedInternships if not returned by stats API
      if (resolvedStats.closedInternships === null || resolvedStats.closedInternships === undefined) {
        resolvedStats.closedInternships = internshipsData.filter((i) => {
          const isOpen =
            i.status?.toUpperCase() === "OPEN" ||
            (i.status?.toUpperCase() !== "CLOSED" && i.hiringStatus?.toUpperCase() === "OPEN");
          return !isOpen;
        }).length;
      }

      setStats(resolvedStats);
    } catch (err) {
      console.error("Critical error in dashboard fetch:", err);
      setError("Failed to fetch hiring dashboard data. Please check your network connection.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const filteredInternships = allInternships.filter((item) => {
    const isOpen =
      item.status?.toUpperCase() === "OPEN" ||
      (item.status?.toUpperCase() !== "CLOSED" && item.hiringStatus?.toUpperCase() === "OPEN");

    if (filter === "open") return isOpen;
    if (filter === "closed") return !isOpen;
    return true;
  });

  const getStatusBadge = (status) => {
    const s = (status || "APPLIED").toUpperCase();
    let classes = "bg-gray-100 text-gray-800 border-gray-200";

    if (s === "UNDER_REVIEW") {
      classes = "bg-blue-100 text-blue-800 border-blue-200";
    } else if (s === "SHORTLISTED") {
      classes = "bg-amber-100 text-amber-800 border-amber-200";
    } else if (s === "SENT_TO_COMPANY") {
      classes = "bg-purple-100 text-purple-800 border-purple-200";
    } else if (s === "SELECTED") {
      classes = "bg-green-100 text-green-800 border-green-200";
    } else if (s === "REJECTED") {
      classes = "bg-red-100 text-red-800 border-red-200";
    }

    return (
      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold border ${classes}`}>
        {s.replace("_", " ")}
      </span>
    );
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

  if (error) {
    return (
      <div className="p-6 pt-28 md:pt-32 bg-gray-50 min-h-screen flex flex-col items-center justify-center space-y-4">
        <div className="w-14 h-14 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center mx-auto border border-red-100 shadow-sm animate-bounce">
          <FiAlertCircle size={24} />
        </div>
        <h2 className="text-lg font-bold text-gray-800">Dashboard Loading Error</h2>
        <p className="text-gray-500 text-sm font-medium max-w-sm text-center">{error}</p>
        <button
          onClick={fetchDashboardData}
          className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-md transition cursor-pointer"
        >
          <FiRefreshCw size={14} />
          <span>Retry Loading</span>
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 pt-28 md:pt-32 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-black text-gray-800 tracking-tight">Global Hiring Dashboard</h1>
            <p className="text-sm font-medium text-gray-500 mt-1">
              Overview of internship statistics, recent applications, and current openings.
            </p>
          </div>
          <button
            onClick={() => navigate("/internships")}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-base rounded-xl shadow-sm transition cursor-pointer w-fit sm:self-start">
            <span>All Internships</span>
            <Icon name="ArrowRight" size={16} />
          </button>
        </div>

        {/* Section A: Stats Cards Row */}
        {loading && !stats ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 animate-pulse">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div key={i} className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm h-24" />
            ))}
          </div>
        ) : (
          stats && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
               {/* Active Internships */}
              <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm border-l-4 border-blue-500 flex items-center justify-between">
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">Active Internships</span>
                  <p className="text-2xl font-black text-gray-850">{stats.activeInternships}</p>
                </div>
                <div className="w-10 h-10 bg-blue-50 text-blue-500 rounded-xl flex items-center justify-center">
                  <Icon name="Briefcase" size={20} />
                </div>
              </div>

              {/* Total Applications */}
              <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm border-l-4 border-indigo-500 flex items-center justify-between">
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">Total Applications</span>
                  <p className="text-2xl font-black text-gray-850">{stats.totalApplications}</p>
                </div>
                <div className="w-10 h-10 bg-indigo-50 text-indigo-500 rounded-xl flex items-center justify-center">
                  <Icon name="Users" size={20} />
                </div>
              </div>

              {/* Applied */}
              <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm border-l-4 border-gray-400 flex items-center justify-between">
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">Applied</span>
                  <p className="text-2xl font-black text-gray-500">{stats.applied}</p>
                </div>
                <div className="w-10 h-10 bg-gray-50 text-gray-400 rounded-xl flex items-center justify-center">
                  <Icon name="FileText" size={20} />
                </div>
              </div>

              {/* Under Review */}
              <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm border-l-4 border-blue-500 flex items-center justify-between">
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">Under Review</span>
                  <p className="text-2xl font-black text-blue-600">{stats.underReview}</p>
                </div>
                <div className="w-10 h-10 bg-blue-50/70 text-blue-600 rounded-xl flex items-center justify-center">
                  <Icon name="Search" size={20} />
                </div>
              </div>

              {/* Shortlisted */}
              <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm border-l-4 border-amber-500 flex items-center justify-between">
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">Shortlisted</span>
                  <p className="text-2xl font-black text-amber-600">{stats.shortlisted}</p>
                </div>
                <div className="w-10 h-10 bg-amber-50 text-amber-500 rounded-xl flex items-center justify-center">
                  <Icon name="UserCheck" size={20} />
                </div>
              </div>

              {/* Selected */}
              <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm border-l-4 border-green-500 flex items-center justify-between">
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">Selected</span>
                  <p className="text-2xl font-black text-green-600">{stats.selected}</p>
                </div>
                <div className="w-10 h-10 bg-green-50 text-green-500 rounded-xl flex items-center justify-center">
                  <Icon name="CheckCircle" size={20} />
                </div>
              </div>

              {/* Rejected */}
              <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm border-l-4 border-red-500 flex items-center justify-between">
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">Rejected</span>
                  <p className="text-2xl font-black text-red-600">{stats.rejected}</p>
                </div>
                <div className="w-10 h-10 bg-red-50 text-red-500 rounded-xl flex items-center justify-center">
                  <Icon name="XCircle" size={20} />
                </div>
              </div>

              {/* Closed Internships */}
              <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm border-l-4 border-slate-500 flex items-center justify-between">
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">Closed Internships</span>
                  <p className="text-2xl font-black text-slate-700">{stats.closedInternships}</p>
                </div>
                <div className="w-10 h-10 bg-slate-50 text-slate-500 rounded-xl flex items-center justify-center">
                  <Icon name="Lock" size={20} />
                </div>
              </div>
            </div>
          )
        )}

        {/* Section B: All Internships Table */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h2 className="text-lg font-extrabold text-gray-800">All Internships</h2>
            
            {/* Toggle filter buttons */}
            <div className="flex items-center bg-gray-200/50 p-1 rounded-xl border border-gray-200/60 w-fit">
              {["all", "open", "closed"].map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all capitalize cursor-pointer ${
                    filter === f
                      ? "bg-white text-gray-800 shadow-sm border border-slate-200/20"
                      : "text-gray-500 hover:text-gray-800"
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          {loading ? (
            <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden p-6 space-y-4 animate-pulse">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex justify-between items-center py-4 border-b border-gray-50 last:border-b-0">
                  <div className="space-y-2">
                    <div className="h-4 w-32 bg-gray-200 rounded" />
                    <div className="h-3 w-48 bg-gray-100 rounded" />
                  </div>
                  <div className="h-8 w-20 bg-gray-200 rounded" />
                </div>
              ))}
            </div>
          ) : filteredInternships.length === 0 ? (
            <div className="p-12 text-center bg-white border border-gray-100 rounded-2xl shadow-sm">
              <span className="text-4xl block mb-2">💼</span>
              <p className="text-gray-500 font-bold text-sm">No internships found</p>
            </div>
          ) : (
            <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-100">
                      <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Internship Title</th>
                      <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Company Name</th>
                      <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Openings</th>
                      <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Deadline</th>
                      <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Status</th>
                      <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Applications Count</th>
                      <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filteredInternships.map((internship) => {
                      const isOpen =
                        internship.status?.toUpperCase() === "OPEN" ||
                        (internship.status?.toUpperCase() !== "CLOSED" && internship.hiringStatus?.toUpperCase() === "OPEN");

                      return (
                        <tr key={internship._id} className="hover:bg-gray-50/50 transition-colors">
                          <td className="px-6 py-4 font-bold text-gray-800 text-sm whitespace-nowrap">{internship.title}</td>
                          <td className="px-6 py-4 text-gray-600 text-sm font-semibold whitespace-nowrap">
                            {internship.companyName}
                          </td>
                          <td className="px-6 py-4 text-gray-600 text-sm font-semibold whitespace-nowrap">
                            {internship.openings ?? "—"}
                          </td>
                          <td className="px-6 py-4 text-gray-500 text-sm font-semibold whitespace-nowrap">
                            {internship.deadline ? formatAppliedDate(internship.deadline) : "No deadline"}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {isOpen ? (
                              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold border bg-green-100 text-green-800 border-green-200">
                                OPEN
                              </span>
                            ) : (
                              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold border bg-red-100 text-red-800 border-red-200">
                                CLOSED
                              </span>
                            )}
                          </td>
                          <td className="px-6 py-4 text-gray-600 text-sm font-semibold whitespace-nowrap">
                            {internship.applicationCount !== undefined && internship.applicationCount !== null
                              ? internship.applicationCount
                              : "—"}
                          </td>
                          <td className="px-6 py-4 text-center whitespace-nowrap">
                            <button
                              onClick={() => navigate(`/admin/internships/${internship._id}/applications`)}
                              className="px-3.5 py-1.5 bg-indigo-50 border border-indigo-100 hover:bg-indigo-100 text-indigo-600 font-bold text-xs rounded-lg transition cursor-pointer"
                            >
                              View Applications
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Section C: Recent Applications Table */}
        <div className="space-y-4">
          <h2 className="text-lg font-extrabold text-gray-800">Recent Applications</h2>
          
          {loading ? (
            <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden p-6 space-y-4 animate-pulse">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex justify-between items-center py-4 border-b border-gray-50 last:border-b-0">
                  <div className="space-y-2">
                    <div className="h-4 w-32 bg-gray-200 rounded" />
                    <div className="h-3 w-48 bg-gray-100 rounded" />
                  </div>
                  <div className="h-8 w-20 bg-gray-200 rounded" />
                </div>
              ))}
            </div>
          ) : recentApplications.length === 0 ? (
            <div className="p-12 text-center bg-white border border-gray-100 rounded-2xl shadow-sm">
              <span className="text-4xl block mb-2">📬</span>
              <p className="text-gray-500 font-bold text-sm">No recent applications found</p>
            </div>
          ) : (
            <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-100">
                      <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Candidate Name</th>
                      <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Internship</th>
                      <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">College</th>
                      <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Status</th>
                      <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Applied Date</th>
                      <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {recentApplications.map((app) => (
                      <tr key={app._id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="px-6 py-4 font-bold text-gray-800 text-sm whitespace-nowrap">{app.fullName}</td>
                        <td className="px-6 py-4 text-gray-600 text-sm font-semibold whitespace-nowrap">
                          {app.internshipTitle || app.internshipId?.title || app.internship?.title || "—"}
                        </td>
                        <td className="px-6 py-4 text-gray-600 text-sm font-semibold whitespace-nowrap">{app.college || "—"}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{getStatusBadge(app.status)}</td>
                        <td className="px-6 py-4 text-gray-500 text-sm font-semibold whitespace-nowrap">
                          {formatAppliedDate(app.appliedAt || app.createdAt)}
                        </td>
                        <td className="px-6 py-4 text-center whitespace-nowrap">
                          <button
                            onClick={() => navigate(`/admin/applications/${app._id}`)}
                            className="px-3.5 py-1.5 bg-indigo-50 border border-indigo-100 hover:bg-indigo-100 text-indigo-600 font-bold text-xs rounded-lg transition cursor-pointer"
                          >
                            View
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
}
