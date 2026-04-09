import { useState, useEffect } from "react";
import api from "../../../utils/api";
import SessionFeedbackModal from "./sessionFeedback";

const SessionCard = ({ session, user, onUpdated }) => {
  const isStudent = user.role === "student";
  const isMentor = user.role === "alumni";

  const otherPerson = isStudent ? session.mentorId : session.menteeId;

  const isScheduled =
    session.scheduledAt && session.connectionType && session.connectionLink;

  const isCompleted = session.status === "COMPLETED";
  const canGiveFeedback = isStudent && isCompleted && !session.feedbackGiven;

  /* ---------------- Modal States ---------------- */
  const [scheduleOpen, setScheduleOpen] = useState(false);
  const [feedbackOpen, setFeedbackOpen] = useState(false);

  /* ---------------- Form & Action States ---------------- */
  const [scheduledAt, setScheduledAt] = useState("");
  const [connectionType, setConnectionType] = useState("MEET");
  const [connectionLink, setConnectionLink] = useState("");
  
  // Hardworking tip: Separate loading states prevent the whole card from locking up
  const [isScheduling, setIsScheduling] = useState(false);
  const [isCompleting, setIsCompleting] = useState(false);
  const [error, setError] = useState(null);

  /* ---------------- Effects ---------------- */
  useEffect(() => {
    if (scheduleOpen) {
      setScheduledAt(
        session.scheduledAt
          ? new Date(session.scheduledAt).toISOString().slice(0, 16)
          : ""
      );
      setConnectionType(session.connectionType || "MEET");
      setConnectionLink(session.connectionLink || "");
    }
  }, [scheduleOpen, session]);

  /* ---------------- Handlers ---------------- */
  const submitDetails = async (e) => {
    e.preventDefault();
    setIsScheduling(true);
    setError(null);

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

  const markCompleted = async () => {
    if (!isScheduled || isCompleting) return;

    setIsCompleting(true);
    try {
      await api.patch(`/mentorship/session/${session._id}/complete`);
      onUpdated(); // Refresh the list
    } catch (err) {
      // If it failed because it was already completed (race condition), just refresh
      if (err.response?.status === 400 && err.response?.data?.message.includes("already")) {
        onUpdated();
      } else {
        alert(err.response?.data?.message || "Failed to mark session completed");
      }
    } finally {
      setIsCompleting(false);
    }
  };

  /* ---------------- Render ---------------- */
  return (
    <>
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md">
        <div className="flex items-start gap-4">
          {/* Avatar */}
          <img
            src={otherPerson?.profileImage || "/avatar.png"}
            alt={otherPerson?.name}
            className="h-12 w-12 rounded-full object-cover bg-slate-100"
          />

          {/* Info */}
          <div className="flex-1">
            <h3 className="text-sm font-semibold text-slate-900">
              {otherPerson?.name || "Unknown User"}
            </h3>

            <p className="mt-0.5 text-xs text-slate-500">
              {isStudent ? "Mentor" : "Student"}
            </p>

            <div className="mt-2 flex flex-wrap items-center gap-4 text-xs text-slate-600">
              <span>
                Mode: <span className="font-medium">{session.connectionType || "—"}</span>
              </span>
              <span>
                Status:{" "}
                <span className={`font-medium ${isCompleted ? "text-green-600" : "text-blue-600"}`}>
                  {session.status}
                </span>
              </span>
            </div>

            <p className="mt-2 text-xs text-slate-500">
              {session.scheduledAt
                ? `📅 ${new Date(session.scheduledAt).toLocaleString()}`
                : "Waiting for mentor to schedule"}
            </p>

            {isCompleted && session.completedAt && (
              <p className="mt-1 text-xs text-green-700">
                ✅ Completed on {new Date(session.completedAt).toLocaleString()}
              </p>
            )}

            {/* Mentor views feedback here */}
            {isMentor && session.feedback && (
              <div className="mt-3 rounded-lg bg-slate-50 p-3 text-xs border border-slate-100">
                <p className="font-semibold text-slate-800">
                  Student Feedback ⭐ {session.feedback.rating}/5
                </p>
                {session.feedback.comment && (
                  <p className="mt-1 text-slate-600 italic">“{session.feedback.comment}”</p>
                )}
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="self-center flex flex-col items-end gap-2">
            {isScheduled && !isCompleted && (
              <a
                href={session.connectionLink}
                target="_blank"
                rel="noreferrer"
                className="rounded-xl bg-slate-900 px-4 py-2 text-xs font-semibold text-white hover:bg-slate-800 transition"
              >
                Join
              </a>
            )}

            {isMentor && !isCompleted && (
              <>
                <button
                  onClick={() => setScheduleOpen(true)}
                  className="text-xs underline text-slate-700 hover:text-black"
                >
                  {isScheduled ? "Edit Details" : "Set Details"}
                </button>

                {isScheduled && (
                  <button
                    onClick={markCompleted}
                    disabled={isCompleting}
                    className="text-xs font-semibold text-green-700 underline disabled:opacity-50"
                  >
                    {isCompleting ? "Marking..." : "Mark as Completed"}
                  </button>
                )}
              </>
            )}

            {canGiveFeedback && (
              <button
                onClick={() => setFeedbackOpen(true)}
                className="text-xs font-semibold text-blue-700 underline"
              >
                Give Feedback
              </button>
            )}

            {isStudent && !isScheduled && (
              <span className="text-xs text-slate-400 italic">Pending Schedule</span>
            )}
          </div>
        </div>
      </div>

      {/* Schedule Modal */}
      {scheduleOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <form
            onSubmit={submitDetails}
            className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl"
          >
            <h2 className="text-lg font-semibold mb-4">Session Details</h2>
            <div className="space-y-4">
              <label className="block text-sm">
                Date & Time
                <input
                  type="datetime-local"
                  value={scheduledAt}
                  onChange={(e) => setScheduledAt(e.target.value)}
                  required
                  className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:ring-2 focus:ring-slate-900 outline-none"
                />
              </label>

              <label className="block text-sm">
                Connection Type
                <select
                  value={connectionType}
                  onChange={(e) => setConnectionType(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:ring-2 focus:ring-slate-900 outline-none"
                >
                  <option value="MEET">Google Meet</option>
                  <option value="ZOOM">Zoom</option>
                  <option value="CALL">Phone Call</option>
                  <option value="OTHER">Other</option>
                </select>
              </label>

              <label className="block text-sm">
                Meeting Link
                <input
                  type="url"
                  value={connectionLink}
                  onChange={(e) => setConnectionLink(e.target.value)}
                  required
                  placeholder="https://..."
                  className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:ring-2 focus:ring-slate-900 outline-none"
                />
              </label>
            </div>

            {error && <p className="text-xs text-red-600 mt-3">{error}</p>}

            <div className="flex justify-end gap-3 mt-6">
              <button
                type="button"
                onClick={() => setScheduleOpen(false)}
                className="text-sm text-slate-600 hover:text-slate-900"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isScheduling}
                className="rounded-xl bg-slate-900 px-6 py-2 text-sm font-semibold text-white hover:bg-slate-800 disabled:opacity-50 transition"
              >
                {isScheduling ? "Saving..." : "Save Details"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Feedback Modal */}
      {feedbackOpen && (
        <SessionFeedbackModal
          sessionId={session._id}
          onClose={() => setFeedbackOpen(false)}
          onSuccess={onUpdated}
        />
      )}
    </>
  );
};

export default SessionCard;