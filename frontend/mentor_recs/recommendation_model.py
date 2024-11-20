import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import sys
import json
import os

# Step 1: Load the CSV files
# Use relative paths to the `data` directory
current_dir = os.path.dirname(os.path.abspath(__file__))
mentors_path = os.path.join(current_dir, '../data/updated_mentors_dataset.csv')
mentees_path = os.path.join(current_dir, '../data/mentees_dataset_numeric_ids.csv')

mentors = pd.read_csv(mentors_path)
mentees = pd.read_csv(mentees_path)

# Step 2: Combine mentor skills into a single column
mentors['combined_skills'] = mentors['Primary_Skill'] + ', ' + mentors['Secondary_Skills']

# Step 3: Function to generate recommendations for a mentee
# Step 8: Return only the Mentor_IDs as a JSON object
def recommend_mentors(mentee_id, top_n=5):
    # Ensure mentee_id is treated as an integer
    mentee_id = int(mentee_id)  # Convert mentee_id to integer

    # Extract the mentee's interests
    mentee = mentees[mentees['Mentee_ID'] == mentee_id]
    if mentee.empty:
        return {"error": f"No mentee found with ID: {mentee_id}"}

    mentee_combined_interests = (
        mentee['Primary_Interest'].iloc[0] + ', ' + mentee['Secondary_Interests'].iloc[0]
    )

    # Step 4: Vectorize mentor skills and mentee interests using TF-IDF
    vectorizer = TfidfVectorizer()
    tfidf_matrix = vectorizer.fit_transform(
        [mentee_combined_interests] + mentors['combined_skills'].tolist()
    )

    # Step 5: Calculate cosine similarity
    similarity_scores = cosine_similarity(tfidf_matrix[0:1], tfidf_matrix[1:]).flatten()

    # Step 6: Add similarity scores to mentors DataFrame
    mentors['similarity'] = similarity_scores

    # Step 7: Sort mentors by similarity and experience
    recommendations = mentors.sort_values(by=['similarity', 'Experience'], ascending=[False, False])

    # Step 8: Return only Mentor_IDs
    top_mentors = recommendations.head(top_n)['Mentor_ID']
    return top_mentors.tolist()  # Convert to a list for JSON output

if __name__ == "__main__":
    # Get mentee ID and top N from command-line arguments
    if len(sys.argv) < 2:
        print(json.dumps({"error": "No mentee ID provided"}))
        sys.exit(1)

    mentee_id = sys.argv[1]
    top_n = int(sys.argv[2]) if len(sys.argv) > 2 else 5  # Default to 5 recommendations

    # Generate recommendations
    recommendations = recommend_mentors(mentee_id, top_n)

    # Print recommendations as JSON for the backend to process
    print(json.dumps(recommendations))
