import React, { useEffect, useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useStartups } from "../../context/startupContext";
import { useInternships } from "../../context/internshipContext";
import { useAuth } from "../../context/AuthContext";
import Icon from "../../components/AppIcon";
import Button from "../../components/ui/Button";
import SignupModal from "../../components/ui/SignupModal";

const StartupProfilePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getStartupById, isGuest, showAuthModal, setShowAuthModal } = useStartups();
  const { internships, fetchInternships } = useInternships();
  const { user } = useAuth();
  
  const [startup, setStartup] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const data = await getStartupById(id);
        if (data) {
          setStartup(data);
        } else {
          setError("Startup not found");
        }
      } catch (err) {
        setError("Failed to load startup details");
      } finally {
        setLoading(false);
      }
    };

    loadData();
    // Fetch internships to filter them later
    fetchInternships();
  }, [id, getStartupById, fetchInternships]);

  // Filter jobs for this specific startup
  const startupJobs = useMemo(() => {
    if (!startup || !internships) return [];
    return internships.filter(job => 
      job.companyName?.toLowerCase().trim() === startup.name?.toLowerCase().trim()
    );
  }, [startup, internships]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-500 font-medium">Loading Startup Profile...</p>
        </div>
      </div>
    );
  }

  if (error || !startup) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
        <div className="max-w-md w-full bg-white rounded-3xl p-10 shadow-xl border border-gray-100 text-center">
          <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <Icon name="AlertCircle" size={40} color="#EF4444" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">{error || "Something went wrong"}</h2>
          <p className="text-gray-500 mb-8">The startup you are looking for might have been moved or deleted.</p>
          <Button onClick={() => navigate("/startups")} className="w-full">
            Back to Startups
          </Button>
        </div>
      </div>
    );
  }

  const formatUrl = (url) => {
    if (!url) return "#";
    return url.startsWith("http") ? url : `https://${url}`;
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Hero Header Section */}
      <div className="relative">
        <div className="h-48 md:h-64 bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-800 w-full overflow-hidden relative">
            <div className="absolute inset-0 opacity-20">
                <div className="absolute top-10 left-10 w-32 h-32 bg-white rounded-full blur-3xl"></div>
                <div className="absolute bottom-10 right-20 w-64 h-64 bg-purple-300 rounded-full blur-3xl"></div>
            </div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 md:px-10 relative -mt-16 md:-mt-24 mb-6">
          <div className="bg-white/80 backdrop-blur-2xl border border-white p-6 md:p-8 rounded-[2.5rem] shadow-2xl shadow-indigo-100/50 flex flex-col md:flex-row items-center md:items-end gap-6 md:gap-8">
            <div className="w-32 h-32 md:w-44 md:h-44 bg-white rounded-3xl shadow-xl border border-gray-100 flex items-center justify-center p-4 overflow-hidden -mt-12 md:-mt-20">
              {startup.logo?.url ? (
                <img src={startup.logo.url} alt={startup.name} className="w-full h-full object-contain" />
              ) : (
                <Icon name="Rocket" size={60} color="#4F46E5" />
              )}
            </div>
            
            <div className="flex-1 text-center md:text-left mb-2">
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mb-2">
                <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900">{startup.name}</h1>
                <div className="flex gap-2">
                    <span className="px-3 py-1 bg-indigo-50 text-indigo-700 text-[10px] uppercase font-bold tracking-widest rounded-full border border-indigo-100">
                        {startup.domain}
                    </span>
                    <span className="px-3 py-1 bg-purple-50 text-purple-700 text-[10px] uppercase font-bold tracking-widest rounded-full border border-purple-100">
                        {startup.stage}
                    </span>
                </div>
              </div>
              <p className="text-lg text-gray-600 font-medium max-w-2xl">{startup.shortDescription}</p>
            </div>
            
            <div className="flex flex-col gap-3 shrink-0 w-full md:w-auto">
               {startup.links?.website && (
                  <Button 
                    onClick={() => window.open(formatUrl(startup.links.website), "_blank")}
                    className="bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-200"
                  >
                    Visit Website <Icon name="ExternalLink" size={16} className="ml-2" />
                  </Button>
               )}
               {isGuest ? (
                 <Button variant="outline" onClick={() => setShowAuthModal(true)}>
                    Follow Startup
                 </Button>
               ) : (
                 <Button variant="outline">
                    Follow
                 </Button>
               )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-10 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Content Areas */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* About Section */}
            <section className="bg-white rounded-[2rem] p-8 shadow-sm border border-gray-100">
                <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                   <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center">
                    <Icon name="Info" size={20} color="#4F46E5" />
                   </div>
                   About Startup
                </h2>
                <div className="prose prose-indigo max-w-none text-gray-600 leading-relaxed whitespace-pre-wrap">
                    {startup.description || startup.shortDescription || "No detailed description available."}
                </div>
            </section>

            {/* Activity/Updates Section */}
            <section className="bg-white rounded-[2rem] p-8 shadow-sm border border-gray-100">
                <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                   <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center">
                    <Icon name="MessageSquare" size={20} color="#9333EA" />
                   </div>
                   Recent Activity
                </h2>
                
                {/* Empty State Placeholder */}
                <div className="py-12 px-6 text-center border-2 border-dashed border-gray-100 rounded-2xl">
                    <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 grayscale opacity-50">
                        <Icon name="History" size={30} color="#6B7280" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-700 mb-1">No recent updates</h3>
                    <p className="text-gray-400 text-sm max-w-xs mx-auto">This startup hasn't shared any updates or posts yet. Check back soon!</p>
                </div>
            </section>

            {/* Jobs Section */}
            <section className="bg-white rounded-[2rem] p-8 shadow-sm border border-gray-100">
                <div className="flex items-center justify-between mb-8">
                    <h2 className="text-xl font-bold text-gray-800 flex items-center gap-3">
                        <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center">
                            <Icon name="Briefcase" size={20} color="#059669" />
                        </div>
                        Open Roles
                    </h2>
                    {startupJobs.length > 0 && (
                        <span className="bg-emerald-100 text-emerald-700 text-xs font-bold px-3 py-1 rounded-full">
                            {startupJobs.length} Openings
                        </span>
                    )}
                </div>

                {startupJobs.length > 0 ? (
                    <div className="grid gap-4">
                        {startupJobs.map((job) => (
                            <div key={job._id} onClick={() => navigate(`/internships/${job._id}`)} className="group cursor-pointer p-5 bg-white border border-gray-100 rounded-2xl hover:border-emerald-200 hover:bg-emerald-50/30 transition-all">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h4 className="font-bold text-gray-800 mb-1 group-hover:text-emerald-700 transition-colors">{job.title}</h4>
                                        <div className="flex items-center gap-3 text-sm text-gray-500">
                                            <span className="flex items-center gap-1"><Icon name="MapPin" size={14} /> {job.location || 'Remote'}</span>
                                            <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                                            <span className="flex items-center gap-1"><Icon name="Clock" size={14} /> {job.type || 'Full Time'}</span>
                                        </div>
                                    </div>
                                    <Button variant="ghost" size="sm" className="text-emerald-600 hover:text-emerald-700 hover:bg-emerald-100">View Job</Button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="py-12 px-6 text-center border-2 border-dashed border-gray-100 rounded-2xl">
                        <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 opacity-50">
                            <Icon name="Frown" size={30} color="#D1D5DB" />
                        </div>
                        <h3 className="text-lg font-bold text-gray-700 mb-1">No open positions</h3>
                        <p className="text-gray-400 text-sm max-w-xs mx-auto">There are no job openings at {startup.name} right now. Reach out to them directly!</p>
                    </div>
                )}
            </section>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            <section className="bg-white rounded-[2rem] p-8 shadow-sm border border-gray-100">
                <h2 className="text-lg font-bold text-gray-800 mb-6">Social Presence</h2>
                
                <div className="space-y-4">
                    {startup.links?.linkedin && (
                         <a 
                            href={formatUrl(startup.links.linkedin)}
                            target="_blank" 
                            rel="noreferrer"
                            className="flex items-center gap-4 p-4 bg-blue-50/50 rounded-2xl border border-blue-100 hover:bg-blue-50 transition-colors group"
                         >
                            <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center text-[#0A66C2]">
                                <Icon name="Linkedin" size={20} />
                            </div>
                            <div className="flex-1">
                                <p className="text-xs text-blue-600 font-bold uppercase tracking-widest">LinkedIn</p>
                                <p className="text-sm font-semibold text-gray-800">Connect with us</p>
                            </div>
                            <Icon name="ChevronRight" size={16} className="text-blue-300 group-hover:translate-x-1 transition-transform" />
                         </a>
                    )}

                    {startup.links?.instagram && (
                         <a 
                            href={formatUrl(startup.links.instagram)}
                            target="_blank" 
                            rel="noreferrer"
                            className="flex items-center gap-4 p-4 bg-pink-50/50 rounded-2xl border border-pink-100 hover:bg-pink-50 transition-colors group"
                         >
                            <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center text-[#E4405F]">
                                <Icon name="Instagram" size={20} />
                            </div>
                            <div className="flex-1">
                                <p className="text-xs text-pink-600 font-bold uppercase tracking-widest">Instagram</p>
                                <p className="text-sm font-semibold text-gray-800">Follow our story</p>
                            </div>
                            <Icon name="ChevronRight" size={16} className="text-pink-300 group-hover:translate-x-1 transition-transform" />
                         </a>
                    )}

                    {!startup.links?.linkedin && !startup.links?.instagram && !startup.links?.website && (
                        <p className="text-center text-gray-400 text-sm italic py-4">No social links provided</p>
                    )}
                </div>
            </section>

            <section className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-[2rem] p-8 shadow-xl shadow-indigo-200">
                <h3 className="text-white font-bold text-xl mb-4">Interested in {startup.name}?</h3>
                <p className="text-indigo-100 text-sm mb-6 leading-relaxed">
                   Get in touch with the founders or request more information about their vision.
                </p>
                {isGuest ? (
                    <Button onClick={() => setShowAuthModal(true)} className="w-full bg-white text-indigo-700 hover:bg-indigo-50 border-none font-bold">
                        Contact Developers
                    </Button>
                ) : (
                    <Button className="w-full bg-white text-indigo-700 hover:bg-indigo-50 border-none font-bold">
                        Send Message
                    </Button>
                )}
            </section>
          </div>

        </div>
      </div>

      {showAuthModal && (
        <SignupModal 
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
          message="Create an account to contact startups and see detailed information"
        />
      )}
    </div>
  );
};

export default StartupProfilePage;
