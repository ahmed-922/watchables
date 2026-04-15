import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getMovieDetails, getMovieCredits, getSimilarMovies, backdropUrl, posterUrl } from "../services/tmdb";
import ContentRow from "../components/ContentRow";
import FavoriteButton from "../components/FavoriteButton";
import { DetailSkeleton } from "../components/Loading";

export default function MovieDetail() {
  const { id } = useParams<{ id: string }>();

  const movie = useQuery({
    queryKey: ["movie", id],
    queryFn: () => getMovieDetails(id!),
    enabled: !!id,
  });

  const credits = useQuery({
    queryKey: ["movie", id, "credits"],
    queryFn: () => getMovieCredits(id!),
    enabled: !!id,
  });

  const similar = useQuery({
    queryKey: ["movie", id, "similar"],
    queryFn: () => getSimilarMovies(id!),
    enabled: !!id,
  });

  if (movie.isLoading) return <DetailSkeleton />;
  if (!movie.data) return <div className="pt-20 text-center text-dark-400">Movie not found</div>;

  const m = movie.data;
  const backdrop = backdropUrl(m.backdrop_path, "original");
  const cast = credits.data?.cast.slice(0, 12) ?? [];
  const year = m.release_date?.substring(0, 4);
  const hours = m.runtime ? Math.floor(m.runtime / 60) : 0;
  const mins = m.runtime ? m.runtime % 60 : 0;

  return (
    <div className="min-h-screen">
      {/* Backdrop hero */}
      <section className="relative h-[55vh] min-h-[400px] w-full overflow-hidden">
        {backdrop && (
          <img src={backdrop} alt={m.title} className="absolute inset-0 w-full h-full object-cover object-center" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-dark-950 via-dark-950/60 to-dark-950/30" />
        <div className="absolute inset-0 bg-gradient-to-r from-dark-950/80 via-transparent to-transparent" />
      </section>

      {/* Content */}
      <div className="relative -mt-48 z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Poster */}
          <div className="flex-shrink-0 w-48 md:w-56">
            <img
              src={posterUrl(m.poster_path)}
              alt={m.title}
              className="w-full rounded-xl shadow-2xl shadow-black/50"
            />
          </div>

          {/* Info */}
          <div className="flex-1 space-y-5">
            <div>
              <h1 className="font-heading text-3xl sm:text-4xl lg:text-5xl text-white tracking-wider leading-tight">
                {m.title}
              </h1>
              {m.tagline && (
                <p className="text-dark-400 italic mt-1">{m.tagline}</p>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-3 text-sm">
              {m.vote_average > 0 && (
                <span className="flex items-center gap-1 text-accent font-semibold">
                  <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  {m.vote_average.toFixed(1)}
                  <span className="text-dark-500">({m.vote_count})</span>
                </span>
              )}
              {year && <span className="text-dark-300">{year}</span>}
              {m.runtime && m.runtime > 0 && (
                <span className="text-dark-300">{hours}h {mins}m</span>
              )}
              {m.genres?.map((g) => (
                <span key={g.id} className="text-dark-400 bg-dark-800/60 px-2 py-0.5 rounded text-xs">
                  {g.name}
                </span>
              ))}
            </div>

            <p className="text-dark-300 leading-relaxed max-w-3xl">{m.overview}</p>

            <div className="flex items-center gap-3 pt-2">
              <Link
                to={`/watch/movie/${m.id}`}
                className="inline-flex items-center gap-2 bg-accent hover:bg-accent-hover text-dark-950 font-semibold px-6 py-2.5 rounded-lg transition-colors"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <polygon points="5 3 19 12 5 21 5 3" />
                </svg>
                Watch Now
              </Link>
              <FavoriteButton
                id={m.id}
                type="movie"
                title={m.title}
                poster_path={m.poster_path}
                vote_average={m.vote_average}
                size="md"
              />
            </div>
          </div>
        </div>

        {/* Cast */}
        {cast.length > 0 && (
          <div className="mt-10">
            <h2 className="font-heading text-xl text-white tracking-wider mb-4">CAST</h2>
            <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2">
              {cast.map((member) => (
                <div
                  key={member.id}
                  className="flex-shrink-0 w-24 text-center"
                >
                  <div className="w-20 h-20 mx-auto rounded-full overflow-hidden bg-dark-800 mb-2">
                    {member.profile_path ? (
                      <img
                        src={posterUrl(member.profile_path, "w185")}
                        alt={member.name}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-dark-500">
                        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                          <path d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0" />
                        </svg>
                      </div>
                    )}
                  </div>
                  <p className="text-white text-xs font-medium truncate">{member.name}</p>
                  <p className="text-dark-500 text-xs truncate">{member.character}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Similar */}
        {similar.data && similar.data.results.length > 0 && (
          <div className="mt-10 -mx-4 sm:-mx-6 lg:-mx-8">
            <ContentRow title="SIMILAR MOVIES" items={similar.data.results} type="movie" />
          </div>
        )}
      </div>
    </div>
  );
}
