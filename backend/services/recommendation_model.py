import psycopg2
import json
import logging
import sys
from sklearn.ensemble import RandomForestRegressor
import numpy as np
from sklearn.preprocessing import MultiLabelBinarizer, MinMaxScaler
from sklearn.metrics.pairwise import cosine_similarity

import os

# Database connection configuration
# DB_CONFIG = {
#     "dbname": "postgres",
#     "user": "henil",
#     "password": "root",
#     "host": "localhost",
#     "port": "5432"
# }

def get_db_config():
    database_url = os.getenv("DATABASE_URL")
    if not database_url:
        raise ValueError("DATABASE_URL environment variable is not set")
    
    try:
        # Parse database URL
        user = database_url.split("://")[1].split(":")[0]
        password = database_url.split("://")[1].split(":")[1].split("@")[0]
        host = database_url.split("@")[1].split(":")[0]
        port = database_url.split(":")[-1].split("/")[0]
        dbname = database_url.split("/")[-1].split("?")[0]
        
        return {
            "dbname": dbname,
            "user": user,
            "password": password,
            "host": host,
            "port": port
        }
    except Exception as e:
        logging.error(f"Error parsing DATABASE_URL: {e}")
        raise ValueError("Invalid DATABASE_URL format")

try:
    DB_CONFIG = get_db_config()
    logging.info("Database configuration loaded successfully")
except Exception as e:
    logging.error(f"Failed to load database configuration: {e}")
    sys.exit(1)

def get_role_id_by_user_id(user_id: str, role: str) -> str:
    try:
        conn = psycopg2.connect(**DB_CONFIG)
        cursor = conn.cursor()
        if role == 'mentee':
            query = 'SELECT id FROM "ZenSchema"."mentee" WHERE user_id = %s'
        elif role == 'mentor':
            query = 'SELECT id FROM "ZenSchema"."mentor" WHERE user_id = %s'
        else:
            raise ValueError("Role must be 'mentee' or 'mentor'.")
        cursor.execute(query, (user_id,))
        result = cursor.fetchone()
        if result:
            return result[0]
        else:
            raise ValueError(f"No {role}_id found for user_id: {user_id}")
    except Exception as e:
        logging.error(f"Error fetching {role}_id: {e}")
        raise
    finally:
        cursor.close()
        conn.close()

def get_language_by_role_id(role_id: str, role: str) -> str:
    try:
        conn = psycopg2.connect(**DB_CONFIG)
        cursor = conn.cursor()
        if role == 'mentee':
            query = 'SELECT language FROM "ZenSchema"."User" WHERE id = (SELECT user_id FROM "ZenSchema"."mentee" WHERE id = %s)'
        elif role == 'mentor':
            query = 'SELECT language FROM "ZenSchema"."User" WHERE id = (SELECT user_id FROM "ZenSchema"."mentor" WHERE id = %s)'
        else:
            raise ValueError("Role must be 'mentee' or 'mentor'.")
        cursor.execute(query, (role_id,))
        result = cursor.fetchone()
        if result:
            return result[0]
        else:
            return None
    except Exception as e:
        logging.error(f"Error fetching language for {role} ID {role_id}: {e}")
        raise
    finally:
        cursor.close()
        conn.close()

def get_interests_by_mentee_id(mentee_id: str) -> list:
    try:
        conn = psycopg2.connect(**DB_CONFIG)
        cursor = conn.cursor()
        query = """
            SELECT t.tag_name
            FROM "ZenSchema"."tags" t
            JOIN "ZenSchema"."_MenteeTags" mt ON t.tag_id = "mt"."B"
            JOIN "ZenSchema"."mentee" m ON "mt"."A" = m.id
            WHERE m.id = %s
        """
        cursor.execute(query, (mentee_id,))
        interests = cursor.fetchall()
        return [i[0] for i in interests]
    except Exception as e:
        logging.error(f"Error fetching mentee interests: {e}")
        raise
    finally:
        cursor.close()
        conn.close()

def get_expertise_by_mentor_id(mentor_id: str) -> list:
    try:
        conn = psycopg2.connect(**DB_CONFIG)
        cursor = conn.cursor()
        query = """
            SELECT t.tag_name
            FROM "ZenSchema"."tags" t
            JOIN "ZenSchema"."_MentorTags" mt ON t.tag_id = "mt"."B"
            JOIN "ZenSchema"."mentor" m ON "mt"."A" = m.id
            WHERE m.id = %s
        """
        cursor.execute(query, (mentor_id,))
        expertise = cursor.fetchall()
        return [e[0] for e in expertise]
    except Exception as e:
        logging.error(f"Error fetching mentor expertise: {e}")
        raise
    finally:
        cursor.close()
        conn.close()

def fetch_all_tags():
    try:
        conn = psycopg2.connect(**DB_CONFIG)
        cursor = conn.cursor()
        query = 'SELECT tag_id, tag_name FROM "ZenSchema"."tags"'
        cursor.execute(query)
        tag_data = cursor.fetchall()
        return {tag_id: tag_name for tag_id, tag_name in tag_data}
    except Exception as e:
        logging.error(f"Error fetching tags: {e}")
        raise
    finally:
        cursor.close()
        conn.close()

def fetch_mentor_data():
    try:
        conn = psycopg2.connect(**DB_CONFIG)
        cursor = conn.cursor()
        query = """
            SELECT 
                m.id AS mentor_id, 
                m.experience_years,
                m.rating,
                m.number_of_mentees_mentored,
                m.number_of_sessions,
                ARRAY_AGG(t.tag_name) AS skills,
                u.language as language
            FROM "ZenSchema"."mentor" m
            LEFT JOIN "ZenSchema"."_MentorTags" mt ON m.id = "mt"."A"
            LEFT JOIN "ZenSchema"."tags" t ON "mt"."B" = t.tag_id
            LEFT JOIN "ZenSchema"."User" u ON m.user_id = u.id
            GROUP BY m.id, m.experience_years, m.rating, m.number_of_mentees_mentored, m.number_of_sessions, u.language
        """
        cursor.execute(query)
        mentors = cursor.fetchall()
        result = []
        for mentor_id, exp, rating, num_mentees, num_sessions, skills, language in mentors:
            filtered_skills = [s for s in skills if s is not None] if skills else []
            result.append({
                "mentor_id": mentor_id,
                "experience_years": exp,
                "rating": rating if rating is not None else 0,
                "number_of_mentees_mentored": num_mentees,
                "number_of_sessions": num_sessions,
                "skills": filtered_skills,
                "language": language
            })
        return result
    except Exception as e:
        logging.error(f"Error fetching mentor data: {e}")
        raise
    finally:
        cursor.close()
        conn.close()

def get_session_metrics():
    try:
        conn = psycopg2.connect(**DB_CONFIG)
        cursor = conn.cursor()
        query = """
            SELECT 
                ms.mentor_id,
                SUM(CASE WHEN sb.status::text = 'completed' THEN 1 ELSE 0 END) AS completed,
                SUM(CASE WHEN sb.status::text != 'available' THEN 1 ELSE 0 END) AS total,
                SUM(CASE WHEN sb.status::text = 'available' THEN 1 ELSE 0 END) AS available
            FROM "ZenSchema"."SessionBooking" sb
            JOIN "ZenSchema"."MentorSession" ms ON sb.session_id = ms.id
            GROUP BY ms.mentor_id
        """
        cursor.execute(query)
        rows = cursor.fetchall()
        metrics = {}
        for mentor_id, completed, total, available in rows:
            metrics[mentor_id] = {
                "completed": completed or 0,
                "total": total or 0,
                "available": available or 0
            }
        return metrics
    except Exception as e:
        logging.error(f"Error fetching session metrics: {e}")
        raise
    finally:
        cursor.close()
        conn.close()

def build_candidate_features(candidate, mlb, mentee_interest_vector, session_metrics, current_language):
    rating = candidate.get("rating", 0)
    num_mentees = candidate.get("number_of_mentees_mentored", 0)
    num_sessions = candidate.get("number_of_sessions", 0)
    
    metrics = session_metrics.get(candidate["mentor_id"], {"completed": 0, "total": 0, "available": 0})
    completed = metrics.get("completed", 0)
    total = metrics.get("total", 0)
    available = metrics.get("available", 0)
    
    session_completion_ratio = completed / total if total > 0 else 0
    mentor_availability = available
    candidate_language = candidate.get("language", None)
    language_feature = 1 if candidate_language and current_language and candidate_language.lower() == current_language.lower() else 0
    
    candidate_skills = candidate.get("skills", [])
    similarity = cosine_similarity(mentee_interest_vector, mlb.transform([candidate_skills]))[0][0]
    
    return [
        rating,
        num_mentees,
        num_sessions,
        session_completion_ratio,
        mentor_availability,
        language_feature,
        similarity
    ]

def generate_recommendations_rf(input_tags: list, role_id: str, current_language: str, top_n: int = 5, exclude_current: bool = False):
    if not input_tags:
        logging.info("No expertise provided; returning empty recommendations.")
        return []
    try:
        all_tags = list(set(fetch_all_tags().values()))
        mentor_list = fetch_mentor_data()
        if exclude_current:
            mentor_list = [mentor for mentor in mentor_list if mentor["mentor_id"] != role_id]
        if not all_tags or not mentor_list:
            return []
        
        session_metrics = get_session_metrics()
        mlb = MultiLabelBinarizer(classes=all_tags)
        mentor_skills_list = [mentor["skills"] for mentor in mentor_list]
        mlb.fit(mentor_skills_list)
        
        input_encoded = mlb.transform([input_tags])
        mentor_encoded = mlb.transform(mentor_skills_list)
        cos_sim_matrix = cosine_similarity(input_encoded, mentor_encoded)
        
        experience_years = [mentor["experience_years"] for mentor in mentor_list]
        scaler = MinMaxScaler()
        normalized_experience = scaler.fit_transform(np.array(experience_years).reshape(-1, 1))
        
        initial_scores = []
        for idx, score in enumerate(cos_sim_matrix[0]):
            weighted_score = 0.7 * score + 0.3 * normalized_experience[idx][0] if score > 0.5 else 0
            initial_scores.append(weighted_score)
        
        # Filter candidates with initial score > 0.5 and take top 10
        mentor_candidates = list(zip(mentor_list, initial_scores))
        filtered_candidates = [item for item in mentor_candidates if item[1] > 0.5]
        top_candidates = [item[0] for item in sorted(filtered_candidates, key=lambda x: x[1], reverse=True)[:10]]
        
        features = np.array([build_candidate_features(candidate, mlb, input_encoded, session_metrics, current_language) for candidate in top_candidates])
        feature_scaler = MinMaxScaler()
        features_normalized = feature_scaler.fit_transform(features)
        
        # Composite target using weights for each feature
        weights = np.array([0.10,0.10,0.10,0.20,0.15,0.10,0.25])
        composite_target = features_normalized.dot(weights)
        
        rf_model = RandomForestRegressor(n_estimators=120,random_state=50)
        rf_model.fit(features_normalized, composite_target)
        importances = rf_model.feature_importances_
        logging.info("Feature importances from RF model:")
        for name, imp in zip(["rating", "number_of_mentees_mentored", "number_of_sessions",
                              "session_completion_ratio", "mentor_availability", "language_feature", "similarity"], importances):
            logging.info(f"{name}: {imp}")
        
        refined_scores = rf_model.predict(features_normalized)
        candidates = [{"mentor_id": candidate["mentor_id"], "rf_score": score} for candidate, score in zip(top_candidates, refined_scores)]
        recommendations = sorted(candidates, key=lambda x: x["rf_score"], reverse=True)[:top_n]
        logging.info(f"Final recommendations: {recommendations}")
        return recommendations
    except Exception as e:
        logging.error(f"Error generating RF-based recommendations: {e}")
        raise

if __name__ == "__main__":
    if len(sys.argv) < 3:
        print(json.dumps({"error": "Invalid usage"}))
        sys.exit(1)
    
    user_type = sys.argv[1]  # 'mentee' or 'mentor'
    user_id = sys.argv[2]
    
    try:
        if user_type == 'mentee':
            mentee_id = get_role_id_by_user_id(user_id, 'mentee')
            mentee_language = get_language_by_role_id(mentee_id, 'mentee')
            interests = get_interests_by_mentee_id(mentee_id)
            recommendations = generate_recommendations_rf(interests, mentee_id, mentee_language)
            print(json.dumps({"recommendations": recommendations}, indent=4))
        elif user_type == 'mentor':
            mentor_id = get_role_id_by_user_id(user_id, 'mentor')
            mentor_language = get_language_by_role_id(mentor_id, 'mentor')
            expertise = get_expertise_by_mentor_id(mentor_id)
            recommendations = generate_recommendations_rf(expertise, mentor_id, mentor_language, exclude_current=True)
            print(json.dumps({"recommendations": recommendations}, indent=4))
        else:
            raise ValueError("Invalid user type. Use 'mentee' or 'mentor'.")
    except Exception as e:
        logging.error(f"Error in main execution: {e}")
        print(json.dumps({"error": str(e)}))
