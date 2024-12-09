import { axiosInstance } from "./commons";

function getToken(roomId) {
  return axiosInstance.post("/meetings/token", { roomId });
}

function createRoom(token) {
  return axiosInstance.post("/meetings/room", { token });
}

export { getToken, createRoom };
