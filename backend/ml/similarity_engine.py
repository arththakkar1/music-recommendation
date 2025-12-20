from sklearn.metrics.pairwise import cosine_similarity

class SimilarityEngine:
    def __init__(self, df, feature_matrix):
        self.df = df
        self.matrix = feature_matrix

    def compute_similarity(self, index):
        return cosine_similarity(
            [self.matrix[index]],
            self.matrix
        )[0]
