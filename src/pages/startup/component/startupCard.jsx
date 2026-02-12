const StartupCard = ({ startup }) => {
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
          <div className="text-sm text-gray-400">
            No logo
          </div>
        )}
      </div>

      <h2 className="text-lg font-medium">
        {startup.name}
      </h2>

      <p className="text-sm text-gray-600 mt-1">
        {startup.shortDescription}
      </p>

      <div className="text-sm text-gray-500 mt-2">
        {startup.domain} · {startup.stage}
      </div>

      <div className="flex gap-3 mt-3 text-sm">
        {startup.links?.website && (
          <a
            href={startup.links.website}
            target="_blank"
            rel="noreferrer"
            className="text-blue-600 hover:underline"
          >
            Website
          </a>
        )}
        {startup.links?.linkedin && (
          <a
            href={startup.links.linkedin}
            target="_blank"
            rel="noreferrer"
            className="text-blue-600 hover:underline"
          >
            LinkedIn
          </a>
        )}
        {startup.links?.instagram && (
          <a
            href={startup.links.instagram}
            target="_blank"
            rel="noreferrer"
            className="text-blue-600 hover:underline"
          >
            Instagram
          </a>
        )}
      </div>
    </div>
  );
};

export default StartupCard;
