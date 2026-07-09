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
  const [mentorshipRequests, setMentorshipRequests] = useState([]);
  const [mentors, setMentors] = useState([]);
  const [revenueStats, setRevenueStats] = useState({
    totalRevenue: 0,
    successfulPayments: 0,
    refunds: 0,
    revenueThisMonth: 0,
  });
  const [payments, setPayments] = useState([]);

  const [requestsPagination, setRequestsPagination] = useState({
    totalPages: 1,
  });

  const [mentorshipRequestsPagination, setMentorshipRequestsPagination] =
    useState({ totalPages: 1 });

  const [sessionsPagination, setSessionsPagination] = useState({
    totalPages: 1,
  });

  const [mentorsPagination, setMentorsPagination] = useState({ totalPages: 1 });
  const [paymentsPagination, setPaymentsPagination] = useState({ totalPages: 1 });

  // Loading & Error States
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState(null); // Track which ID is being processed
  const [refunding, setRefunding] = useState(null); // Track refund loading
  const [completingSession, setCompletingSession] = useState(null); // Track session completion loading

  const [requestsPage, setRequestsPage] = useState(1);
  const [mentorshipRequestsPage, setMentorshipRequestsPage] = useState(1);
  const [sessionsPage, setSessionsPage] = useState(1);
  const [mentorsPage, setMentorsPage] = useState(1);
  const [paymentsPage, setPaymentsPage] = useState(1);

  useEffect(() => {
    fetchDashboardData();
  }, [requestsPage, mentorshipRequestsPage, sessionsPage, mentorsPage, paymentsPage]);

  const fetchDashboardData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [statsRes, reqsRes, mentorshipReqsRes, sessRes, mentorsRes, revRes, paymentsRes] =
        await Promise.all([
          api.get("/admin/mentorship-stats"),
          api.get(`/admin/mentor-requests?page=${requestsPage}&limit=10`),
          api.get(
            `/admin/mentorship-requests?page=${mentorshipRequestsPage}&limit=10`,
          ),
          api.get(`/admin/sessions?page=${sessionsPage}&limit=10`),
          api.get(`/admin/mentors?page=${mentorsPage}&limit=10`),
          api.get("/admin/revenue").catch(() => ({ data: { totalRevenue: 0, successfulPayments: 0, refunds: 0, revenueThisMonth: 0 } })),
          api.get(`/admin/payments?page=${paymentsPage}&limit=10`).catch(() => ({ data: { data: [], pagination: { totalPages: 1 } } })),
        ]);

      setStats(statsRes.data || {});
      setRequests(reqsRes.data.data || []);
      setMentorshipRequests(mentorshipReqsRes.data.data || []);
      setSessions(sessRes.data.data || []);
      setMentors(mentorsRes.data.data || []);
      setRevenueStats(revRes.data || { totalRevenue: 0, successfulPayments: 0, refunds: 0, revenueThisMonth: 0 });
      setPayments(paymentsRes.data?.data || paymentsRes.data || []);

      setRequestsPagination(
        reqsRes.data.pagination || {
          totalPages: 1,
        },
      );

      setMentorshipRequestsPagination(
        mentorshipReqsRes.data.pagination || {
          totalPages: 1,
        },
      );

      setSessionsPagination(
        sessRes.data.pagination || {
          totalPages: 1,
        },
      );

      setMentorsPagination(
        mentorsRes.data.pagination || {
          totalPages: 1,
        },
      );

      setPaymentsPagination(
        paymentsRes.data?.pagination || {
          totalPages: 1,
        },
      );
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
    if (!window.confirm("Are you sure you want to reject this request?"))
      return;

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

  const handleMarkSessionComplete = async (sessionId) => {
    if (!window.confirm("Are you sure you want to mark this session as completed?")) return;
    setCompletingSession(sessionId);
    try {
      await api.patch(`/admin/sessions/${sessionId}/complete`);
      toast.success("Session marked as completed successfully");
      
      // Update local sessions state
      setSessions(prev => prev.map(s => s._id === sessionId ? { ...s, status: "COMPLETED", completedAt: new Date().toISOString() } : s));
      
      // Refresh Stats
      setStats(prev => ({
        ...prev,
        completedSessions: (prev.completedSessions || 0) + 1,
        scheduledSessions: Math.max(0, (prev.scheduledSessions || 1) - 1)
      }));
    } catch (err) {
      console.error("Mark session complete error:", err);
      toast.error(err.response?.data?.message || "Failed to complete session");
    } finally {
      setCompletingSession(null);
    }
  };

  const handleIssueRefund = async (paymentId) => {
    if (!window.confirm("Are you sure you want to issue a refund for this payment? This will refund ₹29 to the student.")) return;
    setRefunding(paymentId);
    try {
      await api.post(`/admin/refund/${paymentId}`);
      toast.success("Refund processed successfully");
      
      // Update local payments state
      setPayments(prev => prev.map(p => p._id === paymentId ? { ...p, status: "REFUNDED", refundedAt: new Date().toISOString() } : p));
      
      // Refresh revenue stats
      const revRes = await api.get("/admin/revenue").catch(() => null);
      if (revRes) setRevenueStats(revRes.data);
    } catch (err) {
      console.error("Refund error:", err);
      toast.error(err.response?.data?.message || "Failed to issue refund");
    } finally {
      setRefunding(null);
    }
  };

  if (loading) {
    return (
      <div className="p-6 pt-28 md:pt-32 bg-gray-50 min-h-screen flex flex-col items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500 mb-4"></div>
        <p className="text-gray-500 font-medium tracking-wide">
          Loading Dashboard...
        </p>
      </div>
    );
  }

  // Helper date formatter
  const formatDateTime = (dateString) => {
    if (!dateString) return "N/A";

    const d = new Date(dateString);

    return isNaN(d)
      ? "N/A"
      : d.toLocaleString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
          hour: "numeric",
          minute: "2-digit",
          hour12: true,
        });
  };

  // Define border colors for stats cards
  const statBorderColors = [
    "border-indigo-500",
    "border-green-500",
    "border-blue-500",
    "border-amber-500",
    "border-purple-500",
    "border-pink-500",
  ];

  // Extract status badge class logic
  const getStatusBadgeClass = (status) => {
    if (status === "COMPLETED") {
      return "bg-green-100 text-green-800";
    } else if (status === "SCHEDULED") {
      return "bg-blue-100 text-blue-800";
    } else {
      return "bg-amber-100 text-amber-800";
    }
  };

  // Extract session status badge class logic
  const getSessionStatusBadgeClass = (status) => {
    if (status === "COMPLETED") {
      return "bg-green-100 text-green-800";
    } else if (status === "SCHEDULED") {
      return "bg-blue-100 text-blue-800";
    } else {
      return "bg-amber-100 text-amber-800";
    }
  };

  return (
    <div className="p-6 pt-28 md:pt-32 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">
            Mentorship Dashboard
          </h1>
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

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            {
              label: "Total Sessions",
              value: stats.totalSessions,
            },

            {
              label: "Completed Sessions",
              value: stats.completedSessions,
            },

            {
              label: "Scheduled Sessions",
              value: stats.scheduledSessions,
            },

            {
              label: "Pending Mentorship Requests",
              value: stats.pendingMentorshipRequests,
            },

            {
              label: "Total Mentors",
              value: stats.totalMentors,
            },

            {
              label: "Mentor Requests",
              value: stats.pendingMentors,
            },
          ].map((stat, idx) => (
            <div
              key={idx}
              className={`bg-white p-6 rounded-lg shadow-sm border-l-4 ${statBorderColors[idx]}`}
            >
              <h3 className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-2">
                {stat.label}
              </h3>
              <p className="text-3xl font-bold text-gray-900">
                {stat.value || 0}
              </p>
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
            <p className="text-gray-500 font-medium">
              All caught up! No pending mentor requests.
            </p>
          </div>
        ) : (
          <div className="overflow-hidden border rounded-lg">
           <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                    Domains
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                    Experience
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                    Applied On
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {requests.map((req) => (
                  <tr
                    key={req._id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-4 py-3 whitespace-nowrap text-sm font-bold text-gray-900">
                      {req.name || "N/A"}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                      {req.email || "N/A"}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-500">
                      {req.domains?.length ? (
                        <div className="flex flex-wrap gap-1 max-w-[200px]">
                          {req.domains.map((d, i) => (
                            <span
                              key={i}
                              className="bg-indigo-50 text-indigo-600 border border-indigo-100 px-2 py-0.5 rounded-md text-xs font-semibold"
                            >
                              {d}
                            </span>
                          ))}
                        </div>
                      ) : (
                        "None specified"
                      )}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                      {req.yearsOfExperience || 0} Yoe
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                      {formatDateTime(req.createdAt)}
                    </td>
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
            <div className="flex items-center justify-between px-4 py-3 border-t bg-gray-50">
              <button
                disabled={requestsPage === 1}
                onClick={() => setRequestsPage((prev) => prev - 1)}
                className="px-4 py-2 text-sm border rounded-md bg-white hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>

              <span className="text-sm text-gray-600">
                Page {requestsPage} of {requestsPagination.totalPages}
              </span>

              <button
                disabled={requestsPage >= requestsPagination.totalPages}
                onClick={() => setRequestsPage((prev) => prev + 1)}
                className="px-4 py-2 text-sm border rounded-md bg-white hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </section>

      {/* ══════════════════════════════════════
    SECTION 3 — MENTORSHIP REQUESTS
    ══════════════════════════════════════ */}
      <section className="mb-8 bg-white p-6 rounded-lg shadow-sm">
        <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
          <span>🤝</span> Mentorship Requests
        </h2>

        {mentorshipRequests.length === 0 ? (
          <div className="text-center py-10 border-2 border-dashed border-gray-200 rounded-lg bg-gray-50">
            <span className="text-4xl block mb-3">📭</span>
            <p className="text-gray-500 font-medium">
              No mentorship requests found.
            </p>
          </div>
        ) : (
          <div className="overflow-hidden border rounded-lg">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                    Mentor
                  </th>

                  <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                    Mentee
                  </th>

                  <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                    Goal
                  </th>

                  <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                    Message
                  </th>

                  <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                    Status
                  </th>

                  <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                    Requested At
                  </th>
                </tr>
              </thead>

              <tbody className="bg-white divide-y divide-gray-200">
                {mentorshipRequests.map((req) => (
                  <tr
                    key={req._id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    {/* Mentor */}
                    <td className="px-4 py-3 whitespace-nowrap text-sm">
                      <strong className="text-indigo-600">
                        {req.mentor?.name || "N/A"}
                      </strong>

                      <br />

                      <span className="text-xs text-gray-500">
                        {req.mentor?.email || "N/A"}
                      </span>
                    </td>

                    {/* Mentee */}
                    <td className="px-4 py-3 whitespace-nowrap text-sm">
                      <strong className="text-blue-600">
                        {req.mentee?.name || "N/A"}
                      </strong>

                      <br />

                      <span className="text-xs text-gray-500">
                        {req.mentee?.email || "N/A"}
                      </span>
                    </td>

                    {/* Domain */}
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                      {req.goal || "General"}
                    </td>

                    {/* Message */}
                    <td className="px-4 py-3 text-sm text-gray-500 max-w-xs">
                      <div className="truncate">
                        {req.message || "No message"}
                      </div>
                    </td>

                    {/* Status */}
                    <td className="px-4 py-3 whitespace-nowrap text-sm">
                      {(() => {
                        const getStatusClasses = (status) => {
                          if (status === "COMPLETED")
                            return "bg-green-100 text-green-800";
                          if (status === "ACCEPTED")
                            return "bg-blue-100 text-blue-800";
                          if (status === "REJECTED")
                            return "bg-red-100 text-red-800";
                          return "bg-amber-100 text-amber-800";
                        };

                        return (
                          <span
                            className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClasses(req.status)}`}
                          >
                            {req.status || "PENDING"}
                          </span>
                        );
                      })()}
                    </td>

                    {/* Requested At */}
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                      {formatDateTime(req.createdAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            </div>
            <div className="flex items-center justify-between px-4 py-3 border-t bg-gray-50">
              <button
                disabled={mentorshipRequestsPage === 1}
                onClick={() => setMentorshipRequestsPage((prev) => prev - 1)}
                className="px-4 py-2 text-sm border rounded-md bg-white hover:bg-gray-100 disabled:opacity-50"
              >
                Previous
              </button>

              <span className="text-sm text-gray-600">
                Page {mentorshipRequestsPage} of{" "}
                {mentorshipRequestsPagination.totalPages}
              </span>

              <button
                disabled={
                  mentorshipRequestsPage >=
                  mentorshipRequestsPagination.totalPages
                }
                onClick={() => setMentorshipRequestsPage((prev) => prev + 1)}
                className="px-4 py-2 text-sm border rounded-md bg-white hover:bg-gray-100 disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </section>

      {/* ══════════════════════════════════════
          SECTION 4 — SESSIONS
      ══════════════════════════════════════ */}
      <section className="bg-white p-6 rounded-lg shadow-sm">
        <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
          <span>📅</span> Sessions Directory
        </h2>

        {sessions.length === 0 ? (
          <div className="text-center py-10 border-2 border-dashed border-gray-200 rounded-lg bg-gray-50">
            <span className="text-4xl block mb-3">🗓️</span>
            <p className="text-gray-500 font-medium">
              No sessions have been initiated yet.
            </p>
          </div>
        ) : (
          <div className="overflow-hidden border rounded-lg">
           <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                    Mentor
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                    Mentee
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                    Scheduled At
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                    Completed At
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                    Conn. Link
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {sessions.map((sess) => (
                  <tr
                    key={sess._id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-4 py-3 whitespace-nowrap text-sm">
                      <strong className="text-indigo-600">
                        {sess.mentor?.name || "N/A"}
                      </strong>
                      <br />
                      <span className="text-xs text-gray-500">
                        {sess.mentor?.email}
                      </span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm">
                      <strong className="text-blue-600">
                        {sess.mentee?.name || "N/A"}
                      </strong>
                      <br />
                      <span className="text-xs text-gray-500">
                        {sess.mentee?.email}
                      </span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm">
                      <span
                        className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          sess.status === "COMPLETED"
                            ? "bg-green-100 text-green-800"
                            : sess.status === "SCHEDULED"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-amber-100 text-amber-800"
                        }`}
                      >
                        {sess.status || "PENDING"}
                      </span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                      {formatDateTime(sess.scheduledAt)}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                      {formatDateTime(sess.completedAt)}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm font-medium">
                      <div className="flex flex-col gap-1.5">
                        {sess.connectionLink ? (
                          <a
                            href={sess.connectionLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-indigo-600 hover:text-indigo-900 transition-colors"
                          >
                            Join Link ↗
                          </a>
                        ) : (
                          <span className="text-gray-400 text-xs italic">
                            Pending link
                          </span>
                        )}
                        {sess.status !== "COMPLETED" && (
                          <button
                            onClick={() => handleMarkSessionComplete(sess._id)}
                            disabled={completingSession === sess._id}
                            className="text-green-600 hover:text-green-800 disabled:opacity-50 text-xs text-left font-bold transition-colors cursor-pointer"
                          >
                            {completingSession === sess._id ? "..." : "✓ Complete"}
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            </div>
            <div className="flex items-center justify-between px-4 py-3 border-t bg-gray-50">
              <button
                disabled={sessionsPage === 1}
                onClick={() => setSessionsPage((prev) => prev - 1)}
                className="px-4 py-2 text-sm border rounded-md bg-white hover:bg-gray-100 disabled:opacity-50"
              >
                Previous
              </button>

              <span className="text-sm text-gray-600">
                Page {sessionsPage} of {sessionsPagination.totalPages}
              </span>

              <button
                disabled={sessionsPage >= sessionsPagination.totalPages}
                onClick={() => setSessionsPage((prev) => prev + 1)}
                className="px-4 py-2 text-sm border rounded-md bg-white hover:bg-gray-100 disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </section>

      {/* ══════════════════════════════════════
    SECTION 5 — ALL MENTORS
══════════════════════════════════════ */}
      <section className="mt-8 bg-white p-6 rounded-lg shadow-sm">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <span>🧑‍🏫</span> All Mentors
          </h2>

          <span className="text-sm text-gray-500">Total: {mentors.length}</span>
        </div>

        {mentors.length === 0 ? (
          <div className="text-center py-10 border-2 border-dashed border-gray-200 rounded-lg bg-gray-50">
            <span className="text-4xl block mb-3">📭</span>

            <p className="text-gray-500 font-medium">No mentors found.</p>
          </div>
        ) : (
          <div className="overflow-hidden border rounded-lg">
           <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                    Mentor
                  </th>

                  <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                    Domains
                  </th>

                  <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                    Experience
                  </th>

                  <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                    Sessions
                  </th>

                  <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                    Students
                  </th>

                  <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                    Rating
                  </th>

                  <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                    Status
                  </th>

                  <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                    Active
                  </th>

                  <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                    Weekly Slots
                  </th>

                  <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                    Joined
                  </th>
                </tr>
              </thead>

              <tbody className="bg-white divide-y divide-gray-200">
                {mentors.map((mentor) => (
                  <tr
                    key={mentor._id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    {/* Mentor */}
                    <td className="px-4 py-3 whitespace-nowrap text-sm">
                      <strong className="text-indigo-600">
                        {mentor.user?.name || "N/A"}
                      </strong>

                      <br />

                      <span className="text-xs text-gray-500">
                        {mentor.user?.email || "N/A"}
                      </span>
                    </td>

                    {/* Domains */}
                    <td className="px-4 py-3 text-sm text-gray-500">
                      {mentor.domains?.length ? (
                        <div className="flex flex-wrap gap-1 max-w-[220px]">
                          {mentor.domains.map((d, i) => (
                            <span
                              key={i}
                              className="bg-indigo-50 text-indigo-600 border border-indigo-100 px-2 py-0.5 rounded-md text-xs font-semibold"
                            >
                              {d}
                            </span>
                          ))}
                        </div>
                      ) : (
                        "None"
                      )}
                    </td>

                    {/* Experience */}
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                      {mentor.yearsOfExperience || 0} yrs
                    </td>

                    {/* Sessions */}
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                      {mentor.sessionsCompleted || 0}
                    </td>

                    {/* Students */}
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                      {mentor.studentsMentored || 0}
                    </td>

                    {/* Rating */}
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                      ⭐ {mentor.rating || 0}
                      <span className="text-xs text-gray-400 ml-1">
                        ({mentor.totalReviews || 0})
                      </span>
                    </td>

                    {/* Status */}
                    <td className="px-4 py-3 whitespace-nowrap text-sm">
                      <span
                        className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          mentor.mentorStatus === "APPROVED"
                            ? "bg-green-100 text-green-800"
                            : mentor.mentorStatus === "REJECTED"
                              ? "bg-red-100 text-red-800"
                              : "bg-amber-100 text-amber-800"
                        }`}
                      >
                        {mentor.mentorStatus || "PENDING"}
                      </span>
                    </td>

                    {/* Active */}
                    <td className="px-4 py-3 whitespace-nowrap text-sm">
                      {mentor.isActive ? (
                        <span className="text-green-600 font-semibold">
                          Active
                        </span>
                      ) : (
                        <span className="text-gray-400">Inactive</span>
                      )}
                    </td>

                    {/* Weekly Slots */}
                    <td className="px-4 py-3 text-sm text-gray-500">
                      {mentor.availability?.weeklySlots?.length ? (
                        <div className="space-y-1">
                          {mentor.availability.weeklySlots
                            .slice(0, 2)
                            .map((slot, idx) => (
                              <div
                                key={idx}
                                className="text-xs bg-gray-100 px-2 py-1 rounded-md"
                              >
                                {slot.day} • {slot.startTime} - {slot.endTime}
                              </div>
                            ))}

                          {mentor.availability.weeklySlots.length > 2 && (
                            <span className="text-xs text-gray-400">
                              +{mentor.availability.weeklySlots.length - 2} more
                            </span>
                          )}
                        </div>
                      ) : (
                        <span className="text-gray-400 text-xs">No slots</span>
                      )}
                    </td>

                    {/* Joined */}
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                      {formatDateTime(mentor.createdAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            </div>
            <div className="flex items-center justify-between px-4 py-3 border-t bg-gray-50">
              <button
                disabled={mentorsPage === 1}
                onClick={() => setMentorsPage((prev) => prev - 1)}
                className="px-4 py-2 text-sm border rounded-md bg-white hover:bg-gray-100 disabled:opacity-50"
              >
                Previous
              </button>

              <span className="text-sm text-gray-600">
                Page {mentorsPage} of {mentorsPagination.totalPages}
              </span>

              <button
                disabled={mentorsPage >= mentorsPagination.totalPages}
                onClick={() => setMentorsPage((prev) => prev + 1)}
                className="px-4 py-2 text-sm border rounded-md bg-white hover:bg-gray-100 disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </section>

      {/* ══════════════════════════════════════
          SECTION 6 — REVENUE & TRANSACTIONS
      ══════════════════════════════════════ */}
      <section className="mt-8 bg-white p-6 rounded-lg shadow-sm border-l-4 border-emerald-500">
        <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
          <span>💰</span> Revenue & Payments Dashboard
        </h2>

        {/* Revenue Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 shadow-sm">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Total Revenue</span>
            <p className="text-2xl font-black text-slate-800">
              {new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", minimumFractionDigits: 0 }).format(revenueStats.totalRevenue || 0)}
            </p>
          </div>
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 shadow-sm">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Revenue This Month</span>
            <p className="text-2xl font-black text-slate-800">
              {new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", minimumFractionDigits: 0 }).format(revenueStats.revenueThisMonth || 0)}
            </p>
          </div>
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 shadow-sm">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Successful Payments</span>
            <p className="text-2xl font-black text-green-600">{revenueStats.successfulPayments || 0}</p>
          </div>
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 shadow-sm">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Refunded Payments</span>
            <p className="text-2xl font-black text-red-650">{revenueStats.refunds || 0}</p>
          </div>
        </div>

        {/* Payments Table */}
        <h3 className="text-sm font-bold text-slate-700 mb-3 font-inter">Transactions Ledger</h3>
        {payments.length === 0 ? (
          <div className="text-center py-6 border-2 border-dashed border-slate-100 rounded-lg bg-slate-50">
            <p className="text-xs text-slate-500 font-semibold">No transactions recorded yet.</p>
          </div>
        ) : (
          <div className="overflow-hidden border rounded-lg">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-4 py-2.5 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Student</th>
                    <th className="px-4 py-2.5 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Mentor</th>
                    <th className="px-4 py-2.5 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Amount</th>
                    <th className="px-4 py-2.5 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                    <th className="px-4 py-2.5 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Date</th>
                    <th className="px-4 py-2.5 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-slate-100">
                  {payments.map((p) => {
                    const studentName = p.studentId?.name || "Student";
                    const mentorName = p.mentorId?.userId?.name || p.mentorId?.name || "Mentor";
                    const formattedDate = formatDateTime(p.createdAt);
                    const isPaid = p.status === "SUCCESS" || p.status === "PAID";
                    
                    return (
                      <tr key={p._id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-4 py-2.5 text-xs font-semibold text-slate-800">{studentName}</td>
                        <td className="px-4 py-2.5 text-xs font-semibold text-slate-800">{mentorName}</td>
                        <td className="px-4 py-2.5 text-xs font-extrabold text-slate-900">
                          {new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", minimumFractionDigits: 0 }).format(p.amount || 29)}
                        </td>
                        <td className="px-4 py-2.5 text-xs">
                          <span className={`px-2 py-0.5 inline-flex text-[10px] leading-4 font-bold rounded-full ${
                            p.status === "SUCCESS" || p.status === "PAID"
                              ? "bg-green-100 text-green-800"
                              : p.status === "REFUNDED"
                                ? "bg-gray-100 text-gray-800"
                                : "bg-red-100 text-red-800"
                          }`}>
                            {p.status || "PENDING"}
                          </span>
                        </td>
                        <td className="px-4 py-2.5 text-xs text-slate-500">{formattedDate}</td>
                        <td className="px-4 py-2.5 text-xs font-medium">
                          {isPaid ? (
                            <button
                              onClick={() => handleIssueRefund(p._id)}
                              disabled={refunding === p._id}
                              className="bg-red-500 hover:bg-red-600 disabled:opacity-50 text-white px-2 py-1 rounded text-[10px] font-bold transition-colors cursor-pointer"
                            >
                              {refunding === p._id ? "..." : "Refund"}
                            </button>
                          ) : (
                            <span className="text-slate-400 text-[10px] italic">No action</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <div className="flex items-center justify-between px-4 py-2 border-t bg-slate-50">
              <button
                disabled={paymentsPage === 1}
                onClick={() => setPaymentsPage((prev) => prev - 1)}
                className="px-3 py-1 text-xs border rounded bg-white hover:bg-slate-100 disabled:opacity-50"
              >
                Previous
              </button>
              <span className="text-xs text-slate-600">Page {paymentsPage} of {paymentsPagination.totalPages}</span>
              <button
                disabled={paymentsPage >= paymentsPagination.totalPages}
                onClick={() => setPaymentsPage((prev) => prev + 1)}
                className="px-3 py-1 text-xs border rounded bg-white hover:bg-slate-100 disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </section>
    </div>
  );
};

export default AdminMentorship;
