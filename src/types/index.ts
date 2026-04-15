export interface Movie {
  id: number;
  title: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  vote_average: number;
  vote_count: number;
  release_date: string;
  genre_ids?: number[];
  genres?: Genre[];
  runtime?: number;
  tagline?: string;
  status?: string;
}

export interface TVShow {
  id: number;
  name: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  vote_average: number;
  vote_count: number;
  first_air_date: string;
  genre_ids?: number[];
  genres?: Genre[];
  number_of_seasons?: number;
  number_of_episodes?: number;
  seasons?: Season[];
  tagline?: string;
  status?: string;
}

export interface Genre {
  id: number;
  name: string;
}

export interface CastMember {
  id: number;
  name: string;
  character: string;
  profile_path: string | null;
}

export interface Season {
  id: number;
  season_number: number;
  name: string;
  overview: string;
  poster_path: string | null;
  episode_count: number;
  air_date: string | null;
  episodes?: Episode[];
}

export interface Episode {
  id: number;
  episode_number: number;
  season_number: number;
  name: string;
  overview: string;
  still_path: string | null;
  air_date: string | null;
  runtime: number | null;
  vote_average: number;
}

export interface TMDBResponse<T> {
  page: number;
  results: T[];
  total_pages: number;
  total_results: number;
}

export interface PlayerEvent {
  type: "PLAYER_EVENT";
  data: {
    event: "timeupdate" | "play" | "pause" | "ended" | "seeked";
    currentTime: number;
    duration: number;
    progress: number;
    id: string;
    mediaType: "movie" | "tv";
    season: number;
    episode: number;
    timestamp: number;
  };
}

export type MediaType = "movie" | "tv";

export type ContentItem = (Movie & { media_type: "movie" }) | (TVShow & { media_type: "tv" });

export interface FavoriteItem {
  id: number;
  type: MediaType;
  title: string;
  poster_path: string | null;
  vote_average: number;
  added_at: number;
}

export interface HistoryItem {
  id: number;
  type: MediaType;
  title: string;
  poster_path: string | null;
  watched_at: number;
  season?: number;
  episode?: number;
}

export interface ProgressData {
  progress: number;
  currentTime: number;
  duration: number;
  updatedAt: number;
}

export function isMovie(item: Movie | TVShow): item is Movie {
  return "title" in item;
}

export function getTitle(item: Movie | TVShow): string {
  return isMovie(item) ? item.title : item.name;
}

export function getYear(item: Movie | TVShow): string {
  const date = isMovie(item) ? item.release_date : item.first_air_date;
  return date ? date.substring(0, 4) : "";
}
