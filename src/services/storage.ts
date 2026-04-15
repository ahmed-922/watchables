import type { FavoriteItem, HistoryItem, ProgressData } from "../types";

const KEYS = {
  favorites: "watchables_favorites",
  history: "watchables_history",
  progress: "watchables_progress",
} as const;

function getJSON<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function setJSON(key: string, value: unknown) {
  localStorage.setItem(key, JSON.stringify(value));
}

// Favorites
export function getFavorites(): FavoriteItem[] {
  return getJSON(KEYS.favorites, []);
}

export function addFavorite(item: FavoriteItem) {
  const favs = getFavorites().filter((f) => !(f.id === item.id && f.type === item.type));
  favs.unshift({ ...item, added_at: Date.now() });
  setJSON(KEYS.favorites, favs);
}

export function removeFavorite(id: number, type: string) {
  const favs = getFavorites().filter((f) => !(f.id === id && f.type === type));
  setJSON(KEYS.favorites, favs);
}

export function isFavorite(id: number, type: string): boolean {
  return getFavorites().some((f) => f.id === id && f.type === type);
}

// Watch History
export function getHistory(): HistoryItem[] {
  return getJSON(KEYS.history, []);
}

export function addToHistory(item: Omit<HistoryItem, "watched_at">) {
  let history = getHistory().filter(
    (h) => !(h.id === item.id && h.type === item.type && h.season === item.season && h.episode === item.episode)
  );
  history.unshift({ ...item, watched_at: Date.now() });
  if (history.length > 100) history = history.slice(0, 100);
  setJSON(KEYS.history, history);
}

export function clearHistory() {
  setJSON(KEYS.history, []);
}

// Watch Progress
export function getAllProgress(): Record<string, ProgressData> {
  return getJSON(KEYS.progress, {});
}

function progressKey(id: number, type: string, season?: number, episode?: number): string {
  if (type === "tv" && season != null && episode != null) {
    return `${type}_${id}_${season}_${episode}`;
  }
  return `${type}_${id}`;
}

export function getProgress(id: number, type: string, season?: number, episode?: number): ProgressData | null {
  const all = getAllProgress();
  return all[progressKey(id, type, season, episode)] || null;
}

export function saveProgress(id: number, type: string, data: ProgressData, season?: number, episode?: number) {
  const all = getAllProgress();
  all[progressKey(id, type, season, episode)] = { ...data, updatedAt: Date.now() };
  setJSON(KEYS.progress, all);
}

export function getContinueWatching(): Array<{ key: string; data: ProgressData }> {
  const all = getAllProgress();
  return Object.entries(all)
    .filter(([, d]) => d.progress > 2 && d.progress < 95)
    .sort(([, a], [, b]) => b.updatedAt - a.updatedAt)
    .slice(0, 20)
    .map(([key, data]) => ({ key, data }));
}
