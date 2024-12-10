import psycopg2
import json
import logging
import sys
from sklearn.preprocessing import MultiLabelBinarizer, MinMaxScaler
from sklearn.metrics.pairwise import cosine_similarity

# Configure logging
logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s")

# Database connection configuration
DB_CONFIG = {
    "dbname": "SIH",
    "user": "postgres",
    "password": "2580",
    "host": "localhost",
    "port": "5432"
}

def get_interests_by_mentee_id(mentee_id: str) -> list:
    logging.info(f"Fetching interests for mentee ID: {mentee_id}")
    conn = psycopg2.connect(**DB_CONFIG)
    cursor = conn.cursor()
    try:
        query = """
            SELECT t.tag_name
            FROM "ZenSchema"."tags" t
            JOIN "ZenSchema"."_MenteeTags" mt ON t.tag_id = "mt"."B"
            JOIN "ZenSchema"."mentee" m ON "mt"."A" = m.id
            WHERE m.id = %s
        """
        cursor.execute(query, (mentee_id,))
        interests = cursor.fetchall()
        if not interests:
            logging.warning(f"No interests found for mentee ID: {mentee_id}")
        logging.info(f"Fetched interests for mentee ID {mentee_id}: {[interest[0] for interest in interests]}")
        return [interest[0] for interest in interests]
    except Exception as e:
        logging.error(f"Error fetching mentee interests: {e}")
        raise
    finally:
        cursor.close()
        conn.close()

def get_expertise_by_mentor_id(mentor_id: str) -> list:
    logging.info(f"Fetching expertise for mentor ID: {mentor_id}")
    conn = psycopg2.connect(**DB_CONFIG)
    cursor = conn.cursor()
    try:
        query = """
            SELECT t.tag_name
            FROM "ZenSchema"."tags" t
            JOIN "ZenSchema"."_MentorTags" mt ON t.tag_id = "mt"."B"
            JOIN "ZenSchema"."mentor" m ON "mt"."A" = m.id
            WHERE m.id = %s
        """
        cursor.execute(query, (mentor_id,))
        expertise = cursor.fetchall()
        if not expertise:
            logging.warning(f"No expertise found for mentor ID: {mentor_id}")
        logging.info(f"Fetched expertise for mentor ID {mentor_id}: {[skill[0] for skill in expertise]}")
        return [skill[0] for skill in expertise]
    except Exception as e:
        logging.error(f"Error fetching mentor expertise: {e}")
        raise
    finally:
        cursor.close()
        conn.close()

def fetch_mentor_data():
    """
    Fetch all mentors' data including skills and experience.
    """
    logging.info("Fetching mentor data from the database.")
    conn = psycopg2.connect(**DB_CONFIG)
    cursor = conn.cursor()
    try:
        query = """
            SELECT 
                m.id AS mentor_id, 
                m.experience_years, 
                ARRAY_AGG(t.tag_name) AS skills
            FROM "ZenSchema"."mentor" m
            LEFT JOIN "ZenSchema"."_MentorTags" mt ON m.id = "mt"."A"
            LEFT JOIN "ZenSchema"."tags" t ON "mt"."B" = t.tag_id
            GROUP BY m.id, m.experience_years
        """
        cursor.execute(query)
        mentors = cursor.fetchall()
        if not mentors:
            logging.warning("No mentor data found.")
        logging.info(f"Fetched mentor data: {mentors}")
        return [
            {"mentor_id": mentor_id, "experience_years": experience_years, "skills": skills}
            for mentor_id, experience_years, skills in mentors
        ]
    except Exception as e:
        logging.error(f"Error fetching mentor data: {e}")
        raise
    finally:
        cursor.close()
        conn.close()

def fetch_all_tags():
    """
    Fetch all unique tags from the database.
    """
    logging.info("Fetching all tags from the database.")
    conn = psycopg2.connect(**DB_CONFIG)
    cursor = conn.cursor()
    try:
        query = 'SELECT tag_id, tag_name FROM "ZenSchema"."tags"'
        cursor.execute(query)
        tag_data = cursor.fetchall()
        if not tag_data:
            logging.warning("No tags found in the database.")
        logging.info(f"Fetched all tags: {tag_data}")
        return {tag_id: tag_name for tag_id, tag_name in tag_data}
    except Exception as e:
        logging.error(f"Error fetching tags: {e}")
        raise
    finally:
        cursor.close()
        conn.close()

def generate_recommendations(input_tags: list, top_n: int = 5):
    """
    Generates recommendations by matching input tags to mentors' skills.
    """
    logging.info(f"Generating recommendations for input tags: {input_tags}")
    try:
        all_tags = list(set(fetch_all_tags().values()))
        mentor_list = fetch_mentor_data()

        if not all_tags or not mentor_list:
            logging.warning("Insufficient data to generate recommendations.")
            return []

        mlb = MultiLabelBinarizer(classes=all_tags)
        input_encoded = mlb.fit_transform([input_tags])
        mentor_encoded = mlb.transform([mentor["skills"] for mentor in mentor_list])

        logging.info("Encoded input and mentor skills using MultiLabelBinarizer.")

        cos_sim_matrix = cosine_similarity(input_encoded, mentor_encoded)

        logging.info(f"Calculated cosine similarity matrix: {cos_sim_matrix}")

        experience_years = [mentor["experience_years"] for mentor in mentor_list]
        scaler = MinMaxScaler()
        normalized_experience = scaler.fit_transform([[exp] for exp in experience_years])

        logging.info(f"Normalized mentor experience: {normalized_experience}")

        similarity_scores = cos_sim_matrix[0]
        recommendations = []

        for idx, score in enumerate(similarity_scores):
            if score > 0.5:
                weighted_score = 0.7 * score + 0.3 * normalized_experience[idx][0]
                recommendations.append({
                    "mentor_id": mentor_list[idx]["mentor_id"],
                    "score": weighted_score
                })

        logging.info(f"Generated recommendations: {recommendations}")
        return sorted(recommendations, key=lambda x: x["score"], reverse=True)[:top_n]
    except Exception as e:
        logging.error(f"Error generating recommendations: {e}")
        raise

if __name__ == "__main__":
    if len(sys.argv) < 3:
        print(json.dumps({"error": "Invalid usage"}))
        sys.exit(1)

    user_type = sys.argv[1]  # 'mentee' or 'mentor'
    user_id = sys.argv[2]

    try:
        if user_type == 'mentee':
            interests = get_interests_by_mentee_id(user_id)
            recommendations = generate_recommendations(interests)
            logging.info(f"Final recommendations for mentee ID {user_id}: {recommendations}")
            print(json.dumps({"recommendations": recommendations}, indent=4))
        elif user_type == 'mentor':
            expertise = get_expertise_by_mentor_id(user_id)
            recommendations = generate_recommendations(expertise)
            logging.info(f"Final recommendations for mentor ID {user_id}: {recommendations}")
            print(json.dumps({"recommendations": recommendations}, indent=4))
        else:
            raise ValueError("Invalid user type. Use 'mentee' or 'mentor'.")
    except Exception as e:
        logging.error(f"Error in main execution: {e}")
        print(json.dumps({"error": str(e)}))
