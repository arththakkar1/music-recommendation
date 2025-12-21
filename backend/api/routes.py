from flask import Blueprint, request, jsonify

api = Blueprint("api", __name__)

@api.route("/songs", methods=["GET"])
def list_songs():
    df = api.df
    sample_df = df.sample(10)
    songs = []
    for _, row in sample_df.iterrows():
        songs.append({
            "track_name": row["track_name"],
            "artist": row["artists"],
            "album": row.get("album_name", ""),         
            "release_year": "", 
            "genre": row.get("track_genre", ""),
            "popularity": row.get("popularity", None)
        })
    return jsonify(songs)

@api.route("/search", methods=["GET"])
def search_songs():
    query = request.args.get("q", "").strip()
    page = int(request.args.get("page", 1))
    per_page = int(request.args.get("per_page", 5))

    if not query:
        return jsonify([])

    engine = api.text_search_engine
    df = api.df

    indices, scores = engine.search(query)

    results = []
    seen = set()
    for idx in indices:
        row = df.iloc[idx]
        key = (str(row["track_name"]), str(row["artists"]))
        if key in seen:
            continue
        seen.add(key)
        results.append({
            "track_name": str(row["track_name"]),
            "artist": str(row["artists"]),
            "album": str(row.get("album_name", "")),
            "release_year": str(row.get("release_year", "")),
            "genre": str(row.get("track_genre", "")),
            "popularity": int(row.get("popularity", 0)) if row.get("popularity", None) is not None else None,
            "score": round(float(scores[idx]), 4)
        })

    start = (page - 1) * per_page
    end = start + per_page
    paginated_results = results[start:end]

    return jsonify(paginated_results)



@api.route("/recommend", methods=["POST"])
def recommend_song():
    song = None
    page = 1
    per_page = 10

    if request.is_json:
        data = request.get_json()
        song = data.get("song")
        page = int(data.get("page", 1))
        per_page = int(data.get("per_page", 10))

    if not song:
        song = request.args.get("song")
        page = int(request.args.get("page", 1))
        per_page = int(request.args.get("per_page", 10))

    if not song:
        return jsonify({
            "error": "Song name is required (JSON or query param)"
        }), 400

    try:
        recs = api.service.recommend(song, page=page, per_page=per_page)
        return jsonify({
            "input": song,
            "recommendations": recs,
            "page": page,
            "per_page": per_page
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 404
