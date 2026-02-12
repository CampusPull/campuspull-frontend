import { useEffect, useState } from "react";
import api from "../../../utils/api";

import MentorStatusCard from "../components/mentorStatusCard";
import MentorApplyForm from "../components/mentorApplyForm";
import MentorEditForm from "../components/mentorEditForm";
import ErrorBanner from "../components/errorBanner";
import MentorRequests from "../components/mentorRequests";
import MentorSessions from "../components/mentorSessions";

const MentorProfilePage = () => {
  const [mentorProfile, setMentorProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchMentorProfile = async () => {
    try {
      setLoading(true);
      const res = await api.get("/mentorship/mentor/me");
      setMentorProfile(res.data.mentorProfile);
      setError(null);
    } catch (err) {
      // 404 = not a mentor yet (expected)
      if (err.response?.status === 404) {
        setMentorProfile(null);
        setError(null);
      } else {
        setError(
          err.response?.data?.message ||
            "Failed to load mentor profile"
        );
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMentorProfile();
  }, []);

  if (loading) {
    return (
      <p className="text-gray-500 text-center mt-8">
        Loading your mentor profile…
      </p>
    );
  }

  return (
  <div className="max-w-6xl mx-auto px-4 py-8 space-y-10">
    {/* Header */}
    <div>
      <h1 className="text-2xl font-semibold text-slate-900">
        Mentorship
      </h1>
      <p className="text-sm text-slate-500 mt-1">
        Manage your mentor profile, requests, and sessions
      </p>
    </div>

    <ErrorBanner message={error} />

    {/* Status */}
    <section className="rounded-3xl bg-gradient-to-r from-slate-900 to-slate-800 p-6 text-white shadow-lg">
  <MentorStatusCard mentor={mentorProfile} />
</section>

    {/* Not a mentor yet */}
    {!mentorProfile && (
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900 mb-2">
          Become a Mentor
        </h2>
        <p className="text-sm text-slate-600 mb-4">
          Apply to start mentoring students from your college.
        </p>

        <MentorApplyForm onSuccess={fetchMentorProfile} />
      </section>
    )}

    {/* Mentor workspace */}
    {mentorProfile && (
      <>
        

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
  {/* Incoming Requests */}
  <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
    <div className="mb-4 flex items-center justify-between">
      <h2 className="text-lg font-semibold text-slate-900">
        Incoming Requests
      </h2>
      <span className="text-xs text-slate-500">
        Action required
      </span>
    </div>

    <MentorRequests />
  </section>

  {/* Sessions */}
  <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
    <div className="mb-4 flex items-center justify-between">
      <h2 className="text-lg font-semibold text-slate-900">
        Sessions
      </h2>
      <span className="text-xs text-slate-500">
        Active & past
      </span>
    </div>

    <MentorSessions />
  </section>
</div>


        <details className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-md ">
  <summary className="cursor-pointer text-sm font-medium text-slate-700">
    Edit Mentor Profile
    <span className="ml-2 text-xs text-slate-400">
      (domains, experience)
    </span>
  </summary>

  <div className="mt-6">
    <MentorEditForm
      mentor={mentorProfile}
      onSuccess={fetchMentorProfile}
    />
  </div>
</details>
      </>
    )}
  </div>
);

};

export default MentorProfilePage;
