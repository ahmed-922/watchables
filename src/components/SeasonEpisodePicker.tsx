import { useState } from "react";
import { Link } from "react-router-dom";
import { posterUrl } from "../services/tmdb";
import type { Season, Episode } from "../types";

interface SeasonEpisodePickerProps {
  tvId: number;
  seasons: Season[];
  currentSeason: number;
  onSeasonChange: (seasonNum: number) => void;
  episodes: Episode[];
  loadingEpisodes: boolean;
}

export default function SeasonEpisodePicker({
  tvId,
  seasons,
  currentSeason,
  onSeasonChange,
  episodes,
  loadingEpisodes,
}: SeasonEpisodePickerProps) {
  const [expanded, setExpanded] = useState(true);

  // Filter out specials (season 0) if they have no episodes
  const validSeasons = seasons.filter((s) => s.season_number > 0 || s.episode_count > 0);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-heading text-xl text-white tracking-wider">Episodes</h3>
        <button
          onClick={() => setExpanded(!expanded)}
          className="text-dark-400 hover:text-white transition-colors text-sm flex items-center gap-1"
        >
          {expanded ? "Collapse" : "Expand"}
          <svg className={`w-4 h-4 transition-transform ${expanded ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>

      {/* Season tabs */}
      <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
        {validSeasons.map((season) => (
          <button
            key={season.season_number}
            onClick={() => onSeasonChange(season.season_number)}
            className={`flex-shrink-0 px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${
              season.season_number === currentSeason
                ? "bg-accent text-dark-950"
                : "bg-dark-800 text-dark-300 hover:bg-dark-700 hover:text-white"
            }`}
          >
            {season.name}
          </button>
        ))}
      </div>

      {/* Episodes list */}
      {expanded && (
        <div className="space-y-2">
          {loadingEpisodes ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="h-24 bg-dark-800 rounded-lg animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {episodes.map((ep) => (
                <Link
                  key={ep.id}
                  to={`/watch/tv/${tvId}/${ep.season_number}/${ep.episode_number}`}
                  className="group flex gap-3 bg-dark-800/60 hover:bg-dark-700/60 rounded-lg p-2.5 transition-colors border border-dark-700/30 hover:border-accent/20"
                >
                  <div className="relative flex-shrink-0 w-28 aspect-video rounded overflow-hidden bg-dark-700">
                    {ep.still_path ? (
                      <img
                        src={posterUrl(ep.still_path, "w300")}
                        alt={ep.name}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <svg className="w-6 h-6 text-dark-500" fill="currentColor" viewBox="0 0 24 24">
                          <polygon points="5 3 19 12 5 21 5 3" />
                        </svg>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-dark-950/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <svg className="w-8 h-8 text-accent" fill="currentColor" viewBox="0 0 24 24">
                        <polygon points="5 3 19 12 5 21 5 3" />
                      </svg>
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-sm font-medium truncate">
                      <span className="text-dark-400">E{ep.episode_number}</span>{" "}
                      {ep.name}
                    </p>
                    {ep.overview && (
                      <p className="text-dark-400 text-xs mt-1 line-clamp-2">{ep.overview}</p>
                    )}
                    <div className="flex items-center gap-2 mt-1.5">
                      {ep.runtime && (
                        <span className="text-dark-500 text-xs">{ep.runtime}m</span>
                      )}
                      {ep.vote_average > 0 && (
                        <span className="text-dark-500 text-xs flex items-center gap-0.5">
                          <svg className="w-3 h-3 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                          {ep.vote_average.toFixed(1)}
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
