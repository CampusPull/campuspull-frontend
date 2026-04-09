import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Icon from "../../../components/AppIcon";
import Image from "../../../components/AppImage";

const API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY;
const CHANNEL_ID = import.meta.env.VITE_YOUTUBE_CHANNEL_ID;

const PodcastSection = () => {
  const [episodes, setEpisodes] = useState([]);
  const [activeEpisode, setActiveEpisode] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
  let cancelled = false;

  const fetchEpisodes = async () => {
    try {
      setIsLoading(true);

      const res = await fetch(
        `https://www.googleapis.com/youtube/v3/playlistItems?` +
        new URLSearchParams({
          key: API_KEY,
          playlistId: import.meta.env.VITE_YOUTUBE_PODCAST_PLAYLIST_ID,
          part: "snippet,contentDetails",
          maxResults: "10",
        })
      );

      const data = await res.json();
      if (!data.items || cancelled) return;

      const formatted = data.items.map(item => ({
        id: item.contentDetails.videoId,
        youtubeId: item.contentDetails.videoId,
        title: item.snippet.title,
        guest: item.snippet.title.split("|")[2]?.trim() || "Alumni Talk",
        date: new Date(item.snippet.publishedAt).toLocaleDateString(),
        thumbnail:
          item.snippet.thumbnails.maxres?.url ||
          item.snippet.thumbnails.high.url,
        description: item.snippet.description,
      }));

      setEpisodes(formatted.slice(0, 5));
    } catch (err) {
      console.error("Failed to fetch podcast playlist", err);
    } finally {
      if (!cancelled) setIsLoading(false);
    }
  };

  fetchEpisodes();

  return () => {
    cancelled = true;
  };
}, []);


  const handleEpisodeClick = (index) => {
    setActiveEpisode(index);
    setIsPlaying(true);
    if (window.innerWidth < 768) {
      document
        .getElementById("main-player")
        .scrollIntoView({ behavior: "smooth" });
    }
  };

  if (isLoading) {
    return (
      <div className="py-20 text-center animate-pulse font-poppins text-xl">
        🎙️ Loading Latest CampusPull Talks...
      </div>
    );
  }

  if (episodes.length === 0) return null;

  const currentEp = episodes[activeEpisode];

  return (
    <section className="py-16 bg-surface relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
          <div>
            <div className="flex items-center space-x-2 mb-2">
              <span className="px-3 py-1 bg-red-100 text-red-600 rounded-full text-xs font-bold uppercase tracking-wider animate-pulse">
                New Episodes
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-poppins font-bold text-wisdom-charcoal">
              CampusPull Talks 🎙️
            </h2>
          </div>
          <button
            onClick={() =>
              window.open(`https://youtube.com/channel/${CHANNEL_ID}`, "_blank")
            }
            className="hidden md:flex items-center space-x-2 text-academic-blue font-semibold hover:text-blue-700"
          >
            <span>View All Episodes</span>
            <Icon name="ArrowRight" size={20} />
          </button>
        </div>

        {/* Content Grid */}
        <div className="grid lg:grid-cols-12 gap-8">
          {/* Main Video Player */}
          <div className="lg:col-span-8" id="main-player">
            <div className="bg-white rounded-2xl shadow-brand-lg border border-slate-100 overflow-hidden flex flex-col h-full">
              <div className="relative w-full aspect-video bg-black group">
                {!isPlaying ? (
                  <>
                    <Image
                      src={currentEp.thumbnail}
                      alt={currentEp.title}
                      className="w-full h-full object-cover opacity-80"
                    />
                    <button
                      onClick={() => setIsPlaying(true)}
                      className="absolute inset-0 flex items-center justify-center z-10"
                    >
                      <div className="w-20 h-20 bg-red-600 rounded-full flex items-center justify-center shadow-2xl hover:scale-110 transition-transform">
                        <Icon
                          name="Play"
                          size={32}
                          color="white"
                          fill="currentColor"
                        />
                      </div>
                    </button>
                  </>
                ) : (
                  <iframe
                    className="w-full h-full"
                    src={`https://www.youtube.com/embed/${currentEp.youtubeId}?autoplay=1&rel=0`}
                    title={currentEp.title}
                    frameBorder="0"
                    allowFullScreen
                  ></iframe>
                )}
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-wisdom-charcoal mb-2">
                  {currentEp.title}
                </h3>
                <p className="text-insight-gray line-clamp-3">
                  {currentEp.description}
                </p>
              </div>
            </div>
          </div>

          {/* Sidebar Playlist */}
          <div className="lg:col-span-4 flex flex-col space-y-4 max-h-[600px] overflow-y-auto custom-scrollbar">
            {episodes.map((ep, index) => (
              <button
                key={ep.id}
                onClick={() => handleEpisodeClick(index)}
                className={`p-3 rounded-xl border transition-all cursor-pointer flex gap-3 text-left ${
                  activeEpisode === index
                    ? "bg-blue-50 border-academic-blue"
                    : "bg-white border-slate-100 hover:shadow-md"
                }`}
              >
                <div className="relative w-28 h-16 rounded-lg overflow-hidden flex-shrink-0">
                  <Image
                    src={ep.thumbnail}
                    alt={ep.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h4
                    className={`font-semibold text-sm line-clamp-2 ${
                      activeEpisode === index
                        ? "text-academic-blue"
                        : "text-wisdom-charcoal"
                    }`}
                  >
                    {ep.title}
                  </h4>
                  <p className="text-xs text-insight-gray">ft. {ep.guest}</p>
                </div>
              </button>
            ))}
            <a
              href={`https://youtube.com/channel/${CHANNEL_ID}`}
              target="_blank"
              rel="noreferrer"
              className="mt-2 w-full py-3 flex items-center justify-center space-x-2 bg-red-50 hover:bg-red-100 text-red-600 font-semibold rounded-lg transition-colors border border-red-200"
            >
              <Icon name="Youtube" size={20} />
              <span>Visit CampusPull Channel</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PodcastSection;
