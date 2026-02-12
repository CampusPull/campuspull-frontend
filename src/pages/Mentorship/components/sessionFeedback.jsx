import { useState } from "react";
import api from "../../../utils/api";

const SessionFeedbackModal = ({ sessionId, onClose, onSuccess }) => {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

const submit = async (e) => {
  e.preventDefault();
  if (loading) return;

  setLoading(true);
  setError(null);

  try {
    const response = await api.post(`/mentorship/session/${sessionId}/feedback`, { 
      rating, 
      comment 
    });

    // If we reached here, the API call DEFINITELY worked.
    console.log("API Success:", response.data);

    // Use a try/catch here so a UI refresh bug doesn't show a "Server Error"
    try {
      onSuccess();
      onClose();
    } catch (refreshError) {
      console.error("UI Refresh Error:", refreshError);
      onClose(); // Still close the modal because the data IS saved!
    }

  } catch (err) {
    // This block ONLY runs if the API returns 4xx or 5xx
    const status = err.response?.status;
    if (status === 409) {
      onSuccess();
      onClose();
    } else {
      setError(err.response?.data?.message || "Network error. Please check your connection.");
    }
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
      <form
        onSubmit={submit}
        className="w-full max-w-md rounded-2xl bg-white p-6"
      >
        <h2 className="text-lg font-semibold mb-4">Session Feedback</h2>

        <label className="block text-sm mb-3">
          Rating
          <select
            value={rating}
            onChange={(e) => setRating(Number(e.target.value))}
            className="mt-1 w-full rounded-lg border px-3 py-2"
          >
            {[5, 4, 3, 2, 1].map((r) => (
              <option key={r} value={r}>
                {r} ⭐
              </option>
            ))}
          </select>
        </label>

        <label className="block text-sm mb-3">
          Comment (optional)
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="mt-1 w-full rounded-lg border px-3 py-2"
            rows={4}
          />
        </label>

        {error && <p className="text-sm text-red-600 mb-2">{error}</p>}

        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="text-sm text-slate-600"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading || !rating}
            className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
          >
            {loading ? "Submitting..." : "Submit Feedback"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default SessionFeedbackModal;
