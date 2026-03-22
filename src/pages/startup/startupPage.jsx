import { useState, useContext } from "react";
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
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-2xl font-semibold">
            Student Startups
          </h1>
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

      {loading && <p>Loading startups...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {!loading && !error && (
        <StartupList startups={startups} />
      )}

      {open && (
        <AddStartupModal onClose={() => setOpen(false)} />
      )}
    </div>
  );
};

export default StartupPage;
