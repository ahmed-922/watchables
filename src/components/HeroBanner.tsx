import { Link } from "react-router-dom";
import { backdropUrl } from "../services/tmdb";
import type { Movie, TVShow, MediaType } from "../types";
import { getTitle, isMovie } from "../types";

interface HeroBannerProps {
  item: Movie | TVShow;
  type: MediaType;
}

export default function HeroBanner({ item, type }: HeroBannerProps) {
  const title = getTitle(item);
  const backdrop = backdropUrl(item.backdrop_path, "original");
  const detailLink = type === "movie" ? `/movie/${item.id}` : `/tv/${item.id}`;
  const watchLink = type === "movie" ? `/watch/movie/${item.id}` : `/tv/${item.id}`;
  const year = isMovie(item) ? item.release_date?.substring(0, 4) : item.first_air_date?.substring(0, 4);

  return (
    <section className="relative h-[70vh] min-h-[480px] max-h-[750px] w-full overflow-hidden">
      {/* Backdrop image */}
      {backdrop && (
        <img
          src={backdrop}
          alt={title}
          className="absolute inset-0 w-full h-full object-cover object-top"
        />
      )}

      {/* Gradient overlays */}
      <div className="absolute inset-0 bg-gradient-to-t from-dark-950 via-dark-950/50 to-dark-950/30" />
      <div className="absolute inset-0 bg-gradient-to-r from-dark-950/80 via-transparent to-transparent" />

      {/* Content */}
      <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
        <div className="max-w-2xl space-y-4 mb-8">
          <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl text-white tracking-wider leading-none drop-shadow-lg">
            {title}
          </h1>

          <div className="flex items-center gap-3 text-sm">
            {item.vote_average > 0 && (
              <span className="flex items-center gap-1 text-accent font-semibold">
                <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                {item.vote_average.toFixed(1)}
              </span>
            )}
            {year && <span className="text-dark-300">{year}</span>}
            <span className="text-dark-500 uppercase text-xs font-semibold tracking-wider bg-dark-800/60 px-2 py-0.5 rounded">
              {type === "movie" ? "Movie" : "TV Series"}
            </span>
          </div>

          <p className="text-dark-300 text-sm sm:text-base leading-relaxed line-clamp-3">
            {item.overview}
          </p>

          <div className="flex items-center gap-3 pt-2">
            <Link
              to={watchLink}
              className="inline-flex items-center gap-2 bg-accent hover:bg-accent-hover text-dark-950 font-semibold px-6 py-2.5 rounded-lg transition-colors duration-200"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <polygon points="5 3 19 12 5 21 5 3" />
              </svg>
              Watch Now
            </Link>
            <Link
              to={detailLink}
              className="inline-flex items-center gap-2 bg-dark-700/60 hover:bg-dark-600/60 text-white font-medium px-6 py-2.5 rounded-lg backdrop-blur-sm transition-colors duration-200 border border-dark-600/30"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <path d="M12 16v-4M12 8h.01" />
              </svg>
              Details
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
