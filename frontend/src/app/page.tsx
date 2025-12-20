"use client";

import { useState, useRef } from "react";
import Header from "@/components/Header";
import SongSearch from "@/components/SongSearch";
import RecommendationList from "@/components/RecommendationList";
import { recommendSong } from "@/lib/api";

type Recommendation = {
  track_name: string;
  artist: string;
  album?: string;
  release_year?: string;
  genre?: string;
  popularity?: number;
  score?: number;
};

export default function Home() {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [selectedSong, setSelectedSong] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const perPage = 10;

  const cache = useRef<Record<string, Record<number, Recommendation[]>>>({});

  function handleRecommend(recs: Recommendation[], song?: string) {
    const songKey = song || (recs[0]?.track_name ?? null);
    if (!songKey) return;
    setSelectedSong(songKey);
    setPage(1);
    setTotalPages(5);
    setRecommendations(recs);

    // Cache first page
    cache.current[songKey] = { 1: recs };
  }

  async function handlePageChange(newPage: number) {
    if (!selectedSong) return;
    setPage(newPage);

    const songCache = cache.current[selectedSong] || {};
    if (songCache[newPage]) {
      setRecommendations(songCache[newPage]);
      return;
    }

    setLoading(true);
    const res = await recommendSong(selectedSong, newPage, perPage);
    setRecommendations(res.recommendations || []);
    setTotalPages(5);

    cache.current[selectedSong] = {
      ...songCache,
      [newPage]: res.recommendations || [],
    };
    setLoading(false);
  }

  return (
    <main className="max-w-4xl mx-auto py-16 px-4">
      <Header />
      <SongSearch onRecommend={(recs, song) => handleRecommend(recs, song)} />
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
