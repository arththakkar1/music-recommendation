"use client";

import { useState, useRef, useEffect } from "react";
import Header from "@/components/Header";
import SongSearch from "@/components/SongSearch";
import RecommendationList from "@/components/RecommendationList";
import { fetchSongs, recommendSong, searchSongs } from "@/lib/api";

type Recommendation = {
  track_name: string;
  artist: string;
  album?: string;
  release_year?: string;
  genre?: string;
  popularity?: number;
  score?: number;
};

type Mode = "default" | "search" | "recommend";

export default function Home() {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [selectedSong, setSelectedSong] = useState<string | null>(null);
  const [mode, setMode] = useState<Mode>("default");
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const perPage = 6;
  const totalPages = 5;

  const cache = useRef<Record<string, Record<number, Recommendation[]>>>({});
  const searchId = useRef(0);

  // Helper to fetch and cache page data
  const fetchPageData = async (m: Mode, p: number, song: string | null) => {
    const key = m === "default" ? "default" : song;
    if (!key) return [];
    
    // Return from cache if available
    if (cache.current[key]?.[p]) {
      return cache.current[key][p];
    }
    
    // Fetch from API
    let data: Recommendation[] = [];
    if (m === "default") {
      data = await fetchSongs(p, perPage);
    } else if (m === "recommend" && song) {
      const res = await recommendSong(song, p, perPage);
      data = res.recommendations || [];
    }
    
    // Save to cache
    cache.current[key] = { ...(cache.current[key] || {}), [p]: data };
    return data;
  };

  // Main effect to load data when page, mode, or song changes
  useEffect(() => {
    let ignore = false;
    if (mode === "default" || mode === "recommend") {
      const key = mode === "default" ? "default" : selectedSong;
      if (!key) return;

      const isCached = !!cache.current[key]?.[page];
      if (!isCached) {
        setLoading(true);
      }
      
      fetchPageData(mode, page, selectedSong).then(data => {
        if (!ignore) {
          setRecommendations(data);
          setLoading(false);
        }
      });
    }
    return () => { ignore = true; };
  }, [mode, page, selectedSong]);

  // Prefetching effect for next 2 pages
  useEffect(() => {
    if (mode === "default" || mode === "recommend") {
      const key = mode === "default" ? "default" : selectedSong;
      if (!key) return;
      
      const prefetch = async () => {
        const nextPages = [page + 1, page + 2].filter(p => p <= totalPages && !cache.current[key]?.[p]);
        for (const p of nextPages) {
          try {
            await fetchPageData(mode, p, selectedSong);
          } catch (e) {
            // ignore prefetch errors 
          }
        }
      }
      prefetch(); // kicks off background fetches implicitly
    }
  }, [mode, page, selectedSong]);

  // Handler for search
  async function handleSearch(query: string) {
    setMode("search");
    setSearchQuery(query);
    setPage(1);
    setLoading(true);
    
    const currentId = ++searchId.current;
    const data = await searchSongs(query); 
    
    if (searchId.current === currentId) {
      setRecommendations(data);
      setLoading(false);
    }
  }

  // Handler for recommendations
  function handleRecommend(recs: Recommendation[], song?: string) {
    const songKey = song || (recs[0]?.track_name ?? null);
    if (!songKey) return;
    
    searchId.current++; 
    
    setSelectedSong(songKey);
    setMode("recommend");
    setPage(1);
    
    // Pre-hydrate cache with initial page 1 results so it loads instantly
    cache.current[songKey] = { ...(cache.current[songKey] || {}), [1]: recs };
  }

  function handlePageChange(newPage: number) {
    setPage(newPage);
  }

  return (
    <main className="relative min-h-screen max-w-3xl mx-auto py-20 px-4 sm:px-6">
      <Header />
      <SongSearch
        onRecommend={handleRecommend}
        onSearch={handleSearch} 
      />
      <div className="w-full border-t border-zinc-800/50 my-10 animate-fade-in [animation-delay:150ms] opacity-0" />
      <RecommendationList
        data={recommendations}
        onPageChange={handlePageChange}
        page={page}
        totalPages={totalPages}
        loading={loading}
      />
    </main>
  );
}
