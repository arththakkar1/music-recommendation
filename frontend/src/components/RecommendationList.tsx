import { Play } from "lucide-react";

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
  const skeletons = Array.from({ length: 6 });

  return (
    <div className="w-full max-w-4xl mx-auto animate-fade-in opacity-0 [animation-delay:200ms] pb-10">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 px-1">
        <h2 className="text-xl font-medium tracking-tight text-zinc-100">
          Recommendations
        </h2>
      </div>

      {/* Table Headers */}
      <div className="grid grid-cols-[3rem_1fr_4rem] sm:grid-cols-[3rem_2fr_1fr_4rem] gap-4 px-3 py-2 border-b border-zinc-800 text-xs font-medium text-zinc-500 uppercase tracking-wider mb-2">
        <div className="text-center">#</div>
        <div>Title</div>
        <div className="hidden sm:block">Album</div>
        <div className="text-right">Match</div>
      </div>

      {/* List */}
      <div className="relative z-10 flex flex-col gap-1">
        {loading
          ? skeletons.map((_, i) => (
              <div
                key={i}
                className="animate-pulse grid grid-cols-[3rem_1fr_4rem] sm:grid-cols-[3rem_2fr_1fr_4rem] gap-4 items-center px-3 py-3 rounded-lg"
              >
                <div className="mx-auto w-4 h-4 bg-zinc-800 rounded"></div>
                <div className="flex flex-col gap-2">
                  <div className="h-4 bg-zinc-800 rounded w-2/3"></div>
                  <div className="h-3 bg-zinc-800 rounded w-1/3"></div>
                </div>
                <div className="hidden sm:block">
                  <div className="h-3 bg-zinc-800 rounded w-1/2"></div>
                </div>
                <div className="ml-auto w-8 h-4 bg-zinc-800 rounded"></div>
              </div>
            ))
          : data.map((song, i) => (
              <div
                key={i}
                className="group grid grid-cols-[3rem_1fr_4rem] sm:grid-cols-[3rem_2fr_1fr_4rem] gap-4 items-center px-3 py-2.5 hover:bg-zinc-900/80 rounded-lg cursor-pointer transition-colors animate-fade-in opacity-0"
                style={{ animationDelay: `${i * 50}ms` }}
              >
                {/* Index / Play action */}
                <div className="flex justify-center items-center w-full">
                  <span className="text-zinc-500 text-sm group-hover:hidden">
                    {(page - 1) * 6 + i + 1}
                  </span>
                  <Play className="w-4 h-4 text-zinc-100 hidden group-hover:block transition-colors" />
                </div>

                {/* Content */}
                <div className="min-w-0 pr-2">
                  <h3 className="font-medium text-zinc-200 text-sm truncate group-hover:text-white transition-colors">
                    {song.track_name}
                  </h3>
                  <div className="flex items-center gap-2 mt-0.5">
                    <p className="text-zinc-500 text-xs truncate">
                      {song.artist}
                    </p>
                    {/* Only show year inline on very small screens, otherwise it's in the album col or just omitted */}
                    {song.release_year && (
                      <span className="text-zinc-700 text-[10px] sm:hidden">• {song.release_year}</span>
                    )}
                  </div>
                </div>

                {/* Album / Extra info */}
                <div className="hidden sm:block min-w-0 pr-2">
                  <p className="text-zinc-500 text-sm truncate hover:text-zinc-400 transition-colors">
                    {song.album || song.genre || "Single"}
                  </p>
                </div>

                {/* Score */}
                <div className="text-right">
                  {song.score !== undefined ? (
                    <span className="text-zinc-400 text-sm font-medium tabular-nums group-hover:text-zinc-300 transition-colors">
                      {Math.round(song.score * 100)}%
                    </span>
                  ) : (
                    <span className="text-zinc-600">-</span>
                  )}
                </div>
              </div>
            ))}
      </div>

      {/* Pagination */}
      <div className="flex justify-between items-center mt-6 px-3">
        <button
           className="text-xs font-medium text-zinc-500 hover:text-zinc-200 transition-colors disabled:opacity-30 disabled:hover:text-zinc-500 cursor-pointer"
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1 || loading}
        >
          &larr; Previous
        </button>

        <span className="text-xs text-zinc-600 font-medium tracking-wide">
          {page} / {totalPages}
        </span>

        <button
           className="text-xs font-medium text-zinc-500 hover:text-zinc-200 transition-colors disabled:opacity-30 disabled:hover:text-zinc-500 cursor-pointer"
          onClick={() => onPageChange(page + 1)}
          disabled={page >= totalPages || loading}
        >
          Next &rarr;
        </button>
      </div>
    </div>
  );
}
