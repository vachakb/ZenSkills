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
        # Check if input tags are empty
        if not input_tags:
            logging.warning("No input tags provided")
            return []

        all_tags = list(set(fetch_all_tags().values()))
        question_list = fetch_question_data()
        
        if not all_tags or not question_list:
            logging.warning("Insufficient data to generate recommendations.")
            return []

        # Create and fit the binarizer on all possible tags first
        mlb = MultiLabelBinarizer(classes=all_tags)
        mlb.fit([all_tags])  # Fit on all possible tags
        
        # Filter out questions with empty tags
        valid_questions = [q for q in question_list if q["tags"] and any(tag for tag in q["tags"] if tag)]
        
        if not valid_questions:
            logging.warning("No valid questions with tags found.")
            return []

        # Transform both inputs using the fitted binarizer
        input_encoded = mlb.transform([input_tags])
        question_encoded = mlb.transform([q["tags"] for q in valid_questions])
        
        logging.info("Encoded input and question tags using MultiLabelBinarizer.")
        
        # Calculate cosine similarity
        cos_sim_matrix = cosine_similarity(input_encoded, question_encoded)
        similarity_scores = cos_sim_matrix[0]
        
        recommendations = []
        
        # Create recommendations with more detailed logging
        for idx, score in enumerate(similarity_scores):
            if score > 0:  # Changed threshold to include more recommendations
                recommendations.append({
                    "question_id": valid_questions[idx]["id"],
                    "question": valid_questions[idx]["question"],
                    "tags": valid_questions[idx]["tags"],
                    "score": float(score)  # Convert numpy float to Python float for JSON serialization
                })
                logging.debug(f"Added recommendation: Question ID {valid_questions[idx]['id']} with score {score}")
        
        if not recommendations:
            logging.warning("No recommendations met the similarity threshold.")
            return []

        sorted_recommendations = sorted(recommendations, key=lambda x: x["score"], reverse=True)[:top_n]
        logging.info(f"Generated {len(sorted_recommendations)} recommendations")
        return sorted_recommendations
    
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
