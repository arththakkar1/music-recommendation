import pandas as pd

class SpotifyDataLoader:
    def __init__(self, path):
        self.path = path

    def load_data(self):
        df = pd.read_csv(self.path)

        if df.empty:
            raise ValueError("CSV file is empty")

        return df
