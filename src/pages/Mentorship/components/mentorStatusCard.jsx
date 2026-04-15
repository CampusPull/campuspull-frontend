import api from "../../../utils/api";
import { useState } from "react";

const MentorStatusCard = ({ mentor }) => {
  const [loading, setLoading] = useState(false);

  // 🟡 Not a mentor yet
  if (!mentor) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">
          Mentor Status
        </h2>
        <p className="mt-2 text-sm text-slate-500">
          You are not a mentor yet.
        </p>
      </div>
    );
  }

  // 🟡 Pending approval
  if (mentor.mentorStatus === "PENDING") {
    return (
      <div className="rounded-2xl border border-yellow-200 bg-yellow-50 p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-yellow-800">
          Application Under Review
        </h2>
        <p className="mt-2 text-sm text-yellow-700">
          Your mentor application is being reviewed. You’ll be able to start mentoring once approved.
        </p>
      </div>
    );
  }

  // 🔴 Rejected
  if (mentor.mentorStatus === "REJECTED") {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-red-800">
          Application Rejected
        </h2>
        <p className="mt-2 text-sm text-red-700">
          Your mentor application was not approved. You can update your profile and apply again.
        </p>
      </div>
    );
  }

  // 🟢 Only APPROVED mentors reach here
  const toggleActive = async () => {
    try {
      setLoading(true);

      if (mentor.isActive) {
        await api.patch("/mentorship/mentor/deactivate");
      } else {
        await api.patch("/mentorship/mentor/me", {
          isActive: true,
        });
      }

      window.location.reload();
    } catch (err) {
      console.error("Failed to update mentor status");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-3xl bg-gradient-to-r from-slate-900 to-slate-800 p-6 text-white shadow-lg">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">
            Mentor Status
          </h2>

          <p className="mt-1 text-sm text-slate-300">
            {mentor.isActive
              ? "You are currently accepting mentorship requests."
              : "Your mentorship is currently paused."}
          </p>
        </div>

        <span
          className={`rounded-full px-3 py-1 text-xs font-semibold ${
            mentor.isActive
              ? "bg-green-500/20 text-green-300"
              : "bg-yellow-500/20 text-yellow-300"
          }`}
        >
          {mentor.isActive ? "ACTIVE" : "INACTIVE"}
        </span>
      </div>

      <div className="mt-6">
        <button
          onClick={toggleActive}
          disabled={loading}
          className={`inline-flex items-center rounded-xl px-4 py-2 text-xs font-semibold transition
            ${
              mentor.isActive
                ? "border border-red-400 text-red-300 hover:bg-red-500/10"
                : "bg-white text-slate-900 hover:bg-slate-100"
            }
          `}
        >
          {loading
            ? "Updating…"
            : mentor.isActive
            ? "Deactivate Mentoring"
            : "Activate Mentoring"}
        </button>
      </div>
    </div>
  );
};

export default MentorStatusCard;