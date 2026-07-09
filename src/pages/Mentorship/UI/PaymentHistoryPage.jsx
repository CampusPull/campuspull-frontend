import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../../utils/api";
import { FiArrowLeft, FiDollarSign, FiCalendar, FiClock, FiAlertCircle } from "react-icons/fi";

const PaymentHistoryPage = () => {
  const navigate = useNavigate();
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPayments = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await api.get("/payments/my-payments");
        setPayments(res.data || []);
      } catch (err) {
        console.error("Failed to fetch payment history:", err);
        setError("Failed to load payment history. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchPayments();
  }, []);

  const formatAmount = (amount, currency = "INR") => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: currency,
      minimumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const d = new Date(dateString);
    return isNaN(d)
      ? "N/A"
      : d.toLocaleDateString("en-IN", {
          year: "numeric",
          month: "short",
          day: "numeric",
        });
  };

  const getStatusBadge = (status) => {
    const s = (status || "PENDING").toUpperCase();
    if (s === "SUCCESS" || s === "PAID") {
      return (
        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-green-50 border border-green-200 text-green-700">
          ● Success
        </span>
      );
    }
    if (s === "REFUNDED") {
      return (
        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-gray-50 border border-gray-200 text-gray-600">
          ● Refunded
        </span>
      );
    }
    if (s === "FAILED") {
      return (
        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-red-50 border border-red-200 text-red-600">
          ● Failed
        </span>
      );
    }
    return (
      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-amber-50 border border-amber-200 text-amber-700">
        ● Pending
      </span>
    );
  };

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
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Payment History</h1>
          <p className="text-sm font-medium text-slate-500 mt-1">
            Track your payments, bookings, and receipt states.
          </p>
        </div>

        {/* Loading / Error States */}
        {loading ? (
          <div className="bg-white rounded-3xl p-12 border border-slate-100 shadow-sm text-center">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-indigo-600 mx-auto mb-4"></div>
            <p className="text-slate-500 font-medium text-sm">Loading transactions...</p>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-100 rounded-3xl p-8 text-center space-y-4 max-w-md mx-auto">
            <FiAlertCircle size={32} className="text-red-500 mx-auto" />
            <h3 className="text-sm font-bold text-red-800">Error Loading History</h3>
            <p className="text-xs text-red-600 font-medium">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-red-600 hover:bg-red-750 text-white font-bold text-xs rounded-xl shadow-sm transition"
            >
              Retry
            </button>
          </div>
        ) : payments.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 border border-slate-100 shadow-sm text-center max-w-lg mx-auto">
            <span className="text-4xl block mb-3">🧾</span>
            <h3 className="text-base font-bold text-slate-800">No Payments Found</h3>
            <p className="text-xs text-slate-500 mt-1 font-semibold">
              You haven't made any mentorship requests that required payment yet.
            </p>
          </div>
        ) : (
          /* Payments Table */
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
                    const mentorUser = payment.mentorId?.userId || payment.mentorId;
                    const mentorName = mentorUser?.name || "Alumni Mentor";
                    const mentorEmail = mentorUser?.email || "";

                    return (
                      <tr key={payment._id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-6 py-4">
                          <div>
                            <p className="text-sm font-bold text-slate-800">{mentorName}</p>
                            {mentorEmail && <p className="text-xs text-slate-400 font-semibold">{mentorEmail}</p>}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <p className="text-sm font-semibold text-slate-700">{formatDate(payment.createdAt || payment.date)}</p>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <p className="text-sm font-extrabold text-slate-900">{formatAmount(payment.amount || 29, payment.currency)}</p>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {getStatusBadge(payment.status)}
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
