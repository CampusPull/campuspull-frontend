import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../../utils/api";
import {
  MentorDiscoveryProvider,
  useMentorDiscovery,
} from "../../../context/mentorDiscoveryContext";
import { MentorRequestProvider } from "../../../context/mentorRequestContext";
import RequestMentorModal from "../components/requestMentorModal";
import MentorList from "../components/mentorList";
import SignupModal from "../../../components/ui/SignupModal"; // FIX
import { useAuth } from "../../../context/AuthContext";
import AdminMentorship from "../../Admin/AdminMentorship";
import SessionCard from "../components/sessionCard";

const requestStatusMap = {
  PENDING: {
    label: "Pending",
    color: "bg-yellow-100 text-yellow-700",
    hint: "Waiting for mentor response",
  },
  ACCEPTED: {
    label: "Accepted",
    color: "bg-green-100 text-green-700",
    hint: "Session will appear in My Sessions",
  },
  REJECTED: {
    label: "Rejected",
    color: "bg-red-100 text-red-700",
    hint: "You may request another mentor",
  },
};

const PageContent = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const {
    mentors,
    loading,
    error,
    isGuest, // FIX
    showAuthModal, // FIX
    setShowAuthModal, // FIX
  } = useMentorDiscovery();

  const [selectedMentor, setSelectedMentor] = useState(null);
  const [myRequests, setMyRequests] = useState([]);
  const [activeTab, setActiveTab] = useState("available");

  // Sessions state for Completed Sessions History
  const [sessions, setSessions] = useState([]);
  const [sessionsLoading, setSessionsLoading] = useState(false);
  const [sessionsError, setSessionsError] = useState(null);

  const handleRequestClick = (mentor) => {
    // isGuest check already handled in MentorCard
    setSelectedMentor(mentor);
  };

  useEffect(() => {
    if (isGuest) return;

    const fetchMyRequests = async () => {
      try {
        const res = await api.get("/mentorship/request/my");
        setMyRequests(res.data.requests || []);
      } catch (err) {
        console.error("Failed to fetch requests");
      }
    };

    fetchMyRequests();
  }, [isGuest]);

  const fetchSessions = async () => {
    if (isGuest) return;
    setSessionsLoading(true);
    setSessionsError(null);
    try {
      const res = await api.get("/mentorship/session/my");
      setSessions(res.data.sessions || []);
    } catch (err) {
      setSessionsError(err.response?.data?.message || "Failed to load sessions");
    } finally {
      setSessionsLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === "past") {
      fetchSessions();
    }
  }, [activeTab, isGuest]);

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-6xl mx-auto px-4 pt-24 pb-10">
        {/* Header */}
        <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-semibold text-slate-900">
              Find a Mentor
            </h1>
            <p className="mt-2 text-sm text-slate-600 max-w-md">
              Learn directly from alumni who've walked the path you're on.
              Request one-on-one mentorship and grow faster.
            </p>
          </div>

          {/* Tab Navigation styled as the original top-right black/white buttons */}
          <div className="flex flex-wrap gap-3">
            {[
              { key: "available", label: "Available Mentors" },
              { key: "requested", label: "Requested Mentorship" },
              { key: "past", label: "Past Mentorship" },
            ].map((tab) => {
              const isActive = activeTab === tab.key;
              return (
                <button
                  key={tab.key}
                  onClick={() => {
                    if (isGuest && tab.key !== "available") {
                      setShowAuthModal(true);
                    } else {
                      setActiveTab(tab.key);
                    }
                  }}
                  className={`rounded-xl px-4 py-2 text-sm font-medium transition ${
                    isActive
                      ? "bg-slate-900 text-white hover:bg-slate-800"
                      : "border border-slate-300 bg-white text-slate-700 hover:bg-slate-100"
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Guest banner */}
        {isGuest && (
          <div className="mb-8 p-4 bg-blue-50 border border-blue-200 rounded-2xl flex items-center justify-between gap-4">
            <p className="text-blue-700 font-medium text-sm">
              👋 You're browsing as a guest. Create an account to request
              mentorship from alumni.
            </p>
            <button
              onClick={() => setShowAuthModal(true)}
              className="shrink-0 px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-xl hover:bg-blue-700 transition"
            >
              Join Now
            </button>
          </div>
        )}

        {/* Tab Contents */}
        {activeTab === "available" && (
          <>
            {loading && (
              <p className="mt-20 text-center text-sm text-slate-500">
                Loading mentors…
              </p>
            )}

            {error && (
              <p className="mt-20 text-center text-sm text-red-600">{error}</p>
            )}

            {!loading && !error && mentors.length === 0 && (
              <div className="mt-20 text-center">
                <p className="text-sm text-slate-600">
                  No mentors available right now.
                </p>
                <p className="mt-1 text-xs text-slate-500">
                  Check back later or explore sessions.
                </p>
              </div>
            )}

            {!loading && !error && mentors.length > 0 && (
              <MentorList
                mentors={mentors}
                onRequest={handleRequestClick}
                isGuest={isGuest}
                onRestrictedAction={() => setShowAuthModal(true)}
                myRequests={myRequests}
              />
            )}
          </>
        )}

        {activeTab === "requested" && (
          <div className="space-y-6">
            <h2 className="text-lg font-bold text-slate-900">
              Sent Mentorship Requests
            </h2>
            {myRequests.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-slate-200 p-8 text-center text-slate-500 bg-white">
                You haven’t sent any mentorship requests yet.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {myRequests.map((req) => {
                  const status = requestStatusMap[req.status] || {
                    label: req.status,
                    color: "bg-slate-100 text-slate-700",
                    hint: "",
                  };

                  return (
                    <div
                      key={req._id}
                      className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm flex flex-col justify-between"
                    >
                      <div>
                        {/* Top row */}
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={req.mentorId?.profileImage || "/avatar.png"}
                              alt={req.mentorId?.name}
                              className="h-10 w-10 rounded-full object-cover"
                            />

                            <div>
                              <p className="font-semibold text-slate-900">
                                {req.mentorId?.name || "Mentor"}
                              </p>
                              <p className="text-xs text-slate-500">
                                Mentor
                              </p>
                            </div>
                          </div>

                          <span
                            className={`text-xs font-semibold px-3 py-1 rounded-full ${status.color}`}
                          >
                            {status.label}
                          </span>
                        </div>

                        {/* Goal */}
                        <p className="mt-4 text-sm text-slate-700">
                          <span className="font-semibold text-slate-900">Goal:</span>{" "}
                          {req.goal}
                        </p>

                        {/* Optional message */}
                        {req.message && (
                          <p className="mt-3 text-sm text-slate-600 italic bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                            {req.message}
                          </p>
                        )}
                      </div>

                      {/* Hint */}
                      {status.hint && (
                        <p className="mt-4 pt-3 border-t border-slate-100 text-xs text-slate-500">
                          {status.hint}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {activeTab === "past" && (
          <div className="space-y-6">
            <h2 className="text-lg font-bold text-slate-900">
              Completed Sessions History
            </h2>
            {sessionsLoading && (
              <p className="text-center text-sm text-slate-500 py-10">
                Loading completed sessions…
              </p>
            )}
            {sessionsError && (
              <p className="text-center text-sm text-red-600 py-10">
                {sessionsError}
              </p>
            )}
            {!sessionsLoading && !sessionsError && (
              <>
                {sessions.filter((s) => s.status === "COMPLETED").length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-slate-200 p-8 text-center text-slate-500 bg-white">
                    No completed sessions in your history.
                  </div>
                ) : (
                  <div className="space-y-4">
                    {sessions
                      .filter((s) => s.status === "COMPLETED")
                      .map((session) => (
                        <SessionCard
                          key={session._id}
                          session={session}
                          user={user}
                          onUpdated={fetchSessions}
                        />
                      ))}
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {/* Request modal — only for logged-in users */}
        {selectedMentor && !isGuest && (
          <MentorRequestProvider>
            <RequestMentorModal
              mentor={selectedMentor}
              onClose={() => setSelectedMentor(null)}
            />
          </MentorRequestProvider>
        )}

        {/* FIX: Signup modal for all guest restricted actions */}
        {showAuthModal && (
          <SignupModal
            isOpen={showAuthModal}
            onClose={() => setShowAuthModal(false)}
            message="Create an account to request mentorship from alumni"
          />
        )}
      </div>
    </div>
  );
};

const MentorsDiscoveryPage = () => {
  const { user } = useAuth();

  if (user?.role === "admin") {
    return <AdminMentorship />;
  }

  return (
    <MentorDiscoveryProvider>
      <PageContent />
    </MentorDiscoveryProvider>
  );
};

export default MentorsDiscoveryPage;
