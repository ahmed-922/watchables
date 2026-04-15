import type { Genre } from "../types";

interface GenreFilterProps {
  genres: Genre[];
  selectedId: number | null;
  onSelect: (id: number | null) => void;
}

export default function GenreFilter({ genres, selectedId, onSelect }: GenreFilterProps) {
  return (
    <div className="flex flex-wrap gap-2">
      <button
        onClick={() => onSelect(null)}
        className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${
          selectedId === null
            ? "bg-accent text-dark-950"
            : "bg-dark-800 text-dark-300 hover:bg-dark-700 hover:text-white border border-dark-600/30"
        }`}
      >
        All
      </button>
      {genres.map((genre) => (
        <button
          key={genre.id}
          onClick={() => onSelect(genre.id === selectedId ? null : genre.id)}
          className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${
            genre.id === selectedId
              ? "bg-accent text-dark-950"
              : "bg-dark-800 text-dark-300 hover:bg-dark-700 hover:text-white border border-dark-600/30"
          }`}
        >
          {genre.name}
        </button>
      ))}
    </div>
  );
}
