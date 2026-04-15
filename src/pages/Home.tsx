import { useQuery } from "@tanstack/react-query";
import { getTrendingMovies, getTrendingTV, getTopRatedMovies, getPopularMovies } from "../services/tmdb";
import HeroBanner from "../components/HeroBanner";
import ContentRow from "../components/ContentRow";
import { RowSkeleton } from "../components/Loading";
import { getContinueWatching, getHistory } from "../services/storage";
import ContinueWatchingRow from "../components/ContinueWatchingRow";

export default function Home() {
  const trendingMovies = useQuery({
    queryKey: ["trending", "movie"],
    queryFn: () => getTrendingMovies(),
  });

  const trendingTV = useQuery({
    queryKey: ["trending", "tv"],
    queryFn: () => getTrendingTV(),
  });

  const topRated = useQuery({
    queryKey: ["topRated", "movie"],
    queryFn: () => getTopRatedMovies(),
  });

  const popular = useQuery({
    queryKey: ["popular", "movie"],
    queryFn: () => getPopularMovies(),
  });

  const heroItem = trendingMovies.data?.results[0];
  const continueWatching = getContinueWatching();
  const history = getHistory();

  return (
    <div className="min-h-screen">
      {/* Hero */}
      {heroItem ? (
        <HeroBanner item={heroItem} type="movie" />
      ) : (
        <div className="h-[70vh] min-h-[480px] max-h-[750px] bg-dark-900 animate-pulse" />
      )}

      <div className="relative -mt-20 z-10 space-y-2 pb-12">
        {/* Continue Watching */}
        {continueWatching.length > 0 && (
          <ContinueWatchingRow items={continueWatching} history={history} />
        )}

        {/* Trending Movies */}
        {trendingMovies.isLoading ? (
          <RowSkeleton />
        ) : trendingMovies.data ? (
          <ContentRow title="TRENDING MOVIES" items={trendingMovies.data.results} type="movie" />
        ) : null}

        {/* Trending TV */}
        {trendingTV.isLoading ? (
          <RowSkeleton />
        ) : trendingTV.data ? (
          <ContentRow title="TRENDING TV SHOWS" items={trendingTV.data.results} type="tv" />
        ) : null}

        {/* Top Rated */}
        {topRated.isLoading ? (
          <RowSkeleton />
        ) : topRated.data ? (
          <ContentRow title="TOP RATED" items={topRated.data.results} type="movie" />
        ) : null}

        {/* Popular */}
        {popular.isLoading ? (
          <RowSkeleton />
        ) : popular.data ? (
          <ContentRow title="POPULAR" items={popular.data.results} type="movie" />
        ) : null}
      </div>
    </div>
  );
}
