import { Link } from "react-router-dom";
import { posterUrl } from "../services/tmdb";
import type { Movie, TVShow, MediaType } from "../types";
import { getTitle, getYear } from "../types";
import FavoriteButton from "./FavoriteButton";

interface ContentCardProps {
  item: Movie | TVShow;
  type: MediaType;
  showFavorite?: boolean;
}

export default function ContentCard({ item, type, showFavorite = true }: ContentCardProps) {
  const title = getTitle(item);
  const year = getYear(item);
  const link = type === "movie" ? `/movie/${item.id}` : `/tv/${item.id}`;

  return (
    <Link
      to={link}
      className="group relative flex-shrink-0 w-[150px] sm:w-[170px] md:w-[185px] rounded-lg overflow-hidden transition-transform duration-300 hover:scale-105 hover:z-10"
    >
      <div className="aspect-[2/3] bg-dark-800 overflow-hidden rounded-lg">
        <img
          src={posterUrl(item.poster_path)}
          alt={title}
          className="w-full h-full object-cover transition-all duration-500 group-hover:brightness-110"
          loading="lazy"
        />
        {/* Hover overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-dark-950 via-dark-950/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      {/* Rating badge */}
      {item.vote_average > 0 && (
        <div className="absolute top-2 left-2 bg-dark-950/80 backdrop-blur-sm text-xs font-semibold px-1.5 py-0.5 rounded flex items-center gap-1">
          <svg className="w-3 h-3 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
          <span className="text-white">{item.vote_average.toFixed(1)}</span>
        </div>
      )}

      {/* Favorite button */}
      {showFavorite && (
        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <FavoriteButton
            id={item.id}
            type={type}
            title={title}
            poster_path={item.poster_path}
            vote_average={item.vote_average}
          />
        </div>
      )}

      {/* Title */}
      <div className="absolute bottom-0 left-0 right-0 p-2.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <p className="text-white text-sm font-medium leading-tight truncate">{title}</p>
        {year && <p className="text-dark-400 text-xs mt-0.5">{year}</p>}
      </div>
    </Link>
  );
}
