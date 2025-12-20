from flask import Flask
from flask_cors import CORS

from core.config import Config
from data_layer.data_loader import SpotifyDataLoader
from data_layer.data_filter import DataFilter
from ml.feature_engineering import FeatureEngineer
from ml.similarity_engine import SimilarityEngine
from services.recommendation_service import RecommendationService
from api.routes import api
from ml.text_vector_engine import TextVectorSearchEngine


app = Flask(__name__)
CORS(app)

loader = SpotifyDataLoader(Config.DATA_PATH)
raw_df = loader.load_data()

filtered_df = (
    DataFilter(raw_df)
    .remove_missing()
    .filter_popularity(30)
    .filter_duration(90000)
    .get_clean_data()
)

engineer = FeatureEngineer(Config.FEATURES)
feature_matrix = engineer.prepare_features(filtered_df)

similarity_engine = SimilarityEngine(filtered_df, feature_matrix)
service = RecommendationService(filtered_df, similarity_engine)
song_titles = filtered_df["track_name"].astype(str).tolist()
text_search_engine = TextVectorSearchEngine(song_titles)
api.text_search_engine = text_search_engine


api.df = filtered_df
api.service = service

app.register_blueprint(api)

@app.route("/")
def home():
    return {"status": "Music Recommendation API running 🎧"}

if __name__ == "__main__":
    app.run(debug=True)
