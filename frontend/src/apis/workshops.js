import { axiosInstance } from "./commons";

function getAllWorkshops() {
  return axiosInstance.get(`/workshops`);
}

function getWorkshopById(id) {
  return axiosInstance.get(`/workshops/${id}`);
}

function bookWorkshop(workshopId, userId) {
  return axiosInstance.post(`/workshops/${workshopId}/book`, { userId });
}
function createWorkshop(workshop){
  return axiosInstance.post(`/workshops`,workshop);
}

function getUserRegisteredWorkshops (userId){
  return axiosInstance.get(`/workshops/registered/${userId}`);
};

export { getAllWorkshops, getWorkshopById, bookWorkshop,createWorkshop, getUserRegisteredWorkshops };
