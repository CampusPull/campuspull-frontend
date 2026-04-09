import MentorCard from "./mentorCard";

// FIX: accept isGuest and onRestrictedAction
const MentorList = ({ mentors, onRequest, isGuest, onRestrictedAction }) => {
  if (!mentors.length) {
    return (
      <div className="text-center text-gray-500 mt-10">
        <p className="text-sm">No mentors are available right now.</p>
        <p className="text-xs mt-1">Please check back later.</p>
      </div>
    );
  }

  return (
    <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
      {mentors.map((mentor) => (
        <MentorCard
          key={mentor._id}
          mentor={mentor}
          onRequest={onRequest}
          isGuest={isGuest}                     // FIX: pass guest state
          onRestrictedAction={onRestrictedAction} // FIX: pass modal trigger
        />
      ))}
    </div>
  );
};

export default MentorList;