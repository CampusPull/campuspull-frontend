// FIX: accept isGuest, onRestrictedAction, onClick
const StartupCard = ({ startup, isGuest, onRestrictedAction, onClick }) => {

  const formatUrl = (url) => {
    if (!url) return "#";
    return url.startsWith("http://") || url.startsWith("https://")
      ? url
      : `https://${url}`;
  };

  const hasLinks = startup.links?.website || startup.links?.linkedin || startup.links?.instagram;

  return (
    <div 
      onClick={onClick}
      className="cursor-pointer bg-white/70 backdrop-blur-xl border border-white/50 rounded-3xl shadow-sm hover:shadow-xl transition-all duration-300 p-6 flex flex-col group overflow-hidden relative"
    >
      {/* Decorative gradient blob */}
      <div className="absolute -top-10 -right-10 w-32 h-32 bg-indigo-200 rounded-full mix-blend-multiply filter blur-2xl opacity-50 group-hover:opacity-100 transition-opacity"></div>
      
      <div className="flex items-center gap-4 mb-4 z-10">
        <div className="w-16 h-16 shrink-0 rounded-2xl bg-white shadow-md border border-gray-100 flex items-center justify-center overflow-hidden p-2 group-hover:scale-105 transition-transform">
          {startup.logo?.url ? (
            <img
              src={startup.logo.url}
              alt={startup.name}
              className="h-full w-full object-contain"
            />
          ) : (
            <div className="text-xs text-gray-400 font-medium text-center leading-tight">No Logo</div>
          )}
        </div>
        
        <div>
          <h2 className="text-xl font-bold text-gray-800 group-hover:text-indigo-600 transition-colors line-clamp-1">{startup.name}</h2>
          <div className="flex flex-wrap gap-2 mt-1">
            <span className="px-2.5 py-0.5 bg-indigo-50 text-indigo-700 text-[10px] uppercase font-bold tracking-wider rounded-lg border border-indigo-100">
              {startup.domain}
            </span>
            <span className="px-2.5 py-0.5 bg-purple-50 text-purple-700 text-[10px] uppercase font-bold tracking-wider rounded-lg border border-purple-100">
              {startup.stage}
            </span>
          </div>
        </div>
      </div>

      <p className="text-sm text-gray-600 mb-6 line-clamp-3 leading-relaxed min-h-[60px] z-10">
        {startup.shortDescription || "No description provided."}
      </p>

      {/* FIX: spec says "Hide contact details" for guests
          Guests see a "Contact" button that triggers modal instead of links */}
      <div className="mt-auto pt-4 border-t border-gray-100/60 z-10" onClick={(e) => e.stopPropagation()}>
        {isGuest ? (
          <button
            onClick={onRestrictedAction}
            className="w-full py-2.5 bg-indigo-50 text-indigo-700 font-bold text-sm rounded-xl border border-indigo-100 hover:bg-indigo-600 hover:text-white transition-colors shadow-sm"
          >
            View Contact Details →
          </button>
        ) : (
          <div className="flex gap-2 text-sm justify-center">
            {startup.links?.website && (
              <a
                href={formatUrl(startup.links.website)}
                target="_blank"
                rel="noreferrer"
                className="flex-1 py-1.5 px-2 text-center bg-gray-50 text-gray-700 font-semibold rounded-xl hover:bg-indigo-600 hover:text-white hover:shadow-md transition-all border border-gray-200"
              >
                Website
              </a>
            )}
            {startup.links?.linkedin && (
              <a
                href={formatUrl(startup.links.linkedin)}
                target="_blank"
                rel="noreferrer"
                className="flex-1 py-1.5 px-2 text-center bg-[#f0f6ff] text-[#0A66C2] font-semibold rounded-xl hover:bg-[#0A66C2] hover:text-white hover:shadow-md transition-all border border-blue-100"
              >
                LinkedIn
              </a>
            )}
            {startup.links?.instagram && (
              <a
                href={formatUrl(startup.links.instagram)}
                target="_blank"
                rel="noreferrer"
                className="flex-1 py-1.5 px-2 text-center bg-pink-50 text-pink-600 font-semibold rounded-xl hover:bg-gradient-to-r hover:from-purple-500 hover:to-pink-500 hover:text-white hover:shadow-md transition-all border border-pink-100"
              >
                Instagram
              </a>
            )}
            {!hasLinks && (
               <span className="text-gray-400 text-xs italic py-2">No contact links added</span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default StartupCard;