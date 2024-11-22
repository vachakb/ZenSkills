import axios from "axios";
import { API_URL } from "./commons";

function getAllWorkshops() {
  return axios.get(`${API_URL}/api/workshops`);
}

function getWorkshopById(id) {
  return axios.get(`${API_URL}/api/workshops/${id}`);
}

export { getAllWorkshops, getWorkshopById };