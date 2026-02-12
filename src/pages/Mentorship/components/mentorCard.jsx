const MentorCard = ({ mentor, onRequest }) => {
  const user = mentor.userId;

  return (
    <div className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
      
      {/* Top gradient accent */}
      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-blue-500 to-indigo-500" />

      {/* Avatar section */}
      <div className="flex flex-col items-center pt-6 px-5">
        <div className="relative">
          <img
            src={user.profileImage || "/avatar.png"}
            alt={user.name}
            className="h-20 w-20 rounded-full object-cover ring-4 ring-white shadow-md"
          />
          {mentor.isActive && (
            <span className="absolute bottom-1 right-1 h-4 w-4 rounded-full bg-green-500 ring-2 ring-white" />
          )}
        </div>

        <h3 className="mt-4 text-base font-semibold text-slate-900 text-center">
          {user.name}
        </h3>

        {user.headline && (
          <p className="mt-1 text-sm text-slate-600 text-center line-clamp-2">
            {user.headline}
          </p>
        )}

        <p className="mt-1 text-xs text-slate-500 text-center">
          {mentor.yearsOfExperience}+ yrs experience
          {user.currentCompany && ` • ${user.currentCompany}`}
        </p>
      </div>

      {/* Domains */}
      <div className="mt-4 px-5 flex flex-wrap justify-center gap-2">
        {mentor.domains.slice(0, 4).map((domain) => (
          <span
            key={domain}
            className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700"
          >
            {domain}
          </span>
        ))}
        {mentor.domains.length > 4 && (
          <span className="text-xs text-slate-500">
            +{mentor.domains.length - 4} more
          </span>
        )}
      </div>

      {/* Footer */}
      <div className="mt-6 px-5 pb-5 flex flex-col gap-3">
        <div className="text-center text-xs text-slate-500">
          {mentor.studentsMentored ?? 0} students mentored
        </div>

        <button
          onClick={() => onRequest(mentor)}
          className="w-full rounded-xl bg-slate-900 py-2 text-sm font-semibold text-white transition-colors duration-200 hover:bg-slate-800"
        >
          Request Mentorship
        </button>
      </div>
    </div>
  );
};

export default MentorCard;
