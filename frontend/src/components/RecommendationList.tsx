import { Music2, TrendingUp } from "lucide-react";

type Recommendation = {
  track_name: string;
  artist: string;
  album?: string;
  release_year?: string;
  genre?: string;
  popularity?: number;
  score?: number;
};

export default function RecommendationList({
  data,
  onPageChange,
  page,
  totalPages,
  loading = false,
}: {
  data: Recommendation[];
  onPageChange: (page: number) => void;
  page: number;
  totalPages: number;
  loading?: boolean;
}) {
  const skeletons = Array.from({ length: 10 });

  return (
    <div className="mt-8 w-full max-w-2xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center">
          <TrendingUp className="w-5 h-5 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-white">Recommended Songs</h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {loading
          ? skeletons.map((_, i) => (
              <div
                key={i}
                className="animate-pulse bg-black border border-white/10 rounded-2xl p-5 flex gap-4"
              >
                <div className="w-12 h-12 bg-white/10 rounded-xl" />
                <div className="flex-1 space-y-2">
                  <div className="h-5 bg-white/10 rounded w-3/4" />
                  <div className="h-4 bg-white/10 rounded w-1/2" />
                  <div className="h-3 bg-white/10 rounded w-1/3 mt-2" />
                </div>
              </div>
            ))
          : data.map((song, i) => (
              <div
                key={i}
                className="bg-black border border-white/10 rounded-2xl p-5 hover:border-white/20 hover:bg-white/5 transition-all cursor-pointer group flex gap-4"
              >
                <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-white/10 transition-colors">
                  <Music2 className="w-6 h-6 text-white/70" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-white text-lg truncate">
                    {song.track_name}
                  </h3>
                  <p className="text-white/50 text-sm truncate">
                    {song.artist}
                  </p>
                  <div className="text-white/30 text-xs mt-1 flex gap-2 flex-wrap">
                    {song.album && <span>Album: {song.album}</span>}
                    {song.release_year && (
                      <span>Year: {song.release_year}</span>
                    )}
                    {song.genre && <span>Genre: {song.genre}</span>}
                    {song.popularity !== undefined && (
                      <span>Popularity: {song.popularity}</span>
                    )}
                  </div>
                </div>
                {song.score !== undefined && (
                  <div className="flex-shrink-0 px-3 py-1 bg-white/5 rounded-lg self-start">
                    <span className="text-white/70 text-sm font-medium">
                      {Math.round(song.score * 100)}%
                    </span>
                  </div>
                )}
              </div>
            ))}
      </div>

      <div className="flex justify-center mt-6 gap-2">
        <button
          className="px-3 py-1 rounded bg-white/10 text-white disabled:opacity-50"
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1 || loading}
        >
          Prev
        </button>
        <span className="px-3 py-1 text-white/70">
          Page {page} of {totalPages}
        </span>
        <button
          className="px-3 py-1 rounded bg-white/10 text-white disabled:opacity-50"
          onClick={() => onPageChange(page + 1)}
          disabled={page >= totalPages || loading}
        >
          Next
        </button>
      </div>
    </div>
  );
}
