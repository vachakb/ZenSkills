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

def get_role_id_by_user_id(user_id: str, role: str) -> str:
    """
    Fetch mentor_id or mentee_id using user_id based on the role.
    """
    logging.info(f"Fetching {role}_id for user ID: {user_id}")
    conn = psycopg2.connect(**DB_CONFIG)
    cursor = conn.cursor()
    try:
        if role == 'mentee':
            query = 'SELECT id FROM "ZenSchema"."mentee" WHERE user_id = %s'
        elif role == 'mentor':
            query = 'SELECT id FROM "ZenSchema"."mentor" WHERE user_id = %s'
        else:
            raise ValueError("Role must be 'mentee' or 'mentor'.")

        cursor.execute(query, (user_id,))
        result = cursor.fetchone()
        if result:
            logging.info(f"Found {role}_id: {result[0]} for user_id: {user_id}")
            return result[0]
        else:
            raise ValueError(f"No {role}_id found for user_id: {user_id}")
    except Exception as e:
        logging.error(f"Error fetching {role}_id: {e}")
        raise
    finally:
        cursor.close()
        conn.close()


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
        return [interest[0] for interest in interests]
    except Exception as e:
        logging.error(f"Error fetching mentee interests: {e}")
        raise
    finally:
        cursor.close()
        conn.close()


def get_expertise_by_mentor_id(mentor_id: str) -> list:
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
        return [skill[0] for skill in expertise]
    except Exception as e:
        logging.error(f"Error fetching mentor expertise: {e}")
        raise
    finally:
        cursor.close()
        conn.close()


def fetch_mentor_data():
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
    conn = psycopg2.connect(**DB_CONFIG)
    cursor = conn.cursor()
    try:
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


def generate_recommendations(input_tags: list, user_role: str, user_id: str, top_n: int = 5):
    logging.info(f"Generating recommendations for input tags: {input_tags}")
    try:
        all_tags = list(set(fetch_all_tags().values()))
        mentor_list = fetch_mentor_data()

        if not all_tags or not mentor_list:
            logging.warning("Insufficient data to generate recommendations.")
            return []

        # Exclude the requesting mentor if the user is a mentor
        if user_role == 'mentor':
            mentor_list = [mentor for mentor in mentor_list if mentor["mentor_id"] != user_id]

        mlb = MultiLabelBinarizer(classes=all_tags)
        input_encoded = mlb.fit_transform([input_tags])
        mentor_encoded = mlb.transform([mentor["skills"] for mentor in mentor_list])

        cos_sim_matrix = cosine_similarity(input_encoded, mentor_encoded)

        experience_years = [mentor["experience_years"] for mentor in mentor_list]
        scaler = MinMaxScaler()
        normalized_experience = scaler.fit_transform([[exp] for exp in experience_years])

        recommendations = []
        for idx, score in enumerate(cos_sim_matrix[0]):
            if score > 0.5:
                weighted_score = 0.7 * score + 0.3 * normalized_experience[idx][0]
                recommendations.append({
                    "mentor_id": mentor_list[idx]["mentor_id"],
                    "score": weighted_score
                })

        return sorted(recommendations, key=lambda x: x["score"], reverse=True)[:top_n]
    except Exception as e:
        logging.error(f"Error generating recommendations: {e}")
        raise


if __name__ == "__main__":
    if len(sys.argv) < 3:
        print(json.dumps({"error": "Invalid usage"}))
        sys.exit(1)

    user_type = sys.argv[1]
    user_id = sys.argv[2]

    try:
        role_id = get_role_id_by_user_id(user_id, user_type)

        if user_type == 'mentee':
            interests = get_interests_by_mentee_id(role_id)
            recommendations = generate_recommendations(interests, user_type, role_id)
            print(json.dumps({"recommendations": recommendations}, indent=4))
        elif user_type == 'mentor':
            expertise = get_expertise_by_mentor_id(role_id)
            recommendations = generate_recommendations(expertise, user_type, role_id)
            print(json.dumps({"recommendations": recommendations}, indent=4))

        else:
            raise ValueError("Invalid user type. Use 'mentee' or 'mentor'.")
    except Exception as e:
        logging.error(f"Error in main execution: {e}")
        print(json.dumps({"error": str(e)}))
