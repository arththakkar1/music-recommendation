"use client";
import { useEffect, useState, useRef } from "react";
import { Search, Loader2 } from "lucide-react";

type Recommendation = {
  track_name: string;
  artist: string;
  album?: string;
  release_year?: string;
  genre?: string;
  popularity?: number;
  score?: number;
};

import { searchSongs, recommendSong } from "@/lib/api";

type SearchResult = {
  track_name: string;
  artist: string;
  album?: string;
  release_year?: string;
  genre?: string;
  popularity?: number;
  score?: number;
};

export default function SongSearch({
  onRecommend,
}: {
  onRecommend: (recs: Recommendation[], song?: string) => void;
}) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);

  const [loading, setLoading] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (query.length < 2) {
      setResults([]);
      return;
    }

    const delay = setTimeout(async () => {
      setLoading(true);
      const data = await searchSongs(query);
      setResults(data);
      setLoading(false);
    }, 300);

    return () => clearTimeout(delay);
  }, [query]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsFocused(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
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
      <div className="relative">
        <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
        <input
          type="text"
          placeholder="Search for a song..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          className="w-full bg-black text-white border border-white/10 rounded-2xl pl-14 pr-6 py-5 text-lg outline-none focus:border-white/30 transition-all placeholder:text-white/30"
        />
        {loading && (
          <Loader2 className="absolute right-5 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40 animate-spin" />
        )}
      </div>

      {isFocused && results.length > 0 && (
        <div className="absolute left-0 right-0 mt-3 bg-black border border-white/10 rounded-2xl shadow-2xl overflow-hidden z-50 backdrop-blur-xl">
          <ul className="max-h-80 overflow-y-auto">
            {results.map((song, i) => (
              <li
                key={i}
                onClick={() => handleSelect(song.track_name)}
                className="px-6 py-4 cursor-pointer hover:bg-white/5 transition-colors text-white border-b border-white/5 last:border-b-0 active:bg-white/10"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white/5 rounded-lg flex items-center justify-center">
                    <Search className="w-4 h-4 text-white/50" />
                  </div>
                  <span className="text-base">{song.track_name}</span>
                  <span className="text-base">{song.artist}</span>
                  {/* Show more info */}
                  <span className="text-xs text-white/30 ml-2">
                    {song.album && `Album: ${song.album} `}
                    {song.release_year && `Year: ${song.release_year} `}
                    {song.genre && `Genre: ${song.genre} `}
                    {song.popularity !== undefined &&
                      `Popularity: ${song.popularity}`}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {isFocused && loading && results.length === 0 && query.length >= 2 && (
        <div className="absolute left-0 right-0 mt-3 bg-black border border-white/10 rounded-2xl p-6 text-white/50 text-center">
          <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2" />
          <p>Searching...</p>
        </div>
      )}

      {isFocused && !loading && results.length === 0 && query.length >= 2 && (
        <div className="absolute left-0 right-0 mt-3 bg-black border border-white/10 rounded-2xl p-6 text-white/40 text-center">
          No results found
        </div>
      )}
    </div>
  );
}
