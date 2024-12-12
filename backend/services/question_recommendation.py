import psycopg2
import json
import logging
import sys
from sklearn.preprocessing import MultiLabelBinarizer
from sklearn.metrics.pairwise import cosine_similarity

# Configure logging
logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s")

# Database connection configuration
DB_CONFIG = {
    "dbname": "SIH",
    "user": "postgres",
    "password": "Ificouldfly",
    "host": "localhost",
    "port": "5432"
}

def get_interests_by_mentee_id(mentee_id: str) -> list:
    logging.info(f"Fetching interests for mentee ID: {mentee_id}")
    conn = psycopg2.connect(**DB_CONFIG)
    cursor = conn.cursor()
    try:
        query = """
        SELECT t.tag_name FROM "ZenSchema"."tags" t 
        JOIN "ZenSchema"."_MenteeTags" mt ON t.tag_id = "mt"."B" 
        JOIN "ZenSchema"."mentee" m ON "mt"."A" = m.id 
        WHERE m.id = %s
        """
        cursor.execute(query, (mentee_id,))
        interests = cursor.fetchall()
        if not interests:
            logging.warning(f"No interests found for mentee ID: {mentee_id}")
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
        SELECT t.tag_name FROM "ZenSchema"."tags" t 
        JOIN "ZenSchema"."_MentorTags" mt ON t.tag_id = "mt"."B" 
        JOIN "ZenSchema"."mentor" m ON "mt"."A" = m.id 
        WHERE m.id = %s
        """
        cursor.execute(query, (mentor_id,))
        expertise = cursor.fetchall()
        if not expertise:
            logging.warning(f"No expertise found for mentor ID: {mentor_id}")
        return [skill[0] for skill in expertise]
    except Exception as e:
        logging.error(f"Error fetching mentor expertise: {e}")
        raise
    finally:
        cursor.close()
        conn.close()

def fetch_question_data():
    """ Fetch all questions from the database. """
    logging.info("Fetching question data from the database.")
    conn = psycopg2.connect(**DB_CONFIG)
    cursor = conn.cursor()
    try:
        query = """
        SELECT q.id, q.question, ARRAY_AGG(t.tag_name) AS tags 
        FROM "ZenSchema"."CommunityQuestion" q 
        LEFT JOIN "ZenSchema"."_QuestionTags" qt ON q.id = "qt"."A" 
        LEFT JOIN "ZenSchema"."tags" t ON "qt"."B" = t.tag_id 
        GROUP BY q.id
        """
        cursor.execute(query)
        questions = cursor.fetchall()
        if not questions:
            logging.warning("No question data found.")
        return [{"id": question[0], "question": question[1], "tags": question[2]} for question in questions]
    except Exception as e:
        logging.error(f"Error fetching question data: {e}")
        raise
    finally:
        cursor.close()
        conn.close()

def fetch_all_tags():
    """ Fetch all unique tags from the database. """
    logging.info("Fetching all tags from the database.")
    conn = psycopg2.connect(**DB_CONFIG)
    cursor = conn.cursor()
    try:
        query = 'SELECT tag_id, tag_name FROM "ZenSchema"."tags"'
        cursor.execute(query)
        tag_data = cursor.fetchall()
        if not tag_data:
            logging.warning("No tags found in the database.")
            return {}
        
        return {tag_id: tag_name for tag_id, tag_name in tag_data}
    except Exception as e:
        logging.error(f"Error fetching tags: {e}")
        raise
    finally:
        cursor.close()
        conn.close()

def generate_question_recommendations(input_tags: list, top_n: int = 5):
    """ Generates question recommendations by matching input tags to questions' tags. """
    logging.info(f"Generating question recommendations for input tags: {input_tags}")
    
    try:
        all_tags = list(set(fetch_all_tags().values()))
        
        # Fetch questions from the database
        question_list = fetch_question_data()
        
        if not all_tags or not question_list:
            logging.warning("Insufficient data to generate recommendations.")
            return []

        mlb = MultiLabelBinarizer(classes=all_tags)
        
        # Encode input and questions' tags
        input_encoded = mlb.fit_transform([input_tags])
        
        # Transform the questions' tags into a binary format
        question_encoded = mlb.transform([question["tags"] for question in question_list])
        
        logging.info("Encoded input and question tags using MultiLabelBinarizer.")
        
        # Calculate cosine similarity between input and questions' tags
        cos_sim_matrix = cosine_similarity(input_encoded, question_encoded)
        
        logging.info(f"Calculated cosine similarity matrix: {cos_sim_matrix}")
        
        similarity_scores = cos_sim_matrix[0]
        
        recommendations = []
        
        # Create recommendations based on similarity scores
        for idx, score in enumerate(similarity_scores):
            if score > 0.5:  # Threshold can be adjusted as needed
                recommendations.append({
                    "question_id": question_list[idx]["id"],
                    "question": question_list[idx]["question"],
                    "score": score
                })
        
        logging.info(f"Generated recommendations: {recommendations}")
        
        return sorted(recommendations, key=lambda x: x["score"], reverse=True)[:top_n]
    
    except Exception as e:
        logging.error(f"Error generating recommendations: {e}")
        raise

if _name_ == "_main_":
    if len(sys.argv) < 3:
       print(json.dumps({"error": "Invalid usage"}))
       sys.exit(1)

    user_type = sys.argv[1]  # 'mentee' or 'mentor'
    user_id = sys.argv[2]
    
    try:
       if user_type == 'mentee':
           interests = get_interests_by_mentee_id(user_id)
           recommendations = generate_question_recommendations(interests)
           logging.info(f"Final recommendations for mentee ID {user_id}: {recommendations}")
           print(json.dumps({"recommendations": recommendations}, indent=4))
       
       elif user_type == 'mentor':
           expertise = get_expertise_by_mentor_id(user_id)
           recommendations = generate_question_recommendations(expertise)
           logging.info(f"Final recommendations for mentor ID {user_id}: {recommendations}")
           print(json.dumps({"recommendations": recommendations}, indent=4))
       
       else:
           raise ValueError("Invalid user type. Use 'mentee' or 'mentor'.")
    
    except Exception as e:
       logging.error(f"Error in main execution: {e}")
       print(json.dumps({"error":str(e)}))
