from core.exceptions import DataNotFoundException

class RecommendationService:
    def __init__(self, df, similarity_engine):
        self.df = df
        self.similarity_engine = similarity_engine

    def get_song_index(self, song_name):
        matches = self.df[self.df["track_name"] == song_name]
        if matches.empty:
            raise DataNotFoundException("Song not found")
        return matches.index[0]

    def recommend(self, song_name, page=1, per_page=10):
        idx = self.get_song_index(song_name)
        similarity_scores = self.similarity_engine.compute_similarity(idx)
        ranked = sorted(
            enumerate(similarity_scores),
            key=lambda x: x[1],
            reverse=True
        )[1:]  

        recommendations = []
        seen = set()
        for i, score in ranked:
            row = self.df.iloc[i]
            key = (str(row["track_name"]), str(row["artists"]))
            if key in seen:
                continue
            seen.add(key)
            recommendations.append({
                "track_name": str(row["track_name"]),
                "artist": str(row["artists"]),
                "album": str(row.get("album_name", "")),
                "release_year": str(row.get("release_year", "")),
                "genre": str(row.get("track_genre", "")),
                "popularity": int(row.get("popularity", 0)) if row.get("popularity", None) is not None else None,
                "score": round(float(score), 3)
            })
        start = (page - 1) * per_page
        end = start + per_page
        return recommendations[start:end]
