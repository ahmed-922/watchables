import { useState, useCallback } from "react";
import * as storage from "../services/storage";
import type { HistoryItem } from "../types";

export function useWatchHistory() {
  const [history, setHistory] = useState<HistoryItem[]>(storage.getHistory);

  const addToHistory = useCallback((item: Omit<HistoryItem, "watched_at">) => {
    storage.addToHistory(item);
    setHistory(storage.getHistory());
  }, []);

  const clearHistory = useCallback(() => {
    storage.clearHistory();
    setHistory([]);
  }, []);

  return { history, addToHistory, clearHistory };
}
