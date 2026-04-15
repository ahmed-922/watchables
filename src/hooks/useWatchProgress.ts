import { useEffect, useCallback, useRef } from "react";
import * as storage from "../services/storage";
import type { PlayerEvent, ProgressData } from "../types";

export function useWatchProgress(
  id: number,
  type: "movie" | "tv",
  season?: number,
  episode?: number
) {
  const lastSave = useRef(0);

  const savedProgress = storage.getProgress(id, type, season, episode);

  const handleMessage = useCallback(
    (event: MessageEvent) => {
      try {
        const parsed: PlayerEvent = typeof event.data === "string" ? JSON.parse(event.data) : event.data;
        if (parsed?.type !== "PLAYER_EVENT") return;

        const { currentTime, duration, progress } = parsed.data;
        const now = Date.now();

        // Throttle saves to every 5 seconds
        if (now - lastSave.current < 5000 && parsed.data.event === "timeupdate") return;
        lastSave.current = now;

        const progressData: ProgressData = {
          progress,
          currentTime,
          duration,
          updatedAt: now,
        };

        storage.saveProgress(id, type, progressData, season, episode);
      } catch {
        // ignore non-player messages
      }
    },
    [id, type, season, episode]
  );

  useEffect(() => {
    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [handleMessage]);

  return { savedProgress };
}
