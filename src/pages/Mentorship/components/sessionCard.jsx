import { useState, useEffect } from "react";
import api from "../../../utils/api";
import SessionFeedbackModal from "./sessionFeedback";
import {
  FiCreditCard,
  FiSmartphone,
  FiCheckCircle,
  FiAlertCircle,
  FiLock,
  FiX,
  FiCheck,
} from "react-icons/fi";

const SessionCard = ({ session, user, onUpdated }) => {
  const isStudent = user.role === "student";
  const isMentor = user.role === "alumni";

  // ✅ Correct source of truth
  const isPending = session.status === "PENDING";
  const isScheduled = session.status === "SCHEDULED";
  const isCompleted = session.status === "COMPLETED";

  const otherPerson = isStudent ? session.mentorId : session.menteeId;

  const canGiveFeedback = isStudent && isCompleted && !session.feedback;

  /* ---------------- Modal States ---------------- */
  const [scheduleOpen, setScheduleOpen] = useState(false);
  const [feedbackOpen, setFeedbackOpen] = useState(false);

  /* ---------------- Form State ---------------- */
  const [scheduledAt, setScheduledAt] = useState("");
  const [connectionType, setConnectionType] = useState("MEET");
  const [connectionLink, setConnectionLink] = useState("");

  const [isScheduling, setIsScheduling] = useState(false);
  const [isCompleting, setIsCompleting] = useState(false);
  const [error, setError] = useState(null);

  /* ---------------- Payment Sandbox States ---------------- */
  const [payOpen, setPayOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("upi"); // "upi" or "card"
  const [paying, setPaying] = useState(false);
  const [paySuccess, setPaySuccess] = useState(false);
  const [payError, setPayError] = useState(null);

  // Card mock inputs
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvv, setCardCvv] = useState("");
  const [upiId, setUpiId] = useState("");

  const isUnpaid = session.paymentStatus === "PENDING";

  /* ---------------- Effects ---------------- */
  useEffect(() => {
    if (!scheduleOpen) return;

    const rawDate = session?.scheduledAt;

    let formattedDate = "";

    if (rawDate) {
      const parsed = new Date(rawDate);

      if (!isNaN(parsed.getTime())) {
        const offset = parsed.getTimezoneOffset();
        const localDate = new Date(parsed.getTime() - offset * 60000);

        formattedDate = localDate.toISOString().slice(0, 16);
      }
    }

    setScheduledAt(formattedDate);
    setConnectionType(session?.connectionType || "MEET");
    setConnectionLink(session?.connectionLink || "");
  }, [scheduleOpen, session]);

  /* ---------------- Handlers ---------------- */
  const submitDetails = async (e) => {
    e.preventDefault();

    setError(null);

    const meetRegex =
      /^https:\/\/meet\.google\.com\/[a-z]{3}-[a-z]{4}-[a-z]{3}$/i;

    if (!connectionLink?.trim()) {
      setError("Meeting link is required");
      return;
    }

    if (!meetRegex.test(connectionLink.trim())) {
      setError("Please enter a valid Google Meet link");
      return;
    }

    setIsScheduling(true);

    try {
      await api.patch(`/mentorship/session/${session._id}`, {
        scheduledAt,
        connectionType,
        connectionLink,
      });

      setScheduleOpen(false);
      onUpdated();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update session");
    } finally {
      setIsScheduling(false);
    }
  };

  const avatarColors = [
    "bg-indigo-600",
    "bg-blue-600",
    "bg-green-600",
    "bg-purple-600",
    "bg-pink-600",
    "bg-orange-600",
  ];

  const colorClass =
    avatarColors[(otherPerson?.name?.charCodeAt(0) || 0) % avatarColors.length];

  const handlePaymentSubmit = async (e) => {
    e.preventDefault();
    setPaying(true);
    setPayError(null);
    try {
      await api.post(`/mentorship/session/${session._id}/pay`);
      setPaySuccess(true);
      setTimeout(() => {
        setPayOpen(false);
        setPaySuccess(false);
        onUpdated();
      }, 1500);
    } catch (err) {
      setPayError(
        err.response?.data?.message || "Payment verification failed.",
      );
    } finally {
      setPaying(false);
    }
  };

  const markCompleted = async () => {
    if (!isScheduled || isCompleting) return;

    setIsCompleting(true);
    try {
      await api.patch(`/mentorship/session/${session._id}/complete`);
      onUpdated();
    } catch (err) {
      if (
        err.response?.status === 400 &&
        err.response?.data?.message.includes("already")
      ) {
        onUpdated();
      } else {
        alert(
          err.response?.data?.message || "Failed to mark session completed",
        );
      }
    } finally {
      setIsCompleting(false);
    }
  };

  /* ---------------- Render ---------------- */
  let scheduledAtText = "Not scheduled yet";
  if (isPending) {
    scheduledAtText = "Waiting for mentor to schedule";
  } else if (session.scheduledAt) {
    scheduledAtText = `📅 ${new Date(session.scheduledAt).toLocaleString(
      "en-IN",
      {
        timeZone: "Asia/Kolkata",
      },
    )}`;
  }

  return (
    <>
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm hover:shadow-md transition">
        <div className="flex items-start gap-4">
          {/* Avatar */}
          {otherPerson?.profileImage ? (
            <img
              src={otherPerson.profileImage}
              alt={otherPerson?.name}
              className="h-12 w-12 rounded-full object-cover"
            />
          ) : (
            <div
              className={`h-12 w-12 rounded-full ${colorClass} text-white flex items-center justify-center font-bold text-lg`}
            >
              {otherPerson?.name?.charAt(0)?.toUpperCase() || "U"}
            </div>
          )}

          {/* Info */}
          <div className="flex-1">
            <h3 className="text-sm font-semibold text-slate-900">
              {otherPerson?.name || "Unknown User"}
            </h3>

            <p className="mt-0.5 text-xs text-slate-500">
              {isStudent ? "Mentor" : "Student"}
            </p>

            <div className="mt-2 flex flex-wrap gap-4 text-xs text-slate-600">
              <span>
                Mode:{" "}
                <span className="font-medium">
                  {session.connectionType || "—"}
                </span>
              </span>

              <span>
                Status:{" "}
                <span
                  className={`font-medium ${
                    isCompleted
                      ? "text-green-600"
                      : isScheduled
                        ? "text-blue-600"
                        : "text-yellow-600"
                  }`}
                >
                  {session.status}
                </span>
              </span>
            </div>

            <p className="mt-2 text-xs text-slate-500">{scheduledAtText}</p>

            {isCompleted && session.completedAt && (
              <p className="mt-1 text-xs text-green-700">
                ✅ Completed on{" "}
                {new Date(session.completedAt).toLocaleString("en-IN", {
                  timeZone: "Asia/Kolkata",
                })}
              </p>
            )}

            {isUnpaid && isStudent && (
              <div className="mt-4 rounded-xl bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                <div className="space-y-0.5">
                  <p className="text-xs font-bold text-amber-800 flex items-center gap-1.5">
                    <FiLock size={12} className="animate-pulse" /> PAYMENT
                    REQUIRED
                  </p>
                  <p className="text-[11px] text-amber-700 leading-normal font-semibold">
                    Complete your payment of ₹499 to activate this session and
                    reveal meeting details.
                  </p>
                </div>
                <button
                  onClick={() => setPayOpen(true)}
                  className="shrink-0 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white px-4 py-2 text-xs font-bold shadow-md hover:shadow-lg transition focus:outline-none"
                >
                  Pay & Activate
                </button>
              </div>
            )}

            {isUnpaid && isMentor && (
              <div className="mt-4 rounded-xl bg-slate-50 border border-slate-200 p-3">
                <p className="text-[11px] text-slate-500 font-bold flex items-center gap-1.5">
                  ⏳ AWAITING STUDENT PAYMENT
                </p>
                <p className="text-[10px] text-slate-400 mt-0.5 leading-normal font-semibold">
                  The student needs to complete payment of ₹499. Meeting link
                  and scheduling features will be active once paid.
                </p>
              </div>
            )}

            {/* Mentor sees feedback */}
            {isMentor && session.feedback && (
              <div className="mt-3 rounded-lg bg-slate-50 p-3 text-xs border">
                <p className="font-semibold">
                  Student Feedback ⭐ {session.feedback.rating}/5
                </p>
                {session.feedback.comment && (
                  <p className="mt-1 italic text-slate-600">
                    “{session.feedback.comment}”
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex flex-col items-end gap-2">
            {/* Join */}
            {isScheduled && session.connectionLink && !isUnpaid && (
              <a
                href={session.connectionLink}
                target="_blank"
                rel="noreferrer"
                className="rounded-xl bg-slate-900 px-4 py-2 text-xs font-semibold text-white hover:bg-slate-800"
              >
                Join
              </a>
            )}

            {/* Mentor controls */}
            {isMentor && !isCompleted && !isUnpaid && (
              <>
                <button
                  onClick={() => setScheduleOpen(true)}
                  className="text-xs underline text-slate-700"
                >
                  {isScheduled ? "Edit Details" : "Set Details"}
                </button>

                {isScheduled && (
                  <button
                    onClick={markCompleted}
                    disabled={isCompleting}
                    className="text-xs font-semibold text-green-700 underline"
                  >
                    {isCompleting ? "Marking..." : "Mark as Completed"}
                  </button>
                )}
              </>
            )}

            {/* Feedback */}
            {canGiveFeedback && (
              <button
                onClick={() => setFeedbackOpen(true)}
                className="text-xs font-semibold text-blue-700 underline"
              >
                Give Feedback
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Schedule Modal */}
      {scheduleOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <form
            onSubmit={submitDetails}
            className="w-full max-w-md rounded-2xl bg-white p-6"
          >
            <h2 className="text-lg font-semibold mb-4">Session Details</h2>

            <input
              type="datetime-local"
              value={scheduledAt}
              onChange={(e) => setScheduledAt(e.target.value)}
              required
              className="w-full mb-3 border p-2 rounded"
            />

            <div className="mb-3">
              <label className="block text-sm font-medium mb-1">
                Google Meet Link
              </label>

              <div className="flex gap-2">
                <input
                  type="url"
                  value={connectionLink}
                  onChange={(e) => setConnectionLink(e.target.value)}
                  required
                  placeholder="Paste Google Meet link here"
                  className="flex-1 border p-2 rounded"
                />

                <button
                  type="button"
                  onClick={() =>
                    window.open(
                      "https://meet.google.com",
                      "_blank",
                      "noopener,noreferrer",
                    )
                  }
                  className="px-4 rounded bg-slate-100 hover:bg-slate-200 text-sm font-medium whitespace-nowrap"
                >
                  Open Meet
                </button>
              </div>

              <p className="mt-1 text-xs text-slate-500">
                Open Google Meet → New Meeting → Create a meeting for later →
                Paste the generated link here.
              </p>
            </div>

            {error && <p className="text-red-600 text-xs">{error}</p>}

            <div className="flex justify-end gap-2 mt-4">
              <button type="button" onClick={() => setScheduleOpen(false)}>
                Cancel
              </button>
              <button type="submit">
                {isScheduling ? "Saving..." : "Save"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Feedback */}
      {feedbackOpen && (
        <SessionFeedbackModal
          sessionId={session._id}
          onClose={() => setFeedbackOpen(false)}
          onSuccess={(data) => onUpdated(data)}
        />
      )}

      {/* Sandbox Payment Modal */}
      {payOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-3xl border border-gray-100 dark:border-slate-800 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gradient-to-r from-amber-50 to-orange-50">
              <div className="flex items-center gap-2">
                <FiLock className="text-amber-600" size={18} />
                <div>
                  <h3 className="font-extrabold text-slate-800 text-sm tracking-tight">
                    Mentorship Checkout
                  </h3>
                  <p className="text-[10px] text-amber-700 font-bold uppercase tracking-wider">
                    Sandbox Payment Gateway
                  </p>
                </div>
              </div>
              <button
                disabled={paying}
                onClick={() => setPayOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition"
              >
                <FiX size={18} />
              </button>
            </div>

            {paySuccess ? (
              <div className="p-8 text-center flex flex-col items-center justify-center space-y-3">
                <div className="w-12 h-12 bg-emerald-500 rounded-full flex items-center justify-center text-white shadow-lg shadow-emerald-500/35 animate-bounce">
                  <FiCheck size={24} />
                </div>
                <h4 className="font-bold text-slate-800">Payment Verified!</h4>
                <p className="text-xs text-slate-500">
                  Your session is now active. Refreshing dashboard...
                </p>
              </div>
            ) : (
              <form onSubmit={handlePaymentSubmit} className="p-6 space-y-4">
                {/* Session Cost info */}
                <div className="bg-slate-50 rounded-xl p-3 border flex justify-between items-center">
                  <span className="text-xs text-slate-500 font-semibold">
                    Mentorship Session (₹499)
                  </span>
                  <span className="text-sm font-extrabold text-indigo-600">
                    ₹499.00
                  </span>
                </div>

                {/* Tab selector */}
                <div className="flex border rounded-xl overflow-hidden p-0.5 bg-slate-50">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod("upi")}
                    className={`flex-1 py-2 text-xs font-bold rounded-lg transition ${paymentMethod === "upi" ? "bg-white text-indigo-600 shadow-sm" : "text-slate-500"}`}
                  >
                    UPI / GooglePay
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod("card")}
                    className={`flex-1 py-2 text-xs font-bold rounded-lg transition ${paymentMethod === "card" ? "bg-white text-indigo-600 shadow-sm" : "text-slate-500"}`}
                  >
                    Credit / Debit Card
                  </button>
                </div>

                {paymentMethod === "upi" ? (
                  <div className="space-y-3">
                    <div className="flex flex-col items-center p-3 border rounded-xl bg-slate-50">
                      <div className="w-24 h-24 bg-white border rounded-lg flex items-center justify-center shadow-inner mb-2">
                        {/* Simulated static QR code */}
                        <div className="grid grid-cols-4 gap-1 p-2 w-full h-full opacity-60">
                          {Array.from({ length: 16 }).map((_, i) => (
                            <div
                              key={i}
                              className={`rounded-sm ${i % 3 === 0 || i % 7 === 0 ? "bg-slate-900" : "bg-transparent"}`}
                            />
                          ))}
                        </div>
                      </div>
                      <p className="text-[10px] text-slate-400 font-bold">
                        Scan QR or enter UPI ID below
                      </p>
                    </div>

                    <input
                      type="text"
                      placeholder="e.g. name@okaxis"
                      value={upiId}
                      onChange={(e) => setUpiId(e.target.value)}
                      required={paymentMethod === "upi"}
                      className="w-full border p-2.5 text-xs rounded-xl focus:ring-1 focus:ring-indigo-500"
                    />
                  </div>
                ) : (
                  <div className="space-y-3">
                    <input
                      type="text"
                      placeholder="Card Number (e.g. 4111 2222 3333 4444)"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      required={paymentMethod === "card"}
                      className="w-full border p-2.5 text-xs rounded-xl focus:ring-1 focus:ring-indigo-500"
                    />
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="text"
                        placeholder="MM/YY"
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(e.target.value)}
                        required={paymentMethod === "card"}
                        className="border p-2.5 text-xs rounded-xl focus:ring-1 focus:ring-indigo-500"
                      />
                      <input
                        type="password"
                        placeholder="CVV"
                        value={cardCvv}
                        onChange={(e) => setCardCvv(e.target.value)}
                        required={paymentMethod === "card"}
                        className="border p-2.5 text-xs rounded-xl focus:ring-1 focus:ring-indigo-500"
                      />
                    </div>
                  </div>
                )}

                {payError && (
                  <div className="flex items-center gap-1.5 p-2.5 bg-red-50 text-red-600 rounded-xl text-[10px] font-semibold border border-red-100">
                    <FiAlertCircle size={12} className="shrink-0" />
                    <span>{payError}</span>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={paying}
                  className="w-full py-3 bg-gradient-to-r from-indigo-600 to-blue-600 text-white font-bold text-xs rounded-xl shadow-lg transition active:scale-98 flex items-center justify-center"
                >
                  {paying ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    "Authorize Transaction (₹499)"
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default SessionCard;
