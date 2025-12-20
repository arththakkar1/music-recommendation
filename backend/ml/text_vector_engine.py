from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

class TextVectorSearchEngine:
    def __init__(self, texts):

        self.texts = [t.lower().strip() for t in texts]

        self.vectorizer = TfidfVectorizer(
            analyzer="char_wb",    
            ngram_range=(3, 5),   
            min_df=1
        )

        self.text_vectors = self.vectorizer.fit_transform(self.texts)

    def search(self, query, top_k=20):
        query = query.lower().strip()

        query_vector = self.vectorizer.transform([query])

        similarities = cosine_similarity(
            query_vector,
            self.text_vectors
        )[0]

        ranked_indices = similarities.argsort()[::-1][:top_k]

        return ranked_indices, similarities
