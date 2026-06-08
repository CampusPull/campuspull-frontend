import React from "react";
import { Calendar, Compass, Target, GraduationCap } from "lucide-react";

const FounderStory = () => {
  const storyPoints = [
    {
      title: "Launched in 2023",
      detail: "CampusPull began as an ambitious idea by passionate students of ABES Institute of Technology (ABESIT) who wanted to change how peer learning works.",
      icon: Calendar,
      color: "text-indigo-600 bg-indigo-50 border-indigo-100"
    },
    {
      title: "A Singular Vision",
      detail: "To build a high-collaboration ecosystem where students, industry-ready alumni, and experienced faculty co-exist in absolute sync.",
      icon: Compass,
      color: "text-purple-600 bg-purple-50 border-purple-100"
    },
    {
      title: "Our Main Goal",
      detail: "To eliminate professional gatekeeping, providing verified preparation resources and career placements completely democratized for everyone.",
      icon: Target,
      color: "text-pink-600 bg-pink-50 border-pink-100"
    },
  ];

  return (
    <section className="mb-20 px-4">
      <div className="max-w-3xl mx-auto text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-extrabold text-slate-800 tracking-tight mb-4 flex items-center justify-center gap-2">
          Our Story 🚀
        </h2>
        <p className="text-slate-500 text-base md:text-lg font-medium leading-relaxed max-w-2xl mx-auto">
          From a spark of student ambition to a growing campus network, here is how we are shifting peer learning dynamics.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
        {storyPoints.map((point, index) => {
          const IconComponent = point.icon;
          return (
            <div
              key={index}
              className="bg-white border border-indigo-50/70 rounded-3xl p-6 hover:shadow-[0_15px_40px_rgba(99,102,241,0.05)] hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between min-h-[220px]"
            >
              <div>
                <div className={`h-11 w-11 rounded-2xl flex items-center justify-center border mb-5 ${point.color}`}>
                  <IconComponent size={20} />
                </div>
                <h3 className="font-extrabold text-slate-800 text-lg mb-2">
                  {point.title}
                </h3>
                <p className="text-slate-500 text-xs leading-relaxed font-medium">
                  {point.detail}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-12 max-w-3xl mx-auto bg-slate-900 text-white rounded-3xl p-8 relative overflow-hidden group border border-slate-800">
        <div className="absolute top-0 right-0 w-44 h-44 bg-indigo-500/10 rounded-full blur-3xl"></div>
        <div className="flex flex-col sm:flex-row items-center gap-6 relative z-10">
          <div className="h-14 w-14 rounded-2xl bg-indigo-500/10 border border-indigo-500/25 flex items-center justify-center text-indigo-400 shrink-0">
            <GraduationCap size={28} />
          </div>
          <div>
            <p className="text-slate-300 text-sm md:text-base leading-relaxed font-medium">
              "From a simple student initiative at <strong>ABESIT</strong>, CampusPull has grown into the de-facto hub for career readiness, connecting hundreds of students with verified peer guidance."
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FounderStory;
