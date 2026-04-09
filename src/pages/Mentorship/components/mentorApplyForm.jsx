import { useState } from "react";
import api from "../../../utils/api";
import ErrorBanner from "../components/errorBanner";

const MentorApplyForm = ({ onSuccess }) => {
  const [domains, setDomains] = useState("");
  const [experience, setExperience] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError(null);

      await api.post("/mentorship/mentor/apply", {
        domains: domains
          .split(",")
          .map((d) => d.trim())
          .filter(Boolean),
        yearsOfExperience: Number(experience),
      });

      onSuccess();
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to apply as a mentor"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-5"
    >
      {/* Header */}
      <div>
        <h3 className="text-lg font-semibold text-slate-900">
          Become a Mentor
        </h3>
        <p className="text-sm text-slate-500 mt-1">
          Share your experience and help juniors grow
        </p>
      </div>

      {/* Domains */}
      <div>
        <label className="block text-sm font-medium text-slate-700">
          Mentoring domains *
        </label>
        <input
          className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm
                     focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-400"
          placeholder="DevOps, Backend, Placements, Resume"
          value={domains}
          onChange={(e) => setDomains(e.target.value)}
          required
        />
        <p className="text-xs text-slate-500 mt-1">
          Separate multiple domains with commas
        </p>
      </div>

      {/* Experience */}
      <div>
        <label className="block text-sm font-medium text-slate-700">
          Years of experience
        </label>
        <input
          className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm
                     focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-400"
          placeholder="e.g. 3"
          type="number"
          min="0"
          value={experience}
          onChange={(e) => setExperience(e.target.value)}
        />
      </div>

      <ErrorBanner message={error} />

      {/* CTA */}
      <div className="pt-2">
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-semibold
                     text-white hover:bg-slate-800 transition disabled:opacity-50"
        >
          {loading ? "Submitting…" : "Apply as Mentor"}
        </button>
      </div>
    </form>
  );
};

export default MentorApplyForm;
