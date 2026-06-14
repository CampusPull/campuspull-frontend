import React from "react";
import { MapPin, Globe, Compass, GraduationCap } from "lucide-react";

const UniversityPartnerships = () => {
  return (
    <section className="mb-20 px-4">
      <div className="max-w-3xl mx-auto text-center mb-12">
        <span className="text-xs font-bold text-indigo-600 uppercase tracking-widest block mb-2">Founding Node</span>
        <h2 className="text-3xl md:text-4xl font-extrabold text-slate-800 tracking-tight mb-4">
          Our University Partner 🎓
        </h2>
        <p className="text-slate-500 text-base md:text-lg font-medium leading-relaxed max-w-2xl mx-auto">
          CampusPull was incubated and launched in collaborative alignment with ABESIT to foster localized growth.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center max-w-5xl mx-auto bg-white border border-indigo-50/70 rounded-3xl p-8 lg:p-12 shadow-[0_15px_40px_rgba(99,102,241,0.02)]">
        {/* Left Side: Logo + Info */}
        <div className="lg:col-span-6 flex flex-col items-center lg:items-start text-center lg:text-left">
          <div className="bg-slate-50 border border-slate-100 rounded-3xl p-6 mb-6 flex items-center justify-center shadow-inner max-w-[280px]">
            <img
              src="/assets/images/ABESIT.png"
              alt="ABESIT Logo"
              className="w-full h-auto max-h-[80px] object-contain"
            />
          </div>

          <h3 className="text-2xl font-extrabold text-slate-800 mb-2 leading-tight">
            ABES Institute of Technology (ABESIT)
          </h3>

          <p className="text-indigo-600 font-bold text-sm tracking-wide mb-4 flex items-center gap-1.5 justify-center lg:justify-start">
            <GraduationCap size={16} /> "Empowering Students, Shaping Futures"
          </p>

          <p className="text-slate-500 text-xs md:text-sm leading-relaxed mb-6 font-medium max-w-md">
            As our official founding partner, ABESIT supplies the active ecosystem, guidance, and institutional support required to drive real student-industry bridge pipelines.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <a
              href="https://abesit.in/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 bg-slate-900 text-white px-5 py-3 rounded-xl font-bold text-xs hover:bg-indigo-600 transition-colors shadow-md hover:-translate-y-0.5 transform duration-200"
            >
              <Globe size={14} /> Visit Official Website
            </a>

            <a
              href="https://www.google.com/maps/dir/?api=1&destination=ABES+Institute+of+Technology,+19th+KM+Stone,+NH24,+Ghaziabad,+UP"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 bg-slate-50 border border-slate-200 text-slate-700 px-5 py-3 rounded-xl font-bold text-xs hover:bg-slate-100 transition-colors hover:-translate-y-0.5 transform duration-200"
            >
              <MapPin size={14} className="text-emerald-500" /> Get Directions
            </a>
          </div>
        </div>

        {/* Right Side: Google Map */}
        <div className="lg:col-span-6 w-full h-[320px] lg:h-[360px] shadow-lg rounded-2xl overflow-hidden border border-slate-150 relative group">
          <iframe
            title="ABESIT Location"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3504.9630905170486!2d77.4519931150824!3d28.646441882410464!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390cf112b19b0d6f%3A0x9a2c0e9cfb0b1e4a!2sABES%20Institute%20of%20Technology%20(ABESIT)!5e0!3m2!1sen!2sin!4v1695294812345!5m2!1sen!2sin"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
            className="grayscale-[20%] group-hover:grayscale-0 transition-all duration-300"
          ></iframe>
        </div>
      </div>
    </section>
  );
};

export default UniversityPartnerships;
