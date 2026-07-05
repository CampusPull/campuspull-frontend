import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { getInternshipApplications, getInternshipStats } from "../../services/applicationService";
import { getInternshipById } from "../../services/internshipService";
import { FiSearch, FiFilter, FiUser, FiArrowLeft, FiAlertCircle, FiLoader } from "react-icons/fi";
import { toast } from "react-toastify";
import ExportButton from "../../components/ui/ExportButton";

export default function AdminApplicationsPage() {
  const { internshipId } = useParams();
  const navigate = useNavigate();

  const [applications, setApplications] = useState([]);
  const [internship, setInternship] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Stats state
  const [stats, setStats] = useState(null);
  const [statsLoading, setStatsLoading] = useState(true);

  // Search & Filter state
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  const fetchApplicationsData = async () => {
    setLoading(true);
    setError(null);
    setStatsLoading(true);
    try {
      const [appRes, intRes, statsRes] = await Promise.all([
        getInternshipApplications(internshipId).catch(err => {
          const status = err.response?.status;
          // If the backend API returns 404, fails to load, or is not ready, default to empty list
          if (status === 404 || !status) {
            console.warn("Backend applications API not ready or returned 404, defaulting to empty state:", err);
            return { data: [] };
          }
          throw err;
        }),
        getInternshipById(internshipId).catch(err => {
          console.warn("Failed to fetch internship info, using default details:", err);
          return { data: { _id: internshipId, title: "Internship Applications", companyName: "CampusPull" } };
        }),
        getInternshipStats(internshipId).catch(err => {
          console.warn("Failed to fetch internship stats, will calculate client-side:", err);
          return null;
        })
      ]);

      const appsList = appRes?.data || appRes?.applications || [];
      const internshipData = intRes?.data || intRes || null;

      setApplications(appsList);
      setInternship(internshipData);

      if (statsRes && statsRes.stats) {
        setStats(statsRes.stats);
      } else {
        // Fallback calculation from applications list
        const fallback = {
          totalApplications: appsList.length,
          applied: appsList.filter(a => a.status === "APPLIED").length,
          underReview: appsList.filter(a => a.status === "UNDER_REVIEW").length,
          shortlisted: appsList.filter(a => a.status === "SHORTLISTED").length,
          selected: appsList.filter(a => a.status === "SELECTED").length,
          rejected: appsList.filter(a => a.status === "REJECTED").length,
        };
        setStats(fallback);
      }
    } catch (err) {
      console.error("Error fetching admin applications:", err);
      setError("Failed to load applications");
    } finally {
      setLoading(false);
      setStatsLoading(false);
    }
  };

  useEffect(() => {
    if (internshipId) {
      fetchApplicationsData();
    }
  }, [internshipId]);

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

  // Client-side filtering
  const filteredApplications = applications.filter((app) => {
    const nameMatch = (app.fullName || "").toLowerCase().includes(searchTerm.toLowerCase());
    const emailMatch = (app.email || "").toLowerCase().includes(searchTerm.toLowerCase());
    const statusMatch = statusFilter === "ALL" || (app.status || "").toUpperCase() === statusFilter;
    return (nameMatch || emailMatch) && statusMatch;
  });

  if (loading) {
    return (
      <div className="p-6 pt-28 md:pt-32 bg-gray-50 min-h-screen">
        <div className="max-w-6xl mx-auto space-y-6">
          {/* Back Link skeleton */}
          <div className="h-4 w-32 bg-gray-200 rounded animate-pulse" />
          {/* Title skeleton */}
          <div className="space-y-2">
            <div className="h-8 w-64 bg-gray-200 rounded animate-pulse" />
            <div className="h-4 w-48 bg-gray-200 rounded animate-pulse" />
          </div>
          {/* Search bar skeleton */}
          <div className="h-14 bg-white border border-gray-100 rounded-2xl animate-pulse" />
          {/* Table skeleton */}
          <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
            <div className="p-6 space-y-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex justify-between items-center py-4 border-b border-gray-50 last:border-b-0 animate-pulse">
                  <div className="space-y-2">
                    <div className="h-4 w-32 bg-gray-200 rounded" />
                    <div className="h-3 w-48 bg-gray-100 rounded" />
                  </div>
                  <div className="h-4 w-24 bg-gray-200 rounded" />
                  <div className="h-8 w-24 bg-gray-200 rounded" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 pt-28 md:pt-32 bg-gray-50 min-h-screen flex flex-col items-center justify-center space-y-4">
        <div className="w-14 h-14 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center mx-auto border border-red-100 shadow-sm">
          <FiAlertCircle size={24} />
        </div>
        <p className="text-gray-700 font-semibold">{error}</p>
        <button
          onClick={fetchApplicationsData}
          className="px-5 py-2 bg-indigo-600 text-white font-bold text-xs rounded-xl hover:bg-indigo-700 transition"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 pt-28 md:pt-32 bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Back Link */}
        <Link
          to="/internships"
          className="inline-flex items-center gap-1 text-xs font-bold text-indigo-600 hover:text-indigo-800 transition"
        >
          <FiArrowLeft size={14} /> Back to Internships
        </Link>

        {/* Title Block */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
              {internship?.title || "Applications"}
            </h1>
            <p className="text-sm font-medium text-gray-500 mt-1">
              {internship?.companyName} · Admin Application Portal
            </p>
          </div>
          <ExportButton internshipId={internshipId} filters={{ status: statusFilter, search: searchTerm }} />
        </div>

        {/* Stats Row */}
        {stats && (
          <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm border-l-4 border-indigo-500">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1">Total</span>
              <p className="text-2xl font-black text-gray-800">{stats.totalApplications || 0}</p>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm border-l-4 border-gray-400">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1">Applied</span>
              <p className="text-2xl font-black text-gray-500">{stats.applied || 0}</p>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm border-l-4 border-blue-500">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1">Under Review</span>
              <p className="text-2xl font-black text-blue-600">{stats.underReview || 0}</p>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm border-l-4 border-amber-500">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1">Shortlisted</span>
              <p className="text-2xl font-black text-amber-600">{stats.shortlisted || 0}</p>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm border-l-4 border-green-500">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1">Selected</span>
              <p className="text-2xl font-black text-green-600">{stats.selected || 0}</p>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm border-l-4 border-red-500">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1">Rejected</span>
              <p className="text-2xl font-black text-red-600">{stats.rejected || 0}</p>
            </div>
          </div>
        )}

        {/* Search and Filter Inputs */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
          <div className="relative col-span-2">
            <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-gray-400">
              <FiSearch size={16} />
            </span>
            <input
              type="text"
              placeholder="Search by candidate name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-50 hover:bg-gray-50/80 border border-gray-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:bg-white transition"
            />
          </div>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-gray-400">
              <FiFilter size={14} />
            </span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-50 hover:bg-gray-50/80 border border-gray-200 rounded-xl text-xs font-bold text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:bg-white transition cursor-pointer"
            >
              <option value="ALL">All Statuses</option>
              <option value="APPLIED">Applied</option>
              <option value="UNDER_REVIEW">Under Review</option>
              <option value="SHORTLISTED">Shortlisted</option>
              <option value="SENT_TO_COMPANY">Sent to Company</option>
              <option value="SELECTED">Selected</option>
              <option value="REJECTED">Rejected</option>
            </select>
          </div>
        </div>

        {/* Table list */}
        {filteredApplications.length === 0 ? (
          <div className="text-center py-16 bg-white border border-gray-100 rounded-2xl shadow-sm">
            <span className="text-4xl block mb-2">📬</span>
            <p className="text-gray-500 font-bold text-sm">
              {applications.length === 0 ? "No applications yet for this internship" : "No applications match your filter"}
            </p>
          </div>
        ) : (
          <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100">
                    <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">
                      Candidate Name
                    </th>
                    <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">
                      Email
                    </th>
                    <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">
                      Branch + Year
                    </th>
                    <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">
                      Applied Date
                    </th>
                    <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">
                      Status
                    </th>
                    <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest text-center">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredApplications.map((app) => (
                    <tr
                      key={app._id}
                      className="hover:bg-gray-50/50 transition-colors"
                    >
                      <td className="px-6 py-4 font-bold text-gray-800 text-sm">
                        {app.fullName}
                      </td>
                      <td className="px-6 py-4 text-gray-600 text-sm">
                        {app.email}
                      </td>
                      <td className="px-6 py-4 text-gray-600 text-sm">
                        {app.branch || "—"} · Year {app.year}
                      </td>
                      <td className="px-6 py-4 text-gray-500 text-sm">
                        {formatAppliedDate(app.appliedAt || app.createdAt)}
                      </td>
                      <td className="px-6 py-4">
                        {getStatusBadge(app.status)}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <button
                          onClick={() => navigate(`/admin/applications/${app._id}`)}
                          className="px-3.5 py-1.5 bg-indigo-50 border border-indigo-100 hover:bg-indigo-100 text-indigo-600 font-bold text-xs rounded-lg transition"
                        >
                          View Details
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
  );
}
