import { useState } from "react";
import { useStartups } from "../../context/startupContext";
import { useAuth } from "../../context/AuthContext";
import StartupList from "./component/startupList";
import AddStartupModal from "./component/addStartupModal";
import SignupModal from "../../components/ui/SignupModal";

const StartupPage = () => {
  const {
    startups,
    loading,
    error,
    isGuest,          // FIX
    showAuthModal,    // FIX
    setShowAuthModal, // FIX
  } = useStartups();

  const { user } = useAuth();
  const [open, setOpen] = useState(false);

  // FIX: guests can never be admin
  const isAdmin = !isGuest && user?.role === "admin";

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-2xl font-semibold">Student Startups</h1>
          <p className="text-gray-600">
            Startups of the students of our college. Explore and support their ventures!
          </p>
        </div>

        {isAdmin && (
          <button
            onClick={() => setOpen(true)}
            className="px-4 py-2 bg-black text-white rounded"
          >
            Add Startup
          </button>
        )}
      </div>

      {/* FIX: Guest banner */}
      {isGuest && (
        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-2xl flex items-center justify-between gap-4">
          <p className="text-blue-700 font-medium text-sm">
            👋 You're browsing as a guest. Create an account to contact startups and follow their journey.
          </p>
          <button
            onClick={() => setShowAuthModal(true)}
            className="shrink-0 px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-xl hover:bg-blue-700 transition"
          >
            Join Now
          </button>
        </div>
      )}

      {loading && <p>Loading startups...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {!loading && !error && (
        <StartupList
          startups={startups}
          isGuest={isGuest}                           // FIX: pass to list
          onRestrictedAction={() => setShowAuthModal(true)} // FIX: pass modal trigger
        />
      )}

      {open && <AddStartupModal onClose={() => setOpen(false)} />}

      {/* FIX: Signup modal for guest restricted actions */}
      {showAuthModal && (
        <SignupModal
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
          message="Create an account to contact and follow startups"
        />
      )}
    </div>
  );
};

export default StartupPage;