const API_URL = "http://127.0.0.1:5000";

export async function searchSongs(query: string) {
  const res = await fetch(`${API_URL}/search?q=${query}`);
  return res.json();
}

export async function recommendSong(song: string, page = 1, per_page = 10) {
  const res = await fetch(`${API_URL}/recommend`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ song, page, per_page }),
  });
  return res.json();
}
