import { axiosInstance } from "./commons";

function getAllAvailableSessions() {
  return axiosInstance.get("/session");
}

function getSession(id) {
  return axiosInstance.get(`/session/${id}`);
}

function createSession(sessionData) {
  return axiosInstance.post("/session", sessionData);
}

function getAllTopics() {
  return axiosInstance.get("/session/topics");
}

export { getAllAvailableSessions, getSession, createSession, getAllTopics };
