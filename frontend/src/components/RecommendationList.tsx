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
  const skeletons = Array.from({ length: 5 });

  return (
    <div className="mt-10 w-full max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-[#3A2A23] flex items-center justify-center shadow-md">
          <TrendingUp className="w-5 h-5 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900">Recommended Songs</h2>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {loading
          ? skeletons.map((_, i) => (
              <div
                key={i}
                className="animate-pulse bg-white rounded-2xl p-5 flex gap-4 shadow-sm"
              >
                <div className="w-12 h-12 bg-gray-200 rounded-xl" />
                <div className="flex-1 space-y-2">
                  <div className="h-5 bg-gray-200 rounded w-3/4" />
                  <div className="h-4 bg-gray-200 rounded w-1/2" />
                  <div className="h-3 bg-gray-200 rounded w-1/3" />
                </div>
              </div>
            ))
          : data.map((song, i) => (
              <div
                key={i}
                className="
                  bg-white rounded-2xl p-5 flex gap-4 cursor-pointer
                  shadow-sm hover:shadow-xl hover:-translate-y-1
                  transition-all
                "
              >
                {/* Icon */}
                <div className="w-12 h-12 rounded-xl bg-[#3A2A23] flex items-center justify-center shrink-0">
                  <Music2 className="w-6 h-6 text-white" />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900 text-lg truncate">
                    {song.track_name}
                  </h3>
                  <p className="text-gray-600 text-sm truncate">
                    {song.artist}
                  </p>

                  <div className="text-gray-500 text-xs mt-1 flex gap-2 flex-wrap">
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

                {/* Score */}
                {song.score !== undefined && (
                  <div className="shrink-0 self-start px-3 py-1 rounded-full bg-purple-100 text-purple-700 text-sm font-semibold">
                    {Math.round(song.score * 100)}%
                  </div>
                )}
              </div>
            ))}
      </div>

      {/* Pagination */}
      <div className="flex justify-center mt-8 gap-3">
        <button
          className="px-4 py-1.5 rounded-full bg-[#3A2A23] text-white cursor-pointer disabled:opacity-40"
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1 || loading}
        >
          Prev
        </button>

        <span className="px-3 py-1 text-gray-600 text-sm">
          Page {page} of {totalPages}
        </span>

        <button
          className="px-4 py-1.5 rounded-full bg-[#3A2A23] cursor-pointer text-white disabled:opacity-40"
          onClick={() => onPageChange(page + 1)}
          disabled={page >= totalPages || loading}
        >
          Next
        </button>
      </div>
    </div>
  );
}
