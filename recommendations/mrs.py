import os
import ast
import pandas as pd
import numpy as np
from sklearn.metrics.pairwise import cosine_similarity, euclidean_distances
from sklearn.feature_extraction.text import TfidfVectorizer

# Load and preprocess data
def load_and_preprocess_data():
    credits = pd.read_csv("credits.csv")
    keywords = pd.read_csv("keywords.csv")
    movies = pd.read_csv("movies_metadata.csv")

    # Process credits
    def extract_actors(obj):
        return [a["name"] for a in ast.literal_eval(obj)[:3]]

    def extract_director(obj):
        for a in ast.literal_eval(obj):
            if a["job"] == "Director":
                return a["name"]
        return ""

    credits["cast"] = credits["cast"].apply(extract_actors)
    credits["directer"] = credits["crew"].apply(extract_director)

    # Clean names
    credits["cast"] = credits["cast"].apply(lambda x: [a.replace(" ", "").lower() for a in x])
    credits["directer"] = credits["directer"].str.lower().str.replace(" ", "")
    credits = credits[["id", "cast", "directer"]]

    # Process keywords
    keywords["keywords"] = keywords["keywords"].apply(lambda x: [a['name'] for a in ast.literal_eval(x)])
    keywords = credits.merge(keywords, on="id")

    # Process movies
    def extract_genres(obj):
        return [a["name"].lower() for a in ast.literal_eval(obj)]

    movies = movies[["id", "original_title", "overview", "genres", "original_language"]]
    movies["genres"] = movies["genres"].apply(extract_genres)
    movies["overview"] = movies["overview"].astype(str).apply(lambda x: x.lower().split())
    movies["original_title"] = movies["original_title"].str.lower().str.replace(" ", "")
    movies = movies.merge(keywords, on="id", how="inner")
    movies["tags"] = movies["genres"] + movies["cast"] + movies["overview"] + movies["keywords"]
    movies["tags"] = movies["tags"].apply(lambda x: " ".join(x))
    movies["tags"] = movies["original_title"] + " " + movies["directer"] + " " + movies["tags"]

    return movies

def compute_tfidf():
    file_path = 'tfidf_df.csv'
    if os.path.exists(file_path):
        print("File found! Loading TF-IDF DataFrame...")
        tfidf_df = pd.read_csv(file_path)
        movies = load_and_preprocess_data()
        return tfidf_df, movies
    
    movies = load_and_preprocess_data()
    vectorizer = TfidfVectorizer(max_features=10000, stop_words="english")
    tfidf_matrix = vectorizer.fit_transform(movies["tags"])
    tfidf_df = pd.DataFrame(tfidf_matrix.toarray(), columns=vectorizer.get_feature_names_out())
    tfidf_df["id"] = movies["id"].values
    tfidf_df.to_csv('tfidf_df.csv', index=False)
    return tfidf_df, movies

def recommend_movies(titles, lang, filter_type, filter_value, movies, tfidf_df, output_file):
    lang_to_lag = {
        "English": "en", "French": "fr", "Italian": "it", "Japanese": "ja",
        "German": "de", "Spanish": "es", "Russian": "ru", "Hindi": "hi",
        "Korean": "ko", "Chinese": "zh", "skip": "skip"
    }
    lang = lang_to_lag.get(lang, "skip")
    titles = [title.replace(" ", "").lower() for title in titles.split(",")]

    if not titles:
        print("No movie titles provided.")
        return

    title_to_id = dict(zip(movies['original_title'], movies['id']))
    ids = [title_to_id.get(title) for title in titles if title in title_to_id]

    if not ids:
        print("Provided movie titles not found in the database.")
        return

    # Compute centroid vector
    centroid = tfidf_df.loc[tfidf_df['id'].isin(ids)].mean().to_frame().T
    query_vector = centroid.iloc[:, 1:].values
    other_vectors = tfidf_df.iloc[:, 1:].values

    # Find nearest neighbors
    distances = euclidean_distances(query_vector, other_vectors)
    k_indices = np.argsort(distances[0])[:100]
    rec_ids = tfidf_df.iloc[k_indices]["id"].values

    rec_movies = movies[movies["id"].isin(rec_ids)]

    # Apply language filter
    if lang != "skip":
        rec_movies = rec_movies[rec_movies["original_language"] == lang]

    # Apply additional filters (genre, director, actor)
    if filter_type == "genre" and filter_value != "skip":
        rec_movies = rec_movies[rec_movies["genres"].apply(lambda x: filter_value in x)]
    elif filter_type == "director" and filter_value != "skip":
        rec_movies = rec_movies[rec_movies["directer"] == filter_value]
    elif filter_type == "actor" and filter_value != "skip":
        rec_movies = rec_movies[rec_movies["cast"].apply(lambda x: filter_value in x)]

    rec_titles = rec_movies["original_title"].head(10).tolist()
    for rec in rec_titles:
        print(rec)
    

# Load and preprocess
# movies = load_and_preprocess_data()
tfidf_df, movies = compute_tfidf()

# Make recommendations and save to file
recommend_movies(
    titles="Harry Potter and the Prisoner of Azkaban,Iron Man",
    lang="English",
    filter_type="genre",
    filter_value="skip",
    movies=movies,
    tfidf_df=tfidf_df,
    output_file="recommendations.txt"
)

# Script to read and display recommendations
def display_recommendations(file_path):
    if os.path.exists(file_path):
        with open(file_path, "r") as f:
            recommendations = f.readlines()
        print("Recommended Movies:")
        for rec in recommendations:
            print(rec.strip())
    else:
        print(f"No recommendations found at {file_path}")

# Display recommendations
display_recommendations("recommendations.txt")
