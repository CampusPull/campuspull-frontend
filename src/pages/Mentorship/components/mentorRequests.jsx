import { useEffect, useState } from "react";
import api from "../../../utils/api";
import ErrorBanner from "./errorBanner";

const MentorRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState(null); // requestId

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        // ✅ FIXED: endpoint consistency
        const res = await api.get("/mentorship/request/incoming");
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

    fetchRequests();
  }, []);

  const decideRequest = async (requestId, decision) => {
    try {
      setActionLoading(requestId);

      // ✅ FIXED: endpoint consistency
      await api.patch(`/mentorship/request/${requestId}`, {
        decision,
      });

      // optimistic update
      setRequests((prev) =>
        prev.map((req) =>
          req._id === requestId
            ? { ...req, status: decision }
            : req
        )
      );
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to update request"
      );
    } finally {
      setActionLoading(null);
    }
  };

  if (loading) {
    return (
      <p className="text-gray-500 text-center mt-6">
        Loading mentorship requests…
      </p>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-semibold">
          Mentorship Requests
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Students requesting your mentorship
        </p>
      </div>

      <ErrorBanner message={error} />

      {requests.length === 0 ? (
        <p className="text-gray-500">
          You don’t have any pending mentorship requests.
        </p>
      ) : (
        <ul className="space-y-4">
          {requests.map((req) => (
            <li
              key={req._id}
              className="border rounded-lg p-4 bg-white shadow-sm"
            >
              {/* Name + Status */}
              <div className="flex items-center justify-between">
                <p className="font-medium text-lg">
                  {req.menteeId?.name || "Student"}
                </p>

                <span
                  className={`text-xs font-semibold px-2 py-1 rounded ${
                    req.status === "PENDING"
                      ? "bg-yellow-100 text-yellow-700"
                      : req.status === "ACCEPTED"
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {req.status}
                </span>
              </div>

              {/* Goal */}
              <p className="text-sm text-gray-600 mt-2">
                <span className="font-medium">Goal:</span>{" "}
                {req.goal}
              </p>

              {/* Message */}
              {req.message && (
                <p className="text-sm text-gray-700 mt-2">
                  {req.message}
                </p>
              )}

              {/* Actions */}
              {req.status === "PENDING" && (
                <div className="flex gap-3 mt-4">
                  <button
                    disabled={actionLoading === req._id}
                    onClick={() =>
                      decideRequest(req._id, "ACCEPTED")
                    }
                    className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
                  >
                    {actionLoading === req._id
                      ? "Accepting..."
                      : "Accept"}
                  </button>

                  <button
                    disabled={actionLoading === req._id}
                    onClick={() =>
                      decideRequest(req._id, "REJECTED")
                    }
                    className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50"
                  >
                    {actionLoading === req._id
                      ? "Rejecting..."
                      : "Reject"}
                  </button>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default MentorRequests;
