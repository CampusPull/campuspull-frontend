// FIX: accept isGuest and onRestrictedAction
const StartupCard = ({ startup, isGuest, onRestrictedAction }) => {

  const formatUrl = (url) => {
    if (!url) return "#";
    return url.startsWith("http://") || url.startsWith("https://")
      ? url
      : `https://${url}`;
  };

  const hasLinks = startup.links?.website || startup.links?.linkedin || startup.links?.instagram;

  return (
    <div className="border rounded-lg p-4 bg-white">
      <div className="h-16 mb-3 flex items-center">
        {startup.logo?.url ? (
          <img
            src={startup.logo.url}
            alt={startup.name}
            className="h-full object-contain"
          />
        ) : (
          <div className="text-sm text-gray-400">No logo</div>
        )}
      </div>

      <h2 className="text-lg font-medium">{startup.name}</h2>

      <p className="text-sm text-gray-600 mt-1">{startup.shortDescription}</p>

      <div className="text-sm text-gray-500 mt-2">
        {startup.domain} · {startup.stage}
      </div>

      {/* FIX: spec says "Hide contact details" for guests
          Guests see a "Contact" button that triggers modal instead of links */}
      {isGuest ? (
        <div className="mt-3">
          <button
            onClick={onRestrictedAction}
            className="text-sm text-blue-600 hover:underline"
          >
            View Contact Details →
          </button>
        </div>
      ) : (
        <div className="flex gap-3 mt-3 text-sm">
          {startup.links?.website && (
            <a
              href={formatUrl(startup.links.website)}
              target="_blank"
              rel="noreferrer"
              className="text-blue-600 hover:underline"
            >
              Website
            </a>
          )}
          {startup.links?.linkedin && (
            <a
              href={formatUrl(startup.links.linkedin)}
              target="_blank"
              rel="noreferrer"
              className="text-blue-600 hover:underline"
            >
              LinkedIn
            </a>
          )}
          {startup.links?.instagram && (
            <a
              href={formatUrl(startup.links.instagram)}
              target="_blank"
              rel="noreferrer"
              className="text-blue-600 hover:underline"
            >
              Instagram
            </a>
          )}
        </div>
      )}
    </div>
  );
};

export default StartupCard;