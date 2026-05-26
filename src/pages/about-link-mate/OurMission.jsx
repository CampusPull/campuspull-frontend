import React from "react";
import { 
  Target, 
  Compass, 
  GraduationCap, 
  Briefcase, 
  Zap, 
  Users, 
  TrendingUp, 
  ArrowRight,
  MapPin,
  CheckCircle2
} from "lucide-react";
import Footer from "../homepage/components/Footer";

const OurMission = () => {
  const problemsSolved = [
    {
      title: "Resource Asymmetry",
      description: "Students often rely on scattered, unverified roadmaps. CampusPull unifies structured study paths and curated preparation resources in a single verified Hub.",
      icon: Compass
    },
    {
      title: "Alumni Connection Gap",
      description: "Reaching out to successful seniors on external professional networks is noisy. We provide direct, structured networking access to alumni mentors who want to give back.",
      icon: Users
    },
    {
      title: "Placement Preparation Barrier",
      description: "Lack of actual placement insights. Our Alumni Success Stories offer step-by-step guidance on interview pipelines, coding rounds, and company-specific criteria.",
      icon: Briefcase
    },
    {
      title: "Disconnected Campus Ecosystems",
      description: "Academic updates, hackathons, startups, and community chats are scattered. CampusPull fuses them into one unified, collaborative dashboard.",
      icon: Zap
    }
  ];

  const valueProps = [
    {
      title: "Placements",
      detail: "Direct job opportunities, internship listings, mock interview pipelines, and step-by-step placement preparation guidance directly from graduates working at top tech firms."
    },
    {
      title: "Networking",
      detail: "Structured mentor-mentee bookings, branch-wise student networks, direct peer-to-peer chats, and verified profiles to form teams for hackathons or research."
    },
    {
      title: "Collaboration",
      detail: "Open-source campus community forum to ask academic, technical, or placement questions, with verified answers from faculty and experienced alumni."
    },
    {
      title: "Student Growth",
      detail: "Active resources libraries, notifications of hackathons/webinars, and dedicated workspaces for student startups to recruit co-founders and pitch ideas."
    }
  ];

  const roadmap = [
    {
      phase: "Phase 1 - Unified Hub (Current)",
      desc: "Successfully launched the Campus-Pull Core Hub—connecting students, alumni, and faculty with active chat, internships, startups, and verified resource directories.",
      status: "Active"
    },
    {
      phase: "Phase 2 - AI-Driven Profile Matching (Q3 2026)",
      desc: "Introducing AI-powered mentor matchmaking and resume scoring. Students receive automated feedback on profile strength mapped against industry standards.",
      status: "Upcoming"
    },
    {
      phase: "Phase 3 - Recruiter Pipeline Integration (Q4 2026)",
      desc: "Opening direct placement channels. Vetted tech recruiters can search, filter, and hire outstanding students based on validated skills and college benchmarks.",
      status: "Upcoming"
    },
    {
      phase: "Phase 4 - Multi-University Expansion (Q1 2027)",
      desc: "Connecting campuses nationwide. Enabling cross-university resource sharing, national hackathons, and global alumni networking grids.",
      status: "Future"
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50/50 flex flex-col justify-between">
      <main className="flex-grow">
        {/* --- HERO SECTION --- */}
        <section className="relative text-center py-20 md:py-28 bg-gradient-to-tr from-slate-950 via-indigo-950 to-slate-900 overflow-hidden text-white mb-16">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(99,102,241,0.15),transparent_45%)]"></div>
          <div className="absolute top-1/2 left-1/4 w-[500px] h-[500px] bg-purple-500/5 rounded-full blur-[140px] pointer-events-none"></div>
          
          <div className="relative z-10 max-w-4xl mx-auto px-6">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-500/10 text-indigo-400 text-xs font-bold uppercase tracking-widest rounded-full border border-indigo-500/25 mb-6 animate-pulse">
              <Target size={12} /> Our Vision & Ambition
            </span>
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-white mb-6 leading-tight">
              Democratizing <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">Knowledge & Placements</span>
            </h1>
            <p className="text-slate-300 text-base md:text-xl max-w-2xl mx-auto leading-relaxed font-medium">
              CampusPull is the companion for university growth – bridging the gap between student ambition and professional placement success in one unified ecosystem.
            </p>
          </div>
        </section>

        {/* --- WHAT IS CAMPUSPULL --- */}
        <section className="max-w-5xl mx-auto px-6 mb-20">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-xs font-bold text-indigo-600 uppercase tracking-widest block mb-2">The Ecosystem</span>
              <h2 className="text-3xl md:text-4xl font-extrabold text-slate-800 tracking-tight mb-6">
                What is CampusPull?
              </h2>
              <p className="text-slate-600 text-sm md:text-base leading-relaxed mb-6 font-medium">
                CampusPull is an all-in-one educational networking, resource-sharing, and peer-to-peer mentoring platform for universities. Built initially by students at <strong>ABESIT</strong>, it connects students, faculty, and success-verified alumni into a singular high-collaboration hub.
              </p>
              <div className="space-y-3.5">
                {[
                  "100% Student & Alumni-Centric Ecosystem",
                  "Direct, structured access to verified placement advice",
                  "Open resources sharing, startups incubation & event grids"
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <CheckCircle2 className="text-emerald-500 shrink-0" size={18} />
                    <span className="text-sm font-semibold text-slate-700">{item}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="bg-gradient-to-tr from-indigo-500 to-purple-600 rounded-3xl p-1 shadow-xl shadow-indigo-100/50">
              <div className="bg-slate-950 text-white rounded-[22px] p-8 md:p-10 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-44 h-44 bg-indigo-500/10 rounded-full blur-3xl"></div>
                <h3 className="text-2xl font-extrabold mb-4 flex items-center gap-2">
                  <GraduationCap className="text-indigo-400" size={24} /> Our Long-Term Ambition
                </h3>
                <p className="text-slate-300 text-sm leading-relaxed mb-6 font-medium">
                  We are building the de-facto student career engine. Our ambition is to eliminate placement opaque practices, democratize access to mentorship, and expand CampusPull into a national interconnected web of collaborative learning across thousands of universities globally.
                </p>
                <div className="flex items-center gap-1.5 text-indigo-400 font-bold text-sm">
                  Empowering 100,000+ Future Grads <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* --- PROBLEMS SOLVED --- */}
        <section className="bg-white border-y border-slate-100 py-20 mb-20">
          <div className="max-w-5xl mx-auto px-6">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <span className="text-xs font-bold text-indigo-600 uppercase tracking-widest block mb-2">Hurdles Removed</span>
              <h2 className="text-3xl md:text-4xl font-extrabold text-slate-800 tracking-tight">
                Problems We Solve For Students
              </h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {problemsSolved.map((prob, idx) => {
                const IconComponent = prob.icon;
                return (
                  <div key={idx} className="flex gap-4 p-5 hover:bg-slate-50/50 rounded-2xl transition-all duration-300 border border-transparent hover:border-slate-100">
                    <div className="h-11 w-11 bg-indigo-50 border border-indigo-100 rounded-xl flex items-center justify-center text-indigo-600 shrink-0">
                      <IconComponent size={20} />
                    </div>
                    <div>
                      <h3 className="font-extrabold text-slate-800 text-base mb-1.5">{prob.title}</h3>
                      <p className="text-slate-500 text-xs md:text-sm leading-relaxed font-medium">{prob.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* --- VALUE PROPS (GROWTH & PLACEMENTS) --- */}
        <section className="max-w-5xl mx-auto px-6 mb-24">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold text-indigo-600 uppercase tracking-widest block mb-2">Empowerment Grid</span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-800 tracking-tight">
              Driving Growth & Placement Success
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {valueProps.map((prop, idx) => (
              <div key={idx} className="bg-white border border-indigo-50/70 rounded-3xl p-6 hover:shadow-[0_15px_40px_rgba(99,102,241,0.05)] hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between min-h-[220px]">
                <div>
                  <div className="h-2 w-12 bg-indigo-600 rounded-full mb-5"></div>
                  <h3 className="font-extrabold text-slate-800 text-lg mb-2">{prop.title}</h3>
                  <p className="text-slate-500 text-xs leading-relaxed font-medium">{prop.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* --- PLATFORM ROADMAP --- */}
        <section className="bg-slate-900 text-white py-20 mb-20 relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(99,102,241,0.1),transparent_40%)]"></div>
          
          <div className="max-w-5xl mx-auto px-6 relative z-10">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <span className="text-xs font-bold text-indigo-400 uppercase tracking-widest block mb-2">Platform Evolution</span>
              <h2 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
                Our Strategic Roadmap
              </h2>
            </div>

            <div className="relative border-l-2 border-indigo-500/20 pl-8 space-y-12 max-w-3xl mx-auto">
              {roadmap.map((item, idx) => (
                <div key={idx} className="relative">
                  {/* Timeline dot */}
                  <span className="absolute -left-[41px] top-1 h-5 w-5 rounded-full border-4 border-slate-950 bg-indigo-500 flex items-center justify-center shadow-lg"></span>
                  
                  <div className="bg-slate-950/40 backdrop-blur-md border border-slate-850 rounded-3xl p-6 hover:border-indigo-500/30 transition-all duration-300">
                    <div className="flex items-center justify-between gap-3 mb-2 flex-wrap">
                      <h3 className="font-extrabold text-lg text-white tracking-tight">{item.phase}</h3>
                      <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-extrabold tracking-wider uppercase ${
                        item.status === "Active" 
                        ? "bg-green-500/10 text-green-400 border border-green-500/20" 
                        : item.status === "Upcoming" 
                        ? "bg-indigo-500/10 text-indigo-400 border border-indigo-500/20" 
                        : "bg-slate-500/10 text-slate-400 border border-slate-500/20"
                      }`}>
                        {item.status}
                      </span>
                    </div>
                    <p className="text-slate-400 text-xs md:text-sm leading-relaxed font-medium">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default OurMission;
