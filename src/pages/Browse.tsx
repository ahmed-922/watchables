import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { discoverMovies, discoverTV, getMovieGenres, getTVGenres } from "../services/tmdb";
import GenreFilter from "../components/GenreFilter";
import ContentCard from "../components/ContentCard";
import LoadingSpinner from "../components/Loading";
import type { Movie, TVShow, MediaType, TMDBResponse } from "../types";

export default function Browse() {
  const [mediaType, setMediaType] = useState<MediaType>("movie");
  const [genreId, setGenreId] = useState<number | null>(null);
  const [page, setPage] = useState(1);
  const [sortBy, setSortBy] = useState("popularity.desc");

  const movieGenres = useQuery({
    queryKey: ["genres", "movie"],
    queryFn: getMovieGenres,
  });

  const tvGenres = useQuery({
    queryKey: ["genres", "tv"],
    queryFn: getTVGenres,
  });

  const genres = mediaType === "movie" ? movieGenres.data?.genres : tvGenres.data?.genres;

  const content = useQuery<TMDBResponse<Movie | TVShow>>({
    queryKey: ["discover", mediaType, genreId, sortBy, page],
    queryFn: async () => {
      const params: Record<string, string> = {
        sort_by: sortBy,
        page: page.toString(),
      };
      if (genreId) params.with_genres = genreId.toString();
      if (mediaType === "movie") return discoverMovies(params);
      return discoverTV(params) as Promise<TMDBResponse<Movie | TVShow>>;
    },
  });

  const totalPages = Math.min(content.data?.total_pages ?? 1, 500);

  return (
    <div className="pt-20 pb-12 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-heading text-3xl sm:text-4xl text-white tracking-wider mb-6">BROWSE</h1>

          {/* Type toggle & Sort */}
          <div className="flex flex-wrap items-center gap-4 mb-5">
            <div className="flex bg-dark-800 rounded-lg p-0.5">
              <button
                onClick={() => { setMediaType("movie"); setGenreId(null); setPage(1); }}
                className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${
                  mediaType === "movie" ? "bg-accent text-dark-950" : "text-dark-300 hover:text-white"
                }`}
              >
                Movies
              </button>
              <button
                onClick={() => { setMediaType("tv"); setGenreId(null); setPage(1); }}
                className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${
                  mediaType === "tv" ? "bg-accent text-dark-950" : "text-dark-300 hover:text-white"
                }`}
              >
                TV Shows
              </button>
            </div>

            <select
              value={sortBy}
              onChange={(e) => { setSortBy(e.target.value); setPage(1); }}
              className="bg-dark-800 text-dark-300 text-sm border border-dark-600/30 rounded-lg px-3 py-1.5 focus:outline-none focus:border-accent/50"
            >
              <option value="popularity.desc">Most Popular</option>
              <option value="vote_average.desc">Highest Rated</option>
              <option value="primary_release_date.desc">Newest</option>
              <option value="primary_release_date.asc">Oldest</option>
            </select>
          </div>

          {/* Genre filter */}
          {genres && (
            <GenreFilter
              genres={genres}
              selectedId={genreId}
              onSelect={(id) => { setGenreId(id); setPage(1); }}
            />
          )}
        </div>

        {/* Content grid */}
        {content.isLoading ? (
          <LoadingSpinner />
        ) : content.data?.results.length ? (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {content.data.results.map((item) => (
                <div key={item.id} className="flex justify-center">
                  <ContentCard item={item} type={mediaType} />
                </div>
              ))}
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-center gap-4 mt-10">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1}
                className="px-4 py-2 bg-dark-800 text-dark-300 rounded-lg hover:bg-dark-700 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                Previous
              </button>
              <span className="text-dark-400 text-sm">
                Page {page} of {totalPages}
              </span>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page >= totalPages}
                className="px-4 py-2 bg-dark-800 text-dark-300 rounded-lg hover:bg-dark-700 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                Next
              </button>
            </div>
          </>
        ) : (
          <div className="text-center py-20">
            <p className="text-dark-400 text-lg">No results found</p>
          </div>
        )}
      </div>
    </div>
  );
}
