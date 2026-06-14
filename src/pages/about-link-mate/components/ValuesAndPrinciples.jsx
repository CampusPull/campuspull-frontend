import React, { useState } from "react";
import { motion } from "framer-motion";
import { Users, Network, Lightbulb, Globe, HeartHandshake } from "lucide-react";

const ValuesAndPrinciples = () => {
  const [selected, setSelected] = useState(0);

  const coreValues = [
    {
      title: "Student-First Philosophy",
      description:
        "Every product feature and roadmap milestone centers entirely around student career success, providing an equal playing field for everyone.",
      icon: Users,
      color: "from-blue-500 to-indigo-500"
    },
    {
      title: "Deep Connections",
      description:
        "Enabling strong, noise-free professional bonds between students, industry alumni, and institutional faculty.",
      icon: Network,
      color: "from-purple-500 to-pink-500"
    },
    {
      title: "Inter-College Networks",
      description:
        "Connecting universities nationwide to allow students to exchange ideas, participate in hackathons, and collaborate.",
      icon: Globe,
      color: "from-emerald-500 to-teal-500"
    },
    {
      title: "Pioneering Innovation",
      description:
        "Fostering research, dynamic code creations, and creative startup building inside active campus ecosystems.",
      icon: Lightbulb,
      color: "from-amber-500 to-orange-500"
    },
    {
      title: "Community Growth",
      description:
        "Growing together by sharing verified preparation roadmaps, mentorship resources, and collaborative support.",
      icon: HeartHandshake,
      color: "from-rose-500 to-red-500"
    },
  ];

  return (
    <section className="mb-20 px-4">
      <div className="max-w-3xl mx-auto text-center mb-12">
        <span className="text-xs font-bold text-indigo-600 uppercase tracking-widest block mb-2">Core Ethos</span>
        <h2 className="text-3xl md:text-4xl font-extrabold text-slate-800 tracking-tight mb-4">
          Our Values & Principles 🌟
        </h2>
        <p className="text-slate-500 text-base md:text-lg font-medium leading-relaxed max-w-2xl mx-auto">
          The guiding beliefs that inspire us to keep building and democratizing knowledge.
        </p>
      </div>

      {/* Selected Card Highlight */}
      <div className="max-w-3xl mx-auto mb-12">
        <motion.div
          key={selected}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-gradient-to-tr from-slate-950 via-indigo-950 to-slate-900 rounded-3xl p-8 text-center text-white border border-slate-800 shadow-xl relative overflow-hidden group min-h-[180px] flex flex-col justify-center items-center"
        >
          <div className="absolute top-0 right-0 w-44 h-44 bg-indigo-500/10 rounded-full blur-3xl"></div>
          
          {/* Dynamic floating badge */}
          <span className={`inline-flex p-3 rounded-2xl bg-gradient-to-tr ${coreValues[selected].color} text-white mb-4 shadow-lg shadow-indigo-500/10`}>
            {React.createElement(coreValues[selected].icon, { size: 24 })}
          </span>
          
          <h3 className="text-xl font-extrabold text-white mb-2 tracking-tight">
            {coreValues[selected].title}
          </h3>
          <p className="text-slate-300 text-xs md:text-sm max-w-xl mx-auto leading-relaxed font-medium">
            {coreValues[selected].description}
          </p>
        </motion.div>
      </div>

      {/* Value Grid Selector Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 max-w-5xl mx-auto">
        {coreValues.map((value, index) => {
          const IconComponent = value.icon;
          const isSelected = selected === index;
          
          return (
            <div
              key={index}
              onClick={() => setSelected(index)}
              className={`cursor-pointer p-5 rounded-2xl border text-center transition-all duration-300 flex flex-col items-center justify-center min-h-[140px] group ${
                isSelected
                  ? "bg-white border-indigo-600 shadow-[0_15px_30px_rgba(99,102,241,0.06)] animate-pulse"
                  : "bg-white border-indigo-50/70 hover:border-indigo-200 hover:shadow-[0_10px_20px_rgba(99,102,241,0.02)]"
              }`}
            >
              <div className={`p-2.5 rounded-xl border mb-3 transition-colors ${
                isSelected 
                ? "bg-indigo-50 border-indigo-100 text-indigo-600" 
                : "bg-slate-50 border-slate-100 text-slate-400 group-hover:text-indigo-600 group-hover:bg-indigo-50 group-hover:border-indigo-100"
              }`}>
                <IconComponent size={20} />
              </div>
              <h4 className={`text-xs font-bold leading-tight font-inter ${isSelected ? "text-indigo-600" : "text-slate-700 group-hover:text-indigo-600"}`}>
                {value.title}
              </h4>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default ValuesAndPrinciples;
