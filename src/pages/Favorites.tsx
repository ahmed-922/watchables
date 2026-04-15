import { useState } from "react";
import { Link } from "react-router-dom";
import { posterUrl } from "../services/tmdb";
import * as storage from "../services/storage";
import type { FavoriteItem } from "../types";

export default function Favorites() {
  const [favorites, setFavorites] = useState<FavoriteItem[]>(storage.getFavorites);

  const remove = (id: number, type: string) => {
    storage.removeFavorite(id, type);
    setFavorites(storage.getFavorites());
  };

  return (
    <div className="pt-20 pb-12 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="font-heading text-3xl sm:text-4xl text-white tracking-wider mb-2">MY FAVORITES</h1>
        <p className="text-dark-400 mb-8">{favorites.length} saved item{favorites.length !== 1 ? "s" : ""}</p>

        {favorites.length === 0 ? (
          <div className="text-center py-20">
            <svg className="w-16 h-16 text-dark-600 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
              <path d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
            </svg>
            <p className="text-dark-400 text-lg">No favorites yet</p>
            <p className="text-dark-500 text-sm mt-1">Start adding movies and shows you love</p>
            <Link
              to="/browse"
              className="inline-flex items-center gap-2 mt-4 bg-accent hover:bg-accent-hover text-dark-950 font-medium px-5 py-2 rounded-lg transition-colors"
            >
              Browse Content
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {favorites.map((fav) => {
              const link = fav.type === "movie" ? `/movie/${fav.id}` : `/tv/${fav.id}`;
              return (
                <div key={`${fav.type}_${fav.id}`} className="group relative">
                  <Link to={link} className="block rounded-lg overflow-hidden">
                    <div className="aspect-[2/3] bg-dark-800">
                      <img
                        src={posterUrl(fav.poster_path)}
                        alt={fav.title}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        loading="lazy"
                      />
                    </div>
                  </Link>
                  {/* Remove button */}
                  <button
                    onClick={() => remove(fav.id, fav.type)}
                    className="absolute top-2 right-2 w-7 h-7 flex items-center justify-center rounded-full bg-dark-900/80 text-red-500 hover:bg-red-500 hover:text-white opacity-0 group-hover:opacity-100 transition-all"
                    title="Remove from favorites"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                    </svg>
                  </button>
                  <div className="mt-2">
                    <p className="text-white text-sm font-medium truncate">{fav.title}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-dark-500 text-xs uppercase">{fav.type}</span>
                      {fav.vote_average > 0 && (
                        <span className="text-dark-500 text-xs flex items-center gap-0.5">
                          <svg className="w-3 h-3 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                          {fav.vote_average.toFixed(1)}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
