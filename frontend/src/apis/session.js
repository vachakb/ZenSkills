import { axiosInstance } from "./commons";

function createSession(sessionData) {
  return axiosInstance.post("/session", sessionData);
}

function getAllTopics() {
  return axiosInstance.get("/session/topics");
}

export { createSession, getAllTopics };
