import { axiosInstance } from "./commons";

function getToken(roomId) {
  return axiosInstance.post("/meetings/token", { roomId });
}

function createRoom(token) {
  return axiosInstance.post("/meetings/room", { token });
}

function startRecording(token, roomId) {
  return axiosInstance.post("/meetings/recordings/start", { token, roomId });
}

function stopRecording(token, roomId) {
  return axiosInstance.post("/meetings/recordings/stop", { token, roomId });
}

export { getToken, createRoom, startRecording, stopRecording };
