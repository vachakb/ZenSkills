import { axiosInstance } from "./commons";

function getAllAvailableSessions() {
  return axiosInstance.get("/session");
}

function createSession(sessionData) {
  return axiosInstance.post("/session", sessionData);
}

function getAllTopics() {
  return axiosInstance.get("/session/topics");
}

export { getAllAvailableSessions, createSession, getAllTopics };
