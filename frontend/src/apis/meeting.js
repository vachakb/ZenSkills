import { axiosInstance } from "./commons";

function getToken(roomId) {
  return axiosInstance.post("/meetings/token", { roomId });
}

function createRoom(token) {
  return axiosInstance.post("/meetings/room", { token });
}

function getAllRoomIds() {
  return axiosInstance.get("/meetings/rooms");
}

function getMeetingRecording(token, roomId) {
  return axiosInstance.get(`/meetings/recordings/${roomId}?token=${token}`);
}

function startRecording(token, roomId) {
  return axiosInstance.post("/meetings/recordings/start", { token, roomId });
}

function stopRecording(token, roomId) {
  return axiosInstance.post("/meetings/recordings/stop", { token, roomId });
}

export {
  getToken,
  createRoom,
  getAllRoomIds,
  getMeetingRecording,
  startRecording,
  stopRecording,
};
