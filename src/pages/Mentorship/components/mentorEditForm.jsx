import { useEffect, useState } from "react";
import api from "../../../utils/api";
import ErrorBanner from "../components/errorBanner";

const MentorEditForm = ({ mentor, onSuccess }) => {
  const [domains, setDomains] = useState("");
  const [experience, setExperience] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    setDomains(mentor.domains.join(", "));
    setExperience(mentor.yearsOfExperience || "");
  }, [mentor]);

  const handleUpdate = async () => {
    try {
      setLoading(true);
      setError(null);

      await api.patch("/mentorship/mentor/me", {
        domains: domains
          .split(",")
          .map((d) => d.trim())
          .filter(Boolean),
        yearsOfExperience: Number(experience),
      });

      onSuccess();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to update mentor profile"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-slate-900">
          Mentor Profile
        </h2>
        <p className="mt-1 text-sm text-slate-500">
          Update what you mentor in and your experience level
        </p>
      </div>

      <div className="space-y-5">
        {/* Domains */}
        <div>
          <label className="block text-sm font-medium text-slate-700">
            Mentoring domains
          </label>
          <input
            className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm
                       focus:border-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900"
            placeholder="DevOps, Backend, Placements"
            value={domains}
            onChange={(e) => setDomains(e.target.value)}
          />
          <p className="mt-1 text-xs text-slate-500">
            Separate multiple domains with commas
          </p>
        </div>

        {/* Experience */}
        <div>
          <label className="block text-sm font-medium text-slate-700">
            Years of experience
          </label>
          <input
            type="number"
            min="0"
            className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm
                       focus:border-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900"
            placeholder="e.g. 3"
            value={experience}
            onChange={(e) => setExperience(e.target.value)}
          />
        </div>

        <ErrorBanner message={error} />

        {/* Actions */}
        <div className="flex justify-end pt-2">
          <button
            onClick={handleUpdate}
            disabled={loading}
            className="inline-flex items-center rounded-xl bg-slate-900 px-5 py-2.5
                       text-sm font-semibold text-white
                       hover:bg-slate-800 disabled:opacity-50"
          >
            {loading ? "Updating…" : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default MentorEditForm;
