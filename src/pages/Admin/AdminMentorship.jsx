import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import api from "../../utils/api";

const AdminMentorship = () => {
  // State
  const [stats, setStats] = useState({
    totalMentors: 0,
    pendingMentors: 0,
    totalRequests: 0,
    totalSessions: 0,
    completedSessions: 0,
  });
  const [requests, setRequests] = useState([]);
  const [sessions, setSessions] = useState([]);
  
  // Loading & Error States
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState(null); // Track which ID is being processed

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [statsRes, reqsRes, sessRes] = await Promise.all([
        api.get("/admin/stats"),
        api.get("/admin/mentor-requests"),
        api.get("/admin/sessions"),
      ]);

      setStats(statsRes.data || {});
      setRequests(reqsRes.data || []);
      setSessions(sessRes.data || []);
    } catch (err) {
      console.error("Dashboard fetch error:", err);
      setError("Failed to load dashboard data. Please try again.");
      toast.error("Failed to fetch dashboard data");
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    setActionLoading(id);
    try {
      await api.patch(`/admin/mentor/${id}/approve`);
      toast.success("Mentor approved successfully");
      
      // Update local state without refetching immediately
      setRequests((prev) => prev.filter((req) => req._id !== id));
      setStats((prev) => ({
        ...prev,
        pendingMentors: Math.max(0, prev.pendingMentors - 1),
        totalMentors: prev.totalMentors + 1,
      }));
    } catch (err) {
      console.error("Approval error:", err);
      toast.error(err.response?.data?.message || "Failed to approve mentor");
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (id) => {
    if (!window.confirm("Are you sure you want to reject this request?")) return;
    
    setActionLoading(id);
    try {
      await api.patch(`/admin/mentor/${id}/reject`);
      toast.success("Mentor rejected successfully");
      
      // Update local state
      setRequests((prev) => prev.filter((req) => req._id !== id));
      setStats((prev) => ({
        ...prev,
        pendingMentors: Math.max(0, prev.pendingMentors - 1),
      }));
    } catch (err) {
      console.error("Rejection error:", err);
      toast.error(err.response?.data?.message || "Failed to reject mentor");
    } finally {
      setActionLoading(null);
    }
  };

  if (loading) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen flex flex-col items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500 mb-4"></div>
        <p className="text-gray-500 font-medium tracking-wide">Loading Dashboard...</p>
      </div>
    );
  }

  // Helper date formatter
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const d = new Date(dateString);
    return isNaN(d) ? "N/A" : d.toLocaleDateString("en-US", { year: 'numeric', month: 'short', day: 'numeric' });
  };

  // Define border colors for stats cards
  const statBorderColors = [
    "border-indigo-500",
    "border-amber-500",
    "border-blue-500",
    "border-purple-500",
    "border-green-500",
  ];

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Mentorship Dashboard</h1>
          <p className="text-sm font-medium text-gray-500 mt-1">
            Manage mentor approvals, sessions, and platform-wide stats.
          </p>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md mb-8 flex justify-between items-center">
          <div className="flex items-center">
            <span className="text-red-500 font-bold mr-2">⚠️</span>
            <span className="text-red-700">{error}</span>
          </div>
          <button 
            className="bg-red-500 hover:bg-red-600 text-white font-bold py-1 px-4 rounded text-sm transition-colors" 
            onClick={fetchDashboardData}
          >
            Retry
          </button>
        </div>
      )}

      {/* ══════════════════════════════════════
          SECTION 1 — STATS
      ══════════════════════════════════════ */}
      <section className="mb-8">
        <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
          <span>📊</span> Platform Stats
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {[
            { label: "Total Mentors", value: stats.totalMentors },
            { label: "Pending Mentors", value: stats.pendingMentors },
            { label: "Total Requests", value: stats.totalRequests },
            { label: "Total Sessions", value: stats.totalSessions },
            { label: "Completed Sessions", value: stats.completedSessions },
          ].map((stat, idx) => (
            <div key={idx} className={`bg-white p-6 rounded-lg shadow-sm border-l-4 ${statBorderColors[idx]}`}>
              <h3 className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-2">{stat.label}</h3>
              <p className="text-3xl font-bold text-gray-900">{stat.value || 0}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════
          SECTION 2 — MENTOR REQUESTS
      ══════════════════════════════════════ */}
      <section className="mb-8 bg-white p-6 rounded-lg shadow-sm">
        <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
          <span>🎓</span> Mentor Requests
        </h2>

        {requests.length === 0 ? (
          <div className="text-center py-10 border-2 border-dashed border-gray-200 rounded-lg bg-gray-50">
            <span className="text-4xl block mb-3">✨</span>
            <p className="text-gray-500 font-medium">All caught up! No pending mentor requests.</p>
          </div>
        ) : (
          <div className="overflow-x-auto border rounded-lg">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Email</th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Domains</th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Experience</th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Applied On</th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {requests.map((req) => (
                  <tr key={req._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 whitespace-nowrap text-sm font-bold text-gray-900">{req.name || "N/A"}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{req.email || "N/A"}</td>
                    <td className="px-4 py-3 text-sm text-gray-500">
                      {req.domains?.length ? (
                        <div className="flex flex-wrap gap-1 max-w-[200px]">
                          {req.domains.map((d, i) => (
                            <span key={i} className="bg-indigo-50 text-indigo-600 border border-indigo-100 px-2 py-0.5 rounded-md text-xs font-semibold">
                              {d}
                            </span>
                          ))}
                        </div>
                      ) : "None specified"}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{req.yearsOfExperience || 0} Yoe</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{formatDate(req.createdAt)}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleApprove(req._id)}
                          disabled={actionLoading === req._id}
                          className="bg-green-500 hover:bg-green-600 disabled:opacity-50 text-white px-3 py-1.5 rounded-md text-xs font-medium transition-colors"
                        >
                          {actionLoading === req._id ? "..." : "Approve"}
                        </button>
                        <button
                          onClick={() => handleReject(req._id)}
                          disabled={actionLoading === req._id}
                          className="bg-red-500 hover:bg-red-600 disabled:opacity-50 text-white px-3 py-1.5 rounded-md text-xs font-medium transition-colors"
                        >
                           {actionLoading === req._id ? "..." : "Reject"}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* ══════════════════════════════════════
          SECTION 3 — SESSIONS
      ══════════════════════════════════════ */}
      <section className="bg-white p-6 rounded-lg shadow-sm">
        <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
          <span>📅</span> Sessions Directory
        </h2>

        {sessions.length === 0 ? (
           <div className="text-center py-10 border-2 border-dashed border-gray-200 rounded-lg bg-gray-50">
             <span className="text-4xl block mb-3">🗓️</span>
             <p className="text-gray-500 font-medium">No sessions have been initiated yet.</p>
           </div>
        ) : (
          <div className="overflow-x-auto border rounded-lg">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Mentor</th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Mentee</th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Scheduled At</th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Conn. Link</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {sessions.map((sess) => (
                  <tr key={sess._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 whitespace-nowrap text-sm">
                      <strong className="text-indigo-600">{sess.mentor?.name || "N/A"}</strong><br/>
                      <span className="text-xs text-gray-500">{sess.mentor?.email}</span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm">
                       <strong className="text-blue-600">{sess.mentee?.name || "N/A"}</strong><br/>
                       <span className="text-xs text-gray-500">{sess.mentee?.email}</span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        sess.status === "COMPLETED" ? "bg-green-100 text-green-800" :
                        sess.status === "SCHEDULED" ? "bg-blue-100 text-blue-800" :
                        "bg-amber-100 text-amber-800"
                      }`}>
                        {sess.status || "PENDING"}
                      </span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{formatDate(sess.scheduledAt)}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm font-medium">
                      {sess.connectionLink ? (
                        <a href={sess.connectionLink} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:text-indigo-900 transition-colors">
                          Join Link ↗
                        </a>
                      ) : (
                        <span className="text-gray-400 text-xs italic">Pending link</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

    </div>
  );
};

export default AdminMentorship;
