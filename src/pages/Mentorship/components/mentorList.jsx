import MentorCard from "./mentorCard";

// FIX: accept isGuest and onRestrictedAction
const MentorList = ({ mentors, onRequest, isGuest, onRestrictedAction, myRequests }) => {
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
  mentor={mentor}
  onRequest={onRequest}
  isGuest={isGuest}
  onRestrictedAction={onRestrictedAction}
  myRequests={myRequests}
/>
      ))}
    </div>
  );
};

export default MentorList;