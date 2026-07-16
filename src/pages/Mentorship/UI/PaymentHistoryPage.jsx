import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../../utils/api";
import {
  FiArrowLeft,
  FiAlertCircle,
  FiRefreshCw,
  FiShoppingBag,
} from "react-icons/fi";

// ─── Helper: Initials Avatar ─────────────────────────────────────────────────
const InitialsAvatar = ({ name, size = "h-9 w-9", textSize = "text-sm" }) => {
  const initials = (name || "?")
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() || "")
    .join("");
  return (
    <div
      className={`${size} rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0`}
    >
      <span className={`${textSize} font-bold text-indigo-600`}>{initials}</span>
    </div>
  );
};

// ─── Helper: Status Badge ─────────────────────────────────────────────────────
const StatusBadge = ({ status }) => {
  const s = (status || "PENDING").toUpperCase();

  if (s === "SUCCESS" || s === "PAID") {
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-green-50 border border-green-200 text-green-700">
        <span className="h-1.5 w-1.5 rounded-full bg-green-500 inline-block" />
        Success
      </span>
    );
  }
  if (s === "REFUNDED") {
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-gray-100 border border-gray-200 text-gray-500 line-through">
        <span className="h-1.5 w-1.5 rounded-full bg-gray-400 inline-block" />
        Refunded
      </span>
    );
  }
  if (s === "FAILED") {
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-red-50 border border-red-200 text-red-600">
        <span className="h-1.5 w-1.5 rounded-full bg-red-500 inline-block" />
        Failed
      </span>
    );
  }
  // PENDING (default)
  return (
    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-50 border border-amber-200 text-amber-700">
      <span className="h-1.5 w-1.5 rounded-full bg-amber-400 inline-block" />
      Pending
    </span>
  );
};

// ─── Helper: Format Amount ────────────────────────────────────────────────────
const formatAmount = (amount, currency = "INR", status) => {
  const formatted = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: currency || "INR",
    minimumFractionDigits: 0,
  }).format(amount || 0);

  if ((status || "").toUpperCase() === "REFUNDED") {
    return <span className="line-through text-gray-400">{formatted}</span>;
  }
  return <span>{formatted}</span>;
};

// ─── Helper: Format Date ──────────────────────────────────────────────────────
const formatDate = (dateString) => {
  if (!dateString) return "N/A";
  const d = new Date(dateString);
  if (isNaN(d)) return "N/A";
  return d.toLocaleDateString("en-IN", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

// ─── Skeleton Loader ──────────────────────────────────────────────────────────
const SkeletonRow = () => (
  <tr className="animate-pulse">
    <td className="px-6 py-4">
      <div className="flex items-center gap-3">
        <div className="h-9 w-9 rounded-full bg-slate-200" />
        <div className="h-4 w-28 bg-slate-200 rounded-md" />
      </div>
    </td>
    <td className="px-6 py-4">
      <div className="h-4 w-20 bg-slate-200 rounded-md" />
    </td>
    <td className="px-6 py-4">
      <div className="h-4 w-14 bg-slate-200 rounded-md" />
    </td>
    <td className="px-6 py-4">
      <div className="h-6 w-20 bg-slate-200 rounded-full" />
    </td>
  </tr>
);

// ─── Main Component ───────────────────────────────────────────────────────────
const PaymentHistoryPage = () => {
  const navigate = useNavigate();
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPayments = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get("/payments/my-payments");
      // Response shape: { success: true, data: [...] }
      const data = res.data?.data ?? res.data ?? [];
      setPayments(Array.isArray(data) ? data : []);
    } catch (err) {
      // 404 = backend not ready yet → show empty state, no crash
      if (err.response?.status === 404) {
        setPayments([]);
      } else {
        console.error("Failed to fetch payment history:", err);
        setError("Failed to load payments. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPayments();
  }, [fetchPayments]);

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-6xl mx-auto px-4 pt-24 pb-12">
        {/* Back navigation */}
        <button
          onClick={() => navigate("/mentorship/mentors")}
          className="group mb-6 flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-slate-900 transition-colors"
        >
          <FiArrowLeft className="group-hover:-translate-x-1 transition-transform" />
          <span>Back to Mentorship</span>
        </button>

        {/* Title */}
        <div className="mb-8">
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">
            Payment History
          </h1>
          <p className="text-sm font-medium text-slate-500 mt-1">
            Track your payments, bookings, and receipt states.
          </p>
        </div>

        {/* ── Loading State ── */}
        {loading ? (
          <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-100 text-left">
                <thead className="bg-slate-50">
                  <tr>
                    {["Mentor", "Date", "Amount", "Status"].map((h) => (
                      <th
                        key={h}
                        className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white">
                  {[...Array(4)].map((_, i) => (
                    <SkeletonRow key={i} />
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : error ? (
          /* ── Error State ── */
          <div className="bg-red-50 border border-red-100 rounded-3xl p-8 text-center space-y-4 max-w-md mx-auto">
            <FiAlertCircle size={32} className="text-red-500 mx-auto" />
            <h3 className="text-sm font-bold text-red-800">
              Failed to load payments
            </h3>
            <p className="text-xs text-red-600 font-medium">{error}</p>
            <button
              onClick={fetchPayments}
              className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl shadow-sm transition"
            >
              <FiRefreshCw size={12} />
              Retry
            </button>
          </div>
        ) : payments.length === 0 ? (
          /* ── Empty State ── */
          <div className="bg-white rounded-3xl p-12 border border-slate-100 shadow-sm text-center max-w-lg mx-auto">
            <span className="text-4xl block mb-3">🧾</span>
            <h3 className="text-base font-bold text-slate-800">
              No payment history yet
            </h3>
            <p className="text-xs text-slate-500 mt-1 font-semibold mb-6">
              You haven't made any mentorship payments yet.
            </p>
            <button
              onClick={() => navigate("/mentorship/mentors")}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm rounded-xl shadow-sm transition"
            >
              <FiShoppingBag size={14} />
              Browse Mentors
            </button>
          </div>
        ) : (
          /* ── Payments Table ── */
          <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-100 text-left">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">
                      Mentor
                    </th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">
                      Date
                    </th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">
                      Amount
                    </th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white">
                  {payments.map((payment) => {
                    // mentorId can be a populated object { name, profileImage }
                    // or nested as { userId: { name, email } }
                    const mentorObj =
                      payment.mentorId?.userId || payment.mentorId || {};
                    const mentorName = mentorObj?.name || "Alumni Mentor";
                    const mentorImage = mentorObj?.profileImage || null;

                    return (
                      <tr
                        key={payment._id}
                        className="hover:bg-slate-50/50 transition-colors"
                      >
                        {/* Mentor column */}
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            {mentorImage ? (
                              <img
                                src={mentorImage}
                                alt={mentorName}
                                className="h-9 w-9 rounded-full object-cover flex-shrink-0"
                              />
                            ) : (
                              <InitialsAvatar name={mentorName} />
                            )}
                            <p className="text-sm font-bold text-slate-800">
                              {mentorName}
                            </p>
                          </div>
                        </td>

                        {/* Date column */}
                        <td className="px-6 py-4 whitespace-nowrap">
                          <p className="text-sm font-semibold text-slate-700">
                            {formatDate(payment.createdAt || payment.date)}
                          </p>
                        </td>

                        {/* Amount column */}
                        <td className="px-6 py-4 whitespace-nowrap">
                          <p className="text-sm font-extrabold text-slate-900">
                            {formatAmount(
                              payment.amount ?? 29,
                              payment.currency,
                              payment.status
                            )}
                          </p>
                        </td>

                        {/* Status column */}
                        <td className="px-6 py-4 whitespace-nowrap">
                          <StatusBadge status={payment.status} />
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
    </div>
  );
};

export default PaymentHistoryPage;
