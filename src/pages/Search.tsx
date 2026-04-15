import { useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { searchMulti } from "../services/tmdb";
import { useDebounce } from "../hooks/useDebounce";
import ContentCard from "../components/ContentCard";
import LoadingSpinner from "../components/Loading";

export default function Search() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q") || "";
  const debouncedQuery = useDebounce(query, 300);

  const results = useQuery({
    queryKey: ["search", debouncedQuery],
    queryFn: () => searchMulti(debouncedQuery),
    enabled: debouncedQuery.length > 1,
  });

  const filtered = results.data?.results.filter(
    (item) => "media_type" in item && (item.media_type === "movie" || item.media_type === "tv")
  ) ?? [];

  return (
    <div className="pt-20 pb-12 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="font-heading text-3xl sm:text-4xl text-white tracking-wider mb-2">
          SEARCH RESULTS
        </h1>
        {query && (
          <p className="text-dark-400 mb-8">
            Showing results for "<span className="text-accent">{query}</span>"
          </p>
        )}

        {!query ? (
          <div className="text-center py-20">
            <svg className="w-16 h-16 text-dark-600 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.3-4.3" />
            </svg>
            <p className="text-dark-400 text-lg">Enter a search term to find movies and TV shows</p>
          </div>
        ) : results.isLoading ? (
          <LoadingSpinner />
        ) : filtered.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {filtered.map((item) => (
              <div key={`${item.media_type}_${item.id}`} className="flex justify-center">
                <ContentCard
                  item={item}
                  type={item.media_type as "movie" | "tv"}
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-dark-400 text-lg">No results found for "{query}"</p>
            <p className="text-dark-500 text-sm mt-1">Try a different search term</p>
          </div>
        )}
      </div>
    </div>
  );
}
