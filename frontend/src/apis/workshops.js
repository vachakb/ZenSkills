import { axiosInstance } from "./commons";

function getAllWorkshops() {
  return axiosInstance.get(`/workshops`);
}

function getWorkshopById(id) {
  return axiosInstance.get(`/workshops/${id}`);
}

export { getAllWorkshops, getWorkshopById };
