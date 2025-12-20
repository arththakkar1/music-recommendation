class DataFilter:
    def __init__(self, df):
        self.df = df

    def remove_missing(self):
        self.df = self.df.dropna()
        return self

    def filter_popularity(self, min_popularity=20):
        if "popularity" in self.df.columns:
            self.df = self.df[self.df["popularity"] >= min_popularity]
        return self

    def filter_duration(self, min_ms=60000):
        if "duration_ms" in self.df.columns:
            self.df = self.df[self.df["duration_ms"] >= min_ms]
        return self

    def get_clean_data(self):
        return self.df.reset_index(drop=True)
