import { useState, useCallback } from "react";
import * as storage from "../services/storage";
import type { MediaType } from "../types";

interface FavoriteButtonProps {
  id: number;
  type: MediaType;
  title: string;
  poster_path: string | null;
  vote_average: number;
  size?: "sm" | "md";
}

export default function FavoriteButton({ id, type, title, poster_path, vote_average, size = "sm" }: FavoriteButtonProps) {
  const [isFav, setIsFav] = useState(() => storage.isFavorite(id, type));

  const toggle = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      if (isFav) {
        storage.removeFavorite(id, type);
      } else {
        storage.addFavorite({ id, type, title, poster_path, vote_average, added_at: Date.now() });
      }
      setIsFav(!isFav);
    },
    [isFav, id, type, title, poster_path, vote_average]
  );

  const sizeClasses = size === "sm" ? "w-7 h-7" : "w-9 h-9";
  const iconSize = size === "sm" ? "w-4 h-4" : "w-5 h-5";

  return (
    <button
      onClick={toggle}
      className={`${sizeClasses} flex items-center justify-center rounded-full bg-dark-900/80 backdrop-blur-sm hover:bg-dark-800 transition-all duration-200 ${
        isFav ? "text-red-500" : "text-white/70 hover:text-white"
      }`}
      title={isFav ? "Remove from favorites" : "Add to favorites"}
    >
      <svg className={iconSize} viewBox="0 0 24 24" fill={isFav ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2">
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
      </svg>
    </button>
  );
}
