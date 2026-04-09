import { useEffect, useState } from "react";
import api from "../../../utils/api";
import { useNavigate } from "react-router-dom";
import ErrorBanner from "./errorBanner";

const statusMap = {
  PENDING: {
    label: "Pending",
    color: "bg-yellow-100 text-yellow-700",
    hint: "Waiting for mentor response",
  },
  ACCEPTED: {
    label: "Accepted",
    color: "bg-green-100 text-green-700",
    hint: "Session will appear in My Sessions",
  },
  REJECTED: {
    label: "Rejected",
    color: "bg-red-100 text-red-700",
    hint: "You may request another mentor",
  },
};

const MyRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchMyRequests = async () => {
      try {
        const res = await api.get("/mentorship/request/my");
        setRequests(res.data.requests || []);
      } catch (err) {
        setError(
          err.response?.data?.message ||
            "Failed to load mentorship requests"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchMyRequests();
  }, []);

  if (loading) {
    return (
      <p className="text-gray-500 text-center mt-8">
        Loading your requests…
      </p>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold">
            Sent Mentorship Requests
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Track the mentors you’ve reached out to
          </p>
        </div>

        <button
          className="text-sm text-blue-600 hover:underline"
          onClick={() => navigate("/mentorship/mentors")}
        >
          ← Back to Mentors
        </button>
      </div>

      <ErrorBanner message={error} />

      {requests.length === 0 ? (
        <div className="rounded-xl border border-dashed p-6 text-center text-gray-500">
          You haven’t sent any mentorship requests yet.
        </div>
      ) : (
        <ul className="space-y-5">
          {requests.map((req) => {
            const status = statusMap[req.status];

            return (
              <li
                key={req._id}
                className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
              >
                {/* Top row */}
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <img
                      src={req.mentorId?.profileImage || "/avatar.png"}
                      alt={req.mentorId?.name}
                      className="h-10 w-10 rounded-full object-cover"
                    />

                    <div>
                      <p className="font-medium text-slate-900">
                        {req.mentorId?.name || "Mentor"}
                      </p>
                      <p className="text-xs text-slate-500">
                        Mentor
                      </p>
                    </div>
                  </div>

                  <span
                    className={`text-xs font-semibold px-3 py-1 rounded-full ${status.color}`}
                  >
                    {status.label}
                  </span>
                </div>

                {/* Goal */}
                <p className="mt-3 text-sm text-slate-700">
                  <span className="font-medium">Goal:</span>{" "}
                  {req.goal}
                </p>

                {/* Optional message */}
                {req.message && (
                  <p className="mt-2 text-sm text-slate-600">
                    {req.message}
                  </p>
                )}

                {/* Hint */}
                <p className="mt-3 text-xs text-slate-500">
                  {status.hint}
                </p>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default MyRequests;
