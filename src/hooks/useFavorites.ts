import { useState, useCallback } from "react";
import * as storage from "../services/storage";
import type { FavoriteItem } from "../types";

export function useFavorites() {
  const [favorites, setFavorites] = useState<FavoriteItem[]>(storage.getFavorites);

  const addFavorite = useCallback((item: FavoriteItem) => {
    storage.addFavorite(item);
    setFavorites(storage.getFavorites());
  }, []);

  const removeFavorite = useCallback((id: number, type: string) => {
    storage.removeFavorite(id, type);
    setFavorites(storage.getFavorites());
  }, []);

  const toggleFavorite = useCallback((item: FavoriteItem) => {
    if (storage.isFavorite(item.id, item.type)) {
      storage.removeFavorite(item.id, item.type);
    } else {
      storage.addFavorite(item);
    }
    setFavorites(storage.getFavorites());
  }, []);

  const checkIsFavorite = useCallback((id: number, type: string) => {
    return storage.isFavorite(id, type);
  }, []);

  return { favorites, addFavorite, removeFavorite, toggleFavorite, isFavorite: checkIsFavorite };
}
