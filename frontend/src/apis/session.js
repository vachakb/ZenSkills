import { axiosInstance } from "./commons";

/**
 * @typedef {object} TimeSlot
 * @property {string} id
 * @property {("SUNDAYS"|"MONDAYS"|"TUESDAYS"|"WEDNESDAYS"|"THURSDAYS"|"FRIDAYS"|"SATURDAYS")} day
 * @property {string} from
 * @property {string} to
 * @property {string} session_id
 * @property {MentorSession} session
 * @property {string} mentee_id
 * @property {object} mentee
 * @property {Array.<MentorSession>} sessions
 */

/**
 * @typedef {object} MentorSessionTopic
 * @property {string} id
 * @property {string} name
 * @property {Array.<MentorSession>} sessions
 */

/**
 * @typedef {object} MentorSession
 * @property {string} id
 * @property {string} description
 * @property {number} durationMinutes
 * @property {Array.<MentorSessionTopic>} topics
 * @property {Array.<TimeSlot>} timeSlots
 * @property {string} mentor_id
 * @property {object} mentor
 */

function getAllAvailableSessions() {
  return axiosInstance.get("/session");
}

function getSession(id) {
  return axiosInstance.get(`/session/${id}`);
}

function bookSession(timeSlotId) {
  return axiosInstance.post(`/session/${timeSlotId}`);
}

function createSession(sessionData) {
  return axiosInstance.post("/session", sessionData);
}

function getAllTopics() {
  return axiosInstance.get("/session/topics");
}
function deleteSession(sessionId) {
  return axiosInstance.delete(`/session/${sessionId}`);
  
}


export {
  getAllAvailableSessions,
  getSession,
  bookSession,
  createSession,
  getAllTopics,
  deleteSession,
};
