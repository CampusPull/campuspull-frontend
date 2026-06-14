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
  const [refreshSessions, setRefreshSessions] = useState(false);

const triggerSessionRefresh = () => {
  setRefreshSessions(prev => !prev);
};

  const [activeMentors, setActiveMentors] = useState([]);
  const [fetchingMentors, setFetchingMentors] = useState(false);

  const fetchActiveMentors = async () => {
    try {
      setFetchingMentors(true);
      const res = await api.get("/mentorship/mentors");
      setActiveMentors(res.data.mentors || []);
    } catch (err) {
      console.error("Failed to fetch active mentors:", err);
    } finally {
      setFetchingMentors(false);
    }
  };

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
    fetchActiveMentors();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 pt-24 flex items-center justify-center">
        <p className="text-gray-500 text-center font-medium">
          Loading your mentor profile…
        </p>
      </div>
    );
  }

  return (
  <div className="max-w-6xl mx-auto px-4 pt-24 pb-8 space-y-10">
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
      <div className="space-y-10">
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900 mb-2">
            Become a Mentor
          </h2>
          <p className="text-sm text-slate-600 mb-4">
            Apply to start mentoring students from your college.
          </p>

          <MentorApplyForm onSuccess={fetchMentorProfile} />
        </section>

        {/* Meet Our Mentors Section */}
        <section className="space-y-6">
          <div className="flex flex-col">
            <h2 className="text-xl font-extrabold text-slate-800">Meet Our Mentors</h2>
            <p className="text-xs text-slate-400 font-semibold mt-0.5">Connect and learn from active professional mentors</p>
          </div>

          {fetchingMentors ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map(i => (
                <div key={i} className="bg-white/50 border border-slate-100 rounded-3xl p-6 h-48 animate-pulse space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-slate-200 rounded-full shrink-0" />
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-slate-200 rounded w-2/3" />
                      <div className="h-3 bg-slate-200 rounded w-1/2" />
                    </div>
                  </div>
                  <div className="h-10 bg-slate-200 rounded-xl w-full" />
                </div>
              ))}
            </div>
          ) : activeMentors.length === 0 ? (
            <div className="bg-white border border-slate-100 rounded-3xl p-8 text-center text-slate-400 text-sm">
              No active mentors found in the database.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {activeMentors.map((mentor) => {
                const name = mentor.userId?.name || "Anonymous Mentor";
                const currentCompany = mentor.userId?.currentCompany || mentor.currentCompany || "Industry Professional";
                const headline = mentor.userId?.headline || mentor.headline || "Alumni Mentor";
                const avatar = mentor.userId?.profileImage || mentor.userId?.avatar;
                const initials = name.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2);

                return (
                  <div
                    key={mentor._id}
                    className="group bg-white/70 backdrop-blur-md border border-slate-100 rounded-3xl p-6 hover:shadow-xl hover:border-indigo-100 transition-all duration-300 flex flex-col h-full relative overflow-hidden"
                    style={{ boxShadow: "0 2px 16px rgba(0,0,0,0.04)" }}
                  >
                    {/* Decorative corner glow */}
                    <div className="absolute -top-12 -right-12 w-24 h-24 bg-indigo-500/5 rounded-full blur-xl group-hover:bg-indigo-500/10 transition-colors duration-300 pointer-events-none" />

                    {/* Header info */}
                    <div className="flex items-center gap-4 mb-4">
                      <div className="relative flex-shrink-0">
                        <div className="w-14 h-14 rounded-full border-2 border-indigo-50 bg-indigo-50 overflow-hidden flex items-center justify-center shadow-sm">
                          {avatar ? (
                            <img
                              src={avatar}
                              alt={name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <span className="text-base font-extrabold text-indigo-500">
                              {initials}
                            </span>
                          )}
                        </div>
                        <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-emerald-500 border-2 border-white rounded-full shadow" />
                      </div>

                      <div className="min-w-0">
                        <h3 className="text-base font-bold text-slate-800 group-hover:text-indigo-600 transition-colors leading-snug truncate">
                          {name}
                        </h3>
                        <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider mt-0.5 truncate">
                          {currentCompany}
                        </p>
                      </div>
                    </div>

                    {/* Headline / Description */}
                    <div className="flex-1 bg-slate-50/50 rounded-2xl p-4 border border-slate-100/50 mb-4">
                      <p className="text-xs font-semibold text-slate-500 leading-relaxed italic line-clamp-2 text-slate-600">
                        "{headline}"
                      </p>
                      <p className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest mt-2 flex items-center gap-1">
                        <span>Exp:</span>
                        <strong className="text-slate-700">{mentor.yearsOfExperience} Year{mentor.yearsOfExperience !== 1 ? "s" : ""}</strong>
                      </p>
                    </div>

                    {/* Domain badges */}
                    {mentor.domains?.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 pt-3 border-t border-slate-50">
                        {mentor.domains.slice(0, 3).map((domain, i) => (
                          <span
                            key={i}
                            className="px-2.5 py-1 bg-indigo-50 text-indigo-600 text-[10px] font-bold rounded-lg border border-indigo-100/40 uppercase tracking-wider"
                          >
                            {domain}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </div>
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

    <MentorRequests onUpdated={triggerSessionRefresh} />

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

    <MentorSessions refreshTrigger={refreshSessions} isNested={true} />
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
