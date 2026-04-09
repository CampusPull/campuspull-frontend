import api from "../../../utils/api";
import { useState } from "react";

const MentorStatusCard = ({ mentor }) => {
  const [loading, setLoading] = useState(false);

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

      // simple + safe for MVP
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
        {/* Status info */}
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

        {/* Status badge */}
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

      {/* Action */}
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
