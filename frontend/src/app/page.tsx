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
  const perPage = 5;

  // For caching recommendations per song and page
  const cache = useRef<Record<string, Record<number, Recommendation[]>>>({});

  // Handle default song list
  useEffect(() => {
    if (mode === "default") {
      setLoading(true);
      fetchSongs(page, perPage).then((songs) => {
        setRecommendations(songs);
        setLoading(false);
      });
    }
  }, [mode, page]);

  // Handler for search
  async function handleSearch(query: string, searchPage: number) {
    setMode("search");
    setSearchQuery(query);
    setPage(searchPage);
    setLoading(true);
    const data = await searchSongs(query, searchPage, perPage);
    setRecommendations(data);
    setLoading(false);
  }

  // Handler for recommendations
  function handleRecommend(recs: Recommendation[], song?: string) {
    const songKey = song || (recs[0]?.track_name ?? null);
    if (!songKey) return;
    setSelectedSong(songKey);
    setMode("recommend");
    setPage(1);
    setRecommendations(recs);
    cache.current[songKey] = { 1: recs };
  }

  // Pagination handler
  async function handlePageChange(newPage: number) {
    setPage(newPage);
    setLoading(true);

    if (mode === "default") {
      const songs = await fetchSongs(newPage, perPage);
      setRecommendations(songs);
    } else if (mode === "search") {
      const data = await searchSongs(searchQuery, newPage, perPage);
      setRecommendations(data);
    } else if (mode === "recommend" && selectedSong) {
      const songCache = cache.current[selectedSong] || {};
      if (songCache[newPage]) {
        setRecommendations(songCache[newPage]);
        setLoading(false);
        return;
      }
      const res = await recommendSong(selectedSong, newPage, perPage);
      setRecommendations(res.recommendations || []);
      cache.current[selectedSong] = {
        ...songCache,
        [newPage]: res.recommendations || [],
      };
    }
    setLoading(false);
  }

  return (
    <main className="max-w-4xl mx-auto py-16 px-4">
      <Header />
      <SongSearch
        onRecommend={(recs, song) => handleRecommend(recs, song)}
        onSearch={handleSearch}
      />
      <RecommendationList
        data={recommendations}
        onPageChange={handlePageChange}
        page={page}
        totalPages={5}
        loading={loading}
      />
    </main>
  );
}
