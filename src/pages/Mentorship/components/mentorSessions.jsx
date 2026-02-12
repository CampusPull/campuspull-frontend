import { useEffect, useState } from "react";
import api from "../../../utils/api";
import { useAuth } from "../../../context/AuthContext";
import SessionCard from "../components/sessionCard";
import ErrorBanner from "../components/errorBanner";

const SessionDetails = () => {
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
  }, []);

  if (loading) {
    return <p className="text-sm text-slate-500">Loading sessions…</p>;
  }

  const activeSessions = sessions.filter(
    (s) => s.status === "ACTIVE"
  );

  const pastSessions = sessions.filter(
    (s) => s.status === "COMPLETED"
  );

  const visiblePastSessions = showAllPast
    ? pastSessions
    : pastSessions.slice(0, 5);

  return (
    <div className="max-w-3xl mx-auto px-4 py-6 space-y-6">
      <h1 className="text-2xl font-semibold">
        My Mentorship Sessions
      </h1>

      <ErrorBanner message={error} />

      {/* Active */}
      <section>
        <h2 className="mb-3 text-sm font-semibold text-slate-700">
          Active Sessions
        </h2>

        {activeSessions.length === 0 ? (
          <p className="text-sm text-slate-500">
            No active sessions.
          </p>
        ) : (
          <div className="space-y-3">
            {activeSessions.map((session) => (
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

      {/* Past */}
      <section>
        <h2 className="mb-3 text-sm font-semibold text-slate-700">
          Past Sessions
        </h2>

        {pastSessions.length === 0 ? (
          <p className="text-sm text-slate-500">
            No past sessions.
          </p>
        ) : (
          <>
            <div className="space-y-3">
              {visiblePastSessions.map((session) => (
                <SessionCard
                  key={session._id}
                  session={session}
                  user={user}
                />
              ))}
            </div>

            {pastSessions.length > 5 && (
              <button
                onClick={() => setShowAllPast((v) => !v)}
                className="mt-3 text-xs font-medium text-slate-600 underline"
              >
                {showAllPast
                  ? "Show less"
                  : "View all past sessions"}
              </button>
            )}
          </>
        )}
      </section>
    </div>
  );
};

export default SessionDetails;
