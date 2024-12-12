import { axiosInstance } from "./commons";

function getAllWorkshops() {
  return axiosInstance.get(`/workshops`);
}

function getWorkshopById(id) {
  return axiosInstance.get(`/workshops/${id}`);
}

function bookWorkshop(workshopId) {
  return axiosInstance.post(`/workshops/${workshopId}/book`);
}
function createWorkshop(workshop) {
  return axiosInstance.post(`/workshops`, workshop);
}

function getUserRegisteredWorkshops(userId) {
  return axiosInstance.get(`/workshops/registered/${userId}`);
}

function setWorkshopRoomId(workshopId, roomId) {
  return axiosInstance.put(`/workshops/${workshopId}/room`, {
    room_id: roomId,
  });
}

export {
  getAllWorkshops,
  getWorkshopById,
  bookWorkshop,
  createWorkshop,
  getUserRegisteredWorkshops,
  setWorkshopRoomId,
};
