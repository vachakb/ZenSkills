import { axiosInstance } from "./commons";

/**
 * @typedef {object} TimeSlot
 * @property {string} id
 * @property {("SUNDAYS"|"MONDAY"|"TUESDAY"|"WEDNESDAY"|"THURSDAY"|"FRIDAY"|"SATURDAY")} day
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

function bookSession(sessionId) {
  return axiosInstance.post(`/session/${sessionId}/book`);
}

function createSession(sessionData) {
  return axiosInstance.post("/session", sessionData);
}

function createTimeSlots(sessionData) {
  return axiosInstance.post("/session/time-slots", sessionData);
}

function getAllTopics() {
  return axiosInstance.get("/session/topics");
}
function deleteSession(sessionId) {
  return axiosInstance.delete(`/session/${sessionId}`);
}

function updateBookingStatus(bookingId, status) {
  return axiosInstance.put(`/session/${bookingId}/status`, { status });
}

export {
  getAllAvailableSessions,
  getSession,
  bookSession,
  createSession,
  createTimeSlots,
  getAllTopics,
  deleteSession,
  updateBookingStatus,
};
