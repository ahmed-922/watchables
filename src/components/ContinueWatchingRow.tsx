import { Link } from "react-router-dom";
import { posterUrl } from "../services/tmdb";
import type { HistoryItem, ProgressData } from "../types";

interface ContinueWatchingRowProps {
  items: Array<{ key: string; data: ProgressData }>;
  history: HistoryItem[];
}

export default function ContinueWatchingRow({ items, history }: ContinueWatchingRowProps) {
  // Parse progress keys  to get content info, match with history for titles/posters
  const enriched = items
    .map(({ key, data }) => {
      const parts = key.split("_");
      const type = parts[0] as "movie" | "tv";
      const id = parseInt(parts[1]);
      const season = parts.length > 3 ? parseInt(parts[2]) : undefined;
      const episode = parts.length > 3 ? parseInt(parts[3]) : undefined;

      // Find matching history entry
      const histEntry = history.find(
        (h) => h.id === id && h.type === type
      );

      if (!histEntry) return null;

      return {
        id,
        type,
        title: histEntry.title,
        poster_path: histEntry.poster_path,
        progress: data.progress,
        currentTime: data.currentTime,
        duration: data.duration,
        season,
        episode,
      };
    })
    .filter(Boolean) as Array<{
      id: number;
      type: "movie" | "tv";
      title: string;
      poster_path: string | null;
      progress: number;
      currentTime: number;
      duration: number;
      season?: number;
      episode?: number;
    }>;

  if (!enriched.length) return null;

  return (
    <section className="mb-8">
      <h2 className="font-heading text-xl sm:text-2xl text-white tracking-wider px-4 sm:px-6 lg:px-8 mb-3">
        CONTINUE WATCHING
      </h2>
      <div className="flex gap-3 overflow-x-auto no-scrollbar px-4 sm:px-6 lg:px-8 pb-2">
        {enriched.map((item) => {
          const link =
            item.type === "movie"
              ? `/watch/movie/${item.id}`
              : `/watch/tv/${item.id}/${item.season}/${item.episode}`;
          return (
            <Link
              key={`${item.type}_${item.id}_${item.season}_${item.episode}`}
              to={link}
              className="group relative flex-shrink-0 w-[150px] sm:w-[170px] md:w-[185px] rounded-lg overflow-hidden transition-transform duration-300 hover:scale-105"
            >
              <div className="aspect-[2/3] bg-dark-800 overflow-hidden rounded-lg">
                <img
                  src={posterUrl(item.poster_path)}
                  alt={item.title}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-dark-950 via-transparent to-transparent" />
              </div>

              {/* Play icon overlay on hover */}
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="w-12 h-12 rounded-full bg-accent/90 flex items-center justify-center">
                  <svg className="w-5 h-5 text-dark-950 ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                    <polygon points="5 3 19 12 5 21 5 3" />
                  </svg>
                </div>
              </div>

              {/* Bottom info */}
              <div className="absolute bottom-0 left-0 right-0 p-2.5">
                <p className="text-white text-sm font-medium leading-tight truncate">{item.title}</p>
                {item.type === "tv" && item.season && item.episode && (
                  <p className="text-dark-400 text-xs mt-0.5">S{item.season} E{item.episode}</p>
                )}
                {/* Progress bar */}
                <div className="mt-2 h-1 bg-dark-600 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-accent rounded-full transition-all"
                    style={{ width: `${Math.min(item.progress, 100)}%` }}
                  />
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
