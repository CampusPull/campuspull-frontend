import { useState, useEffect } from "react";
import { useMentorRequest } from "../../../context/mentorRequestContext";
import ErrorBanner from "./errorBanner";

const RequestMentorModal = ({ mentor, onClose }) => {
  const { sendRequest, loading, error, success } = useMentorRequest();
  const [goal, setGoal] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!goal.trim()) return;

    await sendRequest({
      mentorId: mentor.userId._id,
      goal,
      message,
    });
  };

  useEffect(() => {
    if (success) {
      onClose();
    }
  }, [success, onClose]);

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-lg w-full max-w-md p-6 shadow-lg"
      >
        {/* Header */}
        <div className="mb-4">
          <h2 className="text-xl font-semibold">
            Request Mentorship
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            You’re reaching out to{" "}
            <span className="font-medium">
              {mentor.userId.name}
            </span>
          </p>
        </div>

        {/* Goal */}
        <label className="block mb-4">
          <span className="text-sm font-medium">
            What do you want help with? *
          </span>
          <input
            className="mt-1 w-full border rounded px-3 py-2 focus:outline-none focus:ring focus:ring-blue-200"
            placeholder="e.g. DevOps roadmap, resume review, career guidance"
            value={goal}
            onChange={(e) => setGoal(e.target.value)}
            required
          />
        </label>

        {/* Message */}
        <label className="block mb-3">
          <span className="text-sm font-medium">
            Additional message (optional)
          </span>
          <textarea
            className="mt-1 w-full border rounded px-3 py-2 focus:outline-none focus:ring focus:ring-blue-200"
            placeholder="Brief context about your background or expectations"
            rows={3}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
        </label>

        <ErrorBanner message={error} />

        {/* Actions */}
        <div className="mt-5 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? "Sending..." : "Send Request"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default RequestMentorModal;
