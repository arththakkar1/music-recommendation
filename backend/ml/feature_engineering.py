from sklearn.preprocessing import StandardScaler

class FeatureEngineer:
    def __init__(self, features):
        self.features = features
        self.scaler = StandardScaler()

    def prepare_features(self, df):
        return self.scaler.fit_transform(df[self.features])
