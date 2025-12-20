class Config:
    DATA_PATH = "data/spotify.csv"

    FEATURES = [
        "danceability",
        "energy",
        "tempo",
        "valence",
        "loudness",
        "speechiness",
        "acousticness"
    ]

    DEFAULT_RECOMMENDATIONS = 5
