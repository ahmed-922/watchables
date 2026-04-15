import { useParams, Link, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getTVDetails, getTVSeason } from "../services/tmdb";
import VideoPlayer from "../components/VideoPlayer";
import { useWatchProgress } from "../hooks/useWatchProgress";
import { addToHistory } from "../services/storage";
import { useEffect } from "react";

export default function WatchTV() {
  const { id, season, episode } = useParams<{ id: string; season: string; episode: string }>();
  const navigate = useNavigate();
  const tvId = parseInt(id!);
  const seasonNum = parseInt(season!);
  const episodeNum = parseInt(episode!);

  const show = useQuery({
    queryKey: ["tv", id],
    queryFn: () => getTVDetails(id!),
    enabled: !!id,
  });

  const seasonData = useQuery({
    queryKey: ["tv", id, "season", seasonNum],
    queryFn: () => getTVSeason(id!, seasonNum.toString()),
    enabled: !!id,
  });

  const { savedProgress } = useWatchProgress(tvId, "tv", seasonNum, episodeNum);

  // Add to history
  useEffect(() => {
    if (show.data) {
      addToHistory({
        id: tvId,
        type: "tv",
        title: show.data.name,
        poster_path: show.data.poster_path,
        season: seasonNum,
        episode: episodeNum,
      });
    }
  }, [show.data, tvId, seasonNum, episodeNum]);

  const currentEpisode = seasonData.data?.episodes?.find(
    (ep) => ep.episode_number === episodeNum
  );
  const episodes = seasonData.data?.episodes ?? [];
  const currentIndex = episodes.findIndex((ep) => ep.episode_number === episodeNum);
  const prevEpisode = currentIndex > 0 ? episodes[currentIndex - 1] : null;
  const nextEpisode = currentIndex < episodes.length - 1 ? episodes[currentIndex + 1] : null;

  return (
    <div className="fixed inset-0 z-50 bg-black flex flex-col">
      {/* Top bar */}
      <div className="absolute top-0 left-0 right-0 z-10 bg-gradient-to-b from-black/80 to-transparent p-4 flex items-center justify-between opacity-0 hover:opacity-100 transition-opacity duration-300">
        <div className="flex items-center gap-4">
          <Link
            to={`/tv/${tvId}`}
            className="flex items-center gap-2 text-white/80 hover:text-white transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path d="M15 19l-7-7 7-7" />
            </svg>
            <span className="text-sm font-medium">Back</span>
          </Link>
          <div>
            {show.data && (
              <h1 className="text-white text-sm font-medium truncate">{show.data.name}</h1>
            )}
            <p className="text-dark-400 text-xs">
              S{seasonNum} E{episodeNum}
              {currentEpisode && ` — ${currentEpisode.name}`}
            </p>
          </div>
        </div>

        {/* Episode navigation */}
        <div className="flex items-center gap-2">
          {prevEpisode && (
            <button
              onClick={() => navigate(`/watch/tv/${tvId}/${seasonNum}/${prevEpisode.episode_number}`)}
              className="flex items-center gap-1 text-white/60 hover:text-white text-xs bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-lg transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path d="M15 19l-7-7 7-7" />
              </svg>
              Prev
            </button>
          )}
          {nextEpisode && (
            <button
              onClick={() => navigate(`/watch/tv/${tvId}/${seasonNum}/${nextEpisode.episode_number}`)}
              className="flex items-center gap-1 text-white/60 hover:text-white text-xs bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-lg transition-colors"
            >
              Next
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path d="M9 5l7 7-7 7" />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Player */}
      <div className="flex-1">
        <VideoPlayer
          tmdbId={tvId}
          type="tv"
          season={seasonNum}
          episode={episodeNum}
          startTime={savedProgress?.currentTime}
        />
      </div>
    </div>
  );
}
