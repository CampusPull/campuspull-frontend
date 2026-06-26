import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { getAllApplications, getApplicationStats } from "../../services/applicationService";
import { FiSearch, FiFilter, FiUser, FiArrowLeft, FiAlertCircle, FiLoader, FiX, FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { toast } from "react-toastify";

export default function CandidateDashboardPage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  // URL Sync state
  const search = searchParams.get("search") || "";
  const status = searchParams.get("status") || "ALL";
  const college = searchParams.get("college") || "";
  const branch = searchParams.get("branch") || "";
  const year = searchParams.get("year") || "ALL";
  const page = parseInt(searchParams.get("page") || "1", 10);
  const limit = 10;

  // Local inputs for debouncing
  const [searchInput, setSearchInput] = useState(search);
  const [collegeInput, setCollegeInput] = useState(college);
  const [branchInput, setBranchInput] = useState(branch);

  const [stats, setStats] = useState(null);
  const [applications, setApplications] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Sync local inputs if searchParams change from outside (e.g. Back/Clear)
  useEffect(() => {
    setSearchInput(search);
  }, [search]);

  useEffect(() => {
    setCollegeInput(college);
  }, [college]);

  useEffect(() => {
    setBranchInput(branch);
  }, [branch]);

  // Debounced search input (400ms)
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchInput !== search) {
        setSearchParams(prev => {
          const newParams = new URLSearchParams(prev);
          if (searchInput.trim()) {
            newParams.set("search", searchInput.trim());
          } else {
            newParams.delete("search");
          }
          newParams.set("page", "1");
          return newParams;
        });
      }
    }, 400);

    return () => clearTimeout(delayDebounceFn);
  }, [searchInput, search, setSearchParams]);

  // Debounced college input (400ms)
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (collegeInput !== college) {
        setSearchParams(prev => {
          const newParams = new URLSearchParams(prev);
          if (collegeInput.trim()) {
            newParams.set("college", collegeInput.trim());
          } else {
            newParams.delete("college");
          }
          newParams.set("page", "1");
          return newParams;
        });
      }
    }, 400);

    return () => clearTimeout(delayDebounceFn);
  }, [collegeInput, college, setSearchParams]);

  // Debounced branch input (400ms)
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (branchInput !== branch) {
        setSearchParams(prev => {
          const newParams = new URLSearchParams(prev);
          if (branchInput.trim()) {
            newParams.set("branch", branchInput.trim());
          } else {
            newParams.delete("branch");
          }
          newParams.set("page", "1");
          return newParams;
        });
      }
    }, 400);

    return () => clearTimeout(delayDebounceFn);
  }, [branchInput, branch, setSearchParams]);

  const calculateStats = (apps) => {
    return {
      totalApplications: apps.length,
      applied: apps.filter(a => a.status === "APPLIED").length,
      underReview: apps.filter(a => a.status === "UNDER_REVIEW").length,
      shortlisted: apps.filter(a => a.status === "SHORTLISTED").length,
      selected: apps.filter(a => a.status === "SELECTED").length,
      rejected: apps.filter(a => a.status === "REJECTED").length,
    };
  };

  // Fetch Stats & Applications
  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      // Build request params matching Week 2 API
      const params = {
        page,
        limit,
      };
      if (search) params.search = search;
      if (status !== "ALL") params.status = status;
      if (college) params.college = college;
      if (branch) params.branch = branch;
      if (year !== "ALL") params.year = year;

      let appsData = null;
      try {
        appsData = await getAllApplications(params);
      } catch (err) {
        console.error("Failed to fetch applications list:", err);
        throw err;
      }

      const appsList = appsData.applications || appsData.data || [];

      let statsData = null;
      try {
        const statsRes = await getApplicationStats();
        if (statsRes && statsRes.stats) {
          const s = statsRes.stats;
          const isAllZero = (s.totalApplications || 0) === 0 &&
                            (s.applied || 0) === 0 &&
                            (s.underReview || 0) === 0 &&
                            (s.shortlisted || 0) === 0 &&
                            (s.selected || 0) === 0 &&
                            (s.rejected || 0) === 0;
          if (isAllZero) {
            console.warn("Stats API returned all zeros, calculating stats client-side.");
            statsData = calculateStats(appsList);
          } else {
            statsData = s;
          }
        } else {
          statsData = calculateStats(appsList);
        }
      } catch (err) {
        console.warn("Failed to fetch application stats, calculating client-side:", err);
        statsData = calculateStats(appsList);
      }

      setStats(statsData);
      setApplications(appsList);
      setTotal(appsData.totalItems || appsData.total || appsList.length || 0);
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Failed to load candidates");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [search, status, college, branch, year, page]);

  const handleFilterChange = (key, value) => {
    setSearchParams(prev => {
      const newParams = new URLSearchParams(prev);
      if (value && value !== "ALL") {
        newParams.set(key, value);
      } else {
        newParams.delete(key);
      }
      newParams.set("page", "1");
      return newParams;
    });
  };

  const handleClearFilters = () => {
    setSearchInput("");
    setCollegeInput("");
    setBranchInput("");
    setSearchParams({});
  };

  const totalPages = Math.max(1, Math.ceil(total / limit));

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setSearchParams(prev => {
        const newParams = new URLSearchParams(prev);
        newParams.set("page", newPage.toString());
        return newParams;
      });
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

  return (
    <div className="p-6 pt-28 md:pt-32 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Title */}
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Candidate Dashboard</h1>
          <p className="text-sm font-medium text-gray-500 mt-1">
            Manage all internship candidates, filter profiles, and track evaluation status.
          </p>
        </div>

        {/* Section A: Stats Cards Row */}
        {loading && !stats ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4 animate-pulse">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm h-24" />
            ))}
          </div>
        ) : (
          stats && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
              <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm border-l-4 border-indigo-500">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1">Total Applications</span>
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
          )
        )}

        {/* Section B: Search & Filters Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3 bg-white p-4 rounded-2xl border border-gray-100 shadow-sm items-end">
          {/* Search */}
          <div className="relative">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1">Search</span>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400 pointer-events-none">
                <FiSearch size={14} />
              </span>
              <input
                type="text"
                placeholder="Search name/email..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="w-full pl-8 pr-3 py-2 bg-gray-50 hover:bg-gray-50/80 border border-gray-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:bg-white transition"
              />
            </div>
          </div>

          {/* Status Dropdown */}
          <div>
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1">Status</span>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400 pointer-events-none">
                <FiFilter size={12} />
              </span>
              <select
                value={status}
                onChange={(e) => handleFilterChange("status", e.target.value)}
                className="w-full pl-8 pr-3 py-2 bg-gray-50 hover:bg-gray-50/80 border border-gray-200 rounded-xl text-xs font-bold text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:bg-white transition cursor-pointer"
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

          {/* College Input */}
          <div>
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1">College</span>
            <input
              type="text"
              placeholder="Search college..."
              value={collegeInput}
              onChange={(e) => setCollegeInput(e.target.value)}
              className="w-full px-3 py-2 bg-gray-50 hover:bg-gray-50/80 border border-gray-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:bg-white transition"
            />
          </div>

          {/* Branch Input */}
          <div>
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1">Branch</span>
            <input
              type="text"
              placeholder="Search branch..."
              value={branchInput}
              onChange={(e) => setBranchInput(e.target.value)}
              className="w-full px-3 py-2 bg-gray-50 hover:bg-gray-50/80 border border-gray-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:bg-white transition"
            />
          </div>

          {/* Year Dropdown */}
          <div>
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1">Year</span>
            <select
              value={year}
              onChange={(e) => handleFilterChange("year", e.target.value)}
              className="w-full px-3 py-2 bg-gray-50 hover:bg-gray-50/80 border border-gray-200 rounded-xl text-xs font-bold text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:bg-white transition cursor-pointer"
            >
              <option value="ALL">All Years</option>
              <option value="1">1st Year</option>
              <option value="2">2nd Year</option>
              <option value="3">3rd Year</option>
              <option value="4">4th Year</option>
            </select>
          </div>

          {/* Clear Filters */}
          <button
            onClick={handleClearFilters}
            className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl shadow-sm transition h-[34px] flex items-center justify-center gap-1"
          >
            <FiX size={14} /> Clear Filters
          </button>
        </div>

        {/* Section C: Candidate Table */}
        {error ? (
          <div className="p-12 text-center bg-white border border-gray-100 rounded-2xl shadow-sm space-y-4">
            <div className="w-12 h-12 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto">
              <FiAlertCircle size={24} />
            </div>
            <p className="text-gray-700 font-bold">{error}</p>
            <button
              onClick={fetchData}
              className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl transition"
            >
              Retry
            </button>
          </div>
        ) : loading ? (
          /* Table Loading Skeleton Rows */
          <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
            <div className="p-6 space-y-4 animate-pulse">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex justify-between items-center py-4 border-b border-gray-50 last:border-b-0">
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
        ) : applications.length === 0 ? (
          <div className="p-12 text-center bg-white border border-gray-100 rounded-2xl shadow-sm">
            <span className="text-4xl block mb-3">📬</span>
            <p className="text-gray-500 font-bold">No candidates found matching your filters.</p>
            <button
              onClick={handleClearFilters}
              className="mt-3 text-xs text-indigo-600 hover:text-indigo-800 font-black"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Desktop Table */}
            <div className="hidden md:block bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-100">
                      <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Name</th>
                      <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Internship</th>
                      <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">College</th>
                      <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Applied Date</th>
                      <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Status</th>
                      <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {applications.map((app) => (
                      <tr key={app._id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="px-6 py-4 font-bold text-gray-800 text-sm">{app.fullName}</td>
                        <td className="px-6 py-4 text-gray-600 text-sm font-semibold">{app.internshipTitle || app.internshipId?.title || app.internship?.title || "—"}</td>
                        <td className="px-6 py-4 text-gray-600 text-sm font-semibold">{app.college || "—"}</td>
                        <td className="px-6 py-4 text-gray-500 text-sm font-semibold">{formatAppliedDate(app.appliedAt || app.createdAt)}</td>
                        <td className="px-6 py-4">{getStatusBadge(app.status)}</td>
                        <td className="px-6 py-4 text-center">
                          <button
                            onClick={() => navigate(`/admin/applications/${app._id}`)}
                            className="px-3.5 py-1.5 bg-indigo-50 border border-indigo-100 hover:bg-indigo-100 text-indigo-600 font-bold text-xs rounded-lg transition"
                          >
                            View Candidate
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Mobile View (Cards) */}
            <div className="md:hidden space-y-4">
              {applications.map((app) => (
                <div key={app._id} className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-bold text-gray-800 text-sm">{app.fullName}</h4>
                      <p className="text-gray-500 text-[10px] font-semibold mt-0.5">{app.email}</p>
                    </div>
                    {getStatusBadge(app.status)}
                  </div>
                  <div className="grid grid-cols-2 gap-2 pt-2 border-t border-gray-50 text-xs">
                    <div>
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wide block">Internship</span>
                      <span className="font-semibold text-gray-700">{app.internshipTitle || app.internshipId?.title || app.internship?.title || "—"}</span>
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wide block">College</span>
                      <span className="font-semibold text-gray-700">{app.college || "—"}</span>
                    </div>
                    <div className="col-span-2 mt-1">
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wide block">Applied Date</span>
                      <span className="font-semibold text-gray-600">{formatAppliedDate(app.appliedAt || app.createdAt)}</span>
                    </div>
                  </div>
                  <div className="pt-2 border-t border-gray-50">
                    <button
                      onClick={() => navigate(`/admin/applications/${app._id}`)}
                      className="w-full py-2 bg-indigo-50 border border-indigo-100 hover:bg-indigo-100 text-indigo-600 font-bold text-xs rounded-xl transition text-center"
                    >
                      View Candidate
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination Controls */}
            <div className="flex items-center justify-between px-4 py-3 border-t bg-gray-50 rounded-2xl border border-gray-100 shadow-sm">
              <button
                disabled={page === 1}
                onClick={() => handlePageChange(page - 1)}
                className="px-4 py-2 text-xs border border-gray-200 rounded-xl bg-white hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed font-bold text-gray-700 transition flex items-center gap-1"
              >
                <FiChevronLeft size={14} /> Previous
              </button>

              <span className="text-xs text-gray-650 font-bold">
                Page {page} of {totalPages}
              </span>

              <button
                disabled={page >= totalPages}
                onClick={() => handlePageChange(page + 1)}
                className="px-4 py-2 text-xs border border-gray-200 rounded-xl bg-white hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed font-bold text-gray-700 transition flex items-center gap-1"
              >
                Next <FiChevronRight size={14} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
