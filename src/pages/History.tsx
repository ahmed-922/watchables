import { useState } from "react";
import { Link } from "react-router-dom";
import { posterUrl } from "../services/tmdb";
import * as storage from "../services/storage";
import type { HistoryItem } from "../types";

export default function History() {
  const [history, setHistory] = useState<HistoryItem[]>(storage.getHistory);

  const clearAll = () => {
    storage.clearHistory();
    setHistory([]);
  };

  const formatDate = (ts: number) => {
    const d = new Date(ts);
    const now = new Date();
    const diff = now.getTime() - d.getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return "Just now";
    if (mins < 60) return `${mins}m ago`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    if (days < 7) return `${days}d ago`;
    return d.toLocaleDateString();
  };

  return (
    <div className="pt-20 pb-12 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-heading text-3xl sm:text-4xl text-white tracking-wider mb-1">WATCH HISTORY</h1>
            <p className="text-dark-400">{history.length} item{history.length !== 1 ? "s" : ""}</p>
          </div>
          {history.length > 0 && (
            <button
              onClick={clearAll}
              className="text-dark-400 hover:text-red-400 text-sm transition-colors"
            >
              Clear All
            </button>
          )}
        </div>

        {history.length === 0 ? (
          <div className="text-center py-20">
            <svg className="w-16 h-16 text-dark-600 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
              <path d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-dark-400 text-lg">No watch history yet</p>
            <p className="text-dark-500 text-sm mt-1">Start watching something!</p>
            <Link
              to="/browse"
              className="inline-flex items-center gap-2 mt-4 bg-accent hover:bg-accent-hover text-dark-950 font-medium px-5 py-2 rounded-lg transition-colors"
            >
              Browse Content
            </Link>
          </div>
        ) : (
          <div className="space-y-2">
            {history.map((item, index) => {
              const link = item.type === "movie" ? `/movie/${item.id}` : `/tv/${item.id}`;
              const watchLink =
                item.type === "movie"
                  ? `/watch/movie/${item.id}`
                  : `/watch/tv/${item.id}/${item.season ?? 1}/${item.episode ?? 1}`;
              return (
                <div
                  key={`${item.type}_${item.id}_${index}`}
                  className="flex items-center gap-4 bg-dark-800/40 hover:bg-dark-800/70 rounded-lg p-3 transition-colors group"
                >
                  <Link to={link} className="flex-shrink-0 w-12 aspect-[2/3] rounded overflow-hidden bg-dark-700">
                    <img
                      src={posterUrl(item.poster_path, "w154")}
                      alt={item.title}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </Link>
                  <div className="flex-1 min-w-0">
                    <Link to={link} className="text-white text-sm font-medium hover:text-accent transition-colors truncate block">
                      {item.title}
                    </Link>
                    <div className="flex items-center gap-2 mt-0.5 text-xs text-dark-500">
                      <span className="uppercase">{item.type}</span>
                      {item.type === "tv" && item.season != null && item.episode != null && (
                        <span>S{item.season} E{item.episode}</span>
                      )}
                      <span>•</span>
                      <span>{formatDate(item.watched_at)}</span>
                    </div>
                  </div>
                  <Link
                    to={watchLink}
                    className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <div className="w-9 h-9 rounded-full bg-accent/20 hover:bg-accent/30 flex items-center justify-center transition-colors">
                      <svg className="w-4 h-4 text-accent ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                        <polygon points="5 3 19 12 5 21 5 3" />
                      </svg>
                    </div>
                  </Link>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
