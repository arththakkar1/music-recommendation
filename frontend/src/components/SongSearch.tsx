"use client";
import { useEffect, useState, useRef } from "react";
import { Search, Loader2 } from "lucide-react";
import { searchSongs, recommendSong } from "@/lib/api";

type Recommendation = {
  track_name: string;
  artist: string;
};

type SearchResult = Recommendation & {
  album?: string;
  release_year?: string;
  genre?: string;
  popularity?: number;
};

export default function SongSearch({
  onRecommend,
  onSearch,
}: {
  onRecommend: (recs: Recommendation[], song?: string) => void;
  onSearch: (query: string) => void;
}) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const skipSearchRef = useRef(false);

  useEffect(() => {
    let ignore = false;

    if (skipSearchRef.current) {
      skipSearchRef.current = false;
      return;
    }

    if (query.length < 2) {
      setResults([]);
      return;
    }

    const run = async () => {
      setLoading(true);
      const data = await searchSongs(query);
      if (!ignore) {
        setResults(data);
        setLoading(false);
      }
    };

    const timer = setTimeout(run, 300);

    return () => {
      ignore = true;
      clearTimeout(timer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setIsFocused(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  async function handleSelect(song: string) {
    skipSearchRef.current = true;
    setQuery(song);
    setResults([]);
    setIsFocused(false);
    setLoading(true);
    try {
      const res = await recommendSong(song);
      onRecommend(res.recommendations || [], song);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div ref={containerRef} className="relative w-full max-w-xl mx-auto animate-fade-in opacity-0 [animation-delay:100ms] z-20">
      {/* Input */}
      <div className="relative group">
        <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500 group-focus-within:text-zinc-300 transition-colors" />

        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && query.trim() !== "") {
              setIsFocused(false);
              onSearch(query);
            }
          }}
          placeholder="Search for a song you love…"
          className="w-full rounded-2xl px-14 py-4 text-base bg-zinc-900/50 text-zinc-100 placeholder:text-zinc-500 border border-zinc-800 hover:border-zinc-700 focus:bg-zinc-900 focus:border-zinc-500 outline-none transition-all shadow-sm"
        />

        {loading && (
          <Loader2 className="absolute right-5 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400 animate-spin" />
        )}
      </div>

      {/* Dropdown */}
      {isFocused && results.length > 0 && (
        <div className="absolute left-0 right-0 mt-2 bg-zinc-900 border border-zinc-800 rounded-xl shadow-xl overflow-hidden animate-fade-in">
          <ul className="max-h-80 overflow-y-auto scrollbar-none">
            {results.map((song, i) => (
              <li
                key={i}
                onClick={() => handleSelect(song.track_name)}
                className="px-5 py-3 cursor-pointer hover:bg-zinc-800/50 transition-colors border-b border-zinc-800/50 last:border-none group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-zinc-800/50 flex items-center justify-center">
                    <Search className="w-3.5 h-3.5 text-zinc-400 group-hover:text-zinc-300" />
                  </div>

                  <div className="min-w-0">
                    <p className="font-medium text-zinc-200 text-sm truncate group-hover:text-white transition-colors">
                      {song.track_name}
                    </p>
                    <p className="text-xs text-zinc-500 truncate mt-0.5">
                      {song.artist}
                    </p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Empty states */}
      {isFocused && loading && (
        <div className="absolute mt-2 w-full bg-zinc-900 border border-zinc-800 rounded-xl p-6 text-center shadow-xl animate-fade-in">
          <Loader2 className="w-5 h-5 animate-spin mx-auto mb-2 text-zinc-500" />
          <p className="text-zinc-500 text-sm">Searching…</p>
        </div>
      )}

      {isFocused && !loading && query.length >= 2 && results.length === 0 && (
        <div className="absolute mt-2 w-full bg-zinc-900 border border-zinc-800 rounded-xl p-6 text-center shadow-xl animate-fade-in">
          <p className="text-zinc-500 text-sm">No results found</p>
        </div>
      )}
    </div>
  );
}
