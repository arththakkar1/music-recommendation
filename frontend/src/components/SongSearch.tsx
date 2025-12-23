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
  onSearch: (query: string, page: number) => void;
}) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [searchPage, setSearchPage] = useState(1);
  const perPage = 5;
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (query.length < 2) {
      setResults([]);
      setSearchPage(1);
      return;
    }

    const run = async () => {
      setLoading(true);
      const data = await searchSongs(query, searchPage, perPage);
      setResults(data);
      setLoading(false);
      onSearch(query, searchPage);
    };

    run();
  }, [query, searchPage]);

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
    setQuery(song);
    setResults([]);
    setIsFocused(false);
    const res = await recommendSong(song);
    onRecommend(res.recommendations || []);
  }

  return (
    <div ref={containerRef} className="relative w-full max-w-2xl mx-auto">
      {/* Input */}
      <div className="relative">
        <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-[#222222]" />

        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          placeholder="Search for a song you love…"
          className="w-full rounded-2xl px-14 py-5 text-lg bg-white text-gray-900 border border-black/10 focus:border-black/60 focus:ring-4 focus:ring-[#3A2A23]/20 outline-none transition-all"
        />

        {loading && (
          <Loader2 className="absolute right-5 top-1/2 -translate-y-1/2 w-5 h-5 text-[#7B3F00] animate-spin" />
        )}
      </div>

      {/* Dropdown */}
      {isFocused && results.length > 0 && (
        <div className="absolute left-0 right-0 mt-3 bg-white border border-black/10 rounded-2xl shadow-xl overflow-hidden z-50">
          <ul className="max-h-80 overflow-y-auto">
            {results.map((song, i) => (
              <li
                key={i}
                onClick={() => handleSelect(song.track_name)}
                className="px-6 py-4 cursor-pointer hover:bg-purple-50 transition border-b last:border-none"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-[#3A2A23] flex items-center justify-center">
                    <Search className="w-4 h-4 text-white" />
                  </div>

                  <div className="min-w-0">
                    <p className="font-medium text-gray-900 truncate">
                      {song.track_name}
                    </p>
                    <p className="text-sm text-gray-600 truncate">
                      {song.artist}
                    </p>
                  </div>
                </div>
              </li>
            ))}
          </ul>

          {/* Pagination */}
          <div className="flex justify-between items-center px-6 py-2 bg-gray-50">
            <button
              onClick={() => setSearchPage((p) => Math.max(1, p - 1))}
              disabled={searchPage <= 1}
              className="px-4 py-1 rounded-full bg-gray-200 text-gray-700 disabled:opacity-40"
            >
              Prev
            </button>

            <span className="text-sm text-gray-600">Page {searchPage}</span>

            <button
              onClick={() => setSearchPage((p) => p + 1)}
              disabled={results.length < perPage}
              className="px-4 py-1 rounded-full bg-[#00009b] text-white disabled:opacity-40"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* Empty states */}
      {isFocused && loading && (
        <div className="absolute mt-3 w-full bg-white rounded-2xl p-6 text-center shadow">
          <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 bg-[#7B3F00]" />
          <p className="text-gray-500">Searching…</p>
        </div>
      )}

      {isFocused && !loading && query.length >= 2 && results.length === 0 && (
        <div className="absolute mt-3 w-full bg-white rounded-2xl p-6 text-center shadow">
          <p className="text-gray-500">No results found</p>
        </div>
      )}
    </div>
  );
}
