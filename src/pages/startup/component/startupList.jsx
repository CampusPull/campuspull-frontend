import { useState } from "react";
import StartupCard from "./startupCard";
import StartupDetailsModal from "./startupDetailsModal";

const StartupList = ({ startups, isGuest, onRestrictedAction }) => {
  const [selectedStartup, setSelectedStartup] = useState(null);
  if (!startups || startups.length === 0) {
    return (
      <p className="text-gray-500">
        No startups available at the moment.
      </p>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {startups.map((startup) => (
          <StartupCard
            key={startup._id}
            startup={startup}
            isGuest={isGuest}
            onRestrictedAction={onRestrictedAction}
            onClick={() => setSelectedStartup(startup)}
          />
        ))}
      </div>
      
      {selectedStartup && (
        <StartupDetailsModal
          startup={selectedStartup}
          onClose={() => setSelectedStartup(null)}
        />
      )}
    </>
  );
};

export default StartupList;