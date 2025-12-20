# Music Recommendation System

A full-stack intelligent music recommendation platform leveraging machine learning algorithms for content-based filtering and similarity matching.

---

## Overview

The Music Recommendation System is an intelligent application that provides personalized song recommendations using content-based filtering techniques. By analyzing textual and audio features of songs, the system computes semantic similarity between tracks to deliver accurate recommendations.

**Key Features:**

- Real-time song search with fuzzy matching
- Content-based recommendation engine
- Paginated results with duplicate removal
- Audio feature integration (danceability, energy, valence, etc.)
- RESTful API architecture
- Modern React-based user interface

---

## Architecture

The system follows a modular, layered architecture:

```
┌─────────────────────────────────────┐
│         Frontend (React/Next.js)    │
│    TypeScript + Tailwind CSS        │
└──────────────┬──────────────────────┘
               │ HTTP/REST
┌──────────────▼──────────────────────┐
│      API Layer (Flask)              │
│    RESTful Endpoints                │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│    Service Layer                    │
│  Business Logic & Orchestration     │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│    ML Layer                         │
│  Feature Engineering & Similarity   │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│    Data Layer                       │
│  Data Loading & Preprocessing       │
└─────────────────────────────────────┘
```

---

## Mathematical Foundation

### TF-IDF Vectorization

**Term Frequency-Inverse Document Frequency (TF-IDF)** transforms textual data into numerical feature vectors by weighting terms based on their importance within documents and across the corpus.

#### 1. Term Frequency (TF)

Measures how frequently a term appears in a document:

$$
\text{TF}(t, d) = \frac{f_{t,d}}{\sum_{t' \in d} f_{t',d}}
$$

Where:

- $f_{t,d}$ = frequency of term $t$ in document $d$
- $\sum_{t' \in d} f_{t',d}$ = total number of terms in document $d$

#### 2. Inverse Document Frequency (IDF)

Measures the importance of a term across the entire corpus:

$$
\text{IDF}(t, D) = \log \left( \frac{N}{|\{d \in D : t \in d\}|} \right)
$$

Where:

- $N$ = total number of documents in corpus $D$
- $|\{d \in D : t \in d\}|$ = number of documents containing term $t$

#### 3. TF-IDF Score

The final TF-IDF weight combines both components:

$$
\text{TF-IDF}(t, d, D) = \text{TF}(t, d) \times \text{IDF}(t, D)
$$

#### 4. Document Vectorization

Each document $d$ is represented as a vector in high-dimensional space:

$$
\mathbf{v}_d = \begin{bmatrix}
\text{TF-IDF}(t_1, d, D) \\
\text{TF-IDF}(t_2, d, D) \\
\vdots \\
\text{TF-IDF}(t_n, d, D)
\end{bmatrix}
$$

Where $n$ is the vocabulary size (number of unique terms in the corpus).

**Implementation in System:**

Each song's textual features (track name, artist, genre) are concatenated and vectorized using TF-IDF. This creates a numerical representation that captures the semantic content of each song.

```python
# Pseudocode
text_features = song['track_name'] + ' ' + song['artist'] + ' ' + song['genre']
vectorizer = TfidfVectorizer(max_features=5000, ngram_range=(1,2))
tfidf_matrix = vectorizer.fit_transform(text_features)
```

---

### Cosine Similarity

**Cosine Similarity** measures the cosine of the angle between two non-zero vectors in multi-dimensional space, providing a metric of similarity independent of magnitude.

#### Mathematical Definition

For two vectors $\mathbf{A}$ and $\mathbf{B}$ in $n$-dimensional space:

$$
\text{cosine\_similarity}(\mathbf{A}, \mathbf{B}) = \frac{\mathbf{A} \cdot \mathbf{B}}{\|\mathbf{A}\| \|\mathbf{B}\|}
$$

#### Properties

- **Range:** $-1 \leq \text{cosine\_similarity}(\mathbf{A}, \mathbf{B}) \leq 1$
- **Magnitude Independence:** Focuses on orientation, not magnitude.

#### Geometric Interpretation

A smaller angle (closer to 0°) indicates higher similarity, while a larger angle (closer to 90°) indicates lower similarity.

#### Computational Example

Given:

- $\mathbf{A} = [3, 4, 0]$
- $\mathbf{B} = [4, 3, 0]$

$$
\mathbf{A} \cdot \mathbf{B} = 24 \\
\|\mathbf{A}\| = 5 \\
\|\mathbf{B}\| = 5 \\
\text{cosine\_similarity} = \frac{24}{25} = 0.96
$$

---

### Recommendation Algorithm

#### Stage 1: Feature Extraction

Transform raw song data into numerical representations:

$$
\mathbf{F}_{\text{song}} = [\mathbf{v}_{\text{TF-IDF}}, \mathbf{v}_{\text{audio}}]
$$

Where:

- $\mathbf{v}_{\text{TF-IDF}}$ = TF-IDF vector from textual features
- $\mathbf{v}_{\text{audio}}$ = normalized audio features (danceability, energy, valence, etc.)

#### Stage 2: Similarity Computation

For a query song $q$ and all songs in database $D$:

$$
\text{similarity}(q, s_i) = \text{cosine\_similarity}(\mathbf{F}_q, \mathbf{F}_{s_i}) \quad \forall s_i \in D
$$

#### Stage 3: Ranking and Filtering

- Rank songs by similarity score
- Remove duplicates and the query song itself
- Apply pagination

---

## Technical Stack

### Backend

- **Framework:** Flask 2.x
- **ML Libraries:** scikit-learn, pandas, numpy
- **Language:** Python 3.8+
- **API Style:** RESTful

### Frontend

- **Framework:** Next.js
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **HTTP Client:** Fetch API

### Data

- **Format:** CSV
- **Source:** Spotify Dataset

---

## System Architecture

### Backend Structure

```
backend/
├── api/
│   └── routes.py
├── app.py
├── core/
│   ├── config.py
│   └── exceptions.py
├── data/
│   └── spotify.csv
├── data_layer/
│   ├── data_loader.py
│   └── data_filter.py
├── ml/
│   ├── feature_engineering.py
│   ├── similarity_engine.py
│   └── text_vector_engine.py
├── services/
│   └── recommendation_service.py
└── requirements.txt
```

### Frontend Structure

```
frontend/
├── app/
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── Header.tsx
│   ├── RecommendationList.tsx
│   └── SongSearch.tsx
└── lib/
    └── api.ts
```

---

## Data Schema

| Column           | Type    | Description                           |
| ---------------- | ------- | ------------------------------------- |
| track_id         | string  | Unique identifier for the track       |
| artists          | string  | Artist name(s)                        |
| album_name       | string  | Album name                            |
| track_name       | string  | Song title                            |
| popularity       | int     | Popularity score (0-100)              |
| duration_ms      | int     | Track duration in milliseconds        |
| explicit         | boolean | Explicit content flag                 |
| danceability     | float   | Danceability score (0.0-1.0)          |
| energy           | float   | Energy level (0.0-1.0)                |
| key              | int     | Musical key (0-11)                    |
| loudness         | float   | Loudness in dB                        |
| mode             | int     | Modality (0=minor, 1=major)           |
| speechiness      | float   | Presence of spoken words (0.0-1.0)    |
| acousticness     | float   | Acoustic quality (0.0-1.0)            |
| instrumentalness | float   | Instrumental content (0.0-1.0)        |
| liveness         | float   | Live performance likelihood (0.0-1.0) |
| valence          | float   | Musical positivity (0.0-1.0)          |
| tempo            | float   | Beats per minute (BPM)                |
| time_signature   | int     | Time signature (beats per measure)    |
| track_genre      | string  | Genre classification                  |

---

## Installation & Setup

### Prerequisites

- Python 3.8 or higher
- Node.js 16.x or higher
- npm or yarn package manager

### Backend Setup

1. **Clone the repository:**

   ```bash
   git clone <repository-url>
   cd music-recommendation-system/backend
   ```

2. **Create virtual environment:**

   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install dependencies:**

   ```bash
   pip install -r requirements.txt
   ```

4. **Configure environment variables:**

   ```bash
   export FLASK_APP=app.py
   export FLASK_ENV=development
   ```

5. **Run the application:**

   ```bash
   flask run
   ```

   The API will be available at `http://localhost:5000`

### Frontend Setup

1. **Navigate to frontend directory:**

   ```bash
   cd music-recommendation-system/frontend
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Configure API endpoint:**
   Edit `lib/api.ts` to point to your backend URL

4. **Run development server:**

   ```bash
   npm run dev
   ```

   The application will be available at `http://localhost:3000`

---

## API Reference

### Endpoints

#### 1. Search Songs

**Endpoint:** `GET /search`

**Description:** Search for songs by title, artist, or genre

**Query Parameters:**

- `q` (string, required): Search query

**Response:**

```json
[
  {
    "track_name": "string",
    "artist": "string",
    "album": "string",
    "genre": "string",
    "popularity": 85,
    "score": 0.95
  }
]
```

#### 2. Get Recommendations

**Endpoint:** `POST /recommend`

**Description:** Get song recommendations based on a selected track

**Request Body:**

```json
{
  "song": "string",
  "page": 1,
  "per_page": 10
}
```

**Response:**

```json
{
  "recommendations": [
    {
      "track_name": "string",
      "artist": "string",
      "album": "string",
      "genre": "string",
      "popularity": 85,
      "score": 0.89
    }
  ],
  "page": 1,
  "per_page": 10
}
```

---

## Performance Optimization

### Backend Optimizations

- TF-IDF matrix cached in memory
- Efficient numpy operations for similarity computation

### Frontend Optimizations

- API response caching per song and page
- Skeleton loading
