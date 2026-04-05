import StartupCard from "./startupCard";

const StartupList = ({ startups, isGuest, onRestrictedAction }) => {
  if (!startups || startups.length === 0) {
    return (
      <p className="text-gray-500">
        No startups available at the moment.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {startups.map((startup) => (
        <StartupCard
          key={startup._id}
          startup={startup}
          isGuest={isGuest}
          onRestrictedAction={onRestrictedAction}
        />
      ))}
    </div>
  );
};

export default StartupList;