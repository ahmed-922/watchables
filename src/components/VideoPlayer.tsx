interface VideoPlayerProps {
  tmdbId: number;
  type: "movie" | "tv";
  season?: number;
  episode?: number;
  startTime?: number;
}

export default function VideoPlayer({ tmdbId, type, season, episode, startTime }: VideoPlayerProps) {
  const params = new URLSearchParams();
  params.set("color", "0dcaf0");
  params.set("autoPlay", "true");
  if (type === "tv") {
    params.set("nextEpisode", "true");
    params.set("episodeSelector", "true");
  }
  if (startTime && startTime > 10) {
    params.set("progress", Math.floor(startTime).toString());
  }

  const basePath =
    type === "movie"
      ? `/embed/movie/${tmdbId}`
      : `/embed/tv/${tmdbId}/${season}/${episode}`;

  const src = `https://www.vidking.net${basePath}?${params.toString()}`;

  return (
    <div className="relative w-full h-full bg-black">
      <iframe
        src={src}
        className="absolute inset-0 w-full h-full border-0"
        allowFullScreen
        allow="autoplay; fullscreen; picture-in-picture"
        title="Video Player"
      />
    </div>
  );
}
