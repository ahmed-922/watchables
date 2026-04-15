const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const BASE_URL = "https://api.themoviedb.org/3";

export const IMG_BASE = "https://image.tmdb.org/t/p";
export const posterUrl = (path: string | null, size = "w500") =>
  path ? `${IMG_BASE}/${size}${path}` : "/no-poster.svg";
export const backdropUrl = (path: string | null, size = "w1280") =>
  path ? `${IMG_BASE}/${size}${path}` : null;

async function tmdbFetch<T>(endpoint: string, params: Record<string, string> = {}): Promise<T> {
  const url = new URL(`${BASE_URL}${endpoint}`);
  url.searchParams.set("api_key", API_KEY);
  for (const [key, value] of Object.entries(params)) {
    url.searchParams.set(key, value);
  }
  const res = await fetch(url.toString());
  if (!res.ok) throw new Error(`TMDB API error: ${res.status}`);
  return res.json();
}

import type { Movie, TVShow, Genre, CastMember, Season, TMDBResponse, ContentItem } from "../types";

// Trending
export const getTrendingMovies = (page = "1") =>
  tmdbFetch<TMDBResponse<Movie>>("/trending/movie/week", { page });

export const getTrendingTV = (page = "1") =>
  tmdbFetch<TMDBResponse<TVShow>>("/trending/tv/week", { page });

// Top Rated
export const getTopRatedMovies = (page = "1") =>
  tmdbFetch<TMDBResponse<Movie>>("/movie/top_rated", { page });

export const getTopRatedTV = (page = "1") =>
  tmdbFetch<TMDBResponse<TVShow>>("/tv/top_rated", { page });

// Popular
export const getPopularMovies = (page = "1") =>
  tmdbFetch<TMDBResponse<Movie>>("/movie/popular", { page });

export const getPopularTV = (page = "1") =>
  tmdbFetch<TMDBResponse<TVShow>>("/tv/popular", { page });

// Details
export const getMovieDetails = (id: string) =>
  tmdbFetch<Movie>(`/movie/${id}`);

export const getTVDetails = (id: string) =>
  tmdbFetch<TVShow>(`/tv/${id}`);

// Credits
export const getMovieCredits = (id: string) =>
  tmdbFetch<{ cast: CastMember[] }>(`/movie/${id}/credits`);

export const getTVCredits = (id: string) =>
  tmdbFetch<{ cast: CastMember[] }>(`/tv/${id}/credits`);

// Similar
export const getSimilarMovies = (id: string) =>
  tmdbFetch<TMDBResponse<Movie>>(`/movie/${id}/similar`);

export const getSimilarTV = (id: string) =>
  tmdbFetch<TMDBResponse<TVShow>>(`/tv/${id}/similar`);

// TV Seasons
export const getTVSeason = (id: string, seasonNumber: string) =>
  tmdbFetch<Season>(`/tv/${id}/season/${seasonNumber}`);

// Search
export const searchMulti = (query: string, page = "1") =>
  tmdbFetch<TMDBResponse<ContentItem>>("/search/multi", { query, page });

// Genres
export const getMovieGenres = () =>
  tmdbFetch<{ genres: Genre[] }>("/genre/movie/list");

export const getTVGenres = () =>
  tmdbFetch<{ genres: Genre[] }>("/genre/tv/list");

// Discover
export const discoverMovies = (params: Record<string, string> = {}) =>
  tmdbFetch<TMDBResponse<Movie>>("/discover/movie", { sort_by: "popularity.desc", ...params });

export const discoverTV = (params: Record<string, string> = {}) =>
  tmdbFetch<TMDBResponse<TVShow>>("/discover/tv", { sort_by: "popularity.desc", ...params });
