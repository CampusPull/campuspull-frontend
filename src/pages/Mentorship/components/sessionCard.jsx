import { useState, useEffect } from "react";
import api from "../../../utils/api";
import SessionFeedbackModal from "./sessionFeedback";

const SessionCard = ({ session, user, onUpdated }) => {
  const isStudent = user.role === "student";
  const isMentor = user.role === "alumni";

  // ✅ Correct source of truth
  const isPending = session.status === "PENDING";
  const isScheduled = session.status === "SCHEDULED";
  const isCompleted = session.status === "COMPLETED";

  const otherPerson = isStudent ? session.mentorId : session.menteeId;

  const canGiveFeedback =
    isStudent && isCompleted && !session.feedback;

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
      onUpdated();
    } catch (err) {
      if (
        err.response?.status === 400 &&
        err.response?.data?.message.includes("already")
      ) {
        onUpdated();
      } else {
        alert(
          err.response?.data?.message ||
            "Failed to mark session completed"
        );
      }
    } finally {
      setIsCompleting(false);
    }
  };

  /* ---------------- Render ---------------- */
  return (
    <>
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm hover:shadow-md transition">
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

            <p className="mt-2 text-xs text-slate-500">
              {isPending
                ? "Waiting for mentor to schedule"
                : session.scheduledAt
                ? `📅 ${new Date(
                    session.scheduledAt
                  ).toLocaleString()}`
                : "Not scheduled yet"}
            </p>

            {isCompleted && session.completedAt && (
              <p className="mt-1 text-xs text-green-700">
                ✅ Completed on{" "}
                {new Date(session.completedAt).toLocaleString()}
              </p>
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
            {isScheduled && session.connectionLink && (
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
            {isMentor && !isCompleted && (
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
                    {isCompleting
                      ? "Marking..."
                      : "Mark as Completed"}
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
            <h2 className="text-lg font-semibold mb-4">
              Session Details
            </h2>

            <input
              type="datetime-local"
              value={scheduledAt}
              onChange={(e) => setScheduledAt(e.target.value)}
              required
              className="w-full mb-3 border p-2 rounded"
            />

            <input
              type="url"
              value={connectionLink}
              onChange={(e) => setConnectionLink(e.target.value)}
              required
              placeholder="Meeting link"
              className="w-full mb-3 border p-2 rounded"
            />

            {error && (
              <p className="text-red-600 text-xs">{error}</p>
            )}

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
    </>
  );
};

export default SessionCard;