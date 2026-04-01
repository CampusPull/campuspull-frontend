import React from "react";
import { FaGlobe, FaLinkedin, FaInstagram, FaTimes } from "react-icons/fa";

const StartupDetailsModal = ({ startup, onClose }) => {
  if (!startup) return null;

  const formatUrl = (url) => {
    if (!url) return "#";
    return url.startsWith("http://") || url.startsWith("https://")
      ? url
      : `https://${url}`;
  };

  const hasLinks =
    startup.links?.website ||
    startup.links?.linkedin ||
    startup.links?.instagram;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      ></div>
      
      {/* Modal */}
      <div className="relative bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in duration-300">
        
        {/* Header with gradient */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 flex items-start gap-4">
          <div className="w-20 h-20 shrink-0 bg-white rounded-2xl shadow-lg border-2 border-white/20 flex items-center justify-center overflow-hidden p-2">
            {startup.logo?.url ? (
              <img
                src={startup.logo.url}
                alt={startup.name}
                className="w-full h-full object-contain"
              />
            ) : (
              <span className="text-xs text-gray-400 font-bold text-center">No Logo</span>
            )}
          </div>
          
          <div className="flex-1 mt-1">
            <h2 className="text-3xl font-extrabold text-white leading-tight drop-shadow-md">
              {startup.name}
            </h2>
            <div className="flex flex-wrap gap-2 mt-3">
              <span className="px-3 py-1 bg-white/20 text-white text-xs font-bold uppercase tracking-wider rounded-lg backdrop-blur-md border border-white/30">
                {startup.domain}
              </span>
              <span className="px-3 py-1 bg-white/20 text-white text-xs font-bold uppercase tracking-wider rounded-lg backdrop-blur-md border border-white/30">
                {startup.stage}
              </span>
            </div>
          </div>

          <button 
            onClick={onClose}
            className="text-white/80 hover:text-white bg-black/10 hover:bg-black/20 p-2 rounded-full transition-colors"
          >
            <FaTimes size={20} />
          </button>
        </div>

        {/* Body Content */}
        <div className="p-6 overflow-y-auto">
          <div className="mb-6">
            <h3 className="text-lg font-bold text-gray-800 mb-2">About the Startup</h3>
            <p className="text-gray-600 leading-relaxed text-[15px] whitespace-pre-wrap">
              {startup.shortDescription || "No detailed description provided."}
            </p>
          </div>

          <div>
            <h3 className="text-lg font-bold text-gray-800 mb-3">Connect</h3>
            {hasLinks ? (
              <div className="flex flex-wrap gap-3">
                {startup.links?.website && (
                  <a
                    href={formatUrl(startup.links.website)}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-2 px-5 py-2.5 bg-gray-50 hover:bg-indigo-50 border border-gray-200 hover:border-indigo-200 text-gray-700 hover:text-indigo-700 font-semibold rounded-xl transition-all shadow-sm"
                  >
                    <FaGlobe /> Website
                  </a>
                )}
                {startup.links?.linkedin && (
                  <a
                    href={formatUrl(startup.links.linkedin)}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-2 px-5 py-2.5 bg-[#f0f6ff] hover:bg-[#0A66C2] border border-blue-100 hover:border-[#0A66C2] text-[#0A66C2] hover:text-white font-semibold rounded-xl transition-all shadow-sm"
                  >
                    <FaLinkedin /> LinkedIn
                  </a>
                )}
                {startup.links?.instagram && (
                  <a
                    href={formatUrl(startup.links.instagram)}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-2 px-5 py-2.5 bg-pink-50 hover:bg-gradient-to-r hover:from-purple-500 hover:to-pink-500 border border-pink-100 hover:border-transparent text-pink-600 hover:text-white font-semibold rounded-xl transition-all shadow-sm"
                  >
                    <FaInstagram /> Instagram
                  </a>
                )}
              </div>
            ) : (
              <p className="text-gray-500 italic text-sm">No social links provided.</p>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-100 bg-gray-50 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold rounded-xl transition-colors"
          >
            Close
          </button>
        </div>
        
      </div>
    </div>
  );
};

export default StartupDetailsModal;
