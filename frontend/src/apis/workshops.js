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

export { getAllWorkshops, getWorkshopById, bookWorkshop};
