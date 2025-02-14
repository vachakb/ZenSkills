import psycopg2
import pandas as pd
import json
from sklearn.preprocessing import MultiLabelBinarizer, MinMaxScaler
from sklearn.metrics.pairwise import cosine_similarity
import os
import sys

# Database connection configuration
DB_CONFIG = {
    "dbname": "postgres",
    "user": "henil",
    "password": "root",
    "host": "localhost",
    "port": "5432"
}

def fetch_all_tags():
    conn = psycopg2.connect(**DB_CONFIG)
    cursor = conn.cursor()
    cursor.execute('SELECT tag_id, tag_name FROM "ZenSchema"."tags"')
    tag_data = cursor.fetchall()
    cursor.close()
    conn.close()
    return {tag_id: tag_name for tag_id, tag_name in tag_data}

def fetch_mentor_data():
    conn = psycopg2.connect(**DB_CONFIG)
    cursor = conn.cursor()
    cursor.execute("""
        SELECT 
            m.id as mentor_id,
            m.experience_years,
            m.experience_months,
            m.rating,
            m.number_of_mentees_mentored,
            m.company,
            m.mentor_job_title,
            m.credit_score,
            ARRAY_AGG(t.tag_name) AS skills
        FROM "ZenSchema"."mentor" m
        JOIN "ZenSchema"."_MentorTags" mt ON m.id = mt."A"
        JOIN "ZenSchema"."tags" t ON t.tag_id = mt."B"
        WHERE m.credit_score >= 60
        GROUP BY m.id, m.experience_years, m.experience_months, 
                 m.rating, m.number_of_mentees_mentored, 
                 m.company, m.mentor_job_title, m.credit_score
    """)
    mentors = cursor.fetchall()
    cursor.close()
    conn.close()
    return [
        {
            "mentor_id": mentor_id,
            "experience_years": experience_years,
            "experience_months": experience_months,
            "rating": rating,
            "mentees_mentored": mentees_mentored,
            "company": company,
            "job_title": job_title,
            "credit_score": credit_score,
            "skills": skills
        }
        for (mentor_id, experience_years, experience_months, rating,
             mentees_mentored, company, job_title, credit_score, skills) in mentors
    ]

def generate_recommendations(interests: list):
    all_tags = list(set(fetch_all_tags().values()))
    mentor_list = fetch_mentor_data()

    mlb = MultiLabelBinarizer(classes=all_tags)
    interests_encoded = mlb.fit_transform([interests])
    mentor_encoded = mlb.transform([mentor["skills"] for mentor in mentor_list])

    cos_sim_matrix = cosine_similarity(interests_encoded, mentor_encoded)

    experience_years = [mentor["experience_years"] for mentor in mentor_list]
    scaler = MinMaxScaler()
    normalized_experience = scaler.fit_transform([[exp] for exp in experience_years])

    similarity_scores = cos_sim_matrix[0]
    recommendations = []

    for idx, score in enumerate(similarity_scores):
        if score > 0.6:  # Changed threshold from 0.5 to 0.6
            weighted_score = 0.7 * score + 0.3 * normalized_experience[idx][0]
            recommendations.append({
                "mentor_id": mentor_list[idx]["mentor_id"],
                "score": weighted_score
            })

    recommendations = sorted(recommendations, key=lambda x: x["score"], reverse=True)
    return recommendations

if __name__ == "__main__":
    try:
        if len(sys.argv) < 2:
            raise ValueError("Interests are required (comma-separated list)")
        
        interests = sys.argv[1].split(", ")
        recommendations = generate_recommendations(interests)  # Removed top_n parameter
        print(json.dumps({"recommendations": recommendations}))
    except Exception as e:
        print(json.dumps({"error": str(e)}))
