import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getMovieDetails } from "../services/tmdb";
import VideoPlayer from "../components/VideoPlayer";
import { useWatchProgress } from "../hooks/useWatchProgress";
import { addToHistory } from "../services/storage";
import { useEffect } from "react";

export default function WatchMovie() {
  const { id } = useParams<{ id: string }>();
  const movieId = parseInt(id!);

  const movie = useQuery({
    queryKey: ["movie", id],
    queryFn: () => getMovieDetails(id!),
    enabled: !!id,
  });

  const { savedProgress } = useWatchProgress(movieId, "movie");

  // Add to history
  useEffect(() => {
    if (movie.data) {
      addToHistory({
        id: movieId,
        type: "movie",
        title: movie.data.title,
        poster_path: movie.data.poster_path,
      });
    }
  }, [movie.data, movieId]);

  return (
    <div className="fixed inset-0 z-50 bg-black flex flex-col">
      {/* Top bar */}
      <div className="absolute top-0 left-0 right-0 z-10 bg-gradient-to-b from-black/80 to-transparent p-4 flex items-center gap-4 opacity-0 hover:opacity-100 transition-opacity duration-300">
        <Link
          to={`/movie/${movieId}`}
          className="flex items-center gap-2 text-white/80 hover:text-white transition-colors"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path d="M15 19l-7-7 7-7" />
          </svg>
          <span className="text-sm font-medium">Back</span>
        </Link>
        {movie.data && (
          <h1 className="text-white text-sm font-medium truncate">{movie.data.title}</h1>
        )}
      </div>

      {/* Player */}
      <div className="flex-1">
        <VideoPlayer
          tmdbId={movieId}
          type="movie"
          startTime={savedProgress?.currentTime}
        />
      </div>
    </div>
  );
}
