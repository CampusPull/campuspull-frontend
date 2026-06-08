import { useEffect, useState } from "react";
import api from "../../../utils/api";
import { useAuth } from "../../../context/AuthContext";
import SessionCard from "../components/sessionCard";
import ErrorBanner from "../components/errorBanner";

const SessionDetails = ({ refreshTrigger, isNested = false }) => {
  const { user } = useAuth();
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAllPast, setShowAllPast] = useState(false);

  const fetchSessions = async () => {
    try {
      const res = await api.get("/mentorship/session/my");
      setSessions(res.data.sessions || []);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load sessions");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
  fetchSessions();
}, [refreshTrigger]); // 🔥 THIS IS THE FIX

  if (loading) {
    return (
      <div className={`max-w-3xl mx-auto px-4 py-6 ${isNested ? "" : "pt-24"} flex items-center justify-center`}>
        <p className="text-sm text-slate-500 font-medium">Loading sessions…</p>
      </div>
    );
  }

  // ✅ Correct status-based grouping
  const pendingSessions = sessions.filter(
    (s) => s.status === "PENDING"
  );

  const scheduledSessions = sessions.filter(
    (s) => s.status === "SCHEDULED"
  );

  const completedSessions = sessions.filter(
    (s) => s.status === "COMPLETED"
  );

  const visibleCompletedSessions = showAllPast
    ? completedSessions
    : completedSessions.slice(0, 5);

  return (
    <div className={`max-w-3xl mx-auto px-4 py-6 space-y-6 ${isNested ? "" : "pt-24"}`}>
      <h1 className="text-2xl font-semibold">
        My Mentorship Sessions
      </h1>

      <ErrorBanner message={error} />

      {/* 🟡 Awaiting Scheduling */}
      <section>
        <h2 className="mb-3 text-sm font-semibold text-slate-700">
          Awaiting Scheduling
        </h2>

        {pendingSessions.length === 0 ? (
          <p className="text-sm text-slate-500">
            No pending sessions.
          </p>
        ) : (
          <div className="space-y-3">
            {pendingSessions.map((session) => (
              <SessionCard
                key={session._id}
                session={session}
                user={user}
                onUpdated={fetchSessions}
              />
            ))}
          </div>
        )}
      </section>

      {/* 🟢 Scheduled Sessions */}
      <section>
        <h2 className="mb-3 text-sm font-semibold text-slate-700">
          Scheduled Sessions
        </h2>

        {scheduledSessions.length === 0 ? (
          <p className="text-sm text-slate-500">
            No scheduled sessions.
          </p>
        ) : (
          <div className="space-y-3">
            {scheduledSessions.map((session) => (
              <SessionCard
                key={session._id}
                session={session}
                user={user}
                onUpdated={fetchSessions}
              />
            ))}
          </div>
        )}
      </section>

      {/* ✅ Completed Sessions */}
      <section>
        <h2 className="mb-3 text-sm font-semibold text-slate-700">
          Completed Sessions
        </h2>

        {completedSessions.length === 0 ? (
          <p className="text-sm text-slate-500">
            No completed sessions.
          </p>
        ) : (
          <>
            <div className="space-y-3">
              {visibleCompletedSessions.map((session) => (
                <SessionCard
                  key={session._id}
                  session={session}
                  user={user}
                  onUpdated={fetchSessions}
                />
              ))}
            </div>

            {completedSessions.length > 5 && (
              <button
                onClick={() => setShowAllPast((v) => !v)}
                className="mt-3 text-xs font-medium text-slate-600 underline"
              >
                {showAllPast
                  ? "Show less"
                  : "View all completed sessions"}
              </button>
            )}
          </>
        )}
      </section>
    </div>
  );
};

export default SessionDetails;