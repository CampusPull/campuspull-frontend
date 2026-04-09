import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  MentorDiscoveryProvider,
  useMentorDiscovery,
} from "../../../context/mentorDiscoveryContext";
import { MentorRequestProvider } from "../../../context/mentorRequestContext";
import RequestMentorModal from "../components/requestMentorModal";
import MentorList from "../components/mentorList";
import SignupModal from "../../../components/ui/SignupModal"; // FIX

const PageContent = () => {
  const navigate = useNavigate();
  const {
    mentors,
    loading,
    error,
    isGuest,          // FIX
    showAuthModal,    // FIX
    setShowAuthModal, // FIX
  } = useMentorDiscovery();

  const [selectedMentor, setSelectedMentor] = useState(null);

  const handleRequestClick = (mentor) => {
    // isGuest check already handled in MentorCard
    setSelectedMentor(mentor);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-6xl mx-auto px-4 py-10">

        {/* Header */}
        <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-semibold text-slate-900">Find a Mentor</h1>
            <p className="mt-2 text-sm text-slate-600 max-w-md">
              Learn directly from alumni who've walked the path you're on.
              Request one-on-one mentorship and grow faster.
            </p>
          </div>

          {/* FIX: My Requests and My Sessions trigger modal for guests */}
          <div className="flex gap-3">
            <button
              onClick={() => isGuest ? setShowAuthModal(true) : navigate("/mentorship/my-requests")}
              className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
            >
              My Requests
            </button>
            <button
              onClick={() => isGuest ? setShowAuthModal(true) : navigate("/mentorship/sessions")}
              className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800"
            >
              My Sessions
            </button>
          </div>
        </div>

        {/* FIX: Guest banner */}
        {isGuest && (
          <div className="mb-8 p-4 bg-blue-50 border border-blue-200 rounded-2xl flex items-center justify-between gap-4">
            <p className="text-blue-700 font-medium text-sm">
              👋 You're browsing as a guest. Create an account to request mentorship from alumni.
            </p>
            <button
              onClick={() => setShowAuthModal(true)}
              className="shrink-0 px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-xl hover:bg-blue-700 transition"
            >
              Join Now
            </button>
          </div>
        )}

        {loading && (
          <p className="mt-20 text-center text-sm text-slate-500">Loading mentors…</p>
        )}

        {error && (
          <p className="mt-20 text-center text-sm text-red-600">{error}</p>
        )}

        {!loading && !error && mentors.length === 0 && (
          <div className="mt-20 text-center">
            <p className="text-sm text-slate-600">No mentors available right now.</p>
            <p className="mt-1 text-xs text-slate-500">Check back later or explore sessions.</p>
          </div>
        )}

        {!loading && !error && mentors.length > 0 && (
          <MentorList
            mentors={mentors}
            onRequest={handleRequestClick}
            isGuest={isGuest}                           // FIX
            onRestrictedAction={() => setShowAuthModal(true)} // FIX
          />
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
  return (
    <MentorDiscoveryProvider>
      <PageContent />
    </MentorDiscoveryProvider>
  );
};

export default MentorsDiscoveryPage;