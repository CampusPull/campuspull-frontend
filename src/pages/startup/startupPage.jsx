import { useState } from "react";
import { FaPlus, FaRocket } from "react-icons/fa";
import { useStartups } from "../../context/startupContext";
import { useAuth } from "../../context/AuthContext";

import StartupList from "./component/startupList";
import AddStartupModal from "./component/addStartupModal";

const StartupPage = () => {
  const { startups, loading, error } = useStartups();
  const { user } = useAuth();

  const [open, setOpen] = useState(false);

  const isAdmin = user?.role === "admin";

  return (
    <div className="min-h-screen p-4 md:p-10 bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center mb-10 gap-6">
        <div>
          <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 flex items-center gap-3">
            <FaRocket className="text-indigo-600" /> Student Startups
          </h1>
          <p className="text-gray-600 mt-3 font-medium text-lg">
            Discover and support the next big ventures built by our campus innovators.
          </p>
        </div>

        {isAdmin && (
          <button
            onClick={() => setOpen(true)}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-2xl font-bold shadow-md hover:shadow-lg transition-all hover:scale-105"
          >
            <FaPlus /> Add Startup
          </button>
        )}
      </div>

      {/* FIX: Guest banner */}
      {isGuest && (
        <div className="max-w-7xl mx-auto mb-8 p-5 bg-white/70 backdrop-blur-md border border-indigo-200 rounded-3xl shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4 transition-all hover:shadow-md">
          <p className="text-indigo-800 font-medium text-sm md:text-base">
            👋 You're browsing as a guest. Create an account to contact startups and follow their journey.
          </p>
          <button
            onClick={() => setShowAuthModal(true)}
            className="shrink-0 px-6 py-2.5 bg-indigo-600 text-white font-bold rounded-xl shadow hover:bg-indigo-700 transition-colors"
          >
            Join Now
          </button>
        </div>
      )}

      <div className="max-w-7xl mx-auto">

      {loading && <p>Loading startups...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {!loading && !error && (
        <StartupList startups={startups} />
      )}
      </div>

      {open && (
        <AddStartupModal onClose={() => setOpen(false)} />
      )}
    </div>
  );
};

export default StartupPage;
